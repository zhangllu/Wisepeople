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

  return (
    <Link href={ROUTES.wisePersonDetail(wisePerson.slug)} className="group block h-full">
      <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer h-full">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                {wisePerson.name}
              </h3>
              {wisePerson.region === "western" && wisePerson.nameEn && (
                <p className="text-xs text-muted-foreground">{wisePerson.nameEn}</p>
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
                  <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-blue-600 hover:bg-blue-600">
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
