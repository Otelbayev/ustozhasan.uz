import { CheckCircle, MessageCircle, Phone, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import HeroForm from './HeroForm'
import { IMAGES, SITE, STATS } from '@/data/site'

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-20 -left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-10 -right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: '1s' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-center">
          <div className="text-center lg:text-left">
            {/* Ustoz surati va ismi — bosh sahifada ham koʻrinadi (Google Rasmlar uchun muhim) */}
            <div className="inline-flex items-center gap-3 mb-6">
              <img
                src={IMAGES.teacher}
                alt="Hasan Abdullayev — kompyuter savodxonligi oʻqituvchisi, Toshkent"
                title="Hasan Abdullayev — kompyuter savodxonligi oʻqituvchisi"
                width={1271}
                height={1280}
                fetchPriority="high"
                className="w-16 h-16 rounded-full object-cover object-top border-2 border-white/40 shadow-lg"
              />
              <span className="text-left">
                <span className="block text-white font-semibold">{SITE.teacher}</span>
                <span className="block text-white/60 text-sm">{SITE.role}</span>
              </span>
            </div>

            <div className="flex justify-center lg:justify-start">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm mb-6 border border-white/20">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>3+ yillik tajriba | 500+ bitiruvchi</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
              Kompyuter Savodxonligi
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                0 dan Professionalgacha
              </span>
            </h1>

            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {SITE.teacher} bilan Word, Excel, PowerPoint va internet xavfsizligini 2 oyda oʻrganing.
              Hech qanday oldingi bilim talab qilinmaydi — hammasi 0 dan boshlanadi.
            </p>

            <ul className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 mb-8 text-white/80">
              {['Birinchi dars bepul', 'Kichik guruhlar', 'Sertifikat beriladi'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Button
                asChild
                className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-6 text-lg rounded-xl shadow-lg transition-all hover:scale-105"
              >
                <a href={`tel:${SITE.phoneRaw}`}>
                  <Phone className="w-5 h-5 mr-2" />
                  {SITE.phone}
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white px-8 py-6 text-lg rounded-xl backdrop-blur-sm"
              >
                <a href={SITE.telegram} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Telegram orqali savol
                </a>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-lg mx-auto lg:mx-0">
              {STATS.map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-2xl sm:text-3xl font-bold text-white">{stat.num}</div>
                  <div className="text-white/60 text-xs sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Qisqa ariza formasi */}
          <div className="lg:pl-4">
            <HeroForm />
          </div>
        </div>
      </div>
    </section>
  )
}
