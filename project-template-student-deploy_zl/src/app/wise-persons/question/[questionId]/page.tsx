"use client"

import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import { getAllQuestions, getWisePersonsByTopicInQuestion } from "@/lib/data"
import { DIMENSION_LABELS } from "@/constants"
import { Badge } from "@/components/ui/badge"
import { WisePersonCard } from "@/components/wise-person/WisePersonCard"
import { ArrowLeft } from "lucide-react"

export default function WisePersonQuestionPage() {
  const params = useParams()
  const questionId = params.questionId as string

  const questions = getAllQuestions()
  const question = questions.find((q) => q.code === questionId)

  if (!question) {
    notFound()
  }

  const topicGroups = getWisePersonsByTopicInQuestion(question.number)
  const totalCount = topicGroups.reduce((sum, g) => sum + g.wisePersons.length, 0)

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Back link */}
      <Link
        href="/wise-persons"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        返回智者库
      </Link>

      {/* Question header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono text-muted-foreground">{question.code}</span>
          <Badge variant="secondary" className="text-[10px]">
            {DIMENSION_LABELS[question.dimension]}
          </Badge>
          <span className="text-xs text-muted-foreground/60">{totalCount} 位智者</span>
        </div>
        <h1 className="text-2xl font-bold mb-1">{question.title}</h1>
        <p className="text-sm text-muted-foreground">{question.subtitle}</p>
      </div>

      {/* Sub-topic groups */}
      <div className="space-y-8">
        {topicGroups.map(({ topic, wisePersons: persons }) => (
          <section key={topic.code}>
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-base font-semibold">{topic.title}</h2>
                <span className="text-xs text-muted-foreground/60">
                  {persons.length} 位智者
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {topic.coreField}
                {topic.representativeDiscipline && (
                  <span className="ml-2 inline-block">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal">
                      {topic.representativeDiscipline}
                    </Badge>
                  </span>
                )}
              </p>
            </div>

            {persons.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {persons.map((person) => (
                  <WisePersonCard key={person.slug} wisePerson={person} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground/50 italic">暂无智者数据</p>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
