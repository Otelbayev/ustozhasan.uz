/**
 * Yuklama testi:  npm run loadtest [soni] [parallel]
 *
 * Soxta /start update'larini botning HAQIQIY quvuriga uzatadi: dedupe,
 * rate limit, handler'lar, bazaga yozish, hodisa navbati — hammasi ishlaydi.
 * Telegram'ga chiquvchi so'rovlar esa stub bilan almashtiriladi (hech kimga
 * xabar ketmaydi, tarmoq kutilmaydi).
 *
 * Nimani ko'rsatadi: bot bir update'ni qancha vaqtda ishlaydi va yuklamada
 * xotira o'sib ketadimi. Tarmoq kechikishi bunga qo'shilmaydi.
 *
 * ⚠️ Faqat local bazada ishlaydi. Yozuvlar source='loadtest' bilan
 *    belgilanadi: DELETE FROM users WHERE source = 'loadtest';
 */

const { Telegram } = require('telegraf');
const config = require('../src/config');
const bot = require('../src/bot');
const pool = require('../src/db/pool');
const eventQueue = require('../src/db/eventQueue');
const logger = require('../src/utils/logger');

if (!config.IS_LOCAL_DB) {
  logger.error('Yuklama testi faqat local baza uchun (DATABASE_URL localhost bo\'lsin).');
  process.exit(1);
}

// ── Telegram'ga chiquvchi barcha so'rovlarni stub bilan almashtiramiz ──
//
// Stub PROTOTIPGA qo'yiladi, `bot.telegram` ga emas: Telegraf har bir update
// uchun yangi `Telegram` nusxasini yaratadi (telegraf.js -> handleUpdate),
// shuning uchun bitta nusxaga qo'yilgan stub handler ichiga yetib bormaydi.
Telegram.prototype.callApi = async (method) => {
  switch (method) {
    case 'sendPhoto':
      return { message_id: 1, photo: [{ file_id: 'STUB_FILE_ID', file_unique_id: 'STUB' }] };
    case 'getChatMember':
      return { status: 'member' };
    case 'getUserProfilePhotos':
      return { total_count: 0, photos: [] };
    case 'getMe':
      return { id: 1, is_bot: true, username: 'loadtest_stub', first_name: 'Stub' };
    default:
      return { message_id: 1 };
  }
};

function makeStartUpdate(i) {
  const userId = 950_000_000 + i;
  return {
    update_id: 1_000_000 + i,
    message: {
      message_id: i,
      date: Math.floor(Date.now() / 1000),
      chat: { id: userId, type: 'private' },
      from: {
        id: userId,
        is_bot: false,
        first_name: `Test${i}`,
        username: `test_${i}`,
        language_code: 'uz',
      },
      text: '/start loadtest',
      entities: [{ type: 'bot_command', offset: 0, length: 6 }],
    },
  };
}

function percentile(sorted, p) {
  return sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))];
}

async function run(total, concurrency) {
  logger.info(`Yuklama testi: ${total} ta update, ${concurrency} tadan parallel…`);

  const memBefore = process.memoryUsage().heapUsed / 1024 / 1024;
  const durations = [];
  let failed = 0;
  const startedAt = Date.now();

  let index = 0;
  async function worker() {
    while (index < total) {
      const i = index;
      index += 1;

      const t0 = Date.now();
      try {
        await bot.handleUpdate(makeStartUpdate(i));
      } catch {
        failed += 1;
      }
      durations.push(Date.now() - t0);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
  await eventQueue.flush();

  const totalMs = Date.now() - startedAt;
  const sorted = durations.slice().sort((a, b) => a - b);
  const memAfter = process.memoryUsage().heapUsed / 1024 / 1024;

  console.log('');
  console.log('  ── Natija ──────────────────────────────');
  console.log(`  Update:        ${total} ta (${failed} xato)`);
  console.log(`  Umumiy vaqt:   ${(totalMs / 1000).toFixed(2)} s`);
  console.log(`  O'tkazuvchan.: ${Math.round(total / (totalMs / 1000))} update/sek`);
  console.log(`  p50:           ${percentile(sorted, 50)} ms`);
  console.log(`  p95:           ${percentile(sorted, 95)} ms`);
  console.log(`  p99:           ${percentile(sorted, 99)} ms`);
  console.log(`  max:           ${sorted[sorted.length - 1]} ms`);
  console.log(`  Xotira:        ${memBefore.toFixed(1)} MB -> ${memAfter.toFixed(1)} MB`);
  console.log('  ────────────────────────────────────────');
  console.log('');
  console.log('  Tozalash: DELETE FROM users WHERE source = \'loadtest\';');
  console.log('');
}

const total = Math.min(20_000, Number(process.argv[2]) || 500);
const concurrency = Math.min(500, Number(process.argv[3]) || 50);

run(total, concurrency)
  .then(() => pool.end())
  .catch(async (err) => {
    logger.error('Yuklama testi xatosi', err);
    await pool.end().catch(() => {});
    process.exit(1);
  });
