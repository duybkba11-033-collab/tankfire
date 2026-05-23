import { createRankingComponent } from './components/rankingTable.js';

export function initRanking() {
  const btn = document.getElementById('btn-ranking');
  const panel = document.getElementById('ranking-panel');

  const comp = createRankingComponent(panel);

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

  let cachedRows = [];

  async function fetchList() {
    try {
      const res = await fetch(`${API_BASE}/api/ranking`);
      if (!res.ok) throw new Error('Failed');
      const rows = await res.json();
      cachedRows = rows;
      comp.setRows(rows);
    } catch (err) {
      console.error('fetch ranking', err);
      comp.setRows([{ rank_position: 'error', username: 'Error', total_score: 0, matches_played: 0, matches_won: 0, win_rate: 0 }]);
    }
  }

  comp.onDetail((id)=>{
    if (!id) return;
    const row = cachedRows.find(r => String(r.username) === String(id) || String(r.user_id) === String(id));
    if (!row) return comp.showDetail('<div>Không tìm thấy thông tin</div>');
    comp.showDetail(`<h4>${row.username}</h4>
      <p>Rank: ${row.rank_position}</p>
      <p>Total score: ${row.total_score}</p>
      <p>Matches played: ${row.matches_played}</p>
      <p>Matches won: ${row.matches_won}</p>
      <p>Win rate: ${Number(row.win_rate).toFixed(4)}</p>
      <p>Last played: ${row.last_played_at ? new Date(row.last_played_at).toLocaleString() : 'N/A'}</p>`);
  });

  comp.onClose(()=>{ panel.classList.add('hidden'); comp.hideDetail(); });

  btn.addEventListener('click', ()=>{
    panel.classList.remove('hidden');
    fetchList();
  });
}
