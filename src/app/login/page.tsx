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
  const { login, sendOTP, verifyOTP } = useAuthStore()
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
        <CardContent>
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
