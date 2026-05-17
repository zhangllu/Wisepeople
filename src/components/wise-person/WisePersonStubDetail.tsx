"use client"

import Link from "next/link"
import { ExternalLink, BookOpen, Library, Tags, Quote } from "lucide-react"
import type { WisePerson } from "@/types"
import { DISCIPLINE_LABELS, ERA_LABELS, REGION_LABELS } from "@/constants"
import { Badge } from "@/components/ui/badge"
import topicsData from "@/data/topics.json"
import questionsData from "@/data/questions.json"
import type { SubTopic, Question } from "@/types"
import lifeStories from "@/data/links/life-stories.json"

interface StubBook {
  slug: string
  title: string
  year: number | null
  publisher: string
  doubanLink: string
}

interface Props {
  person: WisePerson
  books: StubBook[]
}

const topics: SubTopic[] = topicsData as SubTopic[]
const questions: Question[] = questionsData as Question[]

const topicByCode = new Map<string, SubTopic>()
for (const t of topics) topicByCode.set(t.code, t)

function getQuestionNumber(topicCode: string): number | null {
  const n = parseInt(topicCode.split(".")[0])
  return n >= 1 && n <= 10 ? n : null
}

export function WisePersonStubDetail({ person, books }: Props) {
  const topicNames = (person.topicCodes || [])
    .map((code) => topicByCode.get(code))
    .filter((t): t is SubTopic => !!t)

  const questionNumbers = new Set<number>()
  for (const code of person.topicCodes || []) {
    const qn = getQuestionNumber(code)
    if (qn !== null) questionNumbers.add(qn)
  }

  const storyMap = lifeStories as any
  const lifeStory: string | undefined = storyMap[person.slug]

  /** Simple markdown render: handle **bold** and line breaks */
  function renderStory(text: string) {
    const paragraphs = text.split("\n\n")
    return paragraphs.map((p, i) => {
      // Convert **bold** to <strong>
      const html = p.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      return (
        <p key={i} className="leading-relaxed text-gray-700" dangerouslySetInnerHTML={{ __html: html }} />
      )
    })
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">{person.name}</h1>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="secondary" className="text-xs">
            {ERA_LABELS[person.era] || "当代"}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {DISCIPLINE_LABELS[person.discipline] || "哲学"}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {REGION_LABELS[person.region] || "西方"}
          </Badge>
          {person.bookSlugs && person.bookSlugs.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {person.bookSlugs.length} 本著作
            </Badge>
          )}
          {(!person.links || person.links.length === 0) && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              待完善
            </Badge>
          )}
        </div>

        {/* Topics */}
        {topicNames.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <Tags className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {topicNames.map((t) => {
              const qn = getQuestionNumber(t.code)
              return (
                <Link
                  key={t.code}
                  href={`/topics/${t.code}`}
                  className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full hover:bg-blue-100 transition-colors"
                >
                  {qn ? `Q${qn} · ` : ""}{t.title}
                </Link>
              )
            })}
          </div>
        )}

        {/* Question context */}
        {questionNumbers.size > 0 && (
          <div className="mt-3 text-sm text-muted-foreground">
            属于
            {[...questionNumbers].sort().map((qn) => {
              const q = questions.find((q) => q.number === qn)
              return q ? (
                <Link
                  key={qn}
                  href={`/wise-persons/question/${qn}`}
                  className="text-blue-600 hover:text-blue-800 mx-1"
                >
                  「{q.title}」
                </Link>
              ) : null
            })}
            大问题
          </div>
        )}
      </div>

      {/* 人物故事 / Notice */}
      {lifeStory ? (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Quote className="h-4 w-4 text-blue-500" />
            <h2 className="text-lg font-semibold">人物故事</h2>
          </div>
          <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/30 p-6 md:p-8">
            <div className="prose prose-sm max-w-none prose-blue">
              {renderStory(lifeStory)}
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          此智者的详细介绍尚未完善。当前仅展示基本信息和相关著作。
        </div>
      )}

      {/* Source links */}
      {(person.links?.length || person.wikipediaLink) && (
        <div className="mb-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <ExternalLink className="h-4 w-4" />
            相关链接
          </h2>
          <div className="space-y-3">
            {(person.links?.length ? person.links : [{ label: "维基百科", url: person.wikipediaLink!, description: "完整的生平与核心思想介绍" }]).map(
              (link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault()
                    window.open(link.url, "_blank", "noopener,noreferrer")
                  }}
                  className="block rounded-lg border border-gray-200 p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-colors group cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-medium text-blue-700 group-hover:text-blue-800 text-sm">
                        {link.label}
                      </span>
                      {link.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{link.description}</p>
                      )}
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-blue-500 mt-0.5" />
                  </div>
                </a>
              )
            )}
          </div>
        </div>
      )}

      {/* Books */}
      {books.length > 0 && (
        <div className="mb-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <BookOpen className="h-4 w-4" />
            相关著作（{books.length}）
          </h2>
          <div className="grid gap-3">
            {books.map((book) => (
              <div
                key={book.slug}
                className="rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{book.title}</h3>
                    {book.publisher && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {book.publisher}{book.year ? ` · ${book.year}` : ""}
                      </p>
                    )}
                  </div>
                  {book.doubanLink && (
                    <a
                      href={book.doubanLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-xs text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      豆瓣
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Back link */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <Link
          href="/wise-persons"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          ← 返回智者列表
        </Link>
      </div>
    </div>
  )
}
