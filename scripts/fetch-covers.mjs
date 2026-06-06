#!/usr/bin/env node
/**
 * 书籍封面图片抓取脚本（双源：豆瓣 + OpenLibrary）
 * 
 * 从 books.json 和 minimum_books.json 中提取豆瓣链接，
 * 抓取封面图片并保存到 public/images/covers/
 * 
 * 当豆瓣被封锁时，自动回退到 OpenLibrary（对翻译书效果好）
 * 
 * 用法: node scripts/fetch-covers.mjs [--limit N] [--start N] [--source auto|douban|openlibrary]
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const COVERS_DIR = path.join(ROOT, "public/images/covers")
const BOOKS_JSON = path.join(ROOT, "src/data/books.json")
const MIN_BOOKS_JSON = path.join(ROOT, "src/data/minimum_books.json")

// Parse CLI args
const args = process.argv.slice(2)
let LIMIT = Infinity
let START = 0
let SOURCE = "auto"  // auto | douban | openlibrary
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--limit" && args[i + 1]) LIMIT = parseInt(args[i + 1])
  if (args[i] === "--start" && args[i + 1]) START = parseInt(args[i + 1])
  if (args[i] === "--source" && args[i + 1]) SOURCE = args[i + 1]
}

const DELAY_MS = 1500          // Delay between requests
const TIMEOUT_MS = 15000       // Request timeout
const MAX_RETRIES = 2          // Retries on failure
const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
const OL_DELAY_MS = 800        // OpenLibrary rate limit (more lenient)

// ── Helpers ──

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function extractDoubanId(url) {
  if (!url) return null
  const m = url.match(/book\.douban\.com\/subject\/(\d+)/)
  return m ? m[1] : null
}

function slugToFilename(slug) {
  return `${slug}.jpg`
}

// ── English text extraction ──

/**
 * Extract English/Latin title from mixed Chinese-English title string.
 * E.g., "隐性维度Tacit Dimension" → "Tacit Dimension"
 *       "图尔敏方法 The Toulmin Method" → "The Toulmin Method"
 *       "老子" → null (pure Chinese)
 */
function extractEnglishTitle(title) {
  if (!title) return null
  // Remove content in Chinese brackets like 《》
  const cleaned = title.replace(/《[^》]*》/g, "").trim()
  // Try to find a substantial English segment (at least 3 consecutive Latin words)
  const englishParts = cleaned.match(/[A-Za-z][A-Za-z\s':\-&,.;!?]+/g)
  if (englishParts) {
    // Find the longest English segment
    const longest = englishParts.reduce((a, b) => a.length > b.length ? a : b, "")
    const trimmed = longest.trim()
    if (trimmed.length >= 3 && trimmed.split(/\s+/).length >= 1) {
      // Filter out segments that are just author names or abbreviations
      return trimmed
    }
  }
  return null
}

/**
 * Extract English author name from mixed Chinese-English author string.
 * E.g., "迈克尔·波兰尼Michael Polanyi" → "Michael Polanyi"
 *       "斯蒂芬·图尔敏 Stephen E.Toulmin" → "Stephen E.Toulmin"
 *       "老子" → null
 */
function extractEnglishAuthor(author) {
  if (!author) return null
  // Try to find English name segments
  const englishParts = author.match(/[A-Z][A-Za-z\s'.\-]+/g)
  if (englishParts) {
    const longest = englishParts.reduce((a, b) => a.length > b.length ? a : b, "")
    const trimmed = longest.trim()
    if (trimmed.length >= 3) return trimmed
  }
  return null
}

/**
 * Extract surname from an English author name for broader search.
 * E.g., "Michael Polanyi" → "Polanyi"
 *       "Isaiah Berlin" → "Berlin"
 */
function extractSurname(englishAuthor) {
  if (!englishAuthor) return null
  const parts = englishAuthor.trim().split(/\s+/)
  return parts[parts.length - 1]
}

// ── Douban scraping ──

async function fetchDoubanCoverUrl(doubanId) {
  const apiUrl = `https://book.douban.com/api/v2/book/${doubanId}`
  const pageUrl = `https://book.douban.com/subject/${doubanId}/`

  for (const url of [apiUrl, pageUrl]) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: url === apiUrl ? "application/json" : "text/html",
          "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      })

      if (!res.ok) continue

      if (url === apiUrl) {
        const json = await res.json()
        if (json?.images?.large) return json.images.large
        if (json?.images?.medium) return json.images.medium
        if (json?.image) return json.image
      } else {
        const html = await res.text()
        let m = html.match(/class="nbg"[^>]*>\s*<img[^>]+src="([^"]+)"/)
        if (m) return m[1]
        m = html.match(/rel="v:photo"[^>]*src="([^"]+)"/)
        if (m) return m[1]
        m = html.match(/property="og:image"\s+content="([^"]+)"/)
        if (m) return m[1]
        m = html.match(/id="mainpic"[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"/)
        if (m) return m[1]
      }
    } catch {
      // Continue to next URL
    }
  }
  return null
}

// ── OpenLibrary scraping ──

async function searchOpenLibrary(title, author) {
  try {
    const params = new URLSearchParams({ limit: "3" })
    if (title) params.set("title", title)
    if (author) params.set("author", author)
    
    const url = `https://openlibrary.org/search.json?${params}`
    const res = await fetch(url, {
      headers: { "User-Agent": "WisePeopleBot/1.0 (educational project)" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!res.ok) return null

    const data = await res.json()
    if (!data.docs?.length) return null

    // Find first result with a cover
    for (const doc of data.docs) {
      if (doc.cover_i) {
        return {
          coverUrl: `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`,
          matchedTitle: doc.title,
          source: "openlibrary",
        }
      }
      // Also check cover_edition_key
      if (doc.cover_edition_key) {
        return {
          coverUrl: `https://covers.openlibrary.org/b/olid/${doc.cover_edition_key}-L.jpg`,
          matchedTitle: doc.title,
          source: "openlibrary",
        }
      }
    }
    return null
  } catch {
    return null
  }
}

/**
 * Try multiple search strategies on OpenLibrary for a single book.
 * Returns the first successful result or null.
 */
async function fetchOpenLibraryCover(book) {
  const enTitle = extractEnglishTitle(book.title)
  const enAuthor = extractEnglishAuthor(book.author)
  const surname = extractSurname(enAuthor)

  // Strategy 1: English title + English author (best for translated books)
  if (enTitle && enAuthor) {
    const result = await searchOpenLibrary(enTitle, surname || enAuthor)
    if (result) return result
    await sleep(OL_DELAY_MS)
  }

  // Strategy 2: English title only (broader search)
  if (enTitle) {
    const result = await searchOpenLibrary(enTitle, null)
    if (result) return result
    await sleep(OL_DELAY_MS)
  }

  // Strategy 3: English title + Chinese author (for books where Chinese title has English)
  if (enTitle && book.author && !enAuthor) {
    const result = await searchOpenLibrary(enTitle, book.author)
    if (result) return result
    await sleep(OL_DELAY_MS)
  }

  // Strategy 4: Chinese title + English author
  if (book.author && enAuthor) {
    const result = await searchOpenLibrary(book.title, surname || enAuthor)
    if (result) return result
    await sleep(OL_DELAY_MS)
  }

  return null
}

// ── Image download ──

async function downloadImage(imageUrl, filepath) {
  try {
    const res = await fetch(imageUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        Referer: "https://book.douban.com/",
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!res.ok) return false

    const buffer = Buffer.from(await res.arrayBuffer())
    // Basic validation: ensure it's actually an image (> 1KB)
    if (buffer.length < 1024) return false
    fs.writeFileSync(filepath, buffer)
    return true
  } catch {
    return false
  }
}

// ── Main ──

async function main() {
  // Ensure output dir
  fs.mkdirSync(COVERS_DIR, { recursive: true })

  // Load books
  const books = JSON.parse(fs.readFileSync(BOOKS_JSON, "utf-8"))
  const minBooks = JSON.parse(fs.readFileSync(MIN_BOOKS_JSON, "utf-8"))

  // Merge all books (dedupe by slug)
  const allBooks = new Map()
  for (const b of books) allBooks.set(b.slug, b)
  for (const b of minBooks) {
    if (!allBooks.has(b.slug)) allBooks.set(b.slug, b)
  }

  const bookList = [...allBooks.values()].slice(START, START + LIMIT)

  // Check existing covers
  const existing = new Set(fs.readdirSync(COVERS_DIR))

  // Filter to books that need covers
  const needsCover = bookList.filter((b) => {
    const filename = slugToFilename(b.slug)
    return !existing.has(filename)
  })

  console.log(`\n📚 Total books: ${allBooks.size}`)
  console.log(`📋 Processing: ${bookList.length} (start=${START}, limit=${LIMIT === Infinity ? "all" : LIMIT})`)
  console.log(`✅ Already have covers: ${existing.size}`)
  console.log(`🖼️  Need to fetch: ${needsCover.length}`)
  console.log(`🔧 Source mode: ${SOURCE}\n`)

  let doubanSuccess = 0
  let olSuccess = 0
  let failed = 0
  let doubanBlocked = false  // Track if Douban is consistently failing

  for (let i = 0; i < needsCover.length; i++) {
    const book = needsCover[i]
    const doubanId = extractDoubanId(book.doubanLink)
    const filename = slugToFilename(book.slug)
    const filepath = path.join(COVERS_DIR, filename)

    process.stdout.write(`[${i + 1}/${needsCover.length}] ${book.title.slice(0, 22).padEnd(22)} `)

    let coverUrl = null
    let source = ""

    // ── Try Douban first (unless source=openlibrary) ──
    if ((SOURCE === "auto" || SOURCE === "douban") && doubanId && !doubanBlocked) {
      for (let retry = 0; retry <= (doubanBlocked ? 0 : MAX_RETRIES); retry++) {
        coverUrl = await fetchDoubanCoverUrl(doubanId)
        if (coverUrl) {
          coverUrl = coverUrl.replace(/\/s\/public/, "/l/public").replace(/\/s\//, "/l/")
          source = "douban"
          break
        }
        if (retry < MAX_RETRIES && !doubanBlocked) {
          process.stdout.write(`retry `)
          await sleep(2000)
        }
      }
      // If Douban failed 3+ times consecutively, mark as blocked to speed up
      if (!coverUrl && SOURCE === "auto") {
        doubanBlocked = true
        process.stdout.write(`[douban blocked, switching to OL] `)
      }
    }

    // ── Fallback to OpenLibrary (unless source=douban) ──
    if (!coverUrl && (SOURCE === "auto" || SOURCE === "openlibrary")) {
      const olResult = await fetchOpenLibraryCover(book)
      if (olResult) {
        coverUrl = olResult.coverUrl
        source = "OL"
      }
    }

    if (!coverUrl) {
      process.stdout.write(`❌ no cover\n`)
      failed++
      await sleep(SOURCE === "douban" ? DELAY_MS : OL_DELAY_MS)
      continue
    }

    const downloaded = await downloadImage(coverUrl, filepath)
    if (downloaded) {
      const srcLabel = source === "douban" ? "📗" : "📘"
      process.stdout.write(`${srcLabel} saved (${source})\n`)
      if (source === "douban") doubanSuccess++
      else olSuccess++
    } else {
      process.stdout.write(`❌ download failed\n`)
      failed++
    }

    // Rate limiting
    if (i < needsCover.length - 1) {
      await sleep(source === "douban" ? DELAY_MS : OL_DELAY_MS)
    }
  }

  // Summary
  console.log(`\n${"─".repeat(50)}`)
  console.log(`📗 Douban:  ${doubanSuccess}`)
  console.log(`📘 OpenLib: ${olSuccess}`)
  console.log(`❌ Failed:  ${failed}`)
  console.log(`⏭️  Skipped: ${bookList.length - needsCover.length} (already had cover)`)
  console.log(`📁 Covers saved to: ${COVERS_DIR}`)
}

main().catch(console.error)
