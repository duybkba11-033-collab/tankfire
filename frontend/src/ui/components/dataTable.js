function element(tag, { className, text } = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = String(text);
  return node;
}

export function createTablePanel(root, { title, subtitle, headers, renderCells }) {
  const header = element('header', { className: 'panel-header' });
  const headingGroup = element('div');
  headingGroup.append(
    element('p', { className: 'eyebrow', text: subtitle }),
    element('h2', { text: title })
  );
  const closeButton = element('button', { className: 'button button-quiet', text: 'Close' });
  closeButton.type = 'button';
  header.append(headingGroup, closeButton);

  const tableWrap = element('div', { className: 'table-wrap' });
  const table = element('table');
  const head = element('thead');
  const headRow = element('tr');
  for (const label of headers) headRow.appendChild(element('th', { text: label }));
  head.appendChild(headRow);
  const body = element('tbody');
  table.append(head, body);
  tableWrap.appendChild(table);

  const detail = element('div', { className: 'detail-panel hidden' });
  const footer = element('footer', { className: 'panel-footer' });
  const pagination = element('div', { className: 'pagination' });
  const previous = element('button', { className: 'button button-secondary', text: 'Previous' });
  const pageInfo = element('span', { text: 'Page 1' });
  const next = element('button', { className: 'button button-secondary', text: 'Next' });
  previous.type = next.type = 'button';
  pagination.append(previous, pageInfo, next);
  footer.appendChild(pagination);
  root.replaceChildren(header, tableWrap, detail, footer);

  let detailHandler = null;
  let navigateHandler = null;
  let currentPage = 1;
  let totalPages = 1;

  body.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-detail-id]');
    if (button && detailHandler) detailHandler(button.dataset.detailId);
  });
  closeButton.addEventListener('click', () => root.classList.add('hidden'));
  previous.addEventListener('click', () => {
    if (currentPage > 1 && navigateHandler) navigateHandler(currentPage - 1);
  });
  next.addEventListener('click', () => {
    if (currentPage < totalPages && navigateHandler) navigateHandler(currentPage + 1);
  });

  return {
    setPage({ items, total, page, limit }) {
      body.replaceChildren();
      currentPage = page;
      totalPages = Math.max(1, Math.ceil(total / limit));
      if (!items.length) {
        const row = element('tr');
        const cell = element('td', { className: 'empty-row', text: 'No records found.' });
        cell.colSpan = headers.length;
        row.appendChild(cell);
        body.appendChild(row);
      }
      items.forEach((item, index) => {
        const row = element('tr');
        for (const cell of renderCells(item, (page - 1) * limit + index + 1)) {
          if (cell && cell.nodeType) row.appendChild(cell);
          else row.appendChild(element('td', { text: cell ?? '' }));
        }
        body.appendChild(row);
      });
      pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
      previous.disabled = currentPage <= 1;
      next.disabled = currentPage >= totalPages;
    },
    showDetail(fields) {
      const grid = element('div', { className: 'detail-grid' });
      for (const [label, value] of fields) {
        const field = element('div');
        field.append(element('span', { text: label }), element('strong', { text: value ?? '-' }));
        grid.appendChild(field);
      }
      detail.replaceChildren(grid);
      detail.classList.remove('hidden');
    },
    showError(message) {
      detail.replaceChildren(element('p', { text: message }));
      detail.classList.remove('hidden');
    },
    onDetail(handler) {
      detailHandler = handler;
    },
    onNavigate(handler) {
      navigateHandler = handler;
    }
  };
}

export function detailButton(id) {
  const cell = element('td');
  const button = element('button', {
    className: 'button button-secondary table-action',
    text: 'Details'
  });
  button.type = 'button';
  button.dataset.detailId = id;
  cell.appendChild(button);
  return cell;
}
