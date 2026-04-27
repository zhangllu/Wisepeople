import type { Review } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const statusLabels: Record<string, string> = {
  draft: "草稿",
  pending_review: "审核中",
  approved: "已发布",
  rejected: "未通过",
}

const statusVariants: Record<string, "secondary" | "outline" | "default" | "destructive"> = {
  draft: "secondary",
  pending_review: "outline",
  approved: "default",
  rejected: "destructive",
}

interface ReviewCardProps {
  review: Review
  showWork?: boolean
}

export function ReviewCard({ review, showWork = true }: ReviewCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="text-sm font-medium">{review.title}</h4>
            {showWork && (
              <p className="text-xs text-muted-foreground">
                关于《{review.workTitle}》
              </p>
            )}
          </div>
          <Badge variant={statusVariants[review.status]} className="text-[10px]">
            {statusLabels[review.status]}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-3">{review.content}</p>
        <p className="text-[10px] text-muted-foreground/50 mt-2">
          {new Date(review.createdAt).toLocaleDateString("zh-CN")}
        </p>
      </CardContent>
    </Card>
  )
}
