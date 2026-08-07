/**
 * Ma'lumot buyruqlari: /kurs, /ustoz, /aloqa, /help.
 * Bular voronkadan tashqarida — foydalanuvchi istalgan vaqtda ko'ra oladi.
 */

const content = require('../content');
const { siteKeyboard } = require('../keyboards');
const { logEvent } = require('../db/eventQueue');
const { ensureUser } = require('./start');
const { EVENTS } = require('../funnel');

function registerInfoHandlers(bot) {
  bot.command('kurs', async (ctx) => {
    await ctx.reply(content.COURSE, { parse_mode: 'HTML', ...siteKeyboard });
    const user = await ensureUser(ctx);
    if (user) logEvent(user.id, EVENTS.COURSE_VIEWED, { via: 'command' });
  });

  bot.action('show_course', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply(content.COURSE, { parse_mode: 'HTML', ...siteKeyboard });
    const user = await ensureUser(ctx);
    if (user) logEvent(user.id, EVENTS.COURSE_VIEWED, { via: 'button' });
  });

  bot.command('ustoz', (ctx) => ctx.reply(content.TEACHER, { parse_mode: 'HTML', ...siteKeyboard }));
  bot.command('aloqa', (ctx) => ctx.reply(content.CONTACT, { parse_mode: 'HTML', ...siteKeyboard }));
  bot.command('help', (ctx) => ctx.reply(content.HELP, { parse_mode: 'HTML' }));
}

module.exports = { registerInfoHandlers };
