const test = require('node:test');
const assert = require('node:assert/strict');
const { sanitizeInput } = require('../src/game/input');

test('sanitizeInput keeps only supported fields and strict booleans', () => {
  const result = sanitizeInput({ up: true, down: 1, admin: true, mouseX: 40, mouseY: 50, seq: 2 });
  assert.deepEqual(result, {
    up: true,
    down: false,
    left: false,
    right: false,
    shoot: false,
    mouseX: 40,
    mouseY: 50,
    seq: 2
  });
});

test('sanitizeInput rejects non-numeric pointer coordinates', () => {
  const previous = { mouseX: 10, mouseY: 20, seq: 4 };
  const result = sanitizeInput({ mouseX: 'abc', mouseY: null, seq: '5' }, previous);
  assert.equal(result.mouseX, 10);
  assert.equal(result.mouseY, 20);
  assert.equal(result.seq, 4);
});

test('sanitizeInput clamps pointer coordinates to the arena', () => {
  const result = sanitizeInput({ mouseX: -10, mouseY: 9999, seq: 1 });
  assert.equal(result.mouseX, 0);
  assert.equal(result.mouseY, 600);
});
