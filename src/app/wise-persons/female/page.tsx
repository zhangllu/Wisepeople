"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getFemaleWisePersons } from "@/lib/data/female-wise-persons"
import { WisePersonCard } from "@/components/wise-person/WisePersonCard"

export default function FemaleWisePersonsPage() {
  const femaleWisePersons = getFemaleWisePersons()

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Back link */}
      <Link
        href="/wise-persons"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        返回智者库
      </Link>

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">女性智者</h1>
        <p className="text-sm text-muted-foreground">
          共收录 {femaleWisePersons.length} 位女性智者。点击卡片查看人物故事和相关链接。
        </p>
      </div>

      {/* Female wise persons grid */}
      {femaleWisePersons.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {femaleWisePersons.map((person) => (
            <WisePersonCard key={person.slug} wisePerson={person} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground/50 italic">暂无数据</p>
      )}
    </div>
  )
}
