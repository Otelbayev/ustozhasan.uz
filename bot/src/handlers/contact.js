/**
 * Telefon raqamini qabul qilish bosqichi.
 *
 * XAVFSIZLIK: Telegram'da foydalanuvchi CHET KISHINING kontaktini ham yubora
 * oladi (kontaktlar ro'yxatidan tanlab). Bunday xabar ham xuddi shu handler'ga
 * tushadi. Shuning uchun `contact.user_id === ctx.from.id` tekshiruvi majburiy —
 * aks holda begona odamlarning raqamlari bazaga tushib qolardi (bu ham
 * ma'lumot ifloslanishi, ham shaxsiy ma'lumotlarni ruxsatsiz yig'ish).
 */

const content = require('../content');
const { removeKeyboard, siteKeyboard } = require('../keyboards');
const { setFunnelStage, setPhoneNumber } = require('../db/queries');
const { logEvent } = require('../db/eventQueue');
const { ensureUser } = require('./start');
const { STAGES, EVENTS } = require('../funnel');

const SKIP_TEXT = '⏭ Keyinroq';

/**
 * Raqamni yagona ko'rinishga keltiradi: faqat raqamlar + boshida "+".
 * Telegram ba'zan "+998901234567", ba'zan "998901234567" qaytaradi.
 */
function normalizePhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length < 9 || digits.length > 15) return null;
  return `+${digits}`;
}

function registerContactHandlers(bot) {
  bot.on('contact', async (ctx) => {
    const contact = ctx.message.contact;

    // ⬇️ Eng muhim tekshiruv: bu foydalanuvchining O'Z raqamimi?
    if (contact.user_id !== ctx.from.id) {
      await ctx.reply(content.PHONE_FOREIGN);
      return;
    }

    const phone = normalizePhone(contact.phone_number);
    if (!phone) {
      await ctx.reply(content.PHONE_FOREIGN);
      return;
    }

    const user = await ensureUser(ctx);

    await ctx.reply(content.phoneSaved(phone), {
      parse_mode: 'HTML',
      ...removeKeyboard,
    });
    await ctx.reply(content.NEXT_STAGE, { parse_mode: 'HTML', ...siteKeyboard });

    if (user) {
      setPhoneNumber(user.id, phone).catch(() => {});
      setFunnelStage(user.id, STAGES.PHONE_SHARED).catch(() => {});
      logEvent(user.id, EVENTS.PHONE_SHARED);
    }
  });

  bot.hears(SKIP_TEXT, async (ctx) => {
    const user = await ensureUser(ctx);

    await ctx.reply(content.PHONE_SKIPPED, { ...removeKeyboard });
    await ctx.reply(content.NEXT_STAGE, { parse_mode: 'HTML', ...siteKeyboard });

    if (user) logEvent(user.id, EVENTS.PHONE_SKIPPED);
  });
}

module.exports = { registerContactHandlers, normalizePhone };
