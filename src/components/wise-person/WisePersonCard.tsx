"use client"

import Link from "next/link"
import type { WisePerson } from "@/types"
import { DISCIPLINE_LABELS, ERA_LABELS, REGION_LABELS, ROUTES } from "@/constants"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookmarkButton } from "@/components/shared/BookmarkButton"

interface WisePersonCardProps {
  wisePerson: WisePerson
}

export function WisePersonCard({ wisePerson }: WisePersonCardProps) {
  const isStub = wisePerson.isStub
  const initial = wisePerson.name.charAt(0)

  return (
    <Link href={ROUTES.wisePersonDetail(wisePerson.slug)} className="group block h-full">
      <Card className="relative cursor-pointer h-full border-l-2 border-l-transparent hover:border-l-accent/50 transition-all duration-300 hover:-translate-y-1">
        {/* Left accent bar — visible on hover */}
        <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-accent/0 group-hover:bg-accent/40 rounded-full transition-all duration-300" aria-hidden="true" />

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-3">
            {/* Avatar */}
            <div className="shrink-0 size-10 rounded-full bg-accent/5 ring-1 ring-accent/10 group-hover:ring-accent/40 flex items-center justify-center text-sm font-heading font-semibold text-accent/60 group-hover:text-accent transition-all duration-300">
              {initial}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold group-hover:text-accent transition-colors truncate">
                {wisePerson.name}
              </h3>
              {wisePerson.region === "western" && wisePerson.nameEn && (
                <p className="text-xs text-muted-foreground truncate">{wisePerson.nameEn}</p>
              )}
            </div>
            <div onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()} role="button" tabIndex={-1}>
              <BookmarkButton targetId={wisePerson.slug} targetType="wise-person" />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {isStub ? (
              <>
                {wisePerson.topicCodes && wisePerson.topicCodes.length > 0 && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {wisePerson.topicCodes.length} 个主题
                  </Badge>
                )}
                {wisePerson.bookSlugs && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {wisePerson.bookSlugs.length} 本著作
                  </Badge>
                )}
                {wisePerson.links && wisePerson.links.length > 0 && (
                  <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-accent text-accent-foreground hover:bg-accent/90">
                    精选链接
                  </Badge>
                )}
                {(!wisePerson.links || wisePerson.links.length === 0) && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground">
                    待完善
                  </Badge>
                )}
              </>
            ) : (
              <>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 pointer-events-none">
                  {ERA_LABELS[wisePerson.era]}
                </Badge>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 pointer-events-none">
                  {DISCIPLINE_LABELS[wisePerson.discipline]}
                </Badge>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 pointer-events-none">
                  {REGION_LABELS[wisePerson.region]}
                </Badge>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isStub ? (
            <p className="text-xs text-muted-foreground">
              收录 {wisePerson.bookSlugs?.length || 0} 本著作，关联 {wisePerson.topicCodes?.length || 0} 个主题方向
            </p>
          ) : (
            <p className="text-xs text-muted-foreground line-clamp-3">{wisePerson.summary}</p>
          )}
          {!isStub && wisePerson.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {wisePerson.tags.map((tag) => (
                <span key={tag} className="text-[10px] text-muted-foreground/60">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
