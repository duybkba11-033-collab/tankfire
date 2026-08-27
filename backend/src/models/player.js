class Player {
  constructor(socketId, user) {
    this.socketId = socketId;
    this.userId = user && user.userId ? user.userId : null;
    this.username = user && user.username ? user.username : null;

    // position / size
    this.x = 0; this.y = 0;
    this.w = 27; this.h = 27;

    // orientation
    this.bodyAngle = 0; this.turretAngle = 0;

    // health / armor / lives
    this.hp = 100; this.armor = 0; this.lives = 2;

    // state flags
    this.tempDead = false; this.eliminated = false; this.respawnAt = 0;

    // powerups / timers
    this.shieldUntil = 0; this.multiShotUntil = 0;
    this.speedLevel = 0; this.rapidLevel = 0; this.baseSpeed = 2.2; this.speed = 2.2;

    // shooting
    this.lastShot = 0;

    // input snapshot
    this.input = { up: false, down: false, left: false, right: false, shoot: false, mouseX: 0, mouseY: 0 };

    // final score computed at game end
    this.finalScore = 0;
  }

  toBroadcast(now = Date.now()) {
    return {
      socketId: this.socketId,
      userId: this.userId,
      username: this.username,
      x: this.x, y: this.y,
      w: this.w, h: this.h,
      bodyAngle: this.bodyAngle || 0,
      turretAngle: this.turretAngle || 0,
      hidden: !!this.hidden,
      hp: this.hp,
      armor: this.armor,
      lives: this.lives,
      dead: (!!this.tempDead || !!this.eliminated),
      eliminated: !!this.eliminated,
      speedLevel: this.speedLevel || 0,
      rapidLevel: this.rapidLevel || 0,
      shieldActive: !!(this.shieldUntil && this.shieldUntil > now),
      multiShotActive: !!(this.multiShotUntil && this.multiShotUntil > now),
      finalScore: this.finalScore || 0
    };
  }
}

module.exports = Player;
