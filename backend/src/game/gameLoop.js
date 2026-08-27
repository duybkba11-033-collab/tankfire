const { randomItem, Item } = require('./items');
const { rectRect, circleRect } = require('./collision');
const Player = require('../models/player');
const MapClass = require('../models/Map');


class Room {
  constructor(id) {
    this.id = id;
    this.players = {}; // socketId -> Player instance
    this.bullets = [];
    this.items = [];
    this.map = new MapClass({ w: 800, h: 600, walls: [], grass: [], rivers: [] });
    this.ticks = 0;
    this.maxItems = 3;
    this.spawnCounter = 0;

    // gameplay constants
    this.MAX_ARMOR = 100;
    this.ARMOR_PER_BULLET = 10;
    this.RESPAWN_DELAY_MS = 2000;
    this.MAX_SPEED = 5;
    
    // rapid cooldowns per level: base 500ms, level1=400, level2=300, level3=250
    this.RAPID_COOLDOWNS = [400, 300, 250];
    
    // temporary durations
    this.SHIELD_DURATION_MS = 4000;
    this.MULTI_DURATION_MS = 6000;
    this.gameOverWinner = null;
    this.gameOver = false;
  }

  // Expand rectangular walls into TILE-sized bricks with per-side damage counters
  _expandWallsToTiles(tileSize = 32) {
    if (!this.map || !Array.isArray(this.map.walls)) return;
    const rects = this.map.walls.slice();
    const tiles = [];
    const seen = new Set();
    for (const r of rects) {
      const cols = Math.max(1, Math.round((r.w || tileSize) / tileSize));
      const rows = Math.max(1, Math.round((r.h || tileSize) / tileSize));
      for (let cx = 0; cx < cols; cx++) {
        for (let cy = 0; cy < rows; cy++) {
          const tx = (r.x || 0) + cx * tileSize;
          const ty = (r.y || 0) + cy * tileSize;
          const key = tx + ':' + ty;
          if (seen.has(key)) continue;
          seen.add(key);
          tiles.push({
            x: tx, y: ty, w: tileSize, h: tileSize,
            // sideDamage counts how many 1/3 slices removed from each side (0..maxSteps)
            sideDamage: { left: 0, right: 0, top: 0, bottom: 0 },
            maxSteps: 3
          });
        }
      }
    }
    this.map.walls = tiles;
  }

  // compute final scores when game ends
  computeFinalScores() {
    if (this.gameOver) {
      for (const id in this.players) {
        const p = this.players[id];
        const lives = typeof p.lives === 'number' ? p.lives : 0;
        const hp = typeof p.hp === 'number' ? Math.max(0, Math.floor(p.hp)) : 0;
        p.finalScore = lives * 100 + hp;
      }
    } else {
      for (const id in this.players) {
        this.players[id].finalScore = 0;
      }
    }
  }

  _randomSpawnPos() {
    return {
      x: Math.floor(50 + Math.random() * (this.map.w - 100)),
      y: Math.floor(50 + Math.random() * (this.map.h - 100))
    };
  }

  isBlockedArea(bbox) {
    // check walls and rivers (both block movement)
    for (const w of (this.map.walls || [])) {
      const sd = w.sideDamage || { left: 0, right: 0, top: 0, bottom: 0 };
      const steps = w.maxSteps || 3;
      const leftOff = (sd.left / steps) * w.w;
      const rightOff = (sd.right / steps) * w.w;
      const topOff = (sd.top / steps) * w.h;
      const bottomOff = (sd.bottom / steps) * w.h;
      const curW = w.w - leftOff - rightOff;
      const curH = w.h - topOff - bottomOff;
      if (curW > 0 && curH > 0) {
        if (rectRect(bbox, { x: w.x + leftOff, y: w.y + topOff, w: curW, h: curH })) return true;
      }
    }
    for (const r of (this.map.rivers || [])) {
      if (rectRect(bbox, { x: r.x, y: r.y, w: r.w, h: r.h })) return true;
    }
    return false;
  }

  applyDamage(p, damage) {
    if (!p || p.eliminated) return;
    const now = Date.now();
    if (p.shieldUntil && p.shieldUntil > now) return;

    if (p.armor && p.armor > 0) {
      const armorAbsorb = Math.min(p.armor, Math.min(this.ARMOR_PER_BULLET, damage));
      p.armor = Math.max(0, p.armor - armorAbsorb);
      const leftover = damage - armorAbsorb;
      if (leftover > 0) p.hp -= leftover;
    } else {
      p.hp -= damage;
    }

    if (p.hp < 0) p.hp = 0;
    if (p.hp <= 0) this.handleDeath(p);
  }

  handleDeath(p) {
    if (p.lives > 1) {
      p.lives -= 1;
      p.tempDead = true;
      p.respawnAt = Date.now() + this.RESPAWN_DELAY_MS;
      p.hp = 0;
      p.input = { up: false, down: false, left: false, right: false, shoot: false, mouseX: p.x, mouseY: p.y };
    } else {
      p.lives = 0;
      p.eliminated = true;
      p.tempDead = false;
      p.hp = 0;
      this.checkGameOver();
    }
  }

  checkGameOver() {
    const nonEliminated = Object.values(this.players).filter(pp => !pp.eliminated);
    if (!this.gameOver && nonEliminated.length <= 1) {
      this.gameOver = true;
      if (nonEliminated.length === 1) {
        const w = nonEliminated[0];
        this.gameOverWinner = { userId: w.userId, username: w.username };
      } else {
        this.gameOverWinner = null;
      }
      this.computeFinalScores();
    }
  }

  respawnPlayer(p) {
    if (!p) return;
    p.tempDead = false;
    p.respawnAt = 0;
    p.hp = 100;
    p.armor = 0;
    p.lastShot = 0;
    p.input = { up: false, down: false, left: false, right: false, shoot: false };

    // reset items
    p.speedLevel = 0;
    p.rapidLevel = 0;
    p.speed = p.baseSpeed || 2.2;
    p.shieldUntil = 0;
    p.multiShotUntil = 0;

    // pick a spawn position that is not inside walls/rivers; try several times
    let attempts = 0;
    let pos = this._randomSpawnPos();
    while (this.isBlockedArea({ x: pos.x, y: pos.y, w: p.w, h: p.h }) && attempts < 50) {
      pos = this._randomSpawnPos();
      attempts++;
    }
    p.x = pos.x;
    p.y = pos.y;
    p.bodyAngle = 0;
    p.turretAngle = 0;
  }

  addPlayer(socket, user) {
    this.players[socket.id] = new Player(socket.id, user);
    // immediately place player at a valid spawn
    this.respawnPlayer(this.players[socket.id]);
  }

  removePlayer(socketId) {
    delete this.players[socketId];
    this.checkGameOver();
  }

  handleInput(socketId, input) {
    if (this.players[socketId]) {
      // Merge new input with existing to preserve mouse coords if not sent every time
      this.players[socketId].input = { ...this.players[socketId].input, ...input };
      // debug log briefly
      if (typeof input.up !== 'undefined' || typeof input.down !== 'undefined' || typeof input.left !== 'undefined' || typeof input.right !== 'undefined') {
        // minimal logging
        // console.log can be noisy; uncomment when debugging
        // console.log('input from', socketId, input);
      }
    }
  }

  spawnBullet(from) {
    const p = this.players[from];
    if (!p || p.tempDead || p.eliminated) return;
    const now = Date.now();

    let cooldown = 500;
    if (p.rapidLevel && p.rapidLevel > 0) {
      const idx = Math.min(p.rapidLevel - 1, this.RAPID_COOLDOWNS.length - 1);
      cooldown = this.RAPID_COOLDOWNS[idx];
    }

    if (now - p.lastShot < cooldown) return;
    p.lastShot = now;

    const bSpeed = 7;
    // Bắn theo hướng nòng súng (turretAngle)
    const angle = p.turretAngle;

    if (p.multiShotUntil && p.multiShotUntil > now) {
      const angles = [angle - 0.2, angle, angle + 0.2];
      for (const a of angles) {
        this.bullets.push({ 
          x: p.x + p.w / 2, y: p.y + p.h / 2, 
          vx: Math.cos(a) * bSpeed, vy: Math.sin(a) * bSpeed, 
          r: 4, owner: from, damage: 20 
        });
      }
    } else {
      this.bullets.push({ 
        x: p.x + p.w / 2, y: p.y + p.h / 2, 
        vx: Math.cos(angle) * bSpeed, vy: Math.sin(angle) * bSpeed, 
        r: 4, owner: from, damage: 20 
      });
    }
  }

  applyItemToPlayer(item, p) {
    if (!p || p.eliminated || p.tempDead) return false;

    switch (item.type) {
      case 'heal':
        p.hp = Math.min(100, p.hp + 20);
        return true;
      case 'armor':
        p.armor = Math.min(this.MAX_ARMOR, (p.armor || 0) + 20);
        return true;
      case 'speed':
        p.speedLevel += 1;
        p.speed = p.baseSpeed + (p.speedLevel * 0.5);
        return true;
      case 'rapid':
        p.rapidLevel += 1;
        return true;
      case 'shield':
        p.shieldUntil = Date.now() + this.SHIELD_DURATION_MS;
        return true;
      case 'multi_shot':
        p.multiShotUntil = Date.now() + this.MULTI_DURATION_MS;
        return true;
      default:
        return false;
    }
  }

  update() {
    for (const id in this.players) {
      const p = this.players[id];
      const inp = p.input;
      const now = Date.now();

      if (p.tempDead && p.respawnAt && now >= p.respawnAt) {
        this.respawnPlayer(p);
      }

      if (p.tempDead || p.eliminated) continue;

      let dx = 0, dy = 0;
      if (inp.up) dy -= p.speed;
      if (inp.down) dy += p.speed;
      if (inp.left) dx -= p.speed;
      if (inp.right) dx += p.speed;

      // Cập nhật góc thân xe (bodyAngle) theo hướng di chuyển
      if (dx !== 0 || dy !== 0) {
        p.bodyAngle = Math.atan2(dy, dx);
      }

      // Cập nhật góc tháp pháo (turretAngle) theo chuột
      if (inp.mouseX !== undefined && inp.mouseY !== undefined) {
        p.turretAngle = Math.atan2(inp.mouseY - (p.y + p.h / 2), inp.mouseX - (p.x + p.w / 2));
      }

      // collision with map: attempt move and rollback if collides with wall or river (rivers block movement)
      const tryX = p.x + dx;
      const tryY = p.y + dy;
      const bbox = { x: tryX, y: tryY, w: p.w, h: p.h };
      const blocked = this.isBlockedArea(bbox);
      if (!blocked) { p.x = tryX; p.y = tryY; }

      // Map bounds
      p.x = Math.max(0, Math.min(this.map.w - p.w, p.x));
      p.y = Math.max(0, Math.min(this.map.h - p.h, p.y));

      // hidden flag when in grass
      p.hidden = false;
      for (const g of (this.map.grass||[])) {
        if (rectRect({ x: p.x, y: p.y, w: p.w, h: p.h }, { x: g.x, y: g.y, w: g.w, h: g.h })) { p.hidden = true; break; }
      }

      if (inp.shoot) this.spawnBullet(id);
    }

    // update bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += b.vx;
      b.y += b.vy;

      if (b.x < 0 || b.x > this.map.w || b.y < 0 || b.y > this.map.h) {
        this.bullets.splice(i, 1);
        continue;
      }

      // check collision with wall tiles (directional damage)
      let hitTile = false;
      const walls = this.map.walls || [];
      for (let wi = 0; wi < walls.length; wi++) {
        const w = walls[wi];
        const sd = w.sideDamage || { left: 0, right: 0, top: 0, bottom: 0 };
        const steps = w.maxSteps || 3;
        const leftOff = (sd.left / steps) * w.w;
        const rightOff = (sd.right / steps) * w.w;
        const topOff = (sd.top / steps) * w.h;
        const bottomOff = (sd.bottom / steps) * w.h;
        const curW = w.w - leftOff - rightOff;
        const curH = w.h - topOff - bottomOff;
        if (curW <= 0 || curH <= 0) continue; // already destroyed
        const rect = { x: w.x + leftOff, y: w.y + topOff, w: curW, h: curH };
        if (circleRect({ x: b.x, y: b.y, r: b.r }, rect)) {
          // determine impact side from bullet velocity (vx,vy)
          const vx = b.vx || 0; const vy = b.vy || 0;
          let side;
          if (Math.abs(vx) > Math.abs(vy)) side = vx > 0 ? 'left' : 'right';
          else if (Math.abs(vy) > Math.abs(vx)) side = vy > 0 ? 'top' : 'bottom';
          else {
            // fallback: from center of tile to bullet
            const cx = w.x + w.w / 2; const cy = w.y + w.h / 2;
            const dx = b.x - cx; const dy = b.y - cy;
            if (Math.abs(dx) > Math.abs(dy)) side = dx > 0 ? 'right' : 'left';
            else side = dy > 0 ? 'bottom' : 'top';
          }

          w.sideDamage = w.sideDamage || { left: 0, right: 0, top: 0, bottom: 0 };
          w.sideDamage[side] = Math.min(steps, (w.sideDamage[side] || 0) + 1);

          // recompute remaining rect and remove tile if fully depleted
          const l2 = (w.sideDamage.left / steps) * w.w;
          const r2 = (w.sideDamage.right / steps) * w.w;
          const t2 = (w.sideDamage.top / steps) * w.h;
          const b2 = (w.sideDamage.bottom / steps) * w.h;
          const remainW = w.w - l2 - r2;
          const remainH = w.h - t2 - b2;
          if (remainW <= 0 || remainH <= 0) {
            // remove tile
            this.map.walls.splice(wi, 1);
          } else {
            // store cached current rectangle for quick collision checks
            w.cx = w.x + l2; w.cy = w.y + t2; w.cw = remainW; w.ch = remainH;
          }

          // bullet consumed
          this.bullets.splice(i, 1);
          hitTile = true;
          break;
        }
      }
      if (hitTile) continue;

      // check collision with players
      for (const pid in this.players) {
        const p = this.players[pid];
        if (pid === b.owner || p.tempDead || p.eliminated) continue;
        if (circleRect({ x: b.x, y: b.y, r: b.r }, { x: p.x, y: p.y, w: p.w, h: p.h })) {
          this.applyDamage(p, b.damage);
          this.bullets.splice(i, 1);
          break;
        }
      }
    }

    // item spawning
    this.spawnCounter++;
    if (this.spawnCounter % 200 === 0 && this.items.length < this.maxItems) {
      this.items.push(Item.random(Date.now(), this.map.w, this.map.h));
    }

    // check items pickup
      for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i];
      for (const pid in this.players) {
        const p = this.players[pid];
        if (p.eliminated || p.tempDead) continue;
        if (rectRect({ x: it.x - 8, y: it.y - 8, w: 16, h: 16 }, { x: p.x, y: p.y, w: p.w, h: p.h })) {
          if (this.applyItemToPlayer(it, p)) {
            this.items.splice(i, 1);
            break;
          }
        }
      }
    }

    this.ticks++;
  }

  getStateForBroadcast() {
    const now = Date.now();
    return {
      map: this.map,
      players: Object.values(this.players).map(p => ({
        ...(typeof p.toBroadcast === 'function' ? p.toBroadcast(now) : {
          socketId: p.socketId,
          userId: p.userId,
          username: p.username,
          x: p.x, y: p.y,
          w: p.w, h: p.h,
          bodyAngle: p.bodyAngle || 0,
          turretAngle: p.turretAngle || 0,
          hp: p.hp,
          armor: p.armor,
          lives: p.lives,
          dead: (!!p.tempDead || !!p.eliminated),
          eliminated: !!p.eliminated,
          speedLevel: p.speedLevel || 0,
          rapidLevel: p.rapidLevel || 0,
          shieldActive: !!(p.shieldUntil && p.shieldUntil > now),
          multiShotActive: !!(p.multiShotUntil && p.multiShotUntil > now),
          finalScore: p.finalScore || 0
        })
      })),
      bullets: this.bullets.map(b => ({ x: b.x, y: b.y })),
      items: this.items.map(it => (typeof it.toJSON === 'function' ? it.toJSON() : it)),
      gameOver: !!this.gameOver,
      winner: this.gameOverWinner || null
    };
  }

  // personalized broadcast: hide other players who are in grass (hidden) and hide their bullets
  getStateForBroadcastFor(viewerSocketId) {
    const now = Date.now();
    const playersFor = Object.values(this.players).map(p => (typeof p.toBroadcast === 'function' ? p.toBroadcast(now) : p));
    // filter out players that are hidden from this viewer (except the viewer themself)
    const visiblePlayers = playersFor.filter(p => (p.socketId === viewerSocketId) || !p.hidden);

    const bulletsFor = this.bullets.filter(b => {
      // always show your own bullets
      if (b.owner === viewerSocketId) return true;
      // hide bullets from owners who are hidden
      const owner = this.players[b.owner];
      if (owner && owner.hidden) return false;
      return true;
    }).map(b => ({ x: b.x, y: b.y }));

    return {
      map: this.map,
      players: visiblePlayers,
      bullets: bulletsFor,
      items: this.items.map(it => (typeof it.toJSON === 'function' ? it.toJSON() : it)),
      gameOver: !!this.gameOver,
      winner: this.gameOverWinner || null
    };
  }
}

module.exports = { Room };