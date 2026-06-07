"use client"

import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ExternalLink, ChevronDown } from "lucide-react"
import { ReferenceSection } from "@/components/master/ReferenceSection"
import type { WisePerson } from "@/types"
import type { MasterContentEntry, DevelopmentStage } from "@/types/master"
import portraitsData from "@/data/portraits.json"

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

// ─── Portrait map (person slug → author slug in portraits.json) ───

const PORTRAIT_SLUG_MAP: Record<string, string> = {
  "wang-yangming": "a-8600952f",
}

function getPortraitUrl(slug: string): string | undefined {
  const authorSlug = PORTRAIT_SLUG_MAP[slug]
  if (authorSlug) {
    return (portraitsData as Record<string, { portrait_url?: string }>)[authorSlug]?.portrait_url
  }
  return undefined
}

// ─── Tab definitions ────────────────────────────────────

type TabId = "story" | "stages" | "lessons" | "links"

const TABS: { id: TabId; label: string }[] = [
  { id: "story", label: "人生叙事" },
  { id: "stages", label: "发展阶段" },
  { id: "lessons", label: "发展启示" },
  { id: "links", label: "延伸阅读" },
]

// ─── Sidebar ────────────────────────────────────────────

function Sidebar({
  person,
  slug,
  activeTab,
  onTabChange,
  portrait,
  stageCount,
  principleCount,
  pitfallCount,
}: {
  person: WisePerson
  slug: string
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  portrait?: string
  stageCount: number
  principleCount: number
  pitfallCount: number
}) {
  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0">
      <div className="sticky top-20 space-y-8">
        {/* Portrait + Name */}
        <div className="text-center">
          {portrait && (
            <img
              src={portrait}
              alt={person.name}
              className="w-36 h-44 object-cover rounded-sm shadow-lg mx-auto"
            />
          )}
          <h1 className="text-2xl font-bold mt-5 text-foreground font-heading tracking-wide">
            {person.name}
          </h1>
          {person.nameEn && (
            <p className="text-xs text-muted-foreground/60 mt-1 tracking-widest">{person.nameEn}</p>
          )}
        </div>

        {/* Meaningful labels */}
        <div className="space-y-2.5">
          {person.tags.slice(0, 4).map((tag, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-accent/40 shrink-0" />
              <span>{tag}</span>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <nav className="space-y-0.5">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-accent/8 text-accent font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Stats */}
        <div className="text-[11px] text-muted-foreground/50 space-y-1.5 pl-3 border-l border-border">
          {stageCount > 0 && <p>{stageCount} 个发展阶段</p>}
          {principleCount > 0 && <p>{principleCount} 条可迁移原则</p>}
          {pitfallCount > 0 && <p>{pitfallCount} 条教训</p>}
        </div>
      </div>
    </aside>
  )
}

// ─── Mobile Header ──────────────────────────────────────

function MobileHeader({
  person,
  activeTab,
  onTabChange,
  portrait,
}: {
  person: WisePerson
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  portrait?: string
}) {
  return (
    <div className="lg:hidden mb-8">
      <div className="flex items-center gap-4 mb-6">
        {portrait && (
          <img
            src={portrait}
            alt=""
            className="w-16 h-20 rounded-sm object-cover shadow-md"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">{person.name}</h1>
          <p className="text-xs text-muted-foreground/60 mt-0.5 tracking-wider">
            {person.tags.slice(0, 3).join(" · ")}
          </p>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs transition-all ${
              activeTab === tab.id
                ? "bg-accent text-accent-foreground"
                : "bg-muted/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Narrative Tab ──────────────────────────────────────

function NarrativeTab({
  narrative,
  references,
}: {
  narrative: string
  references?: MasterContentEntry["references"]
}) {
  if (!narrative) return null

  return (
    <article className="max-w-2xl">
      <div className="prose prose-sm max-w-none font-heading">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold mt-0 mb-2 font-heading text-foreground tracking-wide leading-tight">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-bold mt-10 mb-4 font-heading text-foreground">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-bold mt-8 mb-3 font-heading text-foreground">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-muted-foreground leading-[1.9] mb-5">
                {children}
              </p>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-accent/30 pl-6 my-8 text-muted-foreground/80 italic leading-[1.9]">
                {children}
              </blockquote>
            ),
            strong: ({ children }) => (
              <strong className="font-bold text-foreground">{children}</strong>
            ),
            hr: () => (
              <div className="my-10 border-t border-border" />
            ),
            ul: ({ children }) => (
              <ul className="list-none space-y-3 my-6 text-muted-foreground leading-[1.9]">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-none space-y-3 my-6 text-muted-foreground leading-[1.9]">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="pl-4 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent/30">
                {children}
              </li>
            ),
          }}
        >
          {narrative}
        </ReactMarkdown>
      </div>
      {references && references.length > 0 && (
        <div className="mt-10">
          <ReferenceSection references={references} />
        </div>
      )}
    </article>
  )
}

// ─── Stages Tab ─────────────────────────────────────────

function StageItem({
  stage,
  index,
  isExpanded,
  onToggle,
}: {
  stage: DevelopmentStage
  index: number
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={`py-5 px-3 -mx-3 rounded-lg transition-colors cursor-pointer ${
        isExpanded ? "bg-muted/30" : "hover:bg-muted/20"
      }`}
      onClick={onToggle}
    >
      <div className="flex items-baseline gap-4">
        <span className="text-xs text-muted-foreground/40 w-8 text-right shrink-0 font-heading">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="font-heading font-semibold text-foreground">{stage.name}</span>
            <span className="text-[11px] text-muted-foreground/50">
              {stage.ageRange}岁 · {stage.years}
            </span>
          </div>
          <p className="text-sm text-muted-foreground/70 mt-1 italic">{stage.coreTheme}</p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground/30 shrink-0 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="mt-4 ml-12 space-y-3 text-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <span className="text-xs font-medium text-muted-foreground">核心挑战：</span>
              <span className="text-xs text-muted-foreground/80">{stage.coreChallenge}</span>
            </div>
            <div>
              <span className="text-xs font-medium text-muted-foreground">认知升级：</span>
              <span className="text-xs text-muted-foreground/80">{stage.cognitiveUpgrade}</span>
            </div>
            <div>
              <span className="text-xs font-medium text-emerald-600/80">做对了：</span>
              <span className="text-xs text-muted-foreground/80">{stage.didRight}</span>
            </div>
            <div>
              <span className="text-xs font-medium text-amber-600/80">局限：</span>
              <span className="text-xs text-muted-foreground/80">{stage.didWrong}</span>
            </div>
          </div>
          {stage.advice && (
            <div className="pt-3 border-t border-dashed border-border">
              <p className="text-xs text-muted-foreground/70 leading-relaxed italic">
                {stage.advice}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function StagesTab({
  stages,
  references,
}: {
  stages: DevelopmentStage[]
  references?: MasterContentEntry["references"]
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <article className="max-w-2xl">
      <h2 className="text-2xl font-bold font-heading text-foreground mb-2 tracking-wide">
        人生发展轨迹
      </h2>
      <p className="text-sm text-muted-foreground/50 mb-10 tracking-wider">
        {stages.length} 个阶段
      </p>

      <div className="space-y-1">
        {stages.map((stage, i) => (
          <div key={i} className={i < stages.length - 1 ? "border-b border-border/50" : ""}>
            <StageItem
              stage={stage}
              index={i}
              isExpanded={expandedIndex === i}
              onToggle={() => setExpandedIndex(expandedIndex === i ? null : i)}
            />
          </div>
        ))}
      </div>

      {references && references.length > 0 && (
        <div className="mt-10">
          <ReferenceSection references={references} />
        </div>
      )}
    </article>
  )
}

// ─── Lessons Tab ────────────────────────────────────────

const CN_NUMS = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"]

function LessonItem({
  title,
  desc,
  index,
  variant,
}: {
  title: string
  desc: string
  index: number
  variant: "principle" | "pitfall"
}) {
  const numColor = variant === "principle" ? "text-accent/40" : "text-muted-foreground/30"

  return (
    <div className="flex gap-4">
      <span className={`${numColor} font-heading text-lg shrink-0 mt-0.5`}>
        {CN_NUMS[index] ?? index + 1}
      </span>
      <div>
        <p className="font-heading font-semibold text-foreground text-[15px] mb-1.5">{title}</p>
        <p className="text-sm text-muted-foreground/70 leading-[1.9]">{desc}</p>
      </div>
    </div>
  )
}

function LessonsTab({
  transferablePrinciples,
  pitfalls,
  references,
}: {
  transferablePrinciples: MasterContentEntry["transferablePrinciples"]
  pitfalls: MasterContentEntry["pitfalls"]
  references?: MasterContentEntry["references"]
}) {
  return (
    <article className="max-w-2xl">
      <h2 className="text-2xl font-bold font-heading text-foreground mb-2 tracking-wide">
        发展启示
      </h2>
      <p className="text-sm text-muted-foreground/50 mb-10 tracking-wider">
        从智者的一生中提炼的智慧
      </p>

      {/* Principles */}
      {transferablePrinciples.length > 0 && (
        <div className="mb-14">
          <h3 className="text-xs font-semibold text-accent tracking-[0.2em] mb-6 flex items-center gap-2">
            <span className="w-6 h-px bg-accent/30" />
            可迁移原则 · 做对了什么
          </h3>
          <div className="space-y-6">
            {transferablePrinciples.map((item, i) => (
              <LessonItem
                key={i}
                index={i}
                title={item.principle}
                desc={item.explanation}
                variant="principle"
              />
            ))}
          </div>
        </div>
      )}

      {/* Pitfalls */}
      {pitfalls.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground/60 tracking-[0.2em] mb-6 flex items-center gap-2">
            <span className="w-6 h-px bg-border" />
            可吸取教训 · 做错了什么
          </h3>
          <div className="space-y-6">
            {pitfalls.map((item, i) => (
              <LessonItem
                key={i}
                index={i}
                title={item.lesson}
                desc={item.explanation}
                variant="pitfall"
              />
            ))}
          </div>
        </div>
      )}

      {references && references.length > 0 && (
        <div className="mt-10">
          <ReferenceSection references={references} />
        </div>
      )}
    </article>
  )
}

// ─── Links Tab ──────────────────────────────────────────

function LinksTab({
  links,
  wikipediaLink,
  references,
}: {
  links?: WisePerson["links"]
  wikipediaLink?: string | null
  references?: MasterContentEntry["references"]
}) {
  const allLinks = links?.length
    ? links
    : wikipediaLink
      ? [{ label: "维基百科", url: wikipediaLink, description: "完整的生平与核心思想介绍" }]
      : []

  return (
    <article className="max-w-2xl">
      {allLinks.length > 0 && (
        <>
          <h2 className="text-2xl font-bold font-heading text-foreground mb-2 tracking-wide">
            延伸阅读
          </h2>
          <p className="text-sm text-muted-foreground/50 mb-10 tracking-wider">
            深入了解这位智者的资源
          </p>

          <div className="space-y-1 mb-14">
            {allLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between py-4 border-b border-border/50 group hover:border-accent/30 transition-colors"
              >
                <div>
                  <span className="text-[15px] text-muted-foreground group-hover:text-accent transition-colors">
                    {link.label}
                  </span>
                  {link.description && (
                    <p className="text-xs text-muted-foreground/50 mt-0.5">{link.description}</p>
                  )}
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground/20 group-hover:text-accent/60 transition-colors shrink-0" />
              </a>
            ))}
          </div>
        </>
      )}

      {references && references.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground/60 tracking-[0.2em] mb-6 flex items-center gap-2">
            <span className="w-6 h-px bg-border" />
            参考资料
          </h3>
          <ReferenceSection references={references} />
        </div>
      )}
    </article>
  )
}

// ─── Main Component ────────────────────────────────────

export function WisePersonDetailTabs({ slug, person, preloadedContent, masterContent }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("story")
  const portrait = getPortraitUrl(slug)

  const hasMasterAnalysis = masterContent?.hasMasterAnalysis ?? false
  const stages = masterContent?.stages ?? []
  const principles = masterContent?.transferablePrinciples ?? []
  const pitfalls = masterContent?.pitfalls ?? []

  // If no narrative, default to first available tab
  useEffect(() => {
    if (!hasMasterAnalysis || !masterContent?.narrative) {
      if (stages.length > 0) setActiveTab("stages")
      else if (principles.length > 0 || pitfalls.length > 0) setActiveTab("lessons")
      else setActiveTab("links")
    }
  }, [hasMasterAnalysis, masterContent?.narrative, stages.length, principles.length, pitfalls.length])

  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex gap-12">
        {/* Desktop Sidebar */}
        <Sidebar
          person={person}
          slug={slug}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          portrait={portrait}
          stageCount={stages.length}
          principleCount={principles.length}
          pitfallCount={pitfalls.length}
        />

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Mobile header */}
          <MobileHeader
            person={person}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            portrait={portrait}
          />

          {/* Tab Content */}
          {activeTab === "story" && hasMasterAnalysis && masterContent?.narrative && (
            <NarrativeTab
              narrative={masterContent.narrative}
              references={masterContent.references}
            />
          )}

          {activeTab === "stages" && stages.length > 0 && (
            <StagesTab
              stages={stages}
              references={masterContent?.references}
            />
          )}

          {activeTab === "lessons" && (principles.length > 0 || pitfalls.length > 0) && (
            <LessonsTab
              transferablePrinciples={principles}
              pitfalls={pitfalls}
              references={masterContent?.references}
            />
          )}

          {activeTab === "links" && (
            <LinksTab
              links={person.links}
              wikipediaLink={person.wikipediaLink}
              references={masterContent?.references}
            />
          )}
        </main>
      </div>
    </div>
  )
}
