/**
 * Muhit sozlamalari va ularning validatsiyasi.
 *
 * Asosiy tamoyil: KOD BIR XIL, faqat .env o'zgaradi.
 * Local va production o'rtasidagi farq shu yerda avtomatik aniqlanadi —
 * boshqa hech qaysi faylda `if (production)` tekshiruvi yo'q.
 *
 * Noto'g'ri sozlama bilan ishga tushishdan ko'ra, umuman ishga tushmagan
 * ma'qul: xavfsizlikka aloqador qiymatlar shu yerda qat'iy tekshiriladi.
 */

require('dotenv').config();

const errors = [];
const warnings = [];

function required(name) {
  const value = (process.env[name] || '').trim();
  if (!value) {
    errors.push(`${name} — majburiy, lekin .env da yo'q yoki bo'sh.`);
    return '';
  }
  return value;
}

function optional(name, fallback = '') {
  const value = (process.env[name] || '').trim();
  return value || fallback;
}

function list(name) {
  return optional(name)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

// ── Muhit ───────────────────────────────────────────────────────
const NODE_ENV = optional('NODE_ENV', 'development');
const IS_PRODUCTION = NODE_ENV === 'production';

// ── Telegram ────────────────────────────────────────────────────
const BOT_TOKEN = required('BOT_TOKEN');
if (BOT_TOKEN && !/^\d+:[\w-]{30,}$/.test(BOT_TOKEN)) {
  errors.push('BOT_TOKEN formati noto\'g\'ri (kutilgan: 123456:AA...).');
}

const CHANNEL_USERNAME = required('CHANNEL_USERNAME');
if (CHANNEL_USERNAME && !/^(@[\w]{4,}|-100\d+)$/.test(CHANNEL_USERNAME)) {
  warnings.push(
    `CHANNEL_USERNAME "@username" yoki "-100..." ko'rinishida bo'lishi kerak. Hozirgi qiymat: ${CHANNEL_USERNAME}`
  );
}

const CHANNEL_INVITE_LINK = required('CHANNEL_INVITE_LINK');

// ── Webhook ─────────────────────────────────────────────────────
// WEBHOOK_DOMAIN bo'sh => polling (local). To'ldirilgan => webhook (production).
let WEBHOOK_DOMAIN = optional('WEBHOOK_DOMAIN');
const WEBHOOK_SECRET = optional('WEBHOOK_SECRET');

if (WEBHOOK_DOMAIN) {
  WEBHOOK_DOMAIN = WEBHOOK_DOMAIN.replace(/\/+$/, '');

  if (!/^https:\/\//i.test(WEBHOOK_DOMAIN)) {
    errors.push('WEBHOOK_DOMAIN https:// bilan boshlanishi shart — Telegram faqat TLS orqali ishlaydi.');
  }
  // Eski kodda sir bo'lmasa ham webhook yoqilar edi va endpoint himoyasiz qolardi.
  if (!WEBHOOK_SECRET) {
    errors.push('WEBHOOK_DOMAIN berilgan, lekin WEBHOOK_SECRET yo\'q — webhook himoyasiz qolardi.');
  } else if (WEBHOOK_SECRET.length < 32) {
    errors.push('WEBHOOK_SECRET kamida 32 belgi bo\'lsin (node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))").');
  } else if (!/^[A-Za-z0-9_-]+$/.test(WEBHOOK_SECRET)) {
    // Telegram secret_token uchun ruxsat etilgan belgilar: A-Z a-z 0-9 _ -
    errors.push('WEBHOOK_SECRET faqat A-Z, a-z, 0-9, _ va - belgilaridan iborat bo\'lsin (Telegram talabi).');
  }
}

const USE_WEBHOOK = Boolean(WEBHOOK_DOMAIN) && errors.length === 0;

// ── Baza ────────────────────────────────────────────────────────
const DATABASE_URL = required('DATABASE_URL');
const IS_LOCAL_DB = /@(localhost|127\.0\.0\.1|\[::1\]|db)[:/]/.test(DATABASE_URL);

if (DATABASE_URL && !IS_LOCAL_DB && !/sslmode=/i.test(DATABASE_URL)) {
  warnings.push(
    'DATABASE_URL tashqi serverga ishora qilyapti, lekin sslmode ko\'rsatilmagan. ' +
      'Ulanish shifrlanmasligi mumkin — URL oxiriga ?sslmode=require qo\'shing.'
  );
}

// ── API ─────────────────────────────────────────────────────────
const API_KEYS_SHA256 = list('API_KEYS_SHA256').map((h) => h.toLowerCase());
const invalidHash = API_KEYS_SHA256.find((h) => !/^[a-f0-9]{64}$/.test(h));
if (invalidHash) {
  errors.push(`API_KEYS_SHA256 ichida SHA-256 hash emas: "${invalidHash.slice(0, 12)}…" (npm run api:key).`);
}

const API_ALLOWED_IPS = list('API_ALLOWED_IPS');

if (IS_PRODUCTION && API_KEYS_SHA256.length && !API_ALLOWED_IPS.length) {
  warnings.push('Production: API_ALLOWED_IPS bo\'sh — API dunyoning istalgan IP sidan ochiq (kalit bilan).');
}

// ── Sayt arizalari ──────────────────────────────────────────────
const LEADS_BOT_TOKEN = optional('LEADS_BOT_TOKEN') || BOT_TOKEN;
const LEADS_CHAT_ID = optional('LEADS_CHAT_ID');
const LEADS_ALLOWED_ORIGINS = list('LEADS_ALLOWED_ORIGINS');

// ── Xulosa ──────────────────────────────────────────────────────
if (errors.length) {
  const message = [
    '',
    '❌ Sozlamalarda xatolik bor — bot ishga tushmadi:',
    ...errors.map((e) => `   • ${e}`),
    '',
    '   .env faylni tekshiring (namuna: .env.example).',
    '',
  ].join('\n');
  throw new Error(message);
}

module.exports = {
  NODE_ENV,
  IS_PRODUCTION,

  BOT_TOKEN,
  CHANNEL_USERNAME,
  CHANNEL_INVITE_LINK,
  ADMIN_IDS: list('ADMIN_IDS').map(Number).filter((id) => Number.isSafeInteger(id) && id > 0),

  DATABASE_URL,
  IS_LOCAL_DB,

  PORT: Number(optional('PORT', '3000')),
  USE_WEBHOOK,
  WEBHOOK_DOMAIN,
  WEBHOOK_SECRET,

  API_KEYS_SHA256,
  API_ALLOWED_IPS,

  LEADS_BOT_TOKEN,
  LEADS_CHAT_ID,
  LEADS_ALLOWED_ORIGINS,

  PUBLIC_SITE_URL: optional('PUBLIC_SITE_URL', 'https://ustozhasan.uz'),

  /** config yuklangandan keyin logger tayyor bo'lgach chiqariladi */
  warnings,
};
