/**
 * PostgreSQL ulanish pool'i.
 *
 * Bu yerdagi timeout'lar — botning "osilib qolmasligi"ning asosiy kafolati.
 * Baza sekinlashsa yoki tushib qolsa, so'rov cheksiz kutmaydi: 5 soniyada
 * uziladi, handler xatoni ushlaydi va foydalanuvchi baribir javob oladi.
 */

const { Pool } = require('pg');
const { DATABASE_URL, IS_LOCAL_DB } = require('../config');
const logger = require('../utils/logger');

const pool = new Pool({
  connectionString: DATABASE_URL,
  // Local Postgres'da TLS yo'q; tashqi (managed) bazada sertifikat tekshiriladi.
  ssl: IS_LOCAL_DB ? false : { rejectUnauthorized: true },

  // Pool o'lchami: Telegram update'lari qisqa so'rovlar qiladi, 15 ta ulanish
  // minglab foydalanuvchiga yetadi. Ko'paytirish DB tomonda cheklovga uriladi.
  max: 15,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 3_000,

  // DB tomonda so'rovni uzadi (asosiy himoya)
  statement_timeout: 5_000,
  // Klient tomonda uzadi (statement_timeout ishlamay qolgan holat uchun)
  query_timeout: 5_000,
});

// Bo'sh turgan ulanishdagi xato process'ni yiqitmasligi kerak
pool.on('error', (err) => {
  logger.error('Kutilmagan PostgreSQL xatosi (idle client)', err);
});

/** Baza tirikligini tekshiradi — /healthz uchun. */
async function ping() {
  const started = Date.now();
  await pool.query('SELECT 1');
  return Date.now() - started;
}

module.exports = pool;
module.exports.ping = ping;
