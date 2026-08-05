import { Award, Clock, GraduationCap, Laptop, Repeat, Users, type LucideIcon } from 'lucide-react'
import { BENEFITS } from '@/data/site'

const ICONS: Record<string, LucideIcon> = {
  users: Users,
  clock: Clock,
  award: Award,
  graduation: GraduationCap,
  laptop: Laptop,
  repeat: Repeat,
}

export default function Benefits() {
  return (
    <section id="benefits" className="py-20 sm:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Nima uchun aynan Ustoz Hasan?</h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Kurs davomida siz yolgʻiz qolmaysiz — har bir detal oʻquvchi qulayligi uchun oʻylangan.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((benefit) => {
            const Icon = ICONS[benefit.icon]
            return (
              <div
                key={benefit.title}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all group"
              >
                <div className="mb-4 p-3 bg-white/10 rounded-xl w-fit group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-white/70">{benefit.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
