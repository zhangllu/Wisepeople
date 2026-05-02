import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { WisePerson, Era, Discipline, Region } from "@/types"
import { getAllWisePersons } from "@/lib/data/wise-persons-combined"
import { mockWisePersons } from "./mock-data"

interface WisePersonState {
  // 数据
  wisePersons: WisePerson[]
  // 筛选条件
  activeEra: Era | "all"
  activeDiscipline: Discipline | "all"
  activeRegion: Region | "all"
  // 选中详情
  selectedSlug: string | null
  // 操作
  setEra: (era: Era | "all") => void
  setDiscipline: (discipline: Discipline | "all") => void
  setRegion: (region: Region | "all") => void
  selectPerson: (slug: string | null) => void
  // 计算属性
  filteredWisePersons: () => WisePerson[]
  getWisePersonBySlug: (slug: string) => WisePerson | undefined
  /** Get only non-stub (full profile) wise persons */
  getFullProfiles: () => WisePerson[]
}

export const useWisePersonStore = create<WisePersonState>()(
  persist(
    (set, get) => ({
      wisePersons: getAllWisePersons(),
      activeEra: "all",
      activeDiscipline: "all",
      activeRegion: "all",
      selectedSlug: null,

      setEra: (era) => set({ activeEra: era }),
      setDiscipline: (discipline) => set({ activeDiscipline: discipline }),
      setRegion: (region) => set({ activeRegion: region }),
      selectPerson: (slug) => set({ selectedSlug: slug }),

      filteredWisePersons: () => {
        const { wisePersons, activeEra, activeDiscipline, activeRegion } = get()
        const allSelected = activeEra === "all" && activeDiscipline === "all" && activeRegion === "all"

        return wisePersons.filter((p) => {
          // Stubs only show when all filters are "all"
          if (p.isStub && !allSelected) return false
          if (!allSelected) {
            if (activeEra !== "all" && p.era !== activeEra) return false
            if (activeDiscipline !== "all" && p.discipline !== activeDiscipline) return false
            if (activeRegion !== "all" && p.region !== activeRegion) return false
          }
          return true
        })
      },

      getWisePersonBySlug: (slug: string) => {
        // Check mock first, then fall back to all combined
        const mock = mockWisePersons.find((p) => p.slug === slug)
        if (mock) return mock
        return get().wisePersons.find((p) => p.slug === slug)
      },

      getFullProfiles: () => {
        return mockWisePersons
      },
    }),
    { name: "wp-wise-person" }
  )
)
