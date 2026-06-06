import { create } from "zustand"
import { persist } from "zustand/middleware"
import { createClient } from "@/lib/supabase/client"
import type { Bookmark } from "@/types"

interface BookmarkState {
  bookmarks: Bookmark[]
  loading: boolean
  fetchBookmarks: (userId: string) => Promise<void>
  addBookmark: (targetId: string, targetType: "wise-person" | "book-list" | "work") => Promise<void>
  removeBookmark: (targetId: string) => Promise<void>
  isBookmarked: (targetId: string) => boolean
  getUserBookmarks: (userId: string) => Bookmark[]
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      loading: false,

      fetchBookmarks: async (userId: string) => {
        if (!userId) return
        set({ loading: true })
        try {
          const supabase = createClient()
          const { data, error } = await supabase
            .from("bookmarks")
            .select("*")
            .eq("user_id", userId)

          if (error) {
            console.error("Fetch bookmarks error:", error)
            return
          }

          const mapped: Bookmark[] = (data || []).map((row: any) => ({
            id: row.id,
            userId: row.user_id,
            targetId: row.target_id,
            targetType: row.target_type as Bookmark["targetType"],
            createdAt: row.created_at,
          }))

          set({ bookmarks: mapped })
        } catch (e) {
          console.error("Fetch bookmarks error:", e)
        } finally {
          set({ loading: false })
        }
      },

      addBookmark: async (targetId, targetType) => {
        const existing = get().bookmarks.find((b) => b.targetId === targetId)
        if (existing) return

        try {
          const supabase = createClient()
          const { data: userData } = await supabase.auth.getUser()
          const userId = userData?.user?.id
          if (!userId) return

          const { data, error } = await supabase
            .from("bookmarks")
            .insert({ user_id: userId, target_id: targetId, target_type: targetType })
            .select()
            .single()

          if (error) {
            console.error("Add bookmark error:", error)
            return
          }

          set({
            bookmarks: [
              ...get().bookmarks,
              {
                id: data.id,
                userId: data.user_id,
                targetId: data.target_id,
                targetType: data.target_type,
                createdAt: data.created_at,
              },
            ],
          })
        } catch (e) {
          console.error("Add bookmark error:", e)
        }
      },

      removeBookmark: async (targetId) => {
        const bm = get().bookmarks.find((b) => b.targetId === targetId)
        if (!bm) return

        try {
          const supabase = createClient()
          const { error } = await supabase
            .from("bookmarks")
            .delete()
            .eq("id", bm.id)

          if (error) {
            console.error("Remove bookmark error:", error)
            return
          }

          set({
            bookmarks: get().bookmarks.filter((b) => b.targetId !== targetId),
          })
        } catch (e) {
          console.error("Remove bookmark error:", e)
        }
      },

      isBookmarked: (targetId) => {
        return get().bookmarks.some((b) => b.targetId === targetId)
      },

      getUserBookmarks: (userId) => {
        return get().bookmarks.filter((b) => b.userId === userId)
      },
    }),
    {
      name: "wp-bookmarks",
      partialize: (state) => ({
        bookmarks: state.bookmarks,
      }),
    }
  )
)
