# Ustoz Hasan — Telegram bot + integratsiya API

Kompyuter savodxonligi kursi uchun sotuv voronkasi boti va tashqi tizimlar
uchun o'qish API'si. Node.js + Telegraf + PostgreSQL + Express.

---

## Tez boshlash (LOCAL)

```bash
npm install
cp .env.example .env      # BOT_TOKEN, CHANNEL_USERNAME, CHANNEL_INVITE_LINK ni to'ldiring
npm run db:up             # Docker'da Postgres (o'zingizniki bo'lsa — shart emas)
npm run db:migrate
npm run dev
```

Bo'ldi. Bot polling rejimida, API `http://localhost:3000` da ishlaydi.
Domen, TLS, ngrok — hech biri kerak emas.

> **Alohida dev bot oching.** Bitta token bilan bir vaqtda ikki joyda polling
> ishlatib bo'lmaydi: local `npm run dev` production botini uzib qo'yadi.
> BotFather'da `@..._dev_bot` yarating va uni local `.env` ga yozing.

### Buyruqlar

| Buyruq | Vazifasi |
|---|---|
| `npm run dev` | Local: polling + API + auto-restart |
| `npm start` | Production rejimida ishga tushirish |
| `npm run db:up` / `db:down` | Local Postgres (Docker) |
| `npm run db:migrate` | Migratsiyalarni qo'llash |
| `npm run bot:setup` | Bot tavsifi, buyruqlar, menyu tugmasini Telegram'ga yozish |
| `npm run api:key` | Yangi API kalit yaratish |
| `npm run seed [n]` | Bazaga soxta foydalanuvchilar (API'ni sinash uchun) |
| `npm run loadtest [n] [parallel]` | Yuklama testi |

---

## Voronka

```
/start
  └─ Hasan aka rasmi + kurs haqida ma'lumot   [rasm file_id bilan cache'lanadi]
       └─ "Boshlash 🚀"
            └─ kanalga obuna tekshiriladi     [90s cache]
                 ├─ obuna emas → "Obuna bo'lish" + "✅ Tekshirish"
                 └─ obuna → 📱 telefon so'raladi
                              ├─ "Raqamni ulashish" → bazaga yoziladi
                              └─ "⏭ Keyinroq"
```

Har bir qadam `funnel_events` jadvaliga yoziladi — qaysi bosqichda odamlar
ko'p to'xtab qolayotganini shundan ko'rasiz (`/stats` yoki `GET /api/v1/stats`).

**Matnlarni o'zgartirish:** faqat [`src/content.js`](src/content.js). Boshqa
faylga tegish shart emas.

### Foydalanuvchi haqida nima saqlanadi

Telegram beradigan hamma narsa: `telegram_id`, `username`, ism/familiya,
`language_code`, `is_premium`, `is_bot`, chat ID/turi, profil rasmi
`file_id`, deep-link manbasi (`/start web_hero` → `source`), `start_count`,
`first_seen_at`/`last_seen_at`, obuna holati, bot bloklanganligi, hamda
Telegram javobining to'liq nusxasi (`raw` JSONB).

Telefon raqami faqat foydalanuvchi o'zi tugma orqali ulashsa saqlanadi —
Telegram uni boshqa yo'l bilan bermaydi. Email, tug'ilgan sana, bio — bot
API'da bunday ma'lumot umuman yo'q.

---

## ⚠️ Bot kanalda ADMIN bo'lishi shart

Obunani tekshirish (`getChatMember`) faqat bot kanalda **administrator**
bo'lgandagina ishlaydi. Aks holda hamma "obuna bo'lmagan" deb hisoblanadi
(logda aniq ogohlantirish chiqadi).

---

## Bot start bosilmasdan oldin nima ko'rsatadi

Foydalanuvchi botni birinchi marta ochganda (hali `/start` bosmasdan) rasm va
kurs haqida matn ko'rinadi. Buning uchun ikki qadam:

**1. Matnlar — skript bilan:**
```bash
npm run bot:setup
```
`setMyDescription`, `setMyShortDescription`, `setMyCommands`, `setChatMenuButton`.

**2. Rasmlar — faqat BotFather orqali** (Bot API'da bunday metod yo'q):
```
@BotFather → /mybots → botni tanlang → Edit Bot
   → Edit Botpic                (profil rasmi)
   → Edit Description Picture   (bo'sh chat ekranidagi rasm)
```
Rasm: `assets/hasan.jpg`

---

## Integratsiya API

Barcha endpointlar `X-API-Key` header'ini talab qiladi (`/healthz` va
`/api/v1/leads` dan tashqari).

```bash
npm run api:key     # kalit yaratadi, hash'ini .env ga qo'yasiz
```

### Endpointlar

```
GET  /healthz                    auth'siz — {status, db, uptime}
GET  /api/v1/users               ro'yxat (keyset paginatsiya)
GET  /api/v1/users/:telegram_id  bitta foydalanuvchi
GET  /api/v1/stats               voronka statistikasi (30s cache)
GET  /metrics                    process metrikalari
POST /api/v1/leads               sayt formasi (kalitsiz, Origin + IP limit bilan)
```

### `GET /api/v1/users` parametrlari

| Parametr | Misol | Izoh |
|---|---|---|
| `limit` | `100` | 1–100, standart 50 |
| `cursor` | `eyJ1Ijoi…` | oldingi javobdagi `next_cursor` |
| `updated_since` | `2026-08-01T00:00:00Z` | inkremental sinxronizatsiya uchun |
| `created_since` | `2026-08-01` | |
| `stage` | `phone_shared` | voronka bosqichi |
| `subscribed` | `true` | |
| `has_phone` | `true` | |
| `blocked` | `false` | |
| `source` | `web_hero` | deep-link manbasi |
| `q` | `Gulnora` | ism/username/telefon bo'yicha qidiruv |

```bash
curl -H "X-API-Key: $KEY" "http://localhost:3000/api/v1/users?limit=2&has_phone=true"
```

```json
{
  "data": [
    {
      "telegram_id": 1105787891,
      "username": "ustoz_hasan",
      "first_name": "Hasan",
      "phone_number": "+998933055635",
      "funnel_stage": "phone_shared",
      "is_subscribed": true,
      "source": "web_hero",
      "updated_at": "2026-08-06T10:12:00.000Z"
    }
  ],
  "next_cursor": "eyJ1IjoiMjAyNi0wOC0wNlQxMDoxMjowMC4wMDBaIiwiaSI6NDJ9",
  "has_more": true,
  "count": 1
}
```

**Sinxronizatsiya namunasi:** birinchi so'rovda `updated_since` ni oxirgi
sinxronizatsiya vaqtiga qo'ying, keyin `next_cursor` tugagunicha yuring.
`updated_at` bo'yicha tartiblangani uchun hech bir yozuv tushib qolmaydi.

---

## Xavfsizlik

Loyihada qo'llanilgan choralar:

| Qatlam | Chora |
|---|---|
| Webhook | `secret_token` header tekshiruvi (URL yo'lida sir yo'q); sirsiz webhook umuman yoqilmaydi |
| API | `X-API-Key` (.env da faqat SHA-256 hash) + `timingSafeEqual` + IP allowlist + 60 req/min |
| API javobi | maydonlar aniq ro'yxat bo'yicha (`SELECT *` yo'q), `raw` chiqmaydi, xatoda stack trace yo'q |
| SQL | barcha qiymatlar parametr sifatida; `ILIKE` uchun `%`/`_` ekranlanadi |
| Telefon | `contact.user_id === from.id` — begona odamning kontakti qabul qilinmaydi |
| Matn | foydalanuvchi ismi HTML escape qilinadi (`utils/html.js`) |
| Loglar | token va telefon raqami avtomatik maskalanadi |
| Admin | `ADMIN_IDS` whitelist; ruxsatsiz so'rovga javob umuman berilmaydi |
| Sayt formasi | bot tokeni serverda; Origin tekshiruvi + 5 req/min + honeypot |

### Production'da API uchun alohida "faqat o'qish" roli

SQL injection topilgan taqdirda ham hech narsa o'zgartirilmasligi uchun:

```sql
CREATE ROLE api_ro LOGIN PASSWORD 'kuchli-parol';
GRANT CONNECT ON DATABASE ustoz TO api_ro;
GRANT USAGE ON SCHEMA public TO api_ro;
GRANT SELECT ON users, funnel_events TO api_ro;
```

### Kalitni bekor qilish

`.env` dagi `API_KEYS_SHA256` ro'yxatidan tegishli hash'ni o'chirib, botni
qayta ishga tushiring. Kalitning o'zi hech qayerda saqlanmagani uchun
boshqa hech narsa qilish shart emas.

---

## Yuklamaga chidamlilik

| Chora | Ta'siri |
|---|---|
| Rasm `file_id` cache'lanadi | Har `/start` da 800KB yuklash o'rniga bir necha bayt |
| Obuna holati 90s cache | `getChatMember` chaqiruvlari keskin kamayadi |
| Hodisalar batch bilan yoziladi | `/start` uchun DB so'rovi 3 tadan 1 taga tushdi |
| Javob birinchi, baza keyin | Baza sekinlashsa ham odam javob oladi |
| `statement_timeout: 5s` | Baza qotib qolsa bot osilib qolmaydi |
| Token-bucket rate limit (TTL bilan) | Flood to'xtatiladi, xotira sizmaydi |
| `update_id` dedup | Telegram retry'da xabar ikki marta ketmaydi |
| Silliq to'xtash | Deploy paytida navbatdagi yozuvlar yo'qolmaydi |

Tekshirish: `npm run loadtest 2000 100`

---

## Deploy

Kodda hech narsa o'zgarmaydi — faqat `.env`:

```bash
NODE_ENV=production
WEBHOOK_DOMAIN=https://bot.ustozhasan.uz
WEBHOOK_SECRET=<node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
DATABASE_URL=postgres://user:pass@host:5432/db?sslmode=require
API_KEYS_SHA256=<npm run api:key>
API_ALLOWED_IPS=<integratsiya qiluvchi server IP si>
```

Keyin: `npm ci --omit=dev && npm run db:migrate && npm start`
(yoki `docker build` — `Dockerfile` tayyor).

Tekshirish:
```bash
curl https://bot.ustozhasan.uz/healthz
curl "https://api.telegram.org/bot$BOT_TOKEN/getWebhookInfo"   # last_error_message bo'sh bo'lsin
```

### Webhook'ni deploy'dan oldin localda sinash

```bash
cloudflared tunnel --url http://localhost:3000
# chiqqan https manzilni .env dagi WEBHOOK_DOMAIN ga yozing va qayta ishga tushiring
```

---

## Loyiha tuzilishi

```
src/
  index.js          kirish nuqtasi (bot + server, silliq to'xtash)
  config.js         .env validatsiyasi; local/prod farqi SHU YERDA
  content.js        BARCHA matnlar
  funnel.js         bosqich va hodisa nomlari
  bot.js            Telegraf: middleware + handler'lar
  server.js         Express: webhook + API + healthz
  handlers/         start, subscription, contact, info, admin
  middleware/       rateLimit, guards (dedupe, xato to'sig'i, admin)
  utils/            logger, cache, photo (file_id), subscription, html, metrics
  db/               pool, migrate, migrations/, queries, eventQueue, stats
  api/              auth, ipAllow, rateLimit, routes/{users,stats,leads}
scripts/            setup-bot-profile, generate-api-key, seed, loadtest
```

---

## Keyingi bosqichlar

- [ ] Quiz bosqichi (`handlers/quiz.js`) — voronka mashinasi tayyor
- [ ] Broadcast (25 msg/s cheklovi va `blocked_bot` belgilash bilan)
- [ ] CRM'ga outbound webhook (hozir faqat pull/GET)
