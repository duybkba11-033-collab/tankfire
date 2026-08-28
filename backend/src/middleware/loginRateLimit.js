const { rateLimit } = require('express-rate-limit');

const loginRateLimit = rateLimit({
  windowMs: 60_000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { message: 'Too many failed login attempts. Try again in one minute.' }
});

module.exports = { loginRateLimit };
