import { createTablePanel, detailButton } from './dataTable.js';

export function createRankingComponent(root) {
  return createTablePanel(root, {
    title: 'Leaderboard',
    subtitle: 'ELO rating',
    headers: ['Rank', 'Player', 'Rating', 'Played', 'Won', 'Win rate', ''],
    renderCells: (player) => [
      player.rank_position,
      player.username,
      player.rating,
      player.matches_played,
      player.matches_won,
      `${(player.win_rate * 100).toFixed(1)}%`,
      detailButton(String(player.user_id))
    ]
  });
}
