"use client"

import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import { getTopicByCode, getQuestionByTopicCode, getBooksByTopic, getDimensionByQuestionNumber } from "@/lib/data"
import { DIMENSION_LABELS, ROUTES } from "@/constants"
import { Badge } from "@/components/ui/badge"
import { BookGrid } from "@/components/book/BookGrid"
import { DetailHeader } from "@/components/shared/DetailHeader"
import { FadeIn } from "@/components/shared/FadeIn"

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
    <>
      <DetailHeader
        title={topic.title}
        breadcrumb={
          <div className="flex items-center gap-2">
            {question ? (
              <>
                <Link href={ROUTES.questions} className="hover:text-primary">十大问题</Link>
                <span className="text-muted-foreground/30">/</span>
                <Link href={ROUTES.questionDetail(question.code)} className="hover:text-primary">{question.title}</Link>
                <span className="text-muted-foreground/30">/</span>
              </>
            ) : (
              <>
                <Link href={ROUTES.questions} className="hover:text-primary">十大问题</Link>
                <span className="text-muted-foreground/30">/</span>
              </>
            )}
            <span className="text-foreground/80">{topic.title}</span>
          </div>
        }
        meta={
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">{topic.code}</span>
            {dimension && (
              <Badge variant="secondary" className="text-[10px]">
                {DIMENSION_LABELS[dimension]}
              </Badge>
            )}
          </div>
        }
      />

      <div className="container mx-auto max-w-5xl px-4 py-8">
        <FadeIn>
          <section>
            <h2 className="text-lg font-semibold mb-4">著作列表</h2>
            <BookGrid books={books} />
          </section>
        </FadeIn>
      </div>
    </>
  )
}
