import { HelpCircle } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { FAQ, SITE } from '@/data/site'

export default function Faq() {
  return (
    <section id="faq" className="py-20 sm:py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full text-blue-700 text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            Savol-javob
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Koʻp beriladigan savollar</h2>
          <p className="text-gray-600 text-lg">
            Javobini topa olmadingizmi? Telegram orqali yozing — tez orada javob beramiz.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {FAQ.map((item, i) => (
            <AccordionItem
              key={item.q}
              value={`item-${i}`}
              className="bg-white rounded-2xl border border-gray-100 px-5 shadow-sm"
            >
              <AccordionTrigger className="text-left text-base sm:text-lg font-semibold text-gray-900 hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-base leading-relaxed pb-5">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-10 text-center">
          <a
            href={SITE.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-xl font-medium text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-colors shadow-sm"
          >
            <HelpCircle className="w-5 h-5 text-blue-500" />
            Boshqa savolim bor
          </a>
        </div>
      </div>
    </section>
  )
}
