import { useState, type FormEvent } from 'react'
import { CheckCircle2, Loader2, Phone, Send, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SITE } from '@/data/site'
import { sendLead, telegramFallbackLink, type Lead } from '@/lib/telegram'

/** Hero bo'limidagi qisqa ariza formasi: faqat F.I.SH. va telefon */
export default function HeroForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [fallback, setFallback] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (sending) return

    if (name.trim().length < 3) {
      setError('Familiya va ismingizni toʻliq kiriting.')
      return
    }
    if (phone.replace(/\D/g, '').length < 9) {
      setError('Telefon raqamni toʻliq kiriting. Masalan: +998 90 123 45 67')
      return
    }

    const lead: Lead = {
      name: name.trim(),
      phone: phone.trim(),
      source: 'Bosh sahifa (hero) formasi',
    }

    setError('')
    setSending(true)

    try {
      await sendLead(lead)
      setSent(true)
      setFallback('')
    } catch {
      setError('Ariza yuborilmadi. Qayta urinib koʻring yoki Telegram orqali yuboring.')
      setFallback(telegramFallbackLink(lead, SITE.telegram))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-7 shadow-2xl w-full max-w-md mx-auto lg:mx-0">
      {sent ? (
        <div className="text-center py-4">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Arizangiz qabul qilindi!</h2>
          <p className="text-gray-600 mb-5">
            Rahmat! Ustoz Hasan <strong>{phone.trim()}</strong> raqamiga tez orada bogʻlanadi.
          </p>
          <a
            href={`tel:${SITE.phoneRaw}`}
            className="inline-flex items-center justify-center gap-2 text-blue-600 font-semibold hover:underline"
          >
            <Phone className="w-4 h-4" />
            {SITE.phone}
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Bepul darsga yozilish</h2>
            <p className="text-gray-500 text-sm">Maʼlumotlaringizni qoldiring — biz bogʻlanamiz</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-name">F.I.SH.</Label>
            <Input
              id="hero-name"
              name="name"
              autoComplete="name"
              placeholder="Masalan: Karimova Aziza Baxtiyorovna"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-phone">Telefon raqamingiz</Label>
            <Input
              id="hero-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+998 90 123 45 67"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {fallback && (
            <a
              href={fallback}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-blue-50 text-blue-700 font-semibold py-3 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <Send className="w-4 h-4" />
              Telegram orqali yuborish
            </a>
          )}

          <Button
            type="submit"
            disabled={sending}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-base rounded-xl font-semibold shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02]"
          >
            {sending ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
            {sending ? 'Yuborilmoqda...' : 'Arizani yuborish'}
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
            <ShieldCheck className="w-3.5 h-3.5" />
            Maʼlumotlaringiz uchinchi shaxslarga berilmaydi
          </p>
        </form>
      )}
    </div>
  )
}
