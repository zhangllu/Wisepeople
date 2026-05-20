"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { ArrowRight, Shuffle } from "lucide-react"
import wisePersonCodes from "@/data/wise-person-codes.json"
import questionsData from "@/data/questions.json"
import lifeStories from "@/data/links/life-stories.json"
import { DIMENSION_LABELS } from "@/constants"
import type { Question } from "@/types"

const questions: Question[] = questionsData as Question[]
const qMap = new Map<number, Question>()
for (const q of questions) qMap.set(q.number, q)

const codes = (wisePersonCodes as any).codes as Record<string, any>
const allCodes = Object.keys(codes)
const stories = lifeStories as Record<string, string>

function getDimension(qn: number): string {
  if (qn === 1) return "meta"
  if (qn <= 4) return "heaven"
  if (qn <= 7) return "earth"
  return "human"
}

function getRandomPerson() {
  const code = allCodes[Math.floor(Math.random() * allCodes.length)]
  const info = codes[code]
  const qn: number = info.primaryQuestion
  const question = qMap.get(qn)
  const dim = getDimension(qn)
  const story = stories[info.slug] || ""

  // First paragraph, truncated to ~120 chars
  const firstPara = story.split("\n\n")[0] || story
  const excerpt = firstPara.length > 120 ? firstPara.slice(0, 120) + "……" : firstPara

  return {
    code,
    slug: info.slug,
    name: info.name,
    questionNumber: qn,
    questionCode: question?.code ?? "",
    questionTitle: question?.title ?? "",
    dimensionLabel: DIMENSION_LABELS[dim] ?? "",
    excerpt,
  }
}

type Person = ReturnType<typeof getRandomPerson>

export default function FortunePage() {
  const [person, setPerson] = useState<Person | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const draw = useCallback(() => {
    if (isAnimating) return

    if (isRevealed) {
      // Flip back, swap, flip forward
      setIsAnimating(true)
      setIsRevealed(false)
      setTimeout(() => {
        setPerson(getRandomPerson())
        setIsRevealed(true)
        setTimeout(() => setIsAnimating(false), 500)
      }, 300)
    } else {
      setIsAnimating(true)
      const p = getRandomPerson()
      setPerson(p)
      setIsRevealed(true)
      setTimeout(() => setIsAnimating(false), 600)
    }
  }, [isRevealed, isAnimating])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/70 to-orange-50/70">
      <div className="mx-auto px-6 py-16 max-w-lg">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            随机漫步
          </h1>
          <p className="text-sm text-gray-400 mt-2 leading-relaxed">
            点击卡牌，遇见你的今日幸运智者
          </p>
        </div>

        {/* Card */}
        <div className="[perspective:1000px] mx-auto w-72 h-[400px] sm:w-80 sm:h-[420px]">
          <div
            className={`relative w-full h-full [transform-style:preserve-3d] transition-transform duration-600 cursor-pointer select-none ${
              isRevealed ? "[transform:rotateY(180deg)]" : ""
            }`}
            onClick={draw}
          >
            {/* ===== Card Back ===== */}
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 shadow-xl flex flex-col items-center justify-center [backface-visibility:hidden]"
            >
              {/* Decorative rings */}
              <div className="absolute inset-8 rounded-xl border border-white/10" />
              <div className="absolute inset-12 rounded-xl border border-white/5" />

              {/* Question mark */}
              <div className="text-white/20 text-[120px] leading-none font-serif select-none -mt-4">
                ?
              </div>
              <p className="text-white/50 text-sm mt-2 tracking-widest">
                点击抽卡
              </p>
            </div>

            {/* ===== Card Front ===== */}
            <div
              className="absolute inset-0 rounded-2xl bg-white shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col"
            >
              {person && (
                <div className="flex flex-col h-full p-6 sm:p-7">
                  {/* Top row: code + tags */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] text-gray-300">
                      {person.code}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[11px] bg-gray-100 text-gray-500">
                      {person.questionCode}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[11px] bg-gray-50 text-gray-300 font-mono">
                      {person.dimensionLabel}
                    </span>
                  </div>

                  {/* Name + excerpt */}
                  <div className="flex-1 flex flex-col justify-center -mt-4">
                    <h2 className="text-xl font-bold text-gray-900 leading-snug mb-4">
                      {person.name}
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {person.excerpt}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Link
                      href={`/wise-persons/${person.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      阅读完整档案
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                    <span className="text-[10px] text-gray-200">
                      再点换一位
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom button */}
        <div className="text-center mt-10">
          <button
            onClick={draw}
            disabled={isAnimating}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-gray-200 text-sm text-gray-500 hover:text-gray-800 hover:border-gray-300 shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Shuffle className="h-4 w-4" />
            再抽一位
          </button>
        </div>

        {/* Link to daily page */}
        <p className="text-center mt-16">
          <Link
            href="/daily"
            className="text-xs text-gray-300 hover:text-gray-500 transition-colors"
          >
            每日遇见三位智者 →
          </Link>
        </p>
      </div>
    </div>
  )
}
