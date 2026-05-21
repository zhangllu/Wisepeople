import fs from "fs"
import path from "path"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import type { Components } from "react-markdown"

const ORIGINAL_URL = "https://mp.weixin.qq.com/s/vCqfb8Yi4cCDt4KIXd_csQ"

export default function StoryPage() {
  const filePath = path.join(
    process.cwd(),
    "也许是史上最强书单！通识千书：来自 420 位智者的 1000+本代表作.md",
  )
  let content = fs.readFileSync(filePath, "utf-8")

  // --- Preprocess: clean up raw content ---

  // Remove the "备注" line
  content = content.replace(
    "备注：如何提高阅读能力？点击阅读原文，即可购买《聪明的阅读者》一书。",
    "",
  )

  // Remove "网址为：www.yangzhiping.com/books/reader/1000books.pdf"
  content = content.replace(
    "网址为：www.yangzhiping.com/books/reader/1000books.pdf",
    "",
  )

  // Remove empty markdown links like [](url)
  content = content.replace(/\[\]\(https?:\/\/[^\s)]+\)/g, "")

  // Extract article title from the first h1
  const titleMatch = content.match(/^# (.+)$/m)
  const articleTitle = titleMatch ? titleMatch[1] : ""

  // Remove the header block: # title + blank + **作者：** 阳志平 + 阳志平 + blank + ---
  content = content.replace(
    /^# .+\n\n\*\*作者：\*\*\s*阳志平\n阳志平\n\n---\n/,
    "",
  )

  // Convert **bold** to <strong>bold</strong> to avoid markdown parser issues
  // (especially with Chinese punctuation next to ** markers)
  content = content.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")

  // --- ReactMarkdown component overrides ---

  // Strip bold/italic: render as plain text
  const components: Components = {
    h2: ({ children, ...rest }) => (
      <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4" {...rest}>
        {children}
      </h2>
    ),
    h3: ({ children, ...rest }) => (
      <h3 className="text-lg font-bold text-gray-800 mt-8 mb-3" {...rest}>
        {children}
      </h3>
    ),
    p: ({ children, ...rest }) => (
      <p className="leading-[1.8] text-[15px] text-gray-800 mb-4" {...rest}>
        {children}
      </p>
    ),
    hr: () => <div className="border-t border-gray-200/70 my-8" />,
    ul: ({ children, ...rest }) => (
      <ul className="list-disc pl-6 text-[15px] text-gray-800 leading-[1.8] mb-4 space-y-1" {...rest}>
        {children}
      </ul>
    ),
    ol: ({ children, ...rest }) => (
      <ol className="list-decimal pl-6 text-[15px] text-gray-800 leading-[1.8] mb-4 space-y-1" {...rest}>
        {children}
      </ol>
    ),
    li: ({ children, ...rest }) => (
      <li className="text-[15px] text-gray-800" {...rest}>
        {children}
      </li>
    ),
    em: ({ children }) => <>{children}</>,
    a: ({ children, href, ...rest }) => {
      if (!children || (Array.isArray(children) && children.every((c) => !c))) {
        return null
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline underline-offset-2"
          {...rest}
        >
          {children}
        </a>
      )
    },
    img: () => null,
    blockquote: ({ children, ...rest }) => (
      <blockquote className="border-l-4 border-amber-300 bg-amber-100/50 pl-4 py-2 my-4 text-[15px] text-gray-700 leading-[1.8]" {...rest}>
        {children}
      </blockquote>
    ),
    code: ({ children, ...rest }) => (
      <code className="bg-gray-100 rounded px-1 text-sm" {...rest}>
        {children}
      </code>
    ),
  }

  return (
    <div className="min-h-screen bg-amber-50/40">
      <div className="mx-auto px-6 py-12" style={{ maxWidth: "820px" }}>
        {/* Page title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">产品故事</h1>
        <div className="text-sm text-gray-500 mb-8 leading-relaxed space-y-2">
          <p>
            【智者网】的数据来源于阳志平老师 2023 年出版的《聪明的阅读者》第十一章——「通识千书：智者的代表作」。
          </p>
          <p>
            我个人深深受益于阳老师提出的「师法智者」的理念，因此设计开发了【智者网】这个开源网站，希望普及给更多的人。
          </p>
          <p>
            以下文章是阳老师本人在他的公众号「心智工具箱」发布的正式介绍。
          </p>
        </div>

        {/* Article title block */}
        <div className="mb-6 pb-4 border-b border-gray-200/70">
          <h2 className="text-2xl font-bold text-gray-900 leading-snug">
            {articleTitle}
          </h2>
          <p className="mt-3 text-sm text-gray-400">
            作者：阳志平
          </p>
        </div>

        {/* Article content */}
        <article className="space-y-4">
          <ReactMarkdown remarkPlugins={[[remarkGfm, { singleTilde: false }]]} rehypePlugins={[rehypeRaw]} components={components}>
            {content}
          </ReactMarkdown>
        </article>

        {/* Read original article */}
        <div className="mt-12 text-center">
          <a
            href={ORIGINAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-amber-700 hover:text-amber-900 transition-colors border border-amber-300 rounded-lg px-4 py-2 hover:bg-amber-100/50"
          >
            阅读原文 →
          </a>
        </div>

        {/* Source credit */}
        <div className="mt-8 pt-8 border-t border-gray-200/70">
          <p className="text-sm text-gray-400 text-center leading-relaxed">
            本文来源：阳志平老师的个人公众号「心智工具箱」
          </p>
        </div>
      </div>
    </div>
  )
}
