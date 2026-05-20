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

export default function DailyPage() {
  const [dayIndex, setDayIndex] = useState(() => {
    const today = new Date()
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
    const idx = (dailySchedule as any).schedule.findIndex(
      (d: any) => d.date === dateStr
    )
    return idx >= 0 ? idx : 0
  })

  const schedule = (dailySchedule as any).schedule as any[]
  const codes = (wisePersonCodes as any).codes as Record<string, any>
  const stories = lifeStories as Record<string, string>
  const totalDays = schedule.length
  const today = schedule[dayIndex]

  const persons = useMemo(() => {
    return today.codes.map((code: string) => {
      const info = codes[code]
      const slug = info.slug
      const qn: number = info.primaryQuestion
      const question = qMap.get(qn)
      const dim = getDimension(qn)
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

  const pageTitle =
    persons.length > 0
      ? `遇见智者 · 第 ${today.day} 天 — ${persons.map((p: any) => p.name).join("、")}`
      : "遇见智者"

  return (
    <div className="min-h-screen bg-amber-50/40">
      <div className="container mx-auto max-w-2xl px-6 py-12">
        {/* Blog header */}
        <header className="mb-10">
          <p className="text-sm text-gray-400 mb-2">{today.date}</p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            遇见智者 · 第 {today.day} 天
          </h1>
          <p className="text-sm text-gray-400 mt-3 leading-relaxed">
            今日三位智者，来自 {persons.map((p: any) => p.questionTitle).join("、")} 领域。
          </p>
        </header>

        {/* Stories */}
        <div className="space-y-14">
          {persons.map((p: any, idx: number) => (
            <article key={p.code}>
              {/* Person header */}
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

              {/* Story */}
              <div className="space-y-4 leading-[1.75] text-[15px] text-gray-800">
                {renderStory(p.story)}
              </div>

              {/* Read more */}
              <div className="mt-6">
                <Link
                  href={`/wise-persons/${p.slug}`}
                  className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors border-b border-gray-200 hover:border-gray-400 pb-0.5"
                >
                  阅读 {p.name} 的完整档案
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Separator */}
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

        {/* Footer */}
        <p className="text-center text-xs text-gray-300 mt-10">
          每日遇见三位智者，来自不同的问题领域
        </p>
      </div>
    </div>
  )
}
