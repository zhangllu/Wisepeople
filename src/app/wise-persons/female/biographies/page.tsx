import fs from "fs"
import path from "path"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ROUTES } from "@/constants"
import type { Components } from "react-markdown"

export default function FemaleBiographiesPage() {
  const filePath = path.join(process.cwd(), "智者资料库", "伟大的女性传记.md")
  let content = fs.readFileSync(filePath, "utf-8")

  // Convert **bold** to <strong>bold</strong> for Chinese punctuation compatibility
  content = content.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")

  const components: Components = {
    h2: ({ children, ...rest }) => (
      <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b" {...rest}>
        {children}
      </h2>
    ),
    h3: ({ children, ...rest }) => (
      <h3 className="text-lg font-bold text-gray-800 mt-8 mb-3" {...rest}>
        {children}
      </h3>
    ),
    p: ({ children, ...rest }) => (
      <p className="text-sm text-gray-700 leading-relaxed mb-4" {...rest}>
        {children}
      </p>
    ),
    ul: ({ children, ...rest }) => (
      <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1 mb-4" {...rest}>
        {children}
      </ul>
    ),
    ol: ({ children, ...rest }) => (
      <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-1 mb-4" {...rest}>
        {children}
      </ol>
    ),
    li: ({ children, ...rest }) => (
      <li className="leading-relaxed" {...rest}>
        {children}
      </li>
    ),
    hr: () => <hr className="my-8 border-gray-200" />,
    blockquote: ({ children, ...rest }) => (
      <blockquote className="border-l-4 border-primary/30 pl-4 py-1 my-4 text-sm text-muted-foreground italic" {...rest}>
        {children}
      </blockquote>
    ),
    table: ({ children, ...rest }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full text-sm border-collapse border border-gray-200" {...rest}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...rest }) => (
      <th className="border border-gray-200 bg-gray-50 px-3 py-2 text-left font-medium" {...rest}>
        {children}
      </th>
    ),
    td: ({ children, ...rest }) => (
      <td className="border border-gray-200 px-3 py-2" {...rest}>
        {children}
      </td>
    ),
    a: ({ href, children, ...rest }) => {
      const isExternal = href?.startsWith("http")
      if (isExternal) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" {...rest}>
            {children}
          </a>
        )
      }
      return (
        <a href={href} className="text-primary hover:underline" {...rest}>
          {children}
        </a>
      )
    },
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Back link */}
      <Link
        href={ROUTES.femaleWisePersons}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        返回女性智者
      </Link>

      <div className="prose prose-sm max-w-none">
        <ReactMarkdown
          remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
          rehypePlugins={[rehypeRaw]}
          components={components}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
