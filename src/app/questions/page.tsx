import { QuestionCard } from "@/components/question/QuestionCard"
import { getAllQuestions } from "@/lib/data"
import { PageHero } from "@/components/shared/PageHero"
import { HelpCircle, Map } from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/constants"

export default function QuestionsPage() {
  const questions = getAllQuestions()

  return (
    <div>
      <PageHero
        title="十大问题导览"
        subtitle="「大问题」因为与每一个人的人生发展息息相关而「大」，因为成为人类文明历史基本命题而「大」。"
        description="点击问题卡片，进入对应的知识枢纽——探索智者与著作。也可以从知识地图进入。"
        accent={
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-accent" />
          </div>
        }
      />
      <div className="container mx-auto max-w-5xl px-4 py-8">
        {/* Map shortcut */}
        <div className="mb-6 flex items-center justify-end">
          <Link
            href={ROUTES.map}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            <Map className="w-3.5 h-3.5" />
            切换到知识地图视图 →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {questions.map((q) => (
            <QuestionCard key={q.code} question={q} />
          ))}
        </div>
      </div>
    </div>
  )
}
