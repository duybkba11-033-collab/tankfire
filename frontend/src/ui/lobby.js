import { getToken } from './login.js';

export function initLobby() {
  const btn = document.getElementById('btn-find');
  const status = document.getElementById('status');

  // map selector UI (insert before status)
  const mapSelContainer = document.createElement('div');
  mapSelContainer.style.marginTop = '10px';
  mapSelContainer.innerHTML = `
    <label style="display:block;margin-bottom:6px;font-size:14px">Select map:</label>
    <select id="map-select" style="padding:8px;border-radius:4px;background:rgba(0,0,0,0.4);color:var(--accent-2);">
      <option value="map1">Ruined Outpost</option>
      <option value="map2">River Crossing</option>
      <option value="map3">Grasslands</option>
    </select>
  `;
  if (status && status.parentNode) status.parentNode.insertBefore(mapSelContainer, status);

  btn.onclick = async ()=>{
    const token = getToken();
    if (!token) return alert('Not logged in');
    status.innerText = 'Searching for match...';
    // get selected map id
    const sel = document.getElementById('map-select');
    const mapId = sel ? sel.value : 'map1';
    // Create socket in socket module; emit event with map
    const ev = new CustomEvent('find_match', { detail: { mapId } });
    window.dispatchEvent(ev);
  };
}
