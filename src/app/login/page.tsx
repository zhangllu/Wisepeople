"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/lib/stores"
import { ROUTES } from "@/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { Mail, Lock, KeyRound, LogIn } from "lucide-react"

type LoginMode = "password" | "otp"

export default function LoginPage() {
  const router = useRouter()
  const { login, sendOTP, verifyOTP, signInWithOAuth } = useAuthStore()
  const [mode, setMode] = useState<LoginMode>("password")

  // 密码模式状态
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // OTP 模式状态
  const [otpEmail, setOtpEmail] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // OAuth 状态
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const startCountdown = () => {
    setCountdown(60)
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // 密码登录
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const success = await login(email, password)
    if (success) {
      toast("登录成功")
      router.push(ROUTES.explore)
    } else {
      setError("邮箱或密码错误，请重试")
      setLoading(false)
    }
  }

  // 发送验证码
  const handleSendOTP = async () => {
    if (!otpEmail) return
    setOtpLoading(true)
    const result = await sendOTP(otpEmail)
    setOtpLoading(false)
    if (result.success) {
      setOtpSent(true)
      startCountdown()
      toast("验证码已发送")
    } else {
      toast(result.error || "发送失败")
    }
  }

  // 验证码登录
  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpCode || otpCode.length < 4) return
    setOtpLoading(true)
    const success = await verifyOTP(otpEmail, otpCode)
    setOtpLoading(false)
    if (success) {
      toast("登录成功")
      router.push(ROUTES.explore)
    } else {
      toast("验证码错误或已过期")
    }
  }

  const switchMode = (newMode: LoginMode) => {
    setMode(newMode)
    setError("")
  }

  // OAuth 登录
  const handleOAuth = async (provider: "google" | "github") => {
    setOauthLoading(provider)
    try {
      await signInWithOAuth(provider)
      // 正常情况下会自动跳转，不需要到这里
    } catch (e: any) {
      console.error(`OAuth ${provider} failed:`, e)
      toast(`使用 ${provider === "google" ? "Google" : "GitHub"} 登录失败，请检查 Supabase 配置`)
    } finally {
      setOauthLoading(null)
    }
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-16">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>登录智者网</CardTitle>
          <CardDescription>欢迎回来，继续您的通识探索之旅</CardDescription>

          {/* 模式切换 */}
          <div className="mt-4 flex rounded-lg border p-0.5 bg-muted/50">
            <button
              type="button"
              onClick={() => switchMode("password")}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                mode === "password"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Lock className="h-3.5 w-3.5" />
              密码登录
            </button>
            <button
              type="button"
              onClick={() => switchMode("otp")}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                mode === "otp"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <KeyRound className="h-3.5 w-3.5" />
              验证码登录
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {/* OAuth 按钮 */}
          <div className="space-y-2 mb-4">
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              disabled={oauthLoading !== null}
              className="w-full flex items-center justify-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {oauthLoading === "google" ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              {oauthLoading === "google" ? "跳转中..." : "使用 Google 账号登录"}
            </button>
            <button
              type="button"
              onClick={() => handleOAuth("github")}
              disabled={oauthLoading !== null}
              className="w-full flex items-center justify-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {oauthLoading === "github" ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              )}
              {oauthLoading === "github" ? "跳转中..." : "使用 GitHub 账号登录"}
            </button>
          </div>

          {/* 分隔线 */}
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">或者</span>
            </div>
          </div>

          {mode === "password" ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱 / 用户名</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="邮箱或用户名"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "登录中..." : "登录"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOTPSubmit} className="space-y-4">
              {/* 邮箱输入 */}
              <div className="space-y-2">
                <Label htmlFor="otp-email">邮箱</Label>
                <div className="flex gap-2">
                  <Input
                    id="otp-email"
                    type="email"
                    placeholder="请输入邮箱"
                    value={otpEmail}
                    onChange={(e) => setOtpEmail(e.target.value)}
                    required
                    disabled={otpSent}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSendOTP}
                    disabled={!otpEmail || otpLoading || countdown > 0}
                    className="shrink-0"
                  >
                    {countdown > 0 ? `${countdown}s` : otpLoading ? "发送中..." : "发送验证码"}
                  </Button>
                </div>
              </div>

              {/* 验证码输入 */}
              {otpSent && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Label htmlFor="otp-code">验证码</Label>
                  <Input
                    id="otp-code"
                    type="text"
                    inputMode="numeric"
                    placeholder="请输入 6 位验证码"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    autoFocus
                    maxLength={6}
                    className="text-center text-lg tracking-[0.5em]"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    验证码已发送至 {otpEmail}
                    {countdown > 0 ? (
                      <span className="ml-1">（{countdown}s 后可重新发送）</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        className="ml-1 text-accent hover:underline"
                      >
                        重新发送
                      </button>
                    )}
                  </p>
                </div>
              )}

              {otpSent && (
                <Button type="submit" className="w-full" disabled={otpLoading || otpCode.length < 4}>
                  {otpLoading ? "验证中..." : "登录"}
                </Button>
              )}
            </form>
          )}

          <div className="mt-4 text-center text-xs">
            <Link href={ROUTES.forgotPassword} className="text-muted-foreground hover:text-accent transition-colors">
              忘记密码？
            </Link>
          </div>
          <div className="mt-2 text-center text-xs text-muted-foreground">
            还没有账号？{" "}
            <Link href={ROUTES.register} className="text-accent hover:underline">
              注册
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
