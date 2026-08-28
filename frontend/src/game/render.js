import {
  BULLET_RADIUS,
  MAX_ARMOR,
  SPEED_BONUS_PER_LEVEL,
  TANK_HP,
  TANK_SIZE,
  TANK_SPEED,
  WALL_HIT_POINTS
} from './constants.js';
import { calculateMovement, canOccupy } from '../../../shared/movement.mjs';

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

export function createRenderer(canvas) {
  const context = canvas.getContext('2d');
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
      drawScene(context, canvas, predicted, localSocketId);
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
      context.clearRect(0, 0, canvas.width, canvas.height);
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
  if (canOccupy(state.map, predicted, predicted.x + movement.dx, predicted.y))
    predicted.x += movement.dx;
  if (canOccupy(state.map, predicted, predicted.x, predicted.y + movement.dy))
    predicted.y += movement.dy;

  const players = state.players.slice();
  players[playerIndex] = predicted;
  return { ...state, players };
}

function drawScene(context, canvas, state, localSocketId) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#182019';
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawGrid(context, canvas);
  drawMap(context, state.map || {});
  for (const item of state.items || []) drawItem(context, item);
  for (const bullet of state.bullets || []) drawBullet(context, bullet);
  for (const player of state.players || [])
    drawTank(context, player, player.socketId === localSocketId);
}

function drawGrid(context, canvas) {
  context.strokeStyle = 'rgba(255,255,255,0.025)';
  context.lineWidth = 1;
  for (let x = 0; x <= canvas.width; x += TANK_SIZE) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
    context.stroke();
  }
  for (let y = 0; y <= canvas.height; y += TANK_SIZE) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(canvas.width, y);
    context.stroke();
  }
}

function drawMap(context, map) {
  for (const river of map.rivers || []) {
    const gradient = context.createLinearGradient(river.x, river.y, river.x, river.y + river.h);
    gradient.addColorStop(0, '#287c8e');
    gradient.addColorStop(1, '#174d63');
    context.fillStyle = gradient;
    context.fillRect(river.x, river.y, river.w, river.h);
    context.strokeStyle = 'rgba(195,240,255,0.2)';
    for (let y = river.y + 10; y < river.y + river.h; y += 16) {
      context.beginPath();
      context.moveTo(river.x, y);
      context.lineTo(river.x + river.w, y);
      context.stroke();
    }
  }

  for (const grass of map.grass || []) {
    context.fillStyle = 'rgba(48, 112, 63, 0.72)';
    context.fillRect(grass.x, grass.y, grass.w, grass.h);
    context.strokeStyle = 'rgba(146, 199, 111, 0.35)';
    for (let x = grass.x + 8; x < grass.x + grass.w; x += 14) {
      context.beginPath();
      context.moveTo(x, grass.y + grass.h);
      context.lineTo(x + 4, grass.y + grass.h - 12);
      context.stroke();
    }
  }

  for (const wall of map.walls || []) {
    const health = Math.max(0, Math.min(WALL_HIT_POINTS, wall.hp || WALL_HIT_POINTS));
    context.fillStyle =
      health === WALL_HIT_POINTS
        ? '#8e5d38'
        : health === WALL_HIT_POINTS - 1
          ? '#785038'
          : '#62453a';
    context.fillRect(wall.x, wall.y, wall.w, wall.h);
    context.strokeStyle = '#3b2a22';
    context.strokeRect(wall.x + 0.5, wall.y + 0.5, wall.w - 1, wall.h - 1);
    context.strokeStyle = 'rgba(255,255,255,0.1)';
    for (let y = wall.y + 10; y < wall.y + wall.h; y += 10) {
      context.beginPath();
      context.moveTo(wall.x, y);
      context.lineTo(wall.x + wall.w, y);
      context.stroke();
    }
  }
}

function drawBullet(context, bullet) {
  context.save();
  context.shadowColor = '#ffc45c';
  context.shadowBlur = 10;
  context.fillStyle = '#ffd37a';
  context.beginPath();
  context.arc(bullet.x, bullet.y, BULLET_RADIUS, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawItem(context, item) {
  const colors = {
    heal: '#e45757',
    armor: '#58a6d9',
    speed: '#d788e8',
    rapid: '#f4b860',
    shield: '#4dd6d6',
    multi_shot: '#f08a4b'
  };
  const labels = { heal: '+', armor: 'A', speed: 'S', rapid: 'R', shield: 'O', multi_shot: '3' };
  context.save();
  context.translate(item.x, item.y);
  context.fillStyle = colors[item.type] || '#ffffff';
  context.beginPath();
  context.arc(0, 0, 11, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#101515';
  context.font = '700 12px Inter, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(labels[item.type] || '?', 0, 1);
  context.restore();
}

function drawTank(context, player, isLocal) {
  const centerX = player.x + player.w / 2;
  const centerY = player.y + player.h / 2;
  const bodyColor = player.dead ? '#555b58' : isLocal ? '#f2c14e' : '#50a878';
  const turretColor = player.dead ? '#454a47' : isLocal ? '#d99b24' : '#2f7855';

  context.save();
  context.translate(centerX, centerY);
  context.globalAlpha = player.hidden && isLocal ? 0.45 : 1;
  context.rotate(player.bodyAngle || 0);
  context.fillStyle = '#202725';
  context.fillRect(-18, -15, 36, 8);
  context.fillRect(-18, 7, 36, 8);
  context.fillStyle = bodyColor;
  context.fillRect(-14, -11, 28, 22);
  context.strokeStyle = '#111715';
  context.lineWidth = 2;
  context.strokeRect(-14, -11, 28, 22);
  context.restore();

  context.save();
  context.translate(centerX, centerY);
  context.rotate(player.turretAngle || 0);
  context.fillStyle = '#9aa3a0';
  context.fillRect(0, -3, 23, 6);
  context.fillStyle = turretColor;
  context.beginPath();
  context.arc(0, 0, 10, 0, Math.PI * 2);
  context.fill();
  context.restore();

  if (player.shieldActive) {
    context.strokeStyle = '#50d8e8';
    context.lineWidth = 3;
    context.beginPath();
    context.arc(centerX, centerY, 25, 0, Math.PI * 2);
    context.stroke();
  }

  drawStatusBars(context, player);
  context.font = isLocal ? '700 11px Inter, sans-serif' : '600 11px Inter, sans-serif';
  context.textAlign = 'center';
  context.fillStyle = isLocal ? '#ffd66b' : '#ffffff';
  context.fillText(
    isLocal ? `YOU - ${player.username}` : player.username,
    centerX,
    player.y + player.h + 17
  );

  if (isLocal) {
    context.fillStyle = '#ffd66b';
    context.beginPath();
    context.moveTo(centerX, player.y - 17);
    context.lineTo(centerX - 6, player.y - 26);
    context.lineTo(centerX + 6, player.y - 26);
    context.closePath();
    context.fill();
  }
}

function drawStatusBars(context, player) {
  const width = player.w;
  context.fillStyle = 'rgba(0,0,0,0.55)';
  context.fillRect(player.x, player.y - 12, width, 4);
  context.fillRect(player.x, player.y - 6, width, 5);
  context.fillStyle = '#84b9d6';
  context.fillRect(player.x, player.y - 12, width * (player.armor / MAX_ARMOR), 4);
  context.fillStyle = player.hp > 35 ? '#62bf6e' : '#e75b52';
  context.fillRect(player.x, player.y - 6, width * (player.hp / TANK_HP), 5);
}
