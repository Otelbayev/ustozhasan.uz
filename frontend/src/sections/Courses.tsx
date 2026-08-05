import {
  BookOpen,
  Check,
  Clock,
  MessageCircle,
  Monitor,
  Shield,
  Target,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { COURSES, scrollToSection } from '@/data/site'

const ICONS: Record<string, { Icon: LucideIcon; color: string; bg: string }> = {
  monitor: { Icon: Monitor, color: 'text-blue-600', bg: 'bg-blue-50' },
  book: { Icon: BookOpen, color: 'text-green-600', bg: 'bg-green-50' },
  zap: { Icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  target: { Icon: Target, color: 'text-purple-600', bg: 'bg-purple-50' },
  shield: { Icon: Shield, color: 'text-red-600', bg: 'bg-red-50' },
  message: { Icon: MessageCircle, color: 'text-cyan-600', bg: 'bg-cyan-50' },
}

export default function Courses() {
  const totalLessons = COURSES.reduce((sum, c) => sum + parseInt(c.duration, 10), 0)

  return (
    <section id="courses" className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full text-blue-700 text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            Kurs dasturi
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Nimalarni oʻrganasiz?</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            6 ta modul, jami {totalLessons} ta jonli onlayn dars. Har bir mavzu darsning oʻzida oʻz kompyuteringizda
            bajariladi — uyga faqat mustahkamlash mashqlari beriladi.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map((course, i) => {
            const { Icon, color, bg } = ICONS[course.icon]
            return (
              <Card
                key={course.title}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md flex flex-col"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`mb-4 p-3 ${bg} rounded-xl w-fit group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-8 h-8 ${color}`} />
                    </div>
                    <span className="text-sm font-bold text-gray-300">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <p className="text-gray-600 mb-4">{course.desc}</p>
                  <ul className="space-y-2 mb-5 flex-1">
                    {course.topics.map((topic) => (
                      <li key={topic} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Qaysi moduldan boshlashni bilmayapsizmi? Bepul darsda aniqlab beramiz.</p>
          <Button
            onClick={() => scrollToSection('lead')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-base rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:scale-105"
          >
            Bepul sinov darsiga yozilish
          </Button>
        </div>
      </div>
    </section>
  )
}
