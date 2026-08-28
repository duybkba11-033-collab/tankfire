const fs = require('node:fs');
const path = require('node:path');
const mysql = require('mysql2/promise');
require('dotenv').config({ quiet: true });

async function getColumns(connection, database, table) {
  const [rows] = await connection.execute(
    `SELECT COLUMN_NAME AS column_name, COLUMN_TYPE AS column_type
     FROM information_schema.columns
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
    [database, table]
  );
  return new Map(rows.map((row) => [row.column_name, row.column_type]));
}

async function addColumn(connection, columns, table, name, definition) {
  if (columns.has(name)) return;
  await connection.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${name}\` ${definition}`);
  columns.set(name, definition);
}

async function addIndex(connection, database, table, indexName, expression) {
  const [rows] = await connection.execute(
    `SELECT 1 FROM information_schema.statistics
     WHERE table_schema = ? AND table_name = ? AND index_name = ? LIMIT 1`,
    [database, table, indexName]
  );
  if (!rows.length)
    await connection.query(`ALTER TABLE \`${table}\` ADD INDEX \`${indexName}\` (${expression})`);
}

async function addForeignKey(connection, database, table, constraintName, clause) {
  const [rows] = await connection.execute(
    `SELECT 1 FROM information_schema.table_constraints
     WHERE constraint_schema = ? AND table_name = ? AND constraint_name = ? LIMIT 1`,
    [database, table, constraintName]
  );
  if (!rows.length) {
    await connection.query(
      `ALTER TABLE \`${table}\` ADD CONSTRAINT \`${constraintName}\` ${clause}`
    );
  }
}

async function migrateExistingSchema(connection, database) {
  const userColumns = await getColumns(connection, database, 'users');
  if (userColumns.has('password') && !userColumns.has('password_hash')) {
    await connection.query(
      'ALTER TABLE `users` CHANGE COLUMN `password` `password_hash` VARCHAR(255) NOT NULL'
    );
    userColumns.delete('password');
    userColumns.set('password_hash', 'varchar(255)');
  }

  const userIdType = (userColumns.get('id') || 'INT').toUpperCase();
  const historyColumns = await getColumns(connection, database, 'match_history');
  await addColumn(connection, historyColumns, 'match_history', 'player1_id', `${userIdType} NULL`);
  await addColumn(connection, historyColumns, 'match_history', 'player2_id', `${userIdType} NULL`);
  await addColumn(connection, historyColumns, 'match_history', 'winner_id', `${userIdType} NULL`);
  await addColumn(
    connection,
    historyColumns,
    'match_history',
    'end_reason',
    "ENUM('WIN', 'ABORTED', 'DRAW') NULL"
  );
  await addColumn(connection, historyColumns, 'match_history', 'ended_at', 'DATETIME NULL');

  await connection.query(
    `UPDATE match_history mh
     LEFT JOIN users p1 ON p1.username = mh.player1_name
     LEFT JOIN users p2 ON p2.username = mh.player2_name
     LEFT JOIN users winner ON winner.username = mh.winner_name
     SET mh.player1_id = COALESCE(mh.player1_id, p1.id),
         mh.player2_id = COALESCE(mh.player2_id, p2.id),
         mh.winner_id = COALESCE(mh.winner_id, winner.id),
         mh.end_reason = COALESCE(mh.end_reason, IF(mh.winner_name IS NULL, 'DRAW', 'WIN')),
         mh.ended_at = COALESCE(mh.ended_at, DATE_ADD(mh.started_at, INTERVAL mh.duration_sec SECOND))`
  );

  await addIndex(connection, database, 'match_history', 'idx_match_started_at', '`started_at`');
  await addIndex(connection, database, 'match_history', 'idx_match_player1', '`player1_id`');
  await addIndex(connection, database, 'match_history', 'idx_match_player2', '`player2_id`');
  await addForeignKey(
    connection,
    database,
    'match_history',
    'fk_match_player1',
    'FOREIGN KEY (`player1_id`) REFERENCES `users` (`id`)'
  );
  await addForeignKey(
    connection,
    database,
    'match_history',
    'fk_match_player2',
    'FOREIGN KEY (`player2_id`) REFERENCES `users` (`id`)'
  );
  await addForeignKey(
    connection,
    database,
    'match_history',
    'fk_match_winner',
    'FOREIGN KEY (`winner_id`) REFERENCES `users` (`id`)'
  );

  const rankingColumns = await getColumns(connection, database, 'ranking');
  await addColumn(connection, rankingColumns, 'ranking', 'rating', 'INT NOT NULL DEFAULT 1000');
  await addIndex(connection, database, 'ranking', 'idx_ranking_rating', '`rating` DESC');
}

async function setupDatabase() {
  const database = process.env.DB_NAME || 'tankfire';
  if (!/^[A-Za-z0-9_]+$/.test(database)) throw new Error('DB_NAME contains invalid characters');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || ''
  });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    await connection.query(`USE \`${database}\``);
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    const statements = schema
      .split(';')
      .map((statement) => statement.trim())
      .filter(Boolean);
    for (const statement of statements) await connection.query(statement);
    await migrateExistingSchema(connection, database);
    console.log(`Database '${database}' is ready`);
  } finally {
    await connection.end();
  }
}

setupDatabase().catch((error) => {
  console.error('Database setup failed:', error.message);
  process.exitCode = 1;
});
