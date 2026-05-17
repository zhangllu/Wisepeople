"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ROUTES } from "@/constants"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  const links = [
    { href: ROUTES.wisePersons, label: "智者库" },
    { href: ROUTES.wisePersonsUpdated, label: "已更新智者" },
    { href: ROUTES.questions, label: "十大问题" },
    { href: ROUTES.bookLists, label: "书单" },
    { href: ROUTES.profile, label: "个人中心" },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9">
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-60">
        <div className="flex flex-col gap-4 mt-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
