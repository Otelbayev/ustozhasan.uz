/**
 * Admin buyruqlari. Faqat .env dagi ADMIN_IDS ro'yxatidagilar uchun.
 *
 * Ruxsatsiz odam buyruqni yozsa — javob umuman kelmaydi. Bu ataylab:
 * "sizda ruxsat yo'q" degan javob buyruq borligini oshkor qiladi.
 */

const { adminOnly } = require('../middleware/guards');
const { getFunnelStats } = require('../db/stats');
const { STAGE_ORDER } = require('../funnel');

function formatStats(s) {
  const stageLines = STAGE_ORDER.map((stage) => `   ${stage}: <b>${s.by_stage[stage] || 0}</b>`).join('\n');

  const sourceLines = Object.entries(s.by_source)
    .slice(0, 8)
    .map(([source, count]) => `   ${source}: <b>${count}</b>`)
    .join('\n');

  return [
    '📊 <b>Voronka statistikasi</b>',
    '',
    `👥 Jami: <b>${s.total_users}</b>`,
    `📢 Obuna bo'lgan: <b>${s.subscribed}</b> (${s.conversion.subscribed_pct}%)`,
    `📱 Raqam qoldirgan: <b>${s.with_phone}</b> (${s.conversion.phone_pct}%)`,
    `🚫 Botni bloklagan: <b>${s.blocked}</b>`,
    '',
    `🆕 So'nggi 24 soat: <b>${s.new_24h}</b>`,
    `🆕 So'nggi 7 kun: <b>${s.new_7d}</b>`,
    `🔥 Faol (24s): <b>${s.active_24h}</b>`,
    '',
    '<b>Bosqichlar bo\'yicha:</b>',
    stageLines,
    '',
    '<b>Manba bo\'yicha:</b>',
    sourceLines || '   —',
  ].join('\n');
}

function registerAdminHandlers(bot) {
  bot.command(
    'stats',
    adminOnly(async (ctx) => {
      const stats = await getFunnelStats();
      await ctx.reply(formatStats(stats), { parse_mode: 'HTML' });
    })
  );
}

module.exports = { registerAdminHandlers };
