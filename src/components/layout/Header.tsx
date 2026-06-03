import Link from "next/link"
import { ROUTES, SITE_NAME } from "@/constants"
import { SearchBox } from "@/components/search/SearchBox"
import { AuthButtons } from "@/components/shared/AuthButtons"
import { MobileNav } from "@/components/layout/MobileNav"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <MobileNav />
          <Link href={ROUTES.home} className="flex items-center gap-1.5">
            <span className="text-lg font-bold tracking-tight text-primary">{SITE_NAME}</span>
          </Link>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href={ROUTES.wisePersons} className="text-muted-foreground hover:text-foreground transition-colors">
            智者库
          </Link>
          <Link href={ROUTES.masters} className="text-muted-foreground hover:text-foreground transition-colors">
            高手库
          </Link>
          <Link href={ROUTES.daily} className="text-muted-foreground hover:text-foreground transition-colors">
            遇见智者
          </Link>
          <Link href={ROUTES.fortune} className="text-muted-foreground hover:text-foreground transition-colors">
            随机漫步
          </Link>
          <Link href={ROUTES.questions} className="text-muted-foreground hover:text-foreground transition-colors">
            十大问题
          </Link>
          <Link href={ROUTES.bookLists} className="text-muted-foreground hover:text-foreground transition-colors">
            书单
          </Link>
          <Link href={ROUTES.story} className="text-muted-foreground hover:text-foreground transition-colors">
            产品故事
          </Link>
          <Link href={ROUTES.profile} className="text-muted-foreground hover:text-foreground transition-colors">
            个人中心
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <SearchBox />
          <AuthButtons />
        </div>
      </div>
    </header>
  )
}
