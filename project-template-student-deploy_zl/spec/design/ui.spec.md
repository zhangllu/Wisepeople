---
title: 智者网（WisePeople）UI 设计规格
version: 1.0.0
created: 2026-04-27
depends:
  - .42cog/meta/meta.md
  - .42cog/real/real.md
  - .42cog/cog/cog.md
  - spec/pm/pr.spec.md
  - spec/pm/userstory.spec.md
  - spec/dev/sys.spec.md
---

# 智者网（WisePeople）UI 设计规格

<meta>
  <document-id>wisepeople-ui-spec</document-id>
  <version>1.0.0</version>
  <project>智者网（WisePeople）</project>
  <type>UI 设计规格</type>
  <created>2026-04-27</created>
  <tech-stack>Next.js 15+, React 19+, Tailwind CSS v4, shadcn/ui, Zustand</tech-stack>
</meta>

## 1. 智能分析结论

### 1.1 应用类型

**结论：** MPA（多页面应用）

**理由：**
智者网是一个内容展示与知识探索平台，核心用户任务（浏览智者库、查看详情、搜索、阅读书单）是独立的离散任务，而非连续实时交互。每个页面有独立的 URL 和内容，适合 MPA 模式。仅 AI 对话助手功能有连续交互特征，可作为 MPA 中的一个独立子页面实现。

### 1.2 导航结构

**类型：** 混合导航（顶部主导航 + 侧边分类导航）

**主导航（顶部）：**

| 导航项 | 链接 | 说明 |
|--------|------|------|
| 首页 | `/` | 平台介绍与推荐内容 |
| 智者库 | `/wise-persons` | 420 位智者探索 |
| 十大问题 | `/questions` | 按问题导览 |
| 书单 | `/book-lists` | 推荐书单 |
| AI 助手 | `/ai-chat` | AI 对话（需登录） |

**次级导航（侧边/下拉）：**
- 智者库页面内：学科/时代/地区分类 Tab
- 个人中心：收藏、书评、阅读轨迹

### 1.3 配色方案

**主色相：** 230° 蓝色（智慧、可信、宁静）

**OKLCH 配置：**
```css
@theme inline {
  /* 主色 - 蓝色，适合知识/教育平台 */
  --color-primary: oklch(0.55 0.15 250);
  --color-primary-light: oklch(0.7 0.12 250);
  --color-primary-dark: oklch(0.4 0.18 250);
  --color-primary-foreground: oklch(0.98 0 0);

  /* 强调色 - 琥珀色暖色点缀 */
  --color-accent: oklch(0.7 0.15 75);
  --color-accent-foreground: oklch(0.2 0.02 250);

  /* 背景色 */
  --color-background: oklch(0.98 0.005 250);
  --color-foreground: oklch(0.15 0.02 250);
  --color-muted: oklch(0.95 0.01 250);
  --color-muted-foreground: oklch(0.55 0.03 250);

  /* 卡片 */
  --color-card: oklch(1 0 0);
  --color-card-foreground: oklch(0.15 0.02 250);
  --color-card-hover: oklch(0.97 0.01 250);

  /* 语义 */
  --color-success: oklch(0.6 0.18 160);
  --color-warning: oklch(0.7 0.15 75);
  --color-error: oklch(0.55 0.2 30);
  --color-info: oklch(0.6 0.1 250);
}
```

**配色逻辑：**
- 蓝色主调传递智慧与信任感，适合知识平台
- 琥珀色点缀用于 Hover、高亮和行动号召按钮，在蓝色背景中形成温暖的视觉焦点
- 大面积留白（白色/浅灰背景）保证阅读专注感
- 深色文字高对比度确保长文本阅读舒适

---

## 2. 设计系统

### 设计令牌

```css
@theme inline {
  /* 间距 */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;

  /* 圆角 - 知识平台需要温和、不尖锐的视觉风格 */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;

  /* 阴影 - 轻柔层次感 */
  --shadow-sm: 0 1px 2px oklch(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px oklch(0 0 0 / 0.08);
  --shadow-lg: 0 10px 15px -3px oklch(0 0 0 / 0.1);

  /* 动画 */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 350ms ease;
}
```

### 字体系统

**系统字体栈（无 Google Fonts，保障中国可访问性）：**
```css
--font-sans: ui-sans-serif, system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif;
--font-serif: "Noto Serif SC", "Source Han Serif SC", serif;
```

**字号层级：**

| 名称 | 大小 | 字重 | 用途 |
|------|------|------|------|
| xs | 0.75rem (12px) | 400 | 辅助信息、来源标注 |
| sm | 0.875rem (14px) | 400 | 次级文字、卡片摘要 |
| base | 1rem (16px) | 400 | 正文内容 |
| lg | 1.125rem (18px) | 500 | 小节标题 |
| xl | 1.25rem (20px) | 600 | 卡片标题 |
| 2xl | 1.5rem (24px) | 700 | 页面标题 |
| 3xl | 1.875rem (30px) | 700 | 一级标题 |
| 4xl | 2.25rem (36px) | 800 | 首页大标题 |

### 图标

使用 Lucide React 图标库，风格统一为 24px 线框图标。

---

## 3. 页面布局

### 响应式断点

| 名称 | 宽度 | 布局策略 |
|------|------|---------|
| 移动端 | < 640px | 单列布局，底部导航，卡片全宽 |
| 平板 | 640px - 1024px | 2 列网格，顶部导航折叠，可展开侧边栏 |
| 桌面端 | > 1024px | 3-4 列网格，完整顶部导航+侧边分类 |

### 全局布局结构

```
桌面端（>1024px）：
┌─────────────────────────────────────────────────┐
│  品牌Logo   导航链接   搜索框    登录/注册   │  ← 顶部导航栏（64px）
├──────────────────────┬──────────────────────────┤
│  分类侧边栏          │                          │
│  (可选/上下文相关)   │     主内容区域            │
│  ──────────         │     (智者卡片/详情/列表等)   │
│  学科分类            │                           │
│  时代分类            │                           │
│  地区分类            │                           │
├──────────────────────┴──────────────────────────┤
│  版权信息 · 关于 · 隐私                         │  ← 底部（80px）
└─────────────────────────────────────────────────┘

移动端（<640px）：
┌─────────────────┐
│   ≡    搜索    👤│  ← 顶部栏（56px）
├─────────────────┤
│                  │
│   主内容区域      │
│   (单列卡片流)    │
│                  │
├─────────────────┤
│ 首页  智者  问题  │  ← 底部导航 Tab
│ 书单  更多       │
└─────────────────┘
```

### 页面清单

| 页面 | URL | 布局 | 认证 | 优先级 |
|------|-----|------|------|--------|
| 首页 | `/` | 全宽 Hero + 板块预览 | 无 | P0 |
| 智者库列表 | `/wise-persons` | 分类 Tab + 卡片网格 | 无 | P0 |
| 智者详情 | `/wise-persons/:slug` | 详情 + 著作列表 | 无 | P0 |
| 著作详情 | `/works/:id` | 详情 + 书评 + 写笔记入口 | 无 | P0 |
| 十大问题 | `/questions` | 问题卡片网格 | 无 | P1 |
| 问题导览 | `/questions/:id` | 问题详情 + 关联智者/著作 | 无 | P1 |
| 书单列表 | `/book-lists` | 书单卡片列表 | 无 | P1 |
| 书单详情 | `/book-lists/:id` | 书单内著作列表 | 无 | P1 |
| 搜索结果 | `/search?q=` | 混合结果列表 | 无 | P0 |
| 登录 | `/login` | 居中表单卡片 | 无 | P0 |
| 注册 | `/register` | 居中表单卡片 | 无 | P0 |
| 个人中心 | `/profile` | 侧边导航 + 内容区 | 需登录 | P2 |
| AI 对话 | `/ai-chat` | 全屏聊天界面 | 需登录 | P2 |
| 管理后台 | `/admin` | 专用管理布局 | 管理员 | P2 |

---

## 4. 组件规格

### 4.1 shadcn/ui 基础组件

| 组件 | 用途 | 自定义说明 |
|------|------|-----------|
| Button | 所有按钮交互 | 主色(primary) / 次要(secondary) / 幽灵(ghost) 变体 |
| Card | 智者卡片、书单卡片、著作卡片 | 增加 hover 上浮效果 |
| Input | 搜索框、表单输入 | 搜索框带搜索图标 |
| Tabs | 分类切换（智者库） | 下划线式 Tab |
| Badge | 分类标签、审核状态标签 | 圆角 pill 样式 |
| Avatar | 用户头像、智者肖像 | 支持图片和文字 fallback |
| Dialog | 确认对话框 | 简洁居中 |
| DropdownMenu | 用户菜单、更多操作 | 右上角触发 |
| Skeleton | 加载骨架屏 | 所有卡片和列表均需 |
| ScrollArea | 长列表区域 | 自定义滚动条样式 |
| Separator | 内容分隔线 | 浅灰色细线 |
| Toast (Sonner) | 操作反馈提示 | 顶部弹出 |
| Textarea | 书评编辑器 | 配合 Markdown 工具栏 |

### 4.2 自定义组件

| 组件名 | 用途 | 构成 |
|--------|------|------|
| `WisePersonCard` | 智者卡片 | Card + Badge + Avatar + 摘要文字 |
| `WisePersonGrid` | 智者卡片网格 | 响应式 Grid + Skeleton |
| `CategoryTabs` | 分类切换 | Tabs + Badge（显示数量） |
| `WorkCard` | 著作卡片 | Card + 推荐语 + 来源标注 Badge |
| `WorkList` | 著作列表 | 纵向列表 + 分页 |
| `QuestionCard` | 问题导览卡片 | Card + 图标 + 关联数量 Badge |
| `BookListCard` | 书单卡片 | Card + 覆盖领域 Tag |
| `SearchBox` | 全局搜索框 | Input + 搜索图标 + 建议下拉 |
| `SearchResults` | 搜索结果 | Tabs（智者/著作）+ 列表 |
| `SearchSuggestions` | 搜索建议 | 下拉面板 + 高亮匹配 |
| `BookmarkButton` | 收藏按钮 | Button + 心形图标（空心/实心） |
| `ReviewEditor` | 书评编辑器 | Textarea + Markdown 工具栏 + 发布按钮 |
| `ReviewCard` | 书评卡片 | Card + 用户信息 + 内容 + 时间 |
| `ReviewList` | 书评列表 | 纵向列表 + 空状态 |
| `ChatWidget` | AI 对话组件 | 消息列表 + 输入框 + 流式渲染 |
| `ChatMessage` | 对话消息 | 气泡样式 + Markdown 渲染 + 来源标注 |
| `SourceBadge` | 来源标注 | Badge 显示"来源：《聪明的阅读者》" |
| `EmptyState` | 空状态 | 图标 + 文字 + 推荐操作 |
| `ErrorState` | 错误状态 | 错误图标 + 信息 + 重试按钮 |
| `LoadingSkeleton` | 骨架屏 | 与卡片尺寸匹配的灰色占位块 |

### 4.3 组件的 Feature Independence 配置

每个核心组件必须支持 `useMockMode` 模式：

```typescript
// 示例：智者卡片组件的 Mock 模式
interface WisePersonGridProps {
  useMockMode?: boolean  // 默认为 true
}

// 当 useMockMode=true 时，组件使用本地 Mock 数据渲染
// 当 useMockMode=false 时，组件通过 API 获取数据
```

---

## 5. 状态管理

### Store 架构

```
Zustand Stores（persist → localStorage）
├── appStore              # 全局 UI 状态
│   ├── sidebarOpen       # 侧边栏状态
│   ├── theme             # 主题
│   └── useMockMode       # Mock 模式标志（默认 true）
│
├── wisePersonStore       # 智者数据
│   ├── items             # 智者列表（Mock 初始化）
│   ├── currentCategory   # 当前分类筛选
│   ├── currentSlug       # 当前查看的智者
│   ├── isLoading         # 加载状态
│   └── useMockMode       # Mock/API 切换
│
├── workStore             # 著作数据
│   ├── items             # 著作列表（Mock 初始化）
│   └── currentWorkId     # 当前查看的著作
│
├── searchStore           # 搜索状态
│   ├── query             # 当前搜索词
│   ├── results           # 搜索结果（智者+著作混合）
│   ├── suggestions       # 搜索建议
│   └── isSearching       # 搜索状态
│
├── bookmarkStore         # 收藏数据
│   ├── items             # 收藏列表（Mock 初始化）
│   └── add/remove        # 操作方法
│
├── reviewStore           # 书评数据
│   ├── items             # 书评列表（Mock 初始化）
│   ├── currentReviewId   # 当前编辑的书评
│   └── filterStatus      # 状态筛选（全部/草稿/审核中/已发布）
│
├── chatStore             # AI 对话状态
│   ├── messages          # 对话消息（Mock 初始化）
│   ├── isStreaming       # 流式输出中（Mock 模拟）
│   └── useMockMode       # Mock/真实 AI 切换
│
└── userStore             # 用户状态
    ├── isLoggedIn        # 登录状态
    ├── profile           # 用户信息
    └── readingHistory    # 阅读轨迹
```

### 核心 Store 定义示例

```typescript
// lib/stores/wise-person-store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { MOCK_WISE_PERSONS } from '@/data/mock/wise-persons'

interface WisePerson {
  id: string
  slug: string
  name: string
  biography: string
  coreIdeas: string
  category: string
  period: string
  region: string
  portraitUrl?: string
  source: string
}

interface WisePersonState {
  items: WisePerson[]
  currentCategory: string | null
  currentPeriod: string | null
  currentSlug: string | null
  isLoading: boolean
  useMockMode: boolean

  setCategory: (category: string | null) => void
  setPeriod: (period: string | null) => void
  setCurrentSlug: (slug: string | null) => void
  setLoading: (loading: boolean) => void
  setMockMode: (mock: boolean) => void
  fetchItems: () => Promise<void>  // 未来替换为 API 调用
}

export const useWisePersonStore = create<WisePersonState>()(
  persist(
    (set, get) => ({
      // 用 Mock 数据初始化
      items: MOCK_WISE_PERSONS,
      currentCategory: null,
      currentPeriod: null,
      currentSlug: null,
      isLoading: false,
      useMockMode: true,

      setCategory: (category) => set({ currentCategory: category }),
      setPeriod: (period) => set({ currentPeriod: period }),
      setCurrentSlug: (slug) => set({ currentSlug: slug }),
      setLoading: (loading) => set({ isLoading: loading }),
      setMockMode: (mock) => set({ useMockMode: mock }),

      fetchItems: async () => {
        const { useMockMode } = get()
        if (useMockMode) {
          // Mock 模式：Store 已预填充数据
          return
        }
        // 真实模式：调用 API
        set({ isLoading: true })
        try {
          const res = await fetch('/api/v1/wise-persons')
          const data = await res.json()
          set({ items: data, isLoading: false })
        } catch {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'wise-person-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

---

## 6. 功能独立原则

### 三条规则

**规则 1：无阻塞依赖**
- ❌ 错误：必须先登录才能浏览智者库
- ✅ 正确：所有浏览和搜索功能无需登录，完全匿名可用

**规则 2：默认 Mock，就绪后切换真实**
```typescript
// 全局 Mock 模式开关
const useMockMode = useAppStore((s) => s.useMockMode)

// 组件根据标志选择数据源
const wisePersons = useMockMode
  ? MOCK_WISE_PERSONS    // 本地 Mock
  : await fetchWisePersonsFromAPI()  // 远程 API
```

**规则 3：Mock 模式视觉反馈**
```typescript
// 开发环境显示 Mock 模式徽章
{useMockMode && (
  <Badge variant="outline" className="fixed bottom-4 right-4 z-50">
    🎭 演示模式
  </Badge>
)}
```

### 各功能模块的 Mock 依赖链

| 功能 | Mock 模式 | 真实模式 | 切换条件 |
|------|-----------|---------|---------|
| 智者浏览 | 本地 Mock 数据 | GET `/api/v1/wise-persons` | API 就绪后切换 |
| 著作查看 | 本地 Mock 数据 | GET `/api/v1/works` | API 就绪后切换 |
| 搜索 | 本地 Mock 过滤 | GET `/api/v1/search?q=` | API 就绪后切换 |
| 收藏 | localStorage 持久化 | POST `/api/v1/bookmarks` | 认证+API 就绪后切换 |
| 书评 | localStorage 持久化 | POST `/api/v1/reviews` | 认证+API 就绪后切换 |
| AI 对话 | Mock 响应生成器 | POST `/api/v1/ai/chat` | API 密钥配置后切换 |

---

## 7. Mock 数据

### 7.1 智者 Mock 数据

```typescript
// data/mock/wise-persons.ts
export const MOCK_WISE_PERSONS = [
  {
    id: 'wp-1',
    slug: 'plato',
    name: '柏拉图',
    biography: '古希腊哲学家，西方哲学奠基人之一，苏格拉底的学生，亚里士多德的老师。',
    coreIdeas: '理念论、理想国、灵魂三分说',
    category: 'philosophy',
    period: 'ancient',
    region: 'western',
    source: '《聪明的阅读者》',
  },
  {
    id: 'wp-2',
    slug: 'aristotle',
    name: '亚里士多德',
    biography: '古希腊哲学家、科学家，柏拉图的学生，亚历山大大帝的老师。',
    coreIdeas: '四因说、形而上学、尼各马可伦理学',
    category: 'philosophy',
    period: 'ancient',
    region: 'western',
    source: '《聪明的阅读者》',
  },
  {
    id: 'wp-3',
    slug: 'confucius',
    name: '孔子',
    biography: '中国古代思想家、教育家，儒家学派创始人。',
    coreIdeas: '仁、礼、中庸、德治',
    category: 'philosophy',
    period: 'ancient',
    region: 'eastern',
    source: '《聪明的阅读者》',
  },
  {
    id: 'wp-4',
    slug: 'laozi',
    name: '老子',
    biography: '中国古代哲学家，道家学派创始人。',
    coreIdeas: '道、无为、自然',
    category: 'philosophy',
    period: 'ancient',
    region: 'eastern',
    source: '《聪明的阅读者》',
  },
  {
    id: 'wp-5',
    slug: 'descartes',
    name: '笛卡尔',
    biography: '法国哲学家、数学家，近代哲学之父。',
    coreIdeas: '我思故我在、心物二元论、方法论',
    category: 'philosophy',
    period: 'early-modern',
    region: 'western',
    source: '《聪明的阅读者》',
  },
  {
    id: 'wp-6',
    slug: 'darwin',
    name: '达尔文',
    biography: '英国生物学家，进化论奠基人。',
    coreIdeas: '自然选择、物种起源、进化论',
    category: 'science',
    period: 'modern',
    region: 'western',
    source: '《聪明的阅读者》',
  },
  {
    id: 'wp-7',
    slug: 'einstein',
    name: '爱因斯坦',
    biography: '理论物理学家，相对论创始人，1921年诺贝尔物理学奖得主。',
    coreIdeas: '相对论、质能方程、量子力学贡献',
    category: 'science',
    period: 'modern',
    region: 'western',
    source: '《聪明的阅读者》',
  },
  {
    id: 'wp-8',
    slug: 'dawkins',
    name: '理查德·道金斯',
    biography: '英国进化生物学家，《自私的基因》作者。',
    coreIdeas: '自私的基因、模因论、延伸表现型',
    category: 'science',
    period: 'contemporary',
    region: 'western',
    source: '《聪明的阅读者》',
  },
  {
    id: 'wp-9',
    slug: 'yang-zhiping',
    name: '阳志平',
    biography: '认知科学专家，《聪明的阅读者》作者，致力于通识教育的推广。',
    coreIdeas: '通识教育、科学计量学、经典目录学',
    category: 'social-science',
    period: 'contemporary',
    region: 'eastern',
    source: '《聪明的阅读者》',
  },
  {
    id: 'wp-10',
    slug: 'kahneman',
    name: '丹尼尔·卡尼曼',
    biography: '以色列裔美国心理学家，2002年诺贝尔经济学奖得主。',
    coreIdeas: '系统1与系统2、前景理论、行为经济学',
    category: 'social-science',
    period: 'contemporary',
    region: 'western',
    source: '《聪明的阅读者》',
  },
  // ... 共 10 条 Mock 数据，覆盖不同学科、时代、地区
]
```

### 7.2 著作 Mock 数据

```typescript
// data/mock/works.ts
export const MOCK_WORKS = [
  {
    id: 'wk-1',
    wisePersonId: 'wp-1',
    wisePersonName: '柏拉图',
    title: '理想国',
    description: '柏拉图最著名的对话录，探讨正义、理想城邦和哲学家的统治。',
    recommendation: '西方哲学史上最重要的著作之一，奠定了西方政治哲学的基础。',
    isbn: '978-7-100-00001-1',
    source: '《聪明的阅读者》',
  },
  {
    id: 'wk-2',
    wisePersonId: 'wp-2',
    wisePersonName: '亚里士多德',
    title: '尼各马可伦理学',
    description: '亚里士多德关于伦理学的代表作，探讨何为美好生活和幸福。',
    recommendation: '美德伦理学的奠基之作，对后世伦理学发展影响深远。',
    isbn: '978-7-100-00002-8',
    source: '《聪明的阅读者》',
  },
  {
    id: 'wk-3',
    wisePersonId: 'wp-5',
    wisePersonName: '笛卡尔',
    title: '第一哲学沉思集',
    description: '笛卡尔的代表作，系统阐述了"我思故我在"等核心思想。',
    recommendation: '近代哲学的开端，不可不读的哲学经典。',
    isbn: '978-7-100-00003-5',
    source: '《聪明的阅读者》',
  },
  {
    id: 'wk-4',
    wisePersonId: 'wp-6',
    wisePersonName: '达尔文',
    title: '物种起源',
    description: '达尔文的代表作，系统阐述了自然选择学说。',
    recommendation: '改变人类对自身认知的划时代著作。',
    isbn: '978-7-100-00004-2',
    source: '《聪明的阅读者》',
  },
  {
    id: 'wk-5',
    wisePersonId: 'wp-8',
    wisePersonName: '理查德·道金斯',
    title: '自私的基因',
    description: '从基因视角解读生物演化和利他行为。',
    recommendation: '科普写作的典范，以基因为中心重构了我们对演化的理解。',
    isbn: '978-7-100-00005-9',
    source: '《聪明的阅读者》',
  },
  {
    id: 'wk-6',
    wisePersonId: 'wp-10',
    wisePersonName: '丹尼尔·卡尼曼',
    title: '思考，快与慢',
    description: '系统阐述人类思维的两种系统：直觉快系统和理性慢系统。',
    recommendation: '行为经济学的必读书，帮助我们理解自己的认知偏见。',
    isbn: '978-7-100-00006-6',
    source: '《聪明的阅读者》',
  },
  // ... 更多著作
]
```

### 7.3 Mock AI 响应生成器

```typescript
// lib/mock/ai-responses.ts
const RESPONSES: Record<string, string[]> = {
  philosophy: [
    '根据柏拉图的理念论，现实世界只是理念世界的影子。这一观点对后世哲学产生了深远影响。',
    '亚里士多德认为，幸福（eudaimonia）是人生的最高目的，而美德则是实现幸福的关键途径。',
    '笛卡尔的"我思故我在"奠定了近代哲学的主体性原则，开启了理性主义传统。',
  ],
  science: [
    '达尔文的自然选择学说表明，生物演化并非由目的驱使，而是对环境适应的自然结果。',
    '爱因斯坦的相对论彻底改变了我们对时空的理解——时间和空间不是绝对的，而是相对的。',
    '道金斯在《自私的基因》中提出，基因是自然选择的基本单位，生物体只是基因为了复制自己而制造的"生存机器"。',
  ],
  reading: [
    '阳志平老师在《聪明的阅读者》中提出了"通识教育地图"的概念，帮助读者系统性地构建跨学科知识框架。',
    '建议从最小限度书单开始，包含笛卡尔《第一哲学沉思集》、达尔文《物种起源》等经典著作。',
  ],
  default: [
    '这是一个很有深度的问题。从智者网的视角来看，可以从以下几个角度来理解……',
    '好的问题！让我为你推荐几位相关的智者和他们的代表作……',
    '根据平台收录的智者思想，这个问题可以追溯到……',
  ],
}

export async function generateMockResponse(
  message: string,
  context?: { category?: string }
): Promise<string> {
  // 模拟网络延迟 500-1500ms
  await new Promise((r) => setTimeout(r, 500 + Math.random() * 1000))

  // 根据输入关键词选择响应
  const category =
    message.includes('哲学') || message.includes('柏拉图')
      ? 'philosophy'
      : message.includes('科学') || message.includes('基因')
        ? 'science'
        : message.includes('读') || message.includes('书单')
          ? 'reading'
          : 'default'

  const responses = RESPONSES[category]
  const response = responses[Math.floor(Math.random() * responses.length)]

  // 添加来源标注
  return `${response}\n\n> 🤖 AI 生成，仅供参考 | 📖 数据来源：《聪明的阅读者》`
}

// 流式响应
export async function* streamMockAIResponse(
  message: string,
  context?: { category?: string }
): AsyncGenerator<string> {
  const response = await generateMockResponse(message, context)
  for (const char of response) {
    yield char
    await new Promise((r) => setTimeout(r, 20 + Math.random() * 30))
  }
}
```

---

## 8. 核心功能实现

### 8.1 P0 功能（迭代 1）

| 功能 | 页面 | 组件 | Store | Mock |
|------|------|------|-------|------|
| 智者分类浏览 | `/wise-persons` | `CategoryTabs` + `WisePersonGrid` + `WisePersonCard` | `wisePersonStore` | 10 条智者 Mock 数据 |
| 智者详情 | `/wise-persons/:slug` | `WisePersonDetail` + `WorkList` + `WorkCard` | `wisePersonStore` + `workStore` | 关联著作数据 |
| 全局搜索 | `/search?q=` | `SearchBox` + `SearchResults` | `searchStore` | 从 Mock 数据中过滤 |
| 用户注册/登录 | `/register` / `/login` | `AuthForm` | `userStore` | Mock 登录状态 |
| 首页 | `/` | Hero + 板块预览卡片 | — | 静态内容 |

#### 8.1.1 智者分类浏览实现要点

```
URL: /wise-persons
数据流:
  1. 页面加载 → wisePersonStore.items (Mock 数据)
  2. 用户点击分类 Tab → setCategory() → UI 过滤 items
  3. 用户点击卡片 → router.push(`/wise-persons/${slug}`)

组件树:
  WisePersonsPage
  ├── SearchBox (全局)
  ├── CategoryTabs (学科 | 时代 | 地区)
  ├── WisePersonGrid
  │   └── WisePersonCard × N
  └── Pagination / InfiniteScroll

状态:
  - activeTab: 'all' | category | period
  - filteredItems: 根据 activeTab 过滤后的智者列表

空状态:
  - 某分类下无智者 → EmptyState: "该分类暂未收录智者"

加载状态:
  - Skeleton 卡片 × 6（与卡片同尺寸）

边缘情况:
  - 智者名过长 → 文字省略号（2 行截断）
  - 无肖像 → Avatar fallback 显示姓名首字
```

#### 8.1.2 智者详情页实现要点

```
URL: /wise-persons/{slug}
数据流:
  1. 页面加载 → 根据 slug 从 wisePersonStore 获取智者
  2. 根据智者 ID 从 workStore 获取关联著作
  3. 未找到 → 404

组件树:
  WisePersonDetailPage
  ├── Breadcrumb (智者库 > 智者姓名)
  ├── WisePersonDetail
  │   ├── Avatar (肖像)
  │   ├── Name + Category Badge
  │   ├── Biography (正文)
  │   ├── CoreIdeas (关键词标签)
  │   └── SourceBadge (来源标注)
  ├── Separator
  ├── Section Title: "代表作"
  └── WorkList
      └── WorkCard × N

状态:
  - 404 处理: slug 不匹配时展示 ErrorState

来源标注:
  - 页面底部固定 Badge: "📖 数据来源：《聪明的阅读者》"
```

### 8.2 P1 功能（迭代 2）

| 功能 | 页面 | 组件 | Store |
|------|------|------|-------|
| 十大问题导览 | `/questions` + `/questions/:id` | `QuestionCard` + `QuestionGrid` | `questionStore` |
| 书单列表与详情 | `/book-lists` + `/book-lists/:id` | `BookListCard` + `BookListDetail` | `bookListStore` |
| 收藏功能 | 嵌入智者/书单详情页 | `BookmarkButton` | `bookmarkStore` |

### 8.3 P2 功能（迭代 3）

| 功能 | 页面 | 组件 | Store |
|------|------|------|-------|
| 书评/笔记 | `/reviews/new` + 嵌入著作详情 | `ReviewEditor` + `ReviewList` + `ReviewCard` | `reviewStore` |
| AI 对话助手 | `/ai-chat` | `ChatWidget` + `ChatMessage` | `chatStore` |
| 个人中心 | `/profile` | 收藏列表 + 书评管理 + 阅读轨迹 | `userStore` + `bookmarkStore` |
| 管理后台 | `/admin` | 审核列表 + 数据管理 | — |

---

## 9. 交互模式

### 9.1 加载状态

| 场景 | 模式 | 实现 |
|------|------|------|
| 智者列表加载 | 骨架屏 | `Skeleton` 卡片 × 6 |
| 详情页加载 | 居中 spinner | `Loader2` 图标旋转 |
| 搜索 | 搜索框内 spinner | Input 右侧加载图标 |
| 分页加载 | 底部 spinner | 滚动到底触发更多 |
| AI 回复 | 流式字符逐个出现 | `streamMockAIResponse` 生成器 |
| 图片加载 | 图片 fade-in | `next/image` blurDataURL |

### 9.2 反馈模式

| 场景 | 反馈方式 | 持续时间 |
|------|---------|---------|
| 收藏成功 | 心形填色动画 + "已收藏" Toast | Toast 3s |
| 取消收藏 | 心形变空 + "已取消收藏" Toast | Toast 3s |
| 书评发布 | 按钮显示"发布中…" → "发布成功" | 视 API 响应 |
| 书评保存草稿 | "草稿已保存" Toast | Toast 2s |
| 操作错误 | "操作失败" Toast + 错误详情 | Toast 5s |
| 表单验证 | 字段红色边框 + 错误提示文字 | 持续到修正 |
| 搜索无结果 | EmptyState 图标 + "未找到相关内容" + 推荐 | 持续 |

### 9.3 空状态

| 场景 | 空状态内容 | 行动号召 |
|------|-----------|---------|
| 某分类无智者 | "该分类暂未收录智者" + 书籍图标 | "浏览全部智者" |
| 搜索无结果 | "未找到相关内容" + 搜索图标 | "尝试其他关键词" / "浏览热门推荐" |
| 收藏为空 | "还没有收藏" + 心形图标 | "去探索智者库" |
| 书评为空 | "还没有书评" + 笔图标 | "去读一本著作" |
| 对话历史为空 | "开始一段对话" + 消息图标 | 显示建议问题列表 |

### 9.4 错误状态

| 场景 | 错误内容 | 恢复操作 |
|------|---------|---------|
| 网络错误 | "网络连接异常，请检查" | "重试"按钮 |
| 页面不存在 (404) | "页面未找到" | "返回首页"按钮 |
| 服务端错误 (500) | "服务异常，请稍后再试" | "重试"按钮 |
| 权限不足 | "需要登录才能使用此功能" | "去登录"按钮 |

---

## 10. 无障碍性

### WCAG 2.1 AA 检查清单

| 标准 | 要求 | 实现方式 |
|------|------|---------|
| 1.1.1 非文本内容 | 所有图片提供 alt 文本 | 智者肖像 alt="{姓名}肖像" |
| 1.3.1 信息和关系 | 语义化 HTML 结构 | `<main>`, `<nav>`, `<article>`, `<section>` |
| 1.4.3 对比度（最小） | 文本对比度 ≥ 4.5:1 | OKLCH 色彩确保高对比度 |
| 1.4.4 调整文本大小 | 200% 缩放不丢失内容 | rem 单位，而非 px |
| 1.4.10 响应式 | 内容在 320px 宽度不丢失 | 响应式网格布局 |
| 2.1.1 键盘 | 所有功能可通过键盘 | 焦点可见，Tab 顺序合理 |
| 2.4.4 链接目的 | 链接文本描述目的 | "查看{智者名}详情" |
| 2.4.7 焦点可见 | 焦点指示器清晰可见 | `focus-visible` 环形轮廓 |
| 3.2.1 焦点 | 焦点不会触发上下文变化 | 仅用户主动操作触发导航 |
| 3.3.2 标签 | 表单控件有标签 | `<label>` 或 `aria-label` |
| 4.1.2 名称、角色、值 | 自定义组件暴露无障碍属性 | shadcn/ui 默认支持 |

### 特定优化

```typescript
// 搜索框无障碍
<input
  type="search"
  aria-label="搜索智者和著作"
  placeholder="搜索智者或著作…"
  role="searchbox"
/>

// 智者卡片无障碍
<article
  aria-labelledby={`wise-person-${slug}-name`}
  data-wise-person-slug={slug}
>
  <h3 id={`wise-person-${slug}-name`}>{name}</h3>
</article>

// 分类导航无障碍
<nav role="tablist" aria-label="智者分类">
  <button role="tab" aria-selected={isActive} aria-controls="panel-all">
    全部
  </button>
</nav>
```

---

## 11. 扩展点

### 11.1 数据库迁移路径

当前使用 Zustand + localStorage 进行数据持久化。迁移到后端数据库时：

| 步骤 | 操作 | 涉及文件 |
|------|------|---------|
| 1 | 在 services/ 中创建 API 服务函数 | `services/wise-person.service.ts` |
| 2 | 在 Store 的 fetchItems 中替换为 API 调用 | `lib/stores/wise-person-store.ts` |
| 3 | 切换 useMockMode = false | 可在设置面板或环境变量中控制 |
| 4 | 移除 Mock 数据文件（可选） | `data/mock/wise-persons.ts` |

**代码预留示例：**
```typescript
// services/wise-person.service.ts
// 后续实现：从 API 获取数据
export async function fetchWisePersons(params: {
  category?: string
  period?: string
  page?: number
}): Promise<WisePerson[]> {
  const searchParams = new URLSearchParams()
  if (params.category) searchParams.set('category', params.category)
  if (params.period) searchParams.set('period', params.period)
  if (params.page) searchParams.set('page', String(params.page))

  const res = await fetch(`/api/v1/wise-persons?${searchParams}`)
  if (!res.ok) throw new Error('Failed to fetch wise persons')
  return res.json()
}
```

### 11.2 API 实现路径

| 当前 Mock 实现 | 未来 API 替换 |
|----------------|---------------|
| `wisePersonStore.items` (本地数据) | `GET /api/v1/wise-persons` |
| `workStore.items` (本地数据) | `GET /api/v1/works` |
| `searchStore` 本地过滤 | `GET /api/v1/search?q=` |
| `bookmarkStore` localStorage | `POST/DELETE /api/v1/bookmarks` |
| `reviewStore` localStorage | `POST/GET/PUT /api/v1/reviews` |
| `generateMockResponse()` | `POST /api/v1/ai/chat` (流式) |

### 11.3 认证集成路径

| 当前 Mock | 未来 Better Auth 集成 |
|-----------|----------------------|
| `userStore.isLoggedIn` (localStorage) | `better-auth` session 检测 |
| Mock 登录表单 | Better Auth 登录流程 |
| — | 受保护路由中间件检查 |

---

## 12. 验收检查清单

### 前置条件
- [x] 应用类型判断为 MPA（多页面应用），理由充分
- [x] 导航结构确定为混合型（顶部 + 侧边分类）
- [x] OKLCH 配色方案已定义（230° 蓝色主色调）

### 功能独立（关键）
- [x] 浏览、搜索功能无需登录即可使用
- [x] 收藏、书评、AI 对话在 Mock 模式下无需 API 密钥
- [x] Mock 模式指示器（演示模式徽章）已定义
- [x] 每个 Store 有 `useMockMode` 标志

### 丰富 Mock 数据
- [x] 智者数据 10 条 Mock 条目（覆盖不同学科/时代/地区）
- [x] 著作数据 6 条 Mock 条目（关联智者）
- [x] Mock AI 响应生成器（按主题分类回复）
- [x] 流式 Mock 响应生成器（逐字符输出）
- [x] 数据来源标注 Mock（"来源：《聪明的阅读者》"）

### 组件覆盖
- [x] P0 功能组件全部定义（智者浏览、详情、搜索、认证、首页）
- [x] P1 功能组件定义（问题导览、书单、收藏）
- [x] P2 功能组件定义（书评、AI 对话、个人中心、管理后台）
- [x] 共享组件覆盖（空状态、错误状态、骨架屏、来源标注）

### 交互覆盖
- [x] 加载状态（骨架屏、spinner、流式输出）
- [x] 反馈模式（Toast、动画、表单验证）
- [x] 空状态（每种场景独立的空状态内容）
- [x] 错误状态（网络、404、500、权限不足）

### 无障碍性
- [x] 语义化 HTML 结构
- [x] 键盘导航支持
- [x] 高对比度色彩
- [x] ARIA 标注

### 扩展点
- [x] 数据库迁移路径已记录
- [x] API 实现路径已记录
- [x] 认证集成路径已记录
