let current = { up:false,down:false,left:false,right:false,shoot:false };
let sendFn = null;

function key(state, code, value) {
  if (code === 'KeyW') state.up = value;
  if (code === 'KeyS') state.down = value;
  if (code === 'KeyA') state.left = value;
  if (code === 'KeyD') state.right = value;
  if (code === 'Space') state.shoot = value;
}

export function startInputCapture(onSend) {
  sendFn = onSend;
  window.addEventListener('keydown', ev=>{
    key(current, ev.code, true);
    ev.preventDefault();
    sendNow();
  });
  window.addEventListener('keyup', ev=>{ key(current, ev.code, false); sendNow(); });
  setInterval(()=>sendNow(), 1000/30);
}

function sendNow(){ if (sendFn) sendFn(current); }

// allow external modules to set/clear the send function (used on logout)
export function setSendFn(fn){ sendFn = fn; }
