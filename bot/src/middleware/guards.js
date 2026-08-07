/**
 * Botning barqarorligi va kirish nazorati uchun middleware'lar.
 */

const { ADMIN_IDS } = require('../config');
const { ERRORS, SITE } = require('../content');
const { TtlCache, startPruning } = require('../utils/cache');
const { markBlocked } = require('../db/queries');
const metrics = require('../utils/metrics');
const logger = require('../utils/logger');

/**
 * Bir xil update ikki marta ishlanmasligi uchun.
 *
 * Telegram webhook'ga javob 200 bilan qaytmasa (masalan deploy paytida),
 * o'sha update'ni qayta yuboradi. Dedup bo'lmasa foydalanuvchi bir xil
 * xabarni ikki marta oladi va funnel hodisalari ikkilanadi.
 */
const seenUpdates = new TtlCache({ ttlMs: 10 * 60_000, maxSize: 50_000 });
startPruning([seenUpdates]);

function dedupe() {
  return async (ctx, next) => {
    const id = ctx.update?.update_id;
    if (id === undefined) return next();

    if (!seenUpdates.addIfAbsent(id)) {
      logger.debug('Takroriy update tashlandi', { update_id: id });
      return;
    }
    return next();
  };
}

/**
 * Bot faqat shaxsiy chatda ishlaydi.
 * Guruhga qo'shib yuborilsa, u yerda funnel mantiqi ma'nosiz bo'ladi.
 */
function privateOnly() {
  return async (ctx, next) => {
    const type = ctx.chat?.type;
    if (!type || type === 'private') return next();

    // Guruhda faqat to'g'ridan-to'g'ri murojaat bo'lsa javob beramiz
    if (ctx.message?.text?.startsWith('/start')) {
      await ctx.reply(`${ERRORS.onlyPrivate} ${SITE.telegram}`).catch(() => {});
    }
  };
}

/**
 * Har bir update'ni vaqt bo'yicha o'lchaydi va sekin bo'lsa ogohlantiradi.
 * Bu yuklama muammosini erta payqash uchun eng arzon usul.
 */
function timing() {
  return async (ctx, next) => {
    const started = Date.now();
    let failed = false;
    try {
      await next();
    } catch (err) {
      failed = true;
      throw err;
    } finally {
      const ms = Date.now() - started;
      metrics.recordUpdate({ ms, failed });

      if (ms > 2_000) {
        logger.warn('Sekin update', { type: ctx.updateType, ms });
      } else {
        logger.debug('update', { type: ctx.updateType, ms });
      }
    }
  };
}

/**
 * Handler ichidagi xato butun jarayonni yiqitmasligi va foydalanuvchi
 * texnik xabarni ko'rmasligi uchun.
 */
function errorBoundary() {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      logger.error('Handler xatosi', { type: ctx.updateType, from: ctx.from?.id, err });

      // Foydalanuvchi botni bloklagan — bu xato emas, holat
      if (err?.response?.error_code === 403) {
        if (ctx.from?.id) markBlocked(ctx.from.id).catch(() => {});
        return;
      }

      // Foydalanuvchiga faqat umumiy xabar. Texnik tafsilot — logda.
      if (ctx.callbackQuery) {
        await ctx.answerCbQuery(ERRORS.generic, { show_alert: true }).catch(() => {});
      } else {
        await ctx.reply(ERRORS.generic).catch(() => {});
      }
    }
  };
}

/** Faqat ADMIN_IDS ro'yxatidagilar uchun. */
function adminOnly(handler) {
  return async (ctx) => {
    if (!ADMIN_IDS.includes(ctx.from?.id)) {
      // Buyruq borligini ham bildirmaymiz — javobsiz qoldiramiz
      logger.warn('Admin buyrug\'iga ruxsatsiz urinish', { from: ctx.from?.id });
      return;
    }
    return handler(ctx);
  };
}

module.exports = { dedupe, privateOnly, timing, errorBoundary, adminOnly };
