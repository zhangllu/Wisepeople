"use client"

import { useState } from "react"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { BookmarkButton } from "@/components/shared/BookmarkButton"
import type { WisePerson } from "@/types"
import topicsData from "@/data/topics.json"
import type { SubTopic } from "@/types"
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

const topicByCode = new Map<string, SubTopic>()
for (const t of topics) topicByCode.set(t.code, t)

/** Parse "English Name（中文名）" or just name */
function parseName(wp: WisePerson) {
  const m = wp.name.match(/^(.+?)\s*[（(](.+?)[）)]$/)
  if (m) return { chinese: m[2], english: m[1] }
  return { chinese: wp.name, english: wp.nameEn }
}


export function WisePersonStubDetail({ person, books }: Props) {
  const [imgError, setImgError] = useState(false)
  const { chinese, english } = parseName(person)

  // Show each sub-topic as a separate tag with its title
  const topicEntries = (person.topicCodes || [])
    .map((code) => {
      const topic = topicByCode.get(code)
      if (!topic) return null
      return { code, topic }
    })
    .filter((e): e is NonNullable<typeof e> => !!e)

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
        {/* Portrait — 200×280, book-like shadow */}
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
          {/* Name */}
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

          {/* Topic tags — show each sub-topic title */}
          {topicEntries.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {topicEntries.map(({ code, topic }, i) => (
                <Link
                  key={code}
                  href={`/topics/${code}`}
                  className="text-[11.5px] px-3.5 py-1 rounded-md transition-colors border"
                  style={
                    i === 0
                      ? { background: "rgba(196,116,40,0.1)", color: "#9a6b35", borderColor: "rgba(196,116,40,0.15)" }
                      : { background: "#efe8de", color: "#8a7a68", borderColor: "#e4dbd0" }
                  }
                >
                  {topic.title}
                </Link>
              ))}
            </div>
          )}

          {/* Bookmark */}
          <div className="mt-5">
            <BookmarkButton targetId={person.slug} targetType="wise-person" />
          </div>
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
