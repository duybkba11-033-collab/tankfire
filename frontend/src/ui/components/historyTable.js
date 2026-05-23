export function createHistoryComponent(rootEl){
  if (typeof rootEl === 'string') rootEl = document.getElementById(rootEl);
  if (!rootEl) throw new Error('createHistoryComponent: root element not found');

  let allRows = [];
  let currentPage = 1;
  const rowsPerPage = 5;

  rootEl.innerHTML = `
    <div class="top-row">
      <h3>Match History</h3>
      <div class="subtitle">Recent games</div>
    </div>
    <div class="table-wrap">
      <table id="history-table">
        <thead><tr><th>#</th><th>match_id</th><th>player1</th><th>player2</th><th>started_at</th><th>actions</th></tr></thead>
        <tbody></tbody>
      </table>
    </div>
    <div class="pagination-ctrl" style="display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 15px;">
      <button id="hist-prev" class="secondary" style="padding: 5px 15px;">&lt;</button>
      <span id="hist-page-info" style="font-family: 'Teko'; font-size: 20px;">Page 1</span>
      <button id="hist-next" class="secondary" style="padding: 5px 15px;">&gt;</button>
    </div>
    <div id="history-detail" class="hidden detail-panel"></div>
    <div class="panel-actions"><button id="history-close" class="secondary">Close</button></div>
  `;

  const tableBody = rootEl.querySelector('#history-table tbody');
  const detailEl = rootEl.querySelector('#history-detail');
  const closeBtn = rootEl.querySelector('#history-close');
  const prevBtn = rootEl.querySelector('#hist-prev');
  const nextBtn = rootEl.querySelector('#hist-next');
  const pageInfo = rootEl.querySelector('#hist-page-info');

  let detailCb = null;
  let closeCb = null;

  function render() {
    tableBody.innerHTML = '';
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedItems = allRows.slice(start, end);

    paginatedItems.forEach((r, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${start + idx + 1}</td>
        <td>${r.match_id}</td>
        <td>${r.player1_name||''}</td>
        <td>${r.player2_name||''}</td>
        <td>${new Date(r.started_at).toLocaleString()}</td>
        <td><button data-id="${r.match_id}" class="detail-btn detail-button">Chi tiết</button></td>
      `;
      tableBody.appendChild(tr);
    });

    pageInfo.innerText = `Page ${currentPage} / ${Math.ceil(allRows.length / rowsPerPage) || 1}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage >= Math.ceil(allRows.length / rowsPerPage);
  }

  // Event Listeners cho phân trang
  prevBtn.addEventListener('click', () => { if(currentPage > 1) { currentPage--; render(); } });
  nextBtn.addEventListener('click', () => { if(currentPage < Math.ceil(allRows.length / rowsPerPage)) { currentPage++; render(); } });

  tableBody.addEventListener('click', (e) => {
    const btn = e.target.closest('.detail-btn');
    if (!btn) return;
    if (detailCb) detailCb(btn.getAttribute('data-id'), btn);
  });

  closeBtn.addEventListener('click', () => { if (closeCb) closeCb(); });

  return {
    root: rootEl,
    setRows: (rows) => { allRows = rows; currentPage = 1; render(); },
    showDetail: (html) => { detailEl.classList.remove('hidden'); detailEl.innerHTML = html; },
    hideDetail: () => detailEl.classList.add('hidden'),
    show: () => rootEl.classList.remove('hidden'),
    hide: () => rootEl.classList.add('hidden'),
    onDetail: (cb) => { detailCb = cb; },
    onClose: (cb) => { closeCb = cb; }
  };
}