"use client"

import Link from "next/link"
import { ExternalLink, BookOpen, ArrowLeft } from "lucide-react"
import { BookmarkButton } from "@/components/shared/BookmarkButton"
import type { WisePerson } from "@/types"
import topicsData from "@/data/topics.json"
import questionsData from "@/data/questions.json"
import type { SubTopic, Question } from "@/types"
import lifeStories from "@/data/links/life-stories.json"
import wisePersonCodes from "@/data/wise-person-codes.json"

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

const questionByNumber = new Map<number, Question>()
for (const q of questions) questionByNumber.set(q.number, q)

function getQuestionNumber(topicCode: string): number | null {
  const n = parseInt(topicCode.split(".")[0])
  return n >= 1 && n <= 10 ? n : null
}

export function WisePersonStubDetail({ person, books }: Props) {
  const topicEntries = (person.topicCodes || [])
    .map((code) => {
      const topic = topicByCode.get(code)
      if (!topic) return null
      const qn = getQuestionNumber(code)
      const question = qn ? questionByNumber.get(qn) : null
      return { topic, questionNumber: qn, question }
    })
    .filter((e): e is NonNullable<typeof e> => !!e)

  const storyMap = lifeStories as any
  const lifeStory: string | undefined = storyMap[person.slug]
  const code: string | undefined = (wisePersonCodes as any).slugToCode?.[person.slug]

  /** Simple markdown render: handle **bold** and line breaks */
  function renderStory(text: string) {
    const paragraphs = text.split("\n\n")
    return paragraphs.map((p, i) => {
      const html = p.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      return (
        <p key={i} className="leading-relaxed text-foreground/85" dangerouslySetInnerHTML={{ __html: html }} />
      )
    })
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:py-12">
      {/* Hero Header */}
      <div className="mb-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-5">
            {/* Portrait */}
            {person.portrait && (
              <img
                src={person.portrait}
                alt={person.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-border shadow-sm shrink-0"
              />
            )}
            <div>
              {/* Code */}
              {code && (
                <span className="font-mono text-[11px] tracking-wider text-accent bg-accent/8 px-2 py-0.5 rounded-full border border-accent/15 inline-block mb-2">
                  {code}
                </span>
              )}
              {/* Name */}
              <h1 className="text-3xl sm:text-4xl font-bold font-heading tracking-tight text-foreground leading-tight">
                {person.name}
              </h1>
            </div>
          </div>
          <BookmarkButton targetId={person.slug} targetType="wise-person" />
        </div>
      </div>

      {/* Life Story — always present */}
      {lifeStory && (
        <div className="mb-10">
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            <div className="prose prose-sm max-w-none space-y-3">
              {renderStory(lifeStory)}
            </div>
          </div>
        </div>
      )}

      {/* Topics & Questions */}
      {topicEntries.length > 0 && (
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            知识领域
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            {topicEntries.map(({ topic, questionNumber, question }) => (
              <div key={topic.code} className="flex items-center gap-1">
                {question && (
                  <Link
                    href={`/wise-persons/question/${questionNumber}`}
                    className="text-xs text-muted-foreground hover:text-accent transition-colors"
                  >
                    Q{questionNumber}
                  </Link>
                )}
                <span className="text-muted-foreground/40">·</span>
                <Link
                  href={`/topics/${topic.code}`}
                  className="text-sm bg-accent/8 text-accent px-3 py-1 rounded-full hover:bg-accent/15 transition-colors"
                >
                  {topic.title}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Books */}
      {books.length > 0 && (
        <div className="mb-10">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            <BookOpen className="h-4 w-4" />
            相关著作
          </h2>
          <div className="grid gap-3">
            {books.map((book) => (
              <div
                key={book.slug}
                className="rounded-xl border border-border bg-card p-4 hover:border-accent/20 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground">
                      {book.doubanLink ? (
                        <a href={book.doubanLink} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                          {book.title}
                        </a>
                      ) : book.title}
                    </h3>
                    {book.publisher && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {book.publisher}{book.year ? ` · ${book.year}` : ""}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <BookmarkButton targetId={book.slug} targetType="book" />
                    {book.doubanLink && (
                      <a
                        href={book.doubanLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-xs text-accent hover:text-accent/80 inline-flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        豆瓣
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* External Links */}
      {person.links && person.links.length > 0 && (
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            延伸阅读
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {person.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 hover:border-accent/30 hover:shadow-sm transition-all duration-200 group"
              >
                <div className="min-w-0">
                  <span className="font-medium text-sm text-foreground group-hover:text-accent transition-colors">
                    {link.label}
                  </span>
                  {link.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{link.description}</p>
                  )}
                </div>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 group-hover:text-accent transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Back link */}
      <div className="pt-6 border-t border-border">
        <Link
          href="/wise-persons"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          返回智者列表
        </Link>
      </div>
    </div>
  )
}
