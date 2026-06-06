"use client"

import Link from "next/link"
import type { WisePerson, Era } from "@/types"
import { DISCIPLINE_LABELS, ERA_LABELS, REGION_LABELS, ROUTES } from "@/constants"
import { BookmarkButton } from "@/components/shared/BookmarkButton"

interface WisePersonCardProps {
  wisePerson: WisePerson
}

/** Era-based gradient colors for avatar backgrounds */
const ERA_STYLES: Record<Era | "default", { bg: string; text: string }> = {
  ancient: { bg: "from-amber-100 to-orange-100", text: "text-amber-700" },
  modern: { bg: "from-sky-100 to-indigo-100", text: "text-indigo-700" },
  contemporary: { bg: "from-emerald-100 to-teal-100", text: "text-teal-700" },
  default: { bg: "from-gray-100 to-slate-100", text: "text-slate-600" },
}

/**
 * Parse name into { primary (Chinese), secondary (English) }.
 * Stub names come as "English Name（中文译名）"; non-stub have separate name/nameEn fields.
 */
function parseName(wp: WisePerson) {
  if (wp.isStub) {
    const m = wp.name.match(/^(.+?)\s*[（(](.+?)[）)]$/)
    if (m) {
      return { primary: m[2], secondary: m[1] }
    }
    // Pure Chinese or no parentheses
    return { primary: wp.name, secondary: undefined }
  }
  // Non-stub: name is Chinese, nameEn is English/original
  return { primary: wp.name, secondary: wp.nameEn }
}

export function WisePersonCard({ wisePerson }: WisePersonCardProps) {
  const { primary, secondary } = parseName(wisePerson)
  const initial = primary.charAt(0)
  const avatarStyle = ERA_STYLES[wisePerson.era ?? "default"] ?? ERA_STYLES.default

  // Coordinate line — only for non-stub users (stub era/discipline/region are hardcoded defaults)
  const coords = !wisePerson.isStub
    ? [
        wisePerson.era && ERA_LABELS[wisePerson.era],
        wisePerson.discipline && DISCIPLINE_LABELS[wisePerson.discipline],
        wisePerson.region && REGION_LABELS[wisePerson.region],
      ].filter(Boolean)
    : []

  const hasCoords = coords.length > 0
  const hasSummary = !wisePerson.isStub && wisePerson.summary?.length > 0

  // For stub users, show a subtle book/topic count instead of coordinates
  const stubMeta = wisePerson.isStub
    ? [
        wisePerson.bookSlugs?.length
          ? `${wisePerson.bookSlugs.length} 本著作`
          : null,
        wisePerson.topicCodes?.length
          ? `${wisePerson.topicCodes.length} 个主题`
          : null,
      ].filter(Boolean)
    : []

  return (
    <Link href={ROUTES.wisePersonDetail(wisePerson.slug)} className="group block h-full">
      <div className="relative flex items-start gap-4 rounded-xl border border-border/60 bg-card p-4 transition-all duration-300 hover:border-accent/30 hover:shadow-md hover:shadow-accent/5 hover:-translate-y-0.5 h-full">
        {/* Portrait */}
        <div className="shrink-0">
          {wisePerson.portrait ? (
            <img
              src={wisePerson.portrait}
              alt={primary}
              className="size-14 rounded-full object-cover ring-2 ring-border/50 group-hover:ring-accent/30 transition-all duration-300"
            />
          ) : (
            <div
              className={`size-14 rounded-full bg-gradient-to-br ${avatarStyle.bg} ring-2 ring-border/50 group-hover:ring-accent/30 flex items-center justify-center transition-all duration-300`}
            >
              <span className={`text-lg font-heading font-bold ${avatarStyle.text}`}>
                {initial}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Chinese name as primary */}
          <h3 className="text-base font-semibold text-foreground group-hover:text-accent transition-colors truncate leading-snug">
            {primary}
          </h3>
          {/* English/original name as secondary */}
          {secondary && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {secondary}
            </p>
          )}

          {/* Coordinate line for full-profile users */}
          {hasCoords && (
            <p className="text-[11px] text-muted-foreground/70 mt-1.5 tracking-wide">
              {coords.join(" · ")}
            </p>
          )}

          {/* Stub meta info */}
          {stubMeta.length > 0 && (
            <p className="text-[11px] text-muted-foreground/50 mt-1.5">
              {stubMeta.join(" · ")}
            </p>
          )}

          {/* Summary for full-profile users */}
          {hasSummary && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
              {wisePerson.summary}
            </p>
          )}
        </div>

        {/* Bookmark */}
        <div
          className="shrink-0 mt-0.5"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          role="button"
          tabIndex={-1}
        >
          <BookmarkButton targetId={wisePerson.slug} targetType="wise-person" />
        </div>
      </div>
    </Link>
  )
}
