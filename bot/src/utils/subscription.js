/**
 * Kanalga obuna holatini tekshiradi.
 *
 * Muhim: bot kanalda ADMIN bo'lishi shart, aks holda getChatMember ishlamaydi.
 *
 * Yuklama: har bosishda Telegram'ga so'rov yuborish ikki muammo tug'diradi —
 * (1) foydalanuvchi javobni kutadi, (2) Telegram API limitiga urilamiz.
 * Shuning uchun natija 90 soniyaga cache'lanadi.
 *
 * Cache'ning ikki tomoni ataylab farqli:
 *   • "obuna bo'lgan"  -> 90s saqlanadi (odam obunani darrov tashlab ketmaydi);
 *   • "obuna emas"     -> saqlanmaydi, chunki foydalanuvchi hozirgina obuna
 *     bo'lib "✅ Tekshirish" ni bosishi mumkin — eski javob berib bo'lmaydi.
 */

const { CHANNEL_USERNAME } = require('../config');
const { TtlCache } = require('./cache');
const logger = require('./logger');

const ACTIVE_STATUSES = new Set(['member', 'administrator', 'creator']);

const subscribedCache = new TtlCache({ ttlMs: 90_000, maxSize: 50_000 });

/**
 * @returns {Promise<boolean>}
 */
async function isUserSubscribed(ctx, telegramUserId) {
  if (subscribedCache.get(telegramUserId)) return true;

  try {
    const member = await ctx.telegram.getChatMember(CHANNEL_USERNAME, telegramUserId);
    const subscribed = ACTIVE_STATUSES.has(member.status);

    if (subscribed) subscribedCache.set(telegramUserId, true);
    return subscribed;
  } catch (err) {
    // Eng ko'p uchraydigan sabab: bot kanalda admin emas. Buni aniq ko'rsatamiz,
    // aks holda "hech kim obuna bo'lolmayapti" muammosini topish qiyin bo'ladi.
    if (/not enough rights|chat not found|CHAT_ADMIN_REQUIRED/i.test(err.message)) {
      logger.error(
        `Obunani tekshirib bo'lmadi — bot ${CHANNEL_USERNAME} kanalida ADMIN emasmi? Tekshiring.`,
        { err: err.message }
      );
    } else {
      logger.warn('Obunani tekshirishda xatolik', { err: err.message });
    }
    // Xatolik bo'lsa xavfsiz tomonga: obuna emas deb hisoblaymiz
    return false;
  }
}

/** Obuna bekor qilinganda cache'ni tozalash uchun (masalan admin buyrug'idan). */
function invalidate(telegramUserId) {
  subscribedCache.delete(telegramUserId);
}

module.exports = { isUserSubscribed, invalidate, subscribedCache };
