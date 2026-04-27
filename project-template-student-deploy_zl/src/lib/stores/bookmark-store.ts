import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Bookmark } from "@/types"

interface BookmarkState {
  bookmarks: Bookmark[]
  addBookmark: (targetId: string, targetType: "wise-person" | "book-list") => void
  removeBookmark: (targetId: string) => void
  isBookmarked: (targetId: string) => boolean
  getUserBookmarks: (userId: string) => Bookmark[]
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      addBookmark: (targetId, targetType) => {
        const existing = get().bookmarks.find((b) => b.targetId === targetId)
        if (existing) return
        set({
          bookmarks: [
            ...get().bookmarks,
            {
              id: `bm-${Date.now()}`,
              userId: "u-demo-001",
              targetId,
              targetType,
              createdAt: new Date().toISOString(),
            },
          ],
        })
      },

      removeBookmark: (targetId) => {
        set({
          bookmarks: get().bookmarks.filter((b) => b.targetId !== targetId),
        })
      },

      isBookmarked: (targetId) => {
        return get().bookmarks.some((b) => b.targetId === targetId)
      },

      getUserBookmarks: (userId) => {
        return get().bookmarks.filter((b) => b.userId === userId)
      },
    }),
    { name: "wp-bookmarks" }
  )
)
