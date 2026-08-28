import { INPUT_HZ } from './constants.js';

const CONTROL_KEYS = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space']);
const state = { up: false, down: false, left: false, right: false, shoot: false };
const pointer = { mouseX: 0, mouseY: 0 };
let initialized = false;
let intervalId = null;
let send = null;
let sequence = 0;

function updateKey(code, pressed) {
  if (code === 'KeyW') state.up = pressed;
  if (code === 'KeyS') state.down = pressed;
  if (code === 'KeyA') state.left = pressed;
  if (code === 'KeyD') state.right = pressed;
  if (code === 'Space') state.shoot = pressed;
}

function sendNow() {
  if (send) send({ ...state, ...pointer, seq: sequence++ });
}

export function initInput(canvas) {
  if (initialized) return;
  initialized = true;

  window.addEventListener('keydown', (event) => {
    if (!CONTROL_KEYS.has(event.code) || event.target.matches('input, textarea, select')) return;
    event.preventDefault();
    updateKey(event.code, true);
    sendNow();
  });
  window.addEventListener('keyup', (event) => {
    if (!CONTROL_KEYS.has(event.code)) return;
    event.preventDefault();
    updateKey(event.code, false);
    sendNow();
  });
  window.addEventListener('blur', resetInput);
  canvas.addEventListener('pointermove', (event) => {
    const bounds = canvas.getBoundingClientRect();
    pointer.mouseX = (event.clientX - bounds.left) * (canvas.width / bounds.width);
    pointer.mouseY = (event.clientY - bounds.top) * (canvas.height / bounds.height);
  });
}

export function startInput(sender) {
  stopInput();
  send = sender;
  sequence = 0;
  intervalId = window.setInterval(sendNow, 1000 / INPUT_HZ);
}

export function stopInput() {
  send = null;
  if (intervalId !== null) window.clearInterval(intervalId);
  intervalId = null;
  resetInput();
}

function resetInput() {
  for (const key of Object.keys(state)) state[key] = false;
}
