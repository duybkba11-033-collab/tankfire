const test = require('node:test');
const assert = require('node:assert/strict');
const { persistMatch, rebuildRanking } = require('../src/persistence/matchPersistence');

function match(endReason = 'WIN') {
  const players = [
    { userId: 1, username: 'alpha', finalScore: 200 },
    { userId: 2, username: 'bravo', finalScore: 0 }
  ];
  return {
    matchId: 'room-1',
    players,
    winner: players[0],
    endReason,
    startedAt: new Date('2026-01-01T00:00:00Z'),
    endedAt: new Date('2026-01-01T00:01:00Z'),
    durationSec: 60
  };
}

function database({ failCode } = {}) {
  const calls = [];
  const connection = {
    async beginTransaction() {
      calls.push('begin');
    },
    async execute(sql) {
      calls.push(sql);
      if (failCode && sql.includes('INSERT INTO match_history')) {
        const error = new Error('write failed');
        error.code = failCode;
        throw error;
      }
      if (sql.includes('SELECT user_id'))
        return [
          [
            { user_id: 1, rating: 1000 },
            { user_id: 2, rating: 1000 }
          ]
        ];
      return [{}];
    },
    async commit() {
      calls.push('commit');
    },
    async rollback() {
      calls.push('rollback');
    },
    release() {
      calls.push('release');
    }
  };
  return {
    calls,
    pool: {
      async getConnection() {
        calls.push('connection');
        return connection;
      }
    }
  };
}

test('DRAW is not persisted and does not acquire a connection', async () => {
  const db = database();
  assert.equal(await persistMatch(db.pool, match('DRAW')), false);
  assert.deepEqual(db.calls, []);
});

test('match history and both ELO rows commit in one transaction', async () => {
  const db = database();
  assert.equal(await persistMatch(db.pool, match()), true);
  assert.equal(
    db.calls.filter((call) => typeof call === 'string' && call.includes('INSERT INTO ranking'))
      .length,
    2
  );
  assert.ok(db.calls.indexOf('commit') < db.calls.indexOf('release'));
  assert.equal(db.calls.includes('rollback'), false);
});

test('persistence rolls back and releases the connection on failure', async () => {
  const db = database({ failCode: 'ER_BAD_FIELD_ERROR' });
  await assert.rejects(() => persistMatch(db.pool, match()), /write failed/);
  assert.ok(db.calls.indexOf('rollback') < db.calls.indexOf('release'));
});

test('duplicate match IDs are idempotent after rollback', async () => {
  const db = database({ failCode: 'ER_DUP_ENTRY' });
  assert.equal(await persistMatch(db.pool, match()), true);
  assert.ok(db.calls.includes('rollback'));
  assert.ok(db.calls.includes('release'));
});

test('ranking rebuild replays history inside one transaction', async () => {
  const calls = [];
  const inserted = [];
  const connection = {
    async beginTransaction() {
      calls.push('begin');
    },
    async query(sql) {
      calls.push(sql);
      if (sql.includes('SELECT player1_id')) {
        return [
          [
            {
              player1_id: 1,
              player2_id: 2,
              winner_id: 1,
              player1_name: 'alpha',
              player2_name: 'bravo',
              ended_at: new Date('2026-01-01T00:01:00Z')
            }
          ]
        ];
      }
      return [{}];
    },
    async execute(sql, values) {
      calls.push(sql);
      inserted.push(values);
      return [{}];
    },
    async commit() {
      calls.push('commit');
    },
    async rollback() {
      calls.push('rollback');
    },
    release() {
      calls.push('release');
    }
  };
  const pool = {
    async getConnection() {
      return connection;
    }
  };

  assert.equal(await rebuildRanking(pool), 2);
  assert.equal(calls[0], 'begin');
  assert.equal(inserted.length, 2);
  assert.equal(inserted[0][2], 1016);
  assert.equal(inserted[1][2], 984);
  assert.ok(calls.indexOf('commit') < calls.indexOf('release'));
});
