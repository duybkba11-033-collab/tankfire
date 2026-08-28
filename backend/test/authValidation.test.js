const test = require('node:test');
const assert = require('node:assert/strict');

process.env.DB_HOST ||= '127.0.0.1';
process.env.DB_USER ||= 'test';
process.env.DB_PASS ||= 'test';
process.env.DB_NAME ||= 'tankfire_test';
process.env.JWT_SECRET ||= 'test-secret-at-least-32-characters';

const User = require('../src/models/userModel');
const { login, register, validateCredentials } = require('../src/controllers/authController');

function response() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    }
  };
}

test('valid credentials pass registration validation', () => {
  assert.equal(validateCredentials('alpha_01', 'password123'), null);
});

test('username validation enforces the shared account policy', () => {
  assert.match(validateCredentials('<script>', 'password123'), /Username/);
  assert.match(validateCredentials('ab', 'password123'), /Username/);
});

test('password validation rejects short values', () => {
  assert.match(validateCredentials('alpha_01', 'short'), /Password/);
});

test('password validation respects bcrypt 72-byte input limit', () => {
  assert.match(validateCredentials('alpha_01', 'đ'.repeat(37)), /Password/);
});

test('auth handlers return 400 when the request has no JSON body', async () => {
  const registerResponse = response();
  const loginResponse = response();
  await register({ body: undefined }, registerResponse);
  await login({ body: undefined }, loginResponse);
  assert.equal(registerResponse.statusCode, 400);
  assert.equal(loginResponse.statusCode, 400);
});

test('concurrent duplicate registration is converted to HTTP 409', async () => {
  const originalFind = User.findByUsername;
  const originalCreate = User.createUser;
  User.findByUsername = async () => undefined;
  User.createUser = async () => {
    const error = new Error('duplicate');
    error.code = 'ER_DUP_ENTRY';
    throw error;
  };

  try {
    const res = response();
    await register({ body: { username: 'alpha_01', password: 'password123' } }, res);
    assert.equal(res.statusCode, 409);
    assert.equal(res.body.message, 'Username already exists');
  } finally {
    User.findByUsername = originalFind;
    User.createUser = originalCreate;
  }
});
