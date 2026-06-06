"use client"

import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import { getAllQuestions, getTopicByCode, getBookCount } from "@/lib/data"
import { DIMENSION_LABELS, ROUTES } from "@/constants"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { WisePersonCard } from "@/components/wise-person/WisePersonCard"
import { useWisePersonStore } from "@/lib/stores"
import { DetailHeader } from "@/components/shared/DetailHeader"
import { FadeIn } from "@/components/shared/FadeIn"

export default function QuestionDetailPage() {
  const params = useParams()
  const questionId = params.questionId as string
  const { getWisePersonBySlug } = useWisePersonStore()

  const questions = getAllQuestions()
  const question =
    questions.find((q) => q.code === questionId) ||
    questions.find((q) => q.code === `Q${String(parseInt(questionId.replace("q-", ""))).padStart(2, "0")}`)

  if (!question) {
    notFound()
  }

  const relatedWisePersons = question.relatedWisePersonSlugs
    .map((slug) => getWisePersonBySlug(slug))
    .filter(Boolean)

  const subTopics = question.subTopicCodes
    .map((code) => {
      const topic = getTopicByCode(code)
      return topic ? { ...topic, bookCount: getBookCount(code) } : null
    })
    .filter(Boolean)

  return (
    <>
      <DetailHeader
        title={question.title}
        description={question.subtitle}
        breadcrumb={
          <Link href={ROUTES.questions} className="text-muted-foreground hover:text-accent transition-colors">
            ← 返回问题列表
          </Link>
        }
        meta={
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground">{question.code}</span>
            <Badge variant="secondary" className="text-[10px]">
              {DIMENSION_LABELS[question.dimension]}
            </Badge>
          </div>
        }
      />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <FadeIn>
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">主题方向</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {subTopics.map((st) => st && (
                <Link key={st.code} href={ROUTES.topicDetail(st.code)}>
                  <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 h-full">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">{st.code}</span>
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{st.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">{st.representativeDiscipline}</p>
                      <p className="text-xs text-accent/70 mt-2">{st.bookCount} 本著作</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </FadeIn>

        {relatedWisePersons.length > 0 && (
          <FadeIn delay={100}>
            <section>
              <h2 className="text-lg font-semibold mb-4">关联智者</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedWisePersons.map((person) => person && (
                  <WisePersonCard key={person.id} wisePerson={person} />
                ))}
              </div>
            </section>
          </FadeIn>
        )}
      </div>
    </>
  )
}
