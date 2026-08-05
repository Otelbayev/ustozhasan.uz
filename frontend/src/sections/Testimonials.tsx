import { Quote, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { TESTIMONIALS } from '@/data/site'

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full text-yellow-700 text-sm font-medium mb-4">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            Oʻquvchilar fikri
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Ular allaqachon oʻrganishdi</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            500 dan ortiq bitiruvchidan bir nechtasining fikri — hammasi 0 dan boshlagan edi.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} className="border-0 shadow-md hover:shadow-xl transition-shadow relative">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-blue-100" aria-hidden="true" />
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">“{t.text}”</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
