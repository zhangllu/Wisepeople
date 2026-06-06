import Link from "next/link"
import { ROUTES, SITE_NAME } from "@/constants"
import { SearchBox } from "@/components/search/SearchBox"
import { AuthButtons } from "@/components/shared/AuthButtons"
import { MobileNav } from "@/components/layout/MobileNav"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <MobileNav />
          <Link href={ROUTES.map} className="flex items-center gap-1.5">
            <span className="text-lg font-bold tracking-tight text-accent">{SITE_NAME}</span>
          </Link>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href={ROUTES.map} className="nav-link">
            知识地图
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground transition-colors text-sm cursor-pointer">
              智者库
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem render={<Link href={ROUTES.wisePersons} />}>
                全部智者
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href={ROUTES.femaleWisePersons} />}>
                女性智者
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href={ROUTES.masters} />}>
                智者人生
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground transition-colors text-sm cursor-pointer">
              书单
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem render={<Link href={ROUTES.bookLists} />}>
                通识书单
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href={ROUTES.bookListDetail("minimum-56")} />}>
                最小限度书单
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href={ROUTES.topicDetail("0")} />}>
                元典十三经
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground transition-colors text-sm cursor-pointer">
              遇见智者
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem render={<Link href={ROUTES.daily} />}>
                每日智者
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href={ROUTES.fortune} />}>
                随机漫步
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href={ROUTES.questions} className="nav-link">
            十大问题
          </Link>

          <Link href={ROUTES.profile} className="nav-link">
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
