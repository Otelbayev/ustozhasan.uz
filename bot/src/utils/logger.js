/**
 * Oddiy structured logger.
 *
 * - Local: o'qishga qulay matn.
 * - Production: bir qatorli JSON (Docker/systemd/Railway loglari uchun).
 *
 * Muhim: bu yerdan o'tgan har qanday matn maskalanadi — bot tokeni yoki
 * telefon raqami log fayliga tushib qolmasligi kerak.
 */

const { IS_PRODUCTION } = require('../config');

const TOKEN_RE = /\b\d{8,}:[A-Za-z0-9_-]{30,}\b/g;
const PHONE_RE = /\+998\d{9}\b/g;

function maskString(value) {
  return value
    .replace(TOKEN_RE, (t) => `${t.slice(0, 6)}…<token yashirildi>`)
    .replace(PHONE_RE, (p) => `${p.slice(0, 7)}****`);
}

function maskValue(value, depth = 0) {
  if (typeof value === 'string') return maskString(value);
  if (value instanceof Error) {
    return { name: value.name, message: maskString(value.message), stack: IS_PRODUCTION ? undefined : value.stack };
  }
  if (Array.isArray(value)) {
    return depth > 4 ? '[…]' : value.map((item) => maskValue(item, depth + 1));
  }
  if (value && typeof value === 'object') {
    if (depth > 4) return '{…}';
    const out = {};
    for (const [key, item] of Object.entries(value)) {
      // Sirlarni umuman chiqarmaymiz
      if (/token|secret|password|api_?key|authorization/i.test(key)) {
        out[key] = '<yashirildi>';
      } else {
        out[key] = maskValue(item, depth + 1);
      }
    }
    return out;
  }
  return value;
}

function write(level, message, meta) {
  const safeMessage = maskString(String(message));
  const safeMeta = meta === undefined ? undefined : maskValue(meta);

  if (IS_PRODUCTION) {
    process.stdout.write(
      `${JSON.stringify({ ts: new Date().toISOString(), level, msg: safeMessage, ...(safeMeta ? { meta: safeMeta } : {}) })}\n`
    );
    return;
  }

  const time = new Date().toISOString().slice(11, 19);
  const icon = { debug: '·', info: 'ℹ', warn: '⚠', error: '✖' }[level] || '·';
  const tail = safeMeta === undefined ? '' : ` ${JSON.stringify(safeMeta)}`;
  process.stdout.write(`${time} ${icon} ${safeMessage}${tail}\n`);
}

module.exports = {
  debug: (msg, meta) => write('debug', msg, meta),
  info: (msg, meta) => write('info', msg, meta),
  warn: (msg, meta) => write('warn', msg, meta),
  error: (msg, meta) => write('error', msg, meta),
};
