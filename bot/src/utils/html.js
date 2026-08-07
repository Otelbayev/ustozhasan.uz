/**
 * Telegram HTML parse_mode uchun matnni xavfsiz qilish.
 *
 * Nega kerak: foydalanuvchi ismi (first_name) ni caption yoki xabarga
 * qo'yganda, ism ichida "<" bo'lsa Telegram parse xatosi beradi yoki
 * begona teg kiritilgan bo'ladi. Ismni user o'zi tanlaydi — ya'ni bu
 * foydalanuvchi kiritgan ma'lumot, unga ishonmaymiz.
 */

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Foydalanuvchi ismini ko'rsatish uchun tayyorlaydi: escape qiladi va
 * juda uzun bo'lsa qisqartiradi.
 */
function displayName(from, fallback = 'do\'stim') {
  const raw = [from?.first_name, from?.last_name].filter(Boolean).join(' ').trim();
  if (!raw) return fallback;
  const trimmed = raw.length > 40 ? `${raw.slice(0, 40)}…` : raw;
  return escapeHtml(trimmed);
}

module.exports = { escapeHtml, displayName };
