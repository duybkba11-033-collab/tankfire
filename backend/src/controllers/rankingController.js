const pool = require('../db');
const { parsePagination } = require('./pagination');

async function listRanking(req, res) {
  const { page, limit, offset } = parsePagination(req.query);
  const [[count], [rows]] = await Promise.all([
    pool.query('SELECT COUNT(*) AS total FROM ranking'),
    pool.execute(
      `SELECT user_id, username, rating, matches_played, matches_won,
        CASE WHEN matches_played = 0 THEN 0 ELSE matches_won / matches_played END AS win_rate,
        last_played_at
       FROM ranking
       ORDER BY rating DESC, matches_won DESC, user_id ASC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    )
  ]);
  const items = rows.map((row, index) => ({
    ...row,
    rank_position: offset + index + 1,
    rating: Number(row.rating),
    win_rate: Number(row.win_rate)
  }));
  return res.json({ items, total: Number(count[0].total), page, limit });
}

module.exports = { listRanking };
