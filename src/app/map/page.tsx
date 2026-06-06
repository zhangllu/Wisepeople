import { getWisePersonsByQuestion, getAllQuestions } from "@/lib/data"
import { MapPageClient } from "@/components/map/MapPageClient"

export const metadata = {
  title: "知识地图 - 智者网",
  description: "以天圆地方的空间结构，探索十大问题与617位智者的知识版图。点击问题区域，深入探索对应的智者与著作。",
}

export default function MapPage() {
  const wisePersonsByQuestion = getWisePersonsByQuestion()
  const questions = getAllQuestions()

  return (
    <MapPageClient
      wisePersonsByQuestion={wisePersonsByQuestion}
      questions={questions}
    />
  )
}
