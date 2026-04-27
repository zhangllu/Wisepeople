import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Review, ReviewStatus } from "@/types"

interface ReviewState {
  reviews: Review[]
  addReview: (review: Omit<Review, "id" | "createdAt" | "updatedAt">) => void
  updateReview: (id: string, data: Partial<Review>) => void
  deleteReview: (id: string) => void
  getReviewsByUser: (userId: string) => Review[]
  getReviewsByWork: (workSlug: string) => Review[]
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: [],

      addReview: (review) => {
        const now = new Date().toISOString()
        set({
          reviews: [
            ...get().reviews,
            {
              ...review,
              id: `rev-${Date.now()}`,
              createdAt: now,
              updatedAt: now,
            },
          ],
        })
      },

      updateReview: (id, data) => {
        set({
          reviews: get().reviews.map((r) =>
            r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r
          ),
        })
      },

      deleteReview: (id) => {
        set({ reviews: get().reviews.filter((r) => r.id !== id) })
      },

      getReviewsByUser: (userId) => {
        return get().reviews.filter((r) => r.userId === userId)
      },

      getReviewsByWork: (workSlug) => {
        return get().reviews.filter((r) => r.workSlug === workSlug)
      },
    }),
    { name: "wp-reviews" }
  )
)
