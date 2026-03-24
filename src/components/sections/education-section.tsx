import { useReveal } from "@/hooks/use-reveal"
import { MagneticButton } from "@/components/magnetic-button"

export function EducationSection({ scrollToSection }: { scrollToSection?: (index: number) => void }) {
  const { ref, isVisible } = useReveal(0.3)

  return (
    <section
      ref={ref}
      className="flex h-screen w-full items-center px-6 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-12 transition-all duration-700 md:mb-16 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
          }`}
        >
          <h2 className="mb-2 font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Образование
          </h2>
          <p className="font-mono text-sm text-foreground/60 md:text-base">/ Направления подготовки</p>
        </div>

        <div className="space-y-6 md:space-y-8">
          {[
            {
              number: "01",
              title: "Судовождение на морских и внутренних водных путях",
              category: "Бакалавриат · очная форма",
              year: "ЕГЭ",
              direction: "left",
            },
            {
              number: "02",
              title: "Эксплуатация судовых энергетических установок",
              category: "Бакалавриат · очная форма",
              year: "ЕГЭ",
              direction: "right",
            },
            {
              number: "03",
              title: "Эксплуатация судового электрооборудования и средств автоматики",
              category: "Бакалавриат · очная форма",
              year: "ЕГЭ",
              direction: "left",
            },
          ].map((item, i) => (
            <EducationCard key={i} item={item} index={i} isVisible={isVisible} />
          ))}
        </div>

        <div
          className={`mt-8 transition-all duration-700 md:mt-12 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          <MagneticButton size="lg" variant="primary" onClick={() => scrollToSection?.(1)}>
            Подать документы
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}

function EducationCard({
  item,
  index,
  isVisible,
}: {
  item: { number: string; title: string; category: string; year: string; direction: string }
  index: number
  isVisible: boolean
}) {
  const getRevealClass = () => {
    if (!isVisible) {
      return item.direction === "left" ? "-translate-x-16 opacity-0" : "translate-x-16 opacity-0"
    }
    return "translate-x-0 opacity-100"
  }

  return (
    <div
      className={`group flex items-center justify-between border-b border-foreground/10 py-5 transition-all duration-700 hover:border-foreground/20 md:py-6 ${getRevealClass()}`}
      style={{
        transitionDelay: `${index * 120}ms`,
        marginLeft: index % 2 === 0 ? "0" : "auto",
        maxWidth: index % 2 === 0 ? "90%" : "95%",
      }}
    >
      <div className="flex items-baseline gap-4 md:gap-8">
        <span className="font-mono text-sm text-foreground/30 transition-colors group-hover:text-foreground/50 md:text-base">
          {item.number}
        </span>
        <div>
          <h3 className="mb-1 font-sans text-xl font-light text-foreground transition-transform duration-300 group-hover:translate-x-2 md:text-2xl lg:text-3xl">
            {item.title}
          </h3>
          <p className="font-mono text-xs text-foreground/50 md:text-sm">{item.category}</p>
        </div>
      </div>
      <span className="font-mono text-xs text-foreground/30 md:text-sm">{item.year}</span>
    </div>
  )
}