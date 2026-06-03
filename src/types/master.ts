/** 单一发展阶段 */
export interface DevelopmentStage {
  /** 阶段名称 */
  name: string
  /** 年龄范围（如 "1-17"） */
  ageRange: string
  /** 起止年份（如 "1472-1489"） */
  years: string
  /** 持续年数 */
  duration: number
  /** 核心主题 */
  coreTheme: string
  /** 核心挑战 */
  coreChallenge: string
  /** 关键行动 */
  keyActions: string
  /** 认知升级 */
  cognitiveUpgrade: string
  /** 做对了什么 */
  didRight: string
  /** 做错了什么/局限 */
  didWrong: string
  /** 人生发展学评注 */
  advice?: string
  /** 优势发挥 */
  strengthUsed?: string
  /** 潜在风险 */
  potentialRisk?: string
}

/** 可迁移原则 */
export interface TransferablePrinciple {
  principle: string
  explanation: string
}

/** 可吸取教训 */
export interface Pitfall {
  lesson: string
  explanation: string
}

/** 单条参考资料 */
export interface Reference {
  /** 显示文本，如 "王守仁.《王文成公全书》" */
  label: string
  /** 可选链接 */
  url?: string
  /** 可选类别，如 "原始文献" "研究著作" */
  category?: string
}

/** 高手分析完整内容 */
export interface MasterContentEntry {
  /** 是否存在高手分析数据 */
  hasMasterAnalysis: boolean
  /** 发展阶段列表 */
  stages: DevelopmentStage[]
  /** 人生叙事 - markdown 全文 */
  narrative: string
  /** 可迁移原则 */
  transferablePrinciples: TransferablePrinciple[]
  /** 可吸取教训 */
  pitfalls: Pitfall[]
  /** 参考资料列表 */
  references: Reference[]
}
