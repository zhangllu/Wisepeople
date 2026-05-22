import { create } from "zustand"
import type { WisePerson, Work, Book, Question, SubTopic, Author } from "@/types"
import { getAllWisePersons } from "@/lib/data/wise-persons-combined"
import { searchBooks, getAllQuestions, getAllTopics, searchAuthors } from "@/lib/data"
import { mockWorks } from "./mock-data"
import { wiseContent, type WiseContentEntry } from "@/data/wise-content"

export interface StoryMatch {
  slug: string
  name: string
  excerpt: string
}

interface SearchState {
  query: string
  results: {
    wisePersons: WisePerson[]
    works: Work[]
    books: Book[]
    questions: Question[]
    topics: SubTopic[]
    authors: Author[]
    storyMatches: StoryMatch[]
  }
  isSearching: boolean
  setQuery: (q: string) => void
  search: (q: string) => void
  clearSearch: () => void
}

/** Extract a context snippet around the first match position */
function extractExcerpt(content: string, query: string, contextChars = 40): string {
  const lowerContent = content.toLowerCase()
  const lowerQ = query.toLowerCase()
  const idx = lowerContent.indexOf(lowerQ)
  if (idx === -1) return content.replace(/\n+/g, " ").substring(0, contextChars * 2) + "…"

  const start = Math.max(0, idx - contextChars)
  const end = Math.min(content.length, idx + query.length + contextChars)

  let excerpt = content.substring(start, end).replace(/\n+/g, " ").trim()
  if (start > 0) excerpt = "…" + excerpt
  if (end < content.length) excerpt = excerpt + "…"
  return excerpt
}

export const useSearchStore = create<SearchState>()((set, get) => ({
  query: "",
  results: { wisePersons: [], works: [], books: [], questions: [], topics: [], authors: [], storyMatches: [] },
  isSearching: false,

  setQuery: (q) => set({ query: q }),

  search: (q: string) => {
    if (!q.trim()) {
      set({ results: { wisePersons: [], works: [], books: [], questions: [], topics: [], authors: [], storyMatches: [] }, isSearching: false })
      return
    }
    set({ isSearching: true, query: q })

    const lowerQ = q.toLowerCase()

    // ── 1. 智者：搜索 name / nameEn / summary / tags / biography / coreThoughts / personalIntroduction ──
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

    // ── 2. 人物故事：wise-content 全文搜索，匹配到的智者加入智者列表，同时生成故事摘录 ──
    const matchedSlugs = new Set(matchedWisePersons.map((p) => p.slug))
    const storyMatches: StoryMatch[] = []

    const wiseContentEntries = wiseContent as Record<string, WiseContentEntry>
    for (const [slug, content] of Object.entries(wiseContentEntries)) {
      const fields = [content.introduction, content.basicInfo, content.cognitiveStyle]
      const fullText = fields.filter(Boolean).join("\n\n")

      if (fullText.toLowerCase().includes(lowerQ)) {
        // 补入智者结果
        if (!matchedSlugs.has(slug)) {
          const person = allPersons.find((p) => p.slug === slug)
          if (person) {
            matchedWisePersons.push(person)
            matchedSlugs.add(slug)
          }
        }
        // 生成摘录（取第一个匹配的字段）
        for (const field of fields) {
          if (field && field.toLowerCase().includes(lowerQ)) {
            storyMatches.push({
              slug,
              name: allPersons.find((p) => p.slug === slug)?.name ?? slug,
              excerpt: extractExcerpt(field, q),
            })
            break
          }
        }
      }
    }

    // ── 3. 著作：搜索 title / authorName / summary / description ──
    const matchedWorks = mockWorks.filter(
      (w) =>
        w.title.toLowerCase().includes(lowerQ) ||
        w.authorName.toLowerCase().includes(lowerQ) ||
        w.summary.toLowerCase().includes(lowerQ) ||
        w.description?.toLowerCase().includes(lowerQ)
    )

    // ── 4. 通识千书包 ──
    const matchedBooks = searchBooks(q)

    // ── 5. 十大问题：搜索 title / subtitle / summary ──
    const allQuestions = getAllQuestions()
    const matchedQuestions = allQuestions.filter(
      (q) =>
        q.title.toLowerCase().includes(lowerQ) ||
        q.subtitle?.toLowerCase().includes(lowerQ) ||
        q.summary?.toLowerCase().includes(lowerQ)
    )

    // ── 6. 主题：搜索 title / coreField / representativeDiscipline ──
    const allTopics = getAllTopics()
    const matchedTopics = allTopics.filter(
      (t) =>
        t.title.toLowerCase().includes(lowerQ) ||
        t.coreField?.toLowerCase().includes(lowerQ) ||
        t.representativeDiscipline?.toLowerCase().includes(lowerQ)
    )

    // ── 7. 作者（排除已经在智者结果中展示的） ──
    const authorResults = searchAuthors(q)
    const matchedAuthors = authorResults.filter((a) => !matchedSlugs.has(a.slug))

    set({
      results: {
        wisePersons: matchedWisePersons,
        works: matchedWorks,
        books: matchedBooks,
        questions: matchedQuestions,
        topics: matchedTopics,
        authors: matchedAuthors,
        storyMatches,
      },
      isSearching: false,
    })
  },

  clearSearch: () => {
    set({ query: "", results: { wisePersons: [], works: [], books: [], questions: [], topics: [], authors: [], storyMatches: [] }, isSearching: false })
  },
}))
