"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { BookmarkButton } from "@/components/shared/BookmarkButton"
import { ExternalLink, Trophy, Brain, Sparkles, Quote, ChevronRight, Library, Lightbulb, AlertTriangle, ArrowLeft } from "lucide-react"
import { ReferenceSection } from "@/components/master/ReferenceSection"
import type { WisePerson } from "@/types"
import type { MasterContentEntry, DevelopmentStage } from "@/types/master"
import wisePersonCodes from "@/data/wise-person-codes.json"

// ─── Types ──────────────────────────────────────────────

interface WisePersonContent {
  introduction: string | null
  basicInfo: string | null
  cognitiveStyle: string | null
}

interface Props {
  slug: string
  person: WisePerson
  preloadedContent: WisePersonContent
  masterContent?: MasterContentEntry
}

// ─── Section definition ─────────────────────────────────

interface SectionDef {
  id: string
  label: string
  icon: string
  requiresMaster?: boolean
  alwaysShow?: boolean
}

const SECTIONS: SectionDef[] = [
  { id: "introduction", label: "简介", icon: "📖", alwaysShow: true },
  { id: "developmentStages", label: "发展阶段", icon: "🌱", requiresMaster: true },
  { id: "lifeNarrative", label: "人生叙事", icon: "📜", requiresMaster: true },
  { id: "developmentLessons", label: "发展启示", icon: "💡", requiresMaster: true },
  { id: "basicInfo", label: "基本信息", icon: "📋", alwaysShow: true },
  { id: "cognitiveStyle", label: "认知方式", icon: "🧠", alwaysShow: true },
  { id: "links", label: "相关链接", icon: "🔗", alwaysShow: true },
]

// ─── Hooks ──────────────────────────────────────────────

/** Detect if an element is in viewport */
function useInViewThreshold(threshold = 0.15): [(el: HTMLElement | null) => void, boolean] {
  const elRef = useRef<HTMLElement | null>(null)
  const [inView, setInView] = useState(false)

  const setRef = useCallback((el: HTMLElement | null) => {
    elRef.current = el
  }, [])

  useEffect(() => {
    const el = elRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return [setRef, inView]
}

/** Track active section for side nav */
function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState(sectionIds[0] ?? "")
  const observerRef = useRef<IntersectionObserver | null>(null)

  const setRef = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      if (!el) return
      if (observerRef.current) observerRef.current.disconnect()

      observerRef.current = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActive(id)
            }
          }
        },
        { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
      )
      observerRef.current.observe(el)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sectionIds.join(",")],
  )

  return { active, setRef }
}

// ─── Sub-components ─────────────────────────────────────

function FadeInSection({
  children,
  className = "",
  id,
  setRef,
}: {
  children: React.ReactNode
  className?: string
  id?: string
  setRef?: (el: HTMLElement | null) => void
}) {
  const [ref, inView] = useInViewThreshold(0.1)

  return (
    <section
      id={id}
      ref={(el: HTMLElement | null) => {
        ref(el)
        setRef?.(el)
      }}
      className={`transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </section>
  )
}

function SectionHeading({
  icon,
  label,
}: {
  icon: string
  label: string
}) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="text-2xl">{icon}</span>
      <h2 className="text-2xl font-bold font-heading text-foreground">
        {label}
      </h2>
      <div className="flex-1 h-px bg-border ml-4" />
    </div>
  )
}

// ─── Hero ───────────────────────────────────────────────

function HeroSection({
  person,
  slug,
  hasMasterAnalysis,
  stageCount,
}: {
  person: WisePerson
  slug: string
  hasMasterAnalysis: boolean
  stageCount: number
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/5 via-background to-accent/5 border border-accent/10 mb-16">
      {/* Decorative orbs */}
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-accent/5 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-accent/5 blur-3xl" aria-hidden="true" />

      <div className="relative px-6 sm:px-10 py-10 sm:py-14">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-4 max-w-2xl">
            {/* Code + years */}
            <div className="flex items-center gap-3 flex-wrap">
              {(wisePersonCodes as any).slugToCode?.[slug] && (
                <span className="font-mono text-[11px] tracking-wider text-accent bg-accent/8 px-2.5 py-1 rounded-full border border-accent/15">
                  {(wisePersonCodes as any).slugToCode[slug]}
                </span>
              )}
              {person.era && (
                <span className="text-[11px] text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                  {person.era === "contemporary" ? "当代" : person.era === "modern" ? "现代" : person.era === "ancient" ? "古代" : person.era}
                </span>
              )}
              {/* Era badge only — years not available on WisePerson type */}
            </div>

            {/* Name */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-foreground leading-tight">
                {person.name}
              </h1>
              {person.nameEn && (
                <p className="text-lg sm:text-xl text-muted-foreground/70 mt-2 font-light tracking-wide">
                  {person.nameEn}
                </p>
              )}
            </div>

            {/* Tagline */}
            {hasMasterAnalysis && (
              <p className="text-sm text-muted-foreground/60 italic leading-relaxed max-w-xl border-l-2 border-accent/30 pl-4">
                利用人生发展学对智者的人生发展进行编码——他们的人格特质、认知方式、发展阶段、做对与做错的事。
              </p>
            )}

            {/* Stats row */}
            {hasMasterAnalysis && stageCount > 0 && (
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Trophy className="w-3.5 h-3.5 text-accent/60" />
                  <span>{stageCount} 个发展阶段</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Brain className="w-3.5 h-3.5 text-accent/60" />
                  <span>人生发展学分析</span>
                </div>
              </div>
            )}
          </div>

          <BookmarkButton targetId={slug} targetType="wise-person" />
        </div>
      </div>
    </div>
  )
}

// ─── Floating Table of Contents ──────────────────────────

function FloatingTOC({
  sections,
  active,
  hasMasterAnalysis,
}: {
  sections: SectionDef[]
  active: string
  hasMasterAnalysis: boolean
}) {
  const visibleSections = sections.filter(
    (s) => s.alwaysShow || (s.requiresMaster && hasMasterAnalysis),
  )

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <nav className="sticky top-28 space-y-1" aria-label="页面导航">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">
        本页目录
      </p>
      {visibleSections.map((s) => {
        const isActive = active === s.id
        return (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-200 ${
              isActive
                ? "bg-accent/10 text-accent font-medium -translate-x-0"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50 -translate-x-0"
            }`}
          >
            <span className="text-sm">{s.icon}</span>
            <span>{s.label}</span>
            {isActive && <ChevronRight className="w-3 h-3 ml-auto shrink-0" />}
          </button>
        )
      })}
    </nav>
  )
}

// ─── Introduction ───────────────────────────────────────

function IntroductionSection({ content }: { content: string | null }) {
  if (!content) return null

  return (
    <FadeInSection>
      <SectionHeading icon="📖" label="简介" />
      <div className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-sm">
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </FadeInSection>
  )
}

// ─── Development Stages ─────────────────────────────────

function StageCard({
  stage,
  index,
}: {
  stage: DevelopmentStage
  index: number
}) {
  const [ref, inView] = useInViewThreshold(0.2)

  return (
    <div
      ref={ref}
      className={`relative pl-10 sm:pl-12 transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Timeline line */}
      <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-accent/30 to-accent/5" />

      {/* Timeline dot */}
      <div className="absolute left-0 top-1 w-[30px] h-[30px] rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-accent/20">
        {index + 1}
      </div>

      {/* Card */}
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6 hover:shadow-md transition-shadow duration-300">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
          <h3 className="text-lg font-bold font-heading text-foreground">{stage.name}</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full whitespace-nowrap">
            {stage.ageRange}岁 · {stage.years} · {stage.duration}年
          </span>
        </div>

        <div className="space-y-3 text-sm leading-relaxed">
          {/* Core theme as accent */}
          <p className="text-accent font-medium italic">
            {stage.coreTheme}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-3">
              <InfoRow icon="⚡" label="核心挑战" text={stage.coreChallenge} color="amber" />
              <InfoRow icon="✅" label="关键行动" text={stage.keyActions} color="green" />
            </div>
            <div className="space-y-3">
              <InfoRow icon="🧠" label="认知升级" text={stage.cognitiveUpgrade} color="blue" />
              <InfoRow icon="👍" label="做对了" text={stage.didRight} color="emerald" />
              <InfoRow icon="👎" label="做错了/局限" text={stage.didWrong} color="red" />
            </div>
          </div>

          {/* Advice callout */}
          {stage.advice && (
            <div className="mt-4 pt-4 border-t border-dashed border-border flex gap-3">
              <Quote className="w-4 h-4 shrink-0 mt-0.5 text-accent" />
              <div>
                <span className="font-semibold text-foreground text-xs block mb-1">
                  人生发展学评注
                </span>
                <p className="text-muted-foreground text-xs leading-relaxed">{stage.advice}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoRow({
  icon,
  label,
  text,
  color,
}: {
  icon: string
  label: string
  text: string
  color: string
}) {
  const colorMap: Record<string, string> = {
    amber: "text-amber-600",
    green: "text-green-600",
    blue: "text-accent",
    emerald: "text-emerald-600",
    red: "text-red-500",
    purple: "text-purple-600",
  }

  return (
    <div className="flex gap-2">
      <span className={`${colorMap[color] ?? "text-muted-foreground"} shrink-0`}>{icon}</span>
      <div>
        <span className="font-semibold text-gray-700 text-xs">{label}：</span>
        <span className="text-muted-foreground text-xs">{text}</span>
      </div>
    </div>
  )
}

function DevelopmentStagesSection({
  stages,
  references,
}: {
  stages: DevelopmentStage[]
  references?: MasterContentEntry["references"]
}) {
  return (
    <FadeInSection>
      <SectionHeading icon="🌱" label="发展阶段" />
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        从人生发展学的视角，将智者的一生划分为若干发展阶段。每个阶段包含核心挑战、关键行动、认知升级，以及做对了什么、做错了什么。
      </p>

      <div className="relative">
        {/* Continuous timeline line */}
        <div className="absolute left-[15px] top-[15px] bottom-[15px] w-0.5 bg-gradient-to-b from-accent/40 via-accent/20 to-accent/5 rounded-full" />

        {stages.map((stage, i) => (
          <StageCard key={i} stage={stage} index={i} />
        ))}

        {/* End marker */}
        <div className="absolute left-0 bottom-0 w-[30px] h-[30px] rounded-full bg-muted border-2 border-border flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
        </div>
      </div>

      {references && references.length > 0 && (
        <div className="mt-10">
          <ReferenceSection references={references} />
        </div>
      )}
    </FadeInSection>
  )
}

// ─── Life Narrative ────────────────────────────────────

function LifeNarrativeSection({
  narrative,
  references,
}: {
  narrative: string
  references?: MasterContentEntry["references"]
}) {
  if (!narrative) return null

  return (
    <FadeInSection>
      <SectionHeading icon="📜" label="人生叙事" />
      <div className="bg-gradient-to-br from-card to-accent/[0.02] rounded-xl border border-border p-6 sm:p-8 shadow-sm">
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children, ...props }) => (
                <h2 className="text-lg font-bold mt-8 mb-3 pb-2 border-b border-border font-heading" {...props}>
                  {children}
                </h2>
              ),
              h3: ({ children, ...props }) => (
                <h3 className="text-base font-bold mt-6 mb-2 font-heading" {...props}>
                  {children}
                </h3>
              ),
              blockquote: ({ children, ...props }) => (
                <blockquote
                  className="border-l-4 border-accent/40 bg-accent/[0.04] py-3 px-5 my-6 rounded-r-lg text-sm text-muted-foreground/80 italic"
                  {...props}
                >
                  {children}
                </blockquote>
              ),
              strong: ({ children, ...props }) => (
                <strong className="font-bold text-foreground" {...props}>
                  {children}
                </strong>
              ),
              hr: () => (
                <div className="magazine-divider my-8" />
              ),
            }}
          >
            {narrative}
          </ReactMarkdown>
        </div>
      </div>
      {references && references.length > 0 && (
        <div className="mt-8">
          <ReferenceSection references={references} />
        </div>
      )}
    </FadeInSection>
  )
}

// ─── Development Lessons ────────────────────────────────

function DevelopmentLessonsSection({
  transferablePrinciples,
  pitfalls,
  references,
}: {
  transferablePrinciples: MasterContentEntry["transferablePrinciples"]
  pitfalls: MasterContentEntry["pitfalls"]
  references?: MasterContentEntry["references"]
}) {
  if (transferablePrinciples.length === 0 && pitfalls.length === 0) return null

  return (
    <FadeInSection>
      <SectionHeading icon="💡" label="发展启示" />

      {/* Principles */}
      {transferablePrinciples.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <Lightbulb className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold font-heading">可迁移原则</h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
              智者做对了什么
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {transferablePrinciples.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white p-5 hover:shadow-sm hover:border-emerald-300 transition-all duration-200"
              >
                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm mb-1">
                      {item.principle}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.explanation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pitfalls */}
      {pitfalls.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-bold font-heading">可吸取教训</h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
              智者做错了什么
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {pitfalls.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50/50 to-white p-5 hover:shadow-sm hover:border-amber-300 transition-all duration-200"
              >
                <div className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm mb-1">
                      {item.lesson}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.explanation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {references && references.length > 0 && (
        <div className="mt-8">
          <ReferenceSection references={references} />
        </div>
      )}
    </FadeInSection>
  )
}

// ─── Basic Info ────────────────────────────────────────

function BasicInfoSection({ content }: { content: string | null }) {
  if (!content) return null

  return (
    <FadeInSection>
      <SectionHeading icon="📋" label="基本信息" />
      <div className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-sm">
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </FadeInSection>
  )
}

// ─── Cognitive Style ───────────────────────────────────

function CognitiveStyleSection({ content }: { content: string | null }) {
  if (!content) return null

  return (
    <FadeInSection>
      <SectionHeading icon="🧠" label="认知方式" />
      <div className="bg-gradient-to-br from-card to-accent/5 rounded-xl border border-border p-6 sm:p-8 shadow-sm">
        <div className="flex items-start gap-3 mb-4">
          <Brain className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground italic leading-relaxed">
            认知方式分析揭示智者在思维模式、信息处理和价值判断上的独特倾向。
          </p>
        </div>
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </FadeInSection>
  )
}

// ─── Links ─────────────────────────────────────────────

function LinksSection({
  links,
  wikipediaLink,
}: {
  links?: WisePerson["links"]
  wikipediaLink?: string | null
}) {
  const allLinks = links?.length
    ? links
    : wikipediaLink
      ? [{ label: "维基百科", url: wikipediaLink, description: "完整的生平与核心思想介绍" }]
      : []

  if (allLinks.length === 0) return null

  return (
    <FadeInSection>
      <SectionHeading icon="🔗" label="相关链接" />
      <div className="grid gap-3 sm:grid-cols-2">
        {allLinks.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-xl border border-border bg-card p-5 hover:border-accent/30 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Library className="w-4 h-4 text-accent/60 shrink-0" />
                  <span className="font-medium text-sm text-foreground group-hover:text-accent transition-colors truncate">
                    {link.label}
                  </span>
                </div>
                {link.description && (
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                    {link.description}
                  </p>
                )}
              </div>
              <ExternalLink className="w-4 h-4 shrink-0 text-muted-foreground/40 group-hover:text-accent transition-colors mt-0.5" />
            </div>
          </a>
        ))}
      </div>
    </FadeInSection>
  )
}

// ─── Summary section (for stub data) ───────────────────

function SummarySection({ person }: { person: WisePerson }) {
  if (!person.summary) return null

  return (
    <FadeInSection>
      <div className="bg-gradient-to-br from-accent/5 via-background to-accent/5 rounded-xl border border-accent/10 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">核心思想</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{person.summary}</p>
          </div>
        </div>
      </div>
    </FadeInSection>
  )
}

// ─── Main Component ────────────────────────────────────

export function WisePersonDetailTabs({ slug, person, preloadedContent, masterContent }: Props) {
  const hasMasterAnalysis = masterContent?.hasMasterAnalysis ?? false
  const stages = masterContent?.stages ?? []

  const { active, setRef } = useActiveSection(
    SECTIONS.filter((s) => s.alwaysShow || (s.requiresMaster && hasMasterAnalysis)).map((s) => s.id),
  )

  // Detect if we're at the top of the page (for nav visibility)
  const [atTop, setAtTop] = useState(true)
  useEffect(() => {
    const handler = () => setAtTop(window.scrollY < 200)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">
      {/* Hero */}
      <HeroSection
        person={person}
        slug={slug}
        hasMasterAnalysis={hasMasterAnalysis}
        stageCount={stages.length}
      />

      {/* Content: Side TOC + Main */}
      <div className="flex gap-8 lg:gap-12">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block w-44 shrink-0">
          <div className={`
            transition-opacity duration-500
            ${atTop ? "opacity-0 pointer-events-none" : "opacity-100"}
          `}>
            <FloatingTOC
              sections={SECTIONS}
              active={active}
              hasMasterAnalysis={hasMasterAnalysis}
            />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-16">
          {/* Introduction */}
          <div ref={setRef("introduction")}>
            <IntroductionSection content={preloadedContent.introduction} />
          </div>

          {/* Summary (for non-master fallback) */}
          {!hasMasterAnalysis && <SummarySection person={person} />}

          {/* Development Stages */}
          {hasMasterAnalysis && stages.length > 0 && (
            <div ref={setRef("developmentStages")}>
              <DevelopmentStagesSection
                stages={stages}
                references={masterContent?.references}
              />
            </div>
          )}

          {/* Life Narrative */}
          {hasMasterAnalysis && masterContent?.narrative && (
            <div ref={setRef("lifeNarrative")}>
              <LifeNarrativeSection
                narrative={masterContent.narrative}
                references={masterContent?.references}
              />
            </div>
          )}

          {/* Development Lessons */}
          {hasMasterAnalysis && (
            <div ref={setRef("developmentLessons")}>
              <DevelopmentLessonsSection
                transferablePrinciples={masterContent?.transferablePrinciples ?? []}
                pitfalls={masterContent?.pitfalls ?? []}
                references={masterContent?.references}
              />
            </div>
          )}

          {/* Basic Info */}
          <div ref={setRef("basicInfo")}>
            <BasicInfoSection content={preloadedContent.basicInfo} />
          </div>

          {/* Cognitive Style */}
          <div ref={setRef("cognitiveStyle")}>
            <CognitiveStyleSection content={preloadedContent.cognitiveStyle} />
          </div>

          {/* Links */}
          <div ref={setRef("links")}>
            <LinksSection
              links={person.links}
              wikipediaLink={person.wikipediaLink}
            />
          </div>

          {/* Back link */}
          <div className="pt-4 border-t border-border">
            <Link
              href="/wise-persons"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              返回智者列表
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
