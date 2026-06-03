import Link from "next/link"
import { ROUTES } from "@/constants"
import { masterContent } from "@/data/master-content"
import mastersMeta from "../../../高手库/metadata.json"

export default function MastersPage() {
  const masters = mastersMeta.masters

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">高手库</h1>
      <p className="text-sm text-muted-foreground mb-6">
        利用人生发展学对高手的人生发展进行编码——他们的人格特质、认知方式、发展阶段、做对与做错的事。
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {masters.map((m) => {
          const content = masterContent[m.slug]
          const hasAnalysis = content?.hasMasterAnalysis
          const stageCount = content?.stages?.length ?? 0

          return (
            <Link
              key={m.slug}
              href={ROUTES.wisePersonDetail(m.slug)}
              className="rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-sm">{m.name}</h3>
                  <p className="text-xs text-muted-foreground">{m.english_name}</p>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{m.years}</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{m.era}</span>
                {hasAnalysis && (
                  <span className="text-blue-600 font-medium">
                    已分析 · {stageCount} 个发展阶段
                  </span>
                )}
                {!hasAnalysis && <span className="text-gray-400">待分析</span>}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
