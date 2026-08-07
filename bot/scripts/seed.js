/**
 * Bazaga soxta foydalanuvchilar yozadi:  npm run seed [soni]
 *
 * Nima uchun: API'ni va statistikani real Telegram trafigisiz sinash uchun.
 * Soxta yozuvlar `source = 'seed'` bilan belgilanadi — keyin bir buyruq
 * bilan tozalash mumkin:
 *   DELETE FROM users WHERE source = 'seed';
 *
 * ⚠️ Production bazasida ishlatmang.
 */

const pool = require('../src/db/pool');
const { STAGE_ORDER } = require('../src/funnel');
const { IS_LOCAL_DB } = require('../src/config');
const logger = require('../src/utils/logger');

const FIRST = ['Gulnora', 'Jamshid', 'Nodira', 'Bekzod', 'Dilshoda', 'Sardor', 'Aziza', 'Rustam'];
const LAST = ['Rahimova', 'Karimov', 'Tursunova', 'Ergashev', 'Yo\'ldosheva', 'Toshmatov'];
const SOURCES = ['seed', 'seed', 'seed'];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function seed(count) {
  if (!IS_LOCAL_DB) {
    throw new Error('seed faqat local baza uchun. DATABASE_URL localhost\'ga ishora qilmayapti.');
  }

  const rows = [];
  for (let i = 0; i < count; i += 1) {
    const telegramId = 900_000_000 + i;
    const stage = pick(STAGE_ORDER);
    const hasPhone = ['phone_shared', 'completed'].includes(stage);

    rows.push([
      telegramId,
      `user_${telegramId}`,
      pick(FIRST),
      pick(LAST),
      pick(['uz', 'ru', 'en']),
      Math.random() < 0.1, // is_premium
      stage,
      stage !== 'started' && stage !== 'awaiting_subscription',
      hasPhone ? `+9989${String(10_000_000 + i).slice(0, 8)}` : null,
      pick(SOURCES),
    ]);
  }

  const values = rows
    .map((_, i) => {
      const b = i * 10;
      return `($${b + 1}, $${b + 2}, $${b + 3}, $${b + 4}, $${b + 5}, $${b + 6}, $${b + 7}, $${b + 8}, $${b + 9}, $${b + 10}, 1)`;
    })
    .join(', ');

  await pool.query(
    `INSERT INTO users (
       telegram_id, username, first_name, last_name, language_code,
       is_premium, funnel_stage, is_subscribed, phone_number, source, start_count
     ) VALUES ${values}
     ON CONFLICT (telegram_id) DO NOTHING`,
    rows.flat()
  );

  logger.info(`${count} ta soxta foydalanuvchi qo'shildi (source='seed').`);
  logger.info('Tozalash: DELETE FROM users WHERE source = \'seed\';');
}

const count = Math.min(5_000, Number(process.argv[2]) || 200);

seed(count)
  .then(() => pool.end())
  .catch(async (err) => {
    logger.error('Seed xatosi', { err: err.message });
    await pool.end().catch(() => {});
    process.exit(1);
  });
