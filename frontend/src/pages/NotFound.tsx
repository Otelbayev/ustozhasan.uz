import { useEffect } from 'react'
import { Link } from 'react-router'
import { Home as HomeIcon, Phone } from 'lucide-react'
import { SITE } from '@/data/site'

export default function NotFound() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, follow'
    document.head.appendChild(meta)

    const prevTitle = document.title
    document.title = 'Sahifa topilmadi | Hasan Abdullayev (Ustoz Hasan)'

    /*
      index.html dagi canonical bosh sahifaga ishora qiladi. 404 sahifada u
      qolib ketsa, Google bu sahifani bosh sahifaning nusxasi deb hisoblaydi.
      Shuning uchun canonical shu sahifa ochiq turgan vaqtda vaqtincha olib turiladi.
    */
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    canonical?.remove()

    return () => {
      meta.remove()
      if (canonical) document.head.appendChild(canonical)
      document.title = prevTitle
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 px-4">
      <div className="text-center text-white max-w-md">
        <div className="text-7xl font-bold mb-4">404</div>
        <h1 className="text-2xl font-bold mb-3">Bunday sahifa topilmadi</h1>
        <p className="text-white/70 mb-8">
          Siz izlagan sahifa mavjud emas yoki koʻchirilgan. Bosh sahifaga qaytib, kurslar bilan tanishing.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            Bosh sahifa
          </Link>
          <a
            href={`tel:${SITE.phoneRaw}`}
            className="inline-flex items-center justify-center gap-2 border border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
          >
            <Phone className="w-5 h-5" />
            {SITE.phone}
          </a>
        </div>
      </div>
    </div>
  )
}
