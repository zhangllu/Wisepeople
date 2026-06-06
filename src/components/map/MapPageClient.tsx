"use client"

import { useState, useMemo, useRef, useCallback, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import type { Question, Book } from "@/types"
import { KnowledgeMap } from "./KnowledgeMap"
import { QuestionHubContent } from "./QuestionHubContent"
import {
  getQuestionByNumber,
  getTopicsByQuestion,
  getWisePersonsByTopicInQuestion,
  getBooksByTopic,
} from "@/lib/data"

interface QuestionGroup {
  question: Question
  wisePersons: import("@/types").WisePerson[]
}

interface MapPageClientProps {
  wisePersonsByQuestion: QuestionGroup[]
  questions: Question[]
}

/** Parse ?q=N from URL, returns null if absent or invalid */
function parseInitialQuestion(searchParams: URLSearchParams): number | null {
  const raw = searchParams.get("q")
  if (!raw) return null
  const n = parseInt(raw, 10)
  if (isNaN(n) || n < 1 || n > 10) return null
  return n
}

export function MapPageClient({ wisePersonsByQuestion, questions }: MapPageClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(
    () => parseInitialQuestion(searchParams)
  )
  const contentRef = useRef<HTMLDivElement>(null)

  // Sync URL when selected question changes
  useEffect(() => {
    const currentQ = parseInitialQuestion(searchParams)
    if (selectedQuestion !== currentQ) {
      const params = new URLSearchParams(searchParams.toString())
      if (selectedQuestion !== null) {
        params.set("q", String(selectedQuestion))
      } else {
        params.delete("q")
      }
      const qs = params.toString()
      router.replace(qs ? `/map?${qs}` : "/map", { scroll: false })
    }
  }, [selectedQuestion, searchParams, router])

  // Listen for external URL changes (e.g. browser back/forward)
  useEffect(() => {
    const q = parseInitialQuestion(searchParams)
    setSelectedQuestion(q)
  }, [searchParams])

  const handleQuestionSelect = useCallback((qNum: number | null) => {
    setSelectedQuestion(qNum)
    // Smooth scroll to content area when selecting a question
    if (qNum !== null) {
      setTimeout(() => {
        contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }
  }, [])

  // Compute hub data for the selected question
  const hubData = useMemo(() => {
    if (!selectedQuestion) return null

    const question = getQuestionByNumber(selectedQuestion)
    if (!question) return null

    const topicsWithWisePersons = getWisePersonsByTopicInQuestion(selectedQuestion)
    const topics = getTopicsByQuestion(selectedQuestion)

    const booksByTopicMap: Record<string, Book[]> = {}
    for (const topic of topics) {
      booksByTopicMap[topic.code] = getBooksByTopic(topic.code)
    }

    return { question, topicsWithWisePersons, booksByTopic: booksByTopicMap }
  }, [selectedQuestion])

  return (
    <div className="min-h-screen">
      {/* Map section */}
      <div className="relative">
        <KnowledgeMap
          wisePersonsByQuestion={wisePersonsByQuestion}
          selectedQuestion={selectedQuestion}
          onQuestionSelect={handleQuestionSelect}
        />
      </div>

      {/* Content section — appears below the map when a question is selected */}
      <div ref={contentRef}>
        {hubData && (
          <div className="border-t border-border/50 bg-background">
            <QuestionHubContent
              question={hubData.question}
              topicsWithWisePersons={hubData.topicsWithWisePersons}
              booksByTopic={hubData.booksByTopic}
            />
          </div>
        )}
      </div>
    </div>
  )
}
