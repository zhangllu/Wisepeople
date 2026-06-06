"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import dailySchedule from "@/data/daily-schedule.json"
import wisePersonCodes from "@/data/wise-person-codes.json"
import questionsData from "@/data/questions.json"
import lifeStories from "@/data/links/life-stories.json"
import { DIMENSION_LABELS } from "@/constants"
import type { Question } from "@/types"

const questions: Question[] = questionsData as Question[]
const qMap = new Map<number, Question>()
for (const q of questions) qMap.set(q.number, q)

function getDimension(qn: number): string {
  if (qn === 1) return "meta"
  if (qn <= 4) return "heaven"
  if (qn <= 7) return "earth"
  return "human"
}

// Build date → dayIndex lookup
const schedule = (dailySchedule as any).schedule as any[]
const dateToIndex = new Map<string, number>()
for (let i = 0; i < schedule.length; i++) {
  dateToIndex.set(schedule[i].date, i)
}

const codes = (wisePersonCodes as any).codes as Record<string, any>

const WEEK_DAYS = ["日", "一", "二", "三", "四", "五", "六"]
const MONTH_NAMES = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]

// Min/max dates in schedule
const firstDate = new Date(schedule[0].date)
const lastDate = new Date(schedule[schedule.length - 1].date)

function Calendar({ dayIndex, onSelect }: { dayIndex: number; onSelect: (i: number) => void }) {
  const today = new Date(schedule[dayIndex].date)
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  // If view month changes externally (via dayIndex), sync
  if (viewYear !== today.getFullYear() || viewMonth !== today.getMonth()) {
    // Only sync if the current day is now out of view
    // We'll let the user control their view, but ensure the active day is visible
  }

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay()

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1)
      setViewMonth(11)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1)
      setViewMonth(0)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  const canGoPrev =
    viewYear > firstDate.getFullYear() ||
    (viewYear === firstDate.getFullYear() && viewMonth > firstDate.getMonth())
  const canGoNext =
    viewYear < lastDate.getFullYear() ||
    (viewYear === lastDate.getFullYear() && viewMonth < lastDate.getMonth())

  const days: { day: number; isActive: boolean; isToday: boolean; hasEntry: boolean; dayIndex: number | null }[] = []
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
    const idx = dateToIndex.get(dateStr) ?? null
    const isActive = idx === dayIndex
    const isToday = (() => {
      const now = new Date()
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
      return dateStr === todayStr
    })()
    days.push({ day: d, isActive, isToday, hasEntry: idx !== null, dayIndex: idx })
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      {/* Month header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="p-1 text-muted-foreground hover:text-muted-foreground disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium text-foreground/80">
          {viewYear}年 {MONTH_NAMES[viewMonth]}
        </span>
        <button
          onClick={nextMonth}
          disabled={!canGoNext}
          className="p-1 text-muted-foreground hover:text-muted-foreground disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-0 mb-1">
        {WEEK_DAYS.map((wd) => (
          <div key={wd} className="text-center text-[10px] text-muted-foreground font-medium py-1">
            {wd}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-0">
        {/* Empty cells before first day */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="h-7" />
        ))}

        {days.map((d) => {
          if (!d.hasEntry) {
            return (
              <div
                key={d.day}
                className="h-7 flex items-center justify-center text-[11px] text-muted-foreground/20"
              >
                {d.day}
              </div>
            )
          }

          return (
            <button
              key={d.day}
              onClick={() => d.dayIndex !== null && onSelect(d.dayIndex)}
              className={`h-7 flex items-center justify-center text-[11px] rounded-full transition-colors
                ${d.isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : d.isToday
                    ? "bg-accent/15 text-foreground/80 font-medium hover:bg-accent/25"
                    : "text-muted-foreground hover:bg-muted"
                }
              `}
            >
              {d.day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function DailyPage() {
  const [dayIndex, setDayIndex] = useState(() => {
    const today = new Date()
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
    const idx = dateToIndex.get(dateStr)
    return idx ?? 0
  })
  const [showCalendar, setShowCalendar] = useState(true)

  const totalDays = schedule.length
  const today = schedule[dayIndex]

  const persons = useMemo(() => {
    return today.codes.map((code: string) => {
      const info = codes[code]
      const slug = info.slug
      const qn: number = info.primaryQuestion
      const question = qMap.get(qn)
      const dim = getDimension(qn)
      const stories = lifeStories as Record<string, string>
      const story = stories[slug] || ""

      return {
        code,
        slug,
        name: info.name,
        questionNumber: qn,
        questionTitle: question?.title ?? "",
        questionCode: question?.code ?? "",
        dimensionLabel: DIMENSION_LABELS[dim] ?? "",
        story,
      }
    })
  }, [dayIndex])

  return (
    <div className="min-h-screen">
      {/* Main content - centered */}
      <div className="mx-auto px-8 py-12" style={{ maxWidth: "820px" }}>
        {/* Mobile calendar */}
        <div className="lg:hidden mb-10">
          <Calendar dayIndex={dayIndex} onSelect={setDayIndex} />
        </div>

        {/* Magazine-style header */}
        <header className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <time className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
              {today.date}
            </time>
            <span className="text-muted-foreground/20">·</span>
            <span className="text-xs text-muted-foreground/50 font-heading italic">
              第 {String(today.day).padStart(3, "0")} 日
            </span>
          </div>
          <div className="relative">
            {/* Large decorative day number as background */}
            <div
              className="absolute -top-6 left-0 leading-none pointer-events-none select-none font-heading font-bold"
              style={{
                fontSize: "clamp(4rem, 12vw, 8rem)",
                color: "var(--primary)",
                opacity: 0.04,
              }}
            >
              {String(today.day).padStart(3, "0")}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground relative">
              每日智者
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-4 leading-relaxed max-w-xl">
            今日三位智者，来自 {persons.map((p: any) => p.questionTitle).join("、")} 领域。
          </p>
        </header>

        {/* Magazine-style articles */}
        <div className="space-y-16">
          {persons.map((p: any, idx: number) => (
            <article key={p.code}>
              {/* Article header */}
              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground/70 mb-3 font-mono">
                  <span>{p.code}</span>
                  <span className="text-muted-foreground/20">/</span>
                  <span>{p.questionCode}</span>
                  <span className="text-muted-foreground/30">—</span>
                  <span className="text-muted-foreground/60">{p.questionTitle}</span>
                  <span className="text-muted-foreground/20">/</span>
                  <span className="text-muted-foreground/40">{p.dimensionLabel}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  {p.name}
                </h2>
              </div>

              {/* Article body with serif font + drop cap */}
              <div className="[&>p]:font-heading [&>p]:leading-[1.85] [&>p]:text-[16px] md:[&>p]:text-[17px] [&>p]:text-foreground/90 space-y-5">
                {(() => {
                  const paragraphs = p.story.split("\n\n")
                  return paragraphs.map((text: string, i: number) => {
                    const html = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                    return (
                      <p
                        key={i}
                        className={i === 0 ? "drop-cap" : ""}
                        dangerouslySetInnerHTML={{ __html: html }}
                      />
                    )
                  })
                })()}
              </div>

              {/* Read more link */}
              <div className="mt-8 pt-4 border-t border-border/50">
                <Link
                  href={`/wise-persons/${p.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm text-accent/70 hover:text-accent transition-colors group"
                >
                  <span className="border-b border-accent/20 group-hover:border-accent/60 transition-colors">
                    阅读 {p.name} 的完整档案
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Magazine-style divider between articles */}
              {idx < persons.length - 1 && (
                <div className="magazine-divider mt-16">
                  <span className="text-xs font-mono tracking-widest">◆</span>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Magazine-style navigation */}
        <nav className="mt-16 pt-8 border-t border-border/60">
          <div className="flex items-center justify-between">
            {dayIndex > 0 ? (
              <button
                onClick={() => setDayIndex(dayIndex - 1)}
                className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground/60 hover:text-foreground/80 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span className="border-b border-transparent group-hover:border-current transition-all">
                  前一日
                </span>
              </button>
            ) : (
              <div />
            )}
            <span className="font-mono text-xs text-muted-foreground/40 tracking-wider">
              {dayIndex + 1} / {totalDays}
            </span>
            {dayIndex < totalDays - 1 ? (
              <button
                onClick={() => setDayIndex(dayIndex + 1)}
                className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground/60 hover:text-foreground/80 transition-colors"
              >
                <span className="border-b border-transparent group-hover:border-current transition-all">
                  后一日
                </span>
                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <div />
            )}
          </div>
        </nav>

        <p className="text-center text-xs text-muted-foreground/30 mt-10 font-heading italic tracking-wide">
          每日遇见三位智者，来自不同的问题领域
        </p>
      </div>

      {/* Desktop calendar - fixed at right edge */}
      {showCalendar ? (
        <aside className="hidden lg:block fixed right-6 top-20 z-10">
          <div className="relative">
            <button
              onClick={() => setShowCalendar(false)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-card rounded-full border border-border flex items-center justify-center text-[10px] text-muted-foreground hover:text-muted-foreground shadow-sm z-10"
            >
              ✕
            </button>
            <Calendar dayIndex={dayIndex} onSelect={setDayIndex} />
          </div>
        </aside>
      ) : (
        <button
          onClick={() => setShowCalendar(true)}
          className="hidden lg:flex fixed right-6 top-20 items-center gap-1 text-xs text-muted-foreground bg-card border border-border rounded-lg px-2.5 py-1.5 hover:text-muted-foreground hover:border-border/80 shadow-sm transition-colors"
        >
          日历
        </button>
      )}
    </div>
  )
}
