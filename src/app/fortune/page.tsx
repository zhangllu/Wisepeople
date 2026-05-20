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

/* ====== Animation CSS ====== */
const animStyles = `
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

/* Phase 1: charge - press down + shake */
@keyframes charge {
  0%   { transform: scale(1) translateY(0) rotate(0); }
  20%  { transform: scale(0.95) translateY(4px) rotate(-1.5deg); }
  40%  { transform: scale(0.95) translateY(4px) rotate(1.5deg); }
  60%  { transform: scale(0.95) translateY(3px) rotate(-1deg); }
  80%  { transform: scale(0.95) translateY(4px) rotate(0.5deg); }
  100% { transform: scale(0.95) translateY(4px) rotate(0); }
}

/* Phase 2: fly + arc + flip + spring bounce */
@keyframes flyIn {
  0%   { transform: scale(0.95) translateY(4px) rotate(-6deg); }
  30%  { transform: scale(1.03) translateY(-30px) rotate(-3deg); }
  55%  { transform: scale(1.06) translateY(-12px) rotate(0deg); }
  75%  { transform: scale(1.03) translateY(-4px) rotate(0deg); }
  100% { transform: scale(1) translateY(0) rotate(0deg); }
}

/* New card flies in from lower-right */
@keyframes flyInNew {
  0%   { transform: translate(60px, 40px) scale(0.85) rotate(12deg); opacity: 0; }
  40%  { transform: translate(-10px, -20px) scale(1.04) rotate(-2deg); opacity: 1; }
  65%  { transform: translate(2px, -8px) scale(1.06) rotate(0.5deg); opacity: 1; }
  85%  { transform: translate(0, -2px) scale(1.02); opacity: 1; }
  100% { transform: translate(0, 0) scale(1); opacity: 1; }
}

/* Old card exits to lower-left */
@keyframes flyOutOld {
  0%   { transform: translate(0, 0) scale(1) rotate(0); opacity: 1; }
  100% { transform: translate(-60px, 30px) scale(0.8) rotate(-10deg); opacity: 0; }
}

/* Staggered content entrance */
@keyframes popIn {
  0%   { transform: scale(0.4); opacity: 0; }
  60%  { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes fadeUp {
  0%   { transform: translateY(10px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

/* Radial burst */
@keyframes burst {
  0%   { transform: scale(0.3); opacity: 0.35; }
  100% { transform: scale(2.5); opacity: 0; }
}

/* Ripple glow during charge */
@keyframes ripple {
  0%   { transform: scale(0.6); opacity: 0.3; }
  100% { transform: scale(2.2); opacity: 0; }
}

/* Flip: Y-axis rotation during fly */
.flipping .card-inner {
  animation: flip180 0.55s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
@keyframes flip180 {
  0%   { transform: rotateY(0deg); }
  100% { transform: rotateY(180deg); }
}
.flipping-new .card-inner {
  animation: flip180new 0.55s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
@keyframes flip180new {
  0%   { transform: rotateY(180deg); }
  100% { transform: rotateY(360deg); }
}
`

/* ====== Staggered content CSS injected per-card ====== */
function staggerStyle(delayBase: number) {
  return {
    "--sym-d": `${delayBase}s`,
    "--name-d": `${delayBase + 0.15}s`,
    "--quote-d": `${delayBase + 0.28}s`,
    "--tag-d": `${delayBase + 0.38}s`,
  } as React.CSSProperties
}

const styleId = "fortune-anim"

export default function FortunePage() {
  const [person, setPerson] = useState<Person | null>(null)
  const [phase, setPhase] = useState<'idle' | 'charge' | 'fly' | 'settle' | 'revealed'>('idle')
  const [isNew, setIsNew] = useState(false)
  const [showExiting, setShowExiting] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  // Inject styles once
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

  const setTimer = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms)
    timers.current.push(id)
    return id
  }

  const draw = useCallback(() => {
    if (phase !== 'idle' && phase !== 'revealed') return
    clearTimers()

    if (phase === 'revealed') {
      // Re-draw: old card exits, then new card flies in
      setShowExiting(true)
      setTimer(() => {
        setShowExiting(false)
        setPerson(getRandomPerson())
        setIsNew(true)
        setPhase('charge')
        setTimer(() => {
          setPhase('fly')
          setTimer(() => {
            setPhase('settle')
            setTimer(() => {
              setPhase('revealed')
            }, 550)
          }, 600)
        }, 350)
      }, 250)
    } else {
      // First draw
      setIsNew(false)
      setPerson(getRandomPerson())
      setPhase('charge')
      setTimer(() => {
        setPhase('fly')
        setTimer(() => {
          setPhase('settle')
          setTimer(() => {
            setPhase('revealed')
          }, 550)
        }, 600)
      }, 350)
    }
  }, [phase])

  const p = person
  const animating = phase !== 'idle' && phase !== 'revealed'

  return (
    <div className="min-h-screen bg-amber-50/40 flex flex-col items-center justify-center px-4 py-12">
      {/* ===== Card wrapper ===== */}
      <div
        className="relative cursor-pointer select-none"
        style={{ width: 300, height: 426 }}
        onClick={animating ? undefined : draw}
      >
        {/* Burst effect on reveal */}
        {(phase === 'settle' || phase === 'revealed') && !showExiting && (
          <div
            className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
            style={{ animation: "burst 0.6s ease-out forwards" }}
          >
            {/* 12 radial rays */}
            <div className="absolute w-full h-full" style={{
              background: `conic-gradient(from 0deg,
                transparent 0deg, rgba(217,119,87,0.25) 2deg, transparent 4deg,
                transparent 28deg, rgba(217,119,87,0.25) 30deg, transparent 32deg,
                transparent 58deg, rgba(217,119,87,0.25) 60deg, transparent 62deg,
                transparent 88deg, rgba(217,119,87,0.25) 90deg, transparent 92deg,
                transparent 118deg, rgba(217,119,87,0.25) 120deg, transparent 122deg,
                transparent 148deg, rgba(217,119,87,0.25) 150deg, transparent 152deg,
                transparent 178deg, rgba(217,119,87,0.25) 180deg, transparent 182deg,
                transparent 208deg, rgba(217,119,87,0.25) 210deg, transparent 212deg,
                transparent 238deg, rgba(217,119,87,0.25) 240deg, transparent 242deg,
                transparent 268deg, rgba(217,119,87,0.25) 270deg, transparent 272deg,
                transparent 298deg, rgba(217,119,87,0.25) 300deg, transparent 302deg,
                transparent 328deg, rgba(217,119,87,0.25) 330deg, transparent 332deg
              )`,
              borderRadius: "50%",
            }} />
            {/* Center glow */}
            <div className="absolute w-16 h-16 rounded-full" style={{
              background: "radial-gradient(circle, rgba(217,119,87,0.3) 0%, transparent 70%)",
            }} />
          </div>
        )}

        {/* Ripple glow during charge */}
        {phase === 'charge' && (
          <div
            className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
            style={{ animation: "ripple 0.35s ease-out forwards" }}
          >
            <div
              className="absolute w-full h-full rounded-[16px]"
              style={{
                background: "radial-gradient(circle at center, rgba(217,119,87,0.15) 0%, transparent 70%)",
              }}
            />
          </div>
        )}

        {/* Exiting card (re-draw) */}
        {showExiting && (
          <div
            className="absolute inset-0 rounded-[16px] bg-white border border-gray-100 z-20 flex items-center justify-center"
            style={{ animation: "flyOutOld 0.25s ease-in forwards" }}
          >
            <p className="text-xs text-stone-200">✦</p>
          </div>
        )}

        {/* ===== Main card ===== */}
        <div
          className={`relative w-full h-full [transform-style:preserve-3d] ${phase === 'fly' ? (isNew ? 'flipping-new' : 'flipping') : ''}`}
          style={{
            animation: !animating && !showExiting
              ? "float 3s ease-in-out infinite"
              : phase === 'charge'
                ? "charge 0.35s ease-in-out forwards"
                : phase === 'fly'
                  ? (isNew ? "flyInNew 0.6s cubic-bezier(0.2, 0, 0, 1) forwards" : "flyIn 0.6s cubic-bezier(0.2, 0, 0, 1) forwards")
                  : phase === 'settle' || phase === 'revealed'
                    ? undefined
                    : undefined,
          }}
        >
          {/* ===== COVER side ===== */}
          <div
            className="absolute inset-0 rounded-[16px] [backface-visibility:hidden] overflow-hidden flex flex-col items-center justify-center"
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

          {/* ===== REVEALED side ===== */}
          <div
            className="absolute inset-0 rounded-[16px] border border-gray-100 bg-white [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col overflow-hidden"
          >
            {p && (
              <div className="flex flex-col h-full" style={staggerStyle(0)}>
                {/* Question header */}
                <div
                  className="flex items-center gap-2 px-6 py-5"
                  style={{
                    backgroundColor: "#FAECE7",
                    animation: (phase === 'settle' || phase === 'revealed') ? "fadeUp 0.3s ease-out both" : undefined,
                    animationDelay: "var(--sym-d)",
                  }}
                >
                  <span className="font-mono text-sm" style={{ color: "#D97757" }}>
                    {p.questionCode}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {p.questionTitle}
                  </span>
                </div>

                {/* Person info */}
                <div className="flex-1 flex flex-col px-6 py-6">
                  {/* Symbol */}
                  <div
                    className="mb-3"
                    style={{
                      animation: (phase === 'settle' || phase === 'revealed') ? "popIn 0.3s ease-out both" : undefined,
                      animationDelay: "var(--name-d)",
                    }}
                  >
                    <span className="text-lg" style={{ color: "#D97757" }}>✦</span>
                  </div>

                  {/* Name */}
                  <h2
                    className="text-xl font-bold text-gray-900 leading-snug mb-4"
                    style={{
                      animation: (phase === 'settle' || phase === 'revealed') ? "fadeUp 0.3s ease-out both" : undefined,
                      animationDelay: "var(--name-d)",
                    }}
                  >
                    {p.name}
                  </h2>

                  {/* Excerpt */}
                  <p
                    className="text-sm text-gray-500 leading-relaxed flex-1"
                    style={{
                      animation: (phase === 'settle' || phase === 'revealed') ? "fadeUp 0.3s ease-out both" : undefined,
                      animationDelay: "var(--quote-d)",
                    }}
                  >
                    {p.excerpt}
                  </p>

                  {/* Link */}
                  <div
                    className="pt-5 border-t border-gray-50"
                    style={{
                      animation: (phase === 'settle' || phase === 'revealed') ? "fadeUp 0.3s ease-out both" : undefined,
                      animationDelay: "var(--tag-d)",
                    }}
                  >
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom button */}
      <div className="text-center mt-10">
        <button
          onClick={draw}
          disabled={animating}
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
