"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { useState } from "react"
import { getWisePersonsByQuestion } from "@/lib/data"
import { DIMENSION_LABELS } from "@/constants"
import { Badge } from "@/components/ui/badge"

export default function WisePersonsPage() {
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const questionGroups = getWisePersonsByQuestion()

  const total = questionGroups.reduce((s, g) => s + g.wisePersons.length, 0)

  function toggle(qn: number) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(qn)) {
        next.delete(qn)
      } else {
        next.add(qn)
      }
      return next
    })
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">智者库</h1>
      <p className="text-sm text-muted-foreground mb-6">
        共收录 {total} 位智者，按十大问题领域分类。点击问题展开名单，点击姓名查看人物故事和相关链接。
      </p>

      <div className="space-y-2">
        {questionGroups.map(({ question, wisePersons }) => {
          const isOpen = expanded.has(question.number)
          return (
            <div key={question.number} className="rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggle(question.number)}
                className="w-full flex items-center justify-between bg-gray-50 px-4 py-3 text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{question.code}</span>
                  <span>{question.title}</span>
                  <Badge variant="secondary" className="text-[10px] leading-none px-1.5 py-0.5">
                    {DIMENSION_LABELS[question.dimension]}
                  </Badge>
                  <span className="text-xs text-muted-foreground/60">{wisePersons.length} 位</span>
                </span>
                <ChevronRight
                  className={`h-4 w-4 text-muted-foreground transition-transform flex-shrink-0 ${
                    isOpen ? "rotate-90" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="divide-y divide-gray-100">
                  {wisePersons.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/wise-persons/${p.slug}`}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-blue-50/30 transition-colors group text-sm"
                    >
                      <span className="group-hover:text-blue-700 transition-colors">{p.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {p.links ? `${p.links.length} 条链接` : ""}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
