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

export default function BookListDetailPage() {
  const params = useParams()
  const listId = params.listId as string

  // Minimum 56 book list
  if (listId === "minimum-56") {
    const minBooks = getMinimumBookList()
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <Link href={ROUTES.bookLists} className="text-xs text-muted-foreground hover:text-primary mb-4 block">
          ← 返回书单列表
        </Link>
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">最小限度书单</h1>
          <p className="text-sm text-muted-foreground">精选 56 本必读经典，覆盖天地人三大维度</p>
        </div>
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
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <Link href={ROUTES.bookLists} className="text-xs text-muted-foreground hover:text-primary mb-4 block">
          ← 返回书单列表
        </Link>
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-muted-foreground">{question.code}</span>
            <Badge variant="secondary" className="text-[10px]">
              {DIMENSION_LABELS[question.dimension]}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold mb-2">{question.title}</h1>
          <p className="text-sm text-muted-foreground">{question.subtitle}</p>
          <p className="text-xs text-primary/70 mt-2">{books.length} 本相关著作</p>
        </div>
        <BookGrid books={books} />
      </div>
    )
  }

  // Legacy mock book lists
  const mockMatch = listId === "minimum-50" || listId === "philosophy-starter" || listId === "science-classics"
  if (mockMatch) {
    const bookList = mockBookLists.find((bl) => bl.slug === listId)
    if (!bookList) notFound()

    const works = mockWorks.filter((w) => bookList.workSlugs.includes(w.slug))

    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link href={ROUTES.bookLists} className="text-xs text-muted-foreground hover:text-primary mb-4 block">
          ← 返回书单列表
        </Link>
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">{bookList.title}</h1>
            <p className="text-sm text-muted-foreground">{bookList.description}</p>
          </div>
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
    )
  }

  notFound()
}
