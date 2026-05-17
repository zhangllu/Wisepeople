# 智者精选链接批次操作指南

## 批次流程

一次批次 = 48 位作者 + 校验。

### 第 0 步：确认起点

```bash
# 查进度
cat src/data/links/PROGRESS.json | python3 -m json.tool

# 找下一批 48 位作者（按 name 排序，跳过已处理 slug）
python3 << 'EOF'
import json
with open('src/data/authors.json') as f:
    authors = json.load(f)
# 收集已处理 slug
import glob, os
processed = set()
for f in glob.glob('src/data/links/curated-links-0*.json'):
    with open(f) as fh:
        data = json.load(fh)
    for k in data:
        if not k.startswith('_'):
            processed.add(k)
remaining = sorted([a for a in authors if a['slug'] not in processed], key=lambda a: a['name'])
for i, a in enumerate(remaining[:48]):
    print(f"{i+1}\t{a['name']}\t{a['slug']}")
EOF
```

### 第 1 步：生成批次 JSON 文件

```bash
# 复制模板
cp src/data/links/_template.json src/data/links/curated-lines-NNN.json
```

为每位作者选择合适链接。**链接优先级：**

| 类型 | 适用 | 示例 |
|---|---|---|
| Wikipedia | 有独立词条的作者 | `https://en.wikipedia.org/wiki/Name` |
| Google Scholar | 学术研究者（标准配置） | `https://scholar.google.com/scholar?q=Name` |
| Britannica | 百科已有条目 | `https://www.britannica.com/biography/Name` |
| Stanford Encyclopedia | 哲学家 | `https://plato.stanford.edu/entries/topic/` |
| Nobel Prize | 诺奖得主 | `https://www.nobelprize.org/prizes/...` |
| 大学/机构教授页 | 在职或名誉教授 | 见下方「链接检查」 |
| 传记主体 Wikipedia | 传记作者（无本人词条） | 如：`/wiki/Ruth_Benedict` |
| 代表作官网 | 科普作家 | 如：W.W. Norton 图书页 |
| 所属协会/机构 | 特定领域专家 | 如：PCP Association, Bowen Center |
| National Academy | 院士 | `https://www.nasonline.org/directory-entry/...` |
| ResearchGate | 学术作者备选 | `https://www.researchgate.net/profile/Name` |
| VIAF / WorldCat | 其他小众作者的兜底 | `https://viaf.org/viaf/...` |

### 第 2 步：注册批次

```bash
# 编辑 src/lib/data/curated-links.ts
# 添加一行：import batchNNN from "@/data/links/curated-links-NNN.json"
# 并在 _init() 的 batches 数组中添加：batchNNN,
```

### 第 3 步：更新进度表

编辑 `src/data/links/PROGRESS.json`，添加新批次记录并更新 summary。

### 第 4 步：构建验证

```bash
bun run build
```

### 第 5 步：提交推送部署

```bash
git add src/data/links/curated-links-NNN.json src/data/links/PROGRESS.json src/lib/data/curated-links.ts
git commit -m "feat: 第N批新增48位作者的精选链接（M条）"
git push
npx vercel --prod
```

---

## 链接检查清单

创建链接时逐条对照：

### ❌ 应避免的链接

| 问题类型 | 示例 | 原因 |
|---|---|---|
| 大学首页 | `https://www.uga.edu/` | 没有指向具体人物，打开后需再次搜索 |
| 机构通用页 | `https://www.rochester.edu/` | 同上 |
| 已失效的项目站 | `https://peirce.iupui.edu/` | IUPUI 2024年更名为 IU Indianapolis，旧域名下线 |
| CMS 门户需登录 | `https://portal.cca.edu/people/bkatz/` | 需要认证才能查看内容 |
| 个人站 TLS 问题 | `https://www.mattdoeden.com/` | 证书过期或连接不稳定 |
| 未验证的大学路径 | `https://.../faculty/name` | 路径猜测可能 404 |
| 出版社通用图书页 | `https://wwnorton.com/books/Title/` | 图书页 URL 模式不稳定，经常 404 |
| 不存在的人物百科条目 | `https://plato.stanford.edu/entries/dennett/` | SEP 不为每位哲学家设独立条目 |

### ✅ 正确做法

1. **Wikipedia 优先** — 有词条就用，单条链接价值最高
2. **无 Wikipedia 的学术作者** — 搜索确认具体教授页面 URL，而非首页
3. **验证所有非 WP 链接** — 用 `WebFetch` 或浏览器打开确认
4. **传记作者** — 如果传主是知名人物，链接到传主 Wikipedia 并标注关系
5. **每条链接应有独特描述** — 说明为什么这个链接对该作者有价值

---

## 已知的可靠域名模式

已验证可用的大学/机构教授页 URL 模式：

- **UC Berkeley**: `https://design.berkeley.edu/profiles/{slug}` / `https://lx.berkeley.edu/people/{slug}`
- **UMass Boston**: `https://collaborate.umb.edu/en/persons/{slug}/`
- **IU Indianapolis**: `https://www.liberalarts.iupui.edu/about/archive/.../name.html`
- **SOAS London**: `https://www.soas.ac.uk/about/{slug}`
- **Johns Hopkins**: `https://chemistry.jhu.edu/directory/{slug}/`（可能 403 bot-block 但页面存在）
- **Stanford**: `https://profiles.stanford.edu/{slug}`（退休教授可能失效）
- **Harvard**: `https://english.harvard.edu/people/{slug}`（退休教授可能失效）
- **National Book Award**: `https://www.nationalbook.org/people/{slug}/`
- **National Academy of Sciences**: `https://www.nasonline.org/directory-entry/{slug}/`
- **Britannica**: `https://www.britannica.com/biography/{Name}`（人物条目命名规则：西方人用 `名-姓`，如 `Yukio-Mishima`，非 `Mishima-Yukio`）
- **Stanford Encyclopedia**: `https://plato.stanford.edu/entries/{topic}/`（只有主题条目，无人名条目，除非该哲学家有独立 SEP 条目）
- **ResearchGate**: `https://www.researchgate.net/profile/Name-Surname`（bot 会 403，但用户访问正常）
- **Amazon Author Page**: `https://www.amazon.com/stores/author/e/{ASIN}`

---

## 抽样检查流程

生成批次后，必须抽样验证非 Wikipedia 链接。抽样规则：

### 检查范围

排除 Wikipedia 和 Google Scholar（这两个域名稳定可靠），只检查**精选链接**（Britannica、SEP、大学页、个人站等）。

### 抽样数量

每批精选链接约 15-25 条，抽样 **8-12 条**，覆盖各类域名。

### 使用 WebFetch 逐条验证

```
WebFetch url="https://..." prompt="Is this a valid page? YES or NO + brief."
```

不依赖 Wikipedia API（容易触发限流），WebFetch 的 HTTP 状态码判断更可靠。

### 需重点核验的链接类型

| 类型 | 核验要点 |
|---|---|
| Britannica | URL 命名规则是否符合实际（西方人名用 `名-姓`） |
| Stanford Encyclopedia | 确认条目确实存在（不是所有哲学家都有独立条目） |
| 大学/机构页 | 用 WebFetch 确认 200/404，不猜路径 |
| 出版社图书页 | 出版社网站 URL 模式常变，尽量用 ISBN 或 Amazon 替代 |
| 个人网站 | 确认 SSL 证书有效，非过期或自签名 |

---

## 来自过去的经验教训

### 第 2 批

1. **不要猜 URL** — `https://www.umb.edu/academics/cla/faculty/christopher_zurn` 是 404，真实页面在 `collaborate.umb.edu` 子域名下
2. **退休/已故教授** 的大学页面经常下线 — 用 NAS 或 Wikipedia 替代
3. **Wikipedia 页面标题可能和 slug 不同** — Leopold Damrosch 的词条是 `L._Damrosch`，不是 `Leopold_Damrosch`
4. **一些作者有 Wikipedia 但容易被漏检** — Cynthia_Haven 的词条存在但在第一次检测中返回了 404（API 限流导致）
5. **使用 `WebFetch` 而非 Wikipedia API** 来验证 — Wikipedia API 容易触发限流，WebFetch 的直接 404/200 判断更可靠

### 第 3 批

6. **Stanford Encyclopedia 没有独立人名条目** — 丹尼尔·丹尼特没有独立 SEP 条目，`/entries/dennett/` 是 404。如果作者没有独立 SEP 条目，改为引用包含其思想的主题条目（如 `qualia`）
7. **Britannica URL 命名规则不统一** — 三岛由纪夫是 `Yukio-Mishima`（名-姓），不是 `Mishima-Yukio`（姓-名）。生成前先搜索确认
8. **出版社图书页 URL 不可靠** — W.W. Norton 的图书页 `/books/Title/` 和 ISBN 路径都返回 404，改用 Amazon 作者页
9. **UC Berkeley 个人页路径不直观** — `linguistics.berkeley.edu/person/34` 已重定向，真实页面在 `lx.berkeley.edu/people/george-lakoff`

### 第 4 批

10. **Britannica 条目覆盖有限** — 并非所有知名人物都有独立 Britannica 条目。克莱顿·克里斯坦森、保罗·瓦茨拉维克、伊丽莎白·扬-布鲁尔等均无独立页。生成链接前先用 `WebFetch` 确认，避免猜 URL。
11. **中文 Wikipedia 条目缺失** — 伊莱娜·内米洛夫斯基的中文词条不存在，改为链接英文 Wikipedia。对知名度较低的外国作者，检查中英文词条后再决定用哪个版本。
12. **哈佛等大学个人页可能 403** — 哈佛 `anthropology.fas.harvard.edu` 返回 403（bot 屏蔽），但用户访问正常。此类链接可以保留，但建议准备备用链接。
13. **非学术作者不应加 Google Scholar** — 卡尔维诺（作家）、克里斯汀·迪奥（设计师）、伊迪特·索德格朗（诗人）等无学术产出的作者，去掉 Google Scholar，避免显示无结果页面。
14. **48 位中约含 5-6 组重复条目** — 同一人同时有中文名和「中文名+英文名」两个 slug（如「保罗·弗莱雷」和「保罗·弗莱雷 Paulo Freire」）。两者都保留，但取重时注意不要混淆为不同人。
15. **已清理的非智者条目会重新出现** — 第 2 批移除的传记作者（Agneta Rahikainen、Ananyo Bhattacharya 等）因为 slug 未被标记为 "已处理"，在后续批次中会重新排在列表前列。需要持续维护排除名单。
