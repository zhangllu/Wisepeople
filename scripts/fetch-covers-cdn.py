"""
Fast book cover download via direct Douban CDN URLs.
Pattern: https://img1.doubanio.com/view/subject/l/public/s{douban_id}.jpg
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

BOOKS_JSON = "src/data/books.json"
COVERS_DIR = "public/images/covers"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

def extract_douban_id(url):
    if not url:
        return None
    m = re.search(r"book\.douban\.com/subject/(\d+)", url)
    return m.group(1) if m else None

def main():
    os.makedirs(COVERS_DIR, exist_ok=True)

    with open(BOOKS_JSON, "r", encoding="utf-8") as f:
        books = json.load(f)

    existing = set(os.listdir(COVERS_DIR))
    needs_cover = [b for b in books if f"{b['slug']}.jpg" not in existing]

    print(f"Total books: {len(books)}")
    print(f"Existing covers: {len(existing)}")
    print(f"Need covers: {len(needs_cover)}")
    print()

    found = 0
    failed = 0

    for i, book in enumerate(needs_cover):
        douban_id = extract_douban_id(book.get("doubanLink", ""))
        slug = book["slug"]
        filepath = os.path.join(COVERS_DIR, f"{slug}.jpg")

        if not douban_id:
            failed += 1
            if (i + 1) % 50 == 0:
                print(f"  [{i+1}/{len(needs_cover)}] no douban id, found={found}, failed={failed}")
            continue

        # Try img1, img2, img3 mirrors
        downloaded = False
        for mirror in range(1, 4):
            url = f"https://img{mirror}.doubanio.com/view/subject/l/public/s{douban_id}.jpg"
            req = urllib.request.Request(url, headers={
                "User-Agent": UA,
                "Referer": "https://book.douban.com/",
            })
            try:
                with urllib.request.urlopen(req, timeout=10) as resp:
                    data = resp.read()
                    if len(data) > 500:  # valid image > 500 bytes
                        with open(filepath, "wb") as f:
                            f.write(data)
                        found += 1
                        downloaded = True
                        break
            except Exception:
                continue

        if not downloaded:
            failed += 1

        # Progress
        if (i + 1) % 50 == 0 or i == len(needs_cover) - 1:
            print(f"  [{i+1}/{len(needs_cover)}] found={found}, failed={failed}")

        # Rate limit — CDN is more lenient but be polite
        time.sleep(0.1)

    print(f"\n{'='*50}")
    print(f"CDN results: {found} downloaded, {failed} failed")
    print(f"Total covers now: {len(existing) + found}/{len(books)} ({(len(existing)+found)/len(books)*100:.1f}%)")

if __name__ == "__main__":
    main()
