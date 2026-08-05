import { AlertCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PROBLEMS, scrollToSection } from '@/data/site'

export default function Problems() {
  return (
    <section id="problems" className="py-20 sm:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full text-red-600 text-sm font-medium mb-4">
            <AlertCircle className="w-4 h-4" />
            Tanish holat
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Bu holatlar sizga tanishmi?</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Agar quyidagilardan kamida bittasi siz haqingizda boʻlsa — bu kurs aynan siz uchun.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {PROBLEMS.map((problem) => (
            <div
              key={problem}
              className="flex items-start gap-4 bg-gray-50 border border-gray-100 rounded-2xl p-5"
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center font-bold">
                ✕
              </span>
              <p className="text-gray-700">{problem}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100">
          <p className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
            Yaxshi xabar: bularning barchasi 2 oyda hal boʻladi.
          </p>
          <p className="text-gray-600 mb-6">
            Kompyuter savodxonligi — bu iqtidor emas, oddiy koʻnikma. Toʻgʻri ustoz bilan uni har kim oʻrganadi.
          </p>
          <Button
            onClick={() => scrollToSection('courses')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-base rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:scale-105"
          >
            Dastur bilan tanishish
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
