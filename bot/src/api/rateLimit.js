/**
 * HTTP so'rovlar uchun cheklov (sliding window).
 *
 * Tashqi paket ishlatmadik: mantiq 30 qatorlik, tashqi bog'liqlik esa
 * hujum yuzasini kengaytiradi (supply-chain). Bitta process uchun xotirada
 * hisoblash yetarli; bir necha nusxa ishlatilganda cheklov har bir nusxada
 * alohida qo'llanadi — bu ham himoya sifatida yetarli.
 */

const { TtlCache, startPruning } = require('../utils/cache');
const logger = require('../utils/logger');

function httpRateLimit({ windowMs = 60_000, max = 60, keyFn } = {}) {
  const hits = new TtlCache({ ttlMs: windowMs * 2, maxSize: 50_000 });
  startPruning([hits], windowMs);

  return (req, res, next) => {
    const key = keyFn ? keyFn(req) : req.apiKeyId || req.clientIp || req.ip;
    const now = Date.now();

    const entry = hits.get(key);
    const window = entry && now - entry.start < windowMs ? entry : { start: now, count: 0 };

    window.count += 1;
    hits.set(key, window);

    const remaining = Math.max(0, max - window.count);
    res.set('X-RateLimit-Limit', String(max));
    res.set('X-RateLimit-Remaining', String(remaining));

    if (window.count > max) {
      const retryAfter = Math.ceil((window.start + windowMs - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      logger.warn('API: rate limit', { key, path: req.path });
      return res.status(429).json({ error: 'Juda ko\'p so\'rov. Biroz kutib, qayta urinib ko\'ring.' });
    }

    next();
  };
}

module.exports = { httpRateLimit };
