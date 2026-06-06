"use client"

import { useEffect } from "react"
import { useAuthStore, useReviewStore } from "@/lib/stores"
import Link from "next/link"
import { ROUTES } from "@/constants"
import { Button } from "@/components/ui/button"
import { ReviewCard } from "@/components/review/ReviewCard"
import { EmptyState } from "@/components/shared/EmptyState"
import { DetailHeader } from "@/components/shared/DetailHeader"
import { FadeIn } from "@/components/shared/FadeIn"

export default function ReviewsPage() {
  const { isAuthenticated, user } = useAuthStore()
  const { reviews, loading, fetchReviews, deleteReview } = useReviewStore()

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">我的书评</h1>
        <p className="text-sm text-muted-foreground mb-6">请先登录</p>
        <Link href={ROUTES.login}><Button>去登录</Button></Link>
      </div>
    )
  }

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchReviews(user.id)
    }
  }, [isAuthenticated, user, fetchReviews])

  const userReviews = reviews.filter((r) => r.userId === user.id)

  if (loading) {
    return (
      <>
        <DetailHeader title="我的书评" />
        <FadeIn>
          <div className="container mx-auto max-w-4xl px-4 py-8 text-center text-sm text-muted-foreground">
            加载中...
          </div>
        </FadeIn>
      </>
    )
  }

  if (userReviews.length === 0) {
    return (
      <>
        <DetailHeader title="我的书评" />
        <FadeIn>
          <div className="container mx-auto max-w-4xl px-4 py-8">
            <EmptyState title="暂无书评" description="在智者详情页中可以撰写书评和笔记" />
          </div>
        </FadeIn>
      </>
    )
  }

  return (
    <>
      <DetailHeader title="我的书评" description={`共 ${userReviews.length} 篇`} />
      <FadeIn>
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="space-y-3">
            {userReviews.map((review) => (
              <div key={review.id} className="relative">
                <ReviewCard review={review} />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground h-6"
                    onClick={() => deleteReview(review.id)}
                  >
                    删除
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </>
  )
}
