import { create } from "zustand"
import type { WisePerson, Work, Book, Question, SubTopic, Author } from "@/types"
import { getAllWisePersons } from "@/lib/data/wise-persons-combined"
import { searchBooks, getAllQuestions, getAllTopics, searchAuthors, getMinimumBookList } from "@/lib/data"
import { mockWorks } from "./mock-data"
import { wiseContent, type WiseContentEntry } from "@/data/wise-content"

interface SearchState {
  query: string
  results: {
    wisePersons: WisePerson[]
    works: Work[]
    books: Book[]
    questions: Question[]
    topics: SubTopic[]
    authors: Author[]
  }
  isSearching: boolean
  setQuery: (q: string) => void
  search: (q: string) => void
  clearSearch: () => void
}

export const useSearchStore = create<SearchState>()((set, get) => ({
  query: "",
  results: { wisePersons: [], works: [], books: [], questions: [], topics: [], authors: [] },
  isSearching: false,

  setQuery: (q) => set({ query: q }),

  search: (q: string) => {
    if (!q.trim()) {
      set({ results: { wisePersons: [], works: [], books: [], questions: [], topics: [], authors: [] }, isSearching: false })
      return
    }
    set({ isSearching: true, query: q })

    const lowerQ = q.toLowerCase()

    // ── 1. 智者：搜索 name / nameEn / summary / tags / biography / coreThoughts / personalIntroduction + wise-content 全文 ──
    const allPersons = getAllWisePersons()
    const matchedWisePersons = allPersons.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQ) ||
        p.nameEn?.toLowerCase().includes(lowerQ) ||
        p.summary.toLowerCase().includes(lowerQ) ||
        p.tags.some((t) => t.toLowerCase().includes(lowerQ)) ||
        p.biography?.toLowerCase().includes(lowerQ) ||
        p.coreThoughts?.toLowerCase().includes(lowerQ) ||
        p.personalIntroduction?.toLowerCase().includes(lowerQ)
    )

    // wise-content 全文搜索：将匹配的智者补充到结果中（去重）
    const matchedSlugs = new Set(matchedWisePersons.map((p) => p.slug))
    const wiseContentEntries = wiseContent as Record<string, WiseContentEntry>
    for (const [slug, content] of Object.entries(wiseContentEntries)) {
      if (matchedSlugs.has(slug)) continue
      const contentText = [content.introduction, content.basicInfo, content.cognitiveStyle]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      if (contentText.includes(lowerQ)) {
        const person = allPersons.find((p) => p.slug === slug)
        if (person) {
          matchedWisePersons.push(person)
          matchedSlugs.add(slug)
        }
      }
    }

    // ── 2. 著作：搜索 title / authorName / summary / description ──
    const matchedWorks = mockWorks.filter(
      (w) =>
        w.title.toLowerCase().includes(lowerQ) ||
        w.authorName.toLowerCase().includes(lowerQ) ||
        w.summary.toLowerCase().includes(lowerQ) ||
        w.description?.toLowerCase().includes(lowerQ)
    )

    // ── 3. 通识千书包 ──
    const matchedBooks = searchBooks(q)

    // ── 4. 十大问题：搜索 title / subtitle / summary ──
    const allQuestions = getAllQuestions()
    const matchedQuestions = allQuestions.filter(
      (q) =>
        q.title.toLowerCase().includes(lowerQ) ||
        q.subtitle?.toLowerCase().includes(lowerQ) ||
        q.summary?.toLowerCase().includes(lowerQ)
    )

    // ── 5. 主题：搜索 title / coreField / representativeDiscipline ──
    const allTopics = getAllTopics()
    const matchedTopics = allTopics.filter(
      (t) =>
        t.title.toLowerCase().includes(lowerQ) ||
        t.coreField?.toLowerCase().includes(lowerQ) ||
        t.representativeDiscipline?.toLowerCase().includes(lowerQ)
    )

    // ── 6. 作者（排除已经在智者结果中展示的） ──
    const authorResults = searchAuthors(q)
    const matchedAuthorSlugs = new Set(matchedWisePersons.map((p) => p.slug))
    const matchedAuthors = authorResults.filter((a) => !matchedAuthorSlugs.has(a.slug))

    set({
      results: {
        wisePersons: matchedWisePersons,
        works: matchedWorks,
        books: matchedBooks,
        questions: matchedQuestions,
        topics: matchedTopics,
        authors: matchedAuthors,
      },
      isSearching: false,
    })
  },

  clearSearch: () => {
    set({ query: "", results: { wisePersons: [], works: [], books: [], questions: [], topics: [], authors: [] }, isSearching: false })
  },
}))
