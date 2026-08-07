/**
 * API autentifikatsiyasi.
 *
 * Uch qatlam, shu tartibda:
 *   1) IP oq ro'yxati  — kalit o'g'irlansa ham begona serverdan ishlamaydi;
 *   2) X-API-Key       — kalitning O'ZI .env da saqlanmaydi, faqat SHA-256 hash;
 *   3) rate limit      — kalitni "brute force" qilib bo'lmaydi.
 *
 * Nega hash: server buzib kirilsa yoki .env fayl tasodifan tarqalsa,
 * hujumchi hash'dan kalitni tiklay olmaydi (kalit — 32 bayt tasodifiy son).
 *
 * Nega timingSafeEqual: oddiy `===` taqqoslash mos kelgan belgilar soniga
 * qarab turlicha vaqt sarflaydi. Shu farqni o'lchab, kalitni belgima-belgi
 * topish mumkin (timing attack). timingSafeEqual doim bir xil vaqt sarflaydi.
 */

const crypto = require('crypto');
const { API_KEYS_SHA256, API_ALLOWED_IPS, IS_PRODUCTION } = require('../config');
const { isAllowed, normalize } = require('./ipAllow');
const logger = require('../utils/logger');

const KEY_BUFFERS = API_KEYS_SHA256.map((hex) => Buffer.from(hex, 'hex'));

function sha256(value) {
  return crypto.createHash('sha256').update(value, 'utf8').digest();
}

/**
 * Berilgan kalit ro'yxatdagi biror hash'ga mos keladimi.
 * Barcha kalitlar bo'ylab yuriladi — birinchi moslikda to'xtamaymiz,
 * aks holda javob vaqti kalit tartibini oshkor qilardi.
 */
function findKey(provided) {
  const providedHash = sha256(provided);
  let matchedIndex = -1;

  KEY_BUFFERS.forEach((expected, index) => {
    if (expected.length === providedHash.length && crypto.timingSafeEqual(expected, providedHash)) {
      matchedIndex = index;
    }
  });

  if (matchedIndex === -1) return null;
  // Loglar uchun qisqa identifikator — kalitning o'zi hech qayerga yozilmaydi
  return { id: API_KEYS_SHA256[matchedIndex].slice(0, 8) };
}

function clientIp(req) {
  return normalize(req.ip || req.socket?.remoteAddress || '');
}

function deny(res, status, message) {
  res.status(status).json({ error: message });
}

function apiAuth() {
  return (req, res, next) => {
    const ip = clientIp(req);

    // 1) IP
    if (!isAllowed(ip, API_ALLOWED_IPS)) {
      logger.warn('API: ruxsat etilmagan IP', { ip, path: req.path });
      return deny(res, 403, 'Ruxsat yo\'q');
    }

    // Kalit umuman sozlanmagan bo'lsa — hammani rad etamiz.
    // "Sozlanmagan = ochiq" xatti-harakati eng xavfli standart bo'lardi.
    if (KEY_BUFFERS.length === 0) {
      logger.error('API: API_KEYS_SHA256 sozlanmagan — barcha so\'rovlar rad etilmoqda (npm run api:key)');
      return deny(res, 503, 'API sozlanmagan');
    }

    // 2) Kalit
    const provided = req.get('X-API-Key') || '';
    if (!provided) return deny(res, 401, 'X-API-Key header talab qilinadi');

    const key = findKey(provided);
    if (!key) {
      logger.warn('API: noto\'g\'ri kalit', { ip, path: req.path });
      return deny(res, 401, 'Kalit noto\'g\'ri');
    }

    req.apiKeyId = key.id;
    req.clientIp = ip;

    // 3) Audit: kim, qayerdan, nimani so'radi
    logger.info('API so\'rovi', { key: key.id, ip, method: req.method, path: req.originalUrl });

    if (IS_PRODUCTION && req.protocol !== 'https' && !req.secure) {
      // Reverse proxy orqasida `trust proxy` bilan req.secure to'g'ri ishlaydi.
      // Bu — sozlash xatosini payqash uchun ogohlantirish, bloklamaymiz.
      logger.warn('API: so\'rov HTTPS emas', { ip });
    }

    next();
  };
}

module.exports = { apiAuth, sha256, clientIp };
