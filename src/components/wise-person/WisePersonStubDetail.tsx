import Link from "next/link"
import { ExternalLink, BookOpen } from "lucide-react"
import type { WisePerson } from "@/types"

interface StubBook {
  slug: string
  title: string
  year: number | null
  publisher: string
  doubanLink: string
}

interface Props {
  person: WisePerson
  books: StubBook[]
}

export function WisePersonStubDetail({ person, books }: Props) {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">{person.name}</h1>
          {person.wikipediaLink && (
            <a
              href={person.wikipediaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1"
            >
              <ExternalLink className="h-3 w-3" />
              资料来源：维基百科
            </a>
          )}
        </div>
      </div>

      {/* Notice */}
      <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        此智者的详细介绍尚未完善。当前仅展示基本信息。
      </div>

      {/* Books */}
      {books.length > 0 && (
        <div className="mb-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <BookOpen className="h-4 w-4" />
            相关著作（{books.length}）
          </h2>
          <div className="grid gap-3">
            {books.map((book) => (
              <div
                key={book.slug}
                className="rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{book.title}</h3>
                    {book.publisher && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {book.publisher}{book.year ? ` · ${book.year}` : ""}
                      </p>
                    )}
                  </div>
                  {book.doubanLink && (
                    <a
                      href={book.doubanLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-xs text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      豆瓣
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Back link */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <Link
          href="/wise-persons"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          ← 返回智者列表
        </Link>
      </div>
    </div>
  )
}
