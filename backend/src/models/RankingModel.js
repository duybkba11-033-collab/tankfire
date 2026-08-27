class RankingModel {
  constructor({ userId, username, totalScore, matchesPlayed = 1, matchesWon = 0, lastPlayedAt }) {
    this.userId = userId;
    this.username = username || null;
    this.totalScore = typeof totalScore === 'number' ? totalScore : 0;
    this.matchesPlayed = matchesPlayed;
    this.matchesWon = matchesWon;
    this.lastPlayedAt = lastPlayedAt || new Date();
  }

  upsert(pool) {
    const upsertSql = `INSERT INTO ranking (user_id, username, total_score, matches_played, matches_won, last_played_at)
      VALUES (?, ?, ?, 1, ?, ?)
      ON DUPLICATE KEY UPDATE
        username = VALUES(username),
        total_score = total_score + VALUES(total_score),
        matches_played = matches_played + 1,
        matches_won = matches_won + VALUES(matches_won),
        last_played_at = VALUES(last_played_at)`;

    return pool.query(upsertSql, [this.userId, this.username, this.totalScore, this.matchesWon, this.lastPlayedAt]);
  }
}

module.exports = RankingModel;
