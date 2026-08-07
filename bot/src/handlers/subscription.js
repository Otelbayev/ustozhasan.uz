/**
 * Kanalga obuna bosqichi: "Boshlash 🚀" -> obuna tekshiruvi -> telefon bosqichi.
 */

const content = require('../content');
const { subscribeKeyboard, phoneKeyboard } = require('../keyboards');
const { setFunnelStage, setSubscriptionStatus } = require('../db/queries');
const { logEvent } = require('../db/eventQueue');
const { isUserSubscribed } = require('../utils/subscription');
const { ensureUser } = require('./start');
const { STAGES, EVENTS } = require('../funnel');

/**
 * Obuna tasdiqlangandan keyingi qadam — telefon so'raymiz.
 * Bir nechta joydan chaqiriladi, shuning uchun alohida funksiya.
 */
async function proceedToPhoneStage(ctx, user) {
  // Foydalanuvchi allaqachon raqamini bergan bo'lsa, qayta so'ramaymiz
  if (user?.phone_number) {
    await ctx.reply(content.NEXT_STAGE, { parse_mode: 'HTML' });
    if (user) setFunnelStage(user.id, STAGES.COMPLETED).catch(() => {});
    return;
  }

  await ctx.reply(content.PHONE_REQUEST, { parse_mode: 'HTML', ...phoneKeyboard });

  if (user) {
    setFunnelStage(user.id, STAGES.AWAITING_PHONE).catch(() => {});
    logEvent(user.id, EVENTS.PHONE_REQUESTED);
  }
}

async function handleSubscriptionCheck(ctx, { fromButton }) {
  const user = await ensureUser(ctx);
  const subscribed = await isUserSubscribed(ctx, ctx.from.id);

  if (user) setSubscriptionStatus(user.id, subscribed).catch(() => {});

  if (subscribed) {
    if (fromButton) await ctx.answerCbQuery(content.SUBSCRIBE_OK);
    if (user) {
      setFunnelStage(user.id, STAGES.SUBSCRIBED).catch(() => {});
      logEvent(user.id, EVENTS.SUBSCRIPTION_CONFIRMED);
    }
    await proceedToPhoneStage(ctx, user);
    return;
  }

  if (fromButton) {
    await ctx.answerCbQuery(content.SUBSCRIBE_FAIL, { show_alert: true });
  }
  if (user) {
    setFunnelStage(user.id, STAGES.AWAITING_SUBSCRIPTION).catch(() => {});
    logEvent(user.id, EVENTS.SUBSCRIPTION_FAILED);
  }
}

function registerSubscriptionHandlers(bot) {
  bot.action('begin_funnel', async (ctx) => {
    await ctx.answerCbQuery();

    const user = await ensureUser(ctx);
    if (user) logEvent(user.id, EVENTS.BEGIN_CLICKED);

    const subscribed = await isUserSubscribed(ctx, ctx.from.id);
    if (user) setSubscriptionStatus(user.id, subscribed).catch(() => {});

    if (subscribed) {
      if (user) {
        setFunnelStage(user.id, STAGES.SUBSCRIBED).catch(() => {});
        logEvent(user.id, EVENTS.SUBSCRIPTION_CONFIRMED);
      }
      await proceedToPhoneStage(ctx, user);
      return;
    }

    if (user) {
      setFunnelStage(user.id, STAGES.AWAITING_SUBSCRIPTION).catch(() => {});
      logEvent(user.id, EVENTS.SUBSCRIPTION_REQUIRED);
    }
    await ctx.reply(content.SUBSCRIBE, subscribeKeyboard);
  });

  // "✅ Tekshirish" tugmasi
  bot.action('check_sub', (ctx) => handleSubscriptionCheck(ctx, { fromButton: true }));
}

module.exports = { registerSubscriptionHandlers, proceedToPhoneStage };
