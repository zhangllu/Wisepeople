"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import dailySchedule from "@/data/daily-schedule.json"
import wisePersonCodes from "@/data/wise-person-codes.json"
import questionsData from "@/data/questions.json"
import lifeStories from "@/data/links/life-stories.json"
import { DIMENSION_LABELS } from "@/constants"
import { Badge } from "@/components/ui/badge"
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
        className="leading-relaxed text-gray-800 text-[15px]"
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

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Blog header */}
      <div className="mb-8">
        <p className="text-sm text-muted-foreground mb-1">{today.date}</p>
        <h1 className="text-3xl font-bold tracking-tight">
          每日遇见 · 第 {today.day} 天
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          今日来自 {persons.map((p: any) => p.questionTitle).join("、")} 领域的三位智者
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mb-8" />

      {/* Stories */}
      <div className="space-y-12">
        {persons.map((p: any, idx: number) => (
          <article key={p.code}>
            {/* Person header */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                  {p.code}
                </span>
                <span>·</span>
                <span>{p.questionCode} {p.questionTitle}</span>
                <Badge variant="secondary" className="text-[10px] leading-none px-1.5 py-0.5">
                  {p.dimensionLabel}
                </Badge>
              </div>
              <h2 className="text-xl font-bold">{p.name}</h2>
            </div>

            {/* Story */}
            <div className="space-y-3 leading-relaxed text-gray-800 text-[15px]">
              {renderStory(p.story)}
            </div>

            {/* Read more */}
            <div className="mt-4">
              <Link
                href={`/wise-persons/${p.slug}`}
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
              >
                查看 {p.name} 的完整介绍
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Divider between persons */}
            {idx < persons.length - 1 && (
              <div className="border-t border-gray-100 mt-8" />
            )}
          </article>
        ))}
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-200 mt-12 pt-6">
        <div className="flex items-center justify-between">
          {dayIndex > 0 ? (
            <button
              onClick={() => setDayIndex(dayIndex - 1)}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              前一日
            </button>
          ) : <div />}
          <span className="text-xs text-muted-foreground">
            {dayIndex + 1} / {totalDays}
          </span>
          {dayIndex < totalDays - 1 ? (
            <button
              onClick={() => setDayIndex(dayIndex + 1)}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              后一日
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : <div />}
        </div>
      </div>
    </div>
  )
}
