import { QuestionCard } from "@/components/question/QuestionCard"
import { getAllQuestions } from "@/lib/data"

export default function QuestionsPage() {
  const questions = getAllQuestions()

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">十大问题导览</h1>
        <p className="text-sm text-muted-foreground">
          从您关心的问题出发，找到相关的智者和著作
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {questions.map((q) => (
          <QuestionCard key={q.code} question={q} />
        ))}
      </div>
    </div>
  )
}
