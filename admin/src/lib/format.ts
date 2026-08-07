/**
 * Ko'rsatish uchun formatlash yordamchilari.
 * Sana/vaqt hamma joyda Toshkent vaqtida ko'rsatiladi.
 */

const TZ = 'Asia/Tashkent';

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—';
  return new Date(value).toLocaleString('uz-UZ', {
    timeZone: TZ,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('uz-UZ', {
    timeZone: TZ,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/** "3 daqiqa oldin" ko'rinishidagi nisbiy vaqt */
export function timeAgo(value: string | null | undefined): string {
  if (!value) return '—';

  const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
  if (seconds < 60) return 'hozirgina';

  const steps: [number, string][] = [
    [60, 'daqiqa'],
    [60, 'soat'],
    [24, 'kun'],
    [30, 'oy'],
    [12, 'yil'],
  ];

  let value_ = seconds;
  let label = 'soniya';
  for (const [divisor, name] of steps) {
    if (value_ < divisor) break;
    value_ = Math.floor(value_ / divisor);
    label = name;
  }

  return `${value_} ${label} oldin`;
}

export function fullName(user: {
  first_name: string | null;
  last_name: string | null;
}): string {
  return [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Ismsiz';
}

export function initials(user: { first_name: string | null; last_name: string | null }): string {
  const name = fullName(user);
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

/** Voronka bosqichlarining o'zbekcha nomlari */
export const STAGE_LABELS: Record<string, string> = {
  started: 'Boshladi',
  awaiting_subscription: 'Obuna kutilmoqda',
  subscribed: 'Obuna bo\'ldi',
  awaiting_phone: 'Telefon kutilmoqda',
  phone_shared: 'Telefon berdi',
  completed: 'Yakunladi',
};

export const STAGE_ORDER = [
  'started',
  'awaiting_subscription',
  'subscribed',
  'awaiting_phone',
  'phone_shared',
  'completed',
];

/** Hodisa nomlarining o'zbekcha tavsifi */
export const EVENT_LABELS: Record<string, string> = {
  start: 'Botni ishga tushirdi (/start)',
  begin_funnel_clicked: '"Boshlash" tugmasini bosdi',
  course_viewed: 'Kurs haqida ma\'lumotni ko\'rdi',
  subscription_required: 'Kanalga obuna so\'raldi',
  subscription_confirmed: 'Kanalga obunasi tasdiqlandi',
  subscription_check_failed: 'Obunani tekshirdi — obuna bo\'lmagan',
  phone_requested: 'Telefon raqami so\'raldi',
  phone_shared: 'Telefon raqamini berdi',
  phone_skipped: 'Telefon berishni o\'tkazib yubordi',
};

export function eventLabel(type: string): string {
  return EVENT_LABELS[type] ?? type;
}

export function stageLabel(stage: string): string {
  return STAGE_LABELS[stage] ?? stage;
}
