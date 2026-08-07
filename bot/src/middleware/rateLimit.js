/**
 * Foydalanuvchi bo'yicha so'rovlarni cheklaydi (token bucket).
 *
 * Eski koddagi ikki muammo tuzatildi:
 *   1. `Map` cheksiz o'sardi — endi TTL cache, davriy tozalanadi.
 *   2. Cheklovga tushgan callback JAVOBSIZ qolardi — Telegram'da tugmada
 *      soat aylanaverardi va foydalanuvchi "bot qotdi" deb o'ylardi.
 *      Endi har doim answerCbQuery yuboriladi.
 *
 * Token bucket "burst"ga ruxsat beradi: odam menyu bo'ylab tez bosishi
 * normal, lekin sekundiga o'nlab so'rov yuborish — yo'q.
 */

const { TtlCache, startPruning } = require('../utils/cache');
const { ERRORS } = require('../content');
const logger = require('../utils/logger');

const CAPACITY = 5; // ketma-ket 5 ta so'rovga ruxsat
const REFILL_PER_SEC = 2; // keyin sekundiga 2 ta

const buckets = new TtlCache({ ttlMs: 5 * 60_000, maxSize: 100_000 });
startPruning([buckets]);

function takeToken(userId) {
  const now = Date.now();
  const bucket = buckets.get(userId) || { tokens: CAPACITY, at: now };

  const elapsedSec = (now - bucket.at) / 1000;
  const tokens = Math.min(CAPACITY, bucket.tokens + elapsedSec * REFILL_PER_SEC);

  if (tokens < 1) {
    buckets.set(userId, { tokens, at: now });
    return false;
  }

  buckets.set(userId, { tokens: tokens - 1, at: now });
  return true;
}

function rateLimit() {
  return async (ctx, next) => {
    const userId = ctx.from?.id;
    if (!userId) return next();

    if (takeToken(userId)) return next();

    logger.debug('Rate limit', { userId });

    // Foydalanuvchi "bot qotdi" deb o'ylamasligi uchun javob qaytaramiz
    if (ctx.callbackQuery) {
      await ctx.answerCbQuery(ERRORS.tooFast).catch(() => {});
    }
    // Xabarlarga javob yozmaymiz — flood'ga flood bilan javob bermaymiz
  };
}

module.exports = { rateLimit, buckets };
