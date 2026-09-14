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

Ism, +998 telefon, tarif, Toshkent vaqti, UTM belgilari, fbclid va rozilik yoziladi. Formula kiritish himoyasi, server tekshiruvi va qayta yuborishda bir arizani takror yozmaslik mavjud. Bu SMS tasdiqlash emas: raqam formati tekshiriladi, raqam egasi yoki faol ekani aniqlanmaydi.

Google yozuvni tasdiqlamasa, sayt xato ko‘rsatadi va rahmat sahifasiga o‘tmaydi. `no-cors` ishlatilmagan: o‘qib bo‘lmaydigan javob muvaffaqiyat hisoblanmaydi. Endpoint hali ulanmagan bo‘lsa, telefon orqali bog‘lanish ko‘rsatiladi.

Google Apps Script kvotalari va ommaviy endpoint cheklovlari amal qiladi. Honeypot oddiy botlarni ushlaydi; yuqori hajmdagi reklamadan oldin real Google Sheets integratsiyasi va yuklama sinovini o‘tkazing.
