import { apiRequest } from '../api.js';
import { createRankingComponent } from './components/rankingTable.js';
import { closeDataPanels } from './view.js';

export function initRanking() {
  const panel = document.getElementById('ranking-panel');
  const component = createRankingComponent(panel);
  let rows = [];

  async function load(page = 1) {
    try {
      const result = await apiRequest(`/ranking?page=${page}&limit=10`);
      rows = result.items;
      component.setPage(result);
    } catch (error) {
      component.showError(error.message);
    }
  }

  component.onNavigate(load);
  component.onDetail((userId) => {
    const player = rows.find((row) => String(row.user_id) === userId);
    if (!player) return;
    component.showDetail([
      ['Player', player.username],
      ['Rank', player.rank_position],
      ['ELO rating', player.rating],
      ['Matches played', player.matches_played],
      ['Matches won', player.matches_won],
      ['Win rate', `${(player.win_rate * 100).toFixed(1)}%`]
    ]);
  });

  document.getElementById('btn-ranking').addEventListener('click', () => {
    closeDataPanels();
    panel.classList.remove('hidden');
    load();
  });
}
