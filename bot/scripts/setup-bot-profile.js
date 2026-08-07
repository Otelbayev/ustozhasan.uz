/**
 * Bot profilini Telegram'ga o'rnatadi:  npm run bot:setup
 *
 * Bu — foydalanuvchi HALI /start BOSMAGAN holatda ko'radigan hamma narsa:
 *   • description      — bo'sh chat ekranidagi matn (rasm ostida)
 *   • short description— bot profilidagi "About"
 *   • commands         — chapdagi "/" menyusi
 *   • menu button      — chatdagi menyu tugmasi
 *
 * ⚠️ Bot PROFIL RASMI va DESCRIPTION RASMI ni Bot API o'rnata olmaydi —
 *    Telegram'da bunday metod yo'q. Ularni BotFather orqali qo'yasiz:
 *      @BotFather -> /mybots -> botni tanlang
 *        -> Edit Bot -> Edit Botpic            (profil rasmi)
 *        -> Edit Bot -> Edit Description Picture (bo'sh chatdagi rasm)
 *    Rasm tayyor: bot/assets/hasan.jpg
 *
 * Skriptni istalgan vaqtda qayta ishga tushirsa bo'ladi — matn o'zgarganda
 * src/content.js ni tahrirlab, shu buyruqni qayta bering.
 */

const { Telegram } = require('telegraf');
const config = require('../src/config');
const { BOT_PROFILE } = require('../src/content');
const logger = require('../src/utils/logger');

const LIMITS = { description: 512, shortDescription: 120 };

async function main() {
  // Uzunlikni oldindan tekshiramiz — Telegram xatosi tushunarsiz bo'ladi
  for (const [field, max] of Object.entries(LIMITS)) {
    const length = BOT_PROFILE[field].length;
    if (length > max) {
      throw new Error(
        `content.js -> BOT_PROFILE.${field} juda uzun: ${length} belgi (ruxsat: ${max}). Qisqartiring.`
      );
    }
  }

  const telegram = new Telegram(config.BOT_TOKEN);
  const me = await telegram.getMe();
  logger.info(`Bot: @${me.username} (${me.id})`);

  await telegram.setMyDescription(BOT_PROFILE.description);
  logger.info(`✓ Description o'rnatildi (${BOT_PROFILE.description.length}/${LIMITS.description})`);

  await telegram.setMyShortDescription(BOT_PROFILE.shortDescription);
  logger.info(`✓ Short description o'rnatildi (${BOT_PROFILE.shortDescription.length}/${LIMITS.shortDescription})`);

  await telegram.setMyCommands(BOT_PROFILE.commands);
  logger.info(`✓ ${BOT_PROFILE.commands.length} ta buyruq o'rnatildi`);

  await telegram.setChatMenuButton({
    menuButton: {
      type: 'web_app',
      text: BOT_PROFILE.menuButton.text,
      web_app: { url: BOT_PROFILE.menuButton.url },
    },
  });
  logger.info(`✓ Menyu tugmasi: "${BOT_PROFILE.menuButton.text}" -> ${BOT_PROFILE.menuButton.url}`);

  logger.info('');
  logger.info('Tayyor. Endi BotFather orqali RASMLARNI qo\'ying (Bot API buni qila olmaydi):');
  logger.info('   @BotFather -> /mybots -> Edit Bot -> Edit Botpic');
  logger.info('   @BotFather -> /mybots -> Edit Bot -> Edit Description Picture');
  logger.info('   Rasm: bot/assets/hasan.jpg');
}

main().catch((err) => {
  logger.error('Profilni o\'rnatib bo\'lmadi', { err: err.message });
  process.exit(1);
});
