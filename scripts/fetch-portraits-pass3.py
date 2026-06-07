"""
Third-pass portrait fetch: try Wikidata, Open Library, and Wikimedia Commons
for the 16 authors that Wikipedia search couldn't find.

Sources:
  1. Wikidata SPARQL — query entities by name, get image property (P18)
  2. Open Library API — search authors, get photo URL
  3. Wikimedia Commons — search for portrait files by name
"""
import json
import re
import time
import ssl
import urllib.request
import urllib.error
import urllib.parse

try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

AUTHORS_FILE = "src/data/authors.json"
EXISTING_PORTRAITS = "src/data/portraits.json"
OUTPUT_FILE = "scripts/portraits-pass3.json"
USER_AGENT = "WisepeopleBot/1.0 (educational project; zhanglu@example.com)"

WIKIDATA_SPARQL = "https://query.wikidata.org/sparql"
OPENLIBRARY_SEARCH = "https://openlibrary.org/search/authors.json?q={query}&limit=1"
COMMONS_SEARCH = "https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={query}+filetype:bitmap&srnamespace=6&srlimit=3&format=json"
COMMONS_IMAGE = "https://commons.wikimedia.org/w/api.php?action=query&titles={title}&prop=imageinfo&iiprop=url&format=json"


def fetch_json(url: str, headers: dict | None = None) -> dict | None:
    """Generic JSON fetch."""
    hdrs = {"User-Agent": USER_AGENT, "Accept": "application/json"}
    if headers:
        hdrs.update(headers)
    req = urllib.request.Request(url, headers=hdrs)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read())
    except Exception as e:
        return None


def fetch_text(url: str, headers: dict | None = None) -> str | None:
    """Generic text fetch."""
    hdrs = {"User-Agent": USER_AGENT}
    if headers:
        hdrs.update(headers)
    req = urllib.request.Request(url, headers=hdrs)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return resp.read().decode("utf-8")
    except Exception:
        return None


def parse_name(full_name: str) -> tuple[str | None, str | None]:
    """Parse name into (english_name, chinese_name)."""
    m = re.match(r"^(.+?)\s*[（(](.+?)[）)]$", full_name)
    if m:
        return m.group(1).strip(), m.group(2).strip()
    if re.search(r"[\u4e00-\u9fff]", full_name):
        return None, full_name.strip()
    return full_name.strip(), None


# ──────────────────────────────────────────────
# Source 1: Wikidata SPARQL
# ──────────────────────────────────────────────
def try_wikidata(name: str, is_chinese: bool = False) -> str | None:
    """Search Wikidata for a person entity and get their image (P18)."""
    # Build SPARQL query
    label_lang = "zh" if is_chinese else "en"
    # Escape special chars in name
    safe_name = name.replace("'", "\\'").replace('"', '\\"')

    query = f"""
    SELECT ?item ?image WHERE {{
      ?item rdfs:label "{safe_name}"@{label_lang} .
      ?item wdt:P31 wd:Q5 .
      ?item wdt:P18 ?image .
    }} LIMIT 3
    """

    encoded = urllib.parse.quote(query)
    url = f"{WIKIDATA_SPARQL}?query={encoded}&format=json"
    data = fetch_json(url, headers={"Accept": "application/sparql-results+json"})

    if data:
        results = data.get("results", {}).get("bindings", [])
        for r in results:
            img = r.get("image", {}).get("value")
            if img:
                # Convert Wikimedia Commons URL to usable thumbnail
                # img is like http://commons.wikimedia.org/wiki/Special:FilePath/...
                # We need to convert it to a thumbnail URL
                filename = img.split("/Special:FilePath/")[-1] if "/Special:FilePath/" in img else ""
                if filename:
                    # Use the Wikipedia thumbnail API for the file
                    fname_decoded = urllib.parse.unquote(filename)
                    thumb_url = get_commons_thumbnail(fname_decoded, 320)
                    if thumb_url:
                        return thumb_url
                # Fallback: use the raw URL
                return img
    return None


def try_wikidata_search(name: str) -> str | None:
    """Search Wikidata via the search API, then get image."""
    search_url = f"https://www.wikidata.org/w/api.php?action=wbsearchentities&search={urllib.parse.quote(name)}&language=en&type=item&limit=3&format=json"
    data = fetch_json(search_url)
    if not data:
        return None

    for result in data.get("search", []):
        entity_id = result.get("id")
        if not entity_id:
            continue

        # Get entity properties including image (P18)
        entity_url = f"https://www.wikidata.org/w/api.php?action=wbgetentities&ids={entity_id}&props=claims&format=json"
        edata = fetch_json(entity_url)
        if not edata:
            continue

        entities = edata.get("entities", {})
        entity = entities.get(entity_id, {})
        claims = entity.get("claims", {})

        # P18 = image
        if "P18" in claims:
            for claim in claims["P18"]:
                mainsnak = claim.get("mainsnak", {})
                value = mainsnak.get("datavalue", {}).get("value", "")
                if value:
                    thumb = get_commons_thumbnail(value, 320)
                    if thumb:
                        return thumb
    return None


def get_commons_thumbnail(filename: str, width: int = 320) -> str | None:
    """Get thumbnail URL for a Wikimedia Commons file."""
    encoded = urllib.parse.quote(f"File:{filename}", safe="")
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={encoded}&prop=imageinfo&iiprop=url&iiurlwidth={width}&format=json"
    data = fetch_json(url)
    if data:
        pages = data.get("query", {}).get("pages", {})
        for page_id, page in pages.items():
            if page_id == "-1":
                continue
            ii = page.get("imageinfo", [{}])[0]
            thumb = ii.get("thumburl") or ii.get("url")
            if thumb:
                return thumb
    return None


# ──────────────────────────────────────────────
# Source 2: Open Library
# ──────────────────────────────────────────────
def try_open_library(name: str) -> str | None:
    """Search Open Library for an author and get their photo."""
    encoded = urllib.parse.quote(name)
    url = OPENLIBRARY_SEARCH.format(query=encoded)
    data = fetch_json(url)
    if not data:
        return None

    docs = data.get("docs", [])
    for doc in docs[:3]:
        # Check if the name matches closely
        ol_name = doc.get("name", "")
        # Simple similarity check: same last name
        if name.split()[-1].lower() in ol_name.lower():
            key = doc.get("key", "")  # e.g., /authors/OL12345A
            photos = doc.get("photos", [])
            if photos:
                photo_id = photos[0]
                return f"https://covers.openlibrary.org/a/id/{photo_id}-M.jpg"
            # Try fetching author page for photo
            if key:
                author_url = f"https://openlibrary.org{key}.json"
                adata = fetch_json(author_url)
                if adata and adata.get("photos"):
                    photo_id = adata["photos"][0]
                    return f"https://covers.openlibrary.org/a/id/{photo_id}-M.jpg"
    return None


# ──────────────────────────────────────────────
# Source 3: Wikimedia Commons search
# ──────────────────────────────────────────────
def try_commons_search(name: str) -> str | None:
    """Search Wikimedia Commons for portrait images."""
    # Try "Name portrait" or "Name" on commons
    query = f"{name} portrait"
    encoded = urllib.parse.quote(query)
    url = COMMONS_SEARCH.format(query=encoded)
    data = fetch_json(url)
    if not data:
        return None

    results = data.get("query", {}).get("search", [])
    for result in results[:3]:
        title = result.get("title", "")
        # Skip logos, maps, etc.
        snippet = result.get("snippet", "").lower()
        if any(skip in snippet for skip in ["logo", "map", "flag", "coat of arms", "seal"]):
            continue
        # Get the actual image URL
        img_url = get_commons_thumbnail(title, 320)
        if img_url:
            return img_url
    return None


def try_commons_category(name: str) -> str | None:
    """Try to find a person's category on Commons and get a representative image."""
    # Search for "Category:Name" on commons
    search_url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(name)}&srnamespace=6&srlimit=5&format=json"
    data = fetch_json(search_url)
    if not data:
        return None

    results = data.get("query", {}).get("search", [])
    for result in results:
        title = result.get("title", "")
        # Only interested in File: pages (not Category:)
        if title.startswith("File:"):
            # Get image info
            img_url = get_commons_thumbnail(title, 320)
            if img_url:
                return img_url
    return None


# ──────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────
def main():
    with open(AUTHORS_FILE, "r", encoding="utf-8") as f:
        authors = json.load(f)
    with open(EXISTING_PORTRAITS, "r", encoding="utf-8") as f:
        existing = json.load(f)

    failed_authors = [a for a in authors if a["slug"] not in existing]
    print(f"Already have: {len(existing)} portraits")
    print(f"Third-pass retry for: {len(failed_authors)} authors")
    print()

    results = {}
    found = 0
    still_failed = []

    for i, author in enumerate(failed_authors):
        name = author["name"]
        slug = author["slug"]
        english_name, chinese_name = parse_name(name)

        portrait = None
        source_used = None

        # Strategy 1: Wikidata search API (works well for both EN and CN names)
        if not portrait and english_name:
            portrait = try_wikidata_search(english_name)
            if portrait:
                source_used = "wikidata_search"

        if not portrait and chinese_name:
            portrait = try_wikidata_search(chinese_name)
            if portrait:
                source_used = "wikidata_search_zh"

        # Strategy 2: Wikidata SPARQL
        if not portrait and english_name:
            portrait = try_wikidata(english_name, is_chinese=False)
            if portrait:
                source_used = "wikidata_sparql"

        if not portrait and chinese_name:
            portrait = try_wikidata(chinese_name, is_chinese=True)
            if portrait:
                source_used = "wikidata_sparql_zh"

        # Strategy 3: Open Library (mainly for Western authors)
        if not portrait and english_name:
            portrait = try_open_library(english_name)
            if portrait:
                source_used = "open_library"

        # Strategy 4: Wikimedia Commons search
        if not portrait and english_name:
            portrait = try_commons_search(english_name)
            if portrait:
                source_used = "commons_search"

        if not portrait and chinese_name:
            portrait = try_commons_search(chinese_name)
            if portrait:
                source_used = "commons_search_zh"

        # Strategy 5: Commons file search
        if not portrait and english_name:
            portrait = try_commons_category(english_name)
            if portrait:
                source_used = "commons_category"

        if portrait:
            results[slug] = {
                "portrait_url": portrait,
                "wiki_title": name,
                "name": name,
                "source": source_used,
            }
            found += 1
            status = "✓"
            print(f"  [{i+1}/{len(failed_authors)}] {status} {name} — via {source_used}")
        else:
            still_failed.append(name)
            status = "✗"
            print(f"  [{i+1}/{len(failed_authors)}] {status} {name}")

        time.sleep(0.3)

    # Save
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*50}")
    print(f"Third-pass results: {found}/{len(failed_authors)} new portraits found")
    print(f"Total after merge: {len(existing) + found}/{len(authors)} ({(len(existing)+found)/len(authors)*100:.1f}%)")
    print(f"Still failed ({len(still_failed)}):")
    for name in still_failed:
        print(f"  - {name}")


if __name__ == "__main__":
    main()
