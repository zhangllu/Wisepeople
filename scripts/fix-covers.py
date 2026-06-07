"""
Fix incorrect book covers.
For books with douban links: redownload from Douban CDN (authoritative source).
For books without douban links: delete the OpenLibrary-sourced cover.
"""
import json
import os
import re
import ssl
import time
import urllib.request

try:
    ssl._create_default_https_context = ssl._create_unverified_context
except AttributeError:
    pass

BOOKS_FILE = "src/data/books.json"
COVERS_DIR = "public/images/covers"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

def extract_douban_id(url):
    if not url: return None
    m = re.search(r"book\.douban\.com/subject/(\d+)", url)
    return m.group(1) if m else None

def download_cover(douban_id, filepath):
    """Download cover from Douban CDN. Returns True on success."""
    for mirror in range(1, 4):
        url = f"https://img{mirror}.doubanio.com/view/subject/l/public/s{douban_id}.jpg"
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
    existing = set(os.listdir(COVERS_DIR))

    # Categorize
    with_douban = []    # books with douban link
    ol_only = []        # books without douban link but with cover

    for b in books:
        slug = b["slug"]
        douban_id = extract_douban_id(b.get("doubanLink", ""))
        has_cover = f"{slug}.jpg" in existing

        if douban_id and has_cover:
            with_douban.append((slug, douban_id, b["title"]))
        elif not douban_id and has_cover:
            ol_only.append((slug, b["title"]))

    print(f"Books with douban links and covers: {len(with_douban)}")
    print(f"OL-only covers (no douban link): {len(ol_only)}")

    # Step 1: Delete OL-only covers (unreliable source)
    print(f"\n{'='*50}")
    print("Step 1: Removing OL-only covers...")
    deleted = 0
    for slug, title in ol_only:
        path = os.path.join(COVERS_DIR, f"{slug}.jpg")
        os.remove(path)
        deleted += 1
    print(f"  Deleted {deleted} OL-only covers")

    # Step 2: Redownload from Douban CDN for all books with douban links
    print(f"\n{'='*50}")
    print(f"Step 2: Redownloading {len(with_douban)} covers from Douban CDN...")

    success = 0
    failed = 0
    for i, (slug, douban_id, title) in enumerate(with_douban):
        filepath = os.path.join(COVERS_DIR, f"{slug}.jpg")
        ok = download_cover(douban_id, filepath)

        if ok:
            success += 1
        else:
            # Remove the wrong cover
            if os.path.exists(filepath):
                os.remove(filepath)
            failed += 1

        if (i + 1) % 100 == 0 or i == len(with_douban) - 1:
            print(f"  [{i+1}/{len(with_douban)}] ok={success}, failed={failed}")

        time.sleep(0.05)  # be polite to CDN

    print(f"\n{'='*50}")
    print(f"RESULTS:")
    print(f"  Replaced with correct covers: {success}")
    print(f"  Failed (cover removed): {failed}")
    print(f"  OL-only covers deleted: {deleted}")

    # Count final state
    final_count = len([f for f in os.listdir(COVERS_DIR) if f.endswith('.jpg')])
    print(f"  Total covers now: {final_count}")

if __name__ == "__main__":
    main()
