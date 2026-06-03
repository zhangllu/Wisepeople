"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ReferenceSection } from "@/components/master/ReferenceSection"
import type { Reference } from "@/types/master"

interface Props {
  narrative: string
  references?: Reference[]
}

export function LifeNarrative({ narrative, references }: Props) {
  if (!narrative) {
    return (
      <p className="text-muted-foreground py-8 text-center">
        人生叙事内容暂未完善
      </p>
    )
  }

  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-4 border-blue-400 bg-blue-50/50 py-2 px-4 my-4 rounded-r-lg"
              {...props}
            >
              {children}
            </blockquote>
          ),
          h2: ({ children, ...props }) => (
            <h2
              className="text-lg font-bold mt-8 mb-3 pb-1 border-b border-gray-200"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-base font-bold mt-6 mb-2" {...props}>
              {children}
            </h3>
          ),
          ul: ({ children, ...props }) => (
            <ul className="space-y-1.5 my-3" {...props}>
              {children}
            </ul>
          ),
          li: ({ children, ...props }) => (
            <li className="leading-relaxed" {...props}>
              {children}
            </li>
          ),
          strong: ({ children, ...props }) => (
            <strong className="font-bold text-gray-900" {...props}>
              {children}
            </strong>
          ),
        }}
      >
        {narrative}
      </ReactMarkdown>
      <ReferenceSection references={references ?? []} />
    </div>
  )
}
