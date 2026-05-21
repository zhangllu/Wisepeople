"use client"

import { useState, useCallback, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import wisePersonCodes from "@/data/wise-person-codes.json"
import questionsData from "@/data/questions.json"
import lifeStories from "@/data/links/life-stories.json"
import booksData from "@/data/books.json"
import topicsData from "@/data/topics.json"
import type { Question, Book, SubTopic } from "@/types"

const questions: Question[] = questionsData as Question[]
const qMap = new Map<number, Question>()
for (const q of questions) qMap.set(q.number, q)

const topics: SubTopic[] = topicsData as SubTopic[]
const topicToQuestionMap = new Map<string, number>()
for (const t of topics) topicToQuestionMap.set(t.code, t.questionNumber)

function getQuestionTitleByTopicCode(topicCode: string): string {
  const qn = topicToQuestionMap.get(topicCode)
  if (qn === undefined) return "通识千书"
  if (qn === 0) {
    const topic = topics.find((t) => t.code === topicCode)
    return topic?.title ?? "通识千书"
  }
  return qMap.get(qn)?.title ?? "通识千书"
}

const codes = (wisePersonCodes as any).codes as Record<string, any>
const allCodes = Object.keys(codes)
const stories = lifeStories as Record<string, string>

function getRandomPerson() {
  const code = allCodes[Math.floor(Math.random() * allCodes.length)]
  const info = codes[code]
  const qn: number = info.primaryQuestion
  const question = qMap.get(qn)
  const story = stories[info.slug] || ""
  const firstPara = story.split("\n\n")[0] || story
  const excerpt = firstPara.length > 120 ? firstPara.slice(0, 120) + "……" : firstPara

  return {
    code,
    slug: info.slug,
    name: info.name,
    questionNumber: qn,
    questionCode: question?.code ?? "",
    questionTitle: question?.title ?? "",
    excerpt,
  }
}

type Person = ReturnType<typeof getRandomPerson>

const allBooks: Book[] = booksData as Book[]

function getRandomBook(): Book {
  return allBooks[Math.floor(Math.random() * allBooks.length)]
}

const animStyle = `
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
`

export default function FortunePage() {
  const [mode, setMode] = useState<"wise-person" | "book">("wise-person")
  const [person, setPerson] = useState<Person | null>(null)
  const [book, setBook] = useState<Book | null>(null)
  const [rotation, setRotation] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  if (typeof document !== "undefined" && !document.getElementById("f-anim")) {
    const el = document.createElement("style")
    el.id = "f-anim"
    el.textContent = animStyle
    document.head.appendChild(el)
  }

  const clearT = () => { timers.current.forEach(clearTimeout); timers.current = [] }

  const handleModeChange = (value: string) => {
    if (isAnimating) return
    clearT()
    setMode(value as "wise-person" | "book")
    setPerson(null)
    setBook(null)
    setRotation(0)
    setIsAnimating(false)
  }

  const draw = useCallback(() => {
    if (isAnimating) return
    clearT()
    setIsAnimating(true)

    if (mode === "wise-person") {
      setPerson(getRandomPerson())
    } else {
      setBook(getRandomBook())
    }

    if (rotation !== 0) {
      // Re-draw: small rotation backward then draw
      setRotation(rotation - 180)
      const t1 = setTimeout(() => {
        if (mode === "wise-person") {
          setPerson(getRandomPerson())
        } else {
          setBook(getRandomBook())
        }
        setRotation(540)
      }, 300)
      timers.current.push(t1)
    } else {
      // First draw: 0 → 360 (full, back to cover) → 540 (revealed)
      setRotation(360)
      const t1 = setTimeout(() => {
        setRotation(540)
      }, 500)
      timers.current.push(t1)
    }

    const t2 = setTimeout(() => setIsAnimating(false), 1150)
    timers.current.push(t2)
  }, [isAnimating, rotation, mode])

  const p = person
  const b = book
  const isWisePersonMode = mode === "wise-person"

  return (
    <div className="min-h-screen bg-amber-50/40 flex flex-col items-center justify-center px-4 py-12">
      {/* Tab 切换 */}
      <Tabs value={mode} onValueChange={handleModeChange} className="mb-10">
        <TabsList>
          <TabsTrigger value="wise-person" className="text-sm md:text-base px-4">
            幸运智者
          </TabsTrigger>
          <TabsTrigger value="book" className="text-sm md:text-base px-4">
            幸运书籍
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 卡片 */}
      <div
        className="[perspective:1000px] cursor-pointer select-none"
        style={{ width: 300, height: 426 }}
        onClick={isAnimating ? undefined : draw}
      >
        <div
          className="relative w-full h-full [transform-style:preserve-3d] will-change-transform"
          style={{
            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: `rotateY(${rotation}deg)`,
            animation: rotation === 0 ? "float 3s ease-in-out infinite" : undefined,
          }}
        >
          {/* ===== 封面 ===== */}
          <div
            className="absolute inset-0 rounded-[16px] [backface-visibility:hidden] overflow-hidden flex flex-col items-center justify-center"
            style={{ backgroundColor: "#D97757" }}
          >
            <div className="absolute inset-[18px] rounded-[10px] border border-white/15" />
            <div className="absolute inset-[24px] rounded-[8px] border border-white/8" />
            <p className="text-white/60 text-sm tracking-[0.25em] mb-4">✦</p>
            <h2 className="text-white/90 text-2xl font-bold tracking-tight">
              {isWisePersonMode ? "今日幸运智者" : "今日幸运书籍"}
            </h2>
            <p className="text-white/40 text-sm mt-3 tracking-[0.15em]">
              点 击 抽 卡
            </p>
          </div>

          {/* ===== 内容面 ===== */}
          <div
            className="absolute inset-0 rounded-[16px] bg-white border border-gray-100 [backface-visibility:hidden] flex flex-col overflow-hidden"
            style={{ transform: "rotateY(180deg)" }}
          >
            {/* 智者内容 */}
            {isWisePersonMode && p && (
              <>
                <div className="flex items-center gap-2 px-6 py-5" style={{ backgroundColor: "#FAECE7" }}>
                  <span className="font-mono text-sm" style={{ color: "#D97757" }}>{p.questionCode}</span>
                  <span className="text-sm font-medium text-gray-700">{p.questionTitle}</span>
                </div>
                <div className="flex-1 flex flex-col px-6 py-6">
                  <span className="text-lg mb-3" style={{ color: "#D97757" }}>✦</span>
                  <h2 className="text-xl font-bold text-gray-900 leading-snug mb-4">{p.name}</h2>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">{p.excerpt}</p>
                  <div className="pt-5 border-t border-gray-50">
                    <Link
                      href={`/wise-persons/${p.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-sm transition-colors"
                      style={{ color: "#D97757" }}
                    >
                      阅读完整档案 <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </>
            )}

            {/* 书籍内容 */}
            {!isWisePersonMode && b && (
              <>
                <div className="flex items-center gap-2 px-6 py-5" style={{ backgroundColor: "#F5F0EB" }}>
                  <span className="text-sm" style={{ color: "#8B7E66" }}>📖</span>
                  <span className="text-sm font-medium text-gray-700">{getQuestionTitleByTopicCode(b.topicCode)}</span>
                </div>
                <div className="flex-1 flex flex-col px-6 py-6">
                  <span className="text-lg mb-3" style={{ color: "#8B7E66" }}>✦</span>
                  <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3 line-clamp-2">{b.title}</h2>
                  <p className="text-sm text-gray-600 mb-1">{b.author}</p>
                  <p className="text-xs text-gray-400 mb-3">
                    {b.year && <span>{b.year}</span>}
                    {b.publisher && <span> · {b.publisher}</span>}
                  </p>
                  {b.tags && (
                    <span className="text-[11px] text-gray-400">{b.tags}</span>
                  )}
                  <div className="pt-5 border-t border-gray-50 mt-auto">
                    <a
                      href={b.doubanLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-sm transition-colors"
                      style={{ color: "#8B7E66" }}
                    >
                      豆瓣详情 <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 按钮 */}
      <div className="text-center mt-10">
        <button
          onClick={draw}
          disabled={isAnimating}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-red-200 text-xs text-red-400 hover:text-red-700 hover:border-red-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isWisePersonMode ? "再抽一位" : "再抽一本"}
        </button>
      </div>

      {/* 底部链接 */}
      <p className="text-center mt-14">
        <Link
          href={isWisePersonMode ? "/daily" : "/book-lists"}
          className="text-xs text-stone-200 hover:text-red-400 transition-colors"
        >
          {isWisePersonMode ? "每日遇见三位智者 →" : "浏览全部书单 →"}
        </Link>
      </p>
    </div>
  )
}
