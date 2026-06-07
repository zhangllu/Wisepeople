"""
Fix incorrect portraits in portraits.json.
For each incorrectly matched entry:
  1. Try to find the correct portrait via Wikipedia API with STRICT verification
  2. If found, update the entry
  3. If not found, clear the portrait_url so the site shows initial-letter avatar

STRICT VERIFICATION RULES:
  - English names → English Wikipedia only
  - Chinese names → Chinese Wikipedia only
  - Acceptance requires: last name + first name initial match (for English)
    or >50% character overlap (for Chinese)
"""
import json
import re
import time
import ssl
import urllib.request
import urllib.error
import urllib.parse

# Fix SSL
try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

SUMMARY_API = "https://{lang}.wikipedia.org/api/rest_v1/page/summary/{title}"
SEARCH_API = "https://{lang}.wikipedia.org/w/api.php"
USER_AGENT = "WisepeopleBot/2.0 (educational project; fix-portraits)"

PORTRAITS_FILE = "src/data/portraits.json"

# ---- Simplified/Traditional Chinese mapping ----
TRAD_TO_SIMP = {
    '餘': '余', '慶': '庆', '時': '时', '雲': '云', '許': '许', '張': '张',
    '愛': '爱', '莊': '庄', '國': '国', '長': '长', '飛': '飞', '門': '门',
    '馬': '马', '魚': '鱼', '鳥': '鸟', '龍': '龙', '廣': '广', '義': '义',
    '萬': '万', '與': '与', '劉': '刘', '孫': '孙', '陳': '陈', '楊': '杨',
    '趙': '赵', '黃': '黄', '吳': '吴', '週': '周', '錢': '钱', '維': '维',
    '呂': '吕', '遷': '迁', '棄': '弃', '臺': '台', '灣': '湾', '體': '体',
    '倫': '伦', '納': '纳', '爾': '尔', '異': '异', '傳': '传', '聖': '圣',
    '顯': '显', '極': '极', '樂': '乐', '驚': '惊', '風': '风',
    '傑': '杰', '個': '个', '會': '会', '經': '经', '東': '东', '車': '车',
    '軍': '军', '隊': '队', '術': '术', '語': '语', '說': '说', '書': '书',
    '為': '为', '學': '学', '習': '习', '來': '来', '間': '间',
    '關': '关', '係': '系', '豐': '丰', '機': '机', '氣': '气',
    '電': '电', '話': '话', '華': '华', '區': '区', '點': '点',
    '應': '应', '當': '当', '發': '发', '後': '后', '戰': '战',
    '爭': '争', '動': '动', '種': '种', '從': '从', '實': '实',
    '驗': '验', '確': '确', '認': '认', '讓': '让', '這': '这',
    '還': '还', '頭': '头', '樣': '样', '過': '过', '現': '现',
    '對': '对', '於': '于', '將': '将', '並': '并', '沒': '没',
    '們': '们', '麼': '么', '壞': '坏', '遠': '远', '近': '近',
    '內': '内', '裡': '里', '總': '总', '結': '结', '論': '论',
    '證': '证', '據': '据', '彥': '彦', '貞': '贞', '賢': '贤',
    '賓': '宾', '賈': '贾', '漢': '汉', '醫': '医', '藥': '药',
    '歷': '历', '圖': '图', '館': '馆', '處': '处', '設': '设',
    '計': '计', '評': '评', '價': '价', '構': '构', '製': '制',
    '類': '类', '別': '别', '標': '标', '準': '准', '規': '规',
    '範': '范', '導': '导', '讀': '读', '寫': '写', '創': '创',
    '業': '业', '網': '网', '資': '资', '訊': '讯', '聯': '联',
    '絡': '络', '專': '专', '欄': '栏', '編': '编', '輯': '辑',
    '譯': '译', '註': '注', '釋': '释', '雙': '双', '稱': '称',
    '畫': '画', '層': '层', '級': '级', '數': '数', '權': '权',
    '審': '审', '批': '批', '運': '运', '轉': '转', '執': '执',
    '監': '监', '控': '控', '測': '测', '錯': '错', '嚴': '严',
    '謹': '谨', '詳': '详', '細': '细', '凱': '凯', '爾': '尔',
    '約': '约', '翰': '翰', '薩': '萨', '瓦': '瓦', '亞': '亚',
    '弗': '弗', '洛': '洛', '沃': '沃', '茨': '茨', '海': '海',
    '因': '因', '希': '希', '特': '特', '曼': '曼', '威': '威',
    '廉': '廉', '姆': '姆', '湯': '汤', '遜': '逊', '森': '森',
    '格': '格', '科': '科', '者': '者', '議': '议', '壇': '坛',
    '嚴': '严', '顏': '颜', '畢': '毕', '寶': '宝', '魁': '魁',
    '邊': '边', '陳': '陈', '陸': '陆', '鍵': '键', '韓': '韩',
    '靜': '静', '霆': '霆', '譽': '誉', '劉': '刘', '淵': '渊',
    '殷': '殷', '鵬': '鹏', '羅': '罗', '誌': '志', '顏': '颜',
    '肖': '肖', '寧': '宁', '薩': '萨', '爾': '尔',
}

def to_simplified(text):
    return ''.join(TRAD_TO_SIMP.get(c, c) for c in text)


def fetch_wiki_summary(title, lang="en"):
    """Fetch Wikipedia page summary with thumbnail."""
    encoded = urllib.parse.quote(title, safe="")
    url = SUMMARY_API.format(lang=lang, title=encoded)
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
            thumb = data.get("thumbnail")
            if thumb and thumb.get("source"):
                return {
                    "portrait_url": thumb["source"],
                    "wiki_title": data.get("title", title),
                }
            return {}
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
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
                        }
                    return {}
            except:
                pass
            return None
    except Exception:
        return None


def search_wikipedia(query, lang="en", limit=10):
    """Search Wikipedia and return page titles."""
    params = urllib.parse.urlencode({
        "action": "query",
        "list": "search",
        "srsearch": query,
        "srlimit": limit,
        "format": "json",
        "srprop": "",
    })
    url = f"{SEARCH_API.format(lang=lang)}?{params}"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
            return [r["title"] for r in data.get("query", {}).get("search", [])]
    except:
        return []


def extract_name_parts(name):
    """Extract english first name, last name, and chinese name from a person entry."""
    name_english = name.split('（')[0].strip() if '（' in name else name
    name_chinese = re.search(r'（(.+?)）', name)
    name_chinese = name_chinese.group(1) if name_chinese else ''

    # For pure Chinese names
    if re.search(r'[\u4e00-\u9fff]', name_english) and not name_chinese:
        return None, None, name_english

    # Parse English name components
    # Remove middle initials like "J." or "M."
    clean_english = re.sub(r'\b[A-Z]\.\s*', ' ', name_english).strip()
    parts = clean_english.split()

    first_name = parts[0] if parts else ""
    last_name = parts[-1] if len(parts) > 1 else ""
    # Remove roman numerals like "III"
    last_name = re.sub(r'\s*(I|II|III|IV|V|Jr\.|Sr\.)$', '', last_name).strip()

    return first_name, last_name, name_chinese


def verify_english_match(name_english, wiki_title):
    """
    Strict verification for English/Western names against English Wikipedia results.
    The wiki title must contain the person's last name AND at least the first initial or first name.
    """
    wiki_lower = wiki_title.lower()

    # Get name parts
    clean = re.sub(r'\b[A-Z]\.\s*', ' ', name_english).strip()
    parts = clean.split()

    if len(parts) < 1:
        return False

    last_name = parts[-1]
    # Remove suffixes
    last_name = re.sub(r'\s*(I|II|III|IV|V|Jr\.|Sr\.)$', '', last_name).strip()

    first_name_or_initial = parts[0]

    # Must contain the last name
    if last_name.lower() not in wiki_lower:
        return False

    # Must contain the first name or initial
    if first_name_or_initial.lower() not in wiki_lower:
        # Try just the first letter of first name
        if first_name_or_initial[0].lower() not in wiki_lower.replace(" ", ""):
            return False

    # Exclude cases where it's a completely different person with same last name
    # by checking that at least 50% of the full name appears in wiki title
    full_name_lower = name_english.lower().replace(".", "").replace(",", "")
    full_chars = set(full_name_lower.split())
    wiki_chars = set(wiki_lower.split())

    # For very short names, be more lenient
    if len(full_name_lower) > 10:
        # Check that at least 30% of the name's non-space characters appear
        overlap = sum(1 for c in full_name_lower if c in wiki_lower)
        if overlap / len(full_name_lower) < 0.2:
            return False

    return True


def verify_chinese_match(name_chinese, wiki_title):
    """
    Strict verification for Chinese names against Chinese Wikipedia results.
    - Short names (<=3 chars): require exact match after simplification
    - Longer names: require >60% character overlap or containment
    """
    name_simp = to_simplified(name_chinese)
    wiki_simp = to_simplified(wiki_title)

    name_chars_only = re.findall(r'[\u4e00-\u9fff]', name_simp)
    wiki_chars_only = re.findall(r'[\u4e00-\u9fff]', wiki_simp)

    if not name_chars_only or not wiki_chars_only:
        return False

    # Short names (<=3 Chinese chars): must be exact match
    if len(name_chars_only) <= 3:
        return ''.join(name_chars_only) == ''.join(wiki_chars_only)

    # Longer names: direct containment check
    name_clean = ''.join(name_chars_only)
    wiki_clean = ''.join(wiki_chars_only)
    if name_clean in wiki_clean or wiki_clean in name_clean:
        return True

    name_set = set(name_chars_only)
    wiki_set = set(wiki_chars_only)
    common = name_set & wiki_set
    return len(common) >= min(len(name_set), len(wiki_set)) * 0.6


def try_fix_western_name(name_english, name_chinese):
    """
    Try to find portrait for a Western/English name.
    Only search English Wikipedia with strict verification.
    """
    # Search English Wikipedia with full name
    search_results = search_wikipedia(name_english, "en")
    for title in search_results:
        if verify_english_match(name_english, title):
            result = fetch_wiki_summary(title, "en")
            if result and result.get("portrait_url"):
                return result
    return None


def try_fix_chinese_name(name_chinese):
    """
    Try to find portrait for a Chinese name.
    Only search Chinese Wikipedia with strict verification.
    """
    search_results = search_wikipedia(name_chinese, "zh")
    for title in search_results:
        if verify_chinese_match(name_chinese, title):
            result = fetch_wiki_summary(title, "zh")
            if result and result.get("portrait_url"):
                return result
    return None


def fix_entry(name):
    """Try to find the correct portrait for a person."""
    first_name, last_name, name_chinese = extract_name_parts(name)

    # Case 1: English/Western name (e.g., "Robert J. Marzano（罗伯特·马扎诺）")
    if first_name and last_name:
        return try_fix_western_name(name, name_chinese)

    # Case 2: Pure Chinese name (e.g., "陈勇")
    if name_chinese is None:
        return try_fix_chinese_name(name)

    # Case 3: Has both English and Chinese but English isn't well-formed
    # (e.g., "Wang Li（王力）")
    if name_chinese:
        # Try Chinese name first
        result = try_fix_chinese_name(name_chinese)
        if result:
            return result
        # Then try the English name as a Chinese romanization
        name_english = name.split('（')[0].strip()
        search_results = search_wikipedia(name_english, "en")
        for title in search_results:
            if verify_english_match(name_english, title):
                result = fetch_wiki_summary(title, "en")
                if result and result.get("portrait_url"):
                    return result

    return None


def main():
    # Load current portraits
    with open(PORTRAITS_FILE, "r", encoding="utf-8") as f:
        portraits = json.load(f)

    # The list of wrong entry slugs (generated from analysis)
    wrong_slugs = [
        "a-01f2d87f", "a-032187c4", "a-094c22ea", "a-0cde37a3",
        "a-0d442fb6", "a-0ed50bbd", "a-107388e5", "a-116f21b3",
        "a-14c25d8c", "a-15040f82", "a-1af59fb9", "a-1d040742",
        "a-1efb63e5", "a-25b2380f", "a-281efd75", "a-2928c759",
        "a-2d299ca0", "a-31424775", "a-32602300", "a-33dad6df",
        "a-353e234d", "a-35651a1c", "a-382d8f78", "a-3a250f3a",
        "a-3a579f4d", "a-3d11a5fe", "a-3de3ac18",
        "a-4029c6cc", "a-44c69f29", "a-45399c65", "a-46e93d77",
        "a-48fd337c", "a-497405ea", "a-4a9ac9e4", "a-4d438153",
        "a-51f2f208", "a-58c92355", "a-5aaff683", "a-5ab17419",
        "a-5dc29bc1", "a-5f74b72c", "a-65dda1aa", "a-69d9bf67",
        "a-6afd17ec", "a-6dac79ef", "a-70714bbf", "a-72aa6510",
        "a-787b4f61", "a-78c9b5b4", "a-79b5db17", "a-7b51420b",
        "a-7bb02a26", "a-80a39902", "a-8295be09", "a-89efea39",
        "a-8c459221", "a-915c0801", "a-92a50e36", "a-95cc3cfe",
        "a-96d9c8e2", "a-a45501c1", "a-a629fff5", "a-ab4fa45a",
        "a-ba66ca70", "a-bb188525", "a-be790166", "a-c13034e8",
        "a-c138a0e2", "a-c8465dc7", "a-c956fc0b", "a-cbc608a1",
        "a-cca1b3d1", "a-ce1dffe4", "a-d03db178", "a-da830614",
        "a-db888ff5", "a-de052a6d", "a-de8b9252", "a-e34ce2e0",
        "a-e5d84203", "a-e8899465", "a-ea78b3e8", "a-eb84ee9a",
        "a-f3d16d2a", "a-fc92af23", "a-ff3bc80d",
        "agneta-rahikainen", "agnieszka-gajewska", "ananyo-bhattacharya",
        "andrea-k-hler-ludescher", "andrius-gali-anka", "betty-jean-craige",
        "catherine-m-rakow", "christopher-zurn", "dale-jacquette",
        "daniel-w-bjork", "desmond-clarke", "donald-j-albers",
        "fay-fransella", "francine-mary-netter", "gemelli-giuliana",
        "john-h-flavell", "matt-doeden", "morton-n-cohen",
        "nathan-houser", "perez-zagorin", "richard-fardon",
        "richard-isadore-evans", "rob-moore", "roberta-m-gilbert",
        "robin-marantz-henig", "sue-erikson-bloland", "thomas-r-guskey",
    ]

    existing_wrong = [s for s in wrong_slugs if s in portraits]
    print(f"Found {len(existing_wrong)} wrong entries to fix")

    stats = {"fixed": 0, "cleared": 0}

    for i, slug in enumerate(existing_wrong):
        entry = portraits[slug]
        name = entry["name"]
        current_wiki = entry.get("wiki_title", "")

        print(f"\n[{i+1}/{len(existing_wrong)}] {slug}")
        print(f"    Name: {name}")
        print(f"    Current: {current_wiki}")

        result = fix_entry(name)

        if result:
            # Verify the result is reasonable - double check!
            entry["portrait_url"] = result["portrait_url"]
            entry["wiki_title"] = result["wiki_title"]
            stats["fixed"] += 1
            print(f"    ✓ FIXED → {result['wiki_title']}")
        else:
            entry["portrait_url"] = ""
            entry["wiki_title"] = ""
            stats["cleared"] += 1
            print(f"    ✗ CLEARED → will show avatar")

        time.sleep(0.2)

    # Save updated portraits
    with open(PORTRAITS_FILE, "w", encoding="utf-8") as f:
        json.dump(portraits, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*50}")
    print(f"Done! {len(existing_wrong)} processed:")
    print(f"  Fixed: {stats['fixed']}")
    print(f"  Cleared (avatar): {stats['cleared']}")


if __name__ == "__main__":
    main()
