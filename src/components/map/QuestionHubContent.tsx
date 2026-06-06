"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import type { Question, SubTopic, WisePerson, Book } from "@/types"
import { ROUTES, DIMENSION_LABELS } from "@/constants"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { BookCard } from "@/components/book/BookCard"
import { Users, BookOpen, ChevronRight, Layers } from "lucide-react"

interface TopicWisePersons {
  topic: SubTopic
  wisePersons: WisePerson[]
}

interface QuestionHubContentProps {
  question: Question
  topicsWithWisePersons: TopicWisePersons[]
  booksByTopic: Record<string, Book[]>
}

/** Compact wise person row used inside the hub */
function WisePersonRow({ person }: { person: WisePerson }) {
  const initial = person.name.charAt(0)
  return (
    <Link
      href={ROUTES.wisePersonDetail(person.slug)}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/70 transition-colors group"
    >
      <span className="shrink-0 size-8 rounded-full bg-accent/5 ring-1 ring-accent/10 group-hover:ring-accent/40 flex items-center justify-center text-xs font-heading font-semibold text-accent/60 group-hover:text-accent transition-all">
        {initial}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium group-hover:text-accent transition-colors truncate">
          {person.name}
        </p>
        {person.isStub ? (
          <p className="text-[11px] text-muted-foreground truncate">
            {person.bookSlugs?.length || 0} 本著作
          </p>
        ) : (
          <p className="text-[11px] text-muted-foreground truncate line-clamp-1">
            {person.summary}
          </p>
        )}
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-accent transition-colors shrink-0" />
    </Link>
  )
}

export function QuestionHubContent({
  question,
  topicsWithWisePersons,
  booksByTopic,
}: QuestionHubContentProps) {
  const [activeTopicIndex, setActiveTopicIndex] = useState(0)

  const activeTopicData = topicsWithWisePersons[activeTopicIndex]
  const activeTopic = activeTopicData?.topic
  const activeWisePersons = activeTopicData?.wisePersons ?? []
  const activeBooks = activeTopic ? (booksByTopic[activeTopic.code] ?? []) : []

  // Stats for this question
  const totalWisePersons = useMemo(
    () => topicsWithWisePersons.reduce((sum, t) => sum + t.wisePersons.length, 0),
    [topicsWithWisePersons]
  )
  const totalBooks = useMemo(
    () => Object.values(booksByTopic).reduce((sum, books) => sum + books.length, 0),
    [booksByTopic]
  )

  return (
    <div className="w-full">
      {/* Question header */}
      <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-muted-foreground">{question.code}</span>
            <Badge variant="secondary" className="text-[10px]">
              {DIMENSION_LABELS[question.dimension]}
            </Badge>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading mb-1">{question.title}</h2>
          <p className="text-sm text-muted-foreground">{question.subtitle}</p>

          {/* Stats row */}
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span>{totalWisePersons} 位智者</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{totalBooks} 本著作</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Layers className="w-3.5 h-3.5" />
              <span>{topicsWithWisePersons.length} 个主题方向</span>
            </div>
          </div>
        </div>
      </div>

      {/* Theme tabs */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {topicsWithWisePersons.map((tw, idx) => {
              const isActive = idx === activeTopicIndex
              const bookCount = booksByTopic[tw.topic.code]?.length ?? 0
              return (
                <button
                  key={tw.topic.code}
                  onClick={() => setActiveTopicIndex(idx)}
                  className={`
                    shrink-0 rounded-lg px-4 py-3 text-left transition-all duration-200 min-w-[140px]
                    ${isActive
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "bg-muted/50 hover:bg-muted text-foreground hover:shadow-sm"
                    }
                  `}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`text-[10px] font-mono ${isActive ? "text-accent-foreground/70" : "text-muted-foreground"}`}>
                      {tw.topic.code}
                    </span>
                  </div>
                  <p className={`text-sm font-medium ${isActive ? "" : ""}`}>{tw.topic.title}</p>
                  <div className={`flex items-center gap-2 mt-1 text-[11px] ${isActive ? "text-accent-foreground/70" : "text-muted-foreground"}`}>
                    <span>{tw.wisePersons.length} 人</span>
                    <span>·</span>
                    <span>{bookCount} 书</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content area: wise persons + books side by side */}
      {activeTopic && (
        <div className="px-4 sm:px-6 lg:px-8 pt-4 pb-8">
          <div className="max-w-6xl mx-auto">
            {/* Active topic meta */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">{activeTopic.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activeTopic.coreField} · {activeTopic.representativeDiscipline}
                </p>
              </div>
              <Link
                href={ROUTES.topicDetail(activeTopic.code)}
                className="text-xs text-accent hover:underline flex items-center gap-1 shrink-0"
              >
                主题详情 <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Wise persons column */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-accent" />
                    <h4 className="text-sm font-semibold">智者</h4>
                    <Badge variant="secondary" className="text-[10px]">
                      {activeWisePersons.length}
                    </Badge>
                  </div>
                  {activeWisePersons.length > 6 && (
                    <Link
                      href={ROUTES.topicDetail(activeTopic.code)}
                      className="text-[11px] text-accent hover:underline"
                    >
                      查看全部 →
                    </Link>
                  )}
                </div>

                {activeWisePersons.length > 0 ? (
                  <Card>
                    <CardContent className="p-1.5 space-y-0.5 max-h-[480px] overflow-y-auto">
                      {activeWisePersons.slice(0, 15).map((person) => (
                        <WisePersonRow key={person.id} person={person} />
                      ))}
                      {activeWisePersons.length > 15 && (
                        <Link
                          href={ROUTES.topicDetail(activeTopic.code)}
                          className="block text-center text-xs text-accent hover:underline py-2"
                        >
                          还有 {activeWisePersons.length - 15} 位智者 →
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-sm text-muted-foreground">该方向暂未收录智者</p>
                    </CardContent>
                  </Card>
                )}
              </section>

              {/* Books column */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-accent" />
                    <h4 className="text-sm font-semibold">著作</h4>
                    <Badge variant="secondary" className="text-[10px]">
                      {activeBooks.length}
                    </Badge>
                  </div>
                  {activeBooks.length > 6 && (
                    <Link
                      href={ROUTES.topicDetail(activeTopic.code)}
                      className="text-[11px] text-accent hover:underline"
                    >
                      查看全部 →
                    </Link>
                  )}
                </div>

                {activeBooks.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2 max-h-[480px] overflow-y-auto pr-1">
                    {activeBooks.slice(0, 12).map((book) => (
                      <BookCard key={book.slug} book={book} />
                    ))}
                    {activeBooks.length > 12 && (
                      <Link
                        href={ROUTES.topicDetail(activeTopic.code)}
                        className="block text-center text-xs text-accent hover:underline py-2"
                      >
                        还有 {activeBooks.length - 12} 本著作 →
                      </Link>
                    )}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-sm text-muted-foreground">该方向暂未收录著作</p>
                    </CardContent>
                  </Card>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
