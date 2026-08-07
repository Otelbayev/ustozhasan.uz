/**
 * Telegraf bot nusxasini yig'adi (middleware'lar + handler'lar).
 *
 * Bu fayl botni ISHGA TUSHIRMAYDI — buni src/index.js qiladi. Shu sabab
 * bot obyektidan skriptlarda (masalan `npm run bot:setup`) ham foydalanish
 * mumkin, keraksiz yon ta'sirlarsiz.
 */

const { Telegraf } = require('telegraf');
const config = require('./config');
const logger = require('./utils/logger');

const { rateLimit } = require('./middleware/rateLimit');
const { dedupe, privateOnly, timing, errorBoundary } = require('./middleware/guards');

const { registerStartHandlers } = require('./handlers/start');
const { registerSubscriptionHandlers } = require('./handlers/subscription');
const { registerContactHandlers } = require('./handlers/contact');
const { registerInfoHandlers } = require('./handlers/info');
const { registerAdminHandlers } = require('./handlers/admin');

const bot = new Telegraf(config.BOT_TOKEN, {
  // Bitta update 30 soniyadan ortiq ishlanmasin — osilib qolgan handler
  // butun navbatni to'xtatib qo'ymasligi kerak.
  handlerTimeout: 30_000,
  telegram: {
    // Javobni webhook javobiga tiqmaymiz: alohida so'rov sekinroq, lekin
    // xatolarni ko'rsatadi va bir necha xabar yuborish imkonini beradi.
    webhookReply: false,
  },
});

// Tartib muhim:
//   dedupe        — takroriy update umuman ishlanmasin
//   errorBoundary — undan keyingi HAMMA narsani o'rab oladi
//   timing        — errorBoundary'dan ICHKARIDA: xato ushlanishidan oldin
//                   uni ko'rib, hisoblagichga yozib qolsin
//   privateOnly   — guruhdagi xabarlar bo'sh ishlov bermasin
//   rateLimit     — eng oxirida, chunki u ham javob yuborishi mumkin
bot.use(dedupe());
bot.use(errorBoundary());
bot.use(timing());
bot.use(privateOnly());
bot.use(rateLimit());

registerStartHandlers(bot);
registerSubscriptionHandlers(bot);
registerContactHandlers(bot);
registerInfoHandlers(bot);
registerAdminHandlers(bot);

// errorBoundary ushlamay qolgan holatlar uchun oxirgi to'siq
bot.catch((err, ctx) => {
  logger.error('Telegraf xatosi', { type: ctx?.updateType, err });
});

module.exports = bot;
