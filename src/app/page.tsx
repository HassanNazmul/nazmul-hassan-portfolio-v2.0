import Navbar from "@/components/layout/navbar"
import Hero from "@/components/hero"
import Skills from "@/components/skills/index"
import Projects from "@/components/projects/index"
import Experience from "@/components/experience/index"
import Philosophy from "@/components/philosophy/index"
import Contact from "@/components/contact/index"
import Footer from "@/components/layout/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Hero id="home" />
        <Skills />
        <Projects />
        <Experience />
        <Philosophy />
        <Contact />
        <Footer />
      </div>
    </main>
  )
}
