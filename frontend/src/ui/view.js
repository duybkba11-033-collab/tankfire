const PRIMARY_VIEWS = ['auth', 'lobby', 'game'];

export function showView(viewId) {
  for (const id of PRIMARY_VIEWS)
    document.getElementById(id).classList.toggle('hidden', id !== viewId);
  document.getElementById('player-header').classList.toggle('hidden', viewId === 'auth');
}

export function closeDataPanels() {
  document.getElementById('history-panel').classList.add('hidden');
  document.getElementById('ranking-panel').classList.add('hidden');
}

export function showPlayer(user) {
  document.getElementById('player-name').textContent = user.username;
}
