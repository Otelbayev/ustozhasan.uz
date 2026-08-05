import { Instagram, MessageCircle, Phone } from 'lucide-react'
import { COURSES, NAV_LINKS, SITE, scrollToSection } from '@/data/site'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-bold">
                H
              </span>
              <span className="font-bold text-xl">{SITE.name}</span>
            </div>
            <p className="text-gray-400 mb-4">
              Onlayn kompyuter savodxonligi kurslari — 0 dan professional darajagacha. {SITE.teacher},{' '}
              {SITE.area}.
            </p>
            <div className="flex gap-3">
              <a
                href={SITE.telegram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-pink-600 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={`tel:${SITE.phoneRaw}`}
                aria-label="Telefon"
                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-green-600 flex items-center justify-center transition-colors"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Sayt boʻlimlari</h3>
            <ul className="space-y-2 text-gray-400">
              {NAV_LINKS.map((item) => (
                <li key={item.id}>
                  <button onClick={() => scrollToSection(item.id)} className="hover:text-white transition-colors">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Kurs modullari</h3>
            <ul className="space-y-2 text-gray-400">
              {COURSES.map((course) => (
                <li key={course.title}>
                  <button onClick={() => scrollToSection('courses')} className="hover:text-white transition-colors">
                    {course.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Aloqa</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href={`tel:${SITE.phoneRaw}`} className="hover:text-white transition-colors">
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={SITE.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Telegram: {SITE.telegramUser}
                </a>
              </li>
              <li>
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram: {SITE.instagramUser}
                </a>
              </li>
              <li>{SITE.format}</li>
              <li>{SITE.area}</li>
              <li>Dushanba - Shanba, 09:00 - 21:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <p>© {year} ustozhasan.uz — Barcha huquqlar himoyalangan.</p>
          <p>
            {SITE.teacher} — {SITE.role}
          </p>
        </div>
      </div>
    </footer>
  )
}
