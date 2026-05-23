const db = require('../db');

async function createUser(username, hashedPassword) {
  const [result] = await db.query('INSERT INTO users (username, password, created_at) VALUES (?, ?, NOW())', [username, hashedPassword]);
  return { id: result.insertId, username };
}

async function findByUsername(username) {
  const [rows] = await db.query('SELECT id, username, password, created_at FROM users WHERE username = ?', [username]);
  return rows[0];
}

async function findById(id) {
  const [rows] = await db.query('SELECT id, username, created_at FROM users WHERE id = ?', [id]);
  return rows[0];
}

module.exports = { createUser, findByUsername, findById };
