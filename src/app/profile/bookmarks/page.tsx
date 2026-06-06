"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useBookmarkStore, useWisePersonStore, useAuthStore } from "@/lib/stores"
import { ROUTES } from "@/constants"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/EmptyState"
import { DetailHeader } from "@/components/shared/DetailHeader"
import { FadeIn } from "@/components/shared/FadeIn"
import { getBookBySlug } from "@/lib/data"

export default function BookmarksPage() {
  const { isAuthenticated, user } = useAuthStore()
  const { bookmarks, loading, fetchBookmarks, removeBookmark } = useBookmarkStore()
  const { getWisePersonBySlug } = useWisePersonStore()

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchBookmarks(user.id)
    }
  }, [isAuthenticated, user, fetchBookmarks])

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">我的收藏</h1>
        <p className="text-sm text-muted-foreground mb-6">请先登录</p>
        <Link href={ROUTES.login}><Button>去登录</Button></Link>
      </div>
    )
  }

  if (loading) {
    return (
      <>
        <DetailHeader title="我的收藏" />
        <FadeIn>
          <div className="container mx-auto max-w-4xl px-4 py-8 text-center text-sm text-muted-foreground">
            加载中...
          </div>
        </FadeIn>
      </>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <>
        <DetailHeader title="我的收藏" />
        <FadeIn>
          <div className="container mx-auto max-w-4xl px-4 py-8">
            <EmptyState title="暂无收藏" description="浏览智者和书单时点击 ♡ 即可收藏" />
          </div>
        </FadeIn>
      </>
    )
  }

  return (
    <>
      <DetailHeader title="我的收藏" description={`共 ${bookmarks.length} 项`} />
      <FadeIn>
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="space-y-2">
            {bookmarks.map((bm) => {
              const person = getWisePersonBySlug(bm.targetId)
              const book = bm.targetType === "book" ? getBookBySlug(bm.targetId) : undefined
              const displayName = book?.title || person?.name || bm.targetId
              const typeLabel = bm.targetType === "book" ? "书籍" : bm.targetType === "wise-person" ? "智者" : "书单"
              const detailHref = bm.targetType === "book"
                ? `/book-lists/minimum-56`
                : bm.targetType === "wise-person"
                  ? ROUTES.wisePersonDetail(bm.targetId)
                  : ROUTES.bookListDetail(bm.targetId)
              return (
                <div key={bm.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Link
                      href={detailHref}
                      className="text-sm font-medium hover:text-accent"
                    >
                      {displayName}
                    </Link>
                    <p className="text-[10px] text-muted-foreground">
                      {typeLabel} · {new Date(bm.createdAt).toLocaleDateString("zh-CN")}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => removeBookmark(bm.targetId)}>
                    取消收藏
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </FadeIn>
    </>
  )
}
