import { getToken } from './login.js';
import { createHistoryComponent } from './components/historyTable.js';

export function initHistory() {
  const btn = document.getElementById('btn-history');
  const panel = document.getElementById('history-panel');

  // instantiate the reusable component inside the existing panel
  const comp = createHistoryComponent(panel);

  // Resolve API base depending on environment.
  let API_BASE = '';
  try {
    const host = window.location.hostname;
    const port = window.location.port;
    if (port && port !== '3001') {
      API_BASE = `${window.location.protocol}//${host}:3001`;
    } else {
      API_BASE = '';
    }
  } catch (e) {
    API_BASE = '';
  }

  async function fetchList() {
    try {
      const res = await fetch(`${API_BASE}/api/match-history`);
      if (!res.ok) throw new Error('Failed');
      const rows = await res.json();
      comp.setRows(rows);
    } catch (err) {
      console.error('fetch history', err);
      comp.setRows([{ match_id: 'error', player1_name: 'Error', player2_name: '', started_at: '', error: true }]);
    }
  }

  // When a detail button inside the component is clicked, fetch detail and show
  comp.onDetail(async (id)=>{
    if (!id) return;
    try {
      const res = await fetch(`${API_BASE}/api/match-history/` + encodeURIComponent(id));
      if (!res.ok) throw new Error('not found');
      const d = await res.json();
      comp.showDetail(`<h4>Match ${d.match_id}</h4>
        <p>Player1: ${d.player1_name} — Score: ${d.score1}</p>
        <p>Player2: ${d.player2_name} — Score: ${d.score2}</p>
        <p>Winner: ${d.winner_name || 'None'}</p>
        <p>Started at: ${new Date(d.started_at).toLocaleString()}</p>
        <p>Duration (s): ${d.duration_sec}</p>`);
    } catch (err) {
      comp.showDetail('<div>Error loading detail</div>');
    }
  });

  // Close handler: hide panel and any detail
  comp.onClose(()=>{ panel.classList.add('hidden'); comp.hideDetail(); });

  btn.addEventListener('click', ()=>{
    panel.classList.remove('hidden');
    fetchList();
  });
}
