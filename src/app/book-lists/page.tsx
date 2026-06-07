"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, BookHeart, BookOpen } from "lucide-react"
import { getAllQuestions, getBooksByTopic, getTopicsByQuestion, getMinimumBookList, getClassicsBooks } from "@/lib/data"
import { DIMENSION_LABELS, ROUTES } from "@/constants"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { BookCard } from "@/components/book/BookCard"
import { DoubanListCard } from "@/components/book-list/DoubanListCard"
import { personalizedBookLists } from "@/data/personalized-booklists"
import { PageHero } from "@/components/shared/PageHero"

/** Preview card with cover image for the grid sections */
function CoverPreviewCard({ slug, title, author, href }: { slug: string; title: string; author: string; href?: string }) {
  const [imgError, setImgError] = useState(false)
  const coverSrc = imgError ? null : `/images/covers/${slug}.jpg`
  const Wrapper = href ? "a" : "div"
  const linkProps = href ? { href, target: "_blank" as const, rel: "noopener noreferrer" } : {}

  return (
    <Wrapper {...linkProps}>
      <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 overflow-hidden h-full">
        <div className="aspect-[3/4] bg-muted flex items-center justify-center overflow-hidden">
          {coverSrc ? (
            <img
              src={coverSrc}
              alt={title}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <BookOpen className="w-8 h-8 text-muted-foreground/15" />
          )}
        </div>
        <CardContent className="p-2.5">
          <p className="text-sm font-medium truncate">{title}</p>
          <p className="text-xs text-muted-foreground truncate">{author}</p>
        </CardContent>
      </Card>
    </Wrapper>
  )
}

export default function BookListsPage() {
  const questions = getAllQuestions()
  const minBooks = getMinimumBookList()
  const classicsBooks = getClassicsBooks()

  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set())

  const totalBooks = questions.reduce(
    (s, q) =>
      s + getTopicsByQuestion(q.number).reduce((t, topic) => t + getBooksByTopic(topic.code).length, 0),
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
        title="书单推荐"
        subtitle="好的阅读，始于好的选择"
        description={`大问题主题书单 · 最小限度书单 · 元典十三经 · 个性化书单，共 ${totalBooks + minBooks.length + classicsBooks.length} 本著作`}
        accent={
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
            <BookHeart className="w-4 h-4 text-accent" />
          </div>
        }
      />
      <div className="container mx-auto max-w-4xl px-4 py-8 space-y-12">
        {/* ── 大问题主题书单 ── */}
        <section>
          <h2 className="text-lg font-semibold mb-4">大问题主题书单</h2>
          <div className="space-y-2">
            {questions.map((q) => {
              const topics = getTopicsByQuestion(q.number)
              const totalInQ = topics.reduce((t, topic) => t + getBooksByTopic(topic.code).length, 0)
              const isOpen = expanded.has(q.number)
              return (
                <div
                  key={q.number}
                  className="rounded-lg border border-border overflow-hidden"
                >
                  <button
                    onClick={() => toggle(q.number)}
                    className="w-full flex items-center justify-between bg-muted px-4 py-3 text-sm font-medium hover:bg-muted/80 transition-colors"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-xs text-muted-foreground shrink-0">
                        {q.code}
                      </span>
                      {isOpen ? (
                        <Link
                          href={ROUTES.questionDetail(q.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="truncate hover:text-accent underline-offset-2 hover:underline transition-colors"
                        >
                          {q.title}
                        </Link>
                      ) : (
                        <span className="truncate">{q.title}</span>
                      )}
                      <Badge
                        variant="secondary"
                        className="text-[10px] leading-none px-1.5 py-0.5 shrink-0"
                      >
                        {DIMENSION_LABELS[q.dimension]}
                      </Badge>
                      <span className="text-xs text-muted-foreground/60 shrink-0">
                        {totalInQ} 本
                      </span>
                    </span>
                    <ChevronRight
                      className={`h-4 w-4 text-muted-foreground transition-transform flex-shrink-0 ${
                        isOpen ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="divide-y divide-border/50">
                      {topics.map((topic) => {
                        const books = getBooksByTopic(topic.code)
                        const topicOpen = expandedTopics.has(topic.code)
                        return (
                          <div key={topic.code}>
                            {/* Topic sub-header — collapsible */}
                            <button
                              onClick={() => toggleTopic(topic.code)}
                              className="w-full flex items-center gap-2 px-4 py-2 bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                              <ChevronRight
                                className={`h-3 w-3 text-muted-foreground/50 transition-transform flex-shrink-0 ${
                                  topicOpen ? "rotate-90" : ""
                                }`}
                              />
                              <span className="font-mono text-[10px] text-accent shrink-0">
                                {topic.code}
                              </span>
                              {topicOpen ? (
                                <Link
                                  href={ROUTES.topicDetail(topic.code)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-xs font-medium hover:text-accent underline-offset-2 hover:underline transition-colors"
                                >
                                  {topic.title}
                                </Link>
                              ) : (
                                <span className="text-xs font-medium">
                                  {topic.title}
                                </span>
                              )}
                              <span className="text-[10px] text-muted-foreground/60 shrink-0">
                                {books.length} 本
                              </span>
                            </button>
                            {/* Books under this topic — collapsible */}
                            {topicOpen && (
                              books.length > 0 ? (
                                <div className="divide-y divide-border/30">
                                  {books.map((b) => (
                                    <BookCard key={b.slug} book={b} compact />
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
        </section>

        {/* ── 最小限度书单 ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">最小限度书单</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                精选 56 本必读经典，覆盖天地人三大维度
              </p>
            </div>
            <Link
              href={ROUTES.bookListDetail("minimum-56")}
              className="text-xs text-accent hover:underline"
            >
              查看全部 {minBooks.length} 本 →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {minBooks.slice(0, 8).map((b) => (
              <CoverPreviewCard key={b.slug} slug={b.slug} title={b.title} author={b.author} href={b.doubanLink} />
            ))}
          </div>
        </section>

        {/* ── 元典十三经 ── */}
        {classicsBooks.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">元典：人类文明十三经</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  轴心时代四大文明的根本经典
                </p>
              </div>
              <Link
                href={ROUTES.topicDetail("0")}
                className="text-xs text-accent hover:underline"
              >
                查看全部 →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {classicsBooks.slice(0, 8).map((b) => (
                <CoverPreviewCard key={b.slug} slug={b.slug} title={b.title} author={b.author} href={b.doubanLink} />
              ))}
            </div>
          </section>
        )}

        {/* ── 个性化书单 ── */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">个性化书单</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              来自豆瓣的主题豆列，拓展阅读的边界
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {personalizedBookLists.map((bl) => (
              <DoubanListCard key={bl.id} list={bl} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
