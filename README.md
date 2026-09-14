# Ustoz Hasan — sotuv sayti

Frameworksiz HTML, CSS, JavaScript. `dist/` — saytning tayyor fayllari (build talab qilinmaydi). Vercel `vercel.json` orqali `dist/` ni joylaydi.

Mahalliy preview: `python3 -m http.server 4173 --directory dist`

## Tuzilma
- `dist/index.html` — varonka sahifa: hero (Kompyuter savodxonligi 1.0) → kurs modullari (taqdimot asosida) → ariza formasi
- `dist/style.css` — yagona uslublar fayli (thank-you sahifasi ham)
- `dist/app.js` — modal, scroll animatsiyalar, ariza yuborish
- `dist/phone.js` — qat'iy `+998 XX XXX XX XX` telefon maskasi
- `dist/config.js` — Google Apps Script endpointi
- `dist/assets/` — hero rasmlari (AVIF/WebP), `logo.png` va `icons3d/` (prezentatsiyadagi 3D ikonkalar, WebP 256px)
- SEO: `robots.txt`, `sitemap.xml`, `site.webmanifest`, `og-image.jpg`, favicon to'plami (logo asosida)

Google Sheets ulanishi: [yo‘riqnoma](integration/ULASH.md). `dist/config.js` endpointi bo‘sh bo‘lsa ariza yuborilmaydi.

## Tekshiruv
- `node --test tests/phone.test.mjs tests/apps-script.test.mjs`
- Brauzer testi (Google javobi mock): server ishga tushirilgach `node tests/browser.cjs` (`PLAYWRIGHT_PATH`, `BASE_URL` env bilan sozlanadi)
