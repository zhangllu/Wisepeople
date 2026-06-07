"use client"

import { useState } from "react"
import Link from "next/link"
import { ExternalLink, BookOpen, ArrowLeft, Users, Layers } from "lucide-react"
import { BookmarkButton } from "@/components/shared/BookmarkButton"
import type { WisePerson, Era } from "@/types"
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

const questionByNumber = new Map<number, Question>()
for (const q of questions) questionByNumber.set(q.number, q)

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

/** Era-based accent for portrait ring */
const ERA_RING: Record<Era | "default", string> = {
  ancient: "ring-amber-200/70",
  modern: "ring-sky-200/70",
  contemporary: "ring-emerald-200/70",
  default: "ring-gray-200/70",
}

export function WisePersonStubDetail({ person, books }: Props) {
  const [imgError, setImgError] = useState(false)
  const { chinese, english } = parseName(person)
  const ringColor = ERA_RING[person.era ?? "default"]

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
  const showPortrait = person.portrait && !imgError

  /** Simple markdown render: handle **bold** and line breaks */
  function renderStory(text: string) {
    const paragraphs = text.split("\n\n")
    return paragraphs.map((p, i) => {
      const html = p.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      return (
        <p key={i} className="leading-[1.9] text-foreground/85" dangerouslySetInnerHTML={{ __html: html }} />
      )
    })
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 sm:py-12">

      {/* ─── Hero: portrait + name + stats + tags ─── */}
      <header className="flex flex-col items-center text-center mb-10">
        {/* Portrait */}
        {showPortrait ? (
          <img
            src={person.portrait}
            alt={chinese}
            onError={() => setImgError(true)}
            className={`w-[108px] h-[108px] rounded-2xl object-cover object-top shadow-md ring-2 ${ringColor}`}
          />
        ) : (
          <div className={`w-[108px] h-[108px] rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 ring-2 ${ringColor} flex items-center justify-center shadow-md`}>
            <span className="text-3xl font-heading font-bold text-accent/60">
              {chinese.charAt(0)}
            </span>
          </div>
        )}

        {/* Name */}
        <h1 className="text-2xl sm:text-3xl font-bold font-heading mt-5 leading-tight">
          {chinese}
        </h1>
        {english && english !== chinese && (
          <p className="text-sm text-muted-foreground mt-1">{english}</p>
        )}

        {/* Bookmark */}
        <div className="mt-3">
          <BookmarkButton targetId={person.slug} targetType="wise-person" />
        </div>

        {/* Stats + Topics row */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
          {books.length > 0 && (
            <span className="text-xs bg-accent/8 text-accent px-3 py-1 rounded-full">
              {books.length} 本著作
            </span>
          )}
          {topicEntries.map(({ topic, questionNumber }) => (
            <Link
              key={topic.code}
              href={`/topics/${topic.code}`}
              className="text-xs bg-muted text-foreground/70 px-3 py-1 rounded-full hover:bg-accent/10 hover:text-accent transition-colors"
            >
              {topic.title}
            </Link>
          ))}
        </div>
      </header>

      {/* ─── Life Story ─── */}
      {lifeStory && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-accent tracking-wide">人物故事</h2>
          </div>
          <div className="space-y-3.5">
            {renderStory(lifeStory)}
          </div>
        </section>
      )}

      {/* No story fallback */}
      {!lifeStory && (
        <section className="mb-10">
          <div className="rounded-xl border border-dashed border-border/60 py-12 text-center">
            <p className="text-sm text-muted-foreground">人物故事正在编撰中</p>
          </div>
        </section>
      )}

      {/* ─── Books ─── */}
      {books.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4 pt-8 border-t border-border/40">
            <BookOpen className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-foreground/70 tracking-wide">相关著作</h2>
            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{books.length}</span>
          </div>
          <div className="space-y-2.5">
            {books.map((book) => (
              <div
                key={book.slug}
                className="rounded-xl border border-border/60 bg-card px-4 py-3.5 hover:border-accent/20 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-medium text-[15px] text-foreground">
                      {book.doubanLink ? (
                        <a href={book.doubanLink} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                          {book.title}
                        </a>
                      ) : book.title}
                    </h3>
                    {book.publisher && (
                      <p className="text-xs text-muted-foreground mt-0.5">
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
                        className="text-xs text-accent/70 hover:text-accent inline-flex items-center gap-0.5 transition-colors"
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

      {/* ─── External Links ─── */}
      {person.links && person.links.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4 pt-8 border-t border-border/40">
            <Layers className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-foreground/70 tracking-wide">延伸阅读</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {person.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 hover:border-accent/30 hover:shadow-sm transition-all duration-200 group"
              >
                <div className="min-w-0">
                  <span className="font-medium text-sm text-foreground group-hover:text-accent transition-colors">
                    {link.label}
                  </span>
                  {link.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{link.description}</p>
                  )}
                </div>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground/30 group-hover:text-accent transition-colors" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ─── Back link ─── */}
      <div className="pt-6 border-t border-border/40">
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
