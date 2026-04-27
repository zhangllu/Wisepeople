"use client"

import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import { useWisePersonStore, useReviewStore } from "@/lib/stores"
import { getAuthorBooks, getTopicByCode } from "@/lib/data"
import { DISCIPLINE_LABELS, ERA_LABELS, REGION_LABELS, ROUTES } from "@/constants"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { WorkCard } from "@/components/work/WorkCard"
import { BookmarkButton } from "@/components/shared/BookmarkButton"
import { BookGrid } from "@/components/book/BookGrid"
import { ReviewCard } from "@/components/review/ReviewCard"
import { ReviewEditor } from "@/components/review/ReviewEditor"
import { useAuthStore } from "@/lib/stores"

export default function WisePersonDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { getWisePersonBySlug } = useWisePersonStore()
  const { getReviewsByWork } = useReviewStore()
  const { isAuthenticated } = useAuthStore()

  const person = getWisePersonBySlug(slug)

  if (!person) {
    notFound()
  }

  const isStub = person.isStub

  // For stub authors, get their books from the data layer
  const stubBooks = isStub ? getAuthorBooks(slug) : []
  const topicLinks = isStub && person.topicCodes
    ? person.topicCodes.map((code) => ({ code, topic: getTopicByCode(code) })).filter((t) => t.topic)
    : []

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">{person.name}</h1>
            {person.nameEn && (
              <p className="text-sm text-muted-foreground">{person.nameEn}</p>
            )}
          </div>
          <BookmarkButton targetId={person.slug} targetType="wise-person" />
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {isStub ? (
            <>
              {topicLinks.length > 0 && (
                <Badge variant="secondary">{topicLinks.length} 个主题方向</Badge>
              )}
              <Badge variant="outline">{stubBooks.length} 本著作</Badge>
              <Badge variant="outline" className="text-muted-foreground">资料待完善</Badge>
            </>
          ) : (
            <>
              <Badge variant="secondary">{ERA_LABELS[person.era]}</Badge>
              <Badge variant="outline">{DISCIPLINE_LABELS[person.discipline]}</Badge>
              <Badge variant="outline">{REGION_LABELS[person.region]}</Badge>
            </>
          )}
        </div>
      </div>

      {/* Stub: show associated topics */}
      {isStub && topicLinks.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">关联主题</h2>
          <div className="flex flex-wrap gap-2">
            {topicLinks.map(({ code, topic }) => topic && (
              <Link key={code} href={ROUTES.topicDetail(code)}>
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10">
                  {topic.title}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Stub: show books */}
      {isStub && stubBooks.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">著作列表</h2>
          <BookGrid books={stubBooks} />
        </section>
      )}

      {/* Full profile: Biography */}
      {!isStub && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">生平简介</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{person.biography}</p>
        </section>
      )}

      {/* Full profile: Core Thoughts */}
      {!isStub && person.coreThoughts && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">核心思想</h2>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {person.coreThoughts}
          </p>
        </section>
      )}

      {/* Full profile: Works */}
      {!isStub && person.works.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">代表作</h2>
          <div className="space-y-3">
            {person.works.map((work) => (
              <div key={work.id}>
                <WorkCard work={work} />
                {isAuthenticated && (
                  <div className="mt-3 ml-4 pl-4 border-l-2">
                    <ReviewEditor workSlug={work.slug} workTitle={work.title} />
                  </div>
                )}
                {getReviewsByWork(work.slug).length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-muted-foreground">读者笔记</p>
                    {getReviewsByWork(work.slug).map((review) => (
                      <ReviewCard key={review.id} review={review} showWork={false} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Full profile: Tags */}
      {!isStub && person.tags.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">标签</h2>
          <div className="flex flex-wrap gap-2">
            {person.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
