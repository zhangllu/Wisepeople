"""
Check which book covers are wrong by comparing with Wayback Machine cached Douban pages.
Only checks, does not download anything.
"""
import json
import os
import re
import ssl
import urllib.request

try:
    ssl._create_default_https_context = ssl._create_unverified_context
except AttributeError:
    pass

BOOKS_FILE = "src/data/books.json"
COVERS_DIR = "public/images/covers"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
OG_RE = re.compile(
    r'property="og:image"\s+content="https://web\.archive\.org/web/\d+im_/https://img\d+\.doubanio\.com/view/subject/l/public/s(\d+)\.jpg"'
)


def main():
    # Step 1: Get ALL Douban subject snapshots from CDX in one shot
    print("Fetching all Douban book snapshots from Wayback CDX...")
    cdx_url = (
        "https://web.archive.org/cdx/search/cdx"
        "?url=book.douban.com/subject/"
        "&matchType=prefix"
        "&output=json"
        "&collapse=urlkey"
        "&filter=statuscode:200"
        "&fl=original,timestamp"
        "&limit=100000"
    )
    req = urllib.request.Request(cdx_url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=120) as r:
        raw = r.read().decode("utf-8")
        cdx_data = json.loads(raw)

    # Build map: subject_id -> latest timestamp
    cdx_map = {}
    for row in cdx_data[1:]:  # skip header
        orig_url = row[0]
        ts = row[1]
        m = re.search(r"/subject/(\d+)/", orig_url)
        if m:
            sid = m.group(1)
            if sid not in cdx_map or ts > cdx_map[sid]:
                cdx_map[sid] = ts

    print(f"  Found {len(cdx_map)} unique Douban subjects in Wayback")

    # Step 2: Load our books
    with open(BOOKS_FILE, "r", encoding="utf-8") as f:
        books = json.load(f)

    existing_covers = set(os.listdir(COVERS_DIR))

    # Step 3: Check each book
    wrong_books = []
    correct = 0
    no_snap = 0
    no_og = 0
    checked = 0

    for b in books:
        m = re.search(r"book\.douban\.com/subject/(\d+)", b.get("doubanLink", ""))
        if not m:
            continue
        sid = m.group(1)
        slug = b["slug"]
        if slug + ".jpg" not in existing_covers:
            continue

        checked += 1

        ts = cdx_map.get(sid)
        if not ts:
            no_snap += 1
            continue

        snap_url = "https://web.archive.org/web/{}/https://book.douban.com/subject/{}/".format(ts, sid)
        try:
            req2 = urllib.request.Request(
                snap_url,
                headers={"User-Agent": UA, "Accept-Language": "zh-CN,zh;q=0.9"},
            )
            with urllib.request.urlopen(req2, timeout=30) as r2:
                html = r2.read().decode("utf-8", errors="replace")
            img_m = OG_RE.search(html)
            if img_m:
                real_id = img_m.group(1)
                if real_id != sid:
                    wrong_books.append({
                        "title": b["title"],
                        "slug": slug,
                        "subject_id": sid,
                        "real_image_id": real_id,
                    })
                else:
                    correct += 1
            else:
                no_og += 1
        except Exception:
            no_og += 1

        if checked % 200 == 0:
            print(f"  Checked {checked}: wrong={len(wrong_books)} correct={correct} nosnap={no_snap} noog={no_og}")

    # Report
    print("\n" + "=" * 60)
    print("CHECK RESULTS:")
    print("  Total books with covers + douban links: {}".format(checked))
    print("  Wrong covers (real_id != subject_id): {}".format(len(wrong_books)))
    print("  Likely correct: {}".format(correct))
    print("  No Wayback snapshot: {}".format(no_snap))
    print("  No og:image in cached page: {}".format(no_og))

    if wrong_books:
        print("\n  Wrong books:")
        for wb in wrong_books:
            print("    {}: subj={} real={} slug={}".format(
                wb["title"], wb["subject_id"], wb["real_image_id"], wb["slug"]
            ))

    # Save results
    output = {
        "wrong_count": len(wrong_books),
        "correct_count": correct,
        "no_snapshot": no_snap,
        "no_ogimage": no_og,
        "wrong_books": wrong_books,
    }
    with open("/tmp/wrong_covers_check.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print("\nResults saved to /tmp/wrong_covers_check.json")


if __name__ == "__main__":
    main()
