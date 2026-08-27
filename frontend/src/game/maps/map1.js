// Map1: grid-based layout inspired by provided image (tiles 32x32)
const TILE = 32;
function rect(gx, gy, gw=1, gh=1){ return { x: gx*TILE, y: gy*TILE, w: gw*TILE, h: gh*TILE }; }

export default {
  id: 'map1',
  name: 'Ruined Outpost (Battle City style)',
  w: 800, h: 600,
  walls: [
    // outer left cluster
    rect(2,1,5,1), rect(2,2,1,3), rect(5,2,1,1), rect(3,4,4,1),
    // top center cluster
    rect(9,1,7,1), rect(9,2,1,3), rect(15,2,1,3), rect(11,3,3,1),
    // right top cluster
    rect(18,1,4,1), rect(21,2,1,3), rect(18,3,2,1),
    // center maze blocks
    rect(6,7,2,1), rect(8,6,1,3), rect(10,7,2,1), rect(13,6,1,3), rect(15,7,2,1),
    rect(4,9,3,1), rect(18,9,3,1), rect(11,9,1,4),
    // lower left wall strip
    rect(2,12,8,1), rect(2,13,1,3), rect(6,13,2,1),
    // lower right wall cluster
    rect(15,12,8,1), rect(22,9,1,4), rect(18,13,2,1),
    // small obstacles
    rect(12,2,1,1), rect(7,4,1,1), rect(17,4,1,1), rect(12,11,1,1), rect(20,6,1,1)
  ],
  grass: [
    rect(3,3,2,2), rect(13,3,2,2), rect(19,3,1,2),
    rect(7,10,3,2), rect(18,4,1,2), rect(10,12,2,2)
  ],
  rivers: [
    // a winding blue river area similar to image
    rect(14,4,1,2), rect(14,6,1,1), rect(16,6,1,1), rect(16,4,1,1), rect(12,6,1,1)
  ]
};