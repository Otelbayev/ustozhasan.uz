/**
 * Arizalarni Telegram bot orqali yuborish.
 *
 * ⚠️ DIQQAT (xavfsizlik): bot tokeni frontend kodida turibdi va u saytga kirgan
 * har qanday odam uchun ochiq (brauzer -> Sources -> assets/*.js). Ya'ni begona
 * odam ham shu bot nomidan xabar yubora olishi mumkin.
 * Xavfsizroq yo'l: tokenni serverda (masalan, Cloudflare Worker yoki kichik
 * backend) saqlab, sayt faqat o'sha manzilga so'rov yuborishi.
 *
 * Tokenni almashtirish uchun `.env` faylida quyidagilarni bering:
 *   VITE_TELEGRAM_BOT_TOKEN=...
 *   VITE_TELEGRAM_CHAT_ID=...
 */

const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN ?? '8946938675:AAEYXIv2Ia5xmf7PtWWs4Egwzx6C2AjaqjM'
const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID ?? '1105787891'

export type Lead = {
  /** F.I.SH. */
  name: string
  phone: string
  course?: string
  time?: string
  /** Ariza saytning qaysi qismidan yuborilgani */
  source: string
}

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function buildLeadText(lead: Lead) {
  const time = new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })

  const rows = [
    `<b>🔔 Yangi ariza — ustozhasan.uz</b>`,
    ``,
    `👤 <b>F.I.SH:</b> ${escapeHtml(lead.name)}`,
    `📞 <b>Telefon:</b> ${escapeHtml(lead.phone)}`,
  ]

  if (lead.course) rows.push(`📚 <b>Yoʻnalish:</b> ${escapeHtml(lead.course)}`)
  if (lead.time) rows.push(`🕒 <b>Qulay vaqt:</b> ${escapeHtml(lead.time)}`)

  rows.push(`📍 <b>Boʻlim:</b> ${escapeHtml(lead.source)}`)
  rows.push(`🗓 <b>Vaqt:</b> ${escapeHtml(time)}`)

  return rows.join('\n')
}

/** Arizani botga yuboradi. Muvaffaqiyatsiz boʻlsa xatolik tashlaydi. */
export async function sendLeadToTelegram(lead: Lead): Promise<void> {
  const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: buildLeadText(lead),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  })

  const data: { ok?: boolean; description?: string } = await response.json().catch(() => ({}))

  if (!response.ok || !data.ok) {
    throw new Error(data.description ?? `Telegram xatosi: ${response.status}`)
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
