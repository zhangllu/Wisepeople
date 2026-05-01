---
title: 智者网（WisePeople）系统架构规格书
version: 1.0.0
created: 2026-04-27
depends:
  - .42cog/real/real.md
  - .42cog/cog/cog.md
  - spec/pm/pr.spec.md
  - spec/pm/userstory.spec.md
---

# 系统架构规格书：智者网（WisePeople）

<meta>
  <document-id>wisepeople-sys-spec</document-id>
  <version>1.0.0</version>
  <project>智者网（WisePeople）</project>
  <type>系统架构规格书</type>
  <created>2026-04-27</created>
  <depends>real.md, cog.md, pr.spec.md, userstory.spec.md</depends>
</meta>

## 1. 架构概览

### 架构模式

**分层架构 + 模块化设计（Layered Architecture + Modular Design）**

```
┌─────────────────────────────────────────────────┐
│           表现层（Presentation Layer）             │
│      React 组件（shadcn/ui）+ Tailwind CSS        │
├─────────────────────────────────────────────────┤
│           应用层（Application Layer）              │
│   Next.js App Router + API Routes + Server Actions│
├─────────────────────────────────────────────────┤
│           领域层（Domain Layer）                   │
│      Services + Validators + Business Logic       │
├─────────────────────────────────────────────────┤
│          基础设施层（Infrastructure Layer）         │
│  Drizzle ORM + PostgreSQL (Neon) + Better Auth    │
│  Vercel AI SDK + External APIs                    │
└─────────────────────────────────────────────────┘
```

### 部署架构

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  EdgeOne  │────▶│  Next.js │────▶│PostgreSQL│
│  CDN/CDN  │     │  SSR     │     │ (Neon)   │
└──────────┘     └──────────┘     └──────────┘
                       │
                 ┌─────┴──────┐
                 │  Vercel AI │
                 │  SDK       │
                 │  (Claude)  │
                 └────────────┘
```

- **托管平台**：EdgeOne Pages（SSR 模式）
- **数据库**：Neon（云上 PostgreSQL）
- **AI 服务**：Vercel AI SDK（Claude / GPT-4）
- **认证**：Better Auth（内置 session 管理）
- **包管理**：bun

---

## 2. 子系统分解

### 子系统总览

```
WisePeople System
├── Auth Subsystem          # 用户认证与授权
├── WisePerson Subsystem    # 智者库管理
├── Work Subsystem          # 著作管理
├── Question Subsystem      # 问题导览
├── BookList Subsystem      # 书单管理
├── Search Subsystem        # 全文搜索
├── Review Subsystem        # 书评与笔记
├── AI Assistant Subsystem  # AI 对话助手
├── User Subsystem          # 用户中心
└── Admin Subsystem         # 后台管理
```

---

### 2.1 Auth 子系统

**职责：** 用户注册、登录、登出、会话管理、角色权限控制

**组件：**
- `AuthService` — 认证业务逻辑（注册、登录、密码重置）
- `SessionManager` — 会话创建、验证和销毁
- `RoleGuard` — 角色和权限验证中间件

**接口：**
- **输入：** 邮箱 + 密码凭证，OAuth token
- **输出：** Session token，用户身份信息

**依赖：**
- **依赖：** Better Auth 库、User 数据表
- **被使用：** 所有需要认证的子系统

---

### 2.2 WisePerson 子系统

**职责：** 智者数据的 CRUD、分类浏览、详情展示

**组件：**
- `WisePersonService` — 智者数据业务逻辑
- `CategoryManager` — 学科/时代/地区分类管理
- `WisePersonCache` — 智者列表缓存

**接口：**
- **输入：** 分类筛选条件、智者 slug
- **输出：** 智者列表、智者详情（含著作）

**依赖：**
- **依赖：** Work 子系统（获取关联著作）
- **被使用：** Search 子系统、AI Assistant 子系统

---

### 2.3 Work 子系统

**职责：** 著作数据的 CRUD、著作与智者关联、推荐语管理

**组件：**
- `WorkService` — 著作数据业务逻辑
- `WorkRecommendation` — 著作推荐与排序

**接口：**
- **输入：** 智者 slug、筛选条件
- **输出：** 著作列表、著作详情

**依赖：**
- **依赖：** WisePerson 子系统
- **被使用：** BookList 子系统、Review 子系统

---

### 2.4 Question 子系统

**职责：** 十大问题导览的数据管理和关联展示

**组件：**
- `QuestionService` — 问题数据业务逻辑
- `QuestionMapping` — 问题与智者/著作的关联映射

**接口：**
- **输入：** 问题编号 Q01-Q10
- **输出：** 问题详情、关联的智者和著作

**依赖：**
- **依赖：** WisePerson 子系统、Work 子系统
- **被使用：** 首页导航、探索页面

---

### 2.5 BookList 子系统

**职责：** 书单的创建和管理、书单与著作关联

**组件：**
- `BookListService` — 书单业务逻辑
- `ListComposition` — 书单内著作的组织和排序

**接口：**
- **输入：** 书单 ID、分类
- **输出：** 书单列表、书单详情（含著作）

**依赖：**
- **依赖：** Work 子系统
- **被使用：** User 子系统（收藏书单）

---

### 2.6 Search 子系统

**职责：** 全文搜索，覆盖智者和著作数据

**组件：**
- `SearchService` — 搜索业务逻辑
- `SearchIndexer` — 搜索索引构建和维护
- `SearchSuggestion` — 实时搜索建议

**接口：**
- **输入：** 搜索关键词、筛选条件
- **输出：** 搜索结果（智者和著作混合）

**依赖：**
- **依赖：** WisePerson 子系统、Work 子系统
- **被使用：** 全局搜索功能、AI Assistant 子系统

---

### 2.7 Review 子系统

**职责：** 书评/笔记的创建、编辑、审核、展示

**组件：**
- `ReviewService` — 书评业务逻辑
- `ReviewModerator` — 内容审核流程管理
- `ReviewCache` — 书评列表缓存

**接口：**
- **输入：** 著作 ID、书评内容（Markdown）
- **输出：** 书评列表、书评详情（含审核状态）

**依赖：**
- **依赖：** Work 子系统、User 子系统
- **被使用：** Admin 子系统（审核）

---

### 2.8 AI Assistant 子系统

**职责：** AI 智能对话、个性化推荐、知识问答

**组件：**
- `ChatService` — 对话管理
- `RecommendationEngine` — 个性化推荐逻辑
- `KnowledgeRetriever` — 平台知识检索（RAG）
- `StreamManager` — 流式输出管理

**接口：**
- **输入：** 用户问题、对话历史
- **输出：** AI 流式回复、推荐结果

**依赖：**
- **依赖：** Vercel AI SDK、WisePerson 子系统、Work 子系统、Search 子系统
- **被使用：** AI 对话页面

---

### 2.9 User 子系统

**职责：** 用户个人中心、收藏管理、阅读轨迹

**组件：**
- `UserService` — 用户数据业务逻辑
- `BookmarkService` — 收藏管理
- `ReadingHistory` — 浏览和阅读轨迹记录

**接口：**
- **输入：** 用户 ID
- **输出：** 用户资料、收藏列表、阅读历史

**依赖：**
- **依赖：** Auth 子系统、WisePerson 子系统、Work 子系统、BookList 子系统、Review 子系统
- **被使用：** 个人中心页面

---

### 2.10 Admin 子系统

**职责：** 内容审核、数据管理、统计分析

**组件：**
- `ContentModeration` — 用户生成内容审核
- `DataManager` — 智者和著作数据管理
- `StatsService` — 平台使用统计

**接口：**
- **输入：** 管理操作指令
- **输出：** 审核结果、统计数据

**依赖：**
- **依赖：** 除 AI Assistant 外的所有子系统
- **被使用：** 管理后台页面

---

## 3. 子系统依赖图

```
                       ┌─────────────┐
                       │   Search    │
                       └──────┬──────┘
                              │
┌──────────┐    ┌─────────────┼──────────────────┐
│  Question │    │             │                   │
└─────┬────┘    │    ┌────────┴────────┐          │
      │         │    │  WisePerson     │          │
      ├─────────┤    └────────┬────────┘          │
      │         │             │                   │
      │    ┌────┴──────┐     │                   │
      │    │   Work    ├─────┘                   │
      │    └────┬──────┘                         │
      │         │                                │
      │    ┌────┴──────┐    ┌──────────────┐     │
      │    │ BookList  │    │    Review    │     │
      │    └────┬──────┘    └──────┬───────┘     │
      │         │                  │               │
      │    ┌────┴──────┐    ┌──────┴───────┐     │
      │    │    AI     │    │    Admin     │     │
      │    │ Assistant │    │              │     │
      │    └───────────┘    └──────────────┘     │
      │                                          │
      │    ┌─────────────────────────────┐       │
      │    │         User (Auth)         │       │
      │    └─────────────────────────────┘       │
      └──────────────────────────────────────────┘
```

---

## 4. API 设计

### API 基础规范

- **基础路径：** `/api/v1`
- **格式：** RESTful JSON
- **认证：** Bearer Token（Better Auth session）
- **分页：** `?page=1&limit=20`
- **排序：** `?sort=created_at&order=desc`

### 4.1 认证 API

| 方法 | 路径 | 描述 | 认证 | 关联 MAS |
|------|------|------|------|---------|
| POST | `/api/v1/auth/register` | 用户注册（邮箱+密码） | 无 | MS-L-01 |
| POST | `/api/v1/auth/login` | 用户登录 | 无 | MS-L-01 |
| POST | `/api/v1/auth/logout` | 用户登出 | 必需 | MS-G-01 |
| GET | `/api/v1/auth/session` | 获取当前会话 | 必需 | MS-G-01 |

### 4.2 智者 API

| 方法 | 路径 | 描述 | 认证 | 关联 MAS |
|------|------|------|------|---------|
| GET | `/api/v1/wise-persons` | 智者列表（支持分类筛选） | 无 | MS-L-03 |
| GET | `/api/v1/wise-persons/:slug` | 智者详情（含著作） | 无 | MS-L-04 |
| GET | `/api/v1/wise-persons/categories` | 分类列表 | 无 | MS-G-02 |

**筛选参数：**
- `?category=philosophy` — 按学科筛选
- `?period=ancient` — 按时代筛选
- `?region=eastern` — 按地区筛选
- `?page=1&limit=20` — 分页

### 4.3 著作 API

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | `/api/v1/works` | 著作列表 | 无 |
| GET | `/api/v1/works/:id` | 著作详情 | 无 |
| GET | `/api/v1/wise-persons/:slug/works` | 智者关联著作 | 无 |

### 4.4 问题导览 API

| 方法 | 路径 | 描述 | 认证 | 关联 MAS |
|------|------|------|------|---------|
| GET | `/api/v1/questions` | 十大问题列表 | 无 | MS-L-05 |
| GET | `/api/v1/questions/:id` | 问题详情（含关联） | 无 | MS-L-05 |

### 4.5 书单 API

| 方法 | 路径 | 描述 | 认证 | 关联 MAS |
|------|------|------|------|---------|
| GET | `/api/v1/book-lists` | 书单列表 | 无 | MS-L-07 |
| GET | `/api/v1/book-lists/:id` | 书单详情（含著作） | 无 | MS-L-07 |

### 4.6 搜索 API

| 方法 | 路径 | 描述 | 认证 | 关联 MAS |
|------|------|------|------|---------|
| GET | `/api/v1/search` | 全文搜索（智者+著作） | 无 | MS-L-06 |
| GET | `/api/v1/search/suggestions` | 实时搜索建议 | 无 | MS-L-06 |

**参数：** `?q=keyword&type=all&page=1&limit=20`

### 4.7 收藏 API

| 方法 | 路径 | 描述 | 认证 | 关联 MAS |
|------|------|------|------|---------|
| POST | `/api/v1/bookmarks` | 添加收藏 | 必需 | MS-G-03 |
| DELETE | `/api/v1/bookmarks/:id` | 取消收藏 | 必需 | MS-G-03 |
| GET | `/api/v1/bookmarks` | 收藏列表 | 必需 | MS-G-03 |

### 4.8 书评 API

| 方法 | 路径 | 描述 | 认证 | 关联 MAS |
|------|------|------|------|---------|
| POST | `/api/v1/reviews` | 创建书评/笔记 | 必需 | MS-L-08 |
| GET | `/api/v1/reviews` | 书评列表 | 无 | MS-G-04 |
| GET | `/api/v1/reviews/:id` | 书评详情 | 无 | MS-G-04 |
| PUT | `/api/v1/reviews/:id` | 编辑书评 | 必需 | MS-G-04 |
| DELETE | `/api/v1/reviews/:id` | 删除书评 | 必需 | MS-G-04 |
| GET | `/api/v1/works/:id/reviews` | 著作下的书评列表 | 无 | MS-L-08 |

### 4.9 AI 助手 API

| 方法 | 路径 | 描述 | 认证 | 关联 MAS |
|------|------|------|------|---------|
| POST | `/api/v1/ai/chat` | AI 对话（流式） | 必需 | MS-L-09 |
| POST | `/api/v1/ai/recommend` | 获取个性化推荐 | 必需 | MS-L-09 |

### 4.10 用户中心 API

| 方法 | 路径 | 描述 | 认证 | 关联 MAS |
|------|------|------|------|---------|
| GET | `/api/v1/user/profile` | 用户资料 | 必需 | MS-G-05 |
| PUT | `/api/v1/user/profile` | 更新资料 | 必需 | — |
| GET | `/api/v1/user/history` | 浏览历史 | 必需 | MS-G-05 |

### 4.11 管理后台 API

| 方法 | 路径 | 描述 | 认证 / 角色 |
|------|------|------|-------------|
| GET | `/api/v1/admin/stats` | 平台统计 | 管理员 |
| GET | `/api/v1/admin/reviews` | 待审核书评列表 | 管理员 |
| PUT | `/api/v1/admin/reviews/:id/status` | 审核书评（通过/驳回） | 管理员 |
| POST | `/api/v1/admin/wise-persons` | 创建/编辑智者 | 管理员 |
| POST | `/api/v1/admin/works` | 创建/编辑著作 | 管理员 |
| POST | `/api/v1/admin/book-lists` | 创建/编辑书单 | 管理员 |

---

## 5. 目录结构

```
wisepeople/
├── package.json
├── bun.lockb
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── drizzle.config.ts           # Drizzle ORM 配置
├── .env.local                  # 环境变量（gitignore）
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/           # 公开路由组
│   │   │   ├── page.tsx        # 首页
│   │   │   ├── layout.tsx      # 公开页面布局
│   │   │   ├── wise-persons/
│   │   │   │   ├── page.tsx    # 智者库列表页
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx  # 智者详情页
│   │   │   ├── works/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx  # 著作详情页
│   │   │   ├── questions/
│   │   │   │   ├── page.tsx    # 十大问题页
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx  # 问题导览页
│   │   │   ├── book-lists/
│   │   │   │   ├── page.tsx    # 书单列表页
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx  # 书单详情页
│   │   │   └── search/
│   │   │       └── page.tsx    # 搜索结果页
│   │   │
│   │   ├── (auth)/             # 认证路由组
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (authenticated)/    # 需登录路由组
│   │   │   ├── layout.tsx      # 带认证检查的布局
│   │   │   ├── profile/
│   │   │   │   └── page.tsx    # 个人中心
│   │   │   ├── bookmarks/
│   │   │   │   └── page.tsx    # 我的收藏
│   │   │   ├── reviews/
│   │   │   │   ├── page.tsx    # 我的书评
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx  # 写书评
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx  # 编辑书评
│   │   │   └── ai-chat/
│   │   │       └── page.tsx    # AI 对话助手
│   │   │
│   │   ├── admin/              # 管理后台
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx        # 管理首页（统计）
│   │   │   ├── reviews/
│   │   │   │   └── page.tsx    # 审核管理
│   │   │   ├── wise-persons/
│   │   │   │   ├── page.tsx    # 智者管理
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   └── book-lists/
│   │   │       └── page.tsx    # 书单管理
│   │   │
│   │   └── api/                # API 路由
│   │       └── v1/
│   │           ├── auth/
│   │           │   ├── register/route.ts
│   │           │   ├── login/route.ts
│   │           │   ├── logout/route.ts
│   │           │   └── session/route.ts
│   │           ├── wise-persons/
│   │           │   ├── route.ts          # GET 列表
│   │           │   ├── [slug]/route.ts   # GET 详情
│   │           │   └── categories/route.ts
│   │           ├── works/
│   │           │   ├── route.ts
│   │           │   └── [id]/
│   │           │       ├── route.ts
│   │           │       └── reviews/
│   │           │           └── route.ts
│   │           ├── questions/
│   │           │   ├── route.ts
│   │           │   └── [id]/route.ts
│   │           ├── book-lists/
│   │           │   ├── route.ts
│   │           │   └── [id]/route.ts
│   │           ├── search/
│   │           │   ├── route.ts
│   │           │   └── suggestions/route.ts
│   │           ├── bookmarks/
│   │           │   └── route.ts
│   │           ├── reviews/
│   │           │   ├── route.ts
│   │           │   └── [id]/route.ts
│   │           ├── ai/
│   │           │   ├── chat/route.ts
│   │           │   └── recommend/route.ts
│   │           ├── user/
│   │           │   ├── profile/
│   │           │   │   └── route.ts
│   │           │   └── history/
│   │           │       └── route.ts
│   │           └── admin/
│   │               ├── stats/route.ts
│   │               ├── reviews/
│   │               │   ├── route.ts
│   │               │   └── [id]/status/route.ts
│   │               ├── wise-persons/route.ts
│   │               ├── works/route.ts
│   │               └── book-lists/route.ts
│   │
│   ├── components/             # React 组件
│   │   ├── ui/                 # shadcn/ui 基础组件
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── toast.tsx
│   │   │   └── skeleton.tsx
│   │   ├── layout/             # 布局组件
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── nav-tabs.tsx
│   │   ├── wise-person/        # 智者相关组件
│   │   │   ├── wise-person-card.tsx
│   │   │   ├── wise-person-grid.tsx
│   │   │   ├── wise-person-detail.tsx
│   │   │   └── category-tabs.tsx
│   │   ├── work/               # 著作相关组件
│   │   │   ├── work-card.tsx
│   │   │   ├── work-list.tsx
│   │   │   └── work-detail.tsx
│   │   ├── question/           # 问题导览组件
│   │   │   ├── question-card.tsx
│   │   │   └── question-grid.tsx
│   │   ├── book-list/          # 书单组件
│   │   │   ├── book-list-card.tsx
│   │   │   └── book-list-detail.tsx
│   │   ├── search/             # 搜索组件
│   │   │   ├── search-box.tsx
│   │   │   ├── search-results.tsx
│   │   │   └── search-suggestions.tsx
│   │   ├── review/             # 书评组件
│   │   │   ├── review-editor.tsx
│   │   │   ├── review-card.tsx
│   │   │   └── review-list.tsx
│   │   ├── bookmark/           # 收藏相关
│   │   │   └── bookmark-button.tsx
│   │   ├── ai-chat/            # AI 对话
│   │   │   ├── chat-widget.tsx
│   │   │   ├── chat-message.tsx
│   │   │   └── chat-input.tsx
│   │   └── shared/             # 共享组件
│   │       ├── pagination.tsx
│   │       ├── empty-state.tsx
│   │       ├── loading.tsx
│   │       ├── error-state.tsx
│   │       └── source-badge.tsx  # 来源标注组件
│   │
│   ├── lib/                    # 工具库和配置
│   │   ├── db/
│   │   │   ├── schema/        # Drizzle 数据表定义
│   │   │   │   ├── index.ts
│   │   │   │   ├── users.ts
│   │   │   │   ├── wise-persons.ts
│   │   │   │   ├── works.ts
│   │   │   │   ├── questions.ts
│   │   │   │   ├── book-lists.ts
│   │   │   │   ├── reviews.ts
│   │   │   │   └── bookmarks.ts
│   │   │   ├── migrations/    # 数据库迁移文件
│   │   │   └── index.ts        # 数据库连接
│   │   ├── auth/               # Better Auth 配置
│   │   │   └── index.ts
│   │   ├── ai/                 # Vercel AI SDK 配置
│   │   │   └── index.ts
│   │   └── utils.ts            # 通用工具函数
│   │
│   ├── services/               # 业务逻辑层
│   │   ├── auth.service.ts
│   │   ├── wise-person.service.ts
│   │   ├── work.service.ts
│   │   ├── question.service.ts
│   │   ├── book-list.service.ts
│   │   ├── search.service.ts
│   │   ├── review.service.ts
│   │   ├── bookmark.service.ts
│   │   ├── ai-chat.service.ts
│   │   ├── user.service.ts
│   │   └── admin.service.ts
│   │
│   ├── actions/                # Server Actions
│   │   ├── auth.actions.ts
│   │   ├── review.actions.ts
│   │   ├── bookmark.actions.ts
│   │   └── ai.actions.ts
│   │
│   ├── hooks/                  # React Hooks
│   │   ├── use-wise-persons.ts
│   │   ├── use-search.ts
│   │   ├── use-bookmarks.ts
│   │   ├── use-reviews.ts
│   │   └── use-ai-chat.ts
│   │
│   ├── types/                  # TypeScript 类型定义
│   │   ├── wise-person.ts
│   │   ├── work.ts
│   │   ├── question.ts
│   │   ├── book-list.ts
│   │   ├── review.ts
│   │   ├── user.ts
│   │   └── api.ts
│   │
│   └── constants/              # 常量定义
│       ├── categories.ts       # 分类常量
│       ├── questions.ts        # 十大问题常量
│       └── index.ts
│
├── public/                     # 静态资源
│   ├── images/
│   └── favicon.ico
│
├── scripts/                    # 数据脚本
│   ├── seed.ts                 # 种子数据（智者和著作）
│   └── migrate.ts              # 数据库迁移
│
├── spec/                       # 规约文档
│   ├── pm/
│   │   ├── pr.spec.md
│   │   └── userstory.spec.md
│   └── dev/
│       └── sys.spec.md         # 本文档
│
├── .42cog/                     # 认知敏捷法
│   ├── meta/meta.md
│   ├── real/real.md
│   └── cog/cog.md
│
├── metadata.json
├── .gitignore
└── CLAUDE.md
```

---

## 6. 数据库模型

### 实体关系总览

```
users
├── id (UUID, PK)
├── email (unique)
├── password_hash
├── name
├── role (enum: user | admin)
├── created_at
└── updated_at

wise_persons
├── id (UUID, PK)
├── slug (unique)           # 用于 URL 的标识符
├── name (zh)
├── name_en
├── biography               # 生平简介
├── core_ideas              # 核心思想
├── category (学科分类)
├── period (时代分类)
├── region (地区分类)
├── portrait_url
├── source                  # 数据来源标注
├── created_at
└── updated_at

works
├── id (UUID, PK)
├── wise_person_id (FK → wise_persons)
├── title (zh)
├── title_original
├── description
├── recommendation         # 推荐语
├── isbn
├── publish_year
├── source                 # 数据来源标注
├── created_at
└── updated_at

questions
├── id (UUID, PK)
├── code (Q01-Q10, unique)
├── title (zh)
├── description
├── dimension (天|地|人)
├── sort_order
└── created_at

question_mappings
├── id (UUID, PK)
├── question_id (FK → questions)
├── wise_person_id (FK → wise_persons, nullable)
├── work_id (FK → works, nullable)
└── sort_order

book_lists
├── id (UUID, PK)
├── slug (unique)
├── title (zh)
├── description
├── type (minimum | theme | stage)
├── created_at
└── updated_at

book_list_items
├── id (UUID, PK)
├── book_list_id (FK → book_lists)
├── work_id (FK → works)
├── recommendation
├── sort_order
└── created_at

reviews
├── id (UUID, PK)
├── user_id (FK → users)
├── work_id (FK → works)
├── content (Markdown)
├── status (draft | pending | approved | rejected)
├── created_at
└── updated_at

bookmarks
├── id (UUID, PK)
├── user_id (FK → users)
├── target_type (wise_person | work | book_list)
├── target_id (UUID)
├── created_at
└── updated_at
```

### 索引策略

| 表 | 索引字段 | 用途 |
|---|---------|------|
| wise_persons | `category`, `period`, `region` | 分类筛选 |
| wise_persons | `slug` (unique) | URL 查找 |
| works | `wise_person_id` | 关联查询 |
| works | `isbn` (unique) | ISBN 查找 |
| questions | `code` (unique) | 编号查找 |
| reviews | `(work_id, status)` | 著作下的书评列表 |
| reviews | `(user_id, status)` | 用户的书评列表 |
| bookmarks | `(user_id, target_type)` | 用户收藏列表 |
| bookmarks | `(user_id, target_type, target_id)` (unique) | 防止重复收藏 |

---

## 7. 安全架构

### 安全层次

```
┌─────────────────────────────────────────────────┐
│             传输层安全 (Transport)                 │
│         HTTPS 强制 + HSTS 头 + CSP 策略           │
├─────────────────────────────────────────────────┤
│             认证层 (Authentication)               │
│         Better Auth（邮箱+密码 + Session）         │
│         bcrypt 密码哈希（成本因子 12）             │
├─────────────────────────────────────────────────┤
│             授权层 (Authorization)                │
│         RBAC（user / admin 角色）                 │
│         资源所有权验证（用户只能操作自己的数据）       │
├─────────────────────────────────────────────────┤
│             数据保护层 (Data Protection)           │
│         用户信息加密存储（AES-256-GCM）            │
│         Zod 输入验证（服务端+客户端）              │
│         参数化查询（Drizzle ORM 默认）             │
│         React 自动 XSS 防护                       │
└─────────────────────────────────────────────────┘
```

### 安全措施清单

| 领域 | 措施 | 实现方式 | 约束来源 |
|------|------|---------|---------|
| 传输安全 | HTTPS 强制 | EdgeOne Pages 默认 | — |
| 认证 | bcrypt 密码哈希 | Better Auth 内置 | — |
| 认证 | Session 管理 | Better Auth（HTTP-only cookie） | — |
| 授权 | 角色访问控制 | RoleGuard 中间件 | — |
| 授权 | 资源所有权 | 所有 API 校验 user_id | real.md 隐私保护 |
| 数据加密 | 用户信息加密 | AES-256-GCM | real.md 隐私保护 |
| 输入验证 | 服务端验证 | Zod schemas | — |
| SQL 安全 | 参数化查询 | Drizzle ORM | — |
| XSS 防护 | 输出转义 | React 默认 | — |
| 内容安全 | 来源标注 | 所有智者/著作数据标注来源 | real.md 版权合规 |
| 内容审核 | UGC 审核流程 | review.status 状态机 | real.md 内容审核 |
| AI 安全 | AI 回答标注 | "AI 生成，仅供参考"标注 | real.md 知识准确性 |

---

## 8. 技术决策记录

### ADR-001：技术栈选型

**状态：** 已采纳

**上下文：**
需要为智者网选择一个现代化、全栈 Web 框架，支持 SSR、API 路由、快速迭代。

**决策：**
- **全站框架：** Next.js 15（App Router）
- **CSS 框架：** Tailwind CSS
- **UI 组件库：** shadcn/ui
- **包管理器：** bun

**理由：**
- Next.js App Router 提供 SSR + API Routes 一体化，减少运维复杂度
- Tailwind CSS + shadcn/ui 提供原子化样式和高质量组件，加速 UI 开发
- bun 的包安装和脚本执行速度显著快于 npm/pnpm

**影响：**
- 正：开发效率高，部署简单（EdgeOne Pages 支持 SSR）
- 负：对 Next.js 生态绑定较强

---

### ADR-002：数据库选型

**状态：** 已采纳

**上下文：**
需要选择一个支持本地开发和生产部署的关系型数据库。

**决策：**
- **本地开发：** PostgreSQL（本地安装）
- **生产环境：** Neon（云端 PostgreSQL）

**理由：**
- Neon 提供 Serverless PostgreSQL，支持自动扩缩容
- 与本地 PostgreSQL 完全兼容，开发和生产环境一致
- 支持分支数据库，便于开发和测试

**影响：**
- 正：无需维护数据库服务器，按使用量付费
- 正：Drizzle ORM 与 PostgreSQL 深度集成
- 负：冷启动可能引入毫秒级延迟

---

### ADR-003：ORM 选型

**状态：** 已采纳

**上下文：** 需要一个类型安全、性能优秀的 ORM。

**决策：** 使用 Drizzle ORM

**理由：**
- 类型安全（与 TypeScript 深度集成）
- 轻量级，无魔法抽象，SQL 语义清晰
- 支持迁移、关系查询、全文搜索
- 与 Neon 和 EdgeOne Pages 兼容

**影响：**
- 正：类型安全 + 自动补全，开发体验好
- 负：生态系统相对于 Prisma 较小

---

### ADR-004：认证方案选型

**状态：** 已采纳

**上下文：** 需要支持邮箱注册登录、Session 管理、角色权限。

**决策：** 使用 Better Auth

**理由：**
- 专为 Next.js 设计，与 App Router 深度兼容
- 内置 Session 管理、邮箱密码认证
- 支持 RBAC 角色权限
- 轻量级，零配置即可使用

**影响：**
- 正：开箱即用，减少认证相关代码量
- 正：支持后续扩展 OAuth 登录
- 负：相对较新的库，文档和社区资源有限

---

### ADR-005：AI 集成方案

**状态：** 已采纳

**上下文：** 需要 AI 对话助手功能，支持流式输出和知识检索。

**决策：** 使用 Vercel AI SDK

**理由：**
- 与 Next.js 深度集成，原生支持流式输出（Streaming）
- 支持多模型切换（Claude / GPT-4）
- 内置工具调用和 RAG 模式
- 开源社区活跃

**影响：**
- 正：流式输出体验好，开发工作量小
- 正：后续可扩展多模型路由
- 负：对 Vercel 生态有一定依赖

---

### ADR-006：全文搜索方案

**状态：** 建议

**上下文：** 需要覆盖智者和著作的全文搜索，支持实时建议。

**决策思路：**

| 方案 | 优势 | 劣势 |
|------|------|------|
| PostgreSQL 全文搜索（内置） | 无需额外服务，Drizzle 支持 | 搜索质量有限，不支持中文分词优化 |
| Meilisearch | 速度快，支持中文，易部署 | 需要额外部署和维护 |
| Elasticsearch | 功能最强 | 运维复杂度高，对小型项目过重 |

**建议决策（MVP 阶段）：** 使用 **PostgreSQL 内置全文搜索**，后续根据搜索需求升级到 Meilisearch。

**影响：**
- 正：MVP 阶段无需额外基础设施
- 负：中文搜索效果可能不如专业搜索引擎

---

### ADR-007：搜索索引更新策略

**状态：** 已采纳

**上下文：** 智者和著作数据的搜索索引需要在数据更新时同步刷新。

**决策：**
- 使用数据库触发器或应用程序层的事件机制更新搜索索引
- 数据更新时，异步重建相关索引或更新索引字段
- MVP 阶段采用简单策略：每次写入时更新索引列（PostgreSQL tsvector）

**影响：**
- 正：实现简单，无需额外组件
- 负：写入性能有轻微影响

---

### ADR-008：内容审核流程

**状态：** 已采纳

**上下文：** 用户生成的书评和笔记需要经过审核才能公开可见（来自 real.md 约束）。

**决策：**
```
用户发布 → status: pending → 管理员审核
                              ├── 通过 → status: approved → 公开可见
                              └── 驳回 → status: rejected → 仅用户可见
```
- 审核流程通过 review.status 状态机实现
- 管理员在后台审核页面操作
- 用户可查看自己书评的审核状态

**影响：**
- 正：满足内容审核约束
- 负：内容发布有延迟

---

### ADR-009：AI 对话的知识来源标注

**状态：** 已采纳

**上下文：** AI 助手的回答需要引用平台内数据源，并标注"AI 生成，仅供参考"。

**决策：**
- AI 对话采用 RAG（检索增强生成）模式
- 每次对话时，先从 WisePerson 和 Work 数据中检索相关内容
- 检索结果作为上下文注入 AI 提示词
- AI 回答末尾自动追加"AI 生成，仅供参考"标注
- 回答中引用平台数据时标注信息来源

**影响：**
- 正：回答准确性和可信度提高
- 正：满足 real.md 知识准确性约束
- 负：对话延迟略有增加（检索耗时）

---

## 9. 质量检查清单

- [x] 架构模式（分层+模块化）适合智者网的需求规模
- [x] 10 个子系统职责清晰，相互依赖关系已定义
- [x] API 遵循 RESTful 规范，与用户故事映射一致
- [x] 目录结构支持 Next.js App Router 的最佳实践
- [x] 数据库模型覆盖全实体，索引策略合理
- [x] 安全架构满足 real.md 中的隐私保护约束
- [x] 内容审核流程满足 real.md 中的内容审核约束
- [x] AI 知识来源标注满足 real.md 中的知识准确性约束
- [x] 所有技术决策已记录为 ADR（9 项）

---

## 10. 与其他技能的集成

| 技能 | 关系 |
|------|------|
| product-requirements | 输入：需求驱动架构设计 |
| database-design | 输出：数据模型指导数据库实现 |
| coding | 输出：目录结构和 API 规范指导编码 |
| quality-assurance | 输出：安全架构和审核流程需求测试 |
| design-ui-design | 输出：组件目录结构指导 UI 实现 |
