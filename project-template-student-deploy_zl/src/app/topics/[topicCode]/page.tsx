"use client"

import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import { getTopicByCode, getQuestionByTopicCode, getBooksByTopic, getDimensionByQuestionNumber } from "@/lib/data"
import { DIMENSION_LABELS, ROUTES } from "@/constants"
import { Badge } from "@/components/ui/badge"
import { BookGrid } from "@/components/book/BookGrid"

export default function TopicDetailPage() {
  const params = useParams()
  const topicCode = params.topicCode as string

  const topic = getTopicByCode(topicCode)

  if (!topic) {
    notFound()
  }

  const question = getQuestionByTopicCode(topicCode)
  const books = getBooksByTopic(topicCode)
  const dimension = topic.questionNumber > 0
    ? getDimensionByQuestionNumber(topic.questionNumber)
    : null

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        {question ? (
          <>
            <Link href={ROUTES.questions} className="hover:text-primary">十大问题</Link>
            <span>/</span>
            <Link href={ROUTES.questionDetail(question.code)} className="hover:text-primary">{question.title}</Link>
            <span>/</span>
          </>
        ) : (
          <>
            <Link href={ROUTES.questions} className="hover:text-primary">十大问题</Link>
            <span>/</span>
          </>
        )}
        <span className="text-foreground">{topic.title}</span>
      </div>

      {/* Topic header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono text-muted-foreground">{topic.code}</span>
          {dimension && (
            <Badge variant="secondary" className="text-[10px]">
              {DIMENSION_LABELS[dimension]}
            </Badge>
          )}
        </div>
        <h1 className="text-2xl font-bold mb-3">{topic.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div>
            <span className="text-foreground font-medium">核心领域：</span>
            {topic.coreField}
          </div>
          <div>
            <span className="text-foreground font-medium">代表性学科：</span>
            {topic.representativeDiscipline}
          </div>
          <div>
            <span className="text-foreground font-medium">收录著作：</span>
            {books.length} 本
          </div>
        </div>
      </div>

      {/* Books */}
      <section>
        <h2 className="text-lg font-semibold mb-4">著作列表</h2>
        <BookGrid books={books} />
      </section>
    </div>
  )
}
