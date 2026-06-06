"use client"

import Link from "next/link"
import type { Question, WisePerson } from "@/types"
import { ROUTES } from "@/constants"

interface QuestionGroup {
  question: Question
  wisePersons: WisePerson[]
}

interface KnowledgeMapProps {
  wisePersonsByQuestion: QuestionGroup[]
}

function getTopPersons(wisePersons: WisePerson[], n = 8) {
  return wisePersons.filter((p) => p.name).slice(0, n)
}

/** Helper: wrap SVG zone content in a Link to the question hub */
function ZoneLink({ question, children, className }: {
  question: Question
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link href={ROUTES.questionDetail(question.id)} className={className}>
      {children}
    </Link>
  )
}

export function KnowledgeMap({ wisePersonsByQuestion }: KnowledgeMapProps) {
  const byQ = new Map<number, QuestionGroup>()
  for (const g of wisePersonsByQuestion) {
    byQ.set(g.question.number, g)
  }

  const dotPos = [
    { dx: -20, dy: 10 }, { dx: 0, dy: 14 }, { dx: 20, dy: 10 },
    { dx: -30, dy: 4 }, { dx: 30, dy: 4 }, { dx: -12, dy: 18 }, { dx: 12, dy: 18 }, { dx: 0, dy: 2 },
  ]

  // Helper to get question by number
  const q = (n: number) => wisePersonsByQuestion.find((g) => g.question.number === n)?.question

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 900 520"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto block"
        style={{ fontFamily: "Georgia, serif" }}
      >
        <defs>
          <linearGradient id="m-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#daeaf5" /><stop offset="100%" stopColor="#eef5fa" />
          </linearGradient>
          <linearGradient id="m-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8dfe8" /><stop offset="100%" stopColor="#a8ccd8" />
          </linearGradient>
          <linearGradient id="m-stream" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9fccd8" /><stop offset="50%" stopColor="#7ab8c8" /><stop offset="100%" stopColor="#9fccd8" />
          </linearGradient>
          <radialGradient id="m-yuan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f5e8a0" /><stop offset="70%" stopColor="#e8c840" /><stop offset="100%" stopColor="#c8a010" />
          </radialGradient>
          <filter id="m-cloud">
            <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#7ab0cc" floodOpacity="0.22" />
          </filter>
          <filter id="m-halo">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <pattern id="m-ripple" width="50" height="9" patternUnits="userSpaceOnUse">
            <path d="M0 4.5 Q12.5 0.5 25 4.5 Q37.5 8.5 50 4.5" fill="none" stroke="white" strokeWidth="0.7" opacity="0.38" />
          </pattern>
        </defs>

        {/* 天 */}
        <rect width="900" height="270" fill="url(#m-sky)" />
        <path d="M0 235 Q80 205 160 218 Q260 232 350 200 Q440 168 530 192 Q620 214 710 182 Q790 154 900 174 L900 270 L0 270Z" fill="#c0d8e4" opacity="0.42" />
        <path d="M0 252 Q150 239 300 247 Q450 255 600 237 Q750 219 900 235 L900 270 L0 270Z" fill="#d5e8f0" opacity="0.5" />
        <text x="32" y="224" fontSize="10" fill="#3a6a8a" letterSpacing="5" opacity="0.7">天 · 行云三问</text>

        {/* 云1 Q02 */}
        {(() => {
          const cx = 150; const cy = 108; const qn = 2
          const question = q(qn)
          const ps = getTopPersons(byQ.get(qn)?.wisePersons ?? [])
          if (!question) return null
          return (
            <a key={qn} href={ROUTES.questionDetail(question.id)} className="cursor-pointer">
              <g filter="url(#m-cloud)" opacity={0.92}>
                <ellipse cx={cx} cy={cy} rx="76" ry="31" fill="white" opacity="0.92" />
                <ellipse cx={cx-34} cy={cy+8} rx="48" ry="24" fill="white" opacity="0.88" />
                <ellipse cx={cx+34} cy={cy+6} rx="53" ry="26" fill="white" opacity="0.88" />
                <ellipse cx={cx} cy={cy-18} rx="42" ry="26" fill="white" opacity="0.92" />
              </g>
              <circle cx={cx} cy={cy} r="4" fill="#3a7aaa" opacity="0.85" className="pointer-events-none" />
              <text x={cx} y={cy-11} textAnchor="middle" fontSize="9" fill="#0d2e4a" fontWeight="bold" className="pointer-events-none">Q02</text>
              <text x={cx} y={cy-22} textAnchor="middle" fontSize="9" fill="#0d2e4a" className="pointer-events-none">如何理解世界</text>
              {ps.slice(0,6).map((p,i) => <circle key={p.slug} cx={cx+(dotPos[i]?.dx??0)} cy={cy+(dotPos[i]?.dy??10)} r="2.4" fill="#2a6a9a" opacity="0.7" className="pointer-events-none" />)}
              <text x={cx} y={cy+28} textAnchor="middle" fontSize="7.5" fill="#3a7aaa" opacity="0.7" className="pointer-events-none">{byQ.get(qn)?.wisePersons.length ?? 0} 位</text>
            </a>
          )
        })()}

        {/* 云2 Q03 */}
        {(() => {
          const cx = 450; const cy = 90; const qn = 3
          const question = q(qn)
          const ps = getTopPersons(byQ.get(qn)?.wisePersons ?? [])
          if (!question) return null
          return (
            <a key={qn} href={ROUTES.questionDetail(question.id)} className="cursor-pointer">
              <g filter="url(#m-cloud)" opacity={0.92}>
                <ellipse cx={cx} cy={cy} rx="84" ry="33" fill="white" opacity="0.92" />
                <ellipse cx={cx-40} cy={cy+10} rx="54" ry="26" fill="white" opacity="0.88" />
                <ellipse cx={cx+42} cy={cy+8} rx="58" ry="28" fill="white" opacity="0.88" />
                <ellipse cx={cx} cy={cy-18} rx="46" ry="28" fill="white" opacity="0.92" />
              </g>
              <circle cx={cx} cy={cy} r="4" fill="#3a7aaa" opacity="0.85" className="pointer-events-none" />
              <text x={cx} y={cy-11} textAnchor="middle" fontSize="9" fill="#0d2e4a" fontWeight="bold" className="pointer-events-none">Q03</text>
              <text x={cx} y={cy-22} textAnchor="middle" fontSize="9" fill="#0d2e4a" className="pointer-events-none">如何理解历史</text>
              {ps.slice(0,6).map((p,i) => <circle key={p.slug} cx={cx+(dotPos[i]?.dx??0)} cy={cy+(dotPos[i]?.dy??10)} r="2.4" fill="#2a6a9a" opacity="0.7" className="pointer-events-none" />)}
              <text x={cx} y={cy+30} textAnchor="middle" fontSize="7.5" fill="#3a7aaa" opacity="0.7" className="pointer-events-none">{byQ.get(qn)?.wisePersons.length ?? 0} 位</text>
            </a>
          )
        })()}

        {/* 云3 Q04 */}
        {(() => {
          const cx = 758; const cy = 100; const qn = 4
          const question = q(qn)
          const ps = getTopPersons(byQ.get(qn)?.wisePersons ?? [])
          if (!question) return null
          return (
            <a key={qn} href={ROUTES.questionDetail(question.id)} className="cursor-pointer">
              <g filter="url(#m-cloud)" opacity={0.92}>
                <ellipse cx={cx} cy={cy} rx="78" ry="31" fill="white" opacity="0.92" />
                <ellipse cx={cx-36} cy={cy+8} rx="50" ry="25" fill="white" opacity="0.88" />
                <ellipse cx={cx+37} cy={cy+6} rx="55" ry="27" fill="white" opacity="0.88" />
                <ellipse cx={cx} cy={cy-18} rx="44" ry="28" fill="white" opacity="0.92" />
              </g>
              <circle cx={cx} cy={cy} r="4" fill="#3a7aaa" opacity="0.85" className="pointer-events-none" />
              <text x={cx} y={cy-11} textAnchor="middle" fontSize="9" fill="#0d2e4a" fontWeight="bold" className="pointer-events-none">Q04</text>
              <text x={cx} y={cy-22} textAnchor="middle" fontSize="9" fill="#0d2e4a" className="pointer-events-none">如何理解时代</text>
              {ps.slice(0,6).map((p,i) => <circle key={p.slug} cx={cx+(dotPos[i]?.dx??0)} cy={cy+(dotPos[i]?.dy??10)} r="2.4" fill="#2a6a9a" opacity="0.7" className="pointer-events-none" />)}
              <text x={cx} y={cy+28} textAnchor="middle" fontSize="7.5" fill="#3a7aaa" opacity="0.7" className="pointer-events-none">{byQ.get(qn)?.wisePersons.length ?? 0} 位</text>
            </a>
          )
        })()}

        {/* 溪边植物 */}
        <g stroke="#4a7a50" strokeWidth="1.6" fill="none">
          <line x1="22" y1="270" x2="16" y2="237" /><line x1="36" y1="270" x2="43" y2="230" /><line x1="51" y1="270" x2="48" y2="240" />
        </g>
        <ellipse cx="16" cy="233" rx="5" ry="9" fill="#5a8a58" opacity="0.75" />
        <ellipse cx="43" cy="226" rx="5" ry="9" fill="#6a9a68" opacity="0.75" />
        <g stroke="#4a7a50" strokeWidth="1.6" fill="none">
          <line x1="858" y1="270" x2="852" y2="237" /><line x1="873" y1="270" x2="880" y2="230" /><line x1="888" y1="270" x2="885" y2="240" />
        </g>
        <ellipse cx="852" cy="233" rx="5" ry="9" fill="#5a8a58" opacity="0.75" />
        <ellipse cx="880" cy="226" rx="5" ry="9" fill="#6a9a68" opacity="0.75" />

        {/* 行人 Q08 */}
        {(() => {
          const x = 160; const y = 242; const qn = 8
          const question = q(qn)
          if (!question) return null
          return (
            <a href={ROUTES.questionDetail(question.id)} className="cursor-pointer">
              <g transform={`translate(${x},${y})`}>
                <ellipse cx="0" cy="-18" rx="8" ry="9" fill="#3a2010" />
                <line x1="0" y1="-9" x2="0" y2="10" stroke="#3a2010" strokeWidth="2.8" />
                <line x1="0" y1="0" x2="-12" y2="7" stroke="#3a2010" strokeWidth="2" />
                <line x1="0" y1="0" x2="12" y2="5" stroke="#3a2010" strokeWidth="2" />
                <line x1="0" y1="10" x2="-9" y2="25" stroke="#3a2010" strokeWidth="2.2" />
                <line x1="0" y1="10" x2="8" y2="26" stroke="#3a2010" strokeWidth="2.2" />
                <circle cx="0" cy="-32" r="5" fill="#c07050" opacity="0.9" className="pointer-events-none" />
                <text x="0" y="-42" textAnchor="middle" fontSize="9" fill="#3a1a0a" fontWeight="bold" className="pointer-events-none">Q08</text>
                <text x="0" y="-53" textAnchor="middle" fontSize="8" fill="#4a2a18" className="pointer-events-none">如何理解人性</text>
              </g>
            </a>
          )
        })()}

        {/* 行人 Q09 */}
        {(() => {
          const x = 450; const y = 248; const qn = 9
          const question = q(qn)
          if (!question) return null
          return (
            <a href={ROUTES.questionDetail(question.id)} className="cursor-pointer">
              <g transform={`translate(${x},${y})`}>
                <ellipse cx="0" cy="-18" rx="8" ry="9" fill="#3a2010" />
                <line x1="0" y1="-9" x2="0" y2="10" stroke="#3a2010" strokeWidth="2.8" />
                <line x1="0" y1="0" x2="-12" y2="6" stroke="#3a2010" strokeWidth="2" />
                <line x1="0" y1="0" x2="10" y2="8" stroke="#3a2010" strokeWidth="2" />
                <line x1="0" y1="10" x2="-9" y2="25" stroke="#3a2010" strokeWidth="2.2" />
                <line x1="0" y1="10" x2="7" y2="26" stroke="#3a2010" strokeWidth="2.2" />
                <circle cx="0" cy="-32" r="5" fill="#c07050" opacity="0.9" className="pointer-events-none" />
                <text x="0" y="-42" textAnchor="middle" fontSize="9" fill="#3a1a0a" fontWeight="bold" className="pointer-events-none">Q09</text>
                <text x="0" y="-53" textAnchor="middle" fontSize="8" fill="#4a2a18" className="pointer-events-none">如何理解身体</text>
              </g>
            </a>
          )
        })()}

        {/* 行人 Q10 */}
        {(() => {
          const x = 740; const y = 244; const qn = 10
          const question = q(qn)
          if (!question) return null
          return (
            <a href={ROUTES.questionDetail(question.id)} className="cursor-pointer">
              <g transform={`translate(${x},${y})`}>
                <ellipse cx="0" cy="-18" rx="8" ry="9" fill="#3a2010" />
                <line x1="0" y1="-9" x2="0" y2="10" stroke="#3a2010" strokeWidth="2.8" />
                <line x1="0" y1="0" x2="-10" y2="7" stroke="#3a2010" strokeWidth="2" />
                <line x1="0" y1="0" x2="11" y2="6" stroke="#3a2010" strokeWidth="2" />
                <line x1="0" y1="10" x2="-7" y2="26" stroke="#3a2010" strokeWidth="2.2" />
                <line x1="0" y1="10" x2="9" y2="25" stroke="#3a2010" strokeWidth="2.2" />
                <circle cx="0" cy="-32" r="5" fill="#c07050" opacity="0.9" className="pointer-events-none" />
                <text x="0" y="-42" textAnchor="middle" fontSize="9" fill="#3a1a0a" fontWeight="bold" className="pointer-events-none">Q10</text>
                <text x="0" y="-53" textAnchor="middle" fontSize="8" fill="#4a2a18" className="pointer-events-none">如何理解信仰</text>
              </g>
            </a>
          )
        })()}

        {/* 溪流 */}
        <rect x="0" y="264" width="900" height="50" fill="url(#m-stream)" />
        <rect x="0" y="264" width="900" height="50" fill="url(#m-ripple)" />
        <path d="M0 274 Q225 264 450 272 Q675 280 900 267" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />

        {/* 元 Q01 */}
        {(() => {
          const question = q(1)
          if (!question) return null
          return (
            <a href={ROUTES.questionDetail(question.id)} className="cursor-pointer">
              <g filter="url(#m-halo)">
                <ellipse cx="450" cy="289" rx="56" ry="22" fill="#f0d060" opacity="0.28" />
              </g>
              <ellipse cx="450" cy="289" rx="44" ry="17" fill="url(#m-yuan)" stroke="#9a7a10" strokeWidth="1.8" />
              <text x="450" y="284" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2a1200" className="pointer-events-none">元</text>
              <text x="450" y="298" textAnchor="middle" fontSize="8" fill="#4a2800" letterSpacing="1.5" className="pointer-events-none">知识之源  Q01</text>
            </a>
          )
        })()}

        {/* 水面 */}
        <rect x="0" y="314" width="900" height="206" fill="url(#m-water)" />
        <path d="M0 314 Q150 328 300 320 Q450 312 600 326 Q750 340 900 322 L900 355 L0 355Z" fill="#90b8c8" opacity="0.3" />
        <text x="32" y="340" fontSize="10" fill="#2a4a5a" letterSpacing="5" opacity="0.7">地 · 方形三问</text>

        {/* 地 Q05 */}
        {(() => {
          const [x,y,w,h,cx,cy,qn] = [68,352,172,108,154,400,5]
          const question = q(qn)
          const ps = getTopPersons(byQ.get(qn)?.wisePersons ?? [])
          if (!question) return null
          const stroke = "#8a7030"; const fill = "#d8c8a0"
          const gdotPos = [{dx:-20,dy:10},{dx:0,dy:14},{dx:20,dy:10},{dx:-10,dy:20},{dx:10,dy:20},{dx:-28,dy:4},{dx:28,dy:4},{dx:0,dy:4}]
          return (
            <a key={qn} href={ROUTES.questionDetail(question.id)} className="cursor-pointer">
              <rect x={x} y={y} width={w} height={h} rx="3" fill={fill} stroke={stroke} strokeWidth={1.6} />
              <rect x={x+6} y={y+6} width={w-12} height={h-12} rx="2" fill="none" stroke={stroke} strokeWidth="0.6" strokeDasharray="4,3" opacity="0.5" />
              <circle cx={cx} cy={cy-14} r="4.5" fill={stroke} opacity="0.9" className="pointer-events-none" />
              <text x={cx} y={cy-25} textAnchor="middle" fontSize="9" fill="#1a0800" fontWeight="bold" className="pointer-events-none">Q05</text>
              <text x={cx} y={cy-36} textAnchor="middle" fontSize="9" fill="#1a0800" className="pointer-events-none">如何理解社会</text>
              {ps.slice(0,6).map((p,i) => <circle key={p.slug} cx={cx+(gdotPos[i]?.dx??0)} cy={cy+(gdotPos[i]?.dy??0)} r="2.3" fill={stroke} opacity="0.7" className="pointer-events-none" />)}
              <text x={cx} y={y+h-8} textAnchor="middle" fontSize="7.5" fill={stroke} opacity="0.7" className="pointer-events-none">{byQ.get(qn)?.wisePersons.length ?? 0} 位</text>
            </a>
          )
        })()}

        {/* 地 Q06 */}
        {(() => {
          const [x,y,w,h,cx,cy,qn] = [364,344,172,116,450,400,6]
          const question = q(qn)
          const ps = getTopPersons(byQ.get(qn)?.wisePersons ?? [])
          if (!question) return null
          const stroke = "#5a8040"; const fill = "#c8d8b8"
          const gdotPos = [{dx:-20,dy:10},{dx:0,dy:14},{dx:20,dy:10},{dx:-10,dy:20},{dx:10,dy:20},{dx:-28,dy:4},{dx:28,dy:4},{dx:0,dy:4}]
          return (
            <a key={qn} href={ROUTES.questionDetail(question.id)} className="cursor-pointer">
              <rect x={x} y={y} width={w} height={h} rx="3" fill={fill} stroke={stroke} strokeWidth={1.6} />
              <rect x={x+6} y={y+6} width={w-12} height={h-12} rx="2" fill="none" stroke={stroke} strokeWidth="0.6" strokeDasharray="4,3" opacity="0.5" />
              <circle cx={cx} cy={cy-14} r="4.5" fill={stroke} opacity="0.9" className="pointer-events-none" />
              <text x={cx} y={cy-25} textAnchor="middle" fontSize="9" fill="#0a1800" fontWeight="bold" className="pointer-events-none">Q06</text>
              <text x={cx} y={cy-36} textAnchor="middle" fontSize="9" fill="#0a1800" className="pointer-events-none">如何理解组织</text>
              {ps.slice(0,6).map((p,i) => <circle key={p.slug} cx={cx+(gdotPos[i]?.dx??0)} cy={cy+(gdotPos[i]?.dy??0)} r="2.3" fill={stroke} opacity="0.7" className="pointer-events-none" />)}
              <text x={cx} y={y+h-8} textAnchor="middle" fontSize="7.5" fill={stroke} opacity="0.7" className="pointer-events-none">{byQ.get(qn)?.wisePersons.length ?? 0} 位</text>
            </a>
          )
        })()}

        {/* 地 Q07 */}
        {(() => {
          const [x,y,w,h,cx,cy,qn] = [660,352,172,108,746,400,7]
          const question = q(qn)
          const ps = getTopPersons(byQ.get(qn)?.wisePersons ?? [])
          if (!question) return null
          const stroke = "#8a5030"; const fill = "#d8c0b0"
          const gdotPos = [{dx:-20,dy:10},{dx:0,dy:14},{dx:20,dy:10},{dx:-10,dy:20},{dx:10,dy:20},{dx:-28,dy:4},{dx:28,dy:4},{dx:0,dy:4}]
          return (
            <a key={qn} href={ROUTES.questionDetail(question.id)} className="cursor-pointer">
              <rect x={x} y={y} width={w} height={h} rx="3" fill={fill} stroke={stroke} strokeWidth={1.6} />
              <rect x={x+6} y={y+6} width={w-12} height={h-12} rx="2" fill="none" stroke={stroke} strokeWidth="0.6" strokeDasharray="4,3" opacity="0.5" />
              <circle cx={cx} cy={cy-14} r="4.5" fill={stroke} opacity="0.9" className="pointer-events-none" />
              <text x={cx} y={cy-25} textAnchor="middle" fontSize="9" fill="#1a0600" fontWeight="bold" className="pointer-events-none">Q07</text>
              <text x={cx} y={cy-36} textAnchor="middle" fontSize="9" fill="#1a0600" className="pointer-events-none">如何理解家庭</text>
              {ps.slice(0,6).map((p,i) => <circle key={p.slug} cx={cx+(gdotPos[i]?.dx??0)} cy={cy+(gdotPos[i]?.dy??0)} r="2.3" fill={stroke} opacity="0.7" className="pointer-events-none" />)}
              <text x={cx} y={y+h-8} textAnchor="middle" fontSize="7.5" fill={stroke} opacity="0.7" className="pointer-events-none">{byQ.get(qn)?.wisePersons.length ?? 0} 位</text>
            </a>
          )
        })()}

        {/* 题词 */}
        <rect x="0" y="480" width="900" height="40" fill="rgba(160,200,216,0.18)" />
        <text x="450" y="504" textAnchor="middle" fontSize="10" fill="#3a5a6a" letterSpacing="2" opacity="0.85">
          天上有行云，人在行云里 —— 辛弃疾
        </text>
      </svg>

      {/* 提示 */}
      <div className="text-center py-3 text-sm text-muted-foreground/60">
        点击问题区域，探索对应的智者与著作
      </div>
    </div>
  )
}
