const http = require('node:http');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const config = require('./config');
const pool = require('./db');
const authRoutes = require('./routes/auth');
const matchHistoryRoutes = require('./routes/matchHistory');
const rankingRoutes = require('./routes/ranking');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { asyncHandler } = require('./middleware/asyncHandler');
const { createMatchmaking } = require('./sockets/matchmaking');

function isAllowedOrigin(origin) {
  return !origin || config.allowedOrigins.includes(origin);
}

const app = express();
app.disable('x-powered-by');
if (config.trustProxy) app.set('trust proxy', 1);
app.use(helmet({ strictTransportSecurity: config.isProduction ? undefined : false }));
app.use(cors({ origin: (origin, callback) => callback(null, isAllowedOrigin(origin)) }));
app.use(express.json({ limit: '16kb' }));
app.get(
  '/api/health',
  asyncHandler(async (req, res) => {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  })
);
app.use('/api', authRoutes);
app.use('/api', matchHistoryRoutes);
app.use('/api', rankingRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: config.allowedOrigins },
  maxHttpBufferSize: 16 * 1024,
  serveClient: false
});
const matchmaking = createMatchmaking({ pool });

io.use((socket, next) => {
  const token = socket.handshake.auth && socket.handshake.auth.token;
  if (!token) return next(new Error('Missing token'));
  try {
    socket.user = jwt.verify(token, config.jwtSecret);
    return next();
  } catch {
    return next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  matchmaking.register(socket);
  socket.on('find_match', (payload) => matchmaking.findMatch(socket, payload));
  socket.on('cancel_match', () => matchmaking.cancelMatch(socket));
  socket.on('input', (payload) => matchmaking.handleInput(socket, payload));
  socket.on('disconnect', () => matchmaking.disconnect(socket));
});

server.listen(config.port, () => {
  console.log(`Backend listening on http://localhost:${config.port}`);
});

async function shutdown(signal) {
  console.log(`${signal} received, shutting down`);
  matchmaking.stop();
  io.close();
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
