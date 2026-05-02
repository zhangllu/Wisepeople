"use client"

import Link from "next/link"
import { useAuthStore } from "@/lib/stores"
import { ROUTES } from "@/constants"
import { Button } from "@/components/ui/button"

export function AuthButtons() {
  const { isAuthenticated, user, logout } = useAuthStore()

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2">
        <Link href={ROUTES.profile}>
          <Button variant="ghost" size="sm" className="text-xs">
            {user.name}
          </Button>
        </Link>
        <Button variant="outline" size="sm" className="text-xs" onClick={logout}>
          退出
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={ROUTES.login}>
        <Button variant="ghost" size="sm" className="text-xs">
          登录
        </Button>
      </Link>
      <Link href={ROUTES.register}>
        <Button size="sm" className="text-xs">
          注册
        </Button>
      </Link>
    </div>
  )
}
