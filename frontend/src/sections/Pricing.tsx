import { CheckCircle, Phone, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PLANS, SITE, scrollToSection } from '@/data/site'

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full text-purple-700 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Narxlar
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Oʻzingizga mos tarifni tanlang</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Narx va boʻlib toʻlash shartlari boʻyicha maʼlumot uchun qoʻngʻiroq qiling —{' '}
            <a href={`tel:${SITE.phoneRaw}`} className="font-semibold text-blue-600 hover:underline">
              {SITE.phone}
            </a>
            . Darslik va materiallar narxga kiritilgan.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 flex flex-col h-full ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl md:-mt-4 md:pb-12'
                  : 'bg-white shadow-md'
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                  ENG OMMABOP
                </span>
              )}

              <h3 className={`text-xl font-bold mb-1 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mb-6 ${plan.highlighted ? 'text-white/70' : 'text-gray-500'}`}>{plan.desc}</p>

              <div className="mb-6">
                {plan.price ? (
                  <>
                    <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price}
                    </span>
                    <span className={`ml-2 ${plan.highlighted ? 'text-white/70' : 'text-gray-500'}`}>
                      {plan.period}
                    </span>
                  </>
                ) : (
                  /* Narx oʻrniga telefon raqam */
                  <>
                    <a
                      href={`tel:${SITE.phoneRaw}`}
                      className={`flex items-center gap-2 text-2xl sm:text-3xl font-bold hover:underline ${
                        plan.highlighted ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      <Phone className={`w-6 h-6 ${plan.highlighted ? 'text-white' : 'text-blue-600'}`} />
                      {SITE.phone}
                    </a>
                    <span className={`block mt-1 text-sm ${plan.highlighted ? 'text-white/70' : 'text-gray-500'}`}>
                      {plan.period}
                    </span>
                  </>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-green-300' : 'text-green-500'}`}
                    />
                    <span className={plan.highlighted ? 'text-white/90' : 'text-gray-600'}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => scrollToSection('lead')}
                className={`w-full py-6 text-base rounded-xl font-semibold transition-all hover:scale-105 ${
                  plan.highlighted
                    ? 'bg-white text-blue-600 hover:bg-gray-100'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 mt-10">
          Toʻlovni boʻlib toʻlash imkoniyati mavjud. Batafsil maʼlumot uchun{' '}
          <a href={`tel:${SITE.phoneRaw}`} className="font-semibold text-blue-600 hover:underline">
            {SITE.phone}
          </a>{' '}
          raqamiga bogʻlaning.
        </p>
      </div>
    </section>
  )
}
