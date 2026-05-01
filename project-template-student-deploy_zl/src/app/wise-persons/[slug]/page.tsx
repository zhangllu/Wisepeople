"use client"

import { useParams, notFound } from "next/navigation"
import { useWisePersonStore } from "@/lib/stores"
import { WisePersonDetailTabs } from "@/components/wise-person/WisePersonDetailTabs"

export default function WisePersonDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { getWisePersonBySlug } = useWisePersonStore()

  const person = getWisePersonBySlug(slug)

  if (!person) {
    notFound()
  }

  return <WisePersonDetailTabs slug={slug} />
}
