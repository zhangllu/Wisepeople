"use client"

import { useState, useMemo, useCallback } from "react"
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

function renderStory(text: string) {
  const paragraphs = text.split("\n\n")
  return paragraphs.map((p, i) => {
    const html = p.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    return (
      <p
        key={i}
        className="leading-[1.75] text-[15px] text-gray-800"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  })
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
    <div className="bg-white rounded-lg border border-gray-200/70 p-4">
      {/* Month header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium text-gray-700">
          {viewYear}年 {MONTH_NAMES[viewMonth]}
        </span>
        <button
          onClick={nextMonth}
          disabled={!canGoNext}
          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-0 mb-1">
        {WEEK_DAYS.map((wd) => (
          <div key={wd} className="text-center text-[10px] text-gray-400 font-medium py-1">
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
                className="h-7 flex items-center justify-center text-[11px] text-gray-200"
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
                  ? "bg-gray-900 text-white font-medium"
                  : d.isToday
                    ? "bg-amber-100 text-gray-700 font-medium hover:bg-amber-200"
                    : "text-gray-600 hover:bg-gray-100"
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
    <div className="min-h-screen bg-amber-50/40">
      <div className="container mx-auto max-w-6xl px-8 py-12">
        <div className="flex gap-16">
          {/* Main content */}
          <div className="flex-1 min-w-0 max-w-2xl">
            {/* Blog header */}
            <header className="mb-10">
              <p className="text-sm text-gray-400 mb-2">{today.date}</p>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                每日遇见智者{String(today.day).padStart(3, "0")}
              </h1>
              <p className="text-sm text-gray-400 mt-3 leading-relaxed">
                今日三位智者，来自 {persons.map((p: any) => p.questionTitle).join("、")} 领域。
              </p>
            </header>

            {/* Mobile calendar */}
            <div className="lg:hidden mb-10">
              <Calendar dayIndex={dayIndex} onSelect={setDayIndex} />
            </div>

            {/* Stories */}
            <div className="space-y-14">
              {persons.map((p: any, idx: number) => (
                <article key={p.code}>
                  <div className="mb-6">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                      <span className="font-mono">{p.code}</span>
                      <span>·</span>
                      <span>{p.questionCode} {p.questionTitle}</span>
                      <span>·</span>
                      <span className="font-mono text-gray-300">{p.dimensionLabel}</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{p.name}</h2>
                  </div>

                  <div className="space-y-4 leading-[1.75] text-[15px] text-gray-800">
                    {renderStory(p.story)}
                  </div>

                  <div className="mt-6">
                    <Link
                      href={`/wise-persons/${p.slug}`}
                      className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors border-b border-gray-200 hover:border-gray-400 pb-0.5"
                    >
                      阅读 {p.name} 的完整档案
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  {idx < persons.length - 1 && (
                    <div className="border-t border-gray-200/70 mt-10" />
                  )}
                </article>
              ))}
            </div>

            {/* Navigation */}
            <nav className="border-t border-gray-200/70 mt-14 pt-8">
              <div className="flex items-center justify-between">
                {dayIndex > 0 ? (
                  <button
                    onClick={() => setDayIndex(dayIndex - 1)}
                    className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    前一日
                  </button>
                ) : (
                  <div />
                )}
                <span className="text-xs text-gray-300">
                  {dayIndex + 1} / {totalDays}
                </span>
                {dayIndex < totalDays - 1 ? (
                  <button
                    onClick={() => setDayIndex(dayIndex + 1)}
                    className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    后一日
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <div />
                )}
              </div>
            </nav>

            <p className="text-center text-xs text-gray-300 mt-10">
              每日遇见三位智者，来自不同的问题领域
            </p>
          </div>

          {/* Sidebar: Calendar */}
          <aside className="hidden lg:flex flex-col justify-center w-72 flex-shrink-0">
            <div className="sticky top-1/2 -translate-y-1/2">
              <Calendar dayIndex={dayIndex} onSelect={setDayIndex} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
