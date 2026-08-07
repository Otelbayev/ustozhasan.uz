-- Telegram beradigan BARCHA foydalanuvchi ma'lumotlarini saqlash.
-- ADD COLUMN IF NOT EXISTS — mavjud ma'lumot yo'qolmaydi.

-- Telegram `from` obyektidan keladigan maydonlar
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_bot BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS language_code TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_premium BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS added_to_attachment_menu BOOLEAN NOT NULL DEFAULT FALSE;

-- Chat konteksti (xabar yuborish uchun kerak)
ALTER TABLE users ADD COLUMN IF NOT EXISTS chat_id BIGINT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS chat_type TEXT;

-- Telefon: faqat foydalanuvchi o'zi "Raqamni ulashish" tugmasini bosganda keladi
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_shared_at TIMESTAMPTZ;

-- Profil rasmi (getUserProfilePhotos orqali, fon rejimida)
ALTER TABLE users ADD COLUMN IF NOT EXISTS photo_file_id TEXT;

-- Manba: /start web_hero  ->  start_param = 'web_hero'
ALTER TABLE users ADD COLUMN IF NOT EXISTS start_param TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS source TEXT;

-- Faollik
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS start_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_checked_at TIMESTAMPTZ;

-- Foydalanuvchi botni bloklagan bo'lsa (403 xatosidan aniqlanadi) — broadcast
-- vaqtida bunday userlarga urinib o'tirmaymiz.
ALTER TABLE users ADD COLUMN IF NOT EXISTS blocked_bot BOOLEAN NOT NULL DEFAULT FALSE;

-- Telegram kelajakda yangi maydon qo'shsa, kod yangilanmaguncha ham yo'qolmasin
ALTER TABLE users ADD COLUMN IF NOT EXISTS raw JSONB;

-- ── Indekslar ────────────────────────────────────────────────────
-- API keyset paginatsiyasi: ORDER BY updated_at, id
CREATE INDEX IF NOT EXISTS idx_users_updated_at_id ON users(updated_at, id);
CREATE INDEX IF NOT EXISTS idx_users_funnel_stage ON users(funnel_stage);
CREATE INDEX IF NOT EXISTS idx_users_is_subscribed ON users(is_subscribed);
CREATE INDEX IF NOT EXISTS idx_users_phone_number ON users(phone_number) WHERE phone_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_funnel_events_type_created ON funnel_events(event_type, created_at);
