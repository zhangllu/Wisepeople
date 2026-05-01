"use client"

import { useState } from "react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { BookmarkButton } from "@/components/shared/BookmarkButton"
import type { WisePerson } from "@/types"

type TabType = "introduction" | "basicInfo" | "cognitiveStyle"

interface WisePersonContent {
  introduction: string | null
  basicInfo: string | null
  cognitiveStyle: string | null
}

const TAB_LABELS: Record<TabType, string> = {
  "introduction": "简介",
  "basicInfo": "基本信息",
  "cognitiveStyle": "认知方式",
}

interface Props {
  slug: string
  person: WisePerson
  preloadedContent: WisePersonContent
}

export function WisePersonDetailTabs({ person, preloadedContent }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("introduction")
  const content = preloadedContent
  const tabContent = content[activeTab]

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">{person.name}</h1>
            {person.nameEn && (
              <p className="text-sm text-muted-foreground">{person.nameEn}</p>
            )}
          </div>
          <BookmarkButton targetId={person.slug} targetType="wise-person" />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab("introduction")}
            className={`px-4 py-2 rounded-t-lg transition-colors ${
              activeTab === "introduction"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {TAB_LABELS["introduction"]}
          </button>
          <button
            onClick={() => setActiveTab("basicInfo")}
            className={`px-4 py-2 rounded-t-lg transition-colors ${
              activeTab === "basicInfo"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"
            }`}
            disabled={!content.basicInfo}
          >
            {TAB_LABELS["basicInfo"]}
          </button>
          <button
            onClick={() => setActiveTab("cognitiveStyle")}
            className={`px-4 py-2 rounded-t-lg transition-colors ${
              activeTab === "cognitiveStyle"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"
            }`}
            disabled={!content.cognitiveStyle}
          >
            {TAB_LABELS["cognitiveStyle"]}
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="prose prose-sm max-w-none">
        {tabContent ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{tabContent}</ReactMarkdown>
        ) : (
          <p className="text-muted-foreground">
            此内容暂未完善
          </p>
        )}
      </div>

      {/* Back link */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <Link
          href="/wise-persons"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          ← 返回智者列表
        </Link>
      </div>
    </div>
  )
}
