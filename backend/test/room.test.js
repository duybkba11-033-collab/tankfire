const test = require('node:test');
const assert = require('node:assert/strict');
const { Room } = require('../src/game/gameLoop');
const { TANK_SPEED } = require('../src/game/constants');

const emptyMap = { id: 'test', name: 'Test', w: 800, h: 600, walls: [], grass: [], rivers: [] };

function makeRoom() {
  let now = 1000;
  const room = new Room('test-room', emptyMap, { now: () => now, random: () => 0.5 });
  room.addPlayer({ socketId: 'a', userId: 1, username: 'alpha' });
  room.addPlayer({ socketId: 'b', userId: 2, username: 'bravo' });
  const players = [...room.players.values()];
  players[0].x = 100;
  players[0].y = 100;
  players[1].x = 600;
  players[1].y = 400;
  return {
    room,
    players,
    setNow: (value) => {
      now = value;
    }
  };
}

test('diagonal movement has the same speed as straight movement', () => {
  const straight = makeRoom();
  straight.room.handleInput('a', { right: true, mouseX: 0, mouseY: 0, seq: 1 });
  straight.room.update(0.5);
  const straightDistance = straight.players[0].x - 100;

  const diagonal = makeRoom();
  diagonal.room.handleInput('a', { right: true, down: true, mouseX: 0, mouseY: 0, seq: 1 });
  diagonal.room.update(0.5);
  const diagonalDistance = Math.hypot(diagonal.players[0].x - 100, diagonal.players[0].y - 100);
  assert.ok(Math.abs(straightDistance - TANK_SPEED * 0.5) < 0.001);
  assert.ok(Math.abs(diagonalDistance - straightDistance) < 0.001);
});

test('invalid bullets are removed before boundary checks', () => {
  const { room } = makeRoom();
  room.bullets.push({ x: Number.NaN, y: 20, vx: 1, vy: 1, owner: 'a', r: 4, damage: 20 });
  room.update(1 / 60);
  assert.equal(room.bullets.length, 0);
});

test('bullets leaving the arena are removed', () => {
  const { room } = makeRoom();
  room.bullets.push({ x: 799, y: 20, vx: 420, vy: 0, owner: 'a', r: 4, damage: 20 });
  room.update(1);
  assert.equal(room.bullets.length, 0);
});

test('damage never makes HP negative', () => {
  const { room, players } = makeRoom();
  room.applyDamage(players[1], 999);
  assert.equal(players[1].hp, 0);
  assert.ok(players[1].hp >= 0);
});

test('last life lost ends the match with WIN', () => {
  const { room, players } = makeRoom();
  players[1].lives = 1;
  room.applyDamage(players[1], 100);
  assert.equal(room.endReason, 'WIN');
  assert.equal(room.winner.userId, 1);
});

test('both disconnected players end the match with DRAW', () => {
  const { room } = makeRoom();
  room.markDisconnected('a');
  room.markDisconnected('b');
  room.update(1 / 60);
  assert.equal(room.endReason, 'DRAW');
  assert.equal(room.winner, null);
});

test('one disconnected player ends the match with ABORTED', () => {
  const { room } = makeRoom();
  room.markDisconnected('a');
  room.update(1 / 60);
  assert.equal(room.endReason, 'ABORTED');
  assert.equal(room.winner.userId, 2);
});

test('stale input sequence is ignored', () => {
  const { room, players } = makeRoom();
  room.handleInput('a', { right: true, mouseX: 1, mouseY: 1, seq: 10 });
  const accepted = room.handleInput('a', { left: true, mouseX: 1, mouseY: 1, seq: 9 });
  assert.equal(accepted, false);
  assert.equal(players[0].input.right, true);
});

test('duplicate input sequence cannot overwrite accepted input', () => {
  const { room, players } = makeRoom();
  assert.equal(room.handleInput('a', { right: true, seq: 1 }), true);
  assert.equal(room.handleInput('a', { left: true, seq: 1 }), false);
  assert.equal(players[0].input.right, true);
  assert.equal(players[0].input.left, false);
});
