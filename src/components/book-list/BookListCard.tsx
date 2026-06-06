import Link from "next/link"
import type { BookList } from "@/types"
import { ROUTES } from "@/constants"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const listTypeLabels: Record<string, string> = {
  minimum: "精选",
  theme: "主题",
  stage: "阶段",
}

export function BookListCard({ bookList }: { bookList: BookList }) {
  return (
    <Link href={ROUTES.bookListDetail(bookList.slug)}>
      <Card className="transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-[10px]">
              {listTypeLabels[bookList.type]}
            </Badge>
          </div>
          <h3 className="font-semibold text-sm mb-2">{bookList.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">{bookList.summary}</p>
          <p className="text-xs text-primary/70 mt-3">
            {bookList.workSlugs.length} 本著作
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
