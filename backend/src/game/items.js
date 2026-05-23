const ITEM_TYPES = ['heal','armor','speed','rapid','shield','multi_shot'];

function randomItem(id, mapWidth=800, mapHeight=600) {
  const type = ITEM_TYPES[Math.floor(Math.random()*ITEM_TYPES.length)];
  return {
    id,
    type,
    x: Math.floor(50 + Math.random()*(mapWidth-100)),
    y: Math.floor(50 + Math.random()*(mapHeight-100)),
    createdAt: Date.now()
  };
}

module.exports = { randomItem };
