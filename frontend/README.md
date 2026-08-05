# ustozhasan.uz — Onlayn kompyuter savodxonligi kursi

Hasan Abdullayev (Ustoz Hasan) uchun bir sahifali sotuv sayti (landing page).
Kurs formati: **100% onlayn (Zoom orqali), O'zbekiston bo'ylab** — saytdagi barcha matnlar shunga moslangan.
Texnologiyalar: **React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui**.

## Ishga tushirish

```bash
npm install      # bir marta
npm run dev      # http://localhost:3000
npm run build    # dist/ papkasiga production versiyani yigʻadi
npm run preview  # yigʻilgan versiyani tekshirish
```

## Sayt tuzilishi

| Bo'lim | Fayl | Vazifasi |
| --- | --- | --- |
| Navigatsiya | `src/sections/Navbar.tsx` | Yuqoridagi menyu + telefon tugmasi |
| Hero | `src/sections/Hero.tsx` | Asosiy sarlavha, statistika, CTA |
| Hero formasi | `src/sections/HeroForm.tsx` | Qisqa ariza: F.I.SH. + telefon |
| Muammolar | `src/sections/Problems.tsx` | "Bu holatlar sizga tanishmi?" |
| Ustoz haqida | `src/sections/About.tsx` | Hasan Abdullayev, suratlar, ijtimoiy tarmoqlar |
| Kurslar | `src/sections/Courses.tsx` | 6 ta modul, 44 ta dars |
| Afzalliklar | `src/sections/Benefits.tsx` | Nima uchun aynan Ustoz Hasan |
| Kimlar uchun | `src/sections/Audience.tsx` | Maqsadli auditoriya |
| Jarayon | `src/sections/Process.tsx` | 4 qadam |
| Fikrlar | `src/sections/Testimonials.tsx` | O'quvchilar sharhlari |
| Ariza | `src/sections/LeadForm.tsx` | To'liq ariza formasi → Telegram bot |
| Savol-javob | `src/sections/Faq.tsx` | FAQ akkordeon |
| Aloqa | `src/sections/Contact.tsx` | Telefon / Telegram / Instagram |
| Footer | `src/sections/Footer.tsx` | Pastki qism |
| Suzuvchi tugmalar | `src/sections/FloatingCta.tsx` | Doimiy CTA (mobil + desktop) |

## Matnlarni o'zgartirish

Deyarli barcha matnlar bitta faylda: **`src/data/site.ts`**

- `SITE` — telefon, Telegram, Instagram, kurs formati (`format`) va hudud (`area`)
- `COURSES` — kurs modullari va mavzular
- `BENEFITS`, `AUDIENCE`, `PROCESS`, `PROBLEMS` — sotuv bloklari matni
- `TESTIMONIALS` — o'quvchilar fikrlari (real fikrlar bilan almashtirish tavsiya etiladi)
- `FAQ` — savol-javoblar
- `NAV_LINKS` — yuqoridagi menyu

**Narxlar saytda ko'rsatilmaydi** — narx bo'limi butunlay olib tashlangan, o'quvchi narxni
telefon yoki Telegram orqali so'raydi.

> ⚠️ **Muhim:** `FAQ` ni o'zgartirsangiz, `index.html` dagi `FAQPage` structured data blokini ham
> bir xil qilib yangilang — Google'da savol-javob ko'rinishi shunga bog'liq.

## Ariza formalari va Telegram bot

Saytda 2 ta forma bor va **ikkalasi ham arizani Telegram botga yuboradi**:

1. **Hero formasi** (`HeroForm.tsx`) — F.I.SH. + telefon
2. **Asosiy forma** (`LeadForm.tsx`) — F.I.SH. + telefon + yo'nalish + qulay vaqt

Yuborish mantig'i: `src/lib/telegram.ts` (`sendLeadToTelegram`).
Bot: **@ustozhasan_bot**, xabar `chat_id: 1105787891` ga boradi.

### ❗ Ishga tushirishdan oldin — bir marta bajarilishi shart

Telegram'da **@ustozhasan_bot** ni oching va **/start** (Boshlash) tugmasini bosing.
Bosilmasa, Telegram `chat not found` xatosini qaytaradi va arizalar kelmaydi.
(Bir necha kishi ariza olishi kerak bo'lsa: guruh yarating, botni guruhga qo'shing va
`VITE_TELEGRAM_CHAT_ID` ga guruh id sini yozing.)

Agar bot javob bermasa, forma o'quvchiga zaxira tugma ko'rsatadi — ariza matni bilan
Telegram chati ochiladi, ya'ni murojaat yo'qolmaydi.

### ⚠️ Xavfsizlik haqida

Bot tokeni frontend kodida turadi, ya'ni **saytga kirgan har kim uni ko'ra oladi**
(brauzer → Sources → `assets/*.js`) va bot nomidan xabar yubora oladi.
Tavsiya: tokenni serverda saqlash (kichik backend yoki Cloudflare Worker) va saytdan
faqat o'sha manzilga so'rov yuborish. Shunda `src/lib/telegram.ts` dagi `fetch` manzilini
almashtirish kifoya.

Tokenni kod ichidan olib tashlash uchun `.env` fayl yarating (`.env.example` dan nusxa oling):

```
VITE_TELEGRAM_BOT_TOKEN=...
VITE_TELEGRAM_CHAT_ID=...
```

## SEO

Bajarilgan ishlar:

- `index.html` — title, description, keywords, canonical, hreflang, Open Graph, Twitter Card
- Structured data (JSON-LD): `EducationalOrganization`, `Person`, `WebSite`, `Course`, `FAQPage`
- `public/sitemap.xml` — image sitemap bilan (3 ta rasm sarlavha va izohi bilan)
- `public/robots.txt` — Googlebot-Image ruxsati va sitemap havolasi
- Google Rasmlar uchun: har bir rasm `ImageObject` sifatida belgilangan va
  `Person` (Hasan Abdullayev) bilan bog'langan, `WebPage.primaryImageOfPage` ko'rsatilgan,
  rasm nomi/`alt`/`title`/`figcaption` da to'liq ism bor, portret `preload` qilinadi,
  JS ishlamaydigan robotlar uchun `<noscript>` ichida rasmlar va matn takrorlangan
- SEO'ga mos rasm nomlari va `alt` matnlari:
  - `hasan-abdullayev-kompyuter-savodxonligi-oqituvchisi.jpg`
  - `ustoz-hasan-onlayn-kompyuter-kurslari.jpg`
  - `ustoz-hasan-kompyuter-savodxonligi-darslari.jpg`
- Semantik HTML: `header` / `main` / `section` / `footer`, bitta `h1`, `lang="uz"`
- `site.webmanifest`, SVG favicon, 404 sahifasi (`noindex`)

Domen ulangandan keyin:

1. [Google Search Console](https://search.google.com/search-console) da `ustozhasan.uz` ni tasdiqlang
2. `https://ustozhasan.uz/sitemap.xml` ni yuboring
3. [Rich Results Test](https://search.google.com/test/rich-results) orqali structured data'ni tekshiring
4. Yandex Webmaster'ga ham qo'shing (O'zbekistonda Yandex ulushi katta)

## Joylashtirish (deploy)

```bash
npm run build   # natija: dist/ papkasi
```

`dist/` ichidagi barcha fayllarni hostingga yuklang.

- **cPanel / Apache** — `public_html` ga yuklang. `.htaccess` allaqachon ichida:
  HTTPS va www yo'naltirish + SPA fallback ishlaydi.
- **Netlify** — `_redirects` fayli tayyor, build buyrug'i: `npm run build`, papka: `dist`.
- **Vercel** — `vercel.json` tayyor.

Deploydan keyin `index.html`, `sitemap.xml` va `robots.txt` dagi manzillar `https://ustozhasan.uz`
ekanligiga ishonch hosil qiling.
