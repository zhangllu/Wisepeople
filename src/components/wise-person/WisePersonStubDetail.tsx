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
        </div>
      </div>

      {/* Notice */}
      <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        此智者的详细介绍尚未完善。当前仅展示基本信息。
      </div>

      {/* Source links */}
      {(person.links?.length || person.wikipediaLink) && (
        <div className="mb-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <ExternalLink className="h-4 w-4" />
            相关链接
          </h2>
          <div className="space-y-3">
            {(person.links?.length ? person.links : [{ label: "维基百科", url: person.wikipediaLink!, description: "完整的生平与核心思想介绍" }]).map(
              (link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault()
                    window.open(link.url, "_blank", "noopener,noreferrer")
                  }}
                  className="block rounded-lg border border-gray-200 p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-colors group cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-medium text-blue-700 group-hover:text-blue-800 text-sm">
                        {link.label}
                      </span>
                      {link.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{link.description}</p>
                      )}
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-blue-500 mt-0.5" />
                  </div>
                </a>
              )
            )}
          </div>
        </div>
      )}

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
