-- Create users table for tankfire
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Match history table
CREATE TABLE IF NOT EXISTS match_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  match_id VARCHAR(50) NOT NULL UNIQUE,
  player1_name VARCHAR(50),
  player2_name VARCHAR(50),
  winner_name VARCHAR(50),
  score1 INT,
  score2 INT,
  started_at DATETIME,
  duration_sec INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Ranking table: stores pre-aggregated leaderboard stats per user
CREATE TABLE IF NOT EXISTS ranking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  username VARCHAR(100) NOT NULL,
  total_score BIGINT DEFAULT 0,
  matches_played INT DEFAULT 0,
  matches_won INT DEFAULT 0,
  -- win_rate: stored as decimal between 0 and 1 (matches_won / matches_played). When matches_played = 0 -> 0
  win_rate DECIMAL(6,4) AS (CASE WHEN matches_played = 0 THEN 0 ELSE (matches_won / matches_played) END) STORED,
  last_played_at DATETIME DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY ux_ranking_user (user_id),
  INDEX idx_total_score (total_score),
  CONSTRAINT fk_ranking_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
