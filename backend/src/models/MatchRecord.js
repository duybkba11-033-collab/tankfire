class MatchRecord {
  constructor({ matchId, player1_name, player2_name, winner_name, score1, score2, startedAt, durationSec }) {
    this.matchId = matchId;
    this.player1_name = player1_name || null;
    this.player2_name = player2_name || null;
    this.winner_name = winner_name || null;
    this.score1 = typeof score1 === 'number' ? score1 : 0;
    this.score2 = typeof score2 === 'number' ? score2 : 0;
    this.startedAt = startedAt || new Date();
    this.durationSec = typeof durationSec === 'number' ? durationSec : 0;
  }

  persist(pool) {
    return pool.query(
      'INSERT INTO match_history (match_id, player1_name, player2_name, winner_name, score1, score2, started_at, duration_sec) VALUES (?,?,?,?,?,?,?,?)',
      [this.matchId, this.player1_name, this.player2_name, this.winner_name, this.score1, this.score2, this.startedAt, this.durationSec]
    );
  }
}

module.exports = MatchRecord;
