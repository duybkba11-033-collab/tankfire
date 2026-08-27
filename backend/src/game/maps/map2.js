// Tile-based map modeled on the provided screenshot (32px tiles)
const TILE = 32;
function rect(gx, gy, gw=1, gh=1){ return { x: gx*TILE, y: gy*TILE, w: gw*TILE, h: gh*TILE }; }

module.exports = {
  id: 'map2', name: 'River Crossing (styled)', w:800, h:600,
  // outer bounds
  walls: [
    rect(0,0,40,1), rect(0,17,25,1), rect(0,0,1,18), rect(24,0,1,18),
    // inner brick clusters to form maze similar to screenshot
    rect(2,1,3,1), rect(9,1,5,1), rect(18,1,3,1),
    rect(2,3,1,3), rect(5,3,1,1), rect(7,3,1,3), rect(11,3,3,1), rect(15,3,1,3), rect(21,3,1,3),
    rect(4,6,3,1), rect(8,6,1,3), rect(11,6,2,1), rect(14,6,1,3), rect(17,6,2,1),
    rect(2,9,3,1), rect(6,8,1,3), rect(10,8,5,1), rect(17,8,1,3), rect(20,9,3,1),
    rect(3,11,2,1), rect(8,11,1,2), rect(12,11,4,1), rect(18,11,1,2), rect(21,11,2,1),
    rect(6,14,4,1), rect(12,13,1,3), rect(16,14,3,1)
  ],
  // grass/bush clusters placed to match green patches in image
  grass: [
    rect(1,2,2,3), rect(3,2,2,2), rect(19,2,2,2), rect(21,2,2,3),
    rect(1,13,3,3), rect(19,13,3,3), rect(9,4,2,2), rect(13,9,2,2)
  ],
  // rivers/water areas (blue bands)
  rivers: [
    rect(4,4,6,2), rect(14,4,6,2), // top horizontal rivers
    rect(6,10,12,2) // central horizontal river
  ]
};