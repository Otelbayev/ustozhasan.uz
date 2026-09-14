# Google va Yandex SEO

## Tayyorlangan ishlar

- Asosiy manzil: **https://www.ustozhasan.uz/**. 2026-09-15 tekshiruvida `https://ustozhasan.uz/` shu manzilga 308 bilan yo‘naltirildi. Canonical, Open Graph, JSON-LD va sitemap shu yakuniy manzilga moslandi.
- Sarlavha: **Hasan Abdullayev — Kompyuter savodxonligi | Ustoz Hasan**.
- O‘zbekcha tavsif, katta rasm preview ruxsati, Open Graph va Twitter rasm ma’lumotlari.
- Organization, Person, WebSite, WebPage, Course va ImageObject orqali ustoz, kurs, sayt va rasmlar bog‘landi.
- Mavjud logotip, portret, 1200×630 ulashish rasmi va faviconlar saqlandi. 192×192 PNG favicon ham bosh sahifaga ulandi.
- `/sitemap.xml`: bosh sahifa, ustoz portreti, logo va ulashish rasmi. Bitta indekslanadigan sahifa bor; sahifa ichidagi bo‘limlar alohida URL sifatida qo‘shilmadi.
- `robots.txt` rasmlar va sahifani ko‘rishga ruxsat beradi. Rahmat sahifasi `noindex` orqali qidiruvdan chiqariladi; robot bu belgini o‘qishi uchun sahifa robots.txt bilan bloklanmaydi.
- Vercel uchun `/index.html` → `/` doimiy redirect qo‘shildi.
- Dizayn, HTML body, CSS, JavaScript va ariza yuborish integratsiyasi o‘zgartirilmadi.

## Google Search Console — tasdiqlangan

Akkaunt: **jasurdev1604@gmail.com**. Search Console’da **https://www.ustozhasan.uz/** resursi qo‘shildi; shu akkaunt bergan haqiqiy `google-site-verification` metategi `dist/index.html` ichiga joylandi. 2026-09-15 kuni HTML metateg orqali egalik muvaffaqiyatli tasdiqlandi. Jonli bosh sahifa repozitoriydagi HTML bilan bir xil. Search Console sitemap holati: **Muvaffaqiyatli (Успешно)**, aniqlangan sahifalar: **1**. Tekshiruv paytida bosh sahifa **Обнаружена, не проиндексирована** (topilgan, hali indekslanmagan) holatida edi. **Indekslash so‘rovi muvaffaqiyatli yuborildi**: Google URL’ni ustuvor skanerlash navbatiga qo‘shganini tasdiqladi. Bu indeksga kiritilganini anglatmaydi; keyingi qayta ishlash Google tomonida bajariladi.

Kelgusida qayta ulash zarur bo‘lsa:

1. O‘zgarishlarni GitHub’ga yuklang va Vercel production deployment tugashini kuting.
2. Bosh sahifa manba kodida `google-site-verification` mavjudligini tekshiring.
3. [Google Search Console](https://search.google.com/search-console) ichida yuqoridagi resursni tanlang → **HTML tag / Тег HTML** → **Verify / Подтвердить**.
4. **Sitemaps / Файлы Sitemap** bo‘limida `https://www.ustozhasan.uz/sitemap.xml` ni yuboring.
5. **URL inspection / Проверка URL** ichida `https://www.ustozhasan.uz/` ni tekshiring va **Request indexing / Запросить индексирование** ni bosing.
6. Tasdiqlangandan keyin ham metategni o‘chirmang.

## Yandex Webmaster — ulash

Yandex’da alohida Yandex ID kerak. Brauzerda `jasurbek.otelbayev` akkaunti ochiq; uni Google akkaunti bilan bir xil deb hisoblamang. Qaysi Yandex akkauntidan foydalanish tasdiqlanishi kutilmoqda; Yandex tasdiqlash kodi hozircha saytga qo‘shilmagan.

1. [Yandex Webmaster](https://webmaster.yandex.com/) ichida kerakli akkaunt bilan kiring.
2. **Add site / Добавить сайт** orqali `https://www.ustozhasan.uz/` ni kiriting.
3. Berilgan haqiqiy `yandex-verification` metategini `dist/index.html` faylining `<head>` qismiga qo‘shing, deploy qiling, so‘ng egalikni tasdiqlang.
4. **Indexing → Sitemap files** orqali `https://www.ustozhasan.uz/sitemap.xml` ni yuboring.
5. **Reindex pages / Переобход страниц** orqali bosh sahifani yuboring.

## Deploydan keyingi tekshiruv

- Bosh sahifa, `/robots.txt`, `/sitemap.xml`, `/favicon.ico`, `/icon-192.png`, `/icon-512.png`, `/og-image.jpg` va `/assets/hero-998.webp` ochilishi kerak (HTTP 200).
- `/index.html` `/` ga yo‘naltirilishi kerak; noma’lum URL haqiqiy 404 qaytarishi kerak.
- Canonical va sitemap manzili bir xil: `https://www.ustozhasan.uz/`.
- `/thank-you.html` da `noindex` saqlanishi kerak.
- [Schema validator](https://validator.schema.org/) bilan JSON-LD, [Google Rich Results Test](https://search.google.com/test/rich-results) bilan Google qo‘llaydigan natijalarni tekshiring. Har bir Schema.org turi Google’da maxsus qidiruv kartochkasini bermaydi.

## Qidiruvdagi natijalar haqida

Asosiy iboraning to‘g‘ri yozilishi **Kompyuter savodxonligi**. “Kampyuter savodxonligi” xato yozilgan so‘rov bo‘yicha moslash qidiruv tizimiga bog‘liq; sahifaga sun’iy takrorlar yoki yashirin kalit so‘zlar qo‘shilmadi.

SEO texnik imkoniyat yaratadi. Indekslanish, o‘rin, rasm, favicon va qo‘shimcha havolalar chiqishini Google va Yandex belgilaydi. Sitemap yuborishning o‘zi qidiruvda darhol chiqishni kafolatlamaydi. Sayt yangilanganda sitemapdagi `lastmod` ni haqiqiy mazmun o‘zgarishi sanasiga yangilang.

## Tekshirilgan rasmiy manbalar

- [Google favicon talablari](https://developers.google.com/search/docs/appearance/favicon-in-search)
- [Google rasm sitemapi](https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps)
- [Google noindex va robots.txt](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- [Yandex favicon](https://yandex.com/support/webmaster/en/search-results/favicon)
- [Yandex sitemap](https://yandex.com/support/webmaster/en/indexing-options/sitemap)

## 2026-09-15 tekshiruv natijalari

- Mavjud 9 ta avtomatik telefon/Apps Script testi o‘tdi. Google Sheets yozuvi bu testlarda mock qilinadi.
- Jonli HTML, canonical, Google verification, JSON-LD va sitemap XML tekshirildi.
- Logo/favicon/portret/OG rasmlari HTTP 200; rahmat sahifasida `X-Robots-Tag: noindex, follow`; `/index.html` bosh sahifaga redirect; noma’lum URL HTTP 404.
- Brauzerda kursga yozilish oynasi ochilishi/yopilishi va bo‘sh formaga validatsiya xabari tekshirildi. Haqiqiy ariza yuborilmadi.
