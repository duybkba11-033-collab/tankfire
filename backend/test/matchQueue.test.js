const test = require('node:test');
const assert = require('node:assert/strict');
const { createMatchQueue } = require('../src/sockets/matchQueue');

function entry(socketId, userId, mapId = 'map1') {
  return { socketId, user: { userId, username: `user_${userId}` }, mapId };
}

test('enqueue is idempotent for the same socket', () => {
  const queue = createMatchQueue();
  queue.enqueue(entry('a', 1));
  queue.enqueue(entry('a', 1));
  assert.equal(queue.size(), 1);
});

test('enqueue removes an older entry for the same user', () => {
  const queue = createMatchQueue();
  queue.enqueue(entry('old', 1));
  queue.enqueue(entry('new', 1));
  assert.deepEqual(
    queue.snapshot().map((item) => item.socketId),
    ['new']
  );
});

test('queue returns the two oldest players as a match', () => {
  const queue = createMatchQueue();
  assert.equal(queue.enqueue(entry('a', 1)), null);
  const pair = queue.enqueue(entry('b', 2));
  assert.deepEqual(
    pair.map((item) => item.socketId),
    ['a', 'b']
  );
  assert.equal(queue.size(), 0);
});

test('players choosing different maps remain in separate queues', () => {
  const queue = createMatchQueue();
  assert.equal(queue.enqueue(entry('a', 1, 'map1')), null);
  assert.equal(queue.enqueue(entry('b', 2, 'map2')), null);
  const pair = queue.enqueue(entry('c', 3, 'map1'));
  assert.deepEqual(
    pair.map((item) => item.socketId),
    ['a', 'c']
  );
  assert.equal(queue.size('map1'), 0);
  assert.equal(queue.size('map2'), 1);
});
