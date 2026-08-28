import { apiRequest } from '../api.js';
import { createHistoryComponent } from './components/historyTable.js';
import { closeDataPanels } from './view.js';

export function initHistory() {
  const panel = document.getElementById('history-panel');
  const component = createHistoryComponent(panel);

  async function load(page = 1) {
    try {
      component.setPage(await apiRequest(`/match-history?page=${page}&limit=10`));
    } catch (error) {
      component.showError(error.message);
    }
  }

  component.onNavigate(load);
  component.onDetail(async (matchId) => {
    try {
      const match = await apiRequest(`/match-history/${encodeURIComponent(matchId)}`);
      component.showDetail([
        ['Match', match.match_id],
        ['Player one', `${match.player1_name} (${match.score1})`],
        ['Player two', `${match.player2_name} (${match.score2})`],
        ['Winner', match.winner_name || 'None'],
        ['End reason', match.end_reason],
        ['Duration', `${match.duration_sec} seconds`]
      ]);
    } catch (error) {
      component.showError(error.message);
    }
  });

  document.getElementById('btn-history').addEventListener('click', () => {
    closeDataPanels();
    panel.classList.remove('hidden');
    load();
  });
}
