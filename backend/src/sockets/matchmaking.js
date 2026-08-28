const { randomUUID } = require('node:crypto');
const { Room } = require('../game/gameLoop');
const { BROADCAST_HZ, INPUT_HZ, SIMULATION_HZ } = require('../game/constants');
const { FixedStepLoop } = require('../game/fixedStepLoop');
const { persistMatch } = require('../persistence/matchPersistence');
const { createMatchQueue } = require('./matchQueue');
const map1 = require('../game/maps/map1');
const map2 = require('../game/maps/map2');
const map3 = require('../game/maps/map3');

const PLAYER_STATE = Object.freeze({ IDLE: 'IDLE', QUEUED: 'QUEUED', IN_GAME: 'IN_GAME' });
const MAPS = new Map([map1, map2, map3].map((map) => [map.id, map]));

function createMatchmaking({
  pool,
  logger = console,
  loopFactory = (options) => new FixedStepLoop(options),
  persist = persistMatch
}) {
  const queue = createMatchQueue();
  const playerState = new Map();
  const roomBySocket = new Map();
  const sockets = new Map();
  const sessions = new Map();
  const lastInputAt = new Map();

  function register(socket) {
    sockets.set(socket.id, socket);
    playerState.set(socket.id, PLAYER_STATE.IDLE);
  }

  function findMatch(socket, payload = {}) {
    if (playerState.get(socket.id) !== PLAYER_STATE.IDLE) {
      socket.emit('matchmaking_error', { code: 'INVALID_STATE' });
      return;
    }

    const activeSocket = [...sockets.values()].find(
      (candidate) =>
        candidate.id !== socket.id &&
        candidate.user.userId === socket.user.userId &&
        playerState.get(candidate.id) !== PLAYER_STATE.IDLE
    );
    if (activeSocket) {
      socket.emit('matchmaking_error', { code: 'ALREADY_ACTIVE' });
      return;
    }

    const mapId = MAPS.has(payload.mapId) ? payload.mapId : map1.id;
    playerState.set(socket.id, PLAYER_STATE.QUEUED);
    const pair = queue.enqueue({ socketId: socket.id, user: socket.user, mapId });
    socket.emit('queue_joined', { mapId, position: queue.size(mapId) });
    if (pair) createRoom(pair);
  }

  function cancelMatch(socket) {
    if (playerState.get(socket.id) !== PLAYER_STATE.QUEUED) return;
    queue.removeBySocketId(socket.id);
    playerState.set(socket.id, PLAYER_STATE.IDLE);
    socket.emit('queue_cancelled');
  }

  function handleInput(socket, payload) {
    if (playerState.get(socket.id) !== PLAYER_STATE.IN_GAME) return;
    const now = Date.now();
    if (now - (lastInputAt.get(socket.id) || 0) < 1000 / (INPUT_HZ * 2)) return;
    lastInputAt.set(socket.id, now);
    const session = sessions.get(roomBySocket.get(socket.id));
    if (session) session.room.handleInput(socket.id, payload);
  }

  function disconnect(socket) {
    queue.removeBySocketId(socket.id);
    const roomId = roomBySocket.get(socket.id);
    const session = roomId ? sessions.get(roomId) : null;
    if (session) session.room.markDisconnected(socket.id);
    playerState.delete(socket.id);
    sockets.delete(socket.id);
    lastInputAt.delete(socket.id);
  }

  function createRoom(pair) {
    const [first, second] = pair;
    const firstSocket = sockets.get(first.socketId);
    const secondSocket = sockets.get(second.socketId);
    if (!firstSocket || !secondSocket || !firstSocket.connected || !secondSocket.connected) {
      for (const entry of pair) {
        const activeSocket = sockets.get(entry.socketId);
        if (activeSocket && activeSocket.connected) {
          playerState.set(entry.socketId, PLAYER_STATE.IDLE);
          activeSocket.emit('matchmaking_error', { code: 'OPPONENT_UNAVAILABLE' });
        }
      }
      return;
    }

    const roomId = `room-${randomUUID()}`;
    const selectedMap = MAPS.get(first.mapId) || map1;
    const room = new Room(roomId, selectedMap);
    room.addPlayer({ socketId: first.socketId, ...first.user });
    room.addPlayer({ socketId: second.socketId, ...second.user });
    room.placePlayersOpposite();

    const session = {
      room,
      sockets: [firstSocket, secondSocket],
      startedAt: new Date(),
      finishing: false,
      mapRevisionBySocket: new Map(),
      loop: null
    };
    sessions.set(roomId, session);

    for (const socket of session.sockets) {
      playerState.set(socket.id, PLAYER_STATE.IN_GAME);
      roomBySocket.set(socket.id, roomId);
      socket.join(roomId);
      session.mapRevisionBySocket.set(socket.id, room.mapRevision);
      const opponent = session.sockets.find((candidate) => candidate.id !== socket.id);
      socket.emit('matched', {
        roomId,
        yourSocketId: socket.id,
        opponentName: opponent.user.username,
        map: room.getMapSnapshot()
      });
    }

    session.loop = loopFactory({
      stepHz: SIMULATION_HZ,
      broadcastHz: BROADCAST_HZ,
      onStep: (deltaSeconds) => {
        room.update(deltaSeconds);
        if (room.gameOver) finishSession(roomId);
      },
      onBroadcast: () => broadcast(session)
    });
    session.loop.start();
  }

  function broadcast(session) {
    for (const socket of session.sockets) {
      if (!socket.connected) continue;
      const state = session.room.getStateFor(socket.id, session.mapRevisionBySocket.get(socket.id));
      socket.emit('state', state);
      session.mapRevisionBySocket.set(socket.id, session.room.mapRevision);
    }
  }

  async function finishSession(roomId) {
    const session = sessions.get(roomId);
    if (!session || session.finishing) return;
    session.finishing = true;
    session.loop.stop();
    broadcast(session);

    const endedAt = new Date();
    for (const socket of session.sockets) {
      roomBySocket.delete(socket.id);
      lastInputAt.delete(socket.id);
      if (socket.connected) {
        playerState.set(socket.id, PLAYER_STATE.IDLE);
        socket.leave(roomId);
        socket.emit('game_over', {
          endReason: session.room.endReason,
          winner: session.room.winner,
          players: session.room.getParticipants()
        });
      }
    }
    sessions.delete(roomId);

    if (session.room.endReason === 'DRAW') return;
    try {
      await persistWithRetry(persist, pool, {
        matchId: roomId,
        players: session.room.getParticipants(),
        winner: session.room.winner,
        endReason: session.room.endReason,
        startedAt: session.startedAt,
        endedAt,
        durationSec: Math.max(0, Math.round((endedAt - session.startedAt) / 1000))
      });
    } catch (error) {
      logger.error('Failed to persist match transaction after retries', { roomId, error });
    }
  }

  async function persistWithRetry(persistFn, databasePool, match) {
    const transientErrors = new Set([
      'ECONNRESET',
      'ETIMEDOUT',
      'ER_LOCK_DEADLOCK',
      'ER_LOCK_WAIT_TIMEOUT'
    ]);
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        return await persistFn(databasePool, match);
      } catch (error) {
        if (!transientErrors.has(error.code) || attempt === 3) throw error;
        logger.warn('Transient match persistence failure; retrying', {
          matchId: match.matchId,
          attempt,
          code: error.code
        });
        await new Promise((resolve) => setTimeout(resolve, attempt * 100));
      }
    }
  }

  function stop() {
    for (const session of sessions.values()) session.loop.stop();
    sessions.clear();
  }

  return {
    register,
    findMatch,
    cancelMatch,
    handleInput,
    disconnect,
    stop,
    inspect: () => ({ queue, playerState, roomBySocket, sessions })
  };
}

module.exports = { createMatchmaking, PLAYER_STATE };
