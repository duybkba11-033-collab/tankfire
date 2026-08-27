const { Room } = require('../game/gameLoop');
const MapClass = require('../models/Map');
const MatchRecord = require('../models/MatchRecord');
const RankingModel = require('../models/RankingModel');
const map1 = require('../game/maps/map1');
const map2 = require('../game/maps/map2');
const map3 = require('../game/maps/map3');

const queue = [];
const rooms = new Map();

function joinQueue(socket, user, io, mapId) {
  // ignore duplicate enqueue for the same socket
  if (queue.find(q => q && q.socket && q.socket.id === socket.id)) {
    console.log('joinQueue: socket already in queue', socket.id);
    return;
  }
  // add to queue with selected mapId
  queue.push({ socket, user, mapId });
  console.log('joinQueue:', user.username, 'mapId=', mapId, 'queueLen=', queue.length);
  tryMatch(io);
}

function tryMatch(io) {
  while (queue.length >= 2) {
    const a = queue.shift();
    const b = queue.shift();
    createRoom(a, b, io);
  }
}

function createRoom(a, b, io) {
  const id = `room-${Date.now()}-${Math.floor(Math.random()*1000)}`;
  const room = new Room(id);
  // determine map
  const selMapId = a.mapId || b.mapId || 'map1';
  let mapObj = { w:800, h:600, walls:[], grass:[], rivers:[] };
  if (selMapId === 'map2') mapObj = map2;
  else if (selMapId === 'map3') mapObj = map3;
  else mapObj = map1;
  room.map = new MapClass(mapObj);
  // expand rectangular walls into tile bricks for per-tile damage
  try { if (typeof room._expandWallsToTiles === 'function') room._expandWallsToTiles(32); } catch (e) { }
  console.log('createRoom:', id, 'map=', room.map.id, 'players=', a.user.username, b.user.username);
  // store metadata so we can persist match history later
  rooms.set(id, { room, sockets: [a.socket, b.socket], interval: null, startedAt: Date.now(), matchId: id });

  // add players
  room.addPlayer(a.socket, a.user);
  room.addPlayer(b.socket, b.user);

  // place the two players on opposite sides of the map
  try {
    const pA = room.players[a.socket.id];
    const pB = room.players[b.socket.id];
    // attempt to find a spawn for A and mirror for B
    let placed = false;
    for (let tries = 0; tries < 60 && !placed; tries++) {
      const pos = room._randomSpawnPos();
      const bboxA = { x: pos.x, y: pos.y, w: pA.w, h: pA.h };
      if (room.isBlockedArea(bboxA)) continue;
      // mirror position for B
      const mirrorX = Math.max(0, Math.min(room.map.w - pB.w, room.map.w - pos.x - pB.w));
      const mirrorY = Math.max(0, Math.min(room.map.h - pB.h, room.map.h - pos.y - pB.h));
      const bboxB = { x: mirrorX, y: mirrorY, w: pB.w, h: pB.h };
      if (!room.isBlockedArea(bboxB)) {
        pA.x = bboxA.x; pA.y = bboxA.y;
        pB.x = bboxB.x; pB.y = bboxB.y;
        pA.bodyAngle = 0; pB.bodyAngle = 0;
        placed = true;
        break;
      }
      // try mirroring only X or only Y
      const bboxBX = { x: mirrorX, y: pos.y, w: pB.w, h: pB.h };
      const bboxBY = { x: pos.x, y: mirrorY, w: pB.w, h: pB.h };
      if (!room.isBlockedArea(bboxBX)) {
        pA.x = bboxA.x; pA.y = bboxA.y; pB.x = bboxBX.x; pB.y = bboxBX.y; pA.bodyAngle = 0; pB.bodyAngle = 0; placed = true; break;
      }
      if (!room.isBlockedArea(bboxBY)) {
        pA.x = bboxA.x; pA.y = bboxA.y; pB.x = bboxBY.x; pB.y = bboxBY.y; pA.bodyAngle = 0; pB.bodyAngle = 0; placed = true; break;
      }
    }
    if (!placed) {
      // fallback to default respawn logic (may re-pick safe spots)
      room.respawnPlayer(pA);
      room.respawnPlayer(pB);
    }
  } catch (err) {
    console.error('spawn opposite error', err);
  }

  a.socket.join(id);
  b.socket.join(id);

  // attach socket listeners
  [a.socket, b.socket].forEach(s => {
    s.emit('matched', { roomId: id });
    s.on('input', (data) => { room.handleInput(s.id, data); });
    s.on('disconnect', () => {
      // leave and cleanup
      room.removePlayer(s.id);
    });
  });

  // start loop
  const tickMs = 1000/60;
  const interval = setInterval(()=>{
    room.update();
    const meta = rooms.get(id) || {};
    const socketsList = (meta.sockets || []).slice();
    // emit per-socket personalized state so hidden players/actions are not revealed
    for (const s of socketsList) {
      try {
        if (s && s.connected) s.emit('state', room.getStateForBroadcastFor(s.id));
      } catch (err) { /* ignore per-socket emit errors */ }
    }
    // check for game over
    if (room.gameOver) {
      // emit final personalized state and game_over
      for (const s of socketsList) {
        try { if (s && s.connected) { s.emit('state', room.getStateForBroadcastFor(s.id)); s.emit('game_over', room.gameOverWinner); } } catch (err) {}
      }
      // persist match history into DB (if pool available)
      try {
        const pool = require('../db');
        const meta = rooms.get(id) || {};
        const sAt = new Date(meta.startedAt || Date.now());
        const eAt = new Date();
        const durationSec = Math.max(0, Math.round((eAt.getTime() - (meta.startedAt||eAt.getTime()))/1000));
        // determine player1/player2 in the order sockets were added
        const socketOrder = meta.sockets || [];
        const p1Socket = socketOrder[0] && socketOrder[0].id ? socketOrder[0].id : null;
        const p2Socket = socketOrder[1] && socketOrder[1].id ? socketOrder[1].id : null;
        const p1 = p1Socket ? room.players[p1Socket] : Object.values(room.players)[0];
        const p2 = p2Socket ? room.players[p2Socket] : Object.values(room.players)[1] || null;
        const player1_name = p1 ? p1.username : null;
        const player2_name = p2 ? p2.username : null;
        const score1 = p1 ? (typeof p1.finalScore === 'number' ? p1.finalScore : ( (p1.lives||0)*100 + Math.max(0, Math.floor(p1.hp||0)) )) : 0;
        const score2 = p2 ? (typeof p2.finalScore === 'number' ? p2.finalScore : ( (p2.lives||0)*100 + Math.max(0, Math.floor(p2.hp||0)) )) : 0;
        const winner_name = room.gameOverWinner ? room.gameOverWinner.username : null;
        const matchId = meta.matchId || id;
        // insert into match_history via MatchRecord
        try {
          const rec = new MatchRecord({ matchId, player1_name, player2_name, winner_name, score1, score2, startedAt: sAt, durationSec });
          rec.persist(pool).catch(err => console.error('persist match error', err));
        } catch (err) {
          console.error('persist match error', err);
        }

        // update ranking table for both players using RankingModel
        try {
          if (p1 && p1.userId) {
            const p1won = winner_name && String(winner_name) === String(player1_name) ? 1 : 0;
            const r1 = new RankingModel({ userId: p1.userId, username: player1_name || ('user_'+p1.userId), totalScore: score1 || 0, matchesWon: p1won, lastPlayedAt: sAt });
            r1.upsert(pool).catch(err => console.error('ranking upsert p1 error', err));
          }

          if (p2 && p2.userId) {
            const p2won = winner_name && String(winner_name) === String(player2_name) ? 1 : 0;
            const r2 = new RankingModel({ userId: p2.userId, username: player2_name || ('user_'+p2.userId), totalScore: score2 || 0, matchesWon: p2won, lastPlayedAt: sAt });
            r2.upsert(pool).catch(err => console.error('ranking upsert p2 error', err));
          }
        } catch (err) {
          console.error('persist ranking error', err);
        }
      } catch (err) {
        console.error('persist match error top', err);
      }
      // cleanup room
      clearInterval(interval);
      rooms.delete(id);
      // optionally disconnect sockets or leave room
      return;
    }
    // cleanup if no players
    if (Object.keys(room.players).length === 0) {
      clearInterval(interval);
      rooms.delete(id);
    }
  }, tickMs);

  rooms.get(id).interval = interval;
}

module.exports = { joinQueue, rooms };
