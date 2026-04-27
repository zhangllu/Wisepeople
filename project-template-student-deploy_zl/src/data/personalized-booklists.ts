export interface PersonalizedBookList {
  id: string
  title: string
  url: string
  description?: string
}

export const personalizedBookLists: PersonalizedBookList[] = [
  {
    id: "process-philosophy",
    title: "过程哲学",
    url: "https://www.douban.com/doulist/160795053/",
  },
  {
    id: "cognitive-agility",
    title: "认知敏捷法",
    url: "https://www.douban.com/doulist/162822151/",
  },
  {
    id: "poetry-new-difference",
    title: "诗的新异",
    url: "https://www.douban.com/doulist/161682766/",
    description: "陌生化等相关著作",
  },
  {
    id: "intentionality",
    title: "意向性",
    url: "https://www.douban.com/doulist/163190319/",
  },
  {
    id: "existentialism-authenticity",
    title: "道德哲学之存在主义及本真性",
    url: "https://www.douban.com/doulist/162534339/",
  },
  {
    id: "cognitive-narratology",
    title: "认知叙事学",
    url: "https://www.douban.com/doulist/160402999/",
  },
]
