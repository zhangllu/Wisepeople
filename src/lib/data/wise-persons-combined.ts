/**
 * Combined wise persons data:
 * - 10 hand-curated mock wise persons (full profiles)
 * - 778 author stubs from Excel data (limited info, isStub: true)
 */
import type { WisePerson } from "@/types"
import { mockWisePersons } from "@/lib/stores/mock-data"
import { getAllAuthors, getBooksByTopic } from "@/lib/data"

/** Guess Wikipedia link from author name */
function guessWikipediaLink(name: string): string {
  // If name contains CJK characters, use Chinese Wikipedia
  const hasCJK = /[\u4e00-\u9fff\u3400-\u4dbf]/.test(name)
  const base = hasCJK
    ? "https://zh.wikipedia.org/wiki/"
    : "https://en.wikipedia.org/wiki/"
  return base + encodeURIComponent(name)
}

/** Generate stub WisePerson objects from Excel author data */
function generateAuthorStubs(): WisePerson[] {
  const authors = getAllAuthors()
  const stubs: WisePerson[] = []

  for (const author of authors) {
    // Skip if name matches an existing mock wise person
    if (mockWisePersons.some((m) => m.name === author.name)) continue

    stubs.push({
      id: `stub-${author.slug}`,
      slug: author.slug,
      name: author.name,
      summary: "",
      biography: "",
      coreThoughts: "",
      era: "contemporary",
      discipline: "philosophy",
      region: "eastern",
      tags: [],
      works: [],
      relatedWisePersonSlugs: [],
      isStub: true,
      bookSlugs: author.bookSlugs,
      topicCodes: author.topicCodes,
      wikipediaLink: guessWikipediaLink(author.name),
    })
  }

  return stubs
}

let _combined: WisePerson[] | null = null

export function getAllWisePersons(): WisePerson[] {
  if (!_combined) {
    _combined = [...mockWisePersons, ...generateAuthorStubs()]
  }
  return _combined
}
