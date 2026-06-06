"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ROUTES } from "@/constants"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  const mainLinks = [
    { href: ROUTES.map, label: "知识地图" },
    { href: ROUTES.questions, label: "十大问题" },
    { href: ROUTES.bookLists, label: "书单" },
  ]

  const wisePersonLinks = [
    { href: ROUTES.wisePersons, label: "全部智者" },
    { href: ROUTES.femaleWisePersons, label: "女性智者" },
    { href: ROUTES.masters, label: "智者人生" },
  ]

  const dailyLinks = [
    { href: ROUTES.daily, label: "每日智者" },
    { href: ROUTES.fortune, label: "随机漫步" },
  ]

  const bottomLinks = [
    { href: ROUTES.story, label: "产品故事" },
    { href: ROUTES.profile, label: "个人中心" },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9">
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-60">
        <div className="flex flex-col gap-4 mt-8">
          {/* Main links */}
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-base font-medium text-foreground hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {/* 智者库 group */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground/60 px-1">智者库</span>
            {wisePersonLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors pl-4"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* 遇见智者 group */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground/60 px-1">遇见智者</span>
            {dailyLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors pl-4"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Bottom links */}
          <div className="border-t pt-3 flex flex-col gap-2">
            {bottomLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
