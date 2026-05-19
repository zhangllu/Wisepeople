"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { useState } from "react"
import authorsData from "@/data/authors.json"
import batch001 from "@/data/links/curated-links-001.json"
import batch002 from "@/data/links/curated-links-002.json"
import batch003 from "@/data/links/curated-links-003.json"
import batch004 from "@/data/links/curated-links-004.json"
import batch005 from "@/data/links/curated-links-005.json"
import batch006 from "@/data/links/curated-links-006.json"
import batch007 from "@/data/links/curated-links-007.json"
import batch008 from "@/data/links/curated-links-008.json"
import batch009 from "@/data/links/curated-links-009.json"
import batch010 from "@/data/links/curated-links-010.json"
import batch011 from "@/data/links/curated-links-011.json"
import progress from "@/data/links/PROGRESS.json"
import type { WisePersonLink } from "@/types"

interface BatchMeta {
  batch: number
  date: string
  range: string
  count: number
}

interface BatchModule {
  _meta: BatchMeta
  [slug: string]: BatchMeta | WisePersonLink[] | unknown
}

const BATCHES: BatchModule[] = [batch001, batch002, batch003, batch004, batch005, batch006, batch007, batch008, batch009, batch010, batch011]
const authorSlugMap = new Map<string, string>()
for (const a of authorsData) {
  authorSlugMap.set(a.slug, a.name)
}

function getDisplayName(slug: string): string {
  return authorSlugMap.get(slug) ?? slug
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

export default function UpdatedPage() {
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  const allBatches = BATCHES.map((batch) => {
    const meta = batch._meta as BatchMeta
    const entries = Object.entries(batch).filter(
      ([key]) => key !== "_meta"
    ) as [string, WisePersonLink[]][]
    const authors = entries
      .filter(([, links]) => links.length > 0)
      .map(([slug, links]) => ({ slug, name: getDisplayName(slug), count: links.length }))
    return { meta, authors }
  }).filter((b) => b.authors.length > 0)

  const total = allBatches.reduce((s, b) => s + b.authors.length, 0)

  function toggle(batch: number) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(batch)) {
        next.delete(batch)
      } else {
        next.add(batch)
      }
      return next
    })
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">已更新智者</h1>
      <p className="text-sm text-muted-foreground mb-6">
        已完善精选链接的 {total} 位智者。点击批次名展开名单，点击姓名查看人物故事和相关链接。
      </p>

      <div className="space-y-2">
        {allBatches.map(({ meta, authors }) => {
          const isOpen = expanded.has(meta.batch)
          return (
            <div key={meta.batch} className="rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggle(meta.batch)}
                className="w-full flex items-center justify-between bg-gray-50 px-4 py-3 text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                <span>
                  第 {meta.batch} 批 · {formatDate(meta.date)} · {authors.length} 位
                </span>
                <ChevronRight
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    isOpen ? "rotate-90" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="divide-y divide-gray-100">
                  {authors.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/wise-persons/${a.slug}`}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-blue-50/30 transition-colors group text-sm"
                    >
                      <span className="group-hover:text-blue-700 transition-colors">{a.name}</span>
                      <span className="text-xs text-muted-foreground">{a.count} 条链接</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
