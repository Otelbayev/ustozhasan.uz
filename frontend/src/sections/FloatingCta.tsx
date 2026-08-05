import { useEffect, useState } from 'react'
import { MessageCircle, Phone } from 'lucide-react'
import { SITE, scrollToSection } from '@/data/site'

export default function FloatingCta() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Yon tomondagi tez aloqa tugmalari */}
      <div
        className={`fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-3 transition-all duration-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <a
          href={SITE.telegram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram orqali yozish"
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
        <a
          href={`tel:${SITE.phoneRaw}`}
          aria-label="Telefon qilish"
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
        >
          <Phone className="w-6 h-6" />
        </a>
      </div>

      {/* Mobil qurilmalar uchun pastdagi doimiy CTA */}
      <div
        className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 transition-transform duration-300 ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <button
          onClick={() => scrollToSection('lead')}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl shadow-lg"
        >
          Bepul darsga yozilish
        </button>
      </div>
    </>
  )
}
