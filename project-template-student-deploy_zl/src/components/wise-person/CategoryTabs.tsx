"use client"

import type { CategoryOption } from "@/types"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CategoryTabsProps {
  options: CategoryOption[]
  value: string
  onChange: (value: string) => void
}

export function CategoryTabs({ options, value, onChange }: CategoryTabsProps) {
  return (
    <Tabs value={value} onValueChange={onChange} className="w-full">
      <TabsList className="h-auto flex-wrap">
        {options.map((opt) => (
          <TabsTrigger key={opt.id} value={opt.value} className="text-xs">
            {opt.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
