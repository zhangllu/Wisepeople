"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useEffect, useState, Suspense } from "react"
import { useSearchStore } from "@/lib/stores"
import type { StoryMatch } from "@/lib/stores/search-store"
import { WisePersonGrid } from "@/components/wise-person/WisePersonGrid"
import { WorkCard } from "@/components/work/WorkCard"
import { BookCard } from "@/components/book/BookCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Lightbulb, BookOpen, Users, Tags, BookText } from "lucide-react"
import { ROUTES } from "@/constants"

function SearchContent() {
  const searchParams = useSearchParams()
  const queryParam = searchParams.get("q") || ""
  const { query, results, isSearching, search, setQuery } = useSearchStore()

  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam)
      search(queryParam)
    }
  }, [queryParam])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    search(query)
  }

  const totalCount =
    results.wisePersons.length +
    results.works.length +
    results.books.length +
    results.questions.length +
    results.topics.length +
    results.authors.length +
    results.storyMatches.length

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">搜索</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <Input
          type="search"
          placeholder="搜索智者、著作、问题、主题..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isSearching}>
          <Search className="h-4 w-4 mr-1" />
          搜索
        </Button>
      </form>

      {query && !isSearching && (
        <div>
          {totalCount === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">未找到相关内容</p>
              <p className="text-xs text-muted-foreground/60 mt-1">尝试其他关键词</p>
            </div>
          ) : (
            <>
              {/* 搜索结果统计 */}
              <p className="text-sm text-muted-foreground mb-6">
                找到 {totalCount} 条结果
                {results.storyMatches.length > 0 && ` · 人物故事 ${results.storyMatches.length}`}
                {results.wisePersons.length > 0 && ` · 智者 ${results.wisePersons.length}`}
                {results.works.length > 0 && ` · 著作 ${results.works.length}`}
                {results.books.length > 0 && ` · 书籍 ${results.books.length}`}
                {results.questions.length > 0 && ` · 问题 ${results.questions.length}`}
                {results.topics.length > 0 && ` · 主题 ${results.topics.length}`}
                {results.authors.length > 0 && ` · 作者 ${results.authors.length}`}
              </p>

              {/* 智者 */}
              {results.wisePersons.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    智者 ({results.wisePersons.length})
                  </h2>
                  <WisePersonGrid wisePersons={results.wisePersons} />
                </section>
              )}

              {/* 人物故事 */}
              {results.storyMatches.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookText className="h-4 w-4 text-primary" />
                    人物故事 ({results.storyMatches.length})
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    {results.storyMatches.map((story) => (
                      <Link
                        key={story.slug}
                        href={ROUTES.wisePersonDetail(story.slug)}
                        className="block p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-medium text-sm mb-1">{story.name}</h3>
                        <p className="text-xs text-muted-foreground/80 leading-relaxed line-clamp-3">
                          {story.excerpt}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* 著作 */}
              {results.works.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    著作 ({results.works.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {results.works.map((work) => (
                      <WorkCard key={work.id} work={work} />
                    ))}
                  </div>
                </section>
              )}

              {/* 十大问题 */}
              {results.questions.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    十大问题 ({results.questions.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {results.questions.map((q) => (
                      <Link
                        key={q.id}
                        href={ROUTES.questionDetail(q.code)}
                        className="block p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                      >
                        <div className="text-xs text-muted-foreground mb-1">
                          {q.code}
                        </div>
                        <h3 className="font-medium text-sm mb-1">{q.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {q.subtitle || q.summary}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* 主题 */}
              {results.topics.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Tags className="h-4 w-4 text-primary" />
                    主题 ({results.topics.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {results.topics.map((topic) => (
                      <Link
                        key={topic.code}
                        href={ROUTES.topicDetail(topic.code)}
                        className="block p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                      >
                        <div className="text-xs text-muted-foreground mb-1">
                          {topic.code}
                        </div>
                        <h3 className="font-medium text-sm mb-1">{topic.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {topic.coreField}
                        </p>
                        <p className="text-xs text-muted-foreground/60 line-clamp-1 mt-0.5">
                          {topic.representativeDiscipline}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* 通识千书包 */}
              {results.books.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    通识千书包 ({results.books.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {results.books.slice(0, 30).map((book) => (
                      <BookCard key={book.slug} book={book} />
                    ))}
                  </div>
                  {results.books.length > 30 && (
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      显示前 30 条，共 {results.books.length} 条结果
                    </p>
                  )}
                </section>
              )}

              {/* 作者 */}
              {results.authors.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    作者 ({results.authors.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {results.authors.map((author) => (
                      <Link
                        key={author.slug}
                        href={ROUTES.wisePersonDetail(author.slug)}
                        className="block p-3 rounded-lg border bg-card hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-medium text-sm">{author.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          相关著作 {author.bookSlugs.length} 部
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      )}

      {!query && (
        <div className="text-center py-16 text-sm text-muted-foreground">
          输入关键词搜索智者、著作、问题、主题等内容
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  )
}
