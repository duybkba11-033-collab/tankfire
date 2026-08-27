// Backwards-compatible shim: delegate to Item class
const Item = require('../models/Item');

function randomItem(id, mapWidth = 800, mapHeight = 600) {
  return Item.random(id, mapWidth, mapHeight).toJSON();
}

module.exports = { randomItem, Item };
