import { UserCheck } from 'lucide-react'
import { AUDIENCE } from '@/data/site'

export default function Audience() {
  return (
    <section id="audience" className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full text-green-700 text-sm font-medium mb-4">
            <UserCheck className="w-4 h-4" />
            Kurs kimlar uchun
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Bu kurs sizga mos keladimi?</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Yoshi, kasbi, yashash hududi va bilim darajasidan qatʼi nazar — darslar onlayn, dastur esa har bir
            oʻquvchiga moslashtiriladi.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {AUDIENCE.map((item) => (
            <div
              key={item.title}
              className="relative bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:bg-white hover:shadow-lg transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
