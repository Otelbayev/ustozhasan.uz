import { PROCESS } from '@/data/site'

export default function Process() {
  return (
    <section id="process" className="py-20 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Qanday boshlanadi?</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            4 ta oddiy qadam — birinchisi bugun, bir necha daqiqada.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROCESS.map((item, i) => (
            <div key={item.step} className="relative text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-600/25">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
              {i < PROCESS.length - 1 && (
                <div
                  className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-300 to-purple-300"
                  style={{ transform: 'translateX(2.5rem)', width: 'calc(100% - 5rem)' }}
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
