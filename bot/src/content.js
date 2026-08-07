/**
 * BOTNING BARCHA MATNLARI SHU YERDA.
 *
 * Matnni o'zgartirish uchun boshqa hech qaysi faylga tegish shart emas —
 * faqat shu faylni tahrirlab, botni qayta ishga tushiring.
 * (Saytdagi `frontend/src/data/site.ts` bilan bir xil tamoyil.)
 *
 * Formatlash: Telegram HTML — <b>, <i>, <a href="">, <code>.
 * ⚠️ <br>, <p>, <div> ISHLAMAYDI. Yangi qator uchun oddiy \n ishlating.
 */

const SITE = {
  name: 'Ustoz Hasan',
  teacher: 'Hasan Abdullayev',
  role: 'Kompyuter savodxonligi o\'qituvchisi',
  format: '100% onlayn (Zoom orqali)',
  url: 'https://ustozhasan.uz',
  phone: '+998 93 305 56 35',
  phoneRaw: '+998933055635',
  telegram: 'https://t.me/Ustoz_Hasan',
  telegramUser: '@Ustoz_Hasan',
  instagram: 'https://instagram.com/ustoz_hasan',
  instagramUser: '@ustoz_hasan',
};

/**
 * ── START BOSILMASDAN OLDIN KO'RINADIGAN MATNLAR ──────────────────
 *
 * Bularni `npm run bot:setup` Telegram'ga yuboradi. Foydalanuvchi botni
 * birinchi marta ochganda, hech narsa bosmasdan turib aynan shularni ko'radi.
 *
 * ⚠️ Telegram cheklovlari: description ≤ 512 belgi, shortDescription ≤ 120.
 *    (setup skripti yuborishdan oldin uzunlikni tekshiradi.)
 */
const BOT_PROFILE = {
  // Bo'sh chat ekranida, rasm ostida chiqadi
  description: `Assalomu alaykum! Men ${SITE.name} botiman.

${SITE.teacher} — kompyuter savodxonligi o'qituvchisi. 3+ yil tajriba, 500+ bitiruvchi.

Kurs 100% ONLAYN — Zoom orqali jonli, O'zbekistonning istalgan nuqtasidan. Word, Excel, PowerPoint, Internet xavfsizligi. 0 darajadan boshlanadi.

Birinchi sinov darsi BEPUL.

Boshlash uchun pastdagi "Ishga tushirish" tugmasini bosing 👇`,

  // Bot profilida ("About" bo'limi)
  shortDescription: `${SITE.teacher} — onlayn kompyuter savodxonligi kursi. Word, Excel, PowerPoint. 0 dan boshlaymiz. 1-dars bepul.`,

  // Buyruqlar menyusi (chapdagi "/" tugmasi)
  commands: [
    { command: 'start', description: 'Boshlash / qaytadan boshlash' },
    { command: 'kurs', description: 'Kurs dasturi va narxi haqida' },
    { command: 'ustoz', description: 'Hasan Abdullayev haqida' },
    { command: 'aloqa', description: 'Bog\'lanish uchun ma\'lumotlar' },
    { command: 'help', description: 'Yordam' },
  ],

  // Chatdagi menyu tugmasi
  menuButton: { text: '🌐 Sayt', url: SITE.url },
};

/** ── /start dan keyingi salomlashish (rasm ostidagi matn) ───────── */
const welcome = (name) => `
👋 Assalomu alaykum, <b>${name}</b>!

Men <b>${SITE.name}</b> botiman.

👨‍🏫 Kursni <b>${SITE.teacher}</b> olib boradi — ${SITE.role.toLowerCase()}, 3 yildan ortiq tajriba, 500 dan ortiq bitiruvchi.

📚 <b>Kompyuter savodxonligi</b> kursi ${SITE.format} o'tiladi:
• Kompyuter asoslari va Windows
• Microsoft Word, Excel, PowerPoint
• Internet xavfsizligi va onlayn ish yuritish

✅ Kurs <b>0 darajadan</b> boshlanadi — kompyuterni umuman bilmasangiz ham qo'shilasiz.
🎁 Birinchi sinov darsi <b>bepul</b>.

Bu bot orqali kurs haqida to'liq ma'lumot olasiz va yozilasiz.

Boshlash uchun pastdagi tugmani bosing 👇
`.trim();

/** ── Obuna bosqichi ─────────────────────────────────────────────── */
const SUBSCRIBE = `
Davom etishdan oldin rasmiy kanalimizga obuna bo'ling 📢

Kanalda foydali darsliklar, aksiyalar va kurs yangiliklari e'lon qilinadi.

Obuna bo'lgach, "✅ Tekshirish" tugmasini bosing.
`.trim();

const SUBSCRIBE_OK = '✅ Obuna tasdiqlandi!';
const SUBSCRIBE_FAIL = '❌ Hali obuna bo\'lmagansiz. Kanalga qo\'shiling va qayta urinib ko\'ring.';

/** ── Telefon bosqichi ───────────────────────────────────────────── */
const PHONE_REQUEST = `
Ajoyib! 🎉

Endi siz bilan bog'lanishimiz uchun telefon raqamingizni qoldiring — ustozimiz shaxsan qo'ng'iroq qilib, sizga mos guruh va dars vaqtini tanlashda yordam beradi.

Pastdagi <b>"📱 Raqamni ulashish"</b> tugmasini bossangiz, raqamingiz avtomatik yuboriladi.
`.trim();

const PHONE_FOREIGN = '⚠️ Iltimos, o\'zingizning raqamingizni yuboring — tugma orqali.';
const PHONE_SKIPPED = `
Yaxshi, keyinroq qoldirasiz 🙂

Savollaringiz bo'lsa istalgan vaqtda ${SITE.telegramUser} ga yozing yoki ${SITE.phone} raqamiga qo'ng'iroq qiling.
`.trim();

const phoneSaved = (phone) => `
Rahmat! Raqamingiz qabul qilindi ✅
<code>${phone}</code>

Tez orada ustozimiz siz bilan bog'lanadi va <b>bepul sinov darsi</b>ga yozib qo'yadi.

Shu vaqtgacha kurs haqida batafsil: ${SITE.url}
`.trim();

/** ── Buyruqlar ──────────────────────────────────────────────────── */
const COURSE = `
📚 <b>Kompyuter savodxonligi kursi</b>

<b>Format:</b> ${SITE.format}
<b>Davomiyligi:</b> 2 oy — haftasiga 3 marta, 1,5 soatdan jonli dars
<b>Guruh:</b> 5-8 kishi — har kim savol berib ulguradi

<b>Dastur:</b>
1️⃣ Kompyuter asoslari — 8 dars
   Windows, fayl va papkalar, dastur o'rnatish
2️⃣ Microsoft Word — 10 dars
   Ariza, bayonnoma, rezyume, chop etish
3️⃣ Microsoft Excel — 12 dars
   Formulalar, SUM/IF/VLOOKUP, diagramma, hisobot
4️⃣ Microsoft PowerPoint — 6 dars
   Slayd dizayni, animatsiya, taqdimot qilish
5️⃣ Internet xavfsizligi — 4 dars
   Kuchli parol, firibgarlikni aniqlash, karta xavfsizligi
6️⃣ Onlayn ish yuritish — 4 dars
   Gmail, Telegram, Zoom, Google Docs

<b>Nimalar kiradi:</b>
✅ Har bir dars yozib olinadi — qoldirsangiz ham yo'qotmaysiz
✅ Yakunda elektron sertifikat
✅ Birinchi sinov darsi bepul

Narx va joriy aksiyalar bo'yicha: ${SITE.telegramUser} yoki ${SITE.phone}
Batafsil: ${SITE.url}
`.trim();

const TEACHER = `
👨‍🏫 <b>${SITE.teacher}</b>
<i>${SITE.role}</i>

Kompyuter savodxonligi sohasida <b>3 yildan ortiq</b> tajribaga ega o'qituvchi. Shu vaqt ichida <b>500 dan ortiq</b> o'quvchiga kompyuter bilan ishlashni o'rgatgan: talabalar, buxgalterlar, tadbirkorlar va nafaqadagi insonlar.

Darslar 100% onlayn — Zoom orqali jonli o'tadi. Ustoz ekranini ko'rsatib tushuntiradi, siz esa o'z kompyuteringizda birga bajarasiz. Murakkab atamalar yo'q, tushunmagan joyingizni istagancha qayta so'rashingiz mumkin — hech kim shoshiltirmaydi.

📊 3+ yil tajriba · 500+ bitiruvchi · 99% mamnun o'quvchi

📱 Telegram: ${SITE.telegramUser}
📷 Instagram: ${SITE.instagramUser}
🌐 ${SITE.url}
`.trim();

const CONTACT = `
📞 <b>Bog'lanish</b>

Telefon: ${SITE.phone}
Telegram: ${SITE.telegramUser}
Instagram: ${SITE.instagramUser}
Sayt: ${SITE.url}

Ish vaqti: har kuni 09:00 – 20:00
`.trim();

const HELP = `
ℹ️ <b>Yordam</b>

/start — boshlash yoki qaytadan boshlash
/kurs — kurs dasturi va davomiyligi
/ustoz — ${SITE.teacher} haqida
/aloqa — bog'lanish ma'lumotlari

Savolingizga javob topmadingizmi? ${SITE.telegramUser} ga yozing yoki ${SITE.phone} raqamiga qo'ng'iroq qiling.
`.trim();

/** ── Xizmat xabarlari ───────────────────────────────────────────── */
const ERRORS = {
  // Foydalanuvchi HECH QACHON texnik xato matnini ko'rmaydi
  generic: '😔 Kutilmagan xatolik yuz berdi. Biroz kutib, qayta urinib ko\'ring yoki /start bosing.',
  tooFast: 'Biroz sekinroq 🙂',
  onlyPrivate: 'Bu bot faqat shaxsiy chatda ishlaydi. Menga to\'g\'ridan-to\'g\'ri yozing 👉',
};

const NEXT_STAGE = `
Rahmat! Barcha ma'lumotlar qabul qilindi ✅

Kurs haqida savollaringiz bo'lsa /kurs buyrug'ini bosing yoki to'g'ridan-to'g'ri ${SITE.telegramUser} ga yozing.
`.trim();

module.exports = {
  SITE,
  BOT_PROFILE,
  welcome,
  SUBSCRIBE,
  SUBSCRIBE_OK,
  SUBSCRIBE_FAIL,
  PHONE_REQUEST,
  PHONE_FOREIGN,
  PHONE_SKIPPED,
  phoneSaved,
  COURSE,
  TEACHER,
  CONTACT,
  HELP,
  ERRORS,
  NEXT_STAGE,
};
