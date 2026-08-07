/**
 * Muhit sozlamalari — FAQAT server tomonda o'qiladi.
 *
 * ⚠️ Bu yerdagi hech bir qiymatda `NEXT_PUBLIC_` prefiksi yo'q, va bo'lmasligi
 * ham kerak: `NEXT_PUBLIC_` bilan boshlangan har qanday o'zgaruvchi build
 * paytida brauzer bundle'iga tushadi va saytga kirgan har kim uni ko'ra oladi.
 * API kaliti va admin paroli faqat serverda qolishi shart.
 */

import 'server-only';

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Sozlama topilmadi: ${name}. admin/.env.local faylni tekshiring (namuna: .env.example).`,
    );
  }
  return value;
}

export const env = {
  /** Bot API manzili, masalan http://localhost:3000 */
  BOT_API_URL: (process.env.BOT_API_URL || 'http://localhost:3000').replace(/\/+$/, ''),

  /** Bot API kaliti (npm run api:key orqali yaratilgan) */
  get BOT_API_KEY() {
    return required('BOT_API_KEY');
  },

  /** Admin panelga kirish paroli */
  get ADMIN_PASSWORD() {
    return required('ADMIN_PASSWORD');
  },

  /**
   * Sessiya cookie'sini imzolash uchun sir.
   * Buni bilmasdan turib soxta sessiya yasab bo'lmaydi.
   */
  get SESSION_SECRET() {
    const value = required('SESSION_SECRET');
    if (value.length < 32) {
      throw new Error('SESSION_SECRET kamida 32 belgi bo\'lishi kerak.');
    }
    return value;
  },

  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};
