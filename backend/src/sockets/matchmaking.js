const { Room } = require('../game/gameLoop');

const queue = [];
const rooms = new Map();

function joinQueue(socket, user, io) {
  // add to queue
  queue.push({ socket, user });
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
  // store metadata so we can persist match history later
  rooms.set(id, { room, sockets: [a.socket, b.socket], interval: null, startedAt: Date.now(), matchId: id });

  // add players
  room.addPlayer(a.socket, a.user);
  room.addPlayer(b.socket, b.user);

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
    io.to(id).emit('state', room.getStateForBroadcast());
    // check for game over
    if (room.gameOver) {
      // emit final state and game_over
      io.to(id).emit('state', room.getStateForBroadcast());
      io.to(id).emit('game_over', room.gameOverWinner);
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
        // insert into match_history
        pool.query('INSERT INTO match_history (match_id, player1_name, player2_name, winner_name, score1, score2, started_at, duration_sec) VALUES (?,?,?,?,?,?,?,?)', [matchId, player1_name, player2_name, winner_name, score1, score2, sAt, durationSec]).catch(err => console.error('persist match error', err));

        // update ranking table for both players (upsert). Use userId available in player objects.
        try {
          // helper upsert SQL: increment totals if exists, otherwise insert
          const upsertSql = `INSERT INTO ranking (user_id, username, total_score, matches_played, matches_won, last_played_at)
            VALUES (?, ?, ?, 1, ?, ?)
            ON DUPLICATE KEY UPDATE
              username = VALUES(username),
              total_score = total_score + VALUES(total_score),
              matches_played = matches_played + 1,
              matches_won = matches_won + VALUES(matches_won),
              last_played_at = VALUES(last_played_at)`;

          // player 1
          if (p1 && p1.userId) {
            const p1won = winner_name && String(winner_name) === String(player1_name) ? 1 : 0;
            pool.query(upsertSql, [p1.userId, player1_name || ('user_'+p1.userId), score1 || 0, p1won, sAt]).catch(err => console.error('ranking upsert p1 error', err));
          }

          // player 2 (may be null in some cases)
          if (p2 && p2.userId) {
            const p2won = winner_name && String(winner_name) === String(player2_name) ? 1 : 0;
            pool.query(upsertSql, [p2.userId, player2_name || ('user_'+p2.userId), score2 || 0, p2won, sAt]).catch(err => console.error('ranking upsert p2 error', err));
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
