/**
 * Arizalarni backend orqali yuborish.
 *
 * ⚠️ ILGARI BU YERDA BOT TOKENI TURGAN EDI — bu jiddiy xavfsizlik teshigi edi:
 * frontend kodi brauzerga to'liq yuklanadi (Sources -> assets/*.js), ya'ni
 * saytga kirgan har qanday odam tokenni ko'chirib olib, bot nomidan xabar
 * yubora olardi va bot sozlamalarini o'zgartira olardi.
 *
 * Endi token faqat serverda (bot loyihasidagi `POST /api/v1/leads`), sayt esa
 * tokensiz murojaat qiladi. Server tomonda Origin tekshiruvi, IP bo'yicha
 * rate limit va honeypot ishlaydi.
 *
 * Sozlash (.env):
 *   VITE_API_URL=https://bot.ustozhasan.uz
 * Local development uchun: VITE_API_URL=http://localhost:3000
 */

const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')

export type Lead = {
  /** F.I.SH. */
  name: string
  phone: string
  course?: string
  time?: string
  /** Ariza saytning qaysi qismidan yuborilgani */
  source: string
  /** Qo'shimcha izoh (ixtiyoriy) */
  comment?: string
}

/** Arizani backendga yuboradi. Muvaffaqiyatsiz boʻlsa xatolik tashlaydi. */
export async function sendLead(lead: Lead): Promise<void> {
  if (!API_URL) {
    throw new Error('VITE_API_URL sozlanmagan')
  }

  const response = await fetch(`${API_URL}/api/v1/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...lead,
      // Honeypot: haqiqiy foydalanuvchi buni hech qachon toʻldirmaydi
      website: '',
    }),
  })

  const data: { ok?: boolean; error?: string } = await response.json().catch(() => ({}))

  if (!response.ok || !data.ok) {
    throw new Error(data.error ?? `Server xatosi: ${response.status}`)
  }
}

/** Bot ishlamay qolsa — foydalanuvchini chatga yoʻnaltirish uchun zaxira havola */
export function telegramFallbackLink(lead: Lead, chat: string) {
  return `${chat}?text=${encodeURIComponent(
    `Assalomu alaykum! Kursga yozilmoqchiman.\n\nF.I.SH: ${lead.name}\nTelefon: ${lead.phone}` +
      (lead.course ? `\nYoʻnalish: ${lead.course}` : '') +
      (lead.time ? `\nQulay vaqt: ${lead.time}` : ''),
  )}`
}
