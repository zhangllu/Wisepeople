// 核心实体类型定义

export interface WisePerson {
  id: string
  slug: string
  name: string
  nameEn?: string
  portrait?: string
  summary: string
  biography: string
  coreThoughts: string
  era: Era
  discipline: Discipline
  region: Region
  tags: string[]
  works: Work[]
  relatedWisePersonSlugs: string[]
  /** Mark as a stub author from the Excel data (limited info) */
  isStub?: boolean
  /** Book slugs for this wise person (from Excel) */
  bookSlugs?: string[]
  /** Topic codes this person is associated with */
  topicCodes?: string[]
  /** 维基百科链接 */
  wikipediaLink?: string
  /** 多来源链接（如个人档案馆、Google Scholar、学会页面等） */
  links?: WisePersonLink[]
  /** 个性化介绍（待更新） */
  personalIntroduction?: string
  /** 关联的大问题编号（1-10），用于按问题分类展示 */
  questionNumbers?: number[]
}

export type Era = "ancient" | "modern" | "contemporary"
export type Discipline = "philosophy" | "science" | "literature" | "social-science" | "art" | "education" | "history" | "psychology" | "sociology" | "economics"
export type Region = "eastern" | "western"

export interface Work {
  id: string
  slug: string
  title: string
  authorName: string
  isbn?: string
  summary: string
  description: string
  recommendation: string
  genre: WorkGenre
  category: WorkCategory
  coverImage?: string
}

/** 链接来源 */
export interface WisePersonLink {
  label: string
  url: string
  description?: string
}

export type WorkGenre = "monograph" | "anthology" | "paper"
export type WorkCategory = "core" | "extended"

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: UserRole
  createdAt: string
}

export type UserRole = "visitor" | "registered" | "contributor" | "admin"

export interface Question {
  id: string
  code: string // Q01-Q10
  number: number // 1-10
  title: string
  subtitle: string
  summary: string
  dimension: Dimension
  subTopicCodes: string[] // list of sub-topic codes, e.g. ["1.1", "1.2", ...]
  relatedWisePersonSlugs: string[]
  relatedWorkSlugs: string[]
}

export type Dimension = "meta" | "heaven" | "earth" | "human"

/** Book entity from the 通识千书 Excel data */
export interface Book {
  id: number
  slug: string
  title: string
  author: string
  authorSlug: string
  year: number | null
  publisher: string
  doubanLink: string
  topicCode: string
  tags: string
}

/** Author entity from the Excel data (778 unique authors) */
export interface Author {
  slug: string
  name: string
  bookSlugs: string[]
  topicCodes: string[]
}

/** Sub-topic (主题) within a big question */
export interface SubTopic {
  code: string // e.g. "1.1", "2.3"
  title: string // e.g. "总论", "进化论与复杂科学"
  coreField: string
  representativeDiscipline: string
  questionNumber: number
}

/** Minimum book list entry (56 books with summaries) */
export interface MinimumBook {
  isbn: string
  title: string
  author: string
  slug: string
  translator: string
  publisher: string
  doubanLink: string
  tagClass: string
  summary: string
}

export interface BookList {
  id: string
  slug: string
  title: string
  summary: string
  description: string
  type: BookListType
  bookSlugs: string[]
  workSlugs: string[]
  coverImage?: string
}

export type BookListType = "minimum" | "theme" | "stage"

export interface Category {
  id: string
  code: string
  name: string
  type: "discipline" | "era" | "region"
  children?: Category[]
}

export interface Review {
  id: string
  userId: string
  userName: string
  workSlug: string
  workTitle: string
  title: string
  content: string
  status: ReviewStatus
  createdAt: string
  updatedAt: string
}

export type ReviewStatus = "draft" | "pending_review" | "approved" | "rejected"

export interface Bookmark {
  id: string
  userId: string
  targetId: string
  targetType: "wise-person" | "book-list" | "work" | "book"
  createdAt: string
}

export interface SearchResult {
  wisePersons: WisePerson[]
  works: Work[]
  books: Book[]
  query: string
  totalCount: number
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  sources?: { title: string; url?: string }[]
  timestamp: string
}

// 分类 Tab 选项
export interface CategoryOption {
  id: string
  label: string
  value: string
}

/** Dimension metadata for the 天地人 framework */
export interface DimensionInfo {
  key: Dimension
  label: string
  labelCn: string
  description: string
  questionCodes: string[]
}
