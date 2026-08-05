import { GraduationCap, MessageCircle, Instagram } from 'lucide-react'
import { IMAGES, SITE } from '@/data/site'

const FACTS = [
  { label: 'Tajriba', value: '3+ yil' },
  { label: 'Oʻquvchilar', value: '500+' },
  { label: 'Modullar', value: '6 ta' },
  { label: 'Format', value: 'Onlayn' },
]

export default function About() {
  return (
    <section id="about" className="py-20 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-20 blur-xl" />
            {/*
              Rasmlar kvadrat (1:1) formatda. Ramkalar ham kvadrat qilib olindi —
              shuning uchun yuz qismi kesilmaydi. Kichik ikkita surat oʻng ustunda
              ustma-ust turadi va birgalikda katta suratning balandligiga teng boʻladi.
            */}
            <div className="relative grid grid-cols-3 grid-rows-2 gap-4">
              <figure className="col-span-2 row-span-2">
                <img
                  src={IMAGES.teacher}
                  alt="Hasan Abdullayev — onlayn kompyuter savodxonligi oʻqituvchisi"
                  title="Hasan Abdullayev — kompyuter savodxonligi oʻqituvchisi"
                  width={1271}
                  height={1280}
                  loading="lazy"
                  className="rounded-2xl shadow-xl w-full h-full object-cover object-top bg-gray-100"
                />
                <figcaption className="sr-only">
                  Hasan Abdullayev — kompyuter savodxonligi oʻqituvchisi, ustozhasan.uz
                </figcaption>
              </figure>
              <figure>
                <img
                  src={IMAGES.courses}
                  alt="Hasan Abdullayev onlayn kompyuter kurslari — Oʻzbekiston boʻylab"
                  title="Ustoz Hasan onlayn kompyuter kurslari"
                  width={640}
                  height={640}
                  loading="lazy"
                  className="rounded-2xl shadow-lg w-full aspect-square object-cover object-top bg-gray-100"
                />
                <figcaption className="sr-only">
                  Ustoz Hasan Abdullayev onlayn kompyuter kurslari, Oʻzbekiston boʻylab
                </figcaption>
              </figure>
              <figure>
                <img
                  src={IMAGES.lesson}
                  alt="Hasan Abdullayev kompyuter savodxonligi darsida — amaliy mashgʻulot"
                  title="Kompyuter savodxonligi darslari"
                  width={640}
                  height={640}
                  loading="lazy"
                  className="rounded-2xl shadow-lg w-full aspect-square object-cover object-top bg-gray-100"
                />
                <figcaption className="sr-only">
                  Hasan Abdullayev kompyuter savodxonligi darsi jarayonida
                </figcaption>
              </figure>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full text-blue-700 text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" />
              Sizning ustozingiz
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{SITE.teacher}</h2>
            <p className="text-blue-600 font-medium mb-6">{SITE.role}</p>

            <p className="text-gray-600 text-lg leading-relaxed mb-5">
              Men <strong>Hasan Abdullayev</strong> — kompyuter savodxonligi sohasida 3 yildan ortiq tajribaga ega
              oʻqituvchiman. Shu vaqt ichida 500 dan ortiq oʻquvchiga kompyuter bilan ishlashni oʻrgatdim: talabalar,
              buxgalterlar, tadbirkorlar va nafaqadagi insonlar.
            </p>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Darslarim <strong>100% onlayn</strong> — Zoom orqali jonli oʻtadi. Men ekranimni koʻrsatib
              tushuntiraman, siz esa oʻz kompyuteringizda birga bajarasiz. Hech qanday murakkab atama yoʻq,
              tushunmagan joyingizni istagancha qayta soʻrashingiz mumkin — men shoshiltirmayman.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {FACTS.map((item) => (
                <div key={item.label} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{item.value}</div>
                  <div className="text-gray-500 text-sm">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={SITE.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white border border-gray-200 px-5 py-3 rounded-xl font-medium text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-blue-500" />
                Telegram kanal
              </a>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white border border-gray-200 px-5 py-3 rounded-xl font-medium text-gray-700 hover:border-pink-300 hover:text-pink-600 transition-colors"
              >
                <Instagram className="w-5 h-5 text-pink-500" />
                Instagram sahifa
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
