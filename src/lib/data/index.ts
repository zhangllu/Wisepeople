/**
 * Data access layer for 通识千书 data.
 *
 * Imports JSON files from src/data/ and provides typed query functions.
 * All functions are synchronous — the JSON is bundled at build time.
 */
import type { Book, Author, SubTopic, Question, MinimumBook, Dimension, WisePerson } from "@/types"
import booksData from "@/data/books.json"
import authorsData from "@/data/authors.json"
import topicsData from "@/data/topics.json"
import questionsData from "@/data/questions.json"
import minimumBooksData from "@/data/minimum_books.json"
import { mockWisePersons } from "@/lib/stores/mock-data"
import { guessWikipediaLink } from "@/lib/data/guess-wikipedia-link"
import { getCuratedLinks } from "@/lib/data/curated-links"
import portraitsData from "@/data/portraits.json"

/** Portrait lookup map: slug → portrait URL */
const portraitMap = portraitsData as Record<string, { portrait_url: string }>

// ── Books ────────────────────────────────────────────────────────────────

const books: Book[] = booksData as Book[]
const booksBySlug = new Map<string, Book>()
const booksByTopic = new Map<string, Book[]>()
for (const b of books) {
  booksBySlug.set(b.slug, b)
  if (b.topicCode) {
    if (!booksByTopic.has(b.topicCode)) booksByTopic.set(b.topicCode, [])
    booksByTopic.get(b.topicCode)!.push(b)
  }
}

export function getAllBooks(): Book[] {
  return books
}

export function getBookBySlug(slug: string): Book | undefined {
  return booksBySlug.get(slug)
}

export function getBooksByTopic(topicCode: string): Book[] {
  return booksByTopic.get(topicCode) || []
}

// ── Authors ──────────────────────────────────────────────────────────────

const authors: Author[] = authorsData as Author[]
const authorsBySlug = new Map<string, Author>()
for (const a of authors) {
  authorsBySlug.set(a.slug, a)
}

export function getAllAuthors(): Author[] {
  return authors
}

export function getAuthorBySlug(slug: string): Author | undefined {
  return authorsBySlug.get(slug)
}

export function getAuthorBooks(authorSlug: string): Book[] {
  const author = authorsBySlug.get(authorSlug)
  if (!author) return []
  return author.bookSlugs.map((s) => booksBySlug.get(s)).filter((b): b is Book => !!b)
}

// ── Sub-topics ──────────────────────────────────────────────────────────

const topics: SubTopic[] = topicsData as SubTopic[]
const topicsByCode = new Map<string, SubTopic>()
const topicsByQuestion = new Map<number, SubTopic[]>()
for (const t of topics) {
  topicsByCode.set(t.code, t)
  if (!topicsByQuestion.has(t.questionNumber)) topicsByQuestion.set(t.questionNumber, [])
  topicsByQuestion.get(t.questionNumber)!.push(t)
}

export function getAllTopics(): SubTopic[] {
  return topics
}

export function getTopicByCode(code: string): SubTopic | undefined {
  return topicsByCode.get(code)
}

export function getTopicsByQuestion(questionNumber: number): SubTopic[] {
  return topicsByQuestion.get(questionNumber) || []
}

// ── Questions ────────────────────────────────────────────────────────────

const questions: Question[] = questionsData as Question[]

export function getAllQuestions(): Question[] {
  return questions
}

export function getQuestionByCode(code: string): Question | undefined {
  return questions.find((q) => q.code === code)
}

export function getQuestionByNumber(n: number): Question | undefined {
  return questions.find((q) => q.number === n)
}

// ── Minimum Book List ────────────────────────────────────────────────────

const minimumBooks: MinimumBook[] = minimumBooksData as MinimumBook[]

export function getMinimumBookList(): MinimumBook[] {
  return minimumBooks
}

// ── Composite helpers ────────────────────────────────────────────────────

/** Get all books for a question by aggregating its sub-topics' books. */
export function getBooksByQuestion(questionNumber: number): Book[] {
  const qTopics = getTopicsByQuestion(questionNumber)
  const seen = new Set<string>()
  const result: Book[] = []
  for (const t of qTopics) {
    for (const b of getBooksByTopic(t.code)) {
      if (!seen.has(b.slug)) {
        seen.add(b.slug)
        result.push(b)
      }
    }
  }
  return result
}

/** Search books by title (case-insensitive, partial match) */
export function searchBooks(query: string): Book[] {
  const q = query.toLowerCase()
  return books.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
}

/** Search authors by name */
export function searchAuthors(query: string): Author[] {
  const q = query.toLowerCase()
  return authors.filter((a) => a.name.toLowerCase().includes(q))
}

/** Get topic count for a question */
export function getTopicCount(questionNumber: number): number {
  return getTopicsByQuestion(questionNumber).length
}

/** Get book count for a topic */
export function getBookCount(topicCode: string): number {
  return getBooksByTopic(topicCode).length
}

/** Get question by sub-topic code */
export function getQuestionByTopicCode(topicCode: string): Question | undefined {
  const topic = topicsByCode.get(topicCode)
  if (!topic) return undefined
  return getQuestionByNumber(topic.questionNumber)
}

/** Get dimension info for a question number */
export function getDimensionByQuestionNumber(n: number): Dimension {
  if (n === 1) return "meta"
  if (n >= 2 && n <= 4) return "heaven"
  if (n >= 5 && n <= 7) return "earth"
  if (n >= 8 && n <= 10) return "human"
  return "heaven"
}

/** Get the 元典 topic (code "0") */
export function getClassicsTopic(): SubTopic | undefined {
  return topicsByCode.get("0")
}

/** Get 元典 books */
export function getClassicsBooks(): Book[] {
  return getBooksByTopic("0")
}

// ── Wise persons by question ────────────────────────────────────────────

/** Get all wise persons (mock + stub) grouped by question number */
export function getWisePersonsByQuestion(): { question: Question; wisePersons: WisePerson[] }[] {
  const allAuthors = getAllAuthors()
  const personsByQuestion = new Map<number, WisePerson[]>()
  const questions = getAllQuestions()

  // Initialize with all questions
  for (const q of questions) {
    personsByQuestion.set(q.number, [])
  }

  // Map stub authors by their topicCodes
  for (const author of allAuthors) {
    const qNumbers = new Set<number>()
    for (const tc of author.topicCodes) {
      const qn = parseInt(tc.split(".")[0])
      if (qn >= 1 && qn <= 10) qNumbers.add(qn)
    }
    if (qNumbers.size === 0) continue

    const curatedLinks = getCuratedLinks(author.slug)
    const stub: WisePerson = {
      id: `stub-${author.slug}`,
      slug: author.slug,
      name: author.name,
      summary: "",
      biography: "",
      coreThoughts: "",
      era: "contemporary",
      discipline: "philosophy",
      region: "western",
      tags: [],
      works: [],
      relatedWisePersonSlugs: [],
      isStub: true,
      bookSlugs: author.bookSlugs,
      topicCodes: author.topicCodes,
      wikipediaLink: guessWikipediaLink(author.name),
      links: curatedLinks.length > 0 ? curatedLinks : undefined,
    }

    for (const qn of qNumbers) {
      const list = personsByQuestion.get(qn)
      if (list) list.push(stub)
    }
  }

  // Map mock wise persons by their questionNumbers field
  for (const mock of mockWisePersons) {
    const qNumbers = mock.questionNumbers || [1]
    for (const qn of qNumbers) {
      const list = personsByQuestion.get(qn)
      if (list) list.push(mock)
    }
  }

  // Deduplicate per question: mock persons take priority over stubs with same name
  for (const [qn, list] of personsByQuestion) {
    const seenSlugs = new Set<string>()
    // First pass: collect mock person names
    const mockNames = new Set(
      list.filter((p) => !p.isStub).map((p) => p.name)
    )
    personsByQuestion.set(
      qn,
      list.filter((p) => {
        if (seenSlugs.has(p.slug)) return false
        // Skip stub if a mock person with the same name exists in this question
        if (p.isStub && mockNames.has(p.name)) return false
        seenSlugs.add(p.slug)
        return true
      })
    )
  }

  return questions
    .filter((q) => (personsByQuestion.get(q.number)?.length || 0) > 0)
    .map((q) => ({
      question: q,
      wisePersons: personsByQuestion.get(q.number) || [],
    }))
}

/** Convert an Author to a stub WisePerson */
function authorToStubWisePerson(author: Author): WisePerson {
  const curatedLinks = getCuratedLinks(author.slug)
  return {
    id: `stub-${author.slug}`,
    slug: author.slug,
    name: author.name,
    summary: "",
    biography: "",
    coreThoughts: "",
    era: "contemporary",
    discipline: "philosophy",
    region: "western",
    tags: [],
    works: [],
    relatedWisePersonSlugs: [],
    isStub: true,
    bookSlugs: author.bookSlugs,
    topicCodes: author.topicCodes,
    wikipediaLink: guessWikipediaLink(author.name),
    links: curatedLinks.length > 0 ? curatedLinks : undefined,
    portrait: portraitMap[author.slug]?.portrait_url,
  }
}

/** Get wise persons (mock + stub) grouped by sub-topic within a question */
export function getWisePersonsByTopicInQuestion(
  questionNumber: number
): { topic: SubTopic; wisePersons: WisePerson[] }[] {
  const allAuthors = getAllAuthors()
  const topics = getTopicsByQuestion(questionNumber)

  return topics.map((topic) => {
    const seenSlugs = new Set<string>()
    const wisePersons: WisePerson[] = []

    // Stub authors matching this topic code
    for (const author of allAuthors) {
      if (author.topicCodes.includes(topic.code)) {
        if (!seenSlugs.has(author.slug)) {
          seenSlugs.add(author.slug)
          wisePersons.push(authorToStubWisePerson(author))
        }
      }
    }

    // Mock persons matching this topic code
    for (const mock of mockWisePersons) {
      if (mock.topicCodes?.includes(topic.code)) {
        if (!seenSlugs.has(mock.slug)) {
          seenSlugs.add(mock.slug)
          wisePersons.push(mock)
        }
      }
    }

    // Remove stub entries shadowed by a mock person with the same name within this topic
    const mockNamesInTopic = new Set(
      wisePersons.filter((p) => !p.isStub).map((p) => p.name)
    )
    const filtered = wisePersons.filter(
      (p) => !(p.isStub && mockNamesInTopic.has(p.name))
    )

    return { topic, wisePersons: filtered }
  })
}
