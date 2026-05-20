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

/* ====== Theme system ====== */
const THEMES = [
  { id: "coral",  bg: "#FAECE7", accent: "#D97757", symbol: "⚡", tag: "行动者" },
  { id: "violet", bg: "#EEEDFE", accent: "#7F77DD", symbol: "◎", tag: "哲思者" },
  { id: "teal",   bg: "#E1F5EE", accent: "#1D9E75", symbol: "○",  tag: "自然者" },
  { id: "amber",  bg: "#FAEEDA", accent: "#BA7517", symbol: "✦", tag: "人文者" },
] as const

function getTheme(qn: number) {
  if (qn === 1) return THEMES[1]  // meta → violet
  if (qn <= 4) return THEMES[2]   // heaven → teal
  if (qn <= 7) return THEMES[3]   // earth → amber
  return THEMES[0]                 // human → coral
}

function getEraTag(qn: number): string {
  if (qn === 1) return "哲思"
  if (qn <= 4) return "自然"
  if (qn <= 7) return "人文"
  return "行动"
}

/* ====== Claude logo (3 ellipses) ====== */
function ClaudeLogo({ size = 40, accent = "#D97757", center = "#F0997B" }) {
  const s = size
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none" style={{ flexShrink: 0 }}>
      <ellipse cx="24" cy="17" rx="14" ry="8" stroke={accent} strokeWidth="2.2"
        transform="rotate(0, 24, 24)" />
      <ellipse cx="24" cy="17" rx="14" ry="8" stroke={accent} strokeWidth="2.2"
        transform="rotate(120, 24, 24)" />
      <ellipse cx="24" cy="17" rx="14" ry="8" stroke={accent} strokeWidth="2.2"
        transform="rotate(240, 24, 24)" />
      <circle cx="24" cy="24" r="3.5" fill={center} />
    </svg>
  )
}

/* ====== Random picker ====== */
function getRandomPerson() {
  const code = allCodes[Math.floor(Math.random() * allCodes.length)]
  const info = codes[code]
  const qn: number = info.primaryQuestion
  const question = qMap.get(qn)
  const story = stories[info.slug] || ""
  const firstPara = story.split("\n\n")[0] || story
  const excerpt = firstPara.length > 90 ? firstPara.slice(0, 90) + "……" : firstPara

  return {
    code,
    slug: info.slug,
    name: info.name,
    questionNumber: qn,
    questionCode: question?.code ?? "",
    questionTitle: question?.title ?? "",
    excerpt,
    theme: getTheme(qn),
    eraTag: getEraTag(qn),
  }
}

type Person = ReturnType<typeof getRandomPerson>

/* ====== CSS keyframes ====== */
const floatKeyframes = `
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
`

const styleId = "fortune-anim"

/* ====== Page ====== */
export default function FortunePage() {
  const [person, setPerson] = useState<Person | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Inject keyframes once
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
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">随机漫步</h1>
        <p className="text-sm text-gray-300 mt-1.5">点击卡牌，遇见你的今日幸运智者</p>
      </div>

      {/* ===== Card ===== */}
      <div
        className="[perspective:1000px] cursor-pointer select-none"
        style={{ width: 220, height: 330 }}
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
          {/* ===== BACK ===== */}
          <div
            className="absolute inset-0 rounded-[16px] border-[0.5px] border-white/5 [backface-visibility:hidden] overflow-hidden"
            style={{ backgroundColor: "#1A1A1A" }}
          >
            {/* 45° diagonal stripe pattern */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(217,119,87,0.12) 10px, rgba(217,119,87,0.12) 11px)`,
              }}
            />

            {/* Inner frame ring 1 */}
            <div className="absolute inset-[14px] rounded-[10px] border border-orange-800/15" />
            {/* Inner frame ring 2 */}
            <div className="absolute inset-[18px] rounded-[8px] border border-orange-800/10" />

            {/* Center: Claude logo */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <ClaudeLogo size={44} accent="#D97757" center="#F0997B" />
              <span className="mt-3 text-[10px] tracking-[0.25em] uppercase"
                style={{ color: "rgba(217,119,87,0.5)" }}>
                Claude
              </span>
            </div>
          </div>

          {/* ===== FRONT ===== */}
          <div
            className="absolute inset-0 rounded-[16px] border-[0.5px] border-white/10 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col overflow-hidden"
          >
            {/* Top area (~60%): colored background */}
            {p && (
              <>
                <div
                  className="flex flex-col items-center justify-center"
                  style={{
                    height: "60%",
                    backgroundColor: p.theme.bg,
                  }}
                >
                  {/* Big symbol */}
                  <span className="leading-none mb-3 select-none"
                    style={{ fontSize: 48, color: p.theme.accent }}>
                    {p.theme.symbol}
                  </span>

                  {/* Era tag capsule */}
                  <span
                    className="inline-block rounded-full px-3 py-0.5 text-[10px] font-medium mb-3"
                    style={{
                      backgroundColor: p.theme.accent + "18",
                      color: p.theme.accent,
                    }}
                  >
                    {p.eraTag}
                  </span>

                  {/* Name */}
                  <h2
                    className="font-bold text-center leading-tight px-4"
                    style={{ fontSize: 17, color: p.theme.accent }}
                  >
                    {p.name}
                  </h2>

                  {/* Subtitle */}
                  <p className="text-[10px] mt-1 opacity-60"
                    style={{ color: p.theme.accent }}>
                    {p.questionTitle}
                  </p>
                </div>

                {/* Bottom area (~40%): white */}
                <div
                  className="flex flex-col px-5 py-4"
                  style={{ height: "40%", backgroundColor: "#fff" }}
                >
                  {/* Quote */}
                  <p className="italic text-[11px] leading-relaxed text-gray-500 flex-1">
                    &ldquo;{p.excerpt}&rdquo;
                  </p>

                  {/* Keyword tags */}
                  <div className="flex items-center gap-1.5 pt-3">
                    <span
                      className="rounded-sm px-1.5 py-0.5 text-[9px] font-mono"
                      style={{ backgroundColor: p.theme.bg, color: p.theme.accent }}
                    >
                      {p.questionCode}
                    </span>
                    <span className="text-[9px] text-gray-200">·</span>
                    <Link
                      href={`/wise-persons/${p.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[9px] text-gray-300 hover:text-gray-600 transition-colors"
                    >
                      完整档案 <ArrowRight className="inline h-2.5 w-2.5" />
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

      {/* Link to daily */}
      <p className="text-center mt-16">
        <Link href="/daily" className="text-xs text-stone-200 hover:text-red-400 transition-colors">
          每日遇见三位智者 →
        </Link>
      </p>
    </div>
  )
}
