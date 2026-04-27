---
name: wisepeople-cog
description: 智者网（WisePeople）认知模型文档
version: 1.0.0
created: 2026-04-27
depends: real.md
---

# 智者网（WisePeople）- 认知模型文档

<meta>
  <document-id>wisepeople-cog</document-id>
  <version>1.0.0</version>
  <project>智者网（WisePeople）</project>
  <type>Cognitive Model</type>
  <created>2026-04-27</created>
  <depends>real.md</depends>
</meta>

## 文档目的

基于"智能体 + 信息 + 上下文"框架，定义智者网的实体体系与核心关系，帮助 AI 理解项目中的关键信息结构。

---

## 1. 智能体 (Agents)

<agents>

### 1.1 人类智能体

<agent type="human" id="A1">
<name>普通用户</name>
<identifier>邮箱 + UUID</identifier>
<classification>
  <by-role>浏览者 | 注册读者 | 内容贡献者</by-role>
</classification>
<capabilities>浏览智者库、阅读推荐书单、做笔记、收藏书单、撰写书评</capabilities>
<goals>系统性构建跨学科知识框架，从知识消费者转变为智慧创作者</goals>
</agent>

<agent type="human" id="A2">
<name>内容管理员</name>
<identifier>邮箱 + UUID + admin 标识</identifier>
<classification>
  <by-role>编辑 | 审核员 | 超级管理员</by-role>
</classification>
<capabilities>审核智者和著作信息、管理用户内容、更新推荐书单</capabilities>
<goals>确保平台内容准确可靠，维护知识质量</goals>
</agent>

### 1.2 AI 智能体

<agent type="ai" id="A3">
<name>AI 推荐助手</name>
<identifier>系统内置 - Vercel AI SDK</identifier>
<classification>
  <by-model>Claude | GPT-4</by-model>
</classification>
<interaction-pattern>用户提问 → 分析意图 → 检索数据 → 生成推荐/回答</interaction-pattern>
</agent>

</agents>

---

## 2. 信息 (Information)

<information>

### 2.1 核心实体

<cog>
本系统包括以下关键实体：
- wise_person：智者
- work：著作
- user：用户
- question：导览问题
- book_list：书单
- category：知识分类
- review：书评/笔记
</cog>

<wise_person>
- 唯一编码：按入选年份+姓名拼音生成的 slug，例如 yang-zhiping
- 常见分类：按时代分（古代智者、近现代智者、当代学者）；按学科分（哲学家、科学家、文学家、社会学家）
</wise_person>

<work>
- 唯一编码：ISBN 或 book-作者拼音-书名拼音
- 常见分类：按体裁分（专著、文集、论文）；按推荐级别分（核心代表作、延伸阅读）
</work>

<user>
- 唯一编码：注册时生成的 UUID
- 常见分类：浏览者（未登录）；注册用户（已登录）；内容贡献者（发表过书评/笔记）
</user>

<question>
- 唯一编码：问题编号，如 Q01-Q10
- 常见分类：按维度分（天、地、人）；十个具体问题方向
</question>

<book_list>
- 唯一编码：list-类型-序号，如 list-minimum-50
- 常见分类：最小限度书单；主题书单；阶段推荐书单
</book_list>

<category>
- 唯一编码：学科分类编号，如 CAT-PHILOSOPHY
- 常见分类：一级学科；二级学科；跨学科标签
</category>

<review>
- 唯一编码：review-用户ID-著作ID
- 常见分类：短评；读书笔记；深度解读
</review>

### 2.2 信息流

<information-flow>
<flow id="F1" name="知识探索流程">
  用户 → 选择导览问题/搜索智者 → 系统检索智者库 → 返回智者信息与代表作 → 用户浏览并收藏/记笔记
</flow>

<flow id="F2" name="推荐生成流程">
  用户 → 描述阅读偏好 → AI 推荐助手分析 → 匹配书单和智者 → 返回个性化推荐
</flow>

<flow id="F3" name="内容审核流程">
  内容贡献者 → 提交书评/笔记 → 系统通知管理员 → 管理员审核 → 发布或退回
</flow>
</information-flow>

</information>

---

## 3. 上下文 (Context)

<context>

### 3.1 应用场景
Web 应用（PC + 移动端响应式），面向终身学习者的通识教育平台。

### 3.2 技术上下文
- Next.js 15 App Router 全栈架构，PostgreSQL 数据库，EdgeOne Pages 托管部署
- 数据安全：用户信息加密，传输使用 HTTPS，API 路由鉴权
- AI 集成：基于 Vercel AI SDK 连接 Claude/GPT-4 提供智能推荐

### 3.3 用户体验上下文
- 安静、专注的阅读氛围设计
- 内容优先，减少视觉干扰
- 鼓励深度阅读和创作，而非碎片化消费

</context>

---

## 4. 权重矩阵

<weights>
| 实体 | 重要性 | 说明 |
|------|--------|------|
| wise_person | 最高 | 平台核心资产，420 位智者构成内容骨架 |
| work | 最高 | 一千余本代表作为阅读核心资源 |
| question | 高 | 十大问题导览是用户入口 |
| user | 高 | 用户增长和参与度决定平台生命力 |
| book_list | 中 | 辅助用户决策，降低选择门槛 |
| category | 中 | 分类体系支撑导航和推荐 |
| review | 低→中 | UGC 内容的长期价值积累 |
</weights>

---

## 5. 验证清单

- [x] 所有核心实体已定义唯一编码
- [x] 所有核心实体已定义分类方式
- [x] 实体关系已映射（rel 标签）
- [x] 信息流已描述（3 条核心流程）
- [x] 尊重 real.md 中的版权合规约束
- [x] 尊重 real.md 中的隐私保护约束
