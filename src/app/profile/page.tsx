"use client"

import Link from "next/link"
import { useAuthStore, useBookmarkStore, useReviewStore } from "@/lib/stores"
import { ROUTES } from "@/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ReviewCard } from "@/components/review/ReviewCard"
import { DetailHeader } from "@/components/shared/DetailHeader"
import { FadeIn } from "@/components/shared/FadeIn"

export default function ProfilePage() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const { bookmarks } = useBookmarkStore()
  const { reviews } = useReviewStore()

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">个人中心</h1>
        <p className="text-sm text-muted-foreground mb-6">请登录后查看个人中心</p>
        <Link href={ROUTES.login}>
          <Button>去登录</Button>
        </Link>
      </div>
    )
  }

  const userReviews = reviews.filter((r) => r.userId === user.id)

  return (
    <>
      <DetailHeader
        title="个人中心"
        description={user.email}
      />
      <FadeIn>
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="flex justify-end mb-6">
            <Button variant="outline" size="sm" onClick={logout}>
              退出登录
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">收藏</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{bookmarks.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">书评</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{userReviews.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">角色</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{user.role === "registered" ? "注册用户" : user.role}</p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">我的收藏</h2>
              <Link href={ROUTES.bookmarks} className="text-xs text-primary hover:underline">
                查看全部 →
              </Link>
            </div>
            {bookmarks.length === 0 ? (
              <p className="text-sm text-muted-foreground">还没有收藏内容</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {bookmarks.slice(0, 5).map((bm) => (
                  <Link
                    key={bm.id}
                    href={bm.targetType === "wise-person" ? ROUTES.wisePersonDetail(bm.targetId) : ROUTES.bookListDetail(bm.targetId)}
                    className="text-xs bg-secondary px-2 py-1 rounded hover:bg-secondary/80 transition-colors"
                  >
                    {bm.targetId}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">最近书评</h2>
              <Link href={ROUTES.reviews} className="text-xs text-primary hover:underline">
                查看全部 →
              </Link>
            </div>
            {userReviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">还没有写过书评</p>
            ) : (
              <div className="space-y-3">
                {userReviews.slice(0, 3).map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>
        </div>
      </FadeIn>
    </>
  )
}
