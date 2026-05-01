"use client"

import Link from "next/link"
import { getAllQuestions } from "@/lib/data"
import { DIMENSION_LABELS } from "@/constants"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Dimension } from "@/types"

const DIMENSION_ORDER: Dimension[] = ["meta", "heaven", "earth", "human"]

const DIMENSION_DESCRIPTION: Record<Dimension, string> = {
  meta: "关于知识本身的知识——认识论、方法论与创新学",
  heaven: "认识我们所处的世界——从宇宙到生命、从历史到时代",
  earth: "理解人类社会的运作逻辑——社会、组织与家庭",
  human: "探索人何以为人——人性、身体与信仰",
}

export default function WisePersonsPage() {
  const questions = getAllQuestions()

  // Group questions by dimension
  const grouped = DIMENSION_ORDER.map((dim) => ({
    dimension: dim,
    label: DIMENSION_LABELS[dim],
    description: DIMENSION_DESCRIPTION[dim],
    questions: questions.filter((q) => q.dimension === dim),
  }))

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">智者库</h1>
        <p className="text-sm text-muted-foreground">
          围绕十大问题，汇聚人类文明史上的智者。选择一个问题，探索其中的代表人物及其思想。
        </p>
      </div>

      <div className="space-y-10">
        {grouped.map(({ dimension, label, description, questions: dimQuestions }) => (
          <section key={dimension}>
            {/* Dimension header */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-bold font-mono">{label}</span>
                <span className="text-xs text-muted-foreground">{description}</span>
              </div>
            </div>

            {/* Question cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dimQuestions.map((q) => (
                <Link
                  key={q.code}
                  href={`/wise-persons/question/${q.code}`}
                  className="group block h-full"
                >
                  <Card className="h-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-muted-foreground">{q.code}</span>
                        <Badge variant="secondary" className="text-[10px]">
                          {label}
                        </Badge>
                      </div>
                      <h3 className="text-base font-semibold mb-1 group-hover:text-primary transition-colors">
                        {q.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {q.subtitle}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
