"use client"

import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import { useWisePersonStore, useBookmarkStore } from "@/lib/stores"
import { mockBookLists, mockWorks } from "@/lib/stores/mock-data"
import { getMinimumBookList, getAllQuestions, getBooksByQuestion, getClassicsBooks } from "@/lib/data"
import { ROUTES, DIMENSION_LABELS } from "@/constants"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { WorkCard } from "@/components/work/WorkCard"
import { BookGrid } from "@/components/book/BookGrid"
import { BookmarkButton } from "@/components/shared/BookmarkButton"
import { DetailHeader } from "@/components/shared/DetailHeader"
import { FadeIn } from "@/components/shared/FadeIn"

export default function BookListDetailPage() {
  const params = useParams()
  const listId = params.listId as string

  // Minimum 56 book list
  if (listId === "minimum-56") {
    const minBooks = getMinimumBookList()
    return (
      <>
        <DetailHeader
          title="最小限度书单"
          description="精选 56 本必读经典，覆盖天地人三大维度"
          breadcrumb={
            <Link href={ROUTES.bookLists} className="text-muted-foreground hover:text-primary transition-colors">
              ← 返回书单列表
            </Link>
          }
        />
        <FadeIn>
          <div className="container mx-auto max-w-5xl px-4 py-8">
            <div className="space-y-4">
              {minBooks.map((b) => (
                <Card key={b.slug}>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-sm">{b.title}</h3>
                          <p className="text-xs text-muted-foreground">{b.author}{b.translator ? ` · ${b.translator}译` : ""}</p>
                        </div>
                        {b.doubanLink && (
                          <a href={b.doubanLink} target="_blank" rel="noopener noreferrer" className="text-[11px] text-primary hover:underline shrink-0">
                            豆瓣
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        {b.publisher && <span>{b.publisher}</span>}
                        {b.tagClass && (
                          <>
                            <span>|</span>
                            <span>{b.tagClass}</span>
                          </>
                        )}
                      </div>
                      {b.summary && (
                        <div className="mt-2 text-xs text-muted-foreground leading-relaxed">
                          {b.summary.length > 300 ? `${b.summary.slice(0, 300)}...` : b.summary}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </FadeIn>
      </>
    )
  }

  // Question-based book list: q-{number}
  const qMatch = listId.match(/^q-(\d+)$/)
  if (qMatch) {
    const qNumber = parseInt(qMatch[1])
    const question = getAllQuestions().find((q) => q.number === qNumber)
    if (!question) notFound()

    const books = getBooksByQuestion(qNumber)

    return (
      <>
        <DetailHeader
          title={question.title}
          description={question.subtitle}
          breadcrumb={
            <Link href={ROUTES.bookLists} className="text-muted-foreground hover:text-primary transition-colors">
              ← 返回书单列表
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
        <FadeIn>
          <div className="container mx-auto max-w-5xl px-4 py-8">
            <p className="text-xs text-primary/70 mb-6">{books.length} 本相关著作</p>
            <BookGrid books={books} />
          </div>
        </FadeIn>
      </>
    )
  }

  // Legacy mock book lists
  const mockMatch = listId === "minimum-50" || listId === "philosophy-starter" || listId === "science-classics"
  if (mockMatch) {
    const bookList = mockBookLists.find((bl) => bl.slug === listId)
    if (!bookList) notFound()

    const works = mockWorks.filter((w) => bookList.workSlugs.includes(w.slug))

    return (
      <>
        <DetailHeader
          title={bookList.title}
          description={bookList.description}
          breadcrumb={
            <Link href={ROUTES.bookLists} className="text-muted-foreground hover:text-primary transition-colors">
              ← 返回书单列表
            </Link>
          }
        />
        <FadeIn>
          <div className="container mx-auto max-w-4xl px-4 py-8">
            <div className="flex justify-end mb-6">
              <BookmarkButton targetId={bookList.slug} targetType="book-list" />
            </div>
            <section>
              <h2 className="text-lg font-semibold mb-4">包含著作（{works.length}）</h2>
              <div className="space-y-3">
                {works.map((work) => (
                  <WorkCard key={work.id} work={work} showRecommendation={true} />
                ))}
              </div>
            </section>
          </div>
        </FadeIn>
      </>
    )
  }

  notFound()
}
