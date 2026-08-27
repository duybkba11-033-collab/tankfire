const ITEM_TYPES = ['heal','armor','speed','rapid','shield','multi_shot'];

class Item {
  constructor({ id, type, x, y, createdAt }) {
    this.id = id;
    this.type = type;
    this.x = x;
    this.y = y;
    this.createdAt = createdAt || Date.now();
  }

  static random(id, mapWidth = 800, mapHeight = 600) {
    const type = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];
    const x = Math.floor(50 + Math.random() * (mapWidth - 100));
    const y = Math.floor(50 + Math.random() * (mapHeight - 100));
    return new Item({ id, type, x, y, createdAt: Date.now() });
  }

  toJSON() {
    return { id: this.id, type: this.type, x: this.x, y: this.y, createdAt: this.createdAt };
  }
}

module.exports = Item;
