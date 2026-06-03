"use client"

import { useState } from "react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { BookmarkButton } from "@/components/shared/BookmarkButton"
import { ExternalLink } from "lucide-react"
import { DevelopmentStages } from "@/components/master/DevelopmentStages"
import { LifeNarrative } from "@/components/master/LifeNarrative"
import { DevelopmentLessons } from "@/components/master/DevelopmentLessons"
import type { WisePerson } from "@/types"
import type { MasterContentEntry } from "@/types/master"
import wisePersonCodes from "@/data/wise-person-codes.json"

type TabType = "introduction" | "basicInfo" | "cognitiveStyle" | "developmentStages" | "lifeNarrative" | "developmentLessons" | "links"

interface WisePersonContent {
  introduction: string | null
  basicInfo: string | null
  cognitiveStyle: string | null
}

const TAB_LABELS: Record<string, string> = {
  "introduction": "简介",
  "basicInfo": "基本信息",
  "cognitiveStyle": "认知方式",
  "developmentStages": "发展阶段",
  "lifeNarrative": "人生叙事",
  "developmentLessons": "发展启示",
  "links": "相关链接",
}

interface Props {
  slug: string
  person: WisePerson
  preloadedContent: WisePersonContent
  masterContent?: MasterContentEntry
}

/** Individual tab button with optional "新" badge */
function TabButton({
  label,
  isActive,
  onClick,
  disabled,
  badge,
}: {
  label: string
  isActive: boolean
  onClick: () => void
  disabled?: boolean
  badge?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative px-4 py-2 rounded-t-lg transition-colors whitespace-nowrap text-sm ${
        isActive
          ? "bg-blue-500 text-white"
          : disabled
            ? "text-gray-300 cursor-not-allowed"
            : "hover:bg-gray-100 text-gray-600"
      }`}
    >
      {label}
      {badge && !isActive && (
        <span className="absolute -top-1 -right-1 text-[10px] bg-red-400 text-white px-1 rounded-full">
          {badge}
        </span>
      )}
    </button>
  )
}

export function WisePersonDetailTabs({ person, preloadedContent, masterContent }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>(
    masterContent?.hasMasterAnalysis ? "developmentStages" : "introduction",
  )
  const content = preloadedContent
  const isLinksTab = activeTab === "links"
  const tabContent = isLinksTab ? null : content[activeTab as keyof WisePersonContent]

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{person.name}</h1>
              {(wisePersonCodes as any).slugToCode?.[person.slug] && (
                <span className="font-mono text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                  {(wisePersonCodes as any).slugToCode[person.slug]}
                </span>
              )}
            </div>
            {person.nameEn && (
              <p className="text-sm text-muted-foreground mt-1">{person.nameEn}</p>
            )}
          </div>
          <BookmarkButton targetId={person.slug} targetType="wise-person" />
        </div>
      </div>

      {/* Tabs - scrollable on mobile */}
      <div className="border-b border-gray-200 mb-6 overflow-x-auto">
        <nav className="flex gap-4 min-w-max">
          <TabButton
            label={TAB_LABELS["introduction"]}
            isActive={activeTab === "introduction"}
            onClick={() => setActiveTab("introduction")}
          />
          <TabButton
            label={TAB_LABELS["basicInfo"]}
            isActive={activeTab === "basicInfo"}
            onClick={() => setActiveTab("basicInfo")}
            disabled={!content.basicInfo}
          />
          {masterContent?.hasMasterAnalysis && (
            <>
              <TabButton
                label={TAB_LABELS["developmentStages"]}
                isActive={activeTab === "developmentStages"}
                onClick={() => setActiveTab("developmentStages")}
                badge="新"
              />
              <TabButton
                label={TAB_LABELS["lifeNarrative"]}
                isActive={activeTab === "lifeNarrative"}
                onClick={() => setActiveTab("lifeNarrative")}
                badge="新"
              />
              <TabButton
                label={TAB_LABELS["developmentLessons"]}
                isActive={activeTab === "developmentLessons"}
                onClick={() => setActiveTab("developmentLessons")}
                badge="新"
              />
            </>
          )}
          <TabButton
            label={TAB_LABELS["cognitiveStyle"]}
            isActive={activeTab === "cognitiveStyle"}
            onClick={() => setActiveTab("cognitiveStyle")}
            disabled={!content.cognitiveStyle}
          />
          <TabButton
            label={TAB_LABELS["links"]}
            isActive={activeTab === "links"}
            onClick={() => setActiveTab("links")}
            disabled={!person.links?.length && !person.wikipediaLink}
          />
        </nav>
      </div>

      {/* Content */}
      {activeTab === "developmentStages" && masterContent?.hasMasterAnalysis ? (
        <DevelopmentStages stages={masterContent.stages} references={masterContent.references} />
      ) : activeTab === "lifeNarrative" && masterContent?.hasMasterAnalysis ? (
        <LifeNarrative narrative={masterContent.narrative} references={masterContent.references} />
      ) : activeTab === "developmentLessons" && masterContent?.hasMasterAnalysis ? (
        <DevelopmentLessons
          transferablePrinciples={masterContent.transferablePrinciples}
          pitfalls={masterContent.pitfalls}
          references={masterContent.references}
        />
      ) : activeTab === "links" ? (
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
