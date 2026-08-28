const test = require('node:test');
const assert = require('node:assert/strict');
const { asyncHandler } = require('../src/middleware/asyncHandler');

test('asyncHandler forwards rejected promises to Express error middleware', async () => {
  const expected = new Error('database unavailable');
  const wrapped = asyncHandler(async () => {
    throw expected;
  });
  const received = await new Promise((resolve) => {
    wrapped({}, {}, resolve);
  });
  assert.equal(received, expected);
});
