const { circleRect, rectRect } = require('./collision');
const { calculateMovement, canOccupy } = require('../../../shared/movement.mjs');
const { sanitizeInput } = require('./input');
const {
  ARMOR_PER_HIT,
  ARMOR_PICKUP_AMOUNT,
  BULLET_DAMAGE,
  BULLET_RADIUS,
  BULLET_SPEED,
  ITEM_SPAWN_INTERVAL_MS,
  ITEM_PICKUP_SIZE,
  HEAL_AMOUNT,
  MAX_ARMOR,
  MAX_ITEMS,
  MULTI_SHOT_DURATION_MS,
  MULTI_SHOT_SPREAD_RADIANS,
  PLAYER_LIVES,
  RESPAWN_DELAY_MS,
  RAPID_COOLDOWNS_MS,
  SCORE_PER_LIFE,
  SHIELD_DURATION_MS,
  SHOT_COOLDOWN_MS,
  SPAWN_MARGIN,
  TANK_HP,
  TANK_SIZE,
  TANK_SPEED,
  SPEED_BONUS_PER_LEVEL,
  WALL_HIT_POINTS
} = require('./constants');

const ITEM_TYPES = ['heal', 'armor', 'speed', 'rapid', 'shield', 'multi_shot'];

function cloneMap(map) {
  const wallTiles = new Map();
  for (const wall of map.walls || []) {
    for (let x = wall.x; x < wall.x + wall.w; x += TANK_SIZE) {
      for (let y = wall.y; y < wall.y + wall.h; y += TANK_SIZE) {
        const tile = {
          x,
          y,
          w: Math.min(TANK_SIZE, wall.x + wall.w - x),
          h: Math.min(TANK_SIZE, wall.y + wall.h - y),
          hp: WALL_HIT_POINTS
        };
        wallTiles.set(`${tile.x}:${tile.y}`, tile);
      }
    }
  }
  return {
    id: map.id,
    name: map.name,
    w: map.w,
    h: map.h,
    walls: [...wallTiles.values()],
    grass: (map.grass || []).map((area) => ({ ...area })),
    rivers: (map.rivers || []).map((area) => ({ ...area }))
  };
}

function createPlayer({ socketId, userId, username }) {
  return {
    socketId,
    userId,
    username,
    connected: true,
    x: 0,
    y: 0,
    w: TANK_SIZE,
    h: TANK_SIZE,
    bodyAngle: 0,
    turretAngle: 0,
    hp: TANK_HP,
    armor: 0,
    lives: PLAYER_LIVES,
    eliminated: false,
    respawning: false,
    respawnAt: 0,
    hidden: false,
    shieldUntil: 0,
    multiShotUntil: 0,
    speedLevel: 0,
    rapidLevel: 0,
    lastShotAt: 0,
    finalScore: 0,
    input: sanitizeInput({}, { mouseX: 0, mouseY: 0, seq: -1 })
  };
}

class Room {
  constructor(id, map, { now = () => Date.now(), random = Math.random } = {}) {
    this.id = id;
    this.map = cloneMap(map);
    this.now = now;
    this.random = random;
    this.players = new Map();
    this.bullets = [];
    this.items = [];
    this.mapRevision = 0;
    this.nextItemId = 1;
    this.itemSpawnElapsedMs = 0;
    this.gameOver = false;
    this.endReason = null;
    this.winner = null;
    this.ticks = 0;
  }

  addPlayer(entry) {
    if (this.players.has(entry.socketId)) return this.players.get(entry.socketId);
    const player = createPlayer(entry);
    this.players.set(entry.socketId, player);
    this.respawnPlayer(player);
    return player;
  }

  placePlayersOpposite() {
    const players = [...this.players.values()];
    if (players.length !== 2) return;

    for (let attempt = 0; attempt < 80; attempt += 1) {
      const first = this._randomSpawnPosition();
      const second = {
        x: this.map.w - first.x - TANK_SIZE,
        y: this.map.h - first.y - TANK_SIZE
      };
      if (this._canOccupy(first.x, first.y) && this._canOccupy(second.x, second.y)) {
        players[0].x = first.x;
        players[0].y = first.y;
        players[1].x = second.x;
        players[1].y = second.y;
        return;
      }
    }
  }

  markDisconnected(socketId) {
    const player = this.players.get(socketId);
    if (!player) return;
    player.connected = false;
    player.input = sanitizeInput({}, player.input);
  }

  handleInput(socketId, payload) {
    const player = this.players.get(socketId);
    if (!player || !player.connected || this.gameOver) return false;
    const next = sanitizeInput(payload, player.input);
    if (next.seq <= player.input.seq) return false;
    player.input = next;
    return true;
  }

  update(deltaSeconds) {
    if (this.gameOver) return;
    this._evaluateDisconnects();
    if (this.gameOver) return;

    const now = this.now();
    for (const player of this.players.values()) {
      if (!player.connected || player.eliminated) continue;
      if (player.respawning) {
        if (now >= player.respawnAt) this.respawnPlayer(player);
        else continue;
      }
      this._updatePlayer(player, deltaSeconds);
      if (player.input.shoot) this._spawnBullets(player, now);
    }

    this._updateBullets(deltaSeconds);
    this._updateItems(deltaSeconds);
    this.ticks += 1;
  }

  applyDamage(player, damage) {
    if (!player || player.eliminated || player.respawning || damage <= 0) return;
    if (player.shieldUntil > this.now()) return;
    const absorbed = Math.min(player.armor, ARMOR_PER_HIT, damage);
    player.armor -= absorbed;
    player.hp = Math.max(0, player.hp - (damage - absorbed));
    if (player.hp === 0) this._handleDeath(player);
  }

  checkGameOver() {
    if (this.gameOver) return { reason: this.endReason, winner: this.winner };
    const connected = [...this.players.values()].filter((player) => player.connected);
    if (connected.length === 0 && this.players.size >= 2) return this._finish('DRAW', null);
    if (connected.length === 1 && this.players.size >= 2)
      return this._finish('ABORTED', connected[0]);
    const alive = [...this.players.values()].filter((player) => !player.eliminated);
    if (alive.length === 1 && this.players.size >= 2) return this._finish('WIN', alive[0]);
    if (alive.length === 0 && this.players.size >= 2) return this._finish('DRAW', null);
    return null;
  }

  respawnPlayer(player) {
    player.respawning = false;
    player.respawnAt = 0;
    player.hp = TANK_HP;
    player.armor = 0;
    player.lastShotAt = 0;
    player.speedLevel = 0;
    player.rapidLevel = 0;
    player.shieldUntil = 0;
    player.multiShotUntil = 0;
    player.input = sanitizeInput({}, player.input);

    for (let attempt = 0; attempt < 80; attempt += 1) {
      const position = this._randomSpawnPosition();
      if (this._canOccupy(position.x, position.y)) {
        player.x = position.x;
        player.y = position.y;
        return;
      }
    }
    player.x = 0;
    player.y = 0;
  }

  getMapSnapshot() {
    return {
      ...this.map,
      revision: this.mapRevision,
      walls: this.map.walls.map((wall) => ({ ...wall })),
      grass: this.map.grass.map((area) => ({ ...area })),
      rivers: this.map.rivers.map((area) => ({ ...area }))
    };
  }

  getStateFor(viewerSocketId, knownMapRevision = this.mapRevision) {
    const now = this.now();
    const visiblePlayers = [...this.players.values()]
      .filter((player) => player.socketId === viewerSocketId || !player.hidden)
      .map((player) => this._serializePlayer(player, now));
    const visibleIds = new Set(visiblePlayers.map((player) => player.socketId));
    return {
      roomId: this.id,
      serverTime: now,
      tick: this.ticks,
      mapUpdate:
        knownMapRevision === this.mapRevision
          ? null
          : { revision: this.mapRevision, walls: this.map.walls.map((wall) => ({ ...wall })) },
      players: visiblePlayers,
      bullets: this.bullets
        .filter((bullet) => bullet.owner === viewerSocketId || visibleIds.has(bullet.owner))
        .map(({ x, y }) => ({ x, y })),
      items: this.items.map((item) => ({ ...item })),
      gameOver: this.gameOver,
      endReason: this.endReason,
      winner: this.winner
    };
  }

  getParticipants() {
    return [...this.players.values()].map((player) => ({
      userId: player.userId,
      username: player.username,
      finalScore: player.finalScore
    }));
  }

  _evaluateDisconnects() {
    if ([...this.players.values()].some((player) => !player.connected)) this.checkGameOver();
  }

  _finish(reason, winner) {
    this.gameOver = true;
    this.endReason = reason;
    this.winner = winner ? { userId: winner.userId, username: winner.username } : null;
    for (const player of this.players.values()) {
      player.finalScore =
        Math.max(0, player.lives) * SCORE_PER_LIFE + Math.max(0, Math.round(player.hp));
    }
    return { reason, winner: this.winner };
  }

  _handleDeath(player) {
    if (player.lives > 1) {
      player.lives -= 1;
      player.respawning = true;
      player.respawnAt = this.now() + RESPAWN_DELAY_MS;
      player.input = sanitizeInput({}, player.input);
      return;
    }
    player.lives = 0;
    player.eliminated = true;
    this.checkGameOver();
  }

  _updatePlayer(player, deltaSeconds) {
    const speed = TANK_SPEED + player.speedLevel * SPEED_BONUS_PER_LEVEL;
    const movement = calculateMovement(player.input, speed, deltaSeconds);
    if (movement.angle !== null) player.bodyAngle = movement.angle;
    if (Number.isFinite(player.input.mouseX) && Number.isFinite(player.input.mouseY)) {
      player.turretAngle = Math.atan2(
        player.input.mouseY - (player.y + player.h / 2),
        player.input.mouseX - (player.x + player.w / 2)
      );
    }
    if (this._canOccupy(player.x + movement.dx, player.y)) player.x += movement.dx;
    if (this._canOccupy(player.x, player.y + movement.dy)) player.y += movement.dy;
    player.x = Math.min(this.map.w - player.w, Math.max(0, player.x));
    player.y = Math.min(this.map.h - player.h, Math.max(0, player.y));
    player.hidden = this.map.grass.some((area) => rectRect(player, area));
  }

  _spawnBullets(player, now) {
    const rapidIndex = Math.min(player.rapidLevel - 1, RAPID_COOLDOWNS_MS.length - 1);
    const cooldown = player.rapidLevel > 0 ? RAPID_COOLDOWNS_MS[rapidIndex] : SHOT_COOLDOWN_MS;
    if (now - player.lastShotAt < cooldown) return;
    player.lastShotAt = now;
    const angles =
      player.multiShotUntil > now
        ? [
            player.turretAngle - MULTI_SHOT_SPREAD_RADIANS,
            player.turretAngle,
            player.turretAngle + MULTI_SHOT_SPREAD_RADIANS
          ]
        : [player.turretAngle];
    for (const angle of angles) {
      if (!Number.isFinite(angle)) continue;
      this.bullets.push({
        x: player.x + player.w / 2,
        y: player.y + player.h / 2,
        vx: Math.cos(angle) * BULLET_SPEED,
        vy: Math.sin(angle) * BULLET_SPEED,
        r: BULLET_RADIUS,
        damage: BULLET_DAMAGE,
        owner: player.socketId
      });
    }
  }

  _updateBullets(deltaSeconds) {
    for (let index = this.bullets.length - 1; index >= 0; index -= 1) {
      const bullet = this.bullets[index];
      if (![bullet.x, bullet.y, bullet.vx, bullet.vy].every(Number.isFinite)) {
        this.bullets.splice(index, 1);
        continue;
      }
      bullet.x += bullet.vx * deltaSeconds;
      bullet.y += bullet.vy * deltaSeconds;
      if (
        !Number.isFinite(bullet.x) ||
        !Number.isFinite(bullet.y) ||
        bullet.x < 0 ||
        bullet.x > this.map.w ||
        bullet.y < 0 ||
        bullet.y > this.map.h
      ) {
        this.bullets.splice(index, 1);
        continue;
      }
      const wallIndex = this.map.walls.findIndex((wall) => circleRect(bullet, wall));
      if (wallIndex >= 0) {
        this.map.walls[wallIndex].hp -= 1;
        if (this.map.walls[wallIndex].hp <= 0) this.map.walls.splice(wallIndex, 1);
        this.mapRevision += 1;
        this.bullets.splice(index, 1);
        continue;
      }
      const target = [...this.players.values()].find(
        (player) =>
          player.socketId !== bullet.owner &&
          player.connected &&
          !player.eliminated &&
          !player.respawning &&
          circleRect(bullet, player)
      );
      if (target) {
        this.applyDamage(target, bullet.damage);
        this.bullets.splice(index, 1);
      }
    }
  }

  _updateItems(deltaSeconds) {
    this.itemSpawnElapsedMs += deltaSeconds * 1000;
    if (this.items.length < MAX_ITEMS && this.itemSpawnElapsedMs >= ITEM_SPAWN_INTERVAL_MS) {
      this.itemSpawnElapsedMs %= ITEM_SPAWN_INTERVAL_MS;
      this._spawnItem();
    }
    for (let index = this.items.length - 1; index >= 0; index -= 1) {
      const item = this.items[index];
      const collector = [...this.players.values()].find(
        (player) =>
          player.connected &&
          !player.eliminated &&
          !player.respawning &&
          rectRect(
            {
              x: item.x - ITEM_PICKUP_SIZE / 2,
              y: item.y - ITEM_PICKUP_SIZE / 2,
              w: ITEM_PICKUP_SIZE,
              h: ITEM_PICKUP_SIZE
            },
            player
          )
      );
      if (collector && this._applyItem(item, collector)) this.items.splice(index, 1);
    }
  }

  _spawnItem() {
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const position = this._randomSpawnPosition();
      if (!this._canOccupy(position.x, position.y)) continue;
      const type = ITEM_TYPES[Math.floor(this.random() * ITEM_TYPES.length)];
      this.items.push({ id: `${this.id}-item-${this.nextItemId++}`, type, ...position });
      return;
    }
  }

  _applyItem(item, player) {
    switch (item.type) {
      case 'heal':
        player.hp = Math.min(TANK_HP, player.hp + HEAL_AMOUNT);
        break;
      case 'armor':
        player.armor = Math.min(MAX_ARMOR, player.armor + ARMOR_PICKUP_AMOUNT);
        break;
      case 'speed':
        player.speedLevel += 1;
        break;
      case 'rapid':
        player.rapidLevel += 1;
        break;
      case 'shield':
        player.shieldUntil = this.now() + SHIELD_DURATION_MS;
        break;
      case 'multi_shot':
        player.multiShotUntil = this.now() + MULTI_SHOT_DURATION_MS;
        break;
      default:
        return false;
    }
    return true;
  }

  _canOccupy(x, y) {
    return canOccupy(this.map, { w: TANK_SIZE, h: TANK_SIZE }, x, y);
  }

  _randomSpawnPosition() {
    return {
      x: Math.floor(
        SPAWN_MARGIN + this.random() * Math.max(1, this.map.w - TANK_SIZE - SPAWN_MARGIN * 2)
      ),
      y: Math.floor(
        SPAWN_MARGIN + this.random() * Math.max(1, this.map.h - TANK_SIZE - SPAWN_MARGIN * 2)
      )
    };
  }

  _serializePlayer(player, now) {
    return {
      socketId: player.socketId,
      userId: player.userId,
      username: player.username,
      x: player.x,
      y: player.y,
      w: player.w,
      h: player.h,
      bodyAngle: player.bodyAngle,
      turretAngle: player.turretAngle,
      hp: player.hp,
      armor: player.armor,
      lives: player.lives,
      dead: player.respawning || player.eliminated,
      eliminated: player.eliminated,
      hidden: player.hidden,
      shieldActive: player.shieldUntil > now,
      multiShotActive: player.multiShotUntil > now,
      speedLevel: player.speedLevel,
      rapidLevel: player.rapidLevel,
      lastProcessedSeq: player.input.seq,
      finalScore: player.finalScore
    };
  }
}

module.exports = { Room };
