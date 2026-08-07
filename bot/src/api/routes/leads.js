/**
 * POST /api/v1/leads — saytdagi ariza formasi uchun.
 *
 * NEGA BU KERAK: ilgari sayt Telegram'ga TO'G'RIDAN-TO'G'RI murojaat qilardi
 * va bot tokeni frontend kodida turardi (frontend/src/lib/telegram.ts). Ya'ni
 * saytga kirgan har qanday odam brauzerdan tokenni ko'chirib olib, bot nomidan
 * xabar yubora olardi, bot sozlamalarini o'zgartira olardi.
 *
 * Endi token faqat shu serverda. Sayt tokensiz murojaat qiladi.
 *
 * Bu endpoint API kalitini talab qilmaydi — u ochiq bo'lishi kerak (brauzerdan
 * chaqiriladi, kalitni esa brauzerga qo'yib bo'lmaydi, aks holda yana o'sha
 * muammo takrorlanardi). Shuning uchun himoya boshqacha:
 *   • faqat ruxsat etilgan Origin'lardan;
 *   • IP bo'yicha qattiq rate limit;
 *   • "honeypot" maydoni — botlar to'ldiradi, odam ko'rmaydi;
 *   • maydon uzunliklari cheklangan, HTML escape qilinadi.
 */

const express = require('express');
const { LEADS_BOT_TOKEN, LEADS_CHAT_ID, LEADS_ALLOWED_ORIGINS } = require('../../config');
const { httpRateLimit } = require('../rateLimit');
const { clientIp } = require('../auth');
const { escapeHtml } = require('../../utils/html');
const logger = require('../../utils/logger');

const router = express.Router();

const MAX = { name: 100, phone: 30, course: 100, time: 60, source: 60, comment: 500 };

function originAllowed(origin) {
  if (!LEADS_ALLOWED_ORIGINS.length) return true; // sozlanmagan => local development
  return Boolean(origin) && LEADS_ALLOWED_ORIGINS.includes(origin);
}

/** CORS: faqat ro'yxatdagi saytlar uchun. Boshqalarga header berilmaydi. */
function cors(req, res, next) {
  const origin = req.get('Origin');

  if (origin && originAllowed(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Vary', 'Origin');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '86400');
  }

  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
}

function field(value, max) {
  return String(value ?? '').trim().slice(0, max);
}

function buildLeadText(lead) {
  const time = new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });

  const rows = [
    '<b>🔔 Yangi ariza — ustozhasan.uz</b>',
    '',
    `👤 <b>F.I.SH:</b> ${escapeHtml(lead.name)}`,
    `📞 <b>Telefon:</b> ${escapeHtml(lead.phone)}`,
  ];

  if (lead.course) rows.push(`📚 <b>Yo'nalish:</b> ${escapeHtml(lead.course)}`);
  if (lead.time) rows.push(`🕒 <b>Qulay vaqt:</b> ${escapeHtml(lead.time)}`);
  if (lead.comment) rows.push(`💬 <b>Izoh:</b> ${escapeHtml(lead.comment)}`);

  rows.push(`📍 <b>Bo'lim:</b> ${escapeHtml(lead.source || 'sayt')}`);
  rows.push(`🗓 <b>Vaqt:</b> ${escapeHtml(time)}`);

  return rows.join('\n');
}

router.options('/', cors);

router.post(
  '/',
  cors,
  httpRateLimit({ windowMs: 60_000, max: 5, keyFn: (req) => `lead:${clientIp(req)}` }),
  async (req, res) => {
    const origin = req.get('Origin');
    // Origin yo'q bo'lsa (server-to-server yoki curl) — o'tkazamiz, brauzerdan
    // kelgan bo'lsa ro'yxatda bo'lishi shart.
    if (origin && !originAllowed(origin)) {
      logger.warn('Lead: ruxsat etilmagan Origin', { origin, ip: clientIp(req) });
      return res.status(403).json({ error: 'Ruxsat yo\'q' });
    }

    // Honeypot: odam ko'rmaydigan maydon to'ldirilgan bo'lsa — bu bot.
    // 200 qaytaramiz, aks holda bot xatoni ko'rib usulini o'zgartiradi.
    if (field(req.body?.website, 50)) {
      logger.warn('Lead: honeypot ishga tushdi', { ip: clientIp(req) });
      return res.json({ ok: true });
    }

    const lead = {
      name: field(req.body?.name, MAX.name),
      phone: field(req.body?.phone, MAX.phone),
      course: field(req.body?.course, MAX.course),
      time: field(req.body?.time, MAX.time),
      source: field(req.body?.source, MAX.source),
      comment: field(req.body?.comment, MAX.comment),
    };

    if (lead.name.length < 2) return res.status(400).json({ error: 'Ismni to\'liq kiriting' });
    if (lead.phone.replace(/\D/g, '').length < 9) {
      return res.status(400).json({ error: 'Telefon raqamini to\'g\'ri kiriting' });
    }

    if (!LEADS_CHAT_ID) {
      logger.error('Lead: LEADS_CHAT_ID sozlanmagan — ariza yuborilmadi');
      return res.status(503).json({ error: 'Ariza qabul qilish vaqtincha ishlamayapti' });
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${LEADS_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: LEADS_CHAT_ID,
          text: buildLeadText(lead),
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
        signal: AbortSignal.timeout(8_000),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) {
        throw new Error(data.description || `Telegram javobi: ${response.status}`);
      }

      logger.info('Yangi ariza qabul qilindi', { source: lead.source, ip: clientIp(req) });
      res.json({ ok: true });
    } catch (err) {
      logger.error('Arizani yuborib bo\'lmadi', { err: err.message });
      res.status(502).json({ error: 'Arizani yuborib bo\'lmadi. Iltimos, qayta urinib ko\'ring.' });
    }
  }
);

module.exports = router;
