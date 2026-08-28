const test = require('node:test');
const assert = require('node:assert/strict');
const { FixedStepLoop } = require('../src/game/fixedStepLoop');

function createLoop() {
  let now = 0;
  const steps = [];
  let broadcasts = 0;
  const loop = new FixedStepLoop({
    stepHz: 60,
    broadcastHz: 20,
    clock: () => now,
    onStep: (deltaSeconds) => steps.push(deltaSeconds),
    onBroadcast: () => {
      broadcasts += 1;
    }
  });
  loop._schedule = () => {};
  return {
    loop,
    steps,
    broadcasts: () => broadcasts,
    setNow: (value) => {
      now = value;
    }
  };
}

test('fixed loop advances simulation with a stable delta', () => {
  const harness = createLoop();
  harness.loop.start();
  harness.setNow(51);
  harness.loop._frame();
  assert.equal(harness.steps.length, 3);
  assert.ok(harness.steps.every((delta) => Math.abs(delta - 1 / 60) < 0.000001));
  assert.equal(harness.broadcasts(), 1);
});

test('fixed loop caps catch-up work after a long frame', () => {
  const harness = createLoop();
  harness.loop.start();
  harness.setNow(1000);
  harness.loop._frame();
  assert.equal(harness.steps.length, 5);
  assert.equal(harness.loop.stepAccumulator, 0);
});

test('start and stop are idempotent', () => {
  const harness = createLoop();
  harness.loop.start();
  harness.loop.start();
  assert.equal(harness.loop.running, true);
  harness.loop.stop();
  harness.loop.stop();
  assert.equal(harness.loop.running, false);
});
