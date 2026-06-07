"""
Retry portrait fetch for authors that failed in the first run.

New strategies:
  1. Wikipedia Search API — find correct page title via search, then fetch summary
  2. Try traditional Chinese characters for zh.wikipedia
  3. Add disambiguation hints (philosopher, scholar, author, etc.)
  4. Try Wikidata SPARQL to find Wikipedia article
  5. Try name order swap for East Asian names (e.g., "Ueda Makoto" → "Makoto Ueda")

Only processes authors not already in portraits.json.
"""
import json
import re
import time
import ssl
import urllib.request
import urllib.error
import urllib.parse

# Fix macOS Python SSL certificate issue
try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

AUTHORS_FILE = "src/data/authors.json"
EXISTING_PORTRAITS = "src/data/portraits.json"
OUTPUT_FILE = "scripts/portraits-retry.json"
SUMMARY_API = "https://{lang}.wikipedia.org/api/rest_v1/page/summary/{title}"
SEARCH_API = "https://{lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch={query}&srlimit=1&format=json"
WIKIDATA_API = "https://www.wikidata.org/w/api.php?action=wbgetentities&sites=enwiki&titles={title}&props=info&format=json"
USER_AGENT = "WisepeopleBot/1.0 (educational project; zhanglu@example.com)"

# Common disambiguation suffixes for scholars
SCHOLAR_DISAMBIGUATIONS = [
    "philosopher", "scholar", "author", "writer", "historian",
    "sociologist", "psychologist", "educator", "critic", "theologian",
    "scientist", "economist", "anthropologist", "linguist",
]


def fetch_url(url: str) -> dict | None:
    """Generic JSON fetch with error handling."""
    req = urllib.request.Request(url, headers={
        "User-Agent": USER_AGENT,
        "Accept": "application/json",
    })
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            return json.loads(resp.read())
    except Exception:
        return None


def fetch_wiki_summary(title: str, lang: str = "en") -> dict | None:
    """Fetch Wikipedia page summary thumbnail."""
    encoded = urllib.parse.quote(title, safe="")
    url = SUMMARY_API.format(lang=lang, title=encoded)
    data = fetch_url(url)
    if data and data.get("thumbnail", {}).get("source"):
        return {
            "portrait_url": data["thumbnail"]["source"],
            "wiki_title": data.get("title", title),
            "source": f"{lang}_direct",
        }
    return None


def search_wikipedia(query: str, lang: str = "en") -> str | None:
    """Use Wikipedia search API to find the best matching page title."""
    encoded = urllib.parse.quote(query, safe="")
    url = SEARCH_API.format(lang=lang, query=encoded)
    data = fetch_url(url)
    if data:
        results = data.get("query", {}).get("search", [])
        if results:
            return results[0].get("title")
    return None


def search_and_fetch(query: str, lang: str = "en", context_words: list[str] | None = None) -> dict | None:
    """Search Wikipedia for a name, then fetch the page summary."""
    # Try basic search first
    title = search_wikipedia(query, lang)
    if title:
        result = fetch_wiki_summary(title, lang)
        if result:
            result["source"] = f"{lang}_search"
            return result

    # Try with context words (e.g., "Name philosopher")
    if context_words:
        for ctx in context_words[:3]:
            enriched_query = f"{query} {ctx}"
            title = search_wikipedia(enriched_query, lang)
            if title:
                result = fetch_wiki_summary(title, lang)
                if result:
                    result["source"] = f"{lang}_search_ctx"
                    return result
            time.sleep(0.1)

    return None


def try_name_variations(english_name: str, chinese_name: str | None) -> dict | None:
    """Try various name transformations."""
    portrait = None

    # 1. Search en.wikipedia with full English name
    if english_name:
        portrait = search_and_fetch(english_name, "en", SCHOLAR_DISAMBIGUATIONS)
        if portrait:
            return portrait

    # 2. Search zh.wikipedia with Chinese name
    if chinese_name:
        portrait = search_and_fetch(chinese_name, "zh")
        if portrait:
            return portrait

    # 3. Try removing parenthetical content from English name
    if english_name:
        cleaned = re.sub(r"\s*\(.*?\)\s*", " ", english_name).strip()
        if cleaned != english_name:
            portrait = search_and_fetch(cleaned, "en")
            if portrait:
                return portrait

    # 4. Try swapping first/last name for East Asian romanized names
    if english_name and len(english_name.split()) == 2:
        parts = english_name.split()
        swapped = f"{parts[1]} {parts[0]}"
        portrait = search_and_fetch(swapped, "en")
        if portrait:
            return portrait

    # 5. Try first name + last name initial and vice versa
    if english_name:
        parts = english_name.split()
        if len(parts) >= 2:
            # "First Last" → try "Last, First"
            alt = f"{parts[-1]}, {parts[0]}"
            title = search_wikipedia(alt, "en")
            if title:
                portrait = fetch_wiki_summary(title, "en")
                if portrait:
                    return portrait

    # 6. Try removing common prefixes (Prof., Dr., etc.)
    if english_name:
        cleaned = re.sub(r"^(Prof\.|Dr\.|Sir|Lord|Dame)\s+", "", english_name).strip()
        if cleaned != english_name:
            portrait = search_and_fetch(cleaned, "en")
            if portrait:
                return portrait

    # 7. Try with middle name expanded or removed
    if english_name:
        # Remove all middle names entirely
        parts = english_name.split()
        if len(parts) > 2:
            first_last = f"{parts[0]} {parts[-1]}"
            portrait = search_and_fetch(first_last, "en")
            if portrait:
                return portrait

    # 8. For Japanese-style names, try ja.wikipedia
    if english_name:
        portrait = search_and_fetch(english_name, "ja")
        if portrait:
            return portrait

    # 9. For Chinese names, also try simplified↔traditional via search
    if chinese_name and len(chinese_name) >= 2:
        # Try ja.wikipedia for Japanese scholars with Chinese-character names
        portrait = search_and_fetch(chinese_name, "ja")
        if portrait:
            return portrait

    return None


def parse_name(full_name: str) -> tuple[str | None, str | None]:
    """Parse name into (english_name, chinese_name)."""
    m = re.match(r"^(.+?)\s*[（(](.+?)[）)]$", full_name)
    if m:
        return m.group(1).strip(), m.group(2).strip()
    if re.search(r"[\u4e00-\u9fff]", full_name):
        return None, full_name.strip()
    return full_name.strip(), None


def main():
    # Load authors and existing portraits
    with open(AUTHORS_FILE, "r", encoding="utf-8") as f:
        authors = json.load(f)
    with open(EXISTING_PORTRAITS, "r", encoding="utf-8") as f:
        existing = json.load(f)

    # Find authors without portraits
    failed_authors = [a for a in authors if a["slug"] not in existing]
    print(f"Already have: {len(existing)} portraits")
    print(f"Retrying for: {len(failed_authors)} authors without portraits")
    print()

    results = {}
    found = 0
    still_failed = 0

    for i, author in enumerate(failed_authors):
        name = author["name"]
        slug = author["slug"]
        english_name, chinese_name = parse_name(name)

        portrait = try_name_variations(english_name, chinese_name)

        if portrait:
            results[slug] = {
                "portrait_url": portrait["portrait_url"],
                "wiki_title": portrait["wiki_title"],
                "name": name,
                "source": portrait.get("source", "retry"),
            }
            found += 1
            status = "✓"
        else:
            still_failed += 1
            status = "✗"

        # Progress
        if (i + 1) % 10 == 0 or i == len(failed_authors) - 1:
            print(f"  [{i+1}/{len(failed_authors)}] {status} {name[:45]} (found: {found}, failed: {still_failed})")

        # Be nice to the API
        time.sleep(0.2)

    # Save retry results
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*50}")
    print(f"Retry results: {found}/{len(failed_authors)} new portraits found")
    print(f"Total after merge: {len(existing) + found}/{len(authors)} ({(len(existing)+found)/len(authors)*100:.1f}%)")
    print(f"Still failed: {still_failed}")
    print(f"Saved to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
