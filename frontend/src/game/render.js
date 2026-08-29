import { calculateMovement, canOccupy } from '../../../shared/movement.mjs';
import { SPEED_BONUS_PER_LEVEL, TANK_SPEED } from './constants.js';
import { drawBullet, drawItem } from './render/ordnance.js';
import { drawTank, drawTankLabel } from './render/tank.js';
import { createTerrainRenderer } from './render/terrain.js';

const MAX_PIXEL_RATIO = 2;

function interpolateState(previous, current, alpha) {
  if (!previous || previous.roomId !== current.roomId) return current;
  const previousPlayers = new Map(previous.players.map((player) => [player.socketId, player]));
  return {
    ...current,
    players: current.players.map((player) => {
      const before = previousPlayers.get(player.socketId);
      if (!before) return player;
      return {
        ...player,
        x: before.x + (player.x - before.x) * alpha,
        y: before.y + (player.y - before.y) * alpha,
        bodyAngle: player.bodyAngle,
        turretAngle: player.turretAngle
      };
    })
  };
}

function configureCanvas(canvas, context) {
  const logicalWidth = Number(canvas.getAttribute('width'));
  const logicalHeight = Number(canvas.getAttribute('height'));
  const pixelRatio = Math.min(MAX_PIXEL_RATIO, Math.max(1, window.devicePixelRatio || 1));
  canvas.dataset.logicalWidth = String(logicalWidth);
  canvas.dataset.logicalHeight = String(logicalHeight);
  canvas.width = Math.round(logicalWidth * pixelRatio);
  canvas.height = Math.round(logicalHeight * pixelRatio);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  return { width: logicalWidth, height: logicalHeight };
}

export function createRenderer(canvas) {
  const context = canvas.getContext('2d', { alpha: false });
  const viewport = configureCanvas(canvas, context);
  const terrain = createTerrainRenderer();
  let localSocketId = null;
  let previous = null;
  let current = null;
  let receivedAt = 0;
  let snapshotInterval = 1000 / 30;
  let animationId = null;
  let latestInput = null;
  let pendingInputs = [];

  function pushState(state) {
    const now = performance.now();
    if (receivedAt) snapshotInterval = Math.min(100, Math.max(16, now - receivedAt));
    previous = current;
    current = state;
    receivedAt = now;
    const localPlayer = state.players.find((player) => player.socketId === localSocketId);
    if (localPlayer) {
      pendingInputs = pendingInputs.filter((input) => input.seq > localPlayer.lastProcessedSeq);
    }
  }

  function frame(now) {
    if (current) {
      const alpha = Math.min(1, Math.max(0, (now - receivedAt) / snapshotInterval));
      const interpolated = interpolateState(previous, current, alpha);
      const predicted = predictLocalPlayer(
        interpolated,
        localSocketId,
        pendingInputs.at(-1) || latestInput,
        Math.min(0.1, Math.max(0, now - receivedAt) / 1000)
      );
      drawScene(context, viewport, predicted, localSocketId, terrain, now / 1000);
    }
    animationId = requestAnimationFrame(frame);
  }

  return {
    start() {
      if (animationId === null) animationId = requestAnimationFrame(frame);
    },
    stop() {
      if (animationId !== null) cancelAnimationFrame(animationId);
      animationId = null;
      previous = null;
      current = null;
      latestInput = null;
      pendingInputs = [];
      terrain.reset();
      context.clearRect(0, 0, viewport.width, viewport.height);
    },
    pushState,
    recordInput(input) {
      latestInput = input;
      pendingInputs.push(input);
      if (pendingInputs.length > 120) pendingInputs.shift();
    },
    setLocalSocketId(socketId) {
      localSocketId = socketId;
    }
  };
}

function predictLocalPlayer(state, localSocketId, input, deltaSeconds) {
  if (!input || !state.map || deltaSeconds <= 0) return state;
  const playerIndex = state.players.findIndex((player) => player.socketId === localSocketId);
  if (playerIndex < 0) return state;
  const player = state.players[playerIndex];
  if (player.dead || player.eliminated) return state;

  const speed = TANK_SPEED + (player.speedLevel || 0) * SPEED_BONUS_PER_LEVEL;
  const movement = calculateMovement(input, speed, deltaSeconds);
  if (movement.angle === null) return state;
  const predicted = { ...player, bodyAngle: movement.angle };
  if (canOccupy(state.map, predicted, predicted.x + movement.dx, predicted.y)) {
    predicted.x += movement.dx;
  }
  if (canOccupy(state.map, predicted, predicted.x, predicted.y + movement.dy)) {
    predicted.y += movement.dy;
  }

  const players = state.players.slice();
  players[playerIndex] = predicted;
  return { ...state, players };
}

function drawScene(context, viewport, state, localSocketId, terrain, elapsedSeconds) {
  context.clearRect(0, 0, viewport.width, viewport.height);
  context.fillStyle = '#242b24';
  context.fillRect(0, 0, viewport.width, viewport.height);

  if (state.map) terrain.drawBase(context, state.map, elapsedSeconds);
  for (const item of state.items || []) drawItem(context, item, elapsedSeconds);
  for (const bullet of state.bullets || []) drawBullet(context, bullet);
  for (const player of state.players || []) {
    drawTank(context, player, player.socketId === localSocketId);
  }
  if (state.map) terrain.drawCanopy(context, state.map);
  for (const player of state.players || []) {
    drawTankLabel(context, player, player.socketId === localSocketId);
  }

  const vignette = context.createRadialGradient(
    viewport.width / 2,
    viewport.height / 2,
    viewport.height * 0.28,
    viewport.width / 2,
    viewport.height / 2,
    viewport.width * 0.65
  );
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, 'rgba(4, 7, 5, 0.3)');
  context.fillStyle = vignette;
  context.fillRect(0, 0, viewport.width, viewport.height);
}
