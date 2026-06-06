"use client"

import Link from "next/link"
import { ChevronRight, Library } from "lucide-react"
import { useState } from "react"
import { getAllQuestions, getWisePersonsByTopicInQuestion } from "@/lib/data"
import { DIMENSION_LABELS } from "@/constants"
import { Badge } from "@/components/ui/badge"
import { PageHero } from "@/components/shared/PageHero"

export default function WisePersonsPage() {
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set())
  const questions = getAllQuestions()

  const total = questions.reduce(
    (s, q) =>
      s + getWisePersonsByTopicInQuestion(q.number).reduce((t, tw) => t + tw.wisePersons.length, 0),
    0,
  )

  function toggle(qn: number) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(qn)) next.delete(qn)
      else next.add(qn)
      return next
    })
  }

  function toggleTopic(code: string) {
    setExpandedTopics((prev) => {
      const next = new Set(prev)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      return next
    })
  }

  return (
    <div>
      <PageHero
        title="智者库"
        subtitle="师法智者，以通古今"
        description={`共收录 ${total} 位智者，按十大问题与主题方向分类。点击展开查看，点击姓名查看人物故事。`}
        accent={
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
            <Library className="w-4 h-4 text-accent" />
          </div>
        }
      />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-2">
          {questions.map((q) => {
            const topicsWithWisePersons = getWisePersonsByTopicInQuestion(q.number)
            const totalInQ = topicsWithWisePersons.reduce((s, tw) => s + tw.wisePersons.length, 0)
            const isOpen = expanded.has(q.number)
            return (
              <div key={q.number} className="rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => toggle(q.number)}
                  className="w-full flex items-center justify-between bg-muted px-4 py-3 text-sm font-medium hover:bg-muted/80 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{q.code}</span>
                    <span>{q.title}</span>
                    <Badge variant="secondary" className="text-[10px] leading-none px-1.5 py-0.5">
                      {DIMENSION_LABELS[q.dimension]}
                    </Badge>
                    <span className="text-xs text-muted-foreground/60">{totalInQ} 位</span>
                  </span>
                  <ChevronRight
                    className={`h-4 w-4 text-muted-foreground transition-transform flex-shrink-0 ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="divide-y divide-border/50">
                    {topicsWithWisePersons.map(({ topic, wisePersons }) => {
                      const topicOpen = expandedTopics.has(topic.code)
                      return (
                        <div key={topic.code}>
                          <button
                            onClick={() => toggleTopic(topic.code)}
                            className="w-full flex items-center gap-2 px-4 py-2 bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <ChevronRight
                              className={`h-3 w-3 text-muted-foreground/50 transition-transform flex-shrink-0 ${
                                topicOpen ? "rotate-90" : ""
                              }`}
                            />
                            <span className="font-mono text-[10px] text-accent">
                              {topic.code}
                            </span>
                            <span className="text-xs font-medium">
                              {topic.title}
                            </span>
                            <span className="text-[10px] text-muted-foreground/60">
                              {wisePersons.length} 位
                            </span>
                          </button>
                          {topicOpen && (
                            wisePersons.length > 0 ? (
                              <div className="divide-y divide-border/30">
                                {wisePersons.map((p) => (
                                  <Link
                                    key={p.slug}
                                    href={`/wise-persons/${p.slug}`}
                                    className="flex items-center justify-between px-4 py-2 pl-10 hover:bg-accent/5 transition-colors group text-sm"
                                  >
                                    <span className="group-hover:text-accent transition-colors">
                                      {p.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {p.isStub
                                        ? `${p.bookSlugs?.length || 0} 本著作`
                                        : p.links
                                          ? `${p.links.length} 条链接`
                                          : ""}
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            ) : (
                              <div className="px-4 py-2 pl-10 text-xs text-muted-foreground/50">
                                暂无收录
                              </div>
                            )
                          )}
                        </div>
                      )
                    })}
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
