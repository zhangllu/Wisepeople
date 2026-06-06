import Link from "next/link"
import type { Question } from "@/types"
import { DIMENSION_LABELS, ROUTES } from "@/constants"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface QuestionCardProps {
  question: Question
}

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <Link href={ROUTES.questionDetail(question.id)}>
      <Card className="transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-muted-foreground">Q{String(question.number).padStart(2, "0")}</span>
            <Badge variant="secondary" className="text-[10px]">
              {DIMENSION_LABELS[question.dimension]}
            </Badge>
          </div>
          <h3 className="font-semibold text-sm mb-2">{question.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">{question.subtitle}</p>
          <p className="text-xs text-accent/70 mt-3">
            {question.subTopicCodes.length} 个主题方向
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
