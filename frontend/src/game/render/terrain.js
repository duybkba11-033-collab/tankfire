import { WALL_HIT_POINTS } from '../constants.js';

const GROUND_PALETTES = {
  map1: { base: '#353a31', light: '#4b4a3a', soil: '#272d27', stone: '#77705c' },
  map2: { base: '#3c4638', light: '#596047', soil: '#29342c', stone: '#82775e' },
  map3: { base: '#46513b', light: '#667054', soil: '#30382d', stone: '#8a8269' }
};

function randomUnit(seed) {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function createLayer(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function drawGround(context, map) {
  const palette = GROUND_PALETTES[map.id] || GROUND_PALETTES.map1;
  const gradient = context.createLinearGradient(0, 0, map.w, map.h);
  gradient.addColorStop(0, palette.light);
  gradient.addColorStop(0.48, palette.base);
  gradient.addColorStop(1, palette.soil);
  context.fillStyle = gradient;
  context.fillRect(0, 0, map.w, map.h);

  for (let index = 0; index < 950; index += 1) {
    const x = randomUnit(index + 11) * map.w;
    const y = randomUnit(index + 97) * map.h;
    const radius = 0.35 + randomUnit(index + 193) * 1.5;
    context.fillStyle =
      randomUnit(index + 281) > 0.72 ? `${palette.stone}55` : 'rgba(18, 22, 18, 0.12)';
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  context.save();
  context.globalAlpha = 0.08;
  context.strokeStyle = '#121612';
  context.lineWidth = 7;
  context.setLineDash([9, 8]);
  for (let lane = 0; lane < 3; lane += 1) {
    const y = 112 + lane * 176;
    context.beginPath();
    context.moveTo(-20, y);
    context.bezierCurveTo(map.w * 0.28, y + 26, map.w * 0.66, y - 32, map.w + 20, y + 8);
    context.stroke();
  }
  context.restore();
}

function drawRiverBase(context, river, seed) {
  context.save();
  context.shadowColor = 'rgba(8, 14, 12, 0.45)';
  context.shadowBlur = 8;
  context.fillStyle = '#6d644d';
  context.fillRect(river.x - 4, river.y - 4, river.w + 8, river.h + 8);
  context.restore();

  const horizontal = river.w >= river.h;
  const gradient = horizontal
    ? context.createLinearGradient(river.x, river.y, river.x, river.y + river.h)
    : context.createLinearGradient(river.x, river.y, river.x + river.w, river.y);
  gradient.addColorStop(0, '#183d45');
  gradient.addColorStop(0.5, '#2f6970');
  gradient.addColorStop(1, '#112f39');
  context.fillStyle = gradient;
  context.fillRect(river.x, river.y, river.w, river.h);

  context.fillStyle = 'rgba(189, 178, 137, 0.42)';
  const stones = Math.max(3, Math.floor((river.w + river.h) / 28));
  for (let index = 0; index < stones; index += 1) {
    const along = randomUnit(seed + index * 3);
    const side = randomUnit(seed + index * 7) > 0.5;
    const x = horizontal ? river.x + along * river.w : river.x + (side ? river.w - 2 : 2);
    const y = horizontal ? river.y + (side ? river.h - 2 : 2) : river.y + along * river.h;
    context.beginPath();
    context.ellipse(x, y, 2.5, 1.6, randomUnit(seed + index) * Math.PI, 0, Math.PI * 2);
    context.fill();
  }
}

function drawGrassUnderlay(context, area) {
  const gradient = context.createLinearGradient(area.x, area.y, area.x, area.y + area.h);
  gradient.addColorStop(0, 'rgba(37, 79, 40, 0.62)');
  gradient.addColorStop(1, 'rgba(19, 54, 30, 0.78)');
  context.fillStyle = gradient;
  context.fillRect(area.x, area.y, area.w, area.h);
}

function drawWall(context, wall) {
  const health = Math.max(0, Math.min(WALL_HIT_POINTS, wall.hp ?? WALL_HIT_POINTS));
  const damage = 1 - health / WALL_HIT_POINTS;
  context.save();
  context.shadowColor = 'rgba(8, 8, 7, 0.48)';
  context.shadowBlur = 5;
  context.shadowOffsetX = 3;
  context.shadowOffsetY = 4;
  context.fillStyle = '#35251f';
  context.fillRect(wall.x, wall.y, wall.w, wall.h);
  context.restore();

  const brickHeight = 8;
  for (let row = 0; row < Math.ceil(wall.h / brickHeight); row += 1) {
    const y = wall.y + row * brickHeight;
    const offset = row % 2 === 0 ? 0 : -8;
    for (let x = wall.x + offset; x < wall.x + wall.w; x += 16) {
      const left = Math.max(wall.x, x);
      const right = Math.min(wall.x + wall.w, x + 16);
      const shade = randomUnit(left * 3 + y * 5) > 0.5 ? '#8a5037' : '#70402f';
      context.fillStyle = shade;
      context.fillRect(
        left + 1,
        y + 1,
        Math.max(0, right - left - 2),
        Math.min(6, wall.y + wall.h - y - 1)
      );
    }
  }

  context.strokeStyle = 'rgba(29, 20, 17, 0.82)';
  context.lineWidth = 1;
  context.strokeRect(wall.x + 0.5, wall.y + 0.5, wall.w - 1, wall.h - 1);
  context.strokeStyle = 'rgba(232, 184, 126, 0.22)';
  context.beginPath();
  context.moveTo(wall.x + 1, wall.y + 1.5);
  context.lineTo(wall.x + wall.w - 1, wall.y + 1.5);
  context.stroke();

  if (damage > 0) {
    context.strokeStyle = `rgba(31, 22, 18, ${0.48 + damage * 0.4})`;
    context.lineWidth = 1.2;
    const centerX = wall.x + wall.w * (0.35 + randomUnit(wall.x + wall.y) * 0.3);
    const centerY = wall.y + wall.h * 0.45;
    for (let crack = 0; crack < Math.ceil(damage * 5); crack += 1) {
      const angle = randomUnit(wall.x + wall.y + crack * 31) * Math.PI * 2;
      context.beginPath();
      context.moveTo(centerX, centerY);
      context.lineTo(
        centerX + Math.cos(angle) * (5 + damage * 9),
        centerY + Math.sin(angle) * (5 + damage * 9)
      );
      context.stroke();
    }
  }
}

function drawGrassCanopy(context, area, seed) {
  const columns = Math.max(1, Math.floor(area.w / 11));
  const rows = Math.max(1, Math.floor(area.h / 10));
  context.lineCap = 'round';
  for (let row = 0; row <= rows; row += 1) {
    for (let column = 0; column <= columns; column += 1) {
      const key = seed + row * 101 + column * 37;
      const x = area.x + column * 11 + randomUnit(key) * 7;
      const y = area.y + row * 10 + randomUnit(key + 7) * 6;
      const height = 7 + randomUnit(key + 13) * 9;
      context.strokeStyle = randomUnit(key + 19) > 0.45 ? '#6f8f48' : '#3f713e';
      context.lineWidth = 1.4;
      context.beginPath();
      context.moveTo(x, y + 4);
      context.quadraticCurveTo(x + 1, y - height * 0.45, x + 4, y - height);
      context.stroke();
      context.strokeStyle = 'rgba(151, 171, 86, 0.72)';
      context.lineWidth = 0.8;
      context.beginPath();
      context.moveTo(x + 1, y + 3);
      context.lineTo(x - 3, y - height * 0.72);
      context.stroke();
    }
  }
}

function buildLayers(map) {
  const base = createLayer(map.w, map.h);
  const baseContext = base.getContext('2d');
  drawGround(baseContext, map);
  for (const [index, river] of (map.rivers || []).entries()) {
    drawRiverBase(baseContext, river, index * 1009 + river.x + river.y);
  }
  for (const grass of map.grass || []) drawGrassUnderlay(baseContext, grass);
  for (const wall of map.walls || []) drawWall(baseContext, wall);

  const canopy = createLayer(map.w, map.h);
  const canopyContext = canopy.getContext('2d');
  for (const [index, grass] of (map.grass || []).entries()) {
    drawGrassCanopy(canopyContext, grass, index * 409 + grass.x + grass.y);
  }
  return { base, canopy };
}

function mapCacheKey(map) {
  return `${map.id || 'map'}:${map.revision ?? 0}:${map.walls?.length || 0}:${map.w}:${map.h}`;
}

export function createTerrainRenderer() {
  let cacheKey = null;
  let layers = null;

  function ensureLayers(map) {
    const nextKey = mapCacheKey(map);
    if (nextKey !== cacheKey) {
      cacheKey = nextKey;
      layers = buildLayers(map);
    }
    return layers;
  }

  return {
    drawBase(context, map, elapsedSeconds) {
      const currentLayers = ensureLayers(map);
      context.drawImage(currentLayers.base, 0, 0);
      context.save();
      context.strokeStyle = 'rgba(184, 228, 220, 0.25)';
      context.lineWidth = 1;
      for (const [index, river] of (map.rivers || []).entries()) {
        const horizontal = river.w >= river.h;
        const lanes = Math.max(1, Math.floor((horizontal ? river.h : river.w) / 15));
        for (let lane = 0; lane < lanes; lane += 1) {
          const phase = (elapsedSeconds * 18 + lane * 13 + index * 7) % 24;
          context.beginPath();
          if (horizontal) {
            const y = river.y + ((lane + 1) * river.h) / (lanes + 1);
            context.moveTo(river.x - 20 + phase, y);
            context.lineTo(river.x + river.w, y);
          } else {
            const x = river.x + ((lane + 1) * river.w) / (lanes + 1);
            context.moveTo(x, river.y - 20 + phase);
            context.lineTo(x, river.y + river.h);
          }
          context.setLineDash([12, 12]);
          context.stroke();
        }
      }
      context.restore();
    },
    drawCanopy(context, map) {
      context.drawImage(ensureLayers(map).canopy, 0, 0);
    },
    reset() {
      cacheKey = null;
      layers = null;
    }
  };
}
