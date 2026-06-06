import Link from "next/link"
import type { Work } from "@/types"
import { ROUTES } from "@/constants"
import { Card, CardContent } from "@/components/ui/card"

interface WorkCardProps {
  work: Work
  showRecommendation?: boolean
}

export function WorkCard({ work, showRecommendation = true }: WorkCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-sm">{work.title}</h4>
            <p className="text-xs text-muted-foreground">{work.authorName}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{work.summary}</p>
        {showRecommendation && work.recommendation && (
          <p className="text-xs text-accent/80 mt-2 italic line-clamp-1">
            " {work.recommendation}"
          </p>
        )}
      </CardContent>
    </Card>
  )
}
