"use client"

import { useRouter } from "next/navigation"
import { useState, useCallback } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants"

export function SearchBox() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [expanded, setExpanded] = useState(false)

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (query.trim()) {
        router.push(`${ROUTES.search}?q=${encodeURIComponent(query.trim())}`)
        setExpanded(false)
      }
    },
    [query, router]
  )

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className={`flex items-center gap-0 transition-all duration-200 ${expanded ? "md:w-64" : "md:w-auto"}`}>
        <Input
          type="search"
          placeholder="搜索全站内容..."
          className={`h-8 text-xs w-0 md:w-40 md:focus:w-64 transition-all duration-200 ${
            expanded ? "!w-40 md:!w-64" : "hidden md:block"
          }`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setExpanded(true)}
          onBlur={() => !query && setExpanded(false)}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 md:hidden"
          onClick={() => setExpanded(!expanded)}
        >
          <Search className="h-4 w-4" />
        </Button>
        <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 hidden md:inline-flex">
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
