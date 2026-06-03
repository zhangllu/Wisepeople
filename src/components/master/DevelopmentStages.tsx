"use client"

import { useActiveSection } from "@/hooks/use-in-view"
import { ReferenceSection } from "@/components/master/ReferenceSection"
import type { DevelopmentStage, Reference } from "@/types/master"

interface Props {
  stages: DevelopmentStage[]
  references?: Reference[]
}

function StageCard({
  stage,
  index,
  isActive,
  setRef,
}: {
  stage: DevelopmentStage
  index: number
  isActive: boolean
  setRef: (el: HTMLElement | null) => void
}) {
  return (
    <div
      ref={setRef}
      data-stage-index={index}
      id={`stage-${index}`}
    >
      <div
        className={`rounded-lg border p-5 transition-all duration-300 ${
          isActive
            ? "border-blue-300 bg-blue-50/40 shadow-sm"
            : "border-gray-200 bg-white"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold">{stage.name}</h3>
          <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded">
            {stage.ageRange}岁 · {stage.years} · {stage.duration}年
          </span>
        </div>

        <div className="space-y-2.5 text-sm leading-relaxed">
          <div>
            <span className="font-semibold text-gray-700">核心主题：</span>
            <span>{stage.coreTheme}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-amber-600 shrink-0">⚡</span>
            <div>
              <span className="font-semibold text-gray-700">核心挑战：</span>
              <span>{stage.coreChallenge}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-green-600 shrink-0">✅</span>
            <div>
              <span className="font-semibold text-gray-700">关键行动：</span>
              <span>{stage.keyActions}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-blue-600 shrink-0">🧠</span>
            <div>
              <span className="font-semibold text-gray-700">认知升级：</span>
              <span>{stage.cognitiveUpgrade}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-emerald-600 shrink-0">👍</span>
            <div>
              <span className="font-semibold text-gray-700">做对了：</span>
              <span>{stage.didRight}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-red-500 shrink-0">👎</span>
            <div>
              <span className="font-semibold text-gray-700">做错了/局限：</span>
              <span>{stage.didWrong}</span>
            </div>
          </div>

          {stage.advice && (
            <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
              <div className="flex gap-2">
                <span className="text-purple-600 shrink-0">💡</span>
                <div>
                  <span className="font-semibold text-gray-700">
                    人生发展学评注：
                  </span>
                  <span className="text-gray-600">{stage.advice}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TimelineNav({
  stages,
  activeIndex,
}: {
  stages: DevelopmentStage[]
  activeIndex: number
}) {
  function scrollToStage(index: number) {
    const el = document.getElementById(`stage-${index}`)
    el?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <nav className="sticky top-24" aria-label="发展阶段时间线">
      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        人生阶段
      </h4>
      <div className="relative">
        {/* Vertical connecting line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-200" />

        <ul className="space-y-0">
          {stages.map((stage, i) => {
            const isActive = i === activeIndex
            const isPast = i < activeIndex
            return (
              <li key={i}>
                <button
                  onClick={() => scrollToStage(i)}
                  className={`relative flex items-center gap-3 w-full text-left py-2.5 px-1 rounded-lg transition-all ${
                    isActive
                      ? "text-blue-700 font-semibold"
                      : isPast
                        ? "text-gray-500"
                        : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {/* Dot */}
                  <span
                    className={`relative z-10 w-[15px] h-[15px] rounded-full border-2 shrink-0 transition-all ${
                      isActive
                        ? "border-blue-500 bg-blue-500 shadow-sm shadow-blue-300"
                        : isPast
                          ? "border-gray-300 bg-gray-100"
                          : "border-gray-300 bg-white"
                    }`}
                  />
                  <span className="text-xs leading-tight">{stage.name}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Stage count badge */}
      <div className="mt-4 text-xs text-muted-foreground bg-gray-50 rounded-lg p-2 text-center">
        {stages.length} 个阶段 ·{" "}
        {stages.reduce((s, st) => s + st.duration, 0)} 年人生
      </div>
    </nav>
  )
}

export function DevelopmentStages({ stages, references }: Props) {
  const { activeIndex, setSectionRef } = useActiveSection(stages.length)

  return (
    <div className="flex gap-8">
      {/* Timeline navigation - sticky on desktop */}
      <div className="hidden md:block w-32 lg:w-36 shrink-0">
        <TimelineNav stages={stages} activeIndex={activeIndex} />
      </div>

      {/* Stage cards */}
      <div className="flex-1 space-y-6">
        <p className="text-sm text-muted-foreground mb-4">
          滚动浏览各发展阶段，左侧时间轴会同步高亮当前位置。
          每个阶段包含核心挑战、关键行动、认知升级，以及做对了/做错了什么。
        </p>
        {stages.map((stage, i) => (
          <StageCard
            key={i}
            stage={stage}
            index={i}
            isActive={i === activeIndex}
            setRef={setSectionRef(i)}
          />
        ))}
        <ReferenceSection references={references ?? []} />
      </div>
    </div>
  )
}
