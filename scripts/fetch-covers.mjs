#!/usr/bin/env node
/**
 * 豆瓣书籍封面图片抓取脚本
 * 
 * 从 books.json 和 minimum_books.json 中提取豆瓣链接，
 * 抓取封面图片并保存到 public/images/covers/
 * 
 * 用法: node scripts/fetch-covers.mjs [--limit N] [--start N]
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
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--limit" && args[i + 1]) LIMIT = parseInt(args[i + 1])
  if (args[i] === "--start" && args[i + 1]) START = parseInt(args[i + 1])
}

const DELAY_MS = 1500          // Delay between requests
const TIMEOUT_MS = 15000       // Request timeout
const MAX_RETRIES = 2          // Retries on failure
const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"

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

// ── Core scraping ──

async function fetchCoverUrl(doubanId) {
  // Try the API endpoint first (returns JSON with images)
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
        // API returns images object: { small, medium, large }
        if (json?.images?.large) return json.images.large
        if (json?.images?.medium) return json.images.medium
        if (json?.image) return json.image
      } else {
        const html = await res.text()
        // Parse cover from HTML — look for the main book cover img
        // Pattern 1: <a class="nbg" ...><img src="..." /></a>
        let m = html.match(/class="nbg"[^>]*>\s*<img[^>]+src="([^"]+)"/)
        if (m) return m[1]
        // Pattern 2: <img ... rel="v:photo" src="..." />
        m = html.match(/rel="v:photo"[^>]*src="([^"]+)"/)
        if (m) return m[1]
        // Pattern 3: og:image meta tag
        m = html.match(/property="og:image"\s+content="([^"]+)"/)
        if (m) return m[1]
        // Pattern 4: any img inside the book cover area
        m = html.match(/id="mainpic"[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"/)
        if (m) return m[1]
      }
    } catch {
      // Continue to next URL
    }
  }
  return null
}

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
    return !existing.has(filename) && extractDoubanId(b.doubanLink)
  })

  console.log(`\n📚 Total books: ${allBooks.size}`)
  console.log(`📋 Processing: ${bookList.length} (start=${START}, limit=${LIMIT === Infinity ? "all" : LIMIT})`)
  console.log(`✅ Already have covers: ${existing.size}`)
  console.log(`🖼️  Need to fetch: ${needsCover.length}\n`)

  let success = 0
  let failed = 0
  let skipped = 0

  for (let i = 0; i < needsCover.length; i++) {
    const book = needsCover[i]
    const doubanId = extractDoubanId(book.doubanLink)
    const filename = slugToFilename(book.slug)
    const filepath = path.join(COVERS_DIR, filename)

    process.stdout.write(`[${i + 1}/${needsCover.length}] ${book.title.slice(0, 20).padEnd(20)} `)

    let coverUrl = null
    for (let retry = 0; retry <= MAX_RETRIES; retry++) {
      coverUrl = await fetchCoverUrl(doubanId)
      if (coverUrl) break
      if (retry < MAX_RETRIES) {
        process.stdout.write(`retry `)
        await sleep(3000)
      }
    }

    if (!coverUrl) {
      process.stdout.write(`❌ no cover found\n`)
      failed++
      await sleep(DELAY_MS)
      continue
    }

    // Upgrade to large image if possible
    coverUrl = coverUrl.replace(/\/s\/public/, "/l/public").replace(/\/s\//, "/l/")

    const downloaded = await downloadImage(coverUrl, filepath)
    if (downloaded) {
      process.stdout.write(`✅ saved\n`)
      success++
    } else {
      process.stdout.write(`❌ download failed\n`)
      failed++
    }

    // Rate limiting
    if (i < needsCover.length - 1) {
      await sleep(DELAY_MS)
    }
  }

  // Summary
  console.log(`\n${"─".repeat(50)}`)
  console.log(`✅ Success: ${success}`)
  console.log(`❌ Failed:  ${failed}`)
  console.log(`⏭️  Skipped: ${bookList.length - needsCover.length} (already had cover or no douban link)`)
  console.log(`📁 Covers saved to: ${COVERS_DIR}`)
}

main().catch(console.error)
