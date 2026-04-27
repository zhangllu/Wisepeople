import type { Book } from "@/types"
import { BookCard } from "./BookCard"

interface BookGridProps {
  books: Book[]
}

export function BookGrid({ books }: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">该主题下暂未收录著作</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {books.map((book) => (
        <BookCard key={book.slug} book={book} />
      ))}
    </div>
  )
}
