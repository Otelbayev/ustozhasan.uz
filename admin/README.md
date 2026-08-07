# Ustoz Hasan — Admin panel

Botga start bosgan barcha foydalanuvchilarni va ularning har bir harakatini
ko'rish uchun panel. Next.js 16 + shadcn/ui + Tailwind v4.

---

## Tez boshlash (LOCAL)

**1. Bot ishlab turishi kerak** — panel ma'lumotni bot API'sidan oladi:

```bash
cd ../bot
npm run dev            # http://localhost:3000
```

**2. Sozlamalar:**

```bash
cp .env.example .env.local
```

`.env.local` ni to'ldiring:

| Kalit | Qayerdan olinadi |
|---|---|
| `BOT_API_URL` | `http://localhost:3000` (local) |
| `BOT_API_KEY` | bot papkasida: `npm run api:key` |
| `ADMIN_PASSWORD` | o'zingiz o'ylab topasiz (uzun bo'lsin) |
| `SESSION_SECRET` | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

**3. Ishga tushirish:**

```bash
npm install
npm run dev            # http://localhost:3001
```

> Panel 3001-portda ishlaydi — bot 3000-portni band qilgani uchun.

---

## Nima ko'rsatadi

**Boshqaruv paneli** (`/`)
- Jami foydalanuvchi, kanalga obuna, raqam qoldirgan, 24 soatlik yangi, premium, bloklaganlar
- Oxirgi 30 kunlik grafik (kunlik yangi foydalanuvchilar va raqam qoldirganlar)
- Voronka: har bosqichda nechta odam turibdi
- Oxirgi kelganlar, manbalar, botdagi barcha harakatlar statistikasi

**Foydalanuvchilar** (`/users`)
- Barcha foydalanuvchilar jadvali
- Qidiruv: ism, username yoki telefon bo'yicha
- Filtrlar: voronka bosqichi, telefon bor/yo'q, obuna bo'lgan/bo'lmagan
- Paginatsiya (keyset — 100 000 qatorda ham sekinlashmaydi)

**Foydalanuvchi kartasi** (`/users/[telegram_id]`)
- Telegram bergan **barcha** maydonlar: ID, username, ism, familiya, til,
  premium, chat ID/turi, profil rasmi
- Voronka holati, obuna, telefon raqami va u berilgan vaqt
- Manba (deep-link), nechta marta `/start` bosgani, birinchi/oxirgi faollik
- **"Nima qilgan"** — botdagi barcha harakatlari vaqt bo'yicha, eng yangisi tepada
- Telegramda yozish / qo'ng'iroq qilish tugmalari

---

## Xavfsizlik

| Chora | Tafsilot |
|---|---|
| Kirish | Parol + imzolangan (HMAC-SHA256) `httpOnly` cookie, 8 soat amal qiladi |
| Himoya qamrovi | `src/proxy.ts` HAR BIR so'rovni tekshiradi — sahifani himoyalashni "unutish" mumkin emas |
| Parolni topishga urinish | 15 daqiqada 5 ta xato urinishdan keyin IP bloklanadi |
| Timing attack | Parol va imzo `safeEqual` bilan solishtiriladi |
| API kaliti | **Faqat serverda.** `src/lib/api.ts` da `import 'server-only'` — kalit client bundle'ga tushsa, build xato beradi |
| CSRF | `sameSite=lax` cookie + `Origin` tekshiruvi |
| Cookie `Secure` | So'rov protokoliga bog'langan (HTTPS bo'lsa yoqiladi), `NODE_ENV` ga emas |
| Ochiq redirect | `next` parametri faqat `/` bilan boshlanadigan yo'lni qabul qiladi |
| Qidiruv tizimlari | `robots: noindex, nofollow` |

⚠️ `.env.local` dagi hech bir kalitga `NEXT_PUBLIC_` prefiksini qo'ymang —
u brauzerga tushadi va saytga kirgan har kim ko'ra oladi.

JavaScript o'chirilgan brauzerda ham kirish va filtrlar ishlaydi (oddiy
HTML formalar).

---

## Grafiklar ranglari

`src/app/globals.css` dagi `--viz-*` qiymatlari tasodifiy tanlanmagan —
palitra validatoridan o'tkazilgan: ranglar rang ko'rligining barcha
turlarida ham ajralib turadi va ikkala fonda 3:1 kontrastdan yuqori.
Rangni o'zgartirsangiz, ajralib turishini qayta tekshiring.

Voronka bitta ohangda: bosqichni ustun UZUNLIGI va YOZUVI bildiradi,
rang emas — shuning uchun rang ko'rmaydigan foydalanuvchi ham o'qiy oladi.

---

## Deploy

```bash
npm run build
npm start
```

Server `.env` ida:
```
BOT_API_URL=https://bot.ustozhasan.uz
BOT_API_KEY=<yangi kalit>
ADMIN_PASSWORD=<uzun parol>
SESSION_SECRET=<32+ belgi>
```

Botning `.env` idagi `API_ALLOWED_IPS` ga admin panel serverining IP sini
qo'shing — shunda API faqat shu serverdan ochiladi.

---

## Tuzilishi

```
src/
  proxy.ts                    kirish nazorati (har bir so'rov shu yerdan o'tadi)
  app/
    login/page.tsx            kirish sahifasi (oddiy HTML forma)
    api/login/route.ts        parolni tekshiradi, cookie o'rnatadi
    api/logout/route.ts       sessiyani o'chiradi
    (dashboard)/
      layout.tsx              himoyalangan sahifalar ko'rinishi
      page.tsx                boshqaruv paneli
      users/page.tsx          foydalanuvchilar jadvali
      users/[telegramId]/     foydalanuvchi kartasi + harakatlar tarixi
  lib/
    env.ts                    sozlamalar (server-only)
    api.ts                    bot API klienti (server-only)
    session.ts                cookie imzolash/tekshirish (Web Crypto)
    format.ts                 sana, ism, bosqich va hodisa nomlari
  components/
    charts/                   grafiklar (SVG, tashqi kutubxonasiz)
    ui/                       shadcn/ui
```
