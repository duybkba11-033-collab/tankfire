const test = require('node:test');
const assert = require('node:assert/strict');
const { circleRect, rectRect } = require('../src/game/collision');

test('circleRect detects a collision at a rectangle corner', () => {
  assert.equal(circleRect({ x: 11, y: 11, r: 2 }, { x: 0, y: 0, w: 10, h: 10 }), true);
});

test('circleRect treats exact edge contact as collision', () => {
  assert.equal(circleRect({ x: 12, y: 5, r: 2 }, { x: 0, y: 0, w: 10, h: 10 }), true);
});

test('circleRect rejects separated shapes', () => {
  assert.equal(circleRect({ x: 20, y: 20, r: 2 }, { x: 0, y: 0, w: 10, h: 10 }), false);
});

test('rectRect detects overlapping rectangles', () => {
  assert.equal(rectRect({ x: 0, y: 0, w: 10, h: 10 }, { x: 5, y: 5, w: 3, h: 3 }), true);
});
