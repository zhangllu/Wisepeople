import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ChatMessage } from "@/types"
import { mockWisePersons, mockWorks } from "./mock-data"

interface ChatState {
  messages: ChatMessage[]
  isStreaming: boolean
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
}

// 模拟 AI 回复生成
function generateMockResponse(query: string): string {
  const queryLower = query.toLowerCase()

  // 检测关键词并返回相关回复
  if (queryLower.includes("柏拉图") || queryLower.includes("理想国") || queryLower.includes("理念")) {
    const plato = mockWisePersons.find((p) => p.slug === "plato")
    return `${plato?.name}（${plato?.nameEn}）是古希腊最著名的哲学家之一，西方哲学的奠基人。\n\n他的核心思想是**理念论**（Theory of Forms），认为我们感官所感知的物质世界只是对永恒不变的"理念世界"的不完美模仿。真正的知识不在于对现象世界的认识，而在于对理念世界的把握。\n\n代表作《理想国》中，柏拉图构建了一个由"哲人王"统治的理想城邦，探讨了正义、教育、艺术等根本问题。这本书被认为是西方哲学史上最重要的著作之一。\n\n**推荐阅读：**\n- 《理想国》（必读经典）\n- 《柏拉图对话录》`
  }

  if (queryLower.includes("康德") || queryLower.includes("纯粹理性")) {
    const kant = mockWisePersons.find((p) => p.slug === "immanuel-kant")
    return `${kant?.name}（${kant?.nameEn}，1724-1804）是德国古典哲学的创始人。\n\n他在哲学史上发动了一场"哥白尼式革命"：不是知识必须符合对象，而是对象必须符合我们的认识形式。这一思想彻底改变了人们对知识与实在之间关系的理解。\n\n康德的《纯粹理性批判》考察了人类理性的能力与界限，区分了"现象"与"物自体"——我们只能认识现象世界，物自体是不可知的。\n\n**推荐阅读：**\n- 《纯粹理性批判》\n- 《实践理性批判》\n- 《判断力批判》`
  }

  if (queryLower.includes("达尔文") || queryLower.includes("进化") || queryLower.includes("物种起源")) {
    return `查尔斯·达尔文（Charles Darwin，1809-1882）是英国博物学家，进化论的奠基人。\n\n他在《物种起源》中提出了**自然选择**（Natural Selection）理论：\n1. 生物个体之间存在变异\n2. 有利变异有助于个体在生存竞争中存活\n3. 这些有利特征会遗传给后代\n4. 长期积累导致新物种的形成\n\n这一理论彻底改变了人类对生命演化的理解，被恩格斯誉为"19世纪自然科学的三大发现"之一。\n\n**推荐阅读：**\n- 《物种起源》\n- 《人类的由来》`
  }

  if (queryLower.includes("老子") || queryLower.includes("道德经") || queryLower.includes("道家")) {
    return `老子（约公元前6世纪）是中国古代哲学家，道家学派的创始人。\n\n他的《道德经》仅五千余字，却包含了极其深邃的哲学智慧：\n- **道可道，非常道**：终极的"道"无法用语言完全表达\n- **无为而治**：不妄为，顺应自然规律\n- **上善若水**：最高的善像水一样，利万物而不争\n- **祸福相依**：对立面相互转化\n\n老子的思想不仅深刻影响了中国传统文化，也吸引了海德格尔等西方哲学家的关注。\n\n**推荐阅读：**\n- 《道德经》（多种译本可供对照）\n- 《庄子》`
  }

  // 默认回复
  return `感谢您的提问。智者网收录了 420 位跨越人类文明史的智者，涵盖哲学、科学、文学、社会科学等多个领域。\n\n您可以通过以下方式继续探索：\n1. **浏览智者库**：按学科或时代浏览所有智者\n2. **查看书单**：从"最小限度书单"开始您的阅读之旅\n3. **搜索**：直接搜索您感兴趣的智者或著作\n4. **十大问题导览**：从您关心的问题出发，找到相关的智者和著作\n\n有什么具体的方向或问题我可以进一步帮您解答吗？`
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isStreaming: false,

      sendMessage: async (content: string) => {
        // 添加用户消息
        const userMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: "user",
          content,
          timestamp: new Date().toISOString(),
        }
        set({ messages: [...get().messages, userMsg], isStreaming: true })

        // 模拟延迟和流式效果
        await new Promise((r) => setTimeout(r, 800))

        // 生成 AI 回复
        const reply = generateMockResponse(content)
        const aiMsg: ChatMessage = {
          id: `msg-${Date.now()}-reply`,
          role: "assistant",
          content: reply,
          sources: [
            { title: "智者网知识库", url: "/wise-persons" },
            { title: "关于本平台" },
          ],
          timestamp: new Date().toISOString(),
        }
        set({ messages: [...get().messages, aiMsg], isStreaming: false })
      },

      clearMessages: () => set({ messages: [] }),
    }),
    { name: "wp-chat" }
  )
)
