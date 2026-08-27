export default class InputManager {
  constructor({ canvasId = 'game-canvas', rate = 30 } = {}) {
    this.canvasId = canvasId;
    this.rate = rate;
    this.current = { up:false, down:false, left:false, right:false, shoot:false };
    this.sendFn = null;
    this.mouseCoords = { mouseX: 0, mouseY: 0 };
    this._interval = null;
    this._boundKeyDown = this._onKeyDown.bind(this);
    this._boundKeyUp = this._onKeyUp.bind(this);
    this._boundMouseMove = this._onMouseMove.bind(this);
  }

  start() {
    window.addEventListener('keydown', this._boundKeyDown);
    window.addEventListener('keyup', this._boundKeyUp);
    const canvas = document.getElementById(this.canvasId);
    if (canvas) canvas.addEventListener('mousemove', this._boundMouseMove);
    this._interval = setInterval(()=>this._sendNow(), 1000/this.rate);
  }

  stop() {
    window.removeEventListener('keydown', this._boundKeyDown);
    window.removeEventListener('keyup', this._boundKeyUp);
    const canvas = document.getElementById(this.canvasId);
    if (canvas) canvas.removeEventListener('mousemove', this._boundMouseMove);
    if (this._interval) { clearInterval(this._interval); this._interval = null; }
    this.sendFn = null;
  }

  setSendFn(fn) { this.sendFn = fn; }

  _onKeyDown(ev) { this._key(this.current, ev.code, true); ev.preventDefault(); this._sendNow(); }
  _onKeyUp(ev) { this._key(this.current, ev.code, false); this._sendNow(); }

  _onMouseMove(e) {
    const canvas = document.getElementById(this.canvasId);
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    const scaleX = canvas.width / rect.width; const scaleY = canvas.height / rect.height;
    this.mouseCoords.mouseX = x * scaleX; this.mouseCoords.mouseY = y * scaleY;
  }

  _key(state, code, value) {
    if (code === 'KeyW') state.up = value;
    if (code === 'KeyS') state.down = value;
    if (code === 'KeyA') state.left = value;
    if (code === 'KeyD') state.right = value;
    if (code === 'Space') state.shoot = value;
  }

  _sendNow() {
    if (!this.sendFn) return;
    this.sendFn({ ...this.current, ...this.mouseCoords });
  }
}
