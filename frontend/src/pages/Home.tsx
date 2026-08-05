import Navbar from '@/sections/Navbar'
import Hero from '@/sections/Hero'
import Problems from '@/sections/Problems'
import About from '@/sections/About'
import Courses from '@/sections/Courses'
import Benefits from '@/sections/Benefits'
import Audience from '@/sections/Audience'
import Process from '@/sections/Process'
import Testimonials from '@/sections/Testimonials'
import LeadForm from '@/sections/LeadForm'
import Faq from '@/sections/Faq'
import Contact from '@/sections/Contact'
import Footer from '@/sections/Footer'
import FloatingCta from '@/sections/FloatingCta'

export default function Home() {
  return (
    // pb-20: mobil qurilmadagi pastki doimiy CTA panel kontentni yopib qolmasligi uchun
    <div className="min-h-screen bg-white overflow-x-hidden pb-20 sm:pb-0">
      <Navbar />
      <main>
        <Hero />
        <Problems />
        <About />
        <Courses />
        <Benefits />
        <Audience />
        <Process />
        <Testimonials />
        <LeadForm />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <FloatingCta />
    </div>
  )
}
