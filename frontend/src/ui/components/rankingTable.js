// Reusable Ranking Table UI component
// This mirrors the structure and behaviour of createHistoryComponent to keep UI consistent
// Usage: const comp = createRankingComponent(panelElement)
export function createRankingComponent(rootEl){
  if (typeof rootEl === 'string') rootEl = document.getElementById(rootEl);
  if (!rootEl) throw new Error('createRankingComponent: root element not found');

  // Use the same DOM structure and classes as historyTable to reuse CSS
  rootEl.innerHTML = `
    <div class="top-row"><h3>Ranking</h3><div class="subtitle">Top players</div></div>
    <div class="table-wrap">
      <table id="ranking-table">
        <thead><tr><th>#</th><th>username</th><th>total_score</th><th>played</th><th>won</th><th>win_rate (%)</th><th>actions</th></tr></thead>
        <tbody></tbody>
      </table>
    </div>
    <div id="ranking-detail" class="hidden detail-panel"></div>
    <div class="panel-actions"><button id="ranking-close" class="secondary">Close</button></div>
  `;

  const tableBody = rootEl.querySelector('#ranking-table tbody');
  const detailEl = rootEl.querySelector('#ranking-detail');
  const closeBtn = rootEl.querySelector('#ranking-close');

  let detailCb = null;
  let closeCb = null;

  // Delegate click events for detail buttons
  tableBody.addEventListener('click', (e)=>{
    const btn = e.target.closest('.detail-btn');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    if (detailCb) detailCb(id, btn);
  });

  closeBtn.addEventListener('click', ()=>{
    if (closeCb) closeCb();
  });

  function setRows(rows){
    tableBody.innerHTML = '';
    rows.forEach((r, idx)=>{
      const tr = document.createElement('tr');
      // format win_rate as percentage (e.g. 50%)
      function formatPercent(v){
        const num = Number(v) || 0;
        const pct = num * 100;
        // if nearly integer, show without decimals
        if (Math.abs(pct - Math.round(pct)) < 0.005) return String(Math.round(pct)) + '%';
        return pct.toFixed(2) + '%';
      }
      const winRate = formatPercent(r.win_rate);
      const lastPlayed = r.last_played_at ? new Date(r.last_played_at).toLocaleString() : '';
      tr.innerHTML = `<td>${r.rank_position || idx+1}</td>
        <td>${r.username||''}</td>
        <td>${r.total_score||0}</td>
        <td>${r.matches_played||0}</td>
        <td>${r.matches_won||0}</td>
        <td>${winRate}</td>
        <td><button data-id="${r.username||r.user_id||''}" class="detail-btn detail-button">Chi tiết</button></td>`;
      tableBody.appendChild(tr);
    });
  }

  function showDetail(html){
    detailEl.classList.remove('hidden');
    detailEl.innerHTML = html;
  }

  function hideDetail(){ detailEl.classList.add('hidden'); }

  function onDetail(cb){ detailCb = cb; }
  function onClose(cb){ closeCb = cb; }

  return {
    root: rootEl,
    setRows,
    showDetail,
    hideDetail,
    onDetail,
    onClose,
    detailEl,
    tableBody
  };
}
