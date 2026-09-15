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

- Frontend loading holatini darhol yoqadi va ikkala formani bitta submit himoyasi bilan boshqaradi. Javob tasdiqlangach forma reset bo‘ladi va mavjud rahmat sahifasi ochiladi.
- `dist/lead.js` Apps Script redirectini kuzatib, `{ok: true, requestId}` javobini tekshiradi. Redirect yoki HTTP 200 o‘zi muvaffaqiyat degani emas. `text/plain` CORS preflight so‘rovini talab qilmaydi. Google javob hosti uchun preconnect qo‘shilgan.
- Kutish chegarasi 25 soniya; timeout ma’lumot saqlanmaganini isbotlamaydi. Qayta urinishda o‘sha ariza ID’si yuboriladi. Avtomatik POST takrori va fire-and-forget ishlatilmagan.
- Ikki forma umumiy ID tarixidan foydalanadi. Oxirgi 20 ta arizaning endpoint/ism/telefon/tarif kaliti va ID’si `sessionStorage`da saqlanadi; bu shu tabda reload va qayta urinishlarni himoyalaydi. Storage yopiq bo‘lsa, himoya sahifa xotirasida davom etadi. Boshqa qurilma yoki mustaqil tabdagi yangi arizalar alohida ID oladi.
- Serverda `getLastRow()` bir marta chaqiriladi. Spreadsheet ochish global lock tashqarisida; yozuv va ID qidirish lock ichida. Lock kutish chegarasi 20 soniyadan 5 soniyaga tushirildi; band bo‘lsa `busy` javobi bilan qayta urinish mumkin.
- Tasdiqlangan ID 6 soatlik keshga qo‘yiladi. Keshdagi takroriy so‘rov Sheets’ni ochmaydi; kesh yo‘qolsa B ustunidagi doimiy ID tekshiriladi. `flush()` saqlandi: yozish tugamasdan muvaffaqiyat qaytarilmaydi. Kesh xatosi saqlashni buzmaydi.
- Console diagnostikasida xato kodi yoziladi, ism/telefon yoki javob tanasi chiqarilmaydi.

**Ishga tushirish:** `google-apps-script.gs` kodini mavjud Apps Script loyihasiga yangilang → **Deploy → Manage deployments → Edit → New version → Deploy**. Mavjud deploymentni yangilasangiz `/exec` URL o‘zgarmaydi. `setup()`ni qayta ishlatish shart emas; ustunlar o‘zgarmagan. Frontendga `dist/lead.js` faylini ham qo‘shib joylang.

**Tekshiruv:** `node --test tests/phone.test.mjs tests/apps-script.test.mjs tests/lead.test.mjs`. Bu testlar Google yozuvini mock qiladi. Mahalliy brauzerda loading, ikki formadagi double-submit, server xatosi, qayta urinish, reset va success redirect ham mock javoblar bilan tekshirildi. Jonli endpointga jadvalga yozilmaydigan `{}` tekshiruv so‘rovi yuborildi: HTTP 200 / `invalid_request`, 3,58 soniya (bitta o‘lchov; haqiqiy yozuv tezligi emas). Google xizmatining ishga tushish/tarmoq kechikishi saqlanadi; real yozuv uchun oldin/keyin tezlik kafolati berilmaydi.

Google Content Service javobni olish uchun redirectlarni kuzatishni talab qiladi: [rasmiy qo‘llanma](https://developers.google.com/apps-script/guides/content#redirects). Xizmat chaqiruvlari va kesh bo‘yicha [Google tavsiyalari](https://developers.google.com/apps-script/guides/support/best-practices).
