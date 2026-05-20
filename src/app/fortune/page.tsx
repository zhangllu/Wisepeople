"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
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
      setIsAnimating(true)
      setIsRevealed(false)
      setTimeout(() => {
        setPerson(getRandomPerson())
        setIsRevealed(true)
        setTimeout(() => setIsAnimating(false), 500)
      }, 250)
    } else {
      setIsAnimating(true)
      setPerson(getRandomPerson())
      setIsRevealed(true)
      setTimeout(() => setIsAnimating(false), 600)
    }
  }, [isRevealed, isAnimating])

  return (
    <div className="min-h-screen bg-amber-50/40">
      <div className="mx-auto px-6 py-20 max-w-lg">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            随机漫步
          </h1>
          <p className="text-sm text-gray-300 mt-2">
            点击卡牌，遇见你的今日幸运智者
          </p>
        </div>

        {/* Card */}
        <div className="[perspective:1000px] mx-auto w-72 h-[420px] sm:w-80 sm:h-[440px]">
          <div
            className={`relative w-full h-full [transform-style:preserve-3d] transition-transform duration-600 cursor-pointer select-none ${
              isRevealed ? "[transform:rotateY(180deg)]" : ""
            }`}
            onClick={draw}
          >
            {/* ===== Card Back ===== */}
            <div className="absolute inset-0 rounded-3xl bg-red-600 shadow-sm flex flex-col items-center justify-center [backface-visibility:hidden]">
              {/* Decorative diamond */}
              <div className="w-16 h-16 rounded-xl bg-white/15 flex items-center justify-center mb-5">
                <span className="text-2xl text-white/80 font-serif">?</span>
              </div>
              <p className="text-xs text-white/60 tracking-[0.2em]">
                点 击 抽 卡
              </p>
            </div>

            {/* ===== Card Front ===== */}
            <div className="absolute inset-0 rounded-3xl bg-white border border-gray-100 shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col">
              {person && (
                <div className="flex flex-col h-full p-8 sm:p-9">
                  {/* Accent line */}
                  <div className="w-8 h-0.5 bg-red-600 mb-6" />

                  {/* Code + tags */}
                  <div className="flex items-center gap-2.5 text-xs mb-6">
                    <span className="font-mono text-stone-200">
                      {person.code}
                    </span>
                    <span className="text-stone-200">/</span>
                    <span className="text-stone-400">
                      {person.questionCode}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-50 text-red-700 font-mono">
                      {person.dimensionLabel}
                    </span>
                  </div>

                  {/* Name */}
                  <h2 className="text-xl font-bold text-gray-900 leading-snug mb-5">
                    {person.name}
                  </h2>

                  {/* Excerpt */}
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 leading-[1.9]">
                      {person.excerpt}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-5 border-t border-gray-50">
                    <Link
                      href={`/wise-persons/${person.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs text-stone-300 hover:text-red-700 transition-colors"
                    >
                      阅读完整档案
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                    <span className="text-[10px] text-stone-100">
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
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-red-200 text-xs text-red-400 hover:text-red-700 hover:border-red-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            再抽一位
          </button>
        </div>

        {/* Link to daily */}
        <p className="text-center mt-20">
          <Link
            href="/daily"
            className="text-xs text-stone-200 hover:text-red-400 transition-colors"
          >
            每日遇见三位智者 →
          </Link>
        </p>
      </div>
    </div>
  )
}
