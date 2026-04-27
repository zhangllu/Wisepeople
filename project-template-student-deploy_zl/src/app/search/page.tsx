"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { useSearchStore, useWisePersonStore } from "@/lib/stores"
import { WisePersonGrid } from "@/components/wise-person/WisePersonGrid"
import { WorkCard } from "@/components/work/WorkCard"
import { BookCard } from "@/components/book/BookCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

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

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">搜索</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <Input
          type="search"
          placeholder="搜索智者或著作..."
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
          {results.wisePersons.length === 0 && results.works.length === 0 && results.books.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">未找到相关内容</p>
              <p className="text-xs text-muted-foreground/60 mt-1">尝试其他关键词</p>
            </div>
          ) : (
            <>
              {results.wisePersons.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">
                    智者 ({results.wisePersons.length})
                  </h2>
                  <WisePersonGrid wisePersons={results.wisePersons} />
                </section>
              )}
              {results.works.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">
                    著作 ({results.works.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {results.works.map((work) => (
                      <WorkCard key={work.id} work={work} />
                    ))}
                  </div>
                </section>
              )}
              {results.books.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">
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
            </>
          )}
        </div>
      )}

      {!query && (
        <div className="text-center py-16 text-sm text-muted-foreground">
          输入关键词搜索智者和著作
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
