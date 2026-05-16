"use client"

import { useState } from "react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { BookmarkButton } from "@/components/shared/BookmarkButton"
import { ExternalLink } from "lucide-react"
import type { WisePerson } from "@/types"

type TabType = "introduction" | "basicInfo" | "cognitiveStyle" | "links"

interface WisePersonContent {
  introduction: string | null
  basicInfo: string | null
  cognitiveStyle: string | null
}

const TAB_LABELS: Record<string, string> = {
  "introduction": "简介",
  "basicInfo": "基本信息",
  "cognitiveStyle": "认知方式",
  "links": "相关链接",
}

interface Props {
  slug: string
  person: WisePerson
  preloadedContent: WisePersonContent
}

export function WisePersonDetailTabs({ person, preloadedContent }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("introduction")
  const content = preloadedContent
  const isLinksTab = activeTab === "links"
  const tabContent = isLinksTab ? null : content[activeTab as keyof WisePersonContent]

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
          <button
            onClick={() => setActiveTab("links")}
            className={`px-4 py-2 rounded-t-lg transition-colors ${
              activeTab === "links"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"
            }`}
            disabled={!person.links?.length && !person.wikipediaLink}
          >
            {TAB_LABELS["links"]}
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === "links" ? (
        <div className="space-y-3">
          {(person.links?.length ? person.links : person.wikipediaLink ? [{ label: "维基百科", url: person.wikipediaLink, description: "完整的生平与核心思想介绍" }] : []).map(
            (link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault()
                  window.open(link.url, "_blank", "noopener,noreferrer")
                }}
                className="block rounded-lg border border-gray-200 p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-colors group cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-medium text-blue-700 group-hover:text-blue-800 text-sm">
                      {link.label}
                    </span>
                    {link.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{link.description}</p>
                    )}
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-blue-500 mt-0.5" />
                </div>
              </a>
            )
          )}
        </div>
      ) : (
        <div className="prose prose-sm max-w-none">
          {tabContent ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{tabContent}</ReactMarkdown>
          ) : (
            <p className="text-muted-foreground">
              此内容暂未完善
            </p>
          )}
        </div>
      )}

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
