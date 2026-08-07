/**
 * GET /api/v1/users        — foydalanuvchilar ro'yxati (keyset paginatsiya)
 * GET /api/v1/users/:id    — bitta foydalanuvchi (telegram_id bo'yicha)
 *
 * Paginatsiya OFFSET emas, KEYSET orqali: `WHERE (updated_at, id) > (…)`.
 * Sabab: OFFSET 50000 bo'lganda Postgres o'sha 50000 qatorni ham o'qib
 * tashlaydi — jadval o'sgani sari sekinlashadi. Keyset esa indeksdan
 * (idx_users_updated_at_id) to'g'ridan-to'g'ri kerakli joyga sakraydi va doim
 * bir xil tezlikda ishlaydi. Yon foydasi: sahifalash davomida yangi yozuv
 * qo'shilsa ham qatorlar takrorlanmaydi va tushib qolmaydi.
 */

const express = require('express');
const pool = require('../../db/pool');

const router = express.Router();

// Javobda chiqadigan maydonlar — ATAYLAB aniq ro'yxat.
// `SELECT *` ishlatilmaydi: kelajakda maxfiy ustun qo'shilsa, u avtomatik
// tashqariga chiqib ketmasligi kerak. `raw` (Telegram xom javobi) ham
// bu yerda yo'q — u ichki tahlil uchun.
const PUBLIC_FIELDS = [
  'telegram_id',
  'username',
  'first_name',
  'last_name',
  'language_code',
  'is_premium',
  'is_bot',
  'chat_id',
  'chat_type',
  'phone_number',
  'phone_shared_at',
  'funnel_stage',
  'is_subscribed',
  'subscription_checked_at',
  'source',
  'start_param',
  'start_count',
  'blocked_bot',
  'photo_file_id',
  'first_seen_at',
  'last_seen_at',
  'created_at',
  'updated_at',
];

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 50;

/**
 * Kursor uchun vaqt tamg'asi ALOHIDA ustunda, MIKROSONIYA aniqligida olinadi.
 *
 * Nega: Postgres `timestamptz` ni mikrosoniyagacha saqlaydi, JS `Date` esa
 * faqat millisoniyagacha. `row.updated_at.toISOString()` ishlatilsa, oxirgi
 * 3 xona kesiladi va kursor qatordan bir oz "orqada" qoladi — natijada
 * keyingi sahifada o'sha qator QAYTA chiqadi. Shuning uchun bazadan
 * to'g'ridan-to'g'ri to'liq aniqlikdagi matn olinadi.
 */
const CURSOR_TS = `to_char(updated_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') AS cursor_ts`;

function encodeCursor(row) {
  // `id` satr sifatida saqlanadi: BIGINT ni Number'ga aylantirish keraksiz xavf
  return Buffer.from(JSON.stringify({ u: row.cursor_ts, i: String(row.id) })).toString('base64url');
}

function decodeCursor(value) {
  try {
    const parsed = JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
    const timestamp = String(parsed.u || '');
    const id = String(parsed.i || '');

    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/.test(timestamp)) return null;
    if (!/^\d{1,19}$/.test(id)) return null;

    return { timestamp, id };
  } catch {
    return null;
  }
}

function parseBool(value) {
  if (value === undefined) return undefined;
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  return null; // noto'g'ri qiymat
}

function parseDate(value) {
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Postgres BIGINT ni `pg` drayveri satr sifatida qaytaradi (katta sonlarda
 * aniqlik yo'qolmasligi uchun). Telegram ID lari esa 2^52 dan kichik —
 * JSON'da son bo'lib chiqqani integratsiya uchun qulayroq.
 */
function toApiRow({ id, cursor_ts, ...row }) {
  return {
    ...row,
    telegram_id: Number(row.telegram_id),
    chat_id: row.chat_id === null ? null : Number(row.chat_id),
  };
}

/**
 * So'rov shartlarini yig'adi. Har bir foydalanuvchi qiymati FAQAT parametr
 * ($1, $2 …) sifatida beriladi — SQL matniga hech qachon birlashtirilmaydi.
 */
function buildFilters(query) {
  const where = [];
  const params = [];

  /** Qiymatni parametrga qo'shadi va `$N` ni qaytaradi */
  const bind = (value) => {
    params.push(value);
    return `$${params.length}`;
  };

  if (query.cursor) {
    const cursor = decodeCursor(String(query.cursor));
    if (!cursor) return { error: 'cursor yaroqsiz' };
    where.push(
      `(updated_at, id) > (${bind(cursor.timestamp)}::timestamptz, ${bind(cursor.id)}::bigint)`
    );
  }

  if (query.updated_since) {
    const since = parseDate(query.updated_since);
    if (!since) return { error: 'updated_since ISO-8601 sana bo\'lishi kerak' };
    where.push(`updated_at >= ${bind(since)}`);
  }

  if (query.created_since) {
    const since = parseDate(query.created_since);
    if (!since) return { error: 'created_since ISO-8601 sana bo\'lishi kerak' };
    where.push(`created_at >= ${bind(since)}`);
  }

  if (query.stage) where.push(`funnel_stage = ${bind(String(query.stage).slice(0, 40))}`);
  if (query.source) where.push(`source = ${bind(String(query.source).slice(0, 64))}`);

  const subscribed = parseBool(query.subscribed);
  if (subscribed === null) return { error: 'subscribed true yoki false bo\'lsin' };
  if (subscribed !== undefined) where.push(`is_subscribed = ${bind(subscribed)}`);

  const hasPhone = parseBool(query.has_phone);
  if (hasPhone === null) return { error: 'has_phone true yoki false bo\'lsin' };
  if (hasPhone === true) where.push('phone_number IS NOT NULL');
  if (hasPhone === false) where.push('phone_number IS NULL');

  const blocked = parseBool(query.blocked);
  if (blocked === null) return { error: 'blocked true yoki false bo\'lsin' };
  if (blocked !== undefined) where.push(`blocked_bot = ${bind(blocked)}`);

  if (query.q) {
    // ILIKE uchun maxsus belgilarni ekranlaymiz: "%" yozgan odam butun
    // jadvalni skanerlab, bazani ortiqcha yuklab qo'yishi mumkin edi.
    const term = String(query.q).slice(0, 64).replace(/[\\%_]/g, (m) => `\\${m}`);
    const p = bind(`%${term}%`);
    where.push(
      `(username ILIKE ${p} OR first_name ILIKE ${p} OR last_name ILIKE ${p} OR phone_number ILIKE ${p})`
    );
  }

  return { where, params };
}

router.get('/', async (req, res, next) => {
  try {
    const limit = Math.min(MAX_LIMIT, Math.max(1, Number(req.query.limit) || DEFAULT_LIMIT));

    const filters = buildFilters(req.query);
    if (filters.error) return res.status(400).json({ error: filters.error });

    const { where, params } = filters;
    params.push(limit + 1); // bitta ortiq: keyingi sahifa bor-yo'qligini bilish uchun

    const { rows } = await pool.query(
      `SELECT id, ${PUBLIC_FIELDS.join(', ')}, ${CURSOR_TS}
         FROM users
        ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
        ORDER BY updated_at, id
        LIMIT $${params.length}`,
      params
    );

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = page.length && hasMore ? encodeCursor(page[page.length - 1]) : null;

    // `id` — ichki ustun, faqat cursor uchun kerak edi; tashqariga chiqarmaymiz
    const data = page.map(toApiRow);

    res.json({ data, next_cursor: nextCursor, has_more: hasMore, count: data.length });
  } catch (err) {
    next(err);
  }
});

router.get('/:telegramId', async (req, res, next) => {
  try {
    const telegramId = Number(req.params.telegramId);
    if (!Number.isSafeInteger(telegramId) || telegramId <= 0) {
      return res.status(400).json({ error: 'telegram_id butun son bo\'lishi kerak' });
    }

    const { rows } = await pool.query(
      `SELECT ${PUBLIC_FIELDS.join(', ')} FROM users WHERE telegram_id = $1`,
      [telegramId]
    );

    if (!rows.length) return res.status(404).json({ error: 'Topilmadi' });

    res.json({ data: toApiRow(rows[0]) });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/users/:telegram_id/events — foydalanuvchi nima qilgani (timeline).
 *
 * Eng yangisi birinchi. Admin panelidagi "bu odam nima qildi" ro'yxati
 * shundan quriladi.
 */
router.get('/:telegramId/events', async (req, res, next) => {
  try {
    const telegramId = Number(req.params.telegramId);
    if (!Number.isSafeInteger(telegramId) || telegramId <= 0) {
      return res.status(400).json({ error: 'telegram_id butun son bo\'lishi kerak' });
    }

    const limit = Math.min(500, Math.max(1, Number(req.query.limit) || 200));

    const { rows } = await pool.query(
      `SELECT e.id, e.event_type, e.meta, e.created_at
         FROM funnel_events e
         JOIN users u ON u.id = e.user_id
        WHERE u.telegram_id = $1
        ORDER BY e.created_at DESC, e.id DESC
        LIMIT $2`,
      [telegramId, limit]
    );

    res.json({
      data: rows.map((row) => ({ ...row, id: Number(row.id) })),
      count: rows.length,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
