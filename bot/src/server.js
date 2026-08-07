/**
 * HTTP server: integratsiya API'si + (production'da) Telegram webhook.
 *
 * Bot va API bitta process, bitta portda ishlaydi — bitta deploy, bitta
 * log oqimi, bitta DB pool. Kichik-o'rta yuklama uchun eng sodda va eng
 * ishonchli variant.
 */

const express = require('express');
const helmet = require('helmet');
const crypto = require('crypto');
const config = require('./config');
const apiRoutes = require('./api');
const { apiAuth } = require('./api/auth');
const pool = require('./db/pool');
const metrics = require('./utils/metrics');
const logger = require('./utils/logger');

/**
 * Webhook yo'li sirdan HOSILA qilib olinadi (sirning o'zi emas).
 *
 * Nega: URL manzillari proxy loglariga, Referer header'iga, monitoring
 * tizimlariga tushadi. Agar sir URL ichida bo'lsa, o'sha joylardan
 * "oqib" ketadi. Hosila esa oqib ketsa ham sirni oshkor qilmaydi.
 * Asosiy himoya baribir X-Telegram-Bot-Api-Secret-Token header'ida.
 */
function webhookPath(secret) {
  return `/tg/${crypto.createHash('sha256').update(secret).digest('hex').slice(0, 32)}`;
}

async function createServer(bot) {
  const app = express();

  app.disable('x-powered-by');

  // Reverse proxy (nginx, Railway, Fly) orqasida haqiqiy IP va protokolni
  // bilish uchun. Faqat production'da — localda proxy yo'q va bu sozlama
  // yolg'on X-Forwarded-For header'iga ishonib qolishga olib kelardi.
  if (config.IS_PRODUCTION) app.set('trust proxy', 1);

  app.use(
    helmet({
      // API JSON qaytaradi, HTML sahifa yo'q — CSP kerak emas
      contentSecurityPolicy: false,
      hsts: config.IS_PRODUCTION ? { maxAge: 31_536_000, includeSubDomains: true } : false,
    })
  );

  // ── Telegram webhook (faqat production) ────────────────────────
  if (config.USE_WEBHOOK) {
    const path = webhookPath(config.WEBHOOK_SECRET);

    // createWebhook: setWebhook chaqiradi va secret_token bilan
    // tekshiradigan middleware qaytaradi. Mos kelmagan so'rov handler'ga
    // umuman yetib bormaydi.
    const webhookMiddleware = await bot.createWebhook({
      domain: config.WEBHOOK_DOMAIN,
      path,
      secret_token: config.WEBHOOK_SECRET,
      drop_pending_updates: false,
      max_connections: 100,
    });

    // Telegram JSON yuboradi; express.json() faqat shu yo'l uchun
    app.use(path, express.json({ limit: '1mb' }));
    app.use(webhookMiddleware);

    logger.info(`Webhook o'rnatildi: ${config.WEBHOOK_DOMAIN}${path}`);
  }

  // ── Sog'liq tekshiruvi (auth'siz) ──────────────────────────────
  // Deploy platformalari va monitoring shu manzilni so'raydi.
  app.get('/healthz', async (req, res) => {
    try {
      const dbMs = await pool.ping();
      res.json({ status: 'ok', db: 'ok', db_ms: dbMs, uptime_sec: Math.round(process.uptime()) });
    } catch (err) {
      logger.error('Healthcheck: baza javob bermadi', { err: err.message });
      // 503 — yuk balanslovchi bu nusxaga trafik yubormasligi uchun
      res.status(503).json({ status: 'degraded', db: 'error' });
    }
  });

  // ── API ────────────────────────────────────────────────────────
  app.use('/api/v1', express.json({ limit: '32kb' }), apiRoutes);

  // Metrikalar — API kaliti bilan himoyalangan
  app.get('/metrics', apiAuth(), (req, res) => res.json(metrics.snapshot()));

  app.use((req, res) => res.status(404).json({ error: 'Topilmadi' }));

  return app;
}

module.exports = { createServer, webhookPath };
