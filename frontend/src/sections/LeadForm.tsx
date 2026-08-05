import { useState, type FormEvent } from 'react'
import { CheckCircle2, Loader2, Phone, Send, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { COURSES, SITE } from '@/data/site'
import { sendLeadToTelegram, telegramFallbackLink, type Lead } from '@/lib/telegram'

const TIMES = ['Ertalab (09:00-12:00)', 'Kunduzi (13:00-17:00)', 'Kechqurun (18:00-21:00)', 'Farqi yoʻq']

export default function LeadForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [course, setCourse] = useState('Toʻliq kurs (barcha modullar)')
  const [time, setTime] = useState(TIMES[3])
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [fallback, setFallback] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (sending) return

    if (name.trim().length < 3) {
      setError('Iltimos, familiya va ismingizni toʻliq kiriting.')
      return
    }
    if (phone.replace(/\D/g, '').length < 9) {
      setError('Telefon raqamni toʻliq kiriting. Masalan: +998 90 123 45 67')
      return
    }

    const lead: Lead = {
      name: name.trim(),
      phone: phone.trim(),
      course,
      time,
      source: 'Asosiy ariza formasi',
    }

    setError('')
    setSending(true)

    try {
      await sendLeadToTelegram(lead)
      setSent(true)
      setFallback('')
    } catch {
      // Bot ishlamasa — ariza yoʻqolmasligi uchun Telegram chatiga yoʻnaltiramiz
      setError('Ariza yuborilmadi. Iltimos, qayta urinib koʻring yoki quyidagi tugma orqali yozing.')
      setFallback(telegramFallbackLink(lead, SITE.telegram))
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="lead" className="py-20 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 rounded-3xl p-5 sm:p-8 lg:p-12 shadow-2xl">
          <div className="text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Birinchi dars — bepul</h2>
            <p className="text-white/80 text-lg mb-6">
              Arizani qoldiring, ustoz Hasan shaxsan oʻzi bogʻlanadi: bilim darajangizni aniqlab, sizga mos onlayn
              guruhni tanlab beradi va Zoom havolasini yuboradi. Hech qanday majburiyat yoʻq.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                '15 daqiqa ichida javob beramiz',
                'Bepul sinov darsi — Zoomda, toʻliq 1,5 soat',
                'Shaxsiy oʻquv rejasi tuziladi',
                'Guruhlar 5-8 kishidan, joylar cheklangan',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-white/90">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <ShieldCheck className="w-4 h-4" />
              Maʼlumotlaringiz uchinchi shaxslarga berilmaydi.
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-xl">
            {sent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Arizangiz qabul qilindi!</h3>
                <p className="text-gray-600 mb-6">
                  Rahmat, <strong>{name.trim()}</strong>! Ustoz Hasan tez orada{' '}
                  <strong>{phone.trim()}</strong> raqamiga bogʻlanadi. Shoshilinch savol boʻlsa, hoziroq yozing yoki
                  qoʻngʻiroq qiling.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6">
                    <a href={SITE.telegram} target="_blank" rel="noopener noreferrer">
                      <Send className="w-4 h-4 mr-2" />
                      Telegramga yozish
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="rounded-xl py-6">
                    <a href={`tel:${SITE.phoneRaw}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      {SITE.phone}
                    </a>
                  </Button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false)
                    setName('')
                    setPhone('')
                  }}
                  className="mt-6 text-sm text-gray-500 hover:text-blue-600 underline"
                >
                  Yana bir ariza qoldirish
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Ariza qoldiring</h3>
                  <p className="text-gray-500 text-sm">Bir daqiqada toʻldiriladi</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lead-name">F.I.SH.</Label>
                  <Input
                    id="lead-name"
                    name="name"
                    autoComplete="name"
                    placeholder="Masalan: Karimova Aziza Baxtiyorovna"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lead-phone">Telefon raqamingiz</Label>
                  <Input
                    id="lead-phone"
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

                <div className="space-y-2">
                  <Label htmlFor="lead-course">Qaysi yoʻnalish qiziqtiradi?</Label>
                  <select
                    id="lead-course"
                    name="course"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full h-12 rounded-xl border border-gray-200 bg-white px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Toʻliq kurs (barcha modullar)</option>
                    {COURSES.map((c) => (
                      <option key={c.title}>{c.title}</option>
                    ))}
                    <option>Individual darslar</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lead-time">Sizga qulay vaqt</Label>
                  <select
                    id="lead-time"
                    name="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full h-12 rounded-xl border border-gray-200 bg-white px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {TIMES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
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
                  {sending ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 mr-2" />
                  )}
                  {sending ? 'Yuborilmoqda...' : 'Bepul darsga yozilish'}
                </Button>

                <p className="text-center text-sm text-gray-500">
                  yoki hoziroq qoʻngʻiroq qiling:{' '}
                  <a href={`tel:${SITE.phoneRaw}`} className="font-semibold text-blue-600 hover:underline">
                    {SITE.phone}
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
