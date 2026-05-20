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

  const prevDay = dayIndex > 0 ? dayIndex - 1 : null
  const nextDay = dayIndex < totalDays - 1 ? dayIndex + 1 : null

  const persons = useMemo(() => {
    return today.codes.map((code: string) => {
      const info = codes[code]
      const slug = info.slug
      const qn: number = info.primaryQuestion
      const question = qMap.get(qn)
      const dim = getDimension(qn)
      const story = stories[slug] || ""
      const excerpt = story.split("\n\n")[0].slice(0, 120) + (story.length > 120 ? "…" : "")

      return {
        code,
        slug,
        name: info.name,
        questionNumber: qn,
        questionTitle: question?.title ?? "",
        questionCode: question?.code ?? "",
        dimension: dim,
        dimensionLabel: DIMENSION_LABELS[dim] ?? "",
        excerpt,
      }
    })
  }, [dayIndex])

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">每日遇见智者</h1>
        <p className="text-sm text-muted-foreground">
          {today.date} · 第 {today.day} 天
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        {prevDay !== null ? (
          <button
            onClick={() => setDayIndex(prevDay)}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            昨日
          </button>
        ) : (
          <div />
        )}
        <span className="text-xs text-muted-foreground">
          {dayIndex + 1} / {totalDays}
        </span>
        {nextDay !== null ? (
          <button
            onClick={() => setDayIndex(nextDay)}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            明日
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <div />
        )}
      </div>

      {/* Person Cards */}
      <div className="space-y-4">
        {persons.map((p: any) => (
          <div
            key={p.code}
            className="rounded-lg border border-gray-200 bg-white overflow-hidden"
          >
            {/* Card header: WP code + question */}
            <div className="flex items-center gap-2 px-5 pt-4 pb-1">
              <span className="font-mono text-[11px] text-muted-foreground bg-gray-100 px-1.5 py-0.5 rounded">
                {p.code}
              </span>
              <span className="text-xs text-muted-foreground">
                · {p.questionCode} {p.questionTitle}
              </span>
              <Badge variant="secondary" className="text-[10px] leading-none px-1.5 py-0.5">
                {p.dimensionLabel}
              </Badge>
            </div>

            {/* Name */}
            <div className="px-5 py-2">
              <h2 className="text-lg font-bold">{p.name}</h2>
            </div>

            {/* Excerpt */}
            {p.excerpt && (
              <div className="px-5 pb-3">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {p.excerpt}
                </p>
              </div>
            )}

            {/* Link */}
            <div className="px-5 pb-4">
              <Link
                href={`/wise-persons/${p.slug}`}
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors font-medium"
              >
                查看完整介绍
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-muted-foreground mt-8">
        每日遇见三位智者，来自不同的问题领域。
      </p>
    </div>
  )
}
