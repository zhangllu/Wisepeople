"use client"

import { useState } from "react"
import type { Book } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { BookmarkButton } from "@/components/shared/BookmarkButton"
import { BookOpen } from "lucide-react"

interface BookCardProps {
  book: Book
  /** Compact mode for accordion rows */
  compact?: boolean
}

export function BookCard({ book, compact }: BookCardProps) {
  const [imgError, setImgError] = useState(false)
  const coverSrc = imgError ? null : `/images/covers/${book.slug}.jpg`

  if (compact) {
    return (
      <a
        href={book.doubanLink || "#"}
        target={book.doubanLink ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-4 py-2 pl-10 hover:bg-accent/5 transition-colors group"
      >
        {/* Cover thumbnail */}
        <div className="shrink-0 w-8 h-11 rounded-sm overflow-hidden bg-muted flex items-center justify-center">
          {coverSrc ? (
            <img
              src={coverSrc}
              alt={book.title}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <BookOpen className="w-3.5 h-3.5 text-muted-foreground/30" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-sm group-hover:text-accent transition-colors truncate block">
            {book.title}
          </span>
        </div>
        <span className="text-xs text-muted-foreground flex-shrink-0">
          {book.author}
        </span>
      </a>
    )
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-md overflow-hidden">
      <CardContent className="p-0">
        <div className="flex">
          {/* Cover image */}
          <div className="shrink-0 w-20 h-28 bg-muted flex items-center justify-center">
            {coverSrc ? (
              <img
                src={coverSrc}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <BookOpen className="w-6 h-6 text-muted-foreground/20" />
            )}
          </div>
          {/* Book info */}
          <div className="flex-1 min-w-0 p-3 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-sm leading-snug line-clamp-2">
                {book.doubanLink ? (
                  <a
                    href={book.doubanLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    {book.title}
                  </a>
                ) : (
                  book.title
                )}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">{book.author}</p>
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                {book.year && <span>{book.year}</span>}
                {book.publisher && (
                  <span className="truncate max-w-[120px]">{book.publisher}</span>
                )}
              </div>
              <BookmarkButton targetId={book.slug} targetType="book" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
