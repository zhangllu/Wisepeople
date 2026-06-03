"use client"

import { ReferenceSection } from "@/components/master/ReferenceSection"
import type { TransferablePrinciple, Pitfall, Reference } from "@/types/master"

interface Props {
  transferablePrinciples: TransferablePrinciple[]
  pitfalls: Pitfall[]
  references?: Reference[]
}

export function DevelopmentLessons({ transferablePrinciples, pitfalls, references }: Props) {
  const hasData =
    transferablePrinciples.length > 0 || pitfalls.length > 0

  if (!hasData) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        发展启示内容暂未完善
      </p>
    )
  }

  return (
    <div className="space-y-10">
      {/* 可迁移原则 */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <span className="text-xl">📋</span>
          <h2 className="text-lg font-bold">可迁移原则</h2>
          <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded">
            王阳明做对了什么
          </span>
        </div>
        <div className="space-y-3">
          {transferablePrinciples.map((item, i) => (
            <div
              key={i}
              className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-4 hover:border-emerald-300 transition-colors"
            >
              <div className="flex gap-3">
                <span className="text-emerald-600 font-bold text-sm mt-0.5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {item.principle}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 可吸取教训 */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <span className="text-xl">⚠️</span>
          <h2 className="text-lg font-bold">可吸取教训</h2>
          <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded">
            王阳明做错了什么
          </span>
        </div>
        <div className="space-y-3">
          {pitfalls.map((item, i) => (
            <div
              key={i}
              className="rounded-lg border border-amber-200 bg-amber-50/30 p-4 hover:border-amber-300 transition-colors"
            >
              <div className="flex gap-3">
                <span className="text-amber-600 font-bold text-sm mt-0.5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {item.lesson}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ReferenceSection references={references ?? []} />
    </div>
  )
}
