import { getToken } from './login.js';

export function initLobby() {
  const btn = document.getElementById('btn-find');
  const status = document.getElementById('status');

  btn.onclick = async ()=>{
    const token = getToken();
    if (!token) return alert('Not logged in');
    status.innerText = 'Searching for match...';
    // Create socket in socket module; emit event
    const ev = new CustomEvent('find_match');
    window.dispatchEvent(ev);
  };
}
