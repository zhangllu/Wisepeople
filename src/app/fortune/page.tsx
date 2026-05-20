"use client"

import { useState, useCallback, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import wisePersonCodes from "@/data/wise-person-codes.json"
import questionsData from "@/data/questions.json"
import lifeStories from "@/data/links/life-stories.json"
import type { Question } from "@/types"

const questions: Question[] = questionsData as Question[]
const qMap = new Map<number, Question>()
for (const q of questions) qMap.set(q.number, q)

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

const animStyles = `
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
@keyframes doubleFlip {
  0%   { transform: rotateY(0deg); }
  25%  { transform: rotateY(180deg); }
  50%  { transform: rotateY(360deg); }
  75%  { transform: rotateY(540deg); }
  100% { transform: rotateY(540deg); }
}
`

const styleId = "fortune-anim"

export default function FortunePage() {
  const [person, setPerson] = useState<Person | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showFlip, setShowFlip] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  if (typeof document !== "undefined" && !document.getElementById(styleId)) {
    const el = document.createElement("style")
    el.id = styleId
    el.textContent = animStyles
    document.head.appendChild(el)
  }

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const draw = useCallback(() => {
    if (isAnimating) return
    clearTimers()
    setIsAnimating(true)

    if (isRevealed) {
      // Re-draw: quick cycle
      setIsRevealed(false)
      setPerson(getRandomPerson())
      setShowFlip(true)
      setTimeout(() => {
        setShowFlip(false)
        setIsRevealed(true)
        setIsAnimating(false)
      }, 1200)
    } else {
      // First draw
      setPerson(getRandomPerson())
      setShowFlip(true)
      setTimeout(() => {
        setShowFlip(false)
        setIsRevealed(true)
        setIsAnimating(false)
      }, 1200)
    }
  }, [isAnimating, isRevealed])

  const p = person

  return (
    <div className="min-h-screen bg-amber-50/40 flex flex-col items-center justify-center px-4 py-12">
      {/* ===== Card ===== */}
      <div
        className="[perspective:1000px] cursor-pointer select-none"
        style={{ width: 300, height: 426 }}
        onClick={isAnimating ? undefined : draw}
      >
        <div
          className="relative w-full h-full [transform-style:preserve-3d]"
          style={{
            animation: !isAnimating && !isRevealed ? "float 3s ease-in-out infinite" : undefined,
          }}
        >
          {/* Card inner: performs double flip */}
          <div
            className="relative w-full h-full [transform-style:preserve-3d] rounded-[16px] overflow-hidden"
            style={{
              animation: showFlip ? "doubleFlip 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards" : undefined,
              transform: isRevealed ? "rotateY(180deg)" : undefined,
            }}
          >
            {/* ===== COVER ===== */}
            <div
              className="absolute inset-0 [backface-visibility:hidden] flex flex-col items-center justify-center"
              style={{ backgroundColor: "#D97757" }}
            >
              <div className="absolute inset-[18px] rounded-[10px] border border-white/15" />
              <div className="absolute inset-[24px] rounded-[8px] border border-white/8" />
              <p className="text-white/60 text-sm tracking-[0.25em] mb-4">✦</p>
              <h2 className="text-white/90 text-2xl font-bold tracking-tight">
                今日幸运智者
              </h2>
              <p className="text-white/40 text-sm mt-3 tracking-[0.15em]">
                点 击 抽 卡
              </p>
            </div>

            {/* ===== CONTENT ===== */}
            <div
              className="absolute inset-0 bg-white border border-gray-100 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col overflow-hidden"
              style={{ transform: "rotateY(180deg) translateZ(0)", WebkitFontSmoothing: "antialiased" }}
            >
              {p && (
                <>
                  {/* Question header */}
                  <div className="flex items-center gap-2 px-6 py-5" style={{ backgroundColor: "#FAECE7" }}>
                    <span className="font-mono text-sm" style={{ color: "#D97757" }}>
                      {p.questionCode}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {p.questionTitle}
                    </span>
                  </div>

                  {/* Person info */}
                  <div className="flex-1 flex flex-col px-6 py-6">
                    <span className="text-lg mb-3" style={{ color: "#D97757" }}>✦</span>
                    <h2 className="text-xl font-bold text-gray-900 leading-snug mb-4">
                      {p.name}
                    </h2>
                    <p className="text-sm text-gray-500 leading-relaxed flex-1">
                      {p.excerpt}
                    </p>
                    <div className="pt-5 border-t border-gray-50">
                      <Link
                        href={`/wise-persons/${p.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-sm transition-colors"
                        style={{ color: "#D97757" }}
                      >
                        阅读完整档案
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom button */}
      <div className="text-center mt-10">
        <button
          onClick={draw}
          disabled={isAnimating}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-red-200 text-xs text-red-400 hover:text-red-700 hover:border-red-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          再抽一位
        </button>
      </div>

      <p className="text-center mt-14">
        <Link href="/daily" className="text-xs text-stone-200 hover:text-red-400 transition-colors">
          每日遇见三位智者 →
        </Link>
      </p>
    </div>
  )
}
