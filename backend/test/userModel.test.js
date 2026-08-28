const test = require('node:test');
const assert = require('node:assert/strict');

process.env.DB_HOST ||= '127.0.0.1';
process.env.DB_USER ||= 'test';
process.env.DB_PASS ||= 'test';
process.env.DB_NAME ||= 'tankfire_test';
process.env.JWT_SECRET ||= 'test-secret-at-least-32-characters';

const User = require('../src/models/userModel');

test('createUser writes the password_hash schema column', async () => {
  const calls = [];
  const connection = {
    async execute(sql, values) {
      calls.push({ sql, values });
      return [{ insertId: 42 }];
    }
  };
  const user = await User.createUser('alpha', 'hash-value', connection);
  assert.match(calls[0].sql, /password_hash/);
  assert.doesNotMatch(calls[0].sql, /\bpassword\b(?!_hash)/);
  assert.deepEqual(calls[0].values, ['alpha', 'hash-value']);
  assert.deepEqual(user, { id: 42, username: 'alpha' });
});

test('findByUsername exposes passwordHash without leaking the database column name', async () => {
  const connection = {
    async execute() {
      return [
        [
          {
            id: 7,
            username: 'bravo',
            password_hash: 'stored-hash',
            created_at: new Date('2026-01-01T00:00:00Z')
          }
        ]
      ];
    }
  };
  const user = await User.findByUsername('bravo', connection);
  assert.equal(user.passwordHash, 'stored-hash');
  assert.equal('password_hash' in user, false);
});
