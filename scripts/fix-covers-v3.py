"""
Fix book covers using Wayback Machine cached Douban pages.
Douban now requires login to view book pages, but Archive.org has cached snapshots
with the real cover image IDs from og:image meta tags.

Usage: uv run python scripts/fix-covers-v3.py
"""
import json
import os
import re
import ssl
import time
import urllib.request
import urllib.error

try:
    ssl._create_default_https_context = ssl._create_unverified_context
except AttributeError:
    pass

BOOKS_FILE = "src/data/books.json"
COVERS_DIR = "public/images/covers"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

# Regex to extract real image ID from og:image in Wayback-cached Douban pages
# Pattern inside Wayback: https://web.archive.org/web/...im_/https://imgN.doubanio.com/view/subject/l/public/s{ID}.jpg
OG_RE = re.compile(
    r'property="og:image"\s+content="https://web\.archive\.org/web/\d+im_/https://img\d+\.doubanio\.com/view/subject/l/public/s(\d+)\.jpg"'
)

def extract_douban_id(url):
    if not url: return None
    m = re.search(r"book\.douban\.com/subject/(\d+)", url)
    return m.group(1) if m else None

def get_wayback_snapshot_url(subject_id, max_retries=3):
    """Check Wayback Machine for a cached Douban page. Returns snapshot URL or None."""
    check_url = f"https://archive.org/wayback/available?url=https://book.douban.com/subject/{subject_id}/"
    for attempt in range(max_retries):
        try:
            req = urllib.request.Request(check_url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                snap = data.get("archived_snapshots", {}).get("closest", {})
                if snap and snap.get("available"):
                    return snap["url"]
                return None
        except (urllib.error.HTTPError, urllib.error.URLError, json.JSONDecodeError) as e:
            if attempt < max_retries - 1:
                time.sleep(2)
                continue
            return None
        except Exception:
            return None
    return None

def fetch_real_image_id_from_wayback(wayback_url):
    """Scrape og:image from a Wayback-cached Douban page to get real cover image ID."""
    req = urllib.request.Request(wayback_url, headers={
        "User-Agent": UA,
        "Accept-Language": "zh-CN,zh;q=0.9",
    })
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            html = resp.read().decode("utf-8", errors="replace")
            m = OG_RE.search(html)
            return m.group(1) if m else None
    except Exception:
        return None

def download_cover(image_id, filepath):
    """Download cover from Douban CDN using the correct image ID."""
    for mirror in range(1, 4):
        url = f"https://img{mirror}.doubanio.com/view/subject/l/public/s{image_id}.jpg"
        req = urllib.request.Request(url, headers={
            "User-Agent": UA,
            "Referer": "https://book.douban.com/",
        })
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = resp.read()
                if len(data) > 500:
                    with open(filepath, "wb") as f:
                        f.write(data)
                    return True
        except Exception:
            continue
    return False

def main():
    with open(BOOKS_FILE, "r", encoding="utf-8") as f:
        books = json.load(f)

    os.makedirs(COVERS_DIR, exist_ok=True)
    existing_covers = set(os.listdir(COVERS_DIR))

    # Build list of books to fix: have both cover + douban link
    to_fix = []
    for b in books:
        slug = b["slug"]
        douban_id = extract_douban_id(b.get("doubanLink", ""))
        if douban_id and f"{slug}.jpg" in existing_covers:
            to_fix.append((slug, douban_id, b["title"]))

    print(f"Total books with covers + douban links: {len(to_fix)}")

    fixed = 0
    wayback_miss = 0
    page_fail = 0
    dl_fail = 0
    skipped_same = 0
    start_time = time.time()

    for i, (slug, subject_id, title) in enumerate(to_fix):
        filepath = os.path.join(COVERS_DIR, f"{slug}.jpg")

        # 1. Find a Wayback Machine snapshot
        wayback_url = get_wayback_snapshot_url(subject_id)

        if not wayback_url:
            wayback_miss += 1
            if (i + 1) % 50 == 0:
                elapsed = time.time() - start_time
                print(f"  [{i+1}/{len(to_fix)}] {elapsed:.0f}s | fixed={fixed} wb_miss={wayback_miss} page_fail={page_fail} dl_fail={dl_fail} same={skipped_same}")
            time.sleep(0.5)
            continue

        # 2. Scrape the cached page for real image ID
        real_img_id = fetch_real_image_id_from_wayback(wayback_url)

        if not real_img_id:
            page_fail += 1
            if (i + 1) % 50 == 0:
                elapsed = time.time() - start_time
                print(f"  [{i+1}/{len(to_fix)]} {elapsed:.0f}s | fixed={fixed} wb_miss={wayback_miss} page_fail={page_fail} dl_fail={dl_fail} same={skipped_same}")
            time.sleep(0.5)
            continue

        # 3. If the image ID equals the subject ID, skip (already using subject ID cover, no better option)
        if real_img_id == subject_id:
            skipped_same += 1
            if (i + 1) % 100 == 0:
                elapsed = time.time() - start_time
                print(f"  [{i+1}/{len(to_fix)}] {elapsed:.0f}s | fixed={fixed} wb_miss={wayback_miss} page_fail={page_fail} dl_fail={dl_fail} same={skipped_same}")
            time.sleep(0.5)
            continue

        # 4. Download the correct cover
        ok = download_cover(real_img_id, filepath)
        if ok:
            fixed += 1
        else:
            dl_fail += 1

        if (i + 1) % 20 == 0 or i == len(to_fix) - 1:
            elapsed = time.time() - start_time
            remaining = len(to_fix) - i - 1
            eta = elapsed / (i + 1) * remaining if remaining > 0 else 0
            print(f"  [{i+1}/{len(to_fix)}] {elapsed:.0f}s elapsed, ~{eta:.0f}s remaining | "
                  f"fixed={fixed} wb_miss={wayback_miss} page_fail={page_fail} dl_fail={dl_fail} same={skipped_same}")

        # Rate limiting: be polite to Wayback Machine & Douban CDN
        time.sleep(0.5)

    elapsed = time.time() - start_time
    print(f"\n{'='*50}")
    print(f"Done in {elapsed:.0f}s")
    print(f"  Correct covers downloaded: {fixed}")
    print(f"  No Wayback snapshot: {wayback_miss}")
    print(f"  Cached page had no og:image: {page_fail}")
    print(f"  Download failed: {dl_fail}")
    print(f"  Image ID same as subject ID: {skipped_same}")

    final_count = len([f for f in os.listdir(COVERS_DIR) if f.endswith('.jpg')])
    print(f"  Total covers: {final_count}")

if __name__ == "__main__":
    main()
