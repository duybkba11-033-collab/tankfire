export default {
  id: 'map3',
  name: 'Grasslands',
  w: 800, h: 600,
  walls: [
    { x: 320, y: 0, w: 20, h: 240 },
    { x: 460, y: 360, w: 20, h: 240 }
  ],
  grass: [
    // Adjusted heights so grass areas don't overlap the central river (y:300..360)
    { x: 60, y: 200, w: 220, h: 100 },
    { x: 480, y: 80, w: 260, h: 220 },
    { x: 120, y: 420, w: 160, h: 120 }
  ],
  rivers: [
    { x: 0, y: 300, w: 800, h: 60 }
  ]
};