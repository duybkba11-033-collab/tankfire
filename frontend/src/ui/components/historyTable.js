import { createTablePanel, detailButton } from './dataTable.js';

export function createHistoryComponent(root) {
  return createTablePanel(root, {
    title: 'Match history',
    subtitle: 'Completed battles',
    headers: ['#', 'Match', 'Player one', 'Player two', 'Result', 'Started', ''],
    renderCells: (match, index) => [
      index,
      match.match_id,
      match.player1_name,
      match.player2_name,
      match.end_reason,
      new Date(match.started_at).toLocaleString(),
      detailButton(match.match_id)
    ]
  });
}
