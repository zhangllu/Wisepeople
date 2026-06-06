import { getWisePersonsByQuestion } from "@/lib/data"
import { KnowledgeMap } from "@/components/map/KnowledgeMap"

export const metadata = {
  title: "知识地图 - 智者网",
  description: "以天圆地方的空间结构，探索十大问题与智者的知识版图。点击问题区域，进入对应的知识枢纽页。",
}

export default function MapPage() {
  const wisePersonsByQuestion = getWisePersonsByQuestion()

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 sm:py-10">
      <header className="mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold font-heading mb-2">知识地图</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          天圆地方 —— 点击问题区域，探索对应的智者与著作
        </p>
      </header>
      <KnowledgeMap wisePersonsByQuestion={wisePersonsByQuestion} />
    </div>
  )
}
