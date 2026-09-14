# Ustoz Hasan — sotuv sayti

Frameworksiz HTML, CSS, JavaScript. `dist/` — saytning tayyor fayllari (build talab qilinmaydi). Vercel `vercel.json` orqali `dist/` ni joylaydi.

Mahalliy preview: `python3 -m http.server 4173 --directory dist`

## Tuzilma
- `dist/index.html` — varonka sahifa (hero → dasturlar → kim uchun → dastur → qadamlar → tariflar → FAQ → ariza)
- `dist/style.css` — yagona uslublar fayli (thank-you sahifasi ham)
- `dist/app.js` — modal, scroll animatsiyalar, ariza yuborish
- `dist/phone.js` — qat'iy `+998 XX XXX XX XX` telefon maskasi
- `dist/config.js` — Google Apps Script endpointi
- `dist/assets/` — hero rasmlari (AVIF/WebP) va dastur ikonkalari (Word, Excel, PowerPoint, Canva, ChatGPT, Gemini, Claude)
- SEO: `robots.txt`, `sitemap.xml`, `site.webmanifest`, `og-image.jpg`, favicon to'plami

Google Sheets ulanishi: [yo‘riqnoma](integration/ULASH.md). `dist/config.js` endpointi bo‘sh bo‘lsa ariza yuborilmaydi.

## Tekshiruv
- `node --test tests/phone.test.mjs tests/apps-script.test.mjs`
- Brauzer testi (Google javobi mock): server ishga tushirilgach `node tests/browser.cjs` (`PLAYWRIGHT_PATH`, `BASE_URL` env bilan sozlanadi)
