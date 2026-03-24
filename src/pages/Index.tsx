import { Shader, ChromaFlow, Swirl } from "shaders/react"
import { CustomCursor } from "@/components/custom-cursor"
import { GrainOverlay } from "@/components/grain-overlay"
import { WorkSection } from "@/components/sections/work-section"
import { ServicesSection } from "@/components/sections/services-section"
import { AboutSection } from "@/components/sections/about-section"
import { EducationSection } from "@/components/sections/education-section"
import { ContactSection } from "@/components/sections/contact-section"
import { MagneticButton } from "@/components/magnetic-button"
import { useRef, useEffect, useState } from "react"

const NAV_ITEMS = ["Об Университете", "Приёмная комиссия 2027", "Новости", "Образование", "Контакты"]

export default function Index() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [navVisible, setNavVisible] = useState(true)
  const [navBg, setNavBg] = useState(false)
  const lastScrollY = useRef(0)
  const shaderContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkShaderReady = () => {
      if (shaderContainerRef.current) {
        const canvas = shaderContainerRef.current.querySelector("canvas")
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          setIsLoaded(true)
          return true
        }
      }
      return false
    }

    if (checkShaderReady()) return

    const intervalId = setInterval(() => {
      if (checkShaderReady()) clearInterval(intervalId)
    }, 100)

    const fallbackTimer = setTimeout(() => setIsLoaded(true), 1500)

    return () => {
      clearInterval(intervalId)
      clearTimeout(fallbackTimer)
    }
  }, [])

  const scrollToSection = (index: number) => {
    const container = scrollContainerRef.current
    if (!container) return
    const sectionHeight = window.innerHeight
    container.scrollTo({ top: sectionHeight * index, behavior: "smooth" })
    setCurrentSection(index)
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const sectionHeight = window.innerHeight
      const newSection = Math.round(scrollTop / sectionHeight)

      if (newSection !== currentSection && newSection >= 0 && newSection <= 5) {
        setCurrentSection(newSection)
      }

      // Nav visibility — hide on scroll down, show on scroll up
      const diff = scrollTop - lastScrollY.current
      if (diff > 8) {
        setNavVisible(false)
      } else if (diff < -8) {
        setNavVisible(true)
      }
      lastScrollY.current = scrollTop

      // Nav background — add backdrop after first section
      setNavBg(scrollTop > sectionHeight * 0.3)
    }

    container.addEventListener("scroll", handleScroll, { passive: true })
    return () => container.removeEventListener("scroll", handleScroll)
  }, [currentSection])

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      <CustomCursor />
      <GrainOverlay />

      <div
        ref={shaderContainerRef}
        className={`fixed inset-0 z-0 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ contain: "strict" }}
      >
        <Shader className="h-full w-full">
          <Swirl
            colorA="#0a4a8f"
            colorB="#0e7fa8"
            speed={0.5}
            detail={0.7}
            blend={55}
            coarseX={35}
            coarseY={35}
            mediumX={35}
            mediumY={35}
            fineX={35}
            fineY={35}
          />
          <ChromaFlow
            baseColor="#083d7a"
            upColor="#1a6fb5"
            downColor="#1c3350"
            leftColor="#0d8fa8"
            rightColor="#0d8fa8"
            intensity={0.92}
            radius={1.8}
            momentum={20}
            maskType="alpha"
            opacity={0.97}
          />
        </Shader>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Nav — slides up/down on scroll */}
      <nav
        className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-5 transition-all duration-500 md:px-12 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${navVisible ? "translate-y-0" : "-translate-y-full"} ${
          navBg ? "bg-background/60 backdrop-blur-md shadow-lg shadow-black/10" : ""
        }`}
      >
        <button
          onClick={() => scrollToSection(0)}
          className="flex items-center gap-3 transition-transform hover:scale-105"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/15 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-foreground/25">
            <span className="font-sans text-xl font-bold text-foreground">⚓</span>
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="font-sans text-sm font-bold leading-tight tracking-tight text-foreground">ВГУВТ</span>
            <span className="font-mono text-[10px] leading-tight text-foreground/60">Самарский филиал</span>
          </div>
        </button>

        <div className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item, index) => (
            <button
              key={item}
              onClick={() => scrollToSection(index + 1)}
              className={`group relative font-sans text-xs font-medium transition-colors ${
                currentSection === index + 1 ? "text-foreground" : "text-foreground/80 hover:text-foreground"
              }`}
            >
              {item}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-foreground transition-all duration-300 ${
                  currentSection === index + 1 ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </button>
          ))}
        </div>

        <MagneticButton variant="secondary" onClick={() => scrollToSection(5)}>
          Контакты
        </MagneticButton>
      </nav>

      {/* Vertical scroll container */}
      <div
        ref={scrollContainerRef}
        className={`relative z-10 h-screen overflow-y-auto overflow-x-hidden transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          scrollSnapType: "y mandatory",
        }}
      >
        {/* Hero Section */}
        <section
          className="flex min-h-screen w-full shrink-0 flex-col justify-end px-6 pb-16 pt-24 md:px-12 md:pb-24"
          style={{ scrollSnapAlign: "start" }}
        >
          <div className="max-w-3xl">
            <div className="mb-4 inline-block animate-in fade-in slide-in-from-bottom-4 rounded-full border border-foreground/20 bg-foreground/15 px-4 py-1.5 backdrop-blur-md duration-700">
              <p className="font-mono text-xs text-foreground/90">Более 85 лет · Самара</p>
            </div>
            <h1 className="mb-6 animate-in fade-in slide-in-from-bottom-8 font-sans text-5xl font-light leading-[1.1] tracking-tight text-foreground duration-1000 md:text-7xl lg:text-8xl">
              <span className="text-balance">
                Самарский филиал
                <br />
                ВГУВТ
              </span>
            </h1>
            <p className="mb-8 max-w-xl animate-in fade-in slide-in-from-bottom-4 text-lg leading-relaxed text-foreground/90 duration-1000 delay-200 md:text-xl">
              <span className="text-pretty">
                Развиваем специалистов в сфере водного транспорта и обеспечиваем бесперебойную работу ключевых портов Самарской области.
              </span>
            </p>
            <div className="flex animate-in fade-in slide-in-from-bottom-4 flex-col gap-4 duration-1000 delay-300 sm:flex-row sm:items-center">
              <MagneticButton size="lg" variant="primary" onClick={() => scrollToSection(2)}>
                Приёмная комиссия 2027
              </MagneticButton>
              <MagneticButton size="lg" variant="secondary" onClick={() => scrollToSection(4)}>
                Направления подготовки
              </MagneticButton>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-in fade-in duration-1000 delay-500">
            <div className="flex flex-col items-center gap-2">
              <p className="font-mono text-xs text-foreground/80">Листайте вниз</p>
              <div className="flex h-10 w-6 items-start justify-center rounded-full border border-foreground/20 bg-foreground/10 px-1 pt-1.5 backdrop-blur-md">
                <div className="h-2 w-1 animate-bounce rounded-full bg-foreground/70" />
              </div>
            </div>
          </div>
        </section>

        <div style={{ scrollSnapAlign: "start" }}>
          <AboutSection scrollToSection={scrollToSection} />
        </div>
        <div style={{ scrollSnapAlign: "start" }}>
          <WorkSection />
        </div>
        <div style={{ scrollSnapAlign: "start" }}>
          <ServicesSection />
        </div>
        <div style={{ scrollSnapAlign: "start" }}>
          <EducationSection scrollToSection={scrollToSection} />
        </div>
        <div style={{ scrollSnapAlign: "start" }}>
          <ContactSection />
        </div>
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </main>
  )
}