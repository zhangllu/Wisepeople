/** Guess Wikipedia URL from an author name (CJK → zh.wikipedia, otherwise en.wikipedia) */
export function guessWikipediaLink(name: string): string {
  const hasCJK = /[\u4e00-\u9fff\u3400-\u4dbf]/.test(name)
  const base = hasCJK
    ? "https://zh.wikipedia.org/wiki/"
    : "https://en.wikipedia.org/wiki/"
  return base + encodeURIComponent(name)
}
