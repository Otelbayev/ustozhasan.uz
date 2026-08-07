const { Markup } = require('telegraf');
const { CHANNEL_INVITE_LINK } = require('./config');
const { SITE } = require('./content');

/**
 * Tugmalar.
 *
 * Xavfsizlik qoidasi: callback_data ichiga HECH QACHON foydalanuvchi ID si
 * yoki boshqa "ishonchli" ma'lumot yozilmaydi. Callback data'ni foydalanuvchi
 * o'zgartira oladi (Telegram uni imzolamaydi) — shuning uchun kim
 * bosganini faqat ctx.from.id dan olamiz.
 */

const welcomeKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('Boshlash 🚀', 'begin_funnel')],
  [Markup.button.callback('📚 Kurs haqida', 'show_course')],
]);

const subscribeKeyboard = Markup.inlineKeyboard([
  [Markup.button.url('📢 Kanalga obuna bo\'lish', CHANNEL_INVITE_LINK)],
  [Markup.button.callback('✅ Tekshirish', 'check_sub')],
]);

/**
 * Telefon so'rash. Bu — reply keyboard (klaviatura o'rnida chiqadi),
 * chunki request_contact faqat shu turda ishlaydi.
 */
const phoneKeyboard = Markup.keyboard([
  [Markup.button.contactRequest('📱 Raqamni ulashish')],
  ['⏭ Keyinroq'],
])
  .resize()
  .oneTime();

const removeKeyboard = Markup.removeKeyboard();

const siteKeyboard = Markup.inlineKeyboard([
  [Markup.button.url('🌐 Sayt: kurs haqida batafsil', SITE.url)],
  [Markup.button.url('💬 Ustoz bilan bog\'lanish', SITE.telegram)],
]);

module.exports = {
  welcomeKeyboard,
  subscribeKeyboard,
  phoneKeyboard,
  removeKeyboard,
  siteKeyboard,
};
