import type { PersonalizedBookList } from "@/data/personalized-booklists"
import { Card, CardContent } from "@/components/ui/card"

export function DoubanListCard({ list }: { list: PersonalizedBookList }) {
  return (
    <a href={list.url} target="_blank" rel="noopener noreferrer">
      <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 h-full">
        <CardContent className="p-5">
          <h3 className="font-semibold text-sm mb-2">{list.title}</h3>
          {list.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{list.description}</p>
          )}
          <p className="text-xs text-primary/70 mt-3">豆瓣豆列 →</p>
        </CardContent>
      </Card>
    </a>
  )
}
