class Map {
  constructor(obj) {
    // keep original map object shape
    this.id = obj && obj.id ? obj.id : null;
    this.name = obj && obj.name ? obj.name : null;
    this.w = obj && obj.w ? obj.w : 800;
    this.h = obj && obj.h ? obj.h : 600;
    this.walls = (obj && obj.walls) ? obj.walls : [];
    this.grass = (obj && obj.grass) ? obj.grass : [];
    this.rivers = (obj && obj.rivers) ? obj.rivers : [];
  }

  toJSON() {
    return { id: this.id, name: this.name, w: this.w, h: this.h, walls: this.walls, grass: this.grass, rivers: this.rivers };
  }
}

module.exports = Map;
