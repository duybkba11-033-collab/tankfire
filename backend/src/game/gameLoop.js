const { randomItem } = require('./items');
const { rectRect, circleRect } = require('./collision');

class Room {
  constructor(id) {
    this.id = id;
    this.players = {}; // socketId -> player object
    this.bullets = [];
    this.items = [];
    this.map = { w: 800, h: 600, walls: [] };
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

    const pos = this._randomSpawnPos();
    p.x = pos.x;
    p.y = pos.y;
    p.bodyAngle = 0;
    p.turretAngle = 0;
  }

  addPlayer(socket, user) {
    const baseX = Object.keys(this.players).length === 0 ? 100 : 700;
    this.players[socket.id] = {
      socketId: socket.id,
      userId: user.userId,
      username: user.username,
      x: baseX,
      y: 300,
      w: 32,
      h: 32,
      bodyAngle: 0,
      turretAngle: 0,
      hp: 100,
      armor: 0,
      lives: 2,
      tempDead: false,
      eliminated: false,
      respawnAt: 0,
      shieldUntil: 0,
      multiShotUntil: 0,
      speedLevel: 0,
      rapidLevel: 0,
      baseSpeed: 2.2,
      speed: 2.2,
      lastShot: 0,
      input: { up: false, down: false, left: false, right: false, shoot: false, mouseX: 0, mouseY: 0 },
      finalScore: 0
    };
  }

  removePlayer(socketId) {
    delete this.players[socketId];
    this.checkGameOver();
  }

  handleInput(socketId, input) {
    if (this.players[socketId]) {
      // Merge new input with existing to preserve mouse coords if not sent every time
      this.players[socketId].input = { ...this.players[socketId].input, ...input };
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

      p.x += dx;
      p.y += dy;

      // Map bounds
      p.x = Math.max(0, Math.min(this.map.w - p.w, p.x));
      p.y = Math.max(0, Math.min(this.map.h - p.h, p.y));

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
      this.items.push(randomItem(Date.now(), this.map.w, this.map.h));
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
      players: Object.values(this.players).map(p => ({
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
      })),
      bullets: this.bullets.map(b => ({ x: b.x, y: b.y })),
      items: this.items,
      gameOver: !!this.gameOver,
      winner: this.gameOverWinner || null
    };
  }
}

module.exports = { Room };