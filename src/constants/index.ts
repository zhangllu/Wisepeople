import type { CategoryOption, Era, Discipline, Region } from "@/types"

// 路由路径
export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  wisePersons: "/wise-persons",
  wisePersonDetail: (slug: string) => `/wise-persons/${slug}`,
  daily: "/daily",
  questions: "/questions",
  questionDetail: (id: string) => `/questions/${id}`,
  bookLists: "/book-lists",
  bookListDetail: (id: string) => `/book-lists/${id}`,
  topics: "/topics",
  topicDetail: (code: string) => `/topics/${code}`,
  search: "/search",
  fortune: "/fortune",
  profile: "/profile",
  bookmarks: "/profile/bookmarks",
  reviews: "/profile/reviews",
} as const

// 平台名称
export const SITE_NAME = "智者网"
export const SITE_TAGLINE = "为成年人打造的通识教育地图"
export const SITE_DESCRIPTION = "智者网是一个面向终身学习者的通识教育平台，围绕十大问题导览、智者库、代表作索引、最小限度书单四大板块，为您提供系统性构建跨学科知识框架的行动空间。"

// 分类筛选选项
export const ERA_OPTIONS: CategoryOption[] = [
  { id: "all", label: "全部时代", value: "all" },
  { id: "ancient", label: "古代智者", value: "ancient" },
  { id: "modern", label: "近现代智者", value: "modern" },
  { id: "contemporary", label: "当代学者", value: "contemporary" },
]

export const DISCIPLINE_OPTIONS: CategoryOption[] = [
  { id: "all", label: "全部学科", value: "all" },
  { id: "philosophy", label: "哲学", value: "philosophy" },
  { id: "science", label: "科学", value: "science" },
  { id: "literature", label: "文学", value: "literature" },
  { id: "social-science", label: "社会科学", value: "social-science" },
  { id: "art", label: "艺术", value: "art" },
  { id: "education", label: "教育", value: "education" },
  { id: "history", label: "历史", value: "history" },
  { id: "psychology", label: "心理学", value: "psychology" },
]

export const REGION_OPTIONS: CategoryOption[] = [
  { id: "all", label: "全部地区", value: "all" },
  { id: "eastern", label: "东方", value: "eastern" },
  { id: "western", label: "西方", value: "western" },
]

// 维度标签
export const DIMENSION_LABELS: Record<string, string> = {
  meta: "元",
  heaven: "天",
  earth: "地",
  human: "人",
}

// 学科标签映射
export const DISCIPLINE_LABELS: Record<Discipline, string> = {
  philosophy: "哲学",
  science: "科学",
  literature: "文学",
  "social-science": "社会科学",
  art: "艺术",
  education: "教育",
  history: "历史",
  psychology: "心理学",
  sociology: "社会学",
  economics: "经济学",
}

// 时代标签映射
export const ERA_LABELS: Record<Era, string> = {
  ancient: "古代",
  modern: "近现代",
  contemporary: "当代",
}

// 地区标签映射
export const REGION_LABELS: Record<Region, string> = {
  eastern: "东方",
  western: "西方",
}
