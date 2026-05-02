# Claude Code 项目配置文件

## 项目信息

**项目名称**: 智者网 (Wisepeople)
**项目类型**: 通识教育网站
**主要语言**: 中文

## 开发环境

### 个人环境配置
- **设备**: 搭载 Apple 芯片的 Mac 电脑
- **Node.js 管理**: 通过 bun 进行安装管理
- **Python 环境**: 通过 uv 进行配置
- **Git 代码托管平台**: cnb.cool

### 技术栈

#### 前端技术
- **框架**: Next.js (React)
- **语言**: TypeScript/JavaScript
- **样式**: Tailwind CSS 或 CSS Modules
- **包管理器**: bun

#### 后端/脚本技术
- **Python 环境**: uv (现代 Python 包管理器)
- **脚本**: 用于数据处理和自动化任务

## 开发规范

### Git 工作流

1. **分支管理**
   - `main` 分支: 主分支，保护分支
   - `feature/*` 分支: 新功能开发
   - `fix/*` 分支: Bug 修复
   - `docs/*` 分支: 文档更新

2. **Commit 规范**
   - 使用清晰、简洁的提交信息
   - 格式: `类型: 描述`
   - 类型包括: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

3. **代码托管平台**: cnb.cool
   - 所有代码推送至 cnb.cool 远程仓库
   - 使用 Pull Request 进行代码审查

### 代码规范

#### JavaScript/TypeScript
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 优先使用函数式编程和 React Hooks
- 组件命名使用 PascalCase
- 变量和函数使用 camelCase

#### Python
- 遵循 PEP 8 编码规范
- 使用类型提示 (Type Hints)
- 函数和变量使用 snake_case
- 类名使用 PascalCase

### 版本管理

本项目采用 **语义版本号管理 (Semantic Versioning)** 规范，格式为 `v主版本号.次版本号.补丁版本号`（例如：v1.2.3）。

#### 版本号递增规则

当前最新版本：**v0.0.1**

1. **补丁版本 (Patch) 递增** (v0.0.1 → v0.0.2)
   - 错误修复（Bug 修复）
   - 小的改进和优化
   - 文档更新
   - Claude Code 自动处理：任何提交后自动递增

2. **次版本号 (Minor) 递增** (v0.0.x → v0.1.0)
   - 新增功能（向后兼容）
   - 新增的 API 接口
   - 重要的功能改进

3. **主版本号 (Major) 递增** (v0.x.x → v1.0.0)
   - 不兼容的 API 更改
   - 重大架构重构
   - 项目里程碑发布

#### Tag 管理规则

- **首次提交**: 创建初始标签 **v0.0.1**
- **自动递增**: Claude Code 在每次提交代码后，自动将补丁版本号递增 0.0.1 位
- **手动标记**: 对于重大功能发布或主版本更新，需手动标记为 v0.1.0 或 v1.0.0
- **推送标签**: 每次创建标签后，使用 `git push origin <tag-name>` 推送到远程

#### 创建和推送 Tag 命令

```bash
# 创建新标签（Claude Code 自动执行）
git tag v0.0.2

# 推送标签到远程
git push origin v0.0.2

# 查看所有标签
git tag -l

# 查看标签信息
git show v0.0.2
```

### 项目结构

```
Wisepeople/
├── CLAUDE.md                      # Claude Code 配置文件
├── .gitignore                     # Git 忽略文件
├── src/                           # Next.js 源代码
├── 智者资料库/                    # 智者 Markdown 数据文件
├── scripts/                       # 构建脚本
├── public/                        # 静态资源
├── package.json                   # 依赖配置
├── next.config.ts                 # Next.js 配置
├── vercel.json                    # Vercel 部署配置
├── CONTRIBUTING.md                # 贡献指南
├── tsconfig.json                  # TypeScript 配置
└── bun.lock                       # 依赖锁文件
```

## 开发命令

### 安装依赖
```bash
# 安装 Node.js 依赖
bun install

# 安装 Python 依赖
uv pip install -r requirements.txt
```

### 开发环境
```bash
# 启动 Next.js 开发服务器
bun run dev

# 构建项目
bun run build

# 运行 Python 脚本
uv run python scripts/脚本名.py
```

## 项目目标

本项目旨在创建一个通识教育网站「智者网」，包括：
- 智者资料库展示
- 认知方式分析
- 书单系统
- 通识教育内容

## Claude Code 使用规范

1. **语言要求**: 所有沟通和代码注释使用中文
2. **代码审查**: 重要更改需要 Claude Code 进行代码审查
3. **文档更新**: 功能开发完成后更新相关文档
4. **测试**: 交付前确保代码通过基本测试
5. **Markdown 格式规范**: 输出或创建的所有 `.md` 文件，段落和章节之间**不使用 `---` 横线分隔符**，章节层次通过标题（`#` `##` `###`）来区分

## 注意事项

- 本项目为教育用途，专注于通识教育领域
- 所有文档和代码注释使用中文
- 保持代码简洁，遵循 KISS 原则
- 定期提交代码，避免大量未提交的更改
- 保护敏感信息，不要将 API 密钥、密码等提交到版本控制
