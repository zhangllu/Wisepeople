"""
Fetch remaining book covers by scraping Douban book pages directly.
Extracts the actual image URL from the HTML (which differs from the book ID).
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

BOOKS_JSON = "src/data/books.json"
COVERS_DIR = "public/images/covers"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"


def extract_douban_id(url):
    if not url:
        return None
    m = re.search(r"book\.douban\.com/subject/(\d+)", url)
    return m.group(1) if m else None


def fetch_cover_url(douban_id):
    """Scrape Douban book page to find the actual cover image URL."""
    page_url = f"https://book.douban.com/subject/{douban_id}/"
    req = urllib.request.Request(page_url, headers={
        "User-Agent": UA,
        "Accept": "text/html",
        "Accept-Language": "zh-CN,zh;q=0.9",
    })
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            html = resp.read().decode("utf-8", errors="replace")
            # Look for subject image URLs
            imgs = re.findall(r"(https?://img\d\.doubanio\.com/view/subject/[^\"]+)", html)
            if imgs:
                # Prefer /l/ (large) images
                for img in imgs:
                    if "/l/" in img:
                        return img
                return imgs[0]
    except Exception:
        pass
    return None


def download_image(url, filepath):
    """Download image from URL."""
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
        pass
    return False


def main():
    os.makedirs(COVERS_DIR, exist_ok=True)

    with open(BOOKS_JSON, "r", encoding="utf-8") as f:
        books = json.load(f)

    existing = set(os.listdir(COVERS_DIR))
    missing = [b for b in books if f"{b['slug']}.jpg" not in existing]

    # Filter to only books with douban links
    with_douban = [b for b in missing if extract_douban_id(b.get("doubanLink", ""))]
    without_douban = [b for b in missing if not extract_douban_id(b.get("doubanLink", ""))]

    print(f"Missing covers: {len(missing)}")
    print(f"With Douban link: {len(with_douban)}")
    print(f"Without Douban link: {len(without_douban)}")
    print()

    found = 0
    failed = 0
    blocked = False

    for i, book in enumerate(with_douban):
        douban_id = extract_douban_id(book["doubanLink"])
        filepath = os.path.join(COVERS_DIR, f"{book['slug']}.jpg")

        title_short = book["title"][:25]
        
        if blocked:
            failed += 1
            continue

        # Fetch cover URL from page
        cover_url = fetch_cover_url(douban_id)
        if not cover_url:
            # Might be blocked
            print(f"  [{i+1}/{len(with_douban)}] ✗ {title_short} — no URL (possible block)")
            failed += 1
            # Check if we're getting consistent failures
            if failed >= 3 and found == 0:
                print("  [douban seems blocked, aborting]")
                blocked = True
            time.sleep(2)
            continue

        # Download
        ok = download_image(cover_url, filepath)
        if ok:
            found += 1
            print(f"  [{i+1}/{len(with_douban)}] ✓ {title_short}")
        else:
            failed += 1
            print(f"  [{i+1}/{len(with_douban)}] ✗ {title_short} — download failed")

        time.sleep(0.8)

    print(f"\n{'='*50}")
    print(f"Results: {found} downloaded, {failed} failed")
    total = len(existing) + found
    print(f"Total covers: {total}/{len(books)} ({total/len(books)*100:.1f}%)")

    # Show remaining
    remaining = len(books) - total
    if remaining > 0:
        print(f"\nStill missing ({remaining}):")
        existing_after = set(os.listdir(COVERS_DIR))
        for b in books:
            if f"{b['slug']}.jpg" not in existing_after:
                print(f"  - {b['title']} ({b['author']})")


if __name__ == "__main__":
    main()
