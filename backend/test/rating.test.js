const test = require('node:test');
const assert = require('node:assert/strict');
const { nextRatings } = require('../src/persistence/matchPersistence');

test('equal ELO ratings exchange equal points', () => {
  assert.deepEqual(nextRatings(1000, 1000, 1), [1016, 984]);
});

test('an upset awards more rating than an expected win', () => {
  const upsetGain = nextRatings(800, 1200, 1)[0] - 800;
  const expectedGain = nextRatings(1200, 800, 1)[0] - 1200;
  assert.ok(upsetGain > expectedGain);
});
