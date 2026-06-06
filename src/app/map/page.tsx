import { getWisePersonsByQuestion, getAllQuestions } from "@/lib/data"
import { KnowledgeMap } from "@/components/map/KnowledgeMap"

export const metadata = {
  title: "知识地图 - 智者网",
  description: "以天圆地方的空间结构，探索十大问题与617位智者的知识版图。",
}

export default function MapPage() {
  const wisePersonsByQuestion = getWisePersonsByQuestion()
  const questions = getAllQuestions()

  return (
    <div className="min-h-screen">
      <KnowledgeMap wisePersonsByQuestion={wisePersonsByQuestion} questions={questions} />
    </div>
  )
}
