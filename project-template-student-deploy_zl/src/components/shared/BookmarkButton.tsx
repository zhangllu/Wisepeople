"use client"

import { useBookmarkStore, useAuthStore } from "@/lib/stores"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { toast } from "sonner"

interface BookmarkButtonProps {
  targetId: string
  targetType: "wise-person" | "book-list"
}

export function BookmarkButton({ targetId, targetType }: BookmarkButtonProps) {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkStore()
  const { isAuthenticated } = useAuthStore()
  const bookmarked = isBookmarked(targetId)

  const handleClick = () => {
    if (!isAuthenticated) {
      toast("请先登录", {
        description: "登录后即可收藏内容",
      })
      return
    }
    if (bookmarked) {
      removeBookmark(targetId)
      toast("已取消收藏")
    } else {
      addBookmark(targetId, targetType)
      toast("已收藏")
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={handleClick}
      aria-label={bookmarked ? "取消收藏" : "收藏"}
    >
      <Heart
        className={`h-4 w-4 transition-colors ${
          bookmarked ? "fill-red-500 text-red-500" : ""
        }`}
      />
    </Button>
  )
}
