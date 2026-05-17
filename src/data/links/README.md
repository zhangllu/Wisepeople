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

### ✅ 正确做法

1. **Wikipedia 优先** — 有词条就用，单条链接价值最高
2. **无 Wikipedia 的学术作者** — 搜索确认具体教授页面 URL，而非首页
3. **验证所有非 WP 链接** — 用 `WebFetch` 或浏览器打开确认
4. **传记作者** — 如果传主是知名人物，链接到传主 Wikipedia 并标注关系
5. **每条链接应有独特描述** — 说明为什么这个链接对该作者有价值

---

## 已知的可靠域名模式

已验证可用的大学/机构教授页 URL 模式：

- **UC Berkeley**: `https://design.berkeley.edu/profiles/{slug}`
- **UMass Boston**: `https://collaborate.umb.edu/en/persons/{slug}/`
- **IU Indianapolis**: `https://www.liberalarts.iupui.edu/about/archive/.../name.html`
- **SOAS London**: `https://www.soas.ac.uk/about/{slug}`
- **Johns Hopkins**: `https://chemistry.jhu.edu/directory/{slug}/`（可能 403 bot-block 但页面存在）
- **Stanford**: `https://profiles.stanford.edu/{slug}`（退休教授可能失效）
- **Harvard**: `https://english.harvard.edu/people/{slug}`（退休教授可能失效）
- **National Book Award**: `https://www.nationalbook.org/people/{slug}/`
- **National Academy of Sciences**: `https://www.nasonline.org/directory-entry/{slug}/`
- **Britannica**: `https://www.britannica.com/biography/{Name}`

---

## 来自第 2 批的经验教训

1. **不要猜 URL** — `https://www.umb.edu/academics/cla/faculty/christopher_zurn` 是 404，真实页面在 `collaborate.umb.edu` 子域名下
2. **退休/已故教授** 的大学页面经常下线 — 用 NAS 或 Wikipedia 替代
3. **Wikipedia 页面标题可能和 slug 不同** — Leopold Damrosch 的词条是 `L._Damrosch`，不是 `Leopold_Damrosch`
4. **一些作者有 Wikipedia 但容易被漏检** — Cynthia_Haven 的词条存在但在第一次检测中返回了 404（API 限流导致）
5. **使用 `WebFetch` 而非 Wikipedia API** 来验证 — Wikipedia API 容易触发限流，WebFetch 的直接 404/200 判断更可靠
