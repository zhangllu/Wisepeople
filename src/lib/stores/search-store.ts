import { create } from "zustand"
import type { WisePerson, Work, Book } from "@/types"
import { getAllWisePersons } from "@/lib/data/wise-persons-combined"
import { searchBooks } from "@/lib/data"
import { mockWisePersons, mockWorks } from "./mock-data"

interface SearchState {
  query: string
  results: {
    wisePersons: WisePerson[]
    works: Work[]
    books: Book[]
  }
  isSearching: boolean
  setQuery: (q: string) => void
  search: (q: string) => void
  clearSearch: () => void
}

export const useSearchStore = create<SearchState>()((set, get) => ({
  query: "",
  results: { wisePersons: [], works: [], books: [] },
  isSearching: false,

  setQuery: (q) => set({ query: q }),

  search: (q: string) => {
    if (!q.trim()) {
      set({ results: { wisePersons: [], works: [], books: [] }, isSearching: false })
      return
    }
    set({ isSearching: true, query: q })

    const lowerQ = q.toLowerCase()

    // Search combined wise persons
    const allPersons = getAllWisePersons()
    const matchedWisePersons = allPersons.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQ) ||
        p.nameEn?.toLowerCase().includes(lowerQ) ||
        p.summary.includes(q) ||
        p.tags.some((t) => t.includes(q))
    )

    // Search mock works
    const matchedWorks = mockWorks.filter(
      (w) =>
        w.title.includes(q) ||
        w.authorName.includes(q) ||
        w.summary.includes(q)
    )

    // Search books from data layer
    const matchedBooks = searchBooks(q)

    set({
      results: {
        wisePersons: matchedWisePersons,
        works: matchedWorks,
        books: matchedBooks,
      },
      isSearching: false,
    })
  },

  clearSearch: () => {
    set({ query: "", results: { wisePersons: [], works: [], books: [] }, isSearching: false })
  },
}))
