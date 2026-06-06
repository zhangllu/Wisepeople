"use client"

import Link from "next/link"
import { ChevronRight, Library } from "lucide-react"
import { useState } from "react"
import { getWisePersonsByQuestion } from "@/lib/data"
import { DIMENSION_LABELS } from "@/constants"
import { Badge } from "@/components/ui/badge"
import { PageHero } from "@/components/shared/PageHero"

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
    <div>
      <PageHero
        title="智者库"
        subtitle="师法智者，以通古今"
        description={`共收录 ${total} 位智者，按十大问题领域分类。点击问题展开名单，点击姓名查看人物故事和相关链接。`}
        accent={
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
            <Library className="w-4 h-4 text-accent" />
          </div>
        }
      />
      <div className="container mx-auto max-w-4xl px-4 py-8">

      <div className="space-y-2">
        {questionGroups.map(({ question, wisePersons }) => {
          const isOpen = expanded.has(question.number)
          return (
            <div key={question.number} className="rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => toggle(question.number)}
                className="w-full flex items-center justify-between bg-muted px-4 py-3 text-sm font-medium hover:bg-muted/80 transition-colors"
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
                <div className="divide-y divide-border">
                  {wisePersons.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/wise-persons/${p.slug}`}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-accent/5 transition-colors group text-sm"
                    >
                      <span className="group-hover:text-accent transition-colors">{p.name}</span>
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
    </div>
  )
}
