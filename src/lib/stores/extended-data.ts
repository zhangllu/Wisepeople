import type { WisePerson, Work } from "@/types"
import { mockWisePersons, mockWorks, mockQuestions } from "./mock-data"

// 新增智者：卡尔·马克思
export const karlMarx: WisePerson = {
  id: "wp-11",
  slug: "karl-marx",
  name: "卡尔·马克思",
  nameEn: "Karl Marx",
  summary: "德国哲学家、经济学家、革命家，马克思主义的创始人。其思想对20世纪的社会运动产生了深远影响。",
  biography: "卡尔·马克思（1818—1883）是德国哲学家、经济学家、革命家，马克思主义的创始人。他与恩格斯合著的《共产党宣言》和《资本论》深刻影响了20世纪的社会运动。",
  coreThoughts: "历史唯物主义：不是意识决定存在，而是社会存在决定意识。阶级斗争：至今一切社会的历史都是阶级斗争的历史。剩余价值：利润来自工人的剩余劳动。",
  era: "modern",
  discipline: "philosophy",
  region: "western",
  tags: ["马克思主义", "阶级斗争", "剩余价值"],
  works: [],
  relatedWisePersonSlugs: ["max-weber"],
  wikipediaLink: "https://zh.wikipedia.org/wiki/%E5%8D%A1%E5%B0%94%E5%B0%94%C2%E5%85%8B%C2%B7%E5%BC%80",
  personalIntroduction: "马克思是历史上最有影响力的思想家之一。他的阶级斗争理论和历史唯物主义彻底改变了我们理解社会的方式。在「如何理解社会」（Q05）这一维度，马克思提供了最犀利的分析工具：社会不是和谐的有机体，而是阶级斗争的战场；历史不是杂乱无章的事件串，而是生产方式演化的结果。",
  questionNumbers: [5],
  topicCodes: ["5.1"],
}

// 新增智者：马克斯·韦伯
export const maxWeber: WisePerson = {
  id: "wp-12",
  slug: "max-weber",
  name: "马克斯·韦伯",
  nameEn: "Max Weber",
  summary: "德国社会学家、哲学家、政治经济学家，社会学三大奠基人之一。以《新教伦理与资本主义精神》闻名。",
  biography: "马克斯·韦伯（1864—1920）是德国社会学家、哲学家、政治经济学家，社会学三大奠基人之一。他的《新教伦理与资本主义精神》探讨了文化因素（特别是宗教）如何塑造经济现实。",
  coreThoughts: "理性化：现代社会的核心趋势，用计算取代传统。新教伦理：新教伦理促进了资本主义精神的兴起。理想类型：社会科学的研究方法。科层制：现代组织的必然命运。",
  era: "modern",
  discipline: "sociology",
  region: "western",
  tags: ["社会学", "理性化", "新教伦理"],
  works: [],
  relatedWisePersonSlugs: ["karl-marx"],
  wikipediaLink: "https://zh.wikipedia.org/wiki/%E9%A9%AC%E5%85%8B%E6%96%AF%C2%B7%E9%9F%83%E4%BC%AF",
  personalIntroduction: "韦伯是社会学三大奠基人之一（与马克思、涂尔干并列）。他在「如何理解社会」（Q05）维度上的独特贡献在于：他既看到经济因素的重要性，也强调文化、宗教、观念的独立作用。《新教伦理与资本主义精神》展示了观念如何塑造经济现实，这对我们理解不同文明的差异具有重要意义。",
  questionNumbers: [5],
  topicCodes: ["5.1"],
}

// 新增智者：亚当·斯密
export const adamSmith: WisePerson = {
  id: "wp-13",
  slug: "adam-smith",
  name: "亚当·斯密",
  nameEn: "Adam Smith",
  summary: "苏格兰哲学家、经济学家，古典经济学创始人。以《国富论》《道德情操论》闻名。",
  biography: "亚当·斯密（1723—1790）是苏格兰哲学家、经济学家，古典经济学的创始人。他的《国富论》奠定了现代经济学的基础，《道德情操论》则探讨了人类道德判断的来源。",
  coreThoughts: "看不见的手：市场机制协调自利行为。同情心：人类有天然的同情能力。分工：提高生产力的关键。",
  era: "modern",
  discipline: "economics",
  region: "western",
  tags: ["古典经济学", "看不见的手", "同情心"],
  works: [],
  relatedWisePersonSlugs: ["karl-marx"],
  wikipediaLink: "https://zh.wikipedia.org/wiki/%E4%BA%9A%E5%BD%93%C2%B7%E6%96%AF%E6%96%AF",
  personalIntroduction: "亚当·斯密是古典经济学的创始人，但他也是道德哲学家。《国富论》中的「看不见的手」理论和《道德情操论》中的「同情心」理论共同构成了他对人性的完整理解。在「如何理解社会」（Q05）中，斯密提供了理解市场经济的基础：自利行为如何通过市场机制产生社会福利？市场经济需要什么道德基础？",
  questionNumbers: [5],
  topicCodes: ["5.2"],
}

// 新增著作
export const newWorks: Work[] = [
  {
    id: "w-7",
    slug: "das-kapital",
    title: "资本论",
    authorName: "马克思",
    summary: "马克思的代表作，系统阐述了剩余价值理论和资本主义经济危机理论。",
    description: "《资本论》是马克思的代表作，第一卷于1867年出版。书中系统阐述了剩余价值理论，揭示了资本主义剥削的秘密，论证了资本主义经济危机的必然性。",
    recommendation: "理解马克思主义经济学的核心著作。",
    genre: "monograph",
    category: "core",
  },
  {
    id: "w-8",
    slug: "communist-manifesto",
    title: "共产党宣言",
    authorName: "马克思、恩格斯",
    summary: "马克思主义的纲领性文件，阐述了阶级斗争理论和共产主义理想。",
    description: "《共产党宣言》是马克思和恩格斯合著的著作，发表于1848年。书中阐述了历史唯物主义的基本原理，提出了阶级斗争理论，号召「全世界无产者，联合起来！」",
    recommendation: "理解马克思主义的入门读物。",
    genre: "monograph",
    category: "core",
  },
  {
    id: "w-9",
    slug: "the-protestant-ethic",
    title: "新教伦理与资本主义精神",
    authorName: "马克斯·韦伯",
    summary: "韦伯的代表作，探讨新教伦理如何促进了资本主义精神的兴起。",
    description: "《新教伦理与资本主义精神》是马克斯·韦伯的代表作，发表于1904-1905年。韦伯在书中论证：加尔文主义的「天职」观念和入世禁欲主义，为资本主义精神的兴起提供了伦理基础。",
    recommendation: "理解文化因素如何影响经济发展的经典著作。",
    genre: "monograph",
    category: "core",
  },
  {
    id: "w-10",
    slug: "the-wealth-of-nations",
    title: "国富论",
    authorName: "亚当·斯密",
    summary: "亚当·斯密的代表作，古典经济学的奠基之作。",
    description: "《国富论》全名《国民财富的性质和原因的研究》，是亚当·斯密的代表作，发表于1776年。书中系统阐述了劳动价值论、分工理论和自由市场经济的重要性。",
    recommendation: "理解古典经济学的必读经典。",
    genre: "monograph",
    category: "core",
  },
  {
    id: "w-11",
    slug: "social-contract",
    title: "社会契约论",
    authorName: "卢梭",
    summary: "卢梭的代表作，阐述社会契约理论和人民主权思想。",
    description: "《社会契约论》是卢梭的代表作，发表于1762年。书中提出了「公意」理论和「人生而自由，却无往不在枷锁之中」的著名论断，深刻影响了现代民主思想。",
    recommendation: "理解现代政治哲学的必读经典。",
    genre: "monograph",
    category: "core",
  },
]

// 添加著作到智者
karlMarx.works = [newWorks[0], newWorks[1]]
maxWeber.works = [newWorks[2]]
adamSmith.works = [newWorks[3]]

// 更新卢梭的著作
const rousseau = {
  ...mockWisePersons.find(wp => wp.slug === "rousseau")!,
  works: [newWorks[4]],
}

// 导出扩展后的智者列表
export const extendedWisePersons: WisePerson[] = [
  ...mockWisePersons.filter(wp => wp.slug !== "rousseau"),
  rousseau,
  karlMarx,
  maxWeber,
  adamSmith,
]

// 导出扩展后的著作列表
export const extendedWorks: Work[] = [
  ...mockWorks,
  ...newWorks,
]

// 更新Q05的relatedWisePersonSlugs
const q05 = mockQuestions.find(q => q.code === "Q05")!
if (q05) {
  q05.relatedWisePersonSlugs = ["karl-marx", "max-weber", "adam-smith", "rousseau", "aristotle"]
}
