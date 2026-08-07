/**
 * Kirish nuqtasi: botni va HTTP serverni ishga tushiradi.
 *
 *   Local  (WEBHOOK_DOMAIN bo'sh)  -> polling + API serveri
 *   Prod   (WEBHOOK_DOMAIN bor)    -> webhook + API bitta portda
 *
 * Kod ikkala holatda bir xil — farqni faqat .env belgilaydi.
 */

const config = require('./config');
const bot = require('./bot');
const { createServer } = require('./server');
const pool = require('./db/pool');
const eventQueue = require('./db/eventQueue');
const logger = require('./utils/logger');

let httpServer = null;
let shuttingDown = false;

async function start() {
  for (const warning of config.warnings) logger.warn(warning);

  // Baza tayyorligini oldindan tekshiramiz: xato bo'lsa sababini darrov
  // ko'rsatamiz, "nega bot javob bermayapti" deb qidirmaslik uchun.
  try {
    await pool.ping();
    logger.info('Bazaga ulanish: OK');
  } catch (err) {
    logger.error(
      'Bazaga ulanib bo\'lmadi. Postgres ishlayaptimi? (npm run db:up) DATABASE_URL to\'g\'rimi?',
      { err: err.message }
    );
    process.exit(1);
  }

  const app = await createServer(bot);

  await new Promise((resolve) => {
    httpServer = app.listen(config.PORT, resolve);
  });
  logger.info(`HTTP server: http://localhost:${config.PORT}  (healthz, /api/v1)`);

  if (config.USE_WEBHOOK) {
    logger.info('Bot WEBHOOK rejimida ishlamoqda.');
  } else {
    // Polling: launch() to'xtaguncha tugamaydi, shuning uchun await qilmaymiz
    bot.launch({ dropPendingUpdates: false }).catch((err) => {
      logger.error('Polling ishga tushmadi', err);
      process.exit(1);
    });
    logger.info('Bot POLLING rejimida ishlamoqda (local).');
  }

  const me = await bot.telegram.getMe().catch(() => null);
  if (me) logger.info(`Bot tayyor: @${me.username}`);
}

/**
 * Silliq to'xtash: yangi so'rovlarni qabul qilishni to'xtatamiz, keyin
 * navbatdagi hodisalarni bazaga yozamiz va ulanishlarni yopamiz.
 * Aks holda deploy paytida yozuvlar yo'qoladi.
 */
async function shutdown(reason, exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info(`To'xtatilmoqda (${reason})…`);

  const timeout = setTimeout(() => {
    logger.warn('Silliq to\'xtash cho\'zilib ketdi — majburiy chiqish.');
    process.exit(1);
  }, 10_000);
  timeout.unref();

  try {
    bot.stop(reason);
  } catch {
    /* polling ishga tushmagan bo'lishi mumkin */
  }

  if (httpServer) {
    await new Promise((resolve) => httpServer.close(resolve));
  }

  await eventQueue.flush().catch(() => {});
  await pool.end().catch(() => {});

  logger.info('To\'xtatildi.');
  process.exit(exitCode);
}

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));

// Ushlanmagan xatolar process'ni jimgina yiqitmasligi kerak — avval sababini
// yozib qolamiz. Bu bo'lmasa "bot o'zi o'chib qoldi" muammosi tekshirilmaydi.
process.on('unhandledRejection', (err) => {
  logger.error('Ushlanmagan promise xatosi', err instanceof Error ? err : { err });
});
process.on('uncaughtException', (err) => {
  logger.error('Ushlanmagan istisno', err);
  // Nolga teng bo'lmagan kod bilan chiqamiz — systemd/PM2/Docker buni
  // "yiqildi" deb tushunib, jarayonni qayta ishga tushiradi.
  shutdown('uncaughtException', 1);
});

start().catch((err) => {
  logger.error('Ishga tushirishda xatolik', err);
  process.exit(1);
});
