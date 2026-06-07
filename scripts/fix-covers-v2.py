"""
Fix book covers by using the REAL image ID from Douban pages.
The CDN URL pattern s{subject_id}.jpg returns WRONG cover (old edition).
We scrape each Douban page to extract the actual cover image ID.

Optimization: only process books that have covers (skip already-removed ones).
"""
import json
import os
import re
import ssl
import time
import urllib.request
import hashlib

try:
    ssl._create_default_https_context = ssl._create_unverified_context
except AttributeError:
    pass

BOOKS_FILE = "src/data/books.json"
COVERS_DIR = "public/images/covers"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
OG_RE = re.compile(
    r'property="og:image"\s+content="https://img\d+\.doubanio\.com/view/subject/[a-z]/public/s(\d+)\.jpg"'
)

def extract_douban_id(url):
    if not url: return None
    m = re.search(r"book\.douban\.com/subject/(\d+)", url)
    return m.group(1) if m else None

def fetch_real_image_id(subject_id):
    """Scrape Douban page to extract the real cover image ID. Returns None on failure."""
    page_url = f"https://book.douban.com/subject/{subject_id}/"
    req = urllib.request.Request(page_url, headers={
        "User-Agent": UA,
        "Accept-Language": "zh-CN,zh;q=0.9",
    })
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
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

    # Only process books that have a cover AND a douban link
    to_fix = []
    for b in books:
        slug = b["slug"]
        douban_id = extract_douban_id(b.get("doubanLink", ""))
        if douban_id and f"{slug}.jpg" in existing_covers:
            to_fix.append((slug, douban_id, b["title"]))

    print(f"Books to fix (have cover + douban link): {len(to_fix)}")

    fixed = 0
    page_fail = 0
    dl_fail = 0
    start_time = time.time()

    for i, (slug, subject_id, title) in enumerate(to_fix):
        filepath = os.path.join(COVERS_DIR, f"{slug}.jpg")

        # Fetch the real image ID from Douban page
        real_img_id = fetch_real_image_id(subject_id)

        if not real_img_id:
            page_fail += 1
            if (i + 1) % 100 == 0:
                elapsed = time.time() - start_time
                print(f"  [{i+1}/{len(to_fix)}] {elapsed:.0f}s | fixed={fixed} page_fail={page_fail} dl_fail={dl_fail}")
            time.sleep(0.3)
            continue

        # Download correct cover
        ok = download_cover(real_img_id, filepath)
        if ok:
            fixed += 1
        else:
            dl_fail += 1

        if (i + 1) % 100 == 0 or i == len(to_fix) - 1:
            elapsed = time.time() - start_time
            eta = elapsed / (i + 1) * (len(to_fix) - i - 1) if i < len(to_fix) - 1 else 0
            print(f"  [{i+1}/{len(to_fix)}] {elapsed:.0f}s elapsed, ~{eta:.0f}s remaining | fixed={fixed} page_fail={page_fail} dl_fail={dl_fail}")

        # Rate limiting: be polite but not too slow
        time.sleep(0.3)

    elapsed = time.time() - start_time
    print(f"\n{'='*50}")
    print(f"Done in {elapsed:.0f}s")
    print(f"  Correct covers downloaded: {fixed}")
    print(f"  Page fetch failed: {page_fail} (old cover kept)")
    print(f"  Download failed: {dl_fail}")

    final_count = len([f for f in os.listdir(COVERS_DIR) if f.endswith('.jpg')])
    print(f"  Total covers: {final_count}")

if __name__ == "__main__":
    main()
