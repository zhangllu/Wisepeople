"use client"

import { useEffect, useRef } from "react"
import { useAuthStore, useBookmarkStore, useReviewStore } from "@/lib/stores"

/**
 * 在应用启动时初始化 Supabase 会话并加载用户数据
 * 放在 RootLayout 中，只执行一次
 */
export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const init = async () => {
      await useAuthStore.getState().initialize()
      const { isAuthenticated, user } = useAuthStore.getState()
      if (isAuthenticated && user) {
        await Promise.all([
          useBookmarkStore.getState().fetchBookmarks(user.id),
          useReviewStore.getState().fetchReviews(user.id),
        ])
      }
    }
    init()
  }, [])

  return <>{children}</>
}
