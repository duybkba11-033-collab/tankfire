import { BULLET_RADIUS } from '../constants.js';

const ITEM_STYLES = {
  heal: { color: '#d9544d', symbol: '+' },
  armor: { color: '#5da6c7', symbol: 'A' },
  speed: { color: '#d8be4d', symbol: 'S' },
  rapid: { color: '#df7845', symbol: 'R' },
  shield: { color: '#55c6c2', symbol: 'O' },
  multi_shot: { color: '#bd7fbd', symbol: '3' }
};

export function drawBullet(context, bullet) {
  const radius = Math.max(BULLET_RADIUS, 2.4);
  context.save();
  context.shadowColor = '#ffb347';
  context.shadowBlur = 13;
  const gradient = context.createRadialGradient(
    bullet.x - 1,
    bullet.y - 1,
    0,
    bullet.x,
    bullet.y,
    radius + 2
  );
  gradient.addColorStop(0, '#fff9d6');
  gradient.addColorStop(0.45, '#ffc65c');
  gradient.addColorStop(1, 'rgba(223, 92, 32, 0)');
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(bullet.x, bullet.y, radius + 2, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

export function drawItem(context, item, elapsedSeconds) {
  const style = ITEM_STYLES[item.type] || { color: '#eeeeea', symbol: '?' };
  const pulse = 1 + Math.sin(elapsedSeconds * 4 + item.x * 0.03) * 0.06;
  context.save();
  context.translate(item.x, item.y);
  context.scale(pulse, pulse);
  context.shadowColor = style.color;
  context.shadowBlur = 10;
  context.fillStyle = '#171d19';
  context.strokeStyle = style.color;
  context.lineWidth = 2;
  context.beginPath();
  context.roundRect(-10, -10, 20, 20, 3);
  context.fill();
  context.stroke();
  context.shadowBlur = 0;
  context.fillStyle = style.color;
  context.font = '800 11px Inter, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(style.symbol, 0, 0.5);
  context.restore();
}
