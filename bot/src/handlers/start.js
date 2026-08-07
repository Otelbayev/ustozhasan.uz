/**
 * /start — voronkaning birinchi qadami.
 *
 * Asosiy tamoyil: FOYDALANUVCHI BIRINCHI, BAZA KEYIN.
 * Eski kodda avval `await upsertUser(...)` bajarilardi — baza sekinlashsa yoki
 * tushib qolsa, foydalanuvchi umuman javob olmasdi. Endi Telegram'ga javob va
 * bazaga yozish PARALLEL ketadi; baza xato bersa ham odam salomlashuvni ko'radi.
 */

const path = require('path');
const content = require('../content');
const { welcomeKeyboard } = require('../keyboards');
const { upsertUser, setFunnelStage, setPhotoFileId } = require('../db/queries');
const { logEvent } = require('../db/eventQueue');
const { sendPhotoCached } = require('../utils/photo');
const { displayName } = require('../utils/html');
const { STAGES, EVENTS } = require('../funnel');
const logger = require('../utils/logger');

const HASAN_PHOTO_PATH = path.join(__dirname, '..', '..', 'assets', 'hasan.jpg');

/** Deep-link payload: "/start web_hero" -> "web_hero" */
function readStartParam(ctx) {
  const raw = ctx.startPayload || ctx.message?.text?.split(' ')[1] || '';
  // Faqat xavfsiz belgilar; uzunligi cheklangan (bu qiymat bazaga tushadi)
  const cleaned = raw.trim().slice(0, 64);
  return /^[\w.-]+$/.test(cleaned) ? cleaned : null;
}

/**
 * Foydalanuvchini bazaga yozadi. Xato bo'lsa `null` qaytaradi — chaqiruvchi
 * tomon shunda ham ishlashda davom etadi.
 */
async function ensureUser(ctx, extra = {}) {
  try {
    return await upsertUser(ctx.from, ctx.chat, extra);
  } catch (err) {
    logger.error('Foydalanuvchini saqlab bo\'lmadi', { from: ctx.from?.id, err: err.message });
    return null;
  }
}

/** Profil rasmini fon rejimida oladi — foydalanuvchi buni kutmaydi. */
function fetchProfilePhoto(ctx, userId) {
  ctx.telegram
    .getUserProfilePhotos(ctx.from.id, 0, 1)
    .then((res) => {
      const fileId = res?.photos?.[0]?.slice(-1)[0]?.file_id;
      if (fileId && userId) return setPhotoFileId(userId, fileId);
    })
    .catch(() => {
      /* profil rasmi yopiq bo'lishi mumkin — muammo emas */
    });
}

function registerStartHandlers(bot) {
  bot.start(async (ctx) => {
    const startParam = readStartParam(ctx);

    // Baza va Telegram bir vaqtda ishlaydi
    const userPromise = ensureUser(ctx, { startParam, countsAsStart: true });

    await sendPhotoCached(ctx, 'hasan', HASAN_PHOTO_PATH, {
      caption: content.welcome(displayName(ctx.from)),
      parse_mode: 'HTML',
      ...welcomeKeyboard,
    });

    const user = await userPromise;
    if (!user) return;

    logEvent(user.id, EVENTS.START, { start_param: startParam, start_count: user.start_count });

    // Qaytib kelgan foydalanuvchining bosqichini orqaga surmaymiz
    if (user.funnel_stage === STAGES.STARTED || user.start_count <= 1) {
      setFunnelStage(user.id, STAGES.STARTED).catch(() => {});
    }

    if (!user.photo_file_id) fetchProfilePhoto(ctx, user.id);
  });
}

module.exports = { registerStartHandlers, ensureUser, HASAN_PHOTO_PATH };
