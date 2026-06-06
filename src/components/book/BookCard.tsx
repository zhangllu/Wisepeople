import Link from "next/link"
import type { Book } from "@/types"
import { Card, CardContent } from "@/components/ui/card"

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-sm leading-snug">{book.title}</h3>
          <p className="text-xs text-muted-foreground">{book.author}</p>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1">
            {book.year && <span>{book.year}</span>}
            {book.publisher && (
              <>
                <span className="text-border">|</span>
                <span className="truncate">{book.publisher}</span>
              </>
            )}
          </div>
          {book.tags && (
            <span className="text-[10px] text-accent/60 mt-0.5">{book.tags}</span>
          )}
          {book.doubanLink && (
            <a
              href={book.doubanLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-accent hover:underline mt-1 inline-block"
              onClick={(e) => e.stopPropagation()}
            >
              豆瓣详情 →
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
