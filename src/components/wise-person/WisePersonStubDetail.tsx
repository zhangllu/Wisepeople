"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { BookmarkButton } from "@/components/shared/BookmarkButton"
import type { WisePerson } from "@/types"
import topicsData from "@/data/topics.json"
import questionsData from "@/data/questions.json"
import booksData from "@/data/books.json"
import type { SubTopic, Question } from "@/types"
import { getAllWisePersons } from "@/lib/data/wise-persons-combined"
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

const allTopics: SubTopic[] = topicsData as SubTopic[]
const allQuestions: Question[] = questionsData as Question[]

const topicByCode = new Map<string, SubTopic>()
for (const t of allTopics) topicByCode.set(t.code, t)

const questionByNumber = new Map<number, Question>()
for (const q of allQuestions) questionByNumber.set(q.number, q)

/** Extract question number from a topic code like "10.2" → 10 */
function getQuestionNumber(topicCode: string): number | null {
  const n = parseInt(topicCode.split(".")[0])
  return n >= 1 && n <= 10 ? n : null
}

/** Parse "English Name（中文名）" or just name */
function parseName(wp: WisePerson) {
  const m = wp.name.match(/^(.+?)\s*[（(](.+?)[）)]$/)
  if (m) return { chinese: m[2], english: m[1] }
  return { chinese: wp.name, english: wp.nameEn }
}

/** Extract display name (Chinese preferred) */
function displayName(wp: WisePerson) {
  const { chinese } = parseName(wp)
  return chinese
}


export function WisePersonStubDetail({ person, books }: Props) {
  const [imgError, setImgError] = useState(false)
  const [expandedTopic, setExpandedTopic] = useState<string | null>(
    person.topicCodes?.[0] ?? null
  )
  const { chinese, english } = parseName(person)

  /** Toggle expandable panel */
  function toggleTopic(code: string) {
    setExpandedTopic((prev) => (prev === code ? null : code))
  }

  // Group person's topics by parent question
  const questionGroups = useMemo(() => {
    const groups = new Map<number, { question: Question; topics: { code: string; topic: SubTopic }[] }>()
    for (const code of person.topicCodes || []) {
      const topic = topicByCode.get(code)
      const qn = getQuestionNumber(code)
      if (!topic || !qn) continue
      if (!groups.has(qn)) {
        const question = questionByNumber.get(qn)
        if (!question) continue
        groups.set(qn, { question, topics: [] })
      }
      groups.get(qn)!.topics.push({ code, topic })
    }
    return Array.from(groups.values())
  }, [person.topicCodes])

  // Compute related wise persons and books for a given topic code
  function getRelatedData(topicCode: string) {
    const allWise = getAllWisePersons()
    const filteredPersons = allWise
      .filter((wp) => wp.slug !== person.slug && wp.topicCodes?.includes(topicCode))
    const relatedPersons = filteredPersons.slice(0, 6)
    const totalPersons = filteredPersons.length
    const allBooks = booksData as any[]
    const filteredBooks = allBooks
      .filter((b) => b.topicCode === topicCode)
    const relatedBooks = filteredBooks.slice(0, 6)
    const totalBooks = filteredBooks.length
    return { relatedPersons, relatedBooks, totalPersons, totalBooks }
  }

  const storyMap = lifeStories as any
  const lifeStory: string | undefined = storyMap[person.slug]
  const showPortrait = person.portrait && !imgError

  // Derive an introduction — use summary/personalIntroduction, not life story narrative
  const quote = person.summary
    || person.personalIntroduction?.slice(0, 80)
    || undefined

  /** Simple markdown render: handle **bold** and line breaks */
  function renderStory(text: string) {
    const paragraphs = text.split("\n\n")
    return paragraphs.map((p, i) => {
      const html = p.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      return (
        <p key={i} className="leading-[2] text-[15px]" dangerouslySetInnerHTML={{ __html: html }} />
      )
    })
  }

  return (
    <div className="min-h-screen" style={{ background: "#f8f3ec" }}>

      {/* ─── Hero: portrait (left) + intro (right) ─── */}
      <header
        className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-8 sm:gap-10 px-6 sm:px-10 pt-10 sm:pt-14 pb-8 sm:pb-10"
        style={{ background: "linear-gradient(180deg, #f8f3ec 0%, #faf6f0 100%)" }}
      >
        {/* Portrait */}
        <div className="shrink-0 flex justify-center sm:justify-start">
          {showPortrait ? (
            <img
              src={person.portrait}
              alt={chinese}
              onError={() => setImgError(true)}
              className="w-[180px] sm:w-[200px] h-[252px] sm:h-[280px] rounded-lg object-cover object-top"
              style={{ boxShadow: "4px 6px 24px rgba(60,40,15,0.15)" }}
            />
          ) : (
            <div
              className="w-[180px] sm:w-[200px] h-[252px] sm:h-[280px] rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #f0e6d6, #e8dcc8)", boxShadow: "4px 6px 24px rgba(60,40,15,0.15)" }}
            >
              <span className="text-5xl font-heading font-bold" style={{ color: "#c4a882" }}>
                {chinese.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Intro */}
        <div className="flex-1 flex flex-col justify-start sm:pt-2 min-w-0">
          {/* Name row with bookmark top-right */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1
                className="text-[32px] sm:text-[36px] font-bold font-heading leading-tight"
                style={{ color: "#1e1a14", letterSpacing: "2px" }}
              >
                {chinese}
              </h1>
              {english && english !== chinese && (
                <p className="text-sm font-heading mt-1.5" style={{ color: "#a89480", letterSpacing: "1px" }}>
                  {english}
                </p>
              )}
            </div>
            <div className="shrink-0 pt-1">
              <BookmarkButton targetId={person.slug} targetType="wise-person" />
            </div>
          </div>

          {/* Decorative quote */}
          {quote && (
            <div className="relative mt-5 pl-5 italic font-heading text-[14.5px] leading-[2]" style={{ color: "#6b5d4f" }}>
              <span
                className="absolute -left-0.5 -top-4 text-[48px] leading-none select-none pointer-events-none"
                style={{ color: "#d4b88a", fontFamily: "Georgia, serif" }}
              >
                &ldquo;
              </span>
              {quote}
            </div>
          )}

          {/* ─── B2 Breadcrumb Tags with expandable panels ─── */}
          {questionGroups.map(({ question, topics: topicList }) => (
            <div key={question.number} className="mt-5">
              {/* Breadcrumb row */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-heading text-[13px] font-semibold" style={{ color: "#9a6b35" }}>
                  {question.title}
                </span>
                <span style={{ color: "#c4b8a6", fontSize: "12px" }}>›</span>
                {topicList.map(({ code, topic }) => (
                  <button
                    key={code}
                    onClick={() => toggleTopic(code)}
                    className="text-[12px] px-3 py-1 rounded-full transition-all border"
                    style={
                      expandedTopic === code
                        ? { background: "rgba(196,116,40,0.2)", color: "#9a6b35", fontWeight: 600, borderColor: "rgba(196,116,40,0.25)" }
                        : { background: "rgba(196,116,40,0.08)", color: "#9a6b35", borderColor: "rgba(196,116,40,0.12)" }
                    }
                  >
                    {topic.title}
                  </button>
                ))}
              </div>

              {/* Expandable panel for the active topic */}
              {expandedTopic && topicList.some((t) => t.code === expandedTopic) && (
                <TopicPanel
                  topicCode={expandedTopic}
                  personSlug={person.slug}
                  getRelatedData={getRelatedData}
                />
              )}
            </div>
          ))}

        </div>
      </header>

      {/* ─── Body content ─── */}
      <div className="max-w-4xl mx-auto px-6 sm:px-10 pb-12" style={{ background: "#faf6f0" }}>

        {/* Life Story */}
        {lifeStory && (
          <section className="pt-2">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-sm font-semibold font-heading tracking-wide" style={{ color: "#8a6838" }}>
                人物故事
              </h2>
            </div>
            <div className="space-y-4 font-heading" style={{ color: "#3d3428" }}>
              {renderStory(lifeStory)}
            </div>
          </section>
        )}

        {/* No story fallback */}
        {!lifeStory && (
          <section className="pt-2">
            <div className="rounded-lg border border-dashed py-14 text-center" style={{ borderColor: "#e4dbd0" }}>
              <p className="text-sm font-heading" style={{ color: "#b0a08e" }}>人物故事正在编撰中</p>
            </div>
          </section>
        )}

        {/* Divider */}
        {lifeStory && books.length > 0 && (
          <div className="my-8 h-px" style={{ background: "linear-gradient(90deg, #d8caba 0%, transparent 80%)" }} />
        )}

        {/* Books */}
        {books.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-sm font-semibold font-heading tracking-wide" style={{ color: "#8a7a68" }}>
                相关著作
              </h2>
              <span
                className="text-[10px] px-2 py-0.5 rounded"
                style={{ background: "#efe3d2", color: "#8a6838" }}
              >
                {books.length}
              </span>
            </div>
            <div className="space-y-2.5">
              {books.map((book) => (
                <div
                  key={book.slug}
                  className="rounded-lg border px-4 py-3.5 transition-all duration-200 hover:shadow-sm"
                  style={{ borderColor: "#e4dbd0", background: "#f5efe7" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#c4a882")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e4dbd0")}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-medium text-[15px] font-heading" style={{ color: "#2c2216" }}>
                        {book.doubanLink ? (
                          <a
                            href={book.doubanLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors"
                            style={{ color: "inherit" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#8a6838")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#2c2216")}
                          >
                            {book.title}
                          </a>
                        ) : (
                          book.title
                        )}
                      </h3>
                      {book.publisher && (
                        <p className="text-xs mt-0.5" style={{ color: "#b0a08e" }}>
                          {book.publisher}{book.year ? ` · ${book.year}` : ""}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <BookmarkButton targetId={book.slug} targetType="book" />
                      {book.doubanLink && (
                        <a
                          href={book.doubanLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs inline-flex items-center gap-0.5 transition-colors"
                          style={{ color: "#8a6838" }}
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
          </section>
        )}

        {/* Divider */}
        {person.links && person.links.length > 0 && (
          <div className="my-8 h-px" style={{ background: "linear-gradient(90deg, #d8caba 0%, transparent 80%)" }} />
        )}

        {/* External Links */}
        {person.links && person.links.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-sm font-semibold font-heading tracking-wide" style={{ color: "#8a7a68" }}>
                延伸阅读
              </h2>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {person.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-lg border px-4 py-3 transition-all duration-200 group"
                  style={{ borderColor: "#e4dbd0", background: "#f5efe7", color: "#5a4d3e" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#c4a882")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e4dbd0")}
                >
                  <div className="min-w-0">
                    <span className="font-medium text-sm transition-colors group-hover:text-accent">
                      {link.label}
                    </span>
                    {link.description && (
                      <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "#b0a08e" }}>
                        {link.description}
                      </p>
                    )}
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 transition-colors" style={{ color: "#c4b8a6" }} />
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

/* ─── Inline Topic Panel Sub-component ─── */
function TopicPanel({
  topicCode,
  personSlug,
  getRelatedData,
}: {
  topicCode: string
  personSlug: string
  getRelatedData: (code: string) => {
    relatedPersons: WisePerson[]
    relatedBooks: any[]
    totalPersons: number
    totalBooks: number
  }
}) {
  const { relatedPersons, relatedBooks, totalPersons, totalBooks } = getRelatedData(topicCode)

  if (relatedPersons.length === 0 && relatedBooks.length === 0) return null

  return (
    <div
      className="mt-3 p-3.5 rounded-xl flex flex-col sm:flex-row flex-wrap gap-5"
      style={{ background: "rgba(255,255,255,0.45)", border: "1px solid #e4dbd0" }}
    >
      {/* Related wise persons */}
      {relatedPersons.length > 0 && (
        <div className="flex-1 min-w-0">
          <div className="text-[10px] mb-2 tracking-wider" style={{ color: "#b0a08e" }}>
            相关智者
          </div>
          <div className="flex flex-wrap gap-1.5">
            {relatedPersons.map((wp) => (
              <Link
                key={wp.slug}
                href={`/wise-persons/${wp.slug}`}
                className="text-[11px] px-2 py-0.5 rounded transition-all"
                style={{ color: "#6b5d4f", background: "#f5efe7", border: "1px solid #e8dfd4" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#efe8de"
                  e.currentTarget.style.borderColor = "#d4c8b8"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f5efe7"
                  e.currentTarget.style.borderColor = "#e8dfd4"
                }}
              >
                {displayName(wp)}
              </Link>
            ))}
            {totalPersons > 6 && (
              <Link
                href={`/topics/${topicCode}#wise-persons`}
                className="text-[11px] px-2 py-0.5 rounded transition-all"
                style={{ color: "#9a6b35", background: "transparent" }}
              >
                更多 {totalPersons} →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Related books */}
      {relatedBooks.length > 0 && (
        <div className="flex-1 min-w-0">
          <div className="text-[10px] mb-2 tracking-wider" style={{ color: "#b0a08e" }}>
            相关书籍
          </div>
          <div className="flex flex-wrap gap-1.5">
            {relatedBooks.map((book: any, i: number) => (
              <Link
                key={book.slug || i}
                href={`/topics/${topicCode}#books`}
                className="text-[11px] px-2 py-0.5 rounded transition-all"
                style={{ color: "#6b5d4f", background: "#f5efe7", border: "1px solid #e8dfd4" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#efe8de"
                  e.currentTarget.style.borderColor = "#d4c8b8"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f5efe7"
                  e.currentTarget.style.borderColor = "#e8dfd4"
                }}
              >
                {book.title}
              </Link>
            ))}
            {totalBooks > 6 && (
              <Link
                href={`/topics/${topicCode}#books`}
                className="text-[11px] px-2 py-0.5 rounded transition-all"
                style={{ color: "#9a6b35", background: "transparent" }}
              >
                更多 {totalBooks} →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Bottom link to full topic page */}
      <div className="w-full flex justify-end mt-1">
        <Link
          href={`/topics/${topicCode}`}
          className="text-[11px] inline-flex items-center gap-0.5 transition-colors"
          style={{ color: "#b0a08e" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#9a6b35")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#b0a08e")}
        >
          查看全部 →
        </Link>
      </div>
    </div>
  )
}
