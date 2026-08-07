/**
 * Migratsiyalarni ishga tushiradi:  npm run db:migrate
 *
 * - `migrations/` papkasidagi .sql fayllar nomi bo'yicha tartibda bajariladi.
 * - Har biri bir marta bajariladi (schema_migrations jadvalida belgilanadi).
 * - Har bir migratsiya TRANZAKSIYA ichida: yarim bajarilgan holat qolmaydi.
 * - Bir vaqtda ikki nusxa ishga tushsa, advisory lock ikkinchisini kutdiradi.
 */

const fs = require('fs');
const path = require('path');
const pool = require('./pool');
const logger = require('../utils/logger');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');
const LOCK_ID = 8823490112; // ixtiyoriy, lekin barcha nusxalarda bir xil

async function ensureTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function migrate() {
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const client = await pool.connect();
  try {
    await client.query('SELECT pg_advisory_lock($1)', [LOCK_ID]);
    await ensureTable(client);

    const { rows } = await client.query('SELECT name FROM schema_migrations');
    const applied = new Set(rows.map((r) => r.name));

    let count = 0;
    for (const file of files) {
      if (applied.has(file)) {
        logger.debug(`— ${file} (allaqachon bajarilgan)`);
        continue;
      }

      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
        await client.query('COMMIT');
        logger.info(`✓ ${file}`);
        count += 1;
      } catch (err) {
        await client.query('ROLLBACK');
        throw new Error(`${file} bajarilmadi: ${err.message}`);
      }
    }

    logger.info(count ? `Tayyor — ${count} ta migratsiya qo'llandi.` : 'Baza allaqachon eng so\'nggi holatda.');
  } finally {
    await client.query('SELECT pg_advisory_unlock($1)', [LOCK_ID]).catch(() => {});
    client.release();
  }
}

if (require.main === module) {
  migrate()
    .then(() => pool.end())
    .catch(async (err) => {
      logger.error('Migratsiya xatosi', err);
      await pool.end().catch(() => {});
      process.exit(1);
    });
}

module.exports = { migrate };
