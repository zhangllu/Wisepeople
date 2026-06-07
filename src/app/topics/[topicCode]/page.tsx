"use client"

import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import { getTopicByCode, getQuestionByTopicCode, getBooksByTopic, getDimensionByQuestionNumber, getWisePersonsByTopicCode } from "@/lib/data"
import { DIMENSION_LABELS, ROUTES } from "@/constants"
import { Badge } from "@/components/ui/badge"
import { BookGrid } from "@/components/book/BookGrid"
import { WisePersonCard } from "@/components/wise-person/WisePersonCard"
import { DetailHeader } from "@/components/shared/DetailHeader"
import { FadeIn } from "@/components/shared/FadeIn"
import { Users, BookOpen } from "lucide-react"

export default function TopicDetailPage() {
  const params = useParams()
  const topicCode = params.topicCode as string

  const topic = getTopicByCode(topicCode)

  if (!topic) {
    notFound()
  }

  const question = getQuestionByTopicCode(topicCode)
  const wisePersons = getWisePersonsByTopicCode(topicCode)
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
                <Link href={ROUTES.questions} className="hover:text-accent">十大问题</Link>
                <span className="text-muted-foreground/30">/</span>
                <Link href={ROUTES.questionDetail(question.code)} className="hover:text-accent">{question.title}</Link>
                <span className="text-muted-foreground/30">/</span>
              </>
            ) : (
              <>
                <Link href={ROUTES.questions} className="hover:text-accent">十大问题</Link>
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
        {/* Topic summary */}
        <FadeIn>
          <div className="mb-10 pb-6 border-b border-border/50">
            <p className="text-sm text-muted-foreground leading-relaxed">{topic.coreField}</p>
            {topic.representativeDiscipline && (
              <Badge variant="outline" className="mt-2 text-[11px]">
                {topic.representativeDiscipline}
              </Badge>
            )}
            {/* Stats */}
            <div className="flex items-center gap-5 mt-4">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-accent/70" />
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{wisePersons.length}</span> 位智者
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-accent/70" />
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{books.length}</span> 本著作
                </span>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Wise Persons */}
        {wisePersons.length > 0 && (
          <FadeIn>
            <section id="wise-persons" className="mb-10 scroll-mt-20">
              <div className="flex items-center gap-2 mb-5">
                <Users className="w-4 h-4 text-accent" />
                <h2 className="text-lg font-semibold">智者</h2>
                <Badge variant="secondary" className="text-[10px]">{wisePersons.length}</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wisePersons.map((person) => (
                  <WisePersonCard key={person.slug} wisePerson={person} />
                ))}
              </div>
            </section>
          </FadeIn>
        )}

        {/* Books */}
        <FadeIn>
          <section id="books" className="mb-10 scroll-mt-20">
            <div className="flex items-center gap-2 mb-5">
              <BookOpen className="w-4 h-4 text-accent" />
              <h2 className="text-lg font-semibold">著作</h2>
              <Badge variant="secondary" className="text-[10px]">{books.length}</Badge>
            </div>
            <BookGrid books={books} />
          </section>
        </FadeIn>
      </div>
    </>
  )
}
