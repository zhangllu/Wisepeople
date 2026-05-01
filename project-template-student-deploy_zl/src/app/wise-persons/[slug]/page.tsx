import { notFound } from "next/navigation"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import rehypeStringify from "rehype-stringify"
import { wiseContent } from "@/data/wise-content"
import { mockWisePersons } from "@/lib/stores/mock-data"
import { WisePersonDetailTabs } from "@/components/wise-person/WisePersonDetailTabs"
import type { WisePerson } from "@/types"

async function renderMarkdown(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(rehypeStringify)
    .process(markdown)
  return String(file)
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function WisePersonDetailPage({ params }: Props) {
  const { slug } = await params

  const content = wiseContent[slug]
  const person = mockWisePersons.find((p) => p.slug === slug) as WisePerson | undefined

  if (!person) {
    notFound()
  }

  const [introduction, basicInfo, cognitiveStyle] = await Promise.all([
    content?.introduction ? renderMarkdown(content.introduction) : Promise.resolve(null),
    content?.basicInfo ? renderMarkdown(content.basicInfo) : Promise.resolve(null),
    content?.cognitiveStyle ? renderMarkdown(content.cognitiveStyle) : Promise.resolve(null),
  ])

  return (
    <WisePersonDetailTabs
      slug={slug}
      person={person}
      preloadedContent={{ introduction, basicInfo, cognitiveStyle }}
    />
  )
}
