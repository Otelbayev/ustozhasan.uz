/**
 * Bazaga yozish/o'qish so'rovlari.
 *
 * Barcha so'rovlar parametrlangan ($1, $2 …) — SQL injection'ga yo'l yo'q.
 * Matnni SQL ichiga birlashtirish (string concat) bu faylda taqiqlangan.
 */

const pool = require('./pool');

/**
 * Telegram `from` obyektidan olinishi mumkin bo'lgan HAMMA maydonni saqlaydi.
 * Mavjud foydalanuvchi bo'lsa — yangilaydi va start_count ni oshiradi.
 *
 * @param {object} from  ctx.from
 * @param {object} [chat] ctx.chat
 * @param {object} [extra] { startParam, countsAsStart }
 * @returns {Promise<object>} users jadvalidagi qator
 */
async function upsertUser(from, chat = null, extra = {}) {
  const { startParam = null, countsAsStart = false } = extra;

  const result = await pool.query(
    `INSERT INTO users (
       telegram_id, is_bot, username, first_name, last_name,
       language_code, is_premium, added_to_attachment_menu,
       chat_id, chat_type, start_param, source, raw,
       start_count, first_seen_at, last_seen_at
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11, $12, $13, NOW(), NOW())
     ON CONFLICT (telegram_id) DO UPDATE SET
       username                 = EXCLUDED.username,
       first_name               = EXCLUDED.first_name,
       last_name                = EXCLUDED.last_name,
       language_code            = COALESCE(EXCLUDED.language_code, users.language_code),
       is_premium               = EXCLUDED.is_premium,
       added_to_attachment_menu = EXCLUDED.added_to_attachment_menu,
       chat_id                  = COALESCE(EXCLUDED.chat_id, users.chat_id),
       chat_type                = COALESCE(EXCLUDED.chat_type, users.chat_type),
       -- Manba faqat birinchi marta yoki yangi deep-link kelganda yoziladi
       start_param              = COALESCE(EXCLUDED.start_param, users.start_param),
       source                   = COALESCE(EXCLUDED.source, users.source),
       raw                      = EXCLUDED.raw,
       start_count              = users.start_count + EXCLUDED.start_count,
       last_seen_at             = NOW(),
       updated_at               = NOW(),
       -- Foydalanuvchi yozayotgan bo'lsa, demak botni bloklamagan
       blocked_bot              = FALSE
     RETURNING *`,
    [
      from.id,
      Boolean(from.is_bot),
      from.username || null,
      from.first_name || null,
      from.last_name || null,
      from.language_code || null,
      Boolean(from.is_premium),
      Boolean(from.added_to_attachment_menu),
      chat?.id ?? null,
      chat?.type ?? null,
      startParam,
      JSON.stringify(from),
      countsAsStart ? 1 : 0,
    ]
  );

  return result.rows[0];
}

async function setFunnelStage(userId, stage) {
  await pool.query(`UPDATE users SET funnel_stage = $2, updated_at = NOW() WHERE id = $1`, [
    userId,
    stage,
  ]);
}

async function setSubscriptionStatus(userId, isSubscribed) {
  await pool.query(
    `UPDATE users
        SET is_subscribed = $2, subscription_checked_at = NOW(), updated_at = NOW()
      WHERE id = $1`,
    [userId, isSubscribed]
  );
}

async function setPhoneNumber(userId, phoneNumber) {
  await pool.query(
    `UPDATE users
        SET phone_number = $2, phone_shared_at = NOW(), updated_at = NOW()
      WHERE id = $1`,
    [userId, phoneNumber]
  );
}

async function setPhotoFileId(userId, fileId) {
  await pool.query(`UPDATE users SET photo_file_id = $2, updated_at = NOW() WHERE id = $1`, [
    userId,
    fileId,
  ]);
}

/** Foydalanuvchi botni bloklaganini belgilaydi (Telegram 403 xatosidan). */
async function markBlocked(telegramId) {
  await pool.query(
    `UPDATE users SET blocked_bot = TRUE, updated_at = NOW() WHERE telegram_id = $1`,
    [telegramId]
  );
}

// ── Fayl cache (bot_assets) ──────────────────────────────────────

async function getAsset(key) {
  const { rows } = await pool.query(`SELECT * FROM bot_assets WHERE key = $1`, [key]);
  return rows[0] || null;
}

async function saveAsset({ key, fileId, fileUniqueId, contentHash }) {
  await pool.query(
    `INSERT INTO bot_assets (key, file_id, file_unique_id, content_hash)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (key) DO UPDATE SET
       file_id = EXCLUDED.file_id,
       file_unique_id = EXCLUDED.file_unique_id,
       content_hash = EXCLUDED.content_hash,
       updated_at = NOW()`,
    [key, fileId, fileUniqueId || null, contentHash]
  );
}

module.exports = {
  upsertUser,
  setFunnelStage,
  setSubscriptionStatus,
  setPhoneNumber,
  setPhotoFileId,
  markBlocked,
  getAsset,
  saveAsset,
};
