import { Clock, Instagram, MapPin, MessageCircle, Phone } from 'lucide-react'
import { SITE } from '@/data/site'

export default function Contact() {
  return (
    <section id="contact" className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Biz bilan bogʻlaning</h2>
          <p className="text-gray-600 text-lg">Sizga qulay usulni tanlang — har bir murojaatga javob beramiz.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <a
            href={`tel:${SITE.phoneRaw}`}
            className="group bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:bg-white transition-all hover:-translate-y-1 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Phone className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Telefon</h3>
            <p className="text-gray-600">{SITE.phone}</p>
            <span className="inline-block mt-3 text-green-600 font-medium text-sm">Qoʻngʻiroq qilish →</span>
          </a>

          <a
            href={SITE.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:bg-white transition-all hover:-translate-y-1 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Telegram</h3>
            <p className="text-gray-600">{SITE.telegramUser}</p>
            <span className="inline-block mt-3 text-blue-600 font-medium text-sm">Yozish →</span>
          </a>

          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:bg-white transition-all hover:-translate-y-1 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Instagram className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Instagram</h3>
            <p className="text-gray-600">{SITE.instagramUser}</p>
            <span className="inline-block mt-3 text-pink-600 font-medium text-sm">Kuzatib borish →</span>
          </a>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <div className="inline-flex items-center justify-center gap-2 bg-blue-50 px-6 py-3 rounded-xl">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700">{SITE.city} (onlayn guruhlar ham mavjud)</span>
          </div>
          <div className="inline-flex items-center justify-center gap-2 bg-blue-50 px-6 py-3 rounded-xl">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700">Dushanba - Shanba, 09:00 - 21:00</span>
          </div>
        </div>
      </div>
    </section>
  )
}
