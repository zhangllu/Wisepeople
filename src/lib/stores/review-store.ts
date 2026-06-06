import { create } from "zustand"
import { persist } from "zustand/middleware"
import { createClient } from "@/lib/supabase/client"
import type { Review } from "@/types"

interface ReviewState {
  reviews: Review[]
  loading: boolean
  fetchReviews: (userId: string) => Promise<void>
  fetchReviewsByWork: (workSlug: string) => Promise<void>
  addReview: (review: Omit<Review, "id" | "createdAt" | "updatedAt">) => Promise<void>
  updateReview: (id: string, data: Partial<Review>) => Promise<void>
  deleteReview: (id: string) => Promise<void>
  getReviewsByUser: (userId: string) => Review[]
  getReviewsByWork: (workSlug: string) => Review[]
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: [],
      loading: false,

      fetchReviews: async (userId: string) => {
        if (!userId) return
        set({ loading: true })
        try {
          const supabase = createClient()
          const { data, error } = await supabase
            .from("reviews")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })

          if (error) {
            console.error("Fetch reviews error:", error)
            return
          }

          const mapped: Review[] = (data || []).map((row: any) => ({
            id: row.id,
            userId: row.user_id,
            userName: row.user_name,
            workSlug: row.work_slug,
            workTitle: row.work_title,
            title: row.title,
            content: row.content,
            status: row.status,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          }))

          set({ reviews: mapped })
        } catch (e) {
          console.error("Fetch reviews error:", e)
        } finally {
          set({ loading: false })
        }
      },

      fetchReviewsByWork: async (workSlug: string) => {
        set({ loading: true })
        try {
          const supabase = createClient()
          const { data, error } = await supabase
            .from("reviews")
            .select("*")
            .eq("work_slug", workSlug)
            .order("created_at", { ascending: false })

          if (error) {
            console.error("Fetch reviews by work error:", error)
            return
          }

          const mapped: Review[] = (data || []).map((row: any) => ({
            id: row.id,
            userId: row.user_id,
            userName: row.user_name,
            workSlug: row.work_slug,
            workTitle: row.work_title,
            title: row.title,
            content: row.content,
            status: row.status,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          }))

          set({ reviews: mapped })
        } catch (e) {
          console.error("Fetch reviews by work error:", e)
        } finally {
          set({ loading: false })
        }
      },

      addReview: async (review) => {
        try {
          const supabase = createClient()
          const { data: userData } = await supabase.auth.getUser()
          const userId = userData?.user?.id
          if (!userId) return

          const { data, error } = await supabase
            .from("reviews")
            .insert({
              user_id: userId,
              user_name: review.userName,
              work_slug: review.workSlug,
              work_title: review.workTitle,
              title: review.title,
              content: review.content,
              status: review.status,
            })
            .select()
            .single()

          if (error) {
            console.error("Add review error:", error)
            return
          }

          const now = new Date().toISOString()
          set({
            reviews: [
              ...get().reviews,
              {
                id: data.id,
                userId: data.user_id,
                userName: data.user_name,
                workSlug: data.work_slug,
                workTitle: data.work_title,
                title: data.title,
                content: data.content,
                status: data.status,
                createdAt: data.created_at || now,
                updatedAt: data.updated_at || now,
              },
            ],
          })
        } catch (e) {
          console.error("Add review error:", e)
        }
      },

      updateReview: async (id, data) => {
        try {
          const supabase = createClient()
          const { error } = await supabase
            .from("reviews")
            .update({
              title: data.title,
              content: data.content,
              status: data.status,
              updated_at: new Date().toISOString(),
            })
            .eq("id", id)

          if (error) {
            console.error("Update review error:", error)
            return
          }

          set({
            reviews: get().reviews.map((r) =>
              r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r
            ),
          })
        } catch (e) {
          console.error("Update review error:", e)
        }
      },

      deleteReview: async (id) => {
        try {
          const supabase = createClient()
          const { error } = await supabase
            .from("reviews")
            .delete()
            .eq("id", id)

          if (error) {
            console.error("Delete review error:", error)
            return
          }

          set({ reviews: get().reviews.filter((r) => r.id !== id) })
        } catch (e) {
          console.error("Delete review error:", e)
        }
      },

      getReviewsByUser: (userId) => {
        return get().reviews.filter((r) => r.userId === userId)
      },

      getReviewsByWork: (workSlug) => {
        return get().reviews.filter((r) => r.workSlug === workSlug)
      },
    }),
    {
      name: "wp-reviews",
      partialize: (state) => ({
        reviews: state.reviews,
      }),
    }
  )
)
