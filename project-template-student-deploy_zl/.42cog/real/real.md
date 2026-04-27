---
name: wisepeople-real
description: 智者网（WisePeople）现实约束文档
version: 1.0.0
created: 2026-04-27
---

# 智者网（WisePeople）- 现实约束文档

<meta>
  <document-id>wisepeople-real</document-id>
  <version>1.0.0</version>
  <project>智者网（WisePeople）</project>
  <type>Reality Constraints</type>
  <created>2026-04-27</created>
</meta>

## 文档目的

本文档定义了智者网项目开发中必须遵守的硬性约束，涵盖版权合规、用户隐私、内容质量、知识准确性等方面，确保项目在法律合规和数据安全的前提下运行。

<constraints>

<real>
- 智者和著作数据必须标注来源，涉及《聪明的阅读者》的内容须遵守引用规范，不得侵犯阳志平老师及原出版社的著作权
- 用户个人信息（邮箱、阅读记录、收藏等）必须加密存储，符合《个人信息保护法》
- 智者介绍和著作推荐信息必须经过人工审核确认，确保知识准确性，避免误导用户
- 用户生成内容（书评、笔记、讨论）须建立审核机制，防止不当信息传播
</real>

</constraints>

## 技术环境

<environment>
<stack>
- 前端: Next.js 15 + Tailwind CSS + shadcn/ui + TypeScript
- 运行时: Bun
- 数据库: PostgreSQL (Neon)
- ORM: Drizzle ORM
- 认证: Better Auth
- AI SDK: Vercel AI SDK (Claude / GPT-4)
- 部署: EdgeOne Pages
</stack>
</environment>

## 约束清单

- [x] 版权合规：智者和著作数据标注来源，引用规范
- [x] 隐私保护：用户个人信息加密存储
- [x] 内容审核：智者与著作信息人工审核；UGC 内容审核机制
- [x] 知识准确性：确保推荐信息和书目的可靠性
