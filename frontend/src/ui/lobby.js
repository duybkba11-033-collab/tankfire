import { getToken } from './login.js';

export function initLobby() {
  const findButton = document.getElementById('btn-find');
  const cancelButton = document.getElementById('btn-cancel-match');
  const status = document.getElementById('status');

  findButton.addEventListener('click', () => {
    if (!getToken()) return;
    const selectedMap = document.querySelector('input[name="map"]:checked');
    window.dispatchEvent(
      new CustomEvent('find_match', {
        detail: { mapId: selectedMap ? selectedMap.value : 'map1' }
      })
    );
  });

  cancelButton.addEventListener('click', () => {
    window.dispatchEvent(new Event('cancel_match'));
  });

  window.addEventListener('matchmaking_status', (event) => {
    const { state, message } = event.detail;
    const searching = state === 'QUEUED' || state === 'CONNECTING';
    findButton.classList.toggle('hidden', searching);
    cancelButton.classList.toggle('hidden', !searching || state === 'CONNECTING');
    document.querySelectorAll('input[name="map"]').forEach((input) => {
      input.disabled = searching;
    });
    status.textContent = message;
  });
}
