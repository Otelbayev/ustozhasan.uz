import { CheckCircle, MessageCircle, Phone, Star, Video } from 'lucide-react'
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
        {/*
          Mobil tartib: 1) rasm, 2) matn, 3) forma.
          Katta ekranda: chapda matn, oʻngda rasm va uning ostida forma.
        */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-16 items-center">
          <figure className="order-1 lg:order-none lg:col-start-2 lg:row-start-1 relative w-full max-w-[15rem] sm:max-w-sm mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[2.5rem] opacity-30 blur-2xl" />
            <img
              src={IMAGES.teacher}
              alt="Hasan Abdullayev — onlayn kompyuter savodxonligi oʻqituvchisi"
              title="Hasan Abdullayev — kompyuter savodxonligi oʻqituvchisi"
              width={1271}
              height={1280}
              fetchPriority="high"
              className="relative rounded-[2rem] shadow-2xl w-full aspect-square object-cover object-top bg-white/10"
            />
            <figcaption className="relative mt-3 text-center text-white/70 text-sm">
              <span className="font-semibold text-white">{SITE.teacher}</span> — {SITE.role}
            </figcaption>
          </figure>

          <div className="order-2 lg:order-none lg:col-start-1 lg:row-start-1 lg:row-span-2 text-center lg:text-left">
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm border border-white/20">
                <Video className="w-4 h-4 text-blue-300" />
                100% onlayn kurs
              </span>
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm border border-white/20">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                3+ yil tajriba | 500+ bitiruvchi
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
              Onlayn Kompyuter Savodxonligi
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                0 dan Professionalgacha
              </span>
            </h1>

            <p className="text-base sm:text-lg text-white/80 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {SITE.teacher} bilan Word, Excel, PowerPoint va internet xavfsizligini 2 oyda oʻrganing.
              Darslar Zoom orqali jonli oʻtadi — {SITE.area}, uydan chiqmasdan.
            </p>

            <ul className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 mb-8 text-white/80">
              {['Birinchi dars bepul', 'Jonli onlayn darslar', 'Dars yozuvlari beriladi'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-10">
              <Button
                asChild
                className="bg-white text-blue-700 hover:bg-gray-100 px-6 sm:px-8 py-6 text-base sm:text-lg rounded-xl shadow-lg transition-all hover:scale-105"
              >
                <a href={`tel:${SITE.phoneRaw}`}>
                  <Phone className="w-5 h-5 mr-2" />
                  {SITE.phone}
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white px-6 sm:px-8 py-6 text-base sm:text-lg rounded-xl backdrop-blur-sm"
              >
                <a href={SITE.telegram} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Telegram orqali savol
                </a>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-lg mx-auto lg:mx-0">
              {STATS.map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
                  <div className="text-xl sm:text-3xl font-bold text-white">{stat.num}</div>
                  <div className="text-white/60 text-xs sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-3 lg:order-none lg:col-start-2 lg:row-start-2">
            <HeroForm />
          </div>
        </div>
      </div>
    </section>
  )
}
