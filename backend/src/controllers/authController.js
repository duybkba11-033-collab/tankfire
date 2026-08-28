const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/userModel');

const USERNAME_PATTERN = /^[A-Za-z0-9_]{3,20}$/;

function validateCredentials(username, password) {
  if (!USERNAME_PATTERN.test(username || '')) {
    return 'Username must be 3-20 characters and contain only letters, numbers, or underscores';
  }
  if (
    typeof password !== 'string' ||
    password.length < 8 ||
    Buffer.byteLength(password, 'utf8') > 72
  ) {
    return 'Password must be 8-72 bytes';
  }
  return null;
}

async function register(req, res) {
  const { username, password } = req.body || {};
  const validationError = validateCredentials(username, password);
  if (validationError) return res.status(400).json({ message: validationError });
  const existing = await User.findByUsername(username);
  if (existing) return res.status(409).json({ message: 'Username already exists' });
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const user = await User.createUser(username, passwordHash);
    return res.status(201).json({ id: user.id, username: user.username });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Username already exists' });
    }
    throw error;
  }
}

async function login(req, res) {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  const user = await User.findByUsername(username);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const payload = { userId: user.id, username: user.username };
  const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '12h' });
  return res.json({ token, user: payload });
}

module.exports = { login, register, validateCredentials };
