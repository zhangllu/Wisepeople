"use client"

import { useWisePersonStore } from "@/lib/stores"
import { ERA_OPTIONS, DISCIPLINE_OPTIONS, REGION_OPTIONS } from "@/constants"
import { CategoryTabs } from "@/components/wise-person/CategoryTabs"
import { WisePersonGrid } from "@/components/wise-person/WisePersonGrid"

export default function WisePersonsPage() {
  const { filteredWisePersons, activeEra, activeDiscipline, activeRegion, setEra, setDiscipline, setRegion } = useWisePersonStore()
  const persons = filteredWisePersons()

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">智者库</h1>
        <p className="text-sm text-muted-foreground">
          浏览人类文明史上 788 位智者（含 778 位通识千书作者），按学科、时代、地区分类探索
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-8">
        <div>
          <span className="text-xs text-muted-foreground mb-1 block">学科</span>
          <CategoryTabs options={DISCIPLINE_OPTIONS} value={activeDiscipline} onChange={(v) => setDiscipline(v as any)} />
        </div>
        <div>
          <span className="text-xs text-muted-foreground mb-1 block">时代</span>
          <CategoryTabs options={ERA_OPTIONS} value={activeEra} onChange={(v) => setEra(v as any)} />
        </div>
        <div>
          <span className="text-xs text-muted-foreground mb-1 block">地区</span>
          <CategoryTabs options={REGION_OPTIONS} value={activeRegion} onChange={(v) => setRegion(v as any)} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-4">
        共 {persons.length} 位智者
      </p>

      <WisePersonGrid wisePersons={persons} />
    </div>
  )
}
