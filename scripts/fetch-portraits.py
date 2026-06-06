"""
Fetch portrait thumbnails from Wikipedia REST API for all wise persons.

Strategy:
  - "English Name（中文）" → en.wikipedia.org with English name
  - Pure Chinese name → zh.wikipedia.org with Chinese name
  - Also try alternate name variants if first attempt fails

Outputs: portraits.json  { slug: { portrait_url, wiki_title, source } }
"""
import json
import re
import time
import sys
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
MOCK_FILE = "src/lib/stores/mock-data.ts"  # we'll parse the 10 curated persons from authors
OUTPUT_FILE = "scripts/portraits.json"
SUMMARY_API = "https://{lang}.wikipedia.org/api/rest_v1/page/summary/{title}"
USER_AGENT = "WisepeopleBot/1.0 (educational project; zhanglu@example.com)"

def fetch_wiki_summary(title: str, lang: str = "en") -> dict | None:
    """Fetch Wikipedia page summary, return thumbnail info or None."""
    encoded = urllib.parse.quote(title, safe="")
    url = SUMMARY_API.format(lang=lang, title=encoded)
    req = urllib.request.Request(url, headers={
        "User-Agent": USER_AGENT,
        "Accept": "application/json",
    })
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
            thumb = data.get("thumbnail")
            if thumb and thumb.get("source"):
                return {
                    "portrait_url": thumb["source"],
                    "wiki_title": data.get("title", title),
                    "description": data.get("description", ""),
                }
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
        # Rate limited or other error, wait and retry once
        if e.code == 429:
            time.sleep(2)
            try:
                with urllib.request.urlopen(req, timeout=10) as resp:
                    data = json.loads(resp.read())
                    thumb = data.get("thumbnail")
                    if thumb and thumb.get("source"):
                        return {
                            "portrait_url": thumb["source"],
                            "wiki_title": data.get("title", title),
                            "description": data.get("description", ""),
                        }
            except:
                pass
    except Exception:
        pass
    return None


def parse_name(full_name: str) -> tuple[str | None, str | None]:
    """
    Parse name into (english_name, chinese_name).
    Returns (None, chinese) for pure Chinese names.
    Returns (english, chinese) for "English（中文）" format.
    """
    m = re.match(r"^(.+?)\s*[（(](.+?)[）)]$", full_name)
    if m:
        return m.group(1).strip(), m.group(2).strip()
    # Pure name
    if re.search(r"[\u4e00-\u9fff]", full_name):
        return None, full_name.strip()
    return full_name.strip(), None


def get_highres_url(thumb_url: str) -> str:
    """Try to get a higher resolution version of the thumbnail."""
    # Wikipedia thumbnail URLs often have /thumb/ and a size parameter
    # We can request a larger version by modifying the URL
    # But the thumbnail from the API is usually good enough (typically ~320px)
    return thumb_url


def main():
    with open(AUTHORS_FILE, "r", encoding="utf-8") as f:
        authors = json.load(f)

    print(f"Loaded {len(authors)} authors")

    # Also load mock wise persons to get their names
    mock_names = {
        "plato": "Plato",
        "kant": "康德",
        "darwin": "Charles Darwin",
        "cao-xueqin": "曹雪芹",
        "laozi": "老子",
        "rousseau": "Jean-Jacques Rousseau",
        "karl-marx": "Karl Marx",
        "max-weber": "Max Weber",
        "adam-smith": "Adam Smith",
        "aristotle": "Aristotle",
    }

    results = {}
    total = len(authors)
    found = 0
    failed = 0
    errors = []

    for i, author in enumerate(authors):
        name = author["name"]
        slug = author["slug"] if "slug" in author else None
        if not slug:
            # Generate slug from name
            slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")

        english_name, chinese_name = parse_name(name)

        portrait = None

        # Strategy 1: Try English Wikipedia with English name
        if english_name and not portrait:
            portrait = fetch_wiki_summary(english_name, "en")

        # Strategy 2: Try Chinese Wikipedia with Chinese name
        if chinese_name and not portrait:
            portrait = fetch_wiki_summary(chinese_name, "zh")

        # Strategy 3: Try simplified English name (remove middle initials, etc.)
        if english_name and not portrait:
            simplified = re.sub(r"\s+[A-Z]\.\s*", " ", english_name).strip()
            if simplified != english_name:
                portrait = fetch_wiki_summary(simplified, "en")

        # Strategy 4: Try last name only for Western names
        if english_name and not portrait and len(english_name.split()) > 1:
            last_name = english_name.split()[-1]
            if len(last_name) > 3:  # Skip very short last names
                portrait = fetch_wiki_summary(last_name, "en")

        if portrait:
            results[slug] = {
                "portrait_url": portrait["portrait_url"],
                "wiki_title": portrait["wiki_title"],
                "name": name,
            }
            found += 1
            status = "✓"
        else:
            failed += 1
            status = "✗"
            errors.append(name)

        # Progress
        if (i + 1) % 20 == 0 or i == total - 1:
            print(f"  [{i+1}/{total}] {status} {name[:40]}... (found: {found}, failed: {failed})")

        # Be nice to the API
        time.sleep(0.15)

    # Save results
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*50}")
    print(f"Results: {found}/{total} portraits found ({found/total*100:.1f}%)")
    print(f"Saved to {OUTPUT_FILE}")
    print(f"\nFailed ({failed}):")
    for name in errors[:20]:
        print(f"  - {name}")
    if len(errors) > 20:
        print(f"  ... and {len(errors)-20} more")


if __name__ == "__main__":
    main()
