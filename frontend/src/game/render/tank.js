import chassisUrl from '../../assets/game/tank-chassis.png';
import turretUrl from '../../assets/game/tank-turret.png';
import { MAX_ARMOR, TANK_HP } from '../constants.js';

const SPRITE_SIZE = 56;
const TEAM_COLORS = { local: '#f4c552', opponent: '#d65d4d', disabled: '#89908b' };

function loadImage(source) {
  const image = document.createElement('img');
  image.decoding = 'async';
  image.src = source;
  return image;
}

const sprites = {
  chassis: loadImage(chassisUrl),
  turret: loadImage(turretUrl)
};

function imageReady(image) {
  return image.complete && image.naturalWidth > 0;
}

function drawFallbackChassis(context) {
  context.fillStyle = '#252925';
  context.fillRect(-19, -15, 38, 8);
  context.fillRect(-19, 7, 38, 8);
  context.fillStyle = '#6e7956';
  context.beginPath();
  context.moveTo(-16, -11);
  context.lineTo(13, -10);
  context.lineTo(17, -6);
  context.lineTo(17, 6);
  context.lineTo(13, 10);
  context.lineTo(-16, 11);
  context.closePath();
  context.fill();
  context.strokeStyle = '#242a22';
  context.stroke();
}

function drawFallbackTurret(context) {
  context.fillStyle = '#4c573d';
  context.beginPath();
  context.ellipse(-1, 0, 11, 9, 0, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#394133';
  context.fillRect(5, -2.4, 27, 4.8);
  context.fillStyle = '#191c19';
  context.fillRect(29, -3, 5, 6);
}

function drawSelectionRing(context, player, color) {
  const radius = Math.max(player.w, player.h) * 0.72;
  context.save();
  context.strokeStyle = color;
  context.lineWidth = 1.5;
  context.globalAlpha = 0.9;
  context.setLineDash([4, 4]);
  context.beginPath();
  context.arc(0, 0, radius, 0, Math.PI * 2);
  context.stroke();
  context.restore();
}

export function drawTank(context, player, isLocal) {
  const centerX = player.x + player.w / 2;
  const centerY = player.y + player.h / 2;
  const teamColor = player.dead
    ? TEAM_COLORS.disabled
    : isLocal
      ? TEAM_COLORS.local
      : TEAM_COLORS.opponent;

  context.save();
  context.translate(centerX, centerY);
  context.globalAlpha = player.hidden && isLocal ? 0.52 : player.dead ? 0.58 : 1;
  context.shadowColor = 'rgba(5, 8, 6, 0.72)';
  context.shadowBlur = 6;
  context.shadowOffsetX = 3;
  context.shadowOffsetY = 4;
  drawSelectionRing(context, player, teamColor);

  context.save();
  context.rotate(player.bodyAngle || 0);
  if (imageReady(sprites.chassis)) {
    context.drawImage(
      sprites.chassis,
      -SPRITE_SIZE / 2,
      -SPRITE_SIZE / 2,
      SPRITE_SIZE,
      SPRITE_SIZE
    );
  } else {
    drawFallbackChassis(context);
  }
  context.fillStyle = teamColor;
  context.globalAlpha = 0.9;
  context.fillRect(-14, -1, 7, 2);
  context.restore();

  context.shadowBlur = 4;
  context.save();
  context.rotate(player.turretAngle || 0);
  if (imageReady(sprites.turret)) {
    const turretPivotX = SPRITE_SIZE * 0.42;
    context.drawImage(sprites.turret, -turretPivotX, -SPRITE_SIZE / 2, SPRITE_SIZE, SPRITE_SIZE);
  } else {
    drawFallbackTurret(context);
  }
  context.restore();
  context.restore();

  if (player.shieldActive) {
    const gradient = context.createRadialGradient(centerX, centerY, 16, centerX, centerY, 26);
    gradient.addColorStop(0, 'rgba(84, 213, 225, 0)');
    gradient.addColorStop(0.82, 'rgba(84, 213, 225, 0.08)');
    gradient.addColorStop(1, 'rgba(118, 231, 239, 0.72)');
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(centerX, centerY, 26, 0, Math.PI * 2);
    context.fill();
  }
}

function drawStatusBars(context, player) {
  const width = 38;
  const x = player.x + player.w / 2 - width / 2;
  const y = player.y - 17;
  const armorRatio = Math.max(0, Math.min(1, player.armor / MAX_ARMOR));
  const healthRatio = Math.max(0, Math.min(1, player.hp / TANK_HP));
  context.fillStyle = 'rgba(6, 9, 7, 0.78)';
  context.fillRect(x - 1, y - 1, width + 2, 8);
  context.fillStyle = healthRatio > 0.35 ? '#6fc36f' : '#e45f52';
  context.fillRect(x, y, width * healthRatio, 3);
  context.fillStyle = '#72b7d4';
  context.fillRect(x, y + 4, width * armorRatio, 2);
}

export function drawTankLabel(context, player, isLocal) {
  const centerX = player.x + player.w / 2;
  drawStatusBars(context, player);
  context.save();
  context.font = isLocal ? '700 10px Inter, sans-serif' : '600 10px Inter, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'top';
  context.lineWidth = 3;
  context.strokeStyle = 'rgba(8, 10, 8, 0.86)';
  context.strokeText(player.username, centerX, player.y + player.h + 14);
  context.fillStyle = isLocal ? TEAM_COLORS.local : '#f2f2e9';
  context.fillText(player.username, centerX, player.y + player.h + 14);

  if (isLocal) {
    context.fillStyle = TEAM_COLORS.local;
    context.beginPath();
    context.moveTo(centerX, player.y - 21);
    context.lineTo(centerX - 5, player.y - 28);
    context.lineTo(centerX + 5, player.y - 28);
    context.closePath();
    context.fill();
  }
  context.restore();
}
