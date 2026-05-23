const API = 'http://10.103.4.70:3001/api';

function setToken(token, user) {
  localStorage.setItem('tf_token', token);
  localStorage.setItem('tf_user', JSON.stringify(user));
}

function getToken() { return localStorage.getItem('tf_token'); }

export function initUI() {
  const regU = document.getElementById('reg-username');
  const regP = document.getElementById('reg-password');
  const btnReg = document.getElementById('btn-register');
  const logU = document.getElementById('login-username');
  const logP = document.getElementById('login-password');
  const btnLogin = document.getElementById('btn-login');
  const btnLogout = document.getElementById('btn-logout');
  const topLogout = document.getElementById('btn-logout-top');

  btnReg.onclick = async ()=>{
    const res = await fetch(API + '/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username: regU.value, password: regP.value }) });
    const j = await res.json();
    if (res.ok) alert('Registered: '+j.username);
    else alert(j.message || 'Error');
  };

  btnLogin.onclick = async ()=>{
    const res = await fetch(API + '/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username: logU.value, password: logP.value }) });
    const j = await res.json();
    if (res.ok) {
  setToken(j.token, j.user);
  showLobby();
  showPlayerHeader(j.user);
    } else {
      alert(j.message || 'Login failed');
    }
  };

  if (btnLogout) {
    btnLogout.onclick = () => {
      logout();
    };
  }

  if (topLogout) {
    topLogout.onclick = () => { logout(); };
  }

  // auto-login if token present
  const tok = getToken();
  if (tok) {
    showLobby();
    const me = JSON.parse(localStorage.getItem('tf_user')||'null');
    if (me) {
      showPlayerHeader(me);
    }
  }
}

function showPlayerHeader(user){
  try {
    const header = document.getElementById('player-header');
    const nameEl = document.getElementById('player-name');
    if (!header || !nameEl) return;
    const uname = (user && user.username) ? user.username : (typeof user === 'string' ? user : 'Player');
    nameEl.innerText = uname;
    header.classList.remove('hidden');
  } catch(e){ }
}

function hidePlayerHeader(){
  try {
    const header = document.getElementById('player-header');
    const nameEl = document.getElementById('player-name');
    if (!header) return;
    header.classList.add('hidden');
    if (nameEl) nameEl.innerText = '';
  } catch(e){ }
}

function showLobby(){
  document.getElementById('auth').classList.add('hidden');
  document.getElementById('lobby').classList.remove('hidden');
  // show header when in lobby and logged-in
  const tok = getToken(); if (tok) { const me = JSON.parse(localStorage.getItem('tf_user')||'null'); if (me) showPlayerHeader(me); }
}

function showAuth(){
  document.getElementById('auth').classList.remove('hidden');
  document.getElementById('lobby').classList.add('hidden');
  document.getElementById('game').classList.add('hidden');
  // hide persistent header when at auth screen
  hidePlayerHeader();
}

function logout(){
  localStorage.removeItem('tf_token');
  localStorage.removeItem('tf_user');
  // notify other modules (socket) to cleanup
  window.dispatchEvent(new Event('logout'));
  hidePlayerHeader();
  showAuth();
}

export { getToken };

export { logout };
