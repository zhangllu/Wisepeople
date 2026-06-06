"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { ROUTES } from "@/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [recoveryMode, setRecoveryMode] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    // Listen for PASSWORD_RECOVERY event (triggered when user lands via reset link)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setRecoveryMode(true)
      }
    })

    // Also check if the session is already established (e.g. after page reload)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setRecoveryMode(true)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致")
      return
    }
    if (password.length < 6) {
      setError("密码至少需要 6 个字符")
      return
    }

    setLoading(true)
    setError("")

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }

      // Sign out after password reset so user logs in with new password
      await supabase.auth.signOut()

      toast("密码修改成功，请使用新密码登录")
      router.push(ROUTES.login)
    } catch {
      setError("修改失败，请重试")
      setLoading(false)
    }
  }

  if (!recoveryMode) {
    return (
      <div className="container mx-auto max-w-md px-4 py-16">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>重置密码</CardTitle>
            <CardDescription>
              正在验证您的身份，请稍候...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="py-8 text-sm text-muted-foreground">
              验证中...
            </div>
            <p className="text-xs text-muted-foreground">
              如果长时间没有响应，请尝试{" "}
              <Link href={ROUTES.forgotPassword} className="text-accent hover:underline">
                重新发送
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-16">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>重置密码</CardTitle>
          <CardDescription>请输入您的新密码</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">新密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="至少 6 个字符"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认新密码</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="再次输入新密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "修改中..." : "确认修改"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
