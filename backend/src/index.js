require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/auth');
const matchHistoryRoutes = require('./routes/matchHistory');
const rankingRoutes = require('./routes/ranking');
const config = require('./config');
const { joinQueue } = require('./sockets/matchmaking');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', matchHistoryRoutes);
app.use('/api', rankingRoutes);

const server = http.createServer(app);
const io = new socketio.Server(server, { cors: { origin: '*' } });

io.use((socket, next) => {
  const token = socket.handshake.auth && socket.handshake.auth.token;
  if (!token) return next(new Error('Missing token'));
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    socket.user = payload;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log('socket connected', socket.id, socket.user.username);
  socket.on('find_match', (data) => {
    const mapId = data && data.mapId ? data.mapId : undefined;
    joinQueue(socket, socket.user, io, mapId);
  });
  socket.on('input', (data) => {
    // forwarded in matchmaking room when matched
  });
  socket.on('ping_server', () => socket.emit('pong'));
});

server.listen(config.port, () => {
  console.log('Backend listening on', config.port);
});
