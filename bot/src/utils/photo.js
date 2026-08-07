/**
 * Rasmni Telegram'ga BIR MARTA yuklaydi, keyin faqat `file_id` bilan yuboradi.
 *
 * Nega: eski kodda har `/start` da 800KB+ fayl qaytadan yuklanardi. 1000 ta
 * foydalanuvchi = 800MB chiqish trafigi va Telegram'ning yuklash limitiga
 * urilish. file_id bilan esa har safar bir necha o'nlab bayt ketadi.
 *
 * Cache ikki qatlamli:
 *   1) xotira — eng tez;
 *   2) bot_assets jadvali — process qayta ishga tushganda ham saqlanadi.
 *
 * ⚠️ file_id har bir bot uchun alohida. Shuning uchun cache kaliti bot ID
 * bilan birga saqlanadi — dev bot va production bot bir-birining file_id sini
 * ishlatib yubormaydi.
 */

const fs = require('fs');
const crypto = require('crypto');
const { BOT_TOKEN } = require('../config');
const { getAsset, saveAsset } = require('../db/queries');
const logger = require('./logger');

const BOT_ID = BOT_TOKEN.split(':')[0];
const memory = new Map(); // key -> file_id
const hashes = new Map(); // filePath -> sha256

/**
 * Fayl hash'i bir marta hisoblanadi.
 * Memoizatsiyasiz: baza ishlamay qolgan paytda har `/start` da 800KB fayl
 * diskdan SINXRON o'qilardi va butun event loop to'xtab turardi.
 */
function hashFile(filePath) {
  let hash = hashes.get(filePath);
  if (!hash) {
    hash = crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
    hashes.set(filePath, hash);
  }
  return hash;
}

/**
 * Rasm yuboradi: iloji bo'lsa cache'dagi file_id bilan, aks holda fayldan.
 *
 * @param {import('telegraf').Context} ctx
 * @param {string} name       cache nomi, masalan 'hasan'
 * @param {string} filePath   fayl yo'li
 * @param {object} extra      caption, parse_mode, tugmalar…
 */
async function sendPhotoCached(ctx, name, filePath, extra = {}) {
  const key = `${name}:${BOT_ID}`;

  let fileId = memory.get(key);

  if (!fileId) {
    try {
      const row = await getAsset(key);
      // Fayl almashtirilgan bo'lsa (hash boshqa) — eski file_id ni ishlatmaymiz
      if (row && row.content_hash === hashFile(filePath)) {
        fileId = row.file_id;
        memory.set(key, fileId);
      }
    } catch (err) {
      // Baza ishlamayapti — muammo emas, faylni to'g'ridan-to'g'ri yuboramiz
      logger.warn('Rasm cache\'ini o\'qib bo\'lmadi', { key, err: err.message });
    }
  }

  if (fileId) {
    try {
      return await ctx.replyWithPhoto(fileId, extra);
    } catch (err) {
      // file_id eskirgan/yaroqsiz — pastda fayldan qayta yuboriladi
      logger.warn('Cache\'dagi file_id ishlamadi, fayldan yuborilmoqda', { key, err: err.message });
      memory.delete(key);
    }
  }

  const message = await ctx.replyWithPhoto({ source: filePath }, extra);

  // Telegram bir nechta o'lchamni qaytaradi — eng kattasini saqlaymiz
  const largest = message?.photo?.[message.photo.length - 1];
  if (largest?.file_id) {
    memory.set(key, largest.file_id);
    saveAsset({
      key,
      fileId: largest.file_id,
      fileUniqueId: largest.file_unique_id,
      contentHash: hashFile(filePath),
    }).catch((err) => logger.warn('Rasm cache\'ini saqlab bo\'lmadi', { key, err: err.message }));

    logger.info('Rasm yuklandi va cache\'landi', { key });
  }

  return message;
}

module.exports = { sendPhotoCached };
