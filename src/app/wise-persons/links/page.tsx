import { ExternalLink } from "lucide-react"
import authorsData from "@/data/authors.json"
import batch001 from "@/data/links/curated-links-001.json"
import batch002 from "@/data/links/curated-links-002.json"
import batch003 from "@/data/links/curated-links-003.json"
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

const authorSlugMap = new Map<string, string>()
for (const a of authorsData) {
  authorSlugMap.set(a.slug, a.name)
}

const BATCHES: BatchModule[] = [batch001, batch002, batch003]

function getDisplayName(slug: string): string {
  return authorSlugMap.get(slug) ?? slug
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

function LinkCard({ link }: { link: WisePersonLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg border border-gray-200 p-3 hover:border-blue-200 hover:bg-blue-50/30 transition-colors group cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <span className="font-medium text-blue-700 group-hover:text-blue-800 text-sm">
            {link.label}
          </span>
          {link.description && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{link.description}</p>
          )}
        </div>
        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-gray-400 group-hover:text-blue-500 mt-0.5 ml-2" />
      </div>
    </a>
  )
}

export default function CuratedLinksPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">精选链接</h1>
        <p className="text-sm text-muted-foreground">
          智者资料的精选外部链接汇总，按批次组织。每批 48 位作者。
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
            已处理 {progress.summary.done} / {progress.total_authors} 位作者
          </span>
          <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
            进度 {progress.summary.progress}
          </span>
        </div>
      </div>

      {/* Batches */}
      <div className="space-y-8">
        {BATCHES.map((batch) => {
          const meta = batch._meta as BatchMeta
          const entries = Object.entries(batch).filter(
            ([key]) => key !== "_meta"
          ) as [string, WisePersonLink[]][]
          const totalLinks = entries.reduce((sum, [, links]) => sum + links.length, 0)

          return (
            <section key={meta.batch} className="rounded-xl border border-gray-200 overflow-hidden">
              {/* Batch header */}
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h2 className="text-base font-semibold">
                      第 {meta.batch} 批
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(meta.date)} · {meta.range} · {entries.length} 位作者 · {totalLinks} 条链接
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {meta.date}
                  </span>
                </div>
              </div>

              {/* Author list */}
              <div className="divide-y divide-gray-100">
                {entries.map(([slug, links]) => (
                  <details key={slug} className="group">
                    <summary className="flex items-center justify-between px-5 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors text-sm">
                      <span className="font-medium text-gray-900">
                        {getDisplayName(slug)}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">
                        {links.length} 条链接
                      </span>
                    </summary>
                    <div className="px-5 pb-3 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {links.map((link, i) => (
                        <LinkCard key={i} link={link} />
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
