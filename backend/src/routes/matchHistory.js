const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/match-history
router.get('/match-history', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT match_id, player1_name, player2_name, winner_name, score1, score2, started_at, duration_sec FROM match_history ORDER BY started_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('match-history list error', err);
    res.status(500).json({ error: 'db_error' });
  }
});

// GET /api/match-history/:match_id
router.get('/match-history/:match_id', async (req, res) => {
  const matchId = req.params.match_id;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM match_history WHERE match_id = ? LIMIT 1', [matchId]
    );
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'not_found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('match-history get error', err);
    res.status(500).json({ error: 'db_error' });
  }
});

module.exports = router;
