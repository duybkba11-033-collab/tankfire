const db = require('../db');

async function createUser(username, passwordHash, connection = db) {
  const [result] = await connection.execute(
    'INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, NOW())',
    [username, passwordHash]
  );
  return { id: result.insertId, username };
}

async function findByUsername(username, connection = db) {
  const [rows] = await connection.execute(
    'SELECT id, username, password_hash, created_at FROM users WHERE username = ?',
    [username]
  );
  if (!rows[0]) return undefined;
  const { password_hash: passwordHash, ...user } = rows[0];
  return { ...user, passwordHash };
}

module.exports = { createUser, findByUsername };
