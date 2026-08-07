-- Dastlabki sxema (eski src/db/init.js bilan bir xil).
-- Baza allaqachon yaratilgan bo'lsa, bu migratsiya hech narsani buzmaydi.

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  funnel_stage TEXT NOT NULL DEFAULT 'started',
  is_subscribed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS funnel_events (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  meta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_funnel_events_user_id ON funnel_events(user_id);
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
