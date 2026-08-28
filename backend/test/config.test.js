const test = require('node:test');
const assert = require('node:assert/strict');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const configPath = path.resolve(__dirname, '../src/config.js');

function loadConfig(env) {
  return spawnSync(process.execPath, ['-e', `require(${JSON.stringify(configPath)})`], {
    cwd: os.tmpdir(),
    encoding: 'utf8',
    env: { PATH: process.env.PATH, ...env }
  });
}

test('config fails fast and names every missing required variable', () => {
  const result = loadConfig({});
  assert.notEqual(result.status, 0);
  for (const name of ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME', 'JWT_SECRET']) {
    assert.match(result.stderr, new RegExp(name));
  }
});

test('config rejects an invalid server port', () => {
  const result = loadConfig({
    DB_HOST: '127.0.0.1',
    DB_USER: 'test',
    DB_PASS: '',
    DB_NAME: 'tankfire_test',
    JWT_SECRET: 'test-secret',
    PORT: 'not-a-port'
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /PORT must be an integer/);
});
