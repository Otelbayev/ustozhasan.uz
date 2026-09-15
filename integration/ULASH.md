# Google Sheets’ga ulash

1. Google Sheets’da yangi jadval oching (yoki mavjud jadvaldan foydalaning).
2. **Extensions → Apps Script** bo‘limini oching.
3. `google-apps-script.gs` faylidagi kodni joylang va saqlang.
4. Yuqoridan `setup` funksiyasini tanlab **Run** bosing. Google ruxsatlarini tasdiqlang. `Leadlar` varag‘i va sarlavhalar yaratiladi.
5. **Deploy → New deployment → Web app**: **Execute as: Me**, **Who has access: Anyone**. Deploy bosing.
6. `https://script.google.com/macros/s/.../exec` manzilini nusxalang va `dist/config.js` ichidagi `endpoint` qiymatiga qo‘ying. `/dev` manzilini ishlatmang.
7. Sayt fayllarini qayta joylang. Haqiqiy test ariza yuborib, Google Sheets’da yangi qator paydo bo‘lishini va rahmat sahifasiga o‘tishini tekshiring.

Apps Script kodini o‘zgartirsangiz: Deploy → Manage deployments → Edit → New version → Deploy.

Jadvalni internetga ochiq ulash shart emas. Jadval egasi nomidan Apps Script yozadi. Public /exec endpoint ariza qabul qiladi; jadvalni o‘qish endpointi mavjud emas. Google Workspace administratori anonim Web App’larni cheklagan bo‘lsa, “Anyone” ochiq bo‘lishi kerak.

Jadvalga Toshkent vaqti, ariza ID, ism, +998 telefon, tarif va suhbat statusi yoziladi. Sayt UTM belgilari va fbclid'ni ham yuboradi, lekin hozirgi skript ularni jadvalga saqlamaydi. Formula kiritish himoyasi, server tekshiruvi va qayta yuborishda bir arizani takror yozmaslik mavjud. Bu SMS tasdiqlash emas: raqam formati tekshiriladi, raqam egasi yoki faol ekani aniqlanmaydi.

Google yozuvni tasdiqlamasa, sayt xato ko‘rsatadi va rahmat sahifasiga o‘tmaydi. `no-cors` ishlatilmagan: o‘qib bo‘lmaydigan javob muvaffaqiyat hisoblanmaydi. Endpoint hali ulanmagan bo‘lsa, telefon orqali bog‘lanish ko‘rsatiladi.

Google Apps Script kvotalari va ommaviy endpoint cheklovlari amal qiladi. Honeypot oddiy botlarni ushlaydi; yuqori hajmdagi reklamadan oldin real Google Sheets integratsiyasi va yuklama sinovini o‘tkazing.


## Submit optimizatsiyasi

- Frontend loading holatini darhol yoqadi va ikkala formani bitta submit himoyasi bilan boshqaradi. Ma’lumot avval `localStorage`dagi outbox’ga yoziladi, keyin Google’ga `fetch(..., keepalive: true)` orqali fon rejimida yuborish boshlanadi. Foydalanuvchi Apps Script javobini kutmaydi: forma darhol reset bo‘ladi va mavjud rahmat sahifasi ochiladi.
- `dist/lead.js` Apps Script’ga yuborilgan yozuvlarni doimiy outbox’da saqlaydi. Sahifa yopilishi yoki tarmoq xatosida yozuv o‘chmaydi; keyingi sahifa ochilishida `flush()` qayta urinadi. Serverdagi request ID deduplikatsiyasi bir xil lead’ni ikki qator qilib yozilishidan himoya qiladi.
- `text/plain` CORS preflight so‘rovini talab qilmaydi. `keepalive` POST javobini kutmasdan sahifa navigatsiyasiga imkon beradi; javob kelib ulgurса, `{ok: true, requestId}` bilan outbox’dan o‘chiriladi. HTTP yoki JSON xatosida yozuv saqlanadi va console’da tushunarli kod qoladi.
- Ikki forma umumiy ID tarixidan foydalanadi. Oxirgi 20 ta arizaning endpoint/ism/telefon/tarif kaliti va ID’si `localStorage`da saqlanadi; bu reload va qayta urinishlarni himoyalaydi. `localStorage` bloklansa `sessionStorage` fallback ishlaydi; ikkala storage ham bloklansa success ko‘rsatilmaydi. Boshqa qurilma yoki mustaqil tabdagi yangi arizalar alohida ID oladi.
- Serverda `getLastRow()` bir marta chaqiriladi. Spreadsheet ochish global lock tashqarisida; yozuv va ID qidirish lock ichida. Lock kutish chegarasi 20 soniyadan 5 soniyaga tushirildi; band bo‘lsa `busy` javobi bilan qayta urinish mumkin.
- Tasdiqlangan ID 6 soatlik keshga qo‘yiladi. Keshdagi takroriy so‘rov Sheets’ni ochmaydi; kesh yo‘qolsa B ustunidagi doimiy ID tekshiriladi. `flush()` saqlandi: yozish tugamasdan muvaffaqiyat qaytarilmaydi. Kesh xatosi saqlashni buzmaydi.
- Console diagnostikasida xato kodi yoziladi, ism/telefon yoki javob tanasi chiqarilmaydi.

**Ishga tushirish:** `google-apps-script.gs` kodini mavjud Apps Script loyihasiga yangilang → **Deploy → Manage deployments → Edit → New version → Deploy**. Mavjud deploymentni yangilasangiz `/exec` URL o‘zgarmaydi. `setup()`ni qayta ishlatish shart emas; ustunlar o‘zgarmagan. Frontendga `dist/lead.js` faylini ham qo‘shib joylang.

**Tekshiruv:** `node --test tests/phone.test.mjs tests/apps-script.test.mjs tests/lead.test.mjs`. Bu testlar Google yozuvini mock qiladi. `lead.test.mjs` outbox’ga darhol yozish, response kutmasdan POST boshlash, double-submit, reload’dan keyin ID saqlanishi, server xatosida qayta urinish va storage xatosida false success bo‘lmasligini tekshiradi. Jonli endpointga jadvalga yozilmaydigan `{}` tekshiruv so‘rovi yuborildi: HTTP 200 / `invalid_request`. Google xizmatining tarmoq kechikishi foydalanuvchini bloklamaydi; real yozuv fon rejimida yakunlanadi.

Google Content Service javobni olish uchun redirectlarni kuzatishni talab qiladi: [rasmiy qo‘llanma](https://developers.google.com/apps-script/guides/content#redirects). Xizmat chaqiruvlari va kesh bo‘yicha [Google tavsiyalari](https://developers.google.com/apps-script/guides/support/best-practices).
