import { notFound } from "next/navigation"
import { wiseContent } from "@/data/wise-content"
import { mockWisePersons } from "@/lib/stores/mock-data"
import { WisePersonDetailTabs } from "@/components/wise-person/WisePersonDetailTabs"
import type { WisePerson } from "@/types"

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

  return (
    <WisePersonDetailTabs
      slug={slug}
      person={person}
      preloadedContent={{
        introduction: content?.introduction ?? null,
        basicInfo: content?.basicInfo ?? null,
        cognitiveStyle: content?.cognitiveStyle ?? null,
      }}
    />
  )
}
