const { ARENA_HEIGHT, ARENA_WIDTH } = require('../constants');

module.exports = {
  id: 'map3',
  name: 'Grasslands',
  w: ARENA_WIDTH,
  h: ARENA_HEIGHT,
  walls: [
    { x: 320, y: 0, w: 32, h: 224 },
    { x: 448, y: 376, w: 32, h: 224 },
    { x: 352, y: 284, w: 96, h: 16 }
  ],
  grass: [
    { x: 60, y: 200, w: 220, h: 160 },
    { x: 480, y: 80, w: 260, h: 260 },
    { x: 120, y: 420, w: 160, h: 120 }
  ],
  rivers: [
    { x: 0, y: 300, w: 352, h: 60 },
    { x: 448, y: 300, w: 352, h: 60 }
  ]
};
