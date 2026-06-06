"use client"

import { ExternalLink } from "lucide-react"
import type { Reference } from "@/types/master"

interface Props {
  references: Reference[]
}

export function ReferenceSection({ references }: Props) {
  if (!references || references.length === 0) return null

  // Group by category
  const grouped: Record<string, Reference[]> = {}
  for (const ref of references) {
    const cat = ref.category ?? "其他"
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(ref)
  }

  return (
    <div className="mt-10 pt-6 border-t border-gray-200">
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
        参考资料
      </h3>
      <div className="space-y-3">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <span className="text-xs text-muted-foreground bg-gray-100 px-1.5 py-0.5 rounded">
              {category}
            </span>
            <ul className="mt-1.5 space-y-1">
              {items.map((ref, i) => (
                <li key={i} className="text-xs text-gray-500 leading-relaxed">
                  {ref.url ? (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-accent hover:text-accent/80 hover:underline"
                    >
                      {ref.label}
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  ) : (
                    <span>{ref.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
