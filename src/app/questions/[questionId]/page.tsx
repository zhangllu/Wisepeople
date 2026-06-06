import { notFound } from "next/navigation"
import {
  getAllQuestions,
  getQuestionByCode,
  getQuestionByNumber,
  getTopicsByQuestion,
  getWisePersonsByTopicInQuestion,
  getBooksByTopic,
} from "@/lib/data"
import type { Book } from "@/types"
import { QuestionHub } from "@/components/map/QuestionHub"

interface Props {
  params: Promise<{ questionId: string }>
}

export async function generateStaticParams() {
  const questions = getAllQuestions()
  return questions.map((q) => ({ questionId: q.id }))
}

export default async function QuestionDetailPage({ params }: Props) {
  const { questionId } = await params
  const questions = getAllQuestions()

  // Support both "q-2" and "Q02" formats
  const question =
    getQuestionByCode(questionId) ||
    questions.find((q) => q.id === questionId) ||
    questions.find((q) => q.code === `Q${String(parseInt(questionId.replace("q-", ""))).padStart(2, "0")}`)

  if (!question) {
    notFound()
  }

  // Gather data for the hub
  const topicsWithWisePersons = getWisePersonsByTopicInQuestion(question.number)
  const topics = getTopicsByQuestion(question.number)

  const booksByTopicMap: Record<string, Book[]> = {}
  for (const topic of topics) {
    booksByTopicMap[topic.code] = getBooksByTopic(topic.code)
  }

  return (
    <QuestionHub
      question={question}
      topicsWithWisePersons={topicsWithWisePersons}
      booksByTopic={booksByTopicMap}
    />
  )
}
