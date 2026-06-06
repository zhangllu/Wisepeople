import Link from "next/link"
import { ROUTES, SITE_TAGLINE, SITE_DESCRIPTION } from "@/constants"
import { FadeIn } from "@/components/shared/FadeIn"
import { CountUp } from "@/components/shared/CountUp"
import { BookOpen, Shuffle, Compass, List } from "lucide-react"

const MODULES = [
  {
    title: "智者库",
    description: "跨越 2700 年的思想星空，从柏拉图到平克",
    href: ROUTES.wisePersons,
    icon: Compass,
  },
  {
    title: "十大问题",
    description: "以问题为线索，编织跨学科的知识网络",
    href: ROUTES.questions,
    icon: List,
  },
  {
    title: "通识书单",
    description: "56 本最小限度书目 + 各方向精选书单",
    href: ROUTES.bookLists,
    icon: BookOpen,
  },
  {
    title: "随机漫步",
    description: "随机遇见智者与好书，打破信息茧房",
    href: ROUTES.fortune,
    icon: Shuffle,
  },
]

export default function HomePage() {
  return (
    <>
      {/* ─────────── Hero ─────────── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/[0.06] via-transparent to-transparent" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/[0.04] via-transparent to-transparent" />
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
            <pattern id="landing-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" className="fill-accent" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#landing-dots)" />
          </svg>
        </div>

        <div className="relative text-center px-4 max-w-3xl mx-auto">
          {/* Tag */}

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-5">
            为终身学习者打造的<br /><span className="text-accent">通识阅读地图</span>
          </h1>

          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            {SITE_DESCRIPTION}
          </p>

          <div className="flex items-center justify-center gap-3">
            <Link
              href={ROUTES.explore}
              className="inline-flex items-center justify-center rounded-lg bg-accent text-accent-foreground text-sm font-medium px-7 py-3 transition-all duration-200 hover:bg-accent/90 hover:-translate-y-0.5 hover:shadow-lg"
            >
              开始探索
            </Link>
            <Link
              href={ROUTES.story}
              className="inline-flex items-center justify-center rounded-lg border border-input bg-background text-sm font-medium px-7 py-3 transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:-translate-y-0.5"
            >
              了解更多
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/30">
            <span className="text-[10px]">向下滚动</span>
            <div className="w-4 h-6 rounded-full border border-muted-foreground/20 flex justify-center pt-1">
              <div className="w-1 h-1.5 rounded-full bg-muted-foreground/30 animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── Stats ─────────── */}
      <FadeIn>
        <section className="container mx-auto max-w-4xl px-4 mb-20">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-accent"><CountUp end={1197} /></p>
              <p className="text-xs text-muted-foreground mt-1">本核心著作</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-accent"><CountUp end={778} /></p>
              <p className="text-xs text-muted-foreground mt-1">位思想者</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-accent"><CountUp end={50} /></p>
              <p className="text-xs text-muted-foreground mt-1">个主题方向</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-accent"><CountUp end={10} /></p>
              <p className="text-xs text-muted-foreground mt-1">大问题</p>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ─────────── Module Cards ─────────── */}
      <FadeIn delay={100}>
        <section className="container mx-auto max-w-5xl px-4 mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">四大模块，系统构建</h2>
            <p className="text-sm text-muted-foreground">从智者、问题、书单到每日发现，循序渐进</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MODULES.map((mod) => {
              const Icon = mod.icon
              return (
                <Link
                  key={mod.href}
                  href={mod.href}
                  className="group rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-accent/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 rounded-lg bg-accent/10 p-2.5 text-accent group-hover:bg-accent/15 transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold mb-1 group-hover:text-accent transition-colors">
                        {mod.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {mod.description}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </FadeIn>

      {/* ─────────── Quote ─────────── */}
      <FadeIn delay={200}>
        <section className="container mx-auto max-w-3xl px-4 mb-20">
          <blockquote className="text-center text-sm md:text-base text-muted-foreground/60 italic leading-relaxed border-t border-border pt-10">
            为什么读好书如此重要？沿着好书不断阅读，不断积累，就会生发出一个只属于你自己的独特的知识结构。 —— 阳志平
          </blockquote>
        </section>
      </FadeIn>
    </>
  )
}
