const { ARENA_HEIGHT, ARENA_WIDTH } = require('./constants');

const BOOLEAN_FIELDS = ['up', 'down', 'left', 'right', 'shoot'];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function sanitizeInput(payload, previous = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const sanitized = {};

  for (const field of BOOLEAN_FIELDS) {
    sanitized[field] = source[field] === true;
  }

  const mouseX = typeof source.mouseX === 'number' ? source.mouseX : Number.NaN;
  const mouseY = typeof source.mouseY === 'number' ? source.mouseY : Number.NaN;
  sanitized.mouseX = Number.isFinite(mouseX) ? clamp(mouseX, 0, ARENA_WIDTH) : previous.mouseX;
  sanitized.mouseY = Number.isFinite(mouseY) ? clamp(mouseY, 0, ARENA_HEIGHT) : previous.mouseY;

  const seq = typeof source.seq === 'number' ? source.seq : Number.NaN;
  sanitized.seq = Number.isSafeInteger(seq) && seq >= 0 ? seq : previous.seq || 0;

  return sanitized;
}

module.exports = { sanitizeInput };
