"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useWisePersonStore } from "@/lib/stores"
import { BookmarkButton } from "@/components/shared/BookmarkButton"

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
}

export function WisePersonDetailTabs({ slug }: Props) {
  const { getWisePersonBySlug } = useWisePersonStore()

  const [activeTab, setActiveTab] = useState<TabType>("introduction")
  const [content, setContent] = useState<WisePersonContent>({
    introduction: null,
    basicInfo: null,
    cognitiveStyle: null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const person = getWisePersonBySlug(slug)

  useEffect(() => {
    async function loadContent() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/wise-persons/${slug}`)
        if (!response.ok) {
          throw new Error('Failed to load content')
        }
        const data = await response.json()
        setContent(data)
      } catch (err) {
        console.error('Error loading content:', err)
        setError('加载内容失败')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      loadContent()
    }
  }, [slug])

  if (!person) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <p className="text-muted-foreground">智者不存在</p>
      </div>
    )
  }

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
        {loading ? (
          <p className="text-muted-foreground">加载中…</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : tabContent ? (
          <div dangerouslySetInnerHTML={{ __html: tabContent }} />
        ) : (
          <p className="text-muted-foreground">
            此内容暂未完善
          </p>
        )}
      </div>

      {/* Works Section */}
      {person.works && person.works.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold mb-4">相关著作</h2>
          <div className="space-y-4">
            {person.works.map((work) => (
              <div
                key={work.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {work.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {work.authorName}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      {work.summary}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {work.recommendation}
                    </p>
                  </div>
                  <BookmarkButton targetId={work.slug} targetType="work" />
                </div>
              </div>
            ))}
          </div>
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
