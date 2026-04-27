"use client"

import Link from "next/link"
import { useBookmarkStore, useWisePersonStore, useAuthStore } from "@/lib/stores"
import { ROUTES } from "@/constants"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/EmptyState"

export default function BookmarksPage() {
  const { isAuthenticated } = useAuthStore()
  const { bookmarks, removeBookmark } = useBookmarkStore()
  const { getWisePersonBySlug } = useWisePersonStore()

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">我的收藏</h1>
        <p className="text-sm text-muted-foreground mb-6">请先登录</p>
        <Link href={ROUTES.login}><Button>去登录</Button></Link>
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">我的收藏</h1>
        <EmptyState title="暂无收藏" description="浏览智者和书单时点击 ♡ 即可收藏" />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">我的收藏（{bookmarks.length}）</h1>
      <div className="space-y-2">
        {bookmarks.map((bm) => {
          const person = getWisePersonBySlug(bm.targetId)
          return (
            <div key={bm.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Link
                  href={bm.targetType === "wise-person" ? ROUTES.wisePersonDetail(bm.targetId) : ROUTES.bookListDetail(bm.targetId)}
                  className="text-sm font-medium hover:text-primary"
                >
                  {person?.name || bm.targetId}
                </Link>
                <p className="text-[10px] text-muted-foreground">
                  {bm.targetType === "wise-person" ? "智者" : "书单"} · {new Date(bm.createdAt).toLocaleDateString("zh-CN")}
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
  )
}
