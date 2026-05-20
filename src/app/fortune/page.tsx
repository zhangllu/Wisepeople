"use client"

import { useState, useCallback } from "react"
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
    questionFull: question?.subtitle ?? "",
    excerpt,
  }
}

type Person = ReturnType<typeof getRandomPerson>

const floatKeyframes = `
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
`
const styleId = "fortune-anim"

export default function FortunePage() {
  const [person, setPerson] = useState<Person | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  if (typeof document !== "undefined" && !document.getElementById(styleId)) {
    const style = document.createElement("style")
    style.id = styleId
    style.textContent = floatKeyframes
    document.head.appendChild(style)
  }

  const draw = useCallback(() => {
    if (isAnimating) return

    if (isRevealed) {
      setIsAnimating(true)
      setIsRevealed(false)
      setTimeout(() => {
        setPerson(getRandomPerson())
        setIsRevealed(true)
        setTimeout(() => setIsAnimating(false), 500)
      }, 350)
    } else {
      setIsAnimating(true)
      setPerson(getRandomPerson())
      setIsRevealed(true)
      setTimeout(() => setIsAnimating(false), 700)
    }
  }, [isRevealed, isAnimating])

  const p = person

  return (
    <div className="min-h-screen bg-amber-50/40 flex flex-col items-center justify-center px-4 py-12">
      {/* ===== Card ===== */}
      <div
        className="[perspective:1000px] cursor-pointer select-none"
        style={{ width: 300, height: 426 }}
        onClick={draw}
      >
        <div
          className="relative w-full h-full [transform-style:preserve-3d]"
          style={{
            transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isRevealed ? "rotateY(180deg)" : undefined,
            animation: isRevealed ? undefined : "float 3s ease-in-out infinite",
          }}
        >
          {/* ===== COVER (initial) ===== */}
          <div
            className="absolute inset-0 rounded-[16px] [backface-visibility:hidden] overflow-hidden flex flex-col items-center justify-center"
            style={{ backgroundColor: "#D97757" }}
          >
            {/* Decorative rings */}
            <div className="absolute inset-[18px] rounded-[10px] border border-white/15" />
            <div className="absolute inset-[24px] rounded-[8px] border border-white/8" />

            {/* Center text */}
            <p className="text-white/60 text-sm tracking-[0.25em] mb-4">✦</p>
            <h2 className="text-white/90 text-2xl font-bold tracking-tight">
              今日幸运智者
            </h2>
            <p className="text-white/40 text-sm mt-3 tracking-[0.15em]">
              点 击 抽 卡
            </p>
          </div>

          {/* ===== REVEALED (after flip) ===== */}
          <div
            className="absolute inset-0 rounded-[16px] border border-gray-100 bg-white [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col overflow-hidden"
          >
            {p && (
              <>
                {/* Top: question header */}
                <div
                  className="flex items-center gap-2 px-6 py-5"
                  style={{ backgroundColor: "#FAECE7" }}
                >
                  <span className="font-mono text-sm"
                    style={{ color: "#D97757" }}>
                    {p.questionCode}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {p.questionTitle}
                  </span>
                </div>

                {/* Person info */}
                <div className="flex-1 flex flex-col px-6 py-6">
                  {/* Name */}
                  <h2 className="text-xl font-bold text-gray-900 leading-snug mb-4">
                    {p.name}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">
                    {p.excerpt}
                  </p>

                  {/* Link */}
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
