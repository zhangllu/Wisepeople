import { create } from "zustand"
import { persist } from "zustand/middleware"

interface MockModeState {
  isMockMode: boolean
  setMockMode: (v: boolean) => void
}

export const useMockMode = create<MockModeState>()(
  persist(
    (set) => ({
      isMockMode: true,
      setMockMode: (v) => set({ isMockMode: v }),
    }),
    { name: "wp-mock-mode" }
  )
)
