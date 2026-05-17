/**
 * Curated links loader.
 *
 * Aggregates all batch JSON files from src/data/links/ and provides
 * lookup functions by author slug. Add one import line per new batch.
 */
import type { WisePersonLink } from "@/types"

// ── Import batches here (one line per batch) ───────────────────────────────
import batch001 from "@/data/links/curated-links-001.json"
import batch002 from "@/data/links/curated-links-002.json"
import batch003 from "@/data/links/curated-links-003.json"

// ── Loader ─────────────────────────────────────────────────────────────────

type LinksMap = Record<string, unknown>

const _allCuratedLinks = new Map<string, WisePersonLink[]>()

function _init(): void {
  const batches: LinksMap[] = [
    batch001,
    batch002,
    batch003,
  ]
  for (const batch of batches) {
    for (const [key, links] of Object.entries(batch)) {
      if (key.startsWith("_")) continue // skip metadata keys
      _allCuratedLinks.set(key, links as WisePersonLink[])
    }
  }
}

/** Get curated links for a specific author slug. Returns empty array if none. */
export function getCuratedLinks(slug: string): WisePersonLink[] {
  if (_allCuratedLinks.size === 0) _init()
  return _allCuratedLinks.get(slug) ?? []
}

/** Check if any curated links exist for a slug */
export function hasCuratedLinks(slug: string): boolean {
  if (_allCuratedLinks.size === 0) _init()
  return _allCuratedLinks.has(slug)
}

/** Get all slugs that have curated links (useful for progress tracking) */
export function getAllCuratedSlugs(): string[] {
  if (_allCuratedLinks.size === 0) _init()
  return Array.from(_allCuratedLinks.keys())
}
