-- Telegram'ga bir marta yuklangan fayllarning file_id sini saqlaydi.
--
-- Nega: har /start da 800KB rasmni qayta yuklash sekin va Telegram
-- limitlariga uriladi. Birinchi yuborishdan keyin faqat file_id ketadi.
-- Jadval — process qayta ishga tushganda ham cache yo'qolmasligi uchun.

CREATE TABLE IF NOT EXISTS bot_assets (
  key TEXT PRIMARY KEY,
  file_id TEXT NOT NULL,
  file_unique_id TEXT,
  -- fayl o'zgarganini aniqlash uchun (sha256), o'zgarsa cache bekor qilinadi
  content_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
