import { useEffect, useState } from 'react'
import { Phone } from 'lucide-react'
import { NAV_LINKS, SITE, scrollToSection } from '@/data/site'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const go = (id: string) => {
    scrollToSection(id)
    setMobileMenuOpen(false)
  }

  const solid = isScrolled || mobileMenuOpen

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Asosiy menyu">
        <div className="flex justify-between items-center">
          <button onClick={() => go('hero')} className="flex items-center gap-3" aria-label="Bosh sahifa">
            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
              H
            </span>
            <span className={`font-bold text-xl ${solid ? 'text-gray-900' : 'text-white'}`}>Ustoz Hasan</span>
          </button>

          {/* Desktop menyu */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={`font-medium transition-colors hover:text-blue-500 ${
                  solid ? 'text-gray-700' : 'text-white/90'
                }`}
              >
                {item.label}
              </button>
            ))}
            <a
              href={`tel:${SITE.phoneRaw}`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-600/25 transition-transform hover:scale-105"
            >
              <Phone className="w-4 h-4" />
              {SITE.phone}
            </a>
          </div>

          {/* Mobil menyu tugmasi */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menyuni ochish"
            aria-expanded={mobileMenuOpen}
          >
            <span
              className={`block w-6 h-0.5 mb-1.5 transition-all ${solid ? 'bg-gray-900' : 'bg-white'} ${
                mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 mb-1.5 transition-all ${solid ? 'bg-gray-900' : 'bg-white'} ${
                mobileMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 transition-all ${solid ? 'bg-gray-900' : 'bg-white'} ${
                mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>

        {/* Mobil menyu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-2 bg-white rounded-2xl shadow-xl p-3">
            {NAV_LINKS.map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-blue-50 rounded-xl font-medium"
              >
                {item.label}
              </button>
            ))}
            <a
              href={`tel:${SITE.phoneRaw}`}
              className="mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-xl font-semibold"
            >
              <Phone className="w-4 h-4" />
              {SITE.phone}
            </a>
          </div>
        )}
      </nav>
    </header>
  )
}
