const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/ranking
router.get('/ranking', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT user_id, username, total_score, matches_played, matches_won, win_rate, last_played_at FROM ranking ORDER BY total_score DESC'
    );

    const result = rows.map((r, idx) => ({
      rank_position: idx + 1,
      username: r.username,
      total_score: r.total_score,
      matches_played: r.matches_played,
      matches_won: r.matches_won,
      win_rate: Number(r.win_rate),
      last_played_at: r.last_played_at
    }));

    res.json(result);
  } catch (err) {
    console.error('ranking list error', err);
    res.status(500).json({ error: 'db_error' });
  }
});

module.exports = router;
