import { notFound } from "next/navigation"
import { wiseContent } from "@/data/wise-content"
import { mockWisePersons } from "@/lib/stores/mock-data"
import { getAllWisePersons } from "@/lib/data/wise-persons-combined"
import { getAuthorBooks } from "@/lib/data"
import { WisePersonDetailTabs } from "@/components/wise-person/WisePersonDetailTabs"
import { WisePersonStubDetail } from "@/components/wise-person/WisePersonStubDetail"
import type { WisePerson } from "@/types"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function WisePersonDetailPage({ params }: Props) {
  const { slug } = await params

  // 1. Try full-profile wise person
  const person = mockWisePersons.find((p) => p.slug === slug) as WisePerson | undefined

  if (person) {
    const content = wiseContent[slug]
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

  // 2. Try stub author from combined data
  const allPersons = getAllWisePersons()
  const stub = allPersons.find((p) => p.slug === slug && p.isStub)

  if (!stub) {
    notFound()
  }

  const books = getAuthorBooks(slug)

  return <WisePersonStubDetail person={stub} books={books} />
}
