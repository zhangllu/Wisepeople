"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import type { Question, SubTopic, WisePerson, Book } from "@/types"
import { ROUTES, DIMENSION_LABELS } from "@/constants"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { BookCard } from "@/components/book/BookCard"
import { WisePersonCard } from "@/components/wise-person/WisePersonCard"
import { Users, BookOpen, ChevronRight, ArrowLeft } from "lucide-react"

interface TopicWisePersons {
  topic: SubTopic
  wisePersons: WisePerson[]
}

interface QuestionHubProps {
  question: Question
  topicsWithWisePersons: TopicWisePersons[]
  booksByTopic: Record<string, Book[]>
}

export function QuestionHub({
  question,
  topicsWithWisePersons,
  booksByTopic,
}: QuestionHubProps) {
  const [activeTopicIndex, setActiveTopicIndex] = useState(0)

  const activeTopicData = topicsWithWisePersons[activeTopicIndex]
  const activeTopic = activeTopicData?.topic
  const activeWisePersons = activeTopicData?.wisePersons ?? []
  const activeBooks = activeTopic ? (booksByTopic[activeTopic.code] ?? []) : []

  const totalWisePersons = useMemo(
    () => topicsWithWisePersons.reduce((sum, t) => sum + t.wisePersons.length, 0),
    [topicsWithWisePersons]
  )
  const totalBooks = useMemo(
    () => Object.values(booksByTopic).reduce((sum, books) => sum + books.length, 0),
    [booksByTopic]
  )

  // Show limited items for a clean view
  const MAX_PERSONS = 6
  const MAX_BOOKS = 6

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 sm:py-10">
      {/* Breadcrumb */}
      <Link
        href={ROUTES.questions}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        返回问题列表
      </Link>

      {/* ── Question Header ── */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-mono text-muted-foreground">{question.code}</span>
          <Badge variant="secondary" className="text-[10px]">
            {DIMENSION_LABELS[question.dimension]}
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading mb-2">{question.title}</h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
          {question.subtitle}
        </p>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-5 mt-5 pt-5 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-accent/70" />
            <span className="text-sm">
              <span className="font-semibold">{totalWisePersons}</span>
              <span className="text-muted-foreground ml-1">位智者</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-accent/70" />
            <span className="text-sm">
              <span className="font-semibold">{totalBooks}</span>
              <span className="text-muted-foreground ml-1">本著作</span>
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {topicsWithWisePersons.length} 个主题方向
          </div>
        </div>
      </header>

      {/* ── Theme Cards ── */}
      <section className="mb-10">
        <h2 className="text-base font-semibold mb-4">主题方向</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {topicsWithWisePersons.map((tw, idx) => {
            const isActive = idx === activeTopicIndex
            const bookCount = booksByTopic[tw.topic.code]?.length ?? 0
            const personCount = tw.wisePersons.length
            return (
              <button
                key={tw.topic.code}
                onClick={() => setActiveTopicIndex(idx)}
                className={`
                  rounded-xl p-4 text-left transition-all duration-200 border
                  ${isActive
                    ? "border-accent bg-accent/[0.06] shadow-sm ring-1 ring-accent/20"
                    : "border-border/60 bg-card hover:border-accent/30 hover:shadow-sm"
                  }
                `}
              >
                <span className={`text-[10px] font-mono block mb-1 ${isActive ? "text-accent" : "text-muted-foreground"}`}>
                  {tw.topic.code}
                </span>
                <p className="text-sm font-medium leading-snug mb-2">{tw.topic.title}</p>
                <div className={`text-[11px] ${isActive ? "text-accent/80" : "text-muted-foreground"}`}>
                  {personCount} 人 · {bookCount} 书
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Active Theme Content ── */}
      {activeTopic && (
        <div>
          {/* Theme header */}
          <div className="flex items-start justify-between mb-8 pb-4 border-b border-border/50">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-accent">{activeTopic.code}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">{activeTopic.representativeDiscipline}</span>
              </div>
              <h3 className="text-lg font-semibold">{activeTopic.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{activeTopic.coreField}</p>
            </div>
            <Link
              href={ROUTES.topicDetail(activeTopic.code)}
              className="shrink-0 text-xs text-accent hover:underline flex items-center gap-1 mt-1"
            >
              查看全部 <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Wise Persons */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" />
                <h4 className="text-base font-semibold">智者</h4>
                <Badge variant="secondary" className="text-[10px]">{activeWisePersons.length}</Badge>
              </div>
              {activeWisePersons.length > MAX_PERSONS && (
                <Link
                  href={ROUTES.topicDetail(activeTopic.code)}
                  className="text-xs text-accent hover:underline flex items-center gap-1"
                >
                  全部 {activeWisePersons.length} 位 <ChevronRight className="w-3 h-3" />
                </Link>
              )}
            </div>

            {activeWisePersons.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeWisePersons.slice(0, MAX_PERSONS).map((person) => (
                  <WisePersonCard key={person.id} wisePerson={person} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-sm text-muted-foreground">该方向暂未收录智者</p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Books */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent" />
                <h4 className="text-base font-semibold">著作</h4>
                <Badge variant="secondary" className="text-[10px]">{activeBooks.length}</Badge>
              </div>
              {activeBooks.length > MAX_BOOKS && (
                <Link
                  href={ROUTES.topicDetail(activeTopic.code)}
                  className="text-xs text-accent hover:underline flex items-center gap-1"
                >
                  全部 {activeBooks.length} 本 <ChevronRight className="w-3 h-3" />
                </Link>
              )}
            </div>

            {activeBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeBooks.slice(0, MAX_BOOKS).map((book) => (
                  <BookCard key={book.slug} book={book} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-sm text-muted-foreground">该方向暂未收录著作</p>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
