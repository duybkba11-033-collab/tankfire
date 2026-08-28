const pool = require('../src/db');
const { rebuildRanking } = require('../src/persistence/matchPersistence');

async function main() {
  try {
    const playerCount = await rebuildRanking(pool);
    console.log(`Ranking rebuilt for ${playerCount} players`);
  } catch (error) {
    console.error('Ranking rebuild failed:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
