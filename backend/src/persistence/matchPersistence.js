const DEFAULT_RATING = 1000;
const ELO_K_FACTOR = 32;

function nextRatings(ratingA, ratingB, scoreA) {
  const expectedA = 1 / (1 + 10 ** ((ratingB - ratingA) / 400));
  const change = Math.round(ELO_K_FACTOR * (scoreA - expectedA));
  return [ratingA + change, ratingB - change];
}

async function persistMatch(pool, match) {
  if (match.endReason === 'DRAW') return false;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const [player1, player2] = match.players;
    await connection.execute(
      `INSERT INTO match_history (
        match_id, player1_id, player2_id, winner_id, player1_name, player2_name,
        winner_name, end_reason, score1, score2, started_at, ended_at, duration_sec
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        match.matchId,
        player1.userId,
        player2.userId,
        match.winner ? match.winner.userId : null,
        player1.username,
        player2.username,
        match.winner ? match.winner.username : null,
        match.endReason,
        player1.finalScore,
        player2.finalScore,
        match.startedAt,
        match.endedAt,
        match.durationSec
      ]
    );

    const [rows] = await connection.execute(
      'SELECT user_id, rating FROM ranking WHERE user_id IN (?, ?) FOR UPDATE',
      [player1.userId, player2.userId]
    );
    const ratings = new Map(rows.map((row) => [row.user_id, Number(row.rating)]));
    const rating1 = ratings.get(player1.userId) ?? DEFAULT_RATING;
    const rating2 = ratings.get(player2.userId) ?? DEFAULT_RATING;
    const score1 = match.winner && match.winner.userId === player1.userId ? 1 : 0;
    const [next1, next2] = nextRatings(rating1, rating2, score1);

    await upsertRanking(connection, player1, next1, score1, match.endedAt);
    await upsertRanking(connection, player2, next2, 1 - score1, match.endedAt);
    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') return true;
    throw error;
  } finally {
    connection.release();
  }
}

async function upsertRanking(connection, player, rating, won, playedAt) {
  await connection.execute(
    `INSERT INTO ranking (user_id, username, rating, matches_played, matches_won, last_played_at)
     VALUES (?, ?, ?, 1, ?, ?)
     ON DUPLICATE KEY UPDATE
       username = VALUES(username),
       rating = VALUES(rating),
       matches_played = matches_played + 1,
       matches_won = matches_won + VALUES(matches_won),
       last_played_at = VALUES(last_played_at)`,
    [player.userId, player.username, rating, won, playedAt]
  );
}

async function rebuildRanking(pool) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [matches] = await connection.query(
      `SELECT player1_id, player2_id, winner_id, player1_name, player2_name, ended_at
       FROM match_history
       WHERE end_reason IN ('WIN', 'ABORTED')
       ORDER BY ended_at ASC, id ASC`
    );
    const ranking = new Map();
    for (const match of matches) {
      const first = getRankingEntry(ranking, match.player1_id, match.player1_name);
      const second = getRankingEntry(ranking, match.player2_id, match.player2_name);
      const score1 = match.winner_id === match.player1_id ? 1 : 0;
      [first.rating, second.rating] = nextRatings(first.rating, second.rating, score1);
      first.played += 1;
      second.played += 1;
      first.won += score1;
      second.won += 1 - score1;
      first.lastPlayedAt = match.ended_at;
      second.lastPlayedAt = match.ended_at;
    }

    await connection.query('DELETE FROM ranking');
    for (const entry of ranking.values()) {
      await connection.execute(
        `INSERT INTO ranking
         (user_id, username, rating, matches_played, matches_won, last_played_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [entry.userId, entry.username, entry.rating, entry.played, entry.won, entry.lastPlayedAt]
      );
    }
    await connection.commit();
    return ranking.size;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

function getRankingEntry(ranking, userId, username) {
  if (!ranking.has(userId)) {
    ranking.set(userId, {
      userId,
      username,
      rating: DEFAULT_RATING,
      played: 0,
      won: 0,
      lastPlayedAt: null
    });
  }
  return ranking.get(userId);
}

module.exports = { nextRatings, persistMatch, rebuildRanking };
