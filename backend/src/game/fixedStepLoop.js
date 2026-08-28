const { performance } = require('node:perf_hooks');

class FixedStepLoop {
  constructor({ stepHz, broadcastHz, onStep, onBroadcast, clock = () => performance.now() }) {
    this.stepMs = 1000 / stepHz;
    this.broadcastMs = 1000 / broadcastHz;
    this.onStep = onStep;
    this.onBroadcast = onBroadcast;
    this.clock = clock;
    this.running = false;
    this.timer = null;
    this.lastTime = 0;
    this.stepAccumulator = 0;
    this.broadcastAccumulator = 0;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = this.clock();
    this._schedule(0);
  }

  stop() {
    this.running = false;
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
  }

  _schedule(delay) {
    this.timer = setTimeout(() => this._frame(), delay);
  }

  _frame() {
    if (!this.running) return;

    const now = this.clock();
    const elapsed = Math.min(250, Math.max(0, now - this.lastTime));
    this.lastTime = now;
    this.stepAccumulator += elapsed;
    this.broadcastAccumulator += elapsed;

    let catchUpSteps = 0;
    while (this.running && this.stepAccumulator >= this.stepMs && catchUpSteps < 5) {
      this.onStep(this.stepMs / 1000);
      this.stepAccumulator -= this.stepMs;
      catchUpSteps += 1;
    }

    if (!this.running) return;
    if (catchUpSteps === 5) this.stepAccumulator = 0;

    if (this.broadcastAccumulator >= this.broadcastMs) {
      this.onBroadcast();
      this.broadcastAccumulator %= this.broadcastMs;
    }

    this._schedule(Math.max(1, this.stepMs - this.stepAccumulator));
  }
}

module.exports = { FixedStepLoop };
