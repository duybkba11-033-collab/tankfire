const test = require('node:test');
const assert = require('node:assert/strict');
const { parsePagination } = require('../src/controllers/pagination');

test('pagination returns deterministic defaults', () => {
  assert.deepEqual(parsePagination({}), { page: 1, limit: 20, offset: 0 });
});

test('pagination calculates offset from page and limit', () => {
  assert.deepEqual(parsePagination({ page: '3', limit: '15' }), {
    page: 3,
    limit: 15,
    offset: 30
  });
});

test('pagination clamps invalid and excessive values', () => {
  assert.deepEqual(parsePagination({ page: '-4', limit: '999' }), {
    page: 1,
    limit: 100,
    offset: 0
  });
});
