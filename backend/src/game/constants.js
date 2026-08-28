const values = require('../../../shared/gameConstants.json');

module.exports = Object.freeze({
  ARENA_WIDTH: values.arenaWidth, // px
  ARENA_HEIGHT: values.arenaHeight, // px
  SIMULATION_HZ: values.simulationHz, // fixed updates/second
  BROADCAST_HZ: values.broadcastHz, // snapshots/second
  INPUT_HZ: values.inputHz, // input packets/second
  TANK_SIZE: values.tankSize, // px
  TANK_SPEED: values.tankSpeed, // px/second
  TANK_HP: values.tankHp, // HP
  PLAYER_LIVES: values.playerLives, // lives/player
  BULLET_RADIUS: values.bulletRadius, // px
  BULLET_SPEED: values.bulletSpeed, // px/second
  BULLET_DAMAGE: values.bulletDamage, // HP/hit
  SHOT_COOLDOWN_MS: values.shotCooldownMs, // milliseconds
  RESPAWN_DELAY_MS: values.respawnDelayMs, // milliseconds
  MAX_ARMOR: values.maxArmor, // armor points
  ARMOR_PER_HIT: values.armorPerHit, // armor points/hit
  WALL_HIT_POINTS: values.wallHitPoints, // bullet hits/tile
  HEAL_AMOUNT: values.healAmount, // HP/pickup
  ARMOR_PICKUP_AMOUNT: values.armorPickupAmount, // armor points/pickup
  SPEED_BONUS_PER_LEVEL: values.speedBonusPerLevel, // px/second/level
  RAPID_COOLDOWNS_MS: Object.freeze(values.rapidCooldownsMs), // milliseconds by level
  MULTI_SHOT_SPREAD_RADIANS: values.multiShotSpreadRadians, // radians
  SCORE_PER_LIFE: values.scorePerLife, // match score/life
  SPAWN_MARGIN: values.spawnMargin, // px
  MAX_ITEMS: values.maxItems, // items/room
  ITEM_SPAWN_INTERVAL_MS: values.itemSpawnIntervalMs, // milliseconds
  ITEM_PICKUP_SIZE: values.itemPickupSize, // px
  SHIELD_DURATION_MS: values.shieldDurationMs, // milliseconds
  MULTI_SHOT_DURATION_MS: values.multiShotDurationMs // milliseconds
});
