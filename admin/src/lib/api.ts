import 'server-only';

/**
 * Bot API bilan aloqa. FAQAT server tomonda ishlaydi.
 *
 * `import 'server-only'` — agar biror client komponent shu fayldan import
 * qilmoqchi bo'lsa, build XATO beradi. Ya'ni API kaliti brauzerga tushib
 * ketishi texnik jihatdan mumkin emas.
 */

import { env } from './env';

export type User = {
  telegram_id: number;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  language_code: string | null;
  is_premium: boolean;
  is_bot: boolean;
  chat_id: number | null;
  chat_type: string | null;
  phone_number: string | null;
  phone_shared_at: string | null;
  funnel_stage: string;
  is_subscribed: boolean;
  subscription_checked_at: string | null;
  source: string | null;
  start_param: string | null;
  start_count: number;
  blocked_bot: boolean;
  photo_file_id: string | null;
  first_seen_at: string;
  last_seen_at: string;
  created_at: string;
  updated_at: string;
};

export type FunnelEvent = {
  id: number;
  event_type: string;
  meta: Record<string, unknown> | null;
  created_at: string;
};

export type Stats = {
  total_users: number;
  subscribed: number;
  with_phone: number;
  blocked: number;
  premium: number;
  new_24h: number;
  new_7d: number;
  active_24h: number;
  by_stage: Record<string, number>;
  by_source: Record<string, number>;
  by_event: Record<string, number>;
  daily: { date: string; new_users: number; with_phone: number }[];
  conversion: { subscribed_pct: number; phone_pct: number };
  generated_at: string;
};

export type UsersPage = {
  data: User[];
  next_cursor: string | null;
  has_more: boolean;
  count: number;
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, params?: Record<string, string | undefined>): Promise<T> {
  const url = new URL(`${env.BOT_API_URL}${path}`);
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== '') url.searchParams.set(key, value);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { 'X-API-Key': env.BOT_API_KEY },
      // Admin panelda doim yangi ma'lumot kerak
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    // Asl xato (ECONNREFUSED va h.k.) foydalanuvchiga hech narsa aytmaydi —
    // uning o'rniga nima qilish kerakligini yozamiz
    throw new ApiError(
      `Bot API ga ulanib bo'lmadi (${env.BOT_API_URL}). Bot ishlab turibdimi?`,
      503,
    );
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new ApiError(body.error ?? `Bot API xatosi: ${response.status}`, response.status);
  }

  return response.json() as Promise<T>;
}

export function getStats() {
  return request<{ data: Stats }>('/api/v1/stats').then((r) => r.data);
}

export function getUsers(params: {
  limit?: string;
  cursor?: string;
  q?: string;
  stage?: string;
  subscribed?: string;
  has_phone?: string;
  blocked?: string;
  source?: string;
}) {
  return request<UsersPage>('/api/v1/users', params);
}

export function getUser(telegramId: string | number) {
  return request<{ data: User }>(`/api/v1/users/${telegramId}`).then((r) => r.data);
}

export function getUserEvents(telegramId: string | number) {
  return request<{ data: FunnelEvent[]; count: number }>(
    `/api/v1/users/${telegramId}/events`,
    { limit: '300' },
  ).then((r) => r.data);
}
