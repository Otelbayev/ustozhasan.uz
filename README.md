# Ustoz Hasan landing

Frameworksiz HTML, CSS, JavaScript. `dist/` ichidagilar saytning tayyor fayllari. Node yoki npm production uchun talab qilinmaydi. Mahalliy preview: `python3 -m http.server 4173 --directory dist`.

Kurs mazmuni va tariflar `ONLINE KURS TAQDIMOTI.pptx` asosida. Standartda kurator va 8+ jonli dars, Masterda haftasiga 3 kun jonli dars. Taqdimotdagi modullar bo‘yicha dars sonlari o‘zaro mos emas; landingda tariflar slaydidagi 36+ videodars umumiy ko‘rsatkichi ishlatilgan.

Google Sheets ulanishi: [yo‘riqnoma](integration/ULASH.md). `dist/config.js` endpointi bo‘sh bo‘lsa ariza yuborilmaydi. Endpoint va real jadval sinovi yakunlanmaguncha reklama trafikini yubormang.

`ustozhasan.uz` domeniga tayyor `dist/` katalogini joylash yoki DNS orqali hostingga ulash kerak. Domen/DNS bu ishda avtomatik o‘zgartirilmagan.

Tekshiruv: `node --test tests/phone.test.mjs tests/apps-script.test.mjs`.
