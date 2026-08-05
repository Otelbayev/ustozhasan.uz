# ustozhasan.uz — Kompyuter savodxonligi kurslari

Hasan Abdullayev (Ustoz Hasan) uchun bir sahifali sotuv sayti (landing page).
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
| Muammolar | `src/sections/Problems.tsx` | "Bu holatlar sizga tanishmi?" |
| Ustoz haqida | `src/sections/About.tsx` | Hasan Abdullayev, suratlar, ijtimoiy tarmoqlar |
| Kurslar | `src/sections/Courses.tsx` | 6 ta modul, 44 ta dars |
| Afzalliklar | `src/sections/Benefits.tsx` | Nima uchun aynan Ustoz Hasan |
| Kimlar uchun | `src/sections/Audience.tsx` | Maqsadli auditoriya |
| Jarayon | `src/sections/Process.tsx` | 4 qadam |
| Fikrlar | `src/sections/Testimonials.tsx` | O'quvchilar sharhlari |
| Narxlar | `src/sections/Pricing.tsx` | 3 ta tarif |
| Ariza | `src/sections/LeadForm.tsx` | Forma → Telegramga tayyor xabar |
| Savol-javob | `src/sections/Faq.tsx` | FAQ akkordeon |
| Aloqa | `src/sections/Contact.tsx` | Telefon / Telegram / Instagram |
| Footer | `src/sections/Footer.tsx` | Pastki qism |
| Suzuvchi tugmalar | `src/sections/FloatingCta.tsx` | Doimiy CTA (mobil + desktop) |

## Matn va narxlarni o'zgartirish

Deyarli barcha matnlar bitta faylda: **`src/data/site.ts`**

- `SITE` — telefon, Telegram, Instagram, shahar
- `COURSES` — kurs modullari va mavzular
- `PLANS` — **narxlar** (`450 000`, `900 000` — real narxlaringizga almashtiring)
- `TESTIMONIALS` — o'quvchilar fikrlari (real fikrlar bilan almashtirish tavsiya etiladi)
- `FAQ` — savol-javoblar

> ⚠️ **Muhim:** `FAQ` ni o'zgartirsangiz, `index.html` dagi `FAQPage` structured data blokini ham
> bir xil qilib yangilang — Google'da savol-javob ko'rinishi shunga bog'liq.

## Ariza formasi qanday ishlaydi

Backend yo'q. Foydalanuvchi formani to'ldirgach, tayyor xabar bilan
`https://t.me/Ustoz_Hasan` chati ochiladi — o'quvchi faqat "yuborish" tugmasini bosadi.
Kelajakda backend qo'shilsa, `src/sections/LeadForm.tsx` dagi `handleSubmit` ichiga
`fetch()` so'rovini qo'shish kifoya.

## SEO

Bajarilgan ishlar:

- `index.html` — title, description, keywords, canonical, hreflang, Open Graph, Twitter Card
- Structured data (JSON-LD): `EducationalOrganization`, `Person`, `WebSite`, `Course`, `FAQPage`
- `public/sitemap.xml` — image sitemap bilan (3 ta rasm sarlavha va izohi bilan)
- `public/robots.txt` — Googlebot-Image ruxsati va sitemap havolasi
- SEO'ga mos rasm nomlari va `alt` matnlari:
  - `hasan-abdullayev-kompyuter-savodxonligi-oqituvchisi.jpg`
  - `ustoz-hasan-kompyuter-kurslari-toshkent.jpg`
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
