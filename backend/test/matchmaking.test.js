const test = require('node:test');
const assert = require('node:assert/strict');
const { createMatchmaking, PLAYER_STATE } = require('../src/sockets/matchmaking');

function fakeSocket(id, userId) {
  return {
    id,
    user: { userId, username: `user_${userId}` },
    connected: true,
    emitted: [],
    joined: new Set(),
    emit(event, payload) {
      this.emitted.push({ event, payload });
    },
    join(roomId) {
      this.joined.add(roomId);
    },
    leave(roomId) {
      this.joined.delete(roomId);
    }
  };
}

function harness() {
  const loops = [];
  const persisted = [];
  const manager = createMatchmaking({
    pool: {},
    loopFactory(options) {
      const loop = {
        options,
        running: false,
        start() {
          this.running = true;
        },
        stop() {
          this.running = false;
        }
      };
      loops.push(loop);
      return loop;
    },
    persist: async (pool, match) => {
      persisted.push(match);
      return true;
    },
    logger: { error() {}, warn() {} }
  });
  return { manager, loops, persisted };
}

test('matchmaking rejects a second find request from a queued socket', () => {
  const { manager } = harness();
  const socket = fakeSocket('a', 1);
  manager.register(socket);
  manager.findMatch(socket, { mapId: 'map1' });
  manager.findMatch(socket, { mapId: 'map1' });
  const state = manager.inspect();
  assert.equal(state.queue.size(), 1);
  assert.equal(state.playerState.get('a'), PLAYER_STATE.QUEUED);
  assert.equal(socket.emitted.at(-1).payload.code, 'INVALID_STATE');
});

test('disconnect removes a queued socket', () => {
  const { manager } = harness();
  const socket = fakeSocket('a', 1);
  manager.register(socket);
  manager.findMatch(socket, { mapId: 'map1' });
  manager.disconnect(socket);
  assert.equal(manager.inspect().queue.size(), 0);
  assert.equal(manager.inspect().playerState.has('a'), false);
});

test('cancel removes the queued socket and returns it to IDLE', () => {
  const { manager } = harness();
  const socket = fakeSocket('a', 1);
  manager.register(socket);
  manager.findMatch(socket, { mapId: 'map1' });
  manager.cancelMatch(socket);
  assert.equal(manager.inspect().queue.size(), 0);
  assert.equal(manager.inspect().playerState.get('a'), PLAYER_STATE.IDLE);
  assert.equal(socket.emitted.at(-1).event, 'queue_cancelled');
});

test('matching creates one room and routes both sockets to it', () => {
  const { manager, loops } = harness();
  const first = fakeSocket('a', 1);
  const second = fakeSocket('b', 2);
  manager.register(first);
  manager.register(second);
  manager.findMatch(first, { mapId: 'map1' });
  manager.findMatch(second, { mapId: 'map1' });
  const state = manager.inspect();
  assert.equal(state.sessions.size, 1);
  assert.equal(state.roomBySocket.get('a'), state.roomBySocket.get('b'));
  assert.equal(state.playerState.get('a'), PLAYER_STATE.IN_GAME);
  assert.equal(loops.length, 1);
  assert.equal(loops[0].running, true);
  const firstMatched = first.emitted.find((entry) => entry.event === 'matched').payload;
  const secondMatched = second.emitted.find((entry) => entry.event === 'matched').payload;
  assert.equal(firstMatched.yourSocketId, 'a');
  assert.equal(secondMatched.yourSocketId, 'b');
  assert.equal(firstMatched.roomId, secondMatched.roomId);
});

test('both disconnecting before the next simulation step produces DRAW without persistence', () => {
  const { manager, loops, persisted } = harness();
  const first = fakeSocket('a', 1);
  const second = fakeSocket('b', 2);
  manager.register(first);
  manager.register(second);
  manager.findMatch(first, { mapId: 'map1' });
  manager.findMatch(second, { mapId: 'map1' });
  manager.disconnect(first);
  manager.disconnect(second);
  loops[0].options.onStep(1 / 60);
  assert.equal(manager.inspect().sessions.size, 0);
  assert.equal(persisted.length, 0);
});

test('one disconnect produces ABORTED and returns the survivor to IDLE', async () => {
  const { manager, loops, persisted } = harness();
  const first = fakeSocket('a', 1);
  const second = fakeSocket('b', 2);
  manager.register(first);
  manager.register(second);
  manager.findMatch(first, { mapId: 'map1' });
  manager.findMatch(second, { mapId: 'map1' });
  manager.disconnect(first);
  loops[0].options.onStep(1 / 60);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(persisted[0].endReason, 'ABORTED');
  assert.equal(persisted[0].winner.userId, 2);
  assert.equal(manager.inspect().playerState.get('b'), PLAYER_STATE.IDLE);
});
