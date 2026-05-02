"use client"

import type { WisePerson } from "@/types"
import { WisePersonCard } from "./WisePersonCard"

interface WisePersonGridProps {
  wisePersons: WisePerson[]
}

export function WisePersonGrid({ wisePersons }: WisePersonGridProps) {
  if (wisePersons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground">暂无匹配的智者</p>
        <p className="text-xs text-muted-foreground/60 mt-1">尝试调整筛选条件</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {wisePersons.map((person) => (
        <WisePersonCard key={person.id} wisePerson={person} />
      ))}
    </div>
  )
}
