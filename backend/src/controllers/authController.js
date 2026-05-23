const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/userModel');

async function register(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Missing username or password' });
  const existing = await User.findByUsername(username);
  if (existing) return res.status(409).json({ message: 'Username already exists' });
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.createUser(username, hashed);
  res.json({ id: user.id, username: user.username });
}

async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Missing username or password' });
  const user = await User.findByUsername(username);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const payload = { userId: user.id, username: user.username };
  const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '12h' });
  res.json({ token, user: payload });
}

module.exports = { register, login };
