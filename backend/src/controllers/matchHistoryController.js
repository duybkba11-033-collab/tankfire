const pool = require('../db');
const { parsePagination } = require('./pagination');

const SELECT_HISTORY = `
  SELECT mh.match_id,
    COALESCE(mh.player1_name, p1.username) AS player1_name,
    COALESCE(mh.player2_name, p2.username) AS player2_name,
    COALESCE(mh.winner_name, winner.username) AS winner_name,
    mh.end_reason, mh.score1, mh.score2, mh.started_at, mh.ended_at, mh.duration_sec
  FROM match_history mh
  LEFT JOIN users p1 ON p1.id = mh.player1_id
  LEFT JOIN users p2 ON p2.id = mh.player2_id
  LEFT JOIN users winner ON winner.id = mh.winner_id`;

async function listMatchHistory(req, res) {
  const { page, limit, offset } = parsePagination(req.query);
  const [[count], [items]] = await Promise.all([
    pool.query('SELECT COUNT(*) AS total FROM match_history'),
    pool.execute(`${SELECT_HISTORY} ORDER BY mh.started_at DESC, mh.id DESC LIMIT ? OFFSET ?`, [
      limit,
      offset
    ])
  ]);
  return res.json({ items, total: Number(count[0].total), page, limit });
}

async function getMatchHistory(req, res) {
  const [rows] = await pool.execute(`${SELECT_HISTORY} WHERE mh.match_id = ? LIMIT 1`, [
    req.params.match_id
  ]);
  if (!rows.length) return res.status(404).json({ message: 'Match not found' });
  return res.json(rows[0]);
}

module.exports = { getMatchHistory, listMatchHistory };
