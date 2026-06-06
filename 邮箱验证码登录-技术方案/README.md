# 邮箱验证码登录（OTP）技术方案

> 基于 Better Auth + Resend SMTP，实现邮箱验证码登录
> 源自项目：Ask Kelly（教学设计辅助工具）

---

## 技术栈

| 组件 | 方案 |
|------|------|
| 认证框架 | Better Auth v1.6.9 |
| OTP 插件 | `better-auth/plugins/email-otp` |
| 邮件发送 | nodemailer + Resend SMTP |
| 适配器 | PostgreSQL (Drizzle ORM) |
| 前端框架 | Next.js (App Router) |
| 包管理 | bun |

---

## 实现步骤

### 1. 安装依赖

```bash
bun add better-auth @better-auth/drizzle-adapter nodemailer
bun add -d drizzle-kit drizzle-orm @neondatabase/serverless @types/nodemailer
```

### 2. 配置环境变量 (`.env.local`)

```env
# Better Auth
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-here

# SMTP（Resend）
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASS=re_xxxxxxxxxxxx  # Resend API Key
SMTP_FROM=noreply@your-domain.com
SMTP_SECURE=true

# 数据库
DATABASE_URL=postgres://...
```

### 3. 服务端 Auth 配置

**`src/lib/auth.ts`**：

```typescript
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "@better-auth/drizzle-adapter"
import { emailOTP } from "better-auth/plugins/email-otp"
import { db } from "@/db"
import * as schema from "@/db/schema"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,       // 同时支持密码登录
    autoSignIn: true,
  },
  plugins: [
    emailOTP({
      sendVerificationOTP: async ({ email, otp, type }) => {
        // 开发环境打印到控制台，不真实发送
        if (process.env.NODE_ENV === "development") {
          console.log(`[OTP] ${type}: ${email} → ${otp}`)
          return
        }
        // 生产环境调用邮件发送函数
        await sendOTPEmail({ email, otp, type })
      },
      otpLength: 6,        // 6 位验证码
      expiresIn: 300,       // 5 分钟过期
      allowedAttempts: 3,   // 最多尝试 3 次
      disableSignUp: false, // 允许新用户注册
    }),
  ],
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
})
```

### 4. 邮件发送函数

**`src/lib/email.ts`**：

```typescript
import nodemailer from "nodemailer"

const smtpConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_PASS)

const transport = smtpConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE !== "false",
      auth: {
        user: process.env.SMTP_USER || "resend",
        pass: process.env.SMTP_PASS || "",
      },
    })
  : null

const fromAddress = process.env.SMTP_FROM || "noreply@your-domain.com"

export async function sendOTPEmail(params: {
  email: string
  otp: string
  type: "sign-in" | "email-verification" | "forget-password" | "change-email"
}) {
  const { email, otp, type } = params

  if (!transport) {
    console.log(`[OTP] ${type}: ${email} → ${otp}`)
    return
  }

  const subjectMap = {
    "sign-in": "登录验证码",
    "email-verification": "邮箱验证码",
    "forget-password": "重置密码验证码",
    "change-email": "修改邮箱验证码",
  }

  const html = `
    <div style="max-width:480px;margin:0 auto;padding:24px;font-family:sans-serif">
      <h2 style="text-align:center;color:#333">你的验证码</h2>
      <div style="text-align:center;margin:24px 0">
        <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#4f46e5">${otp}</span>
      </div>
      <p style="color:#999;font-size:12px">验证码 5 分钟内有效，请勿泄露给他人。</p>
    </div>
  `

  await transport.sendMail({
    from: fromAddress,
    to: email,
    subject: subjectMap[type],
    html,
  })
}
```

### 5. 客户端 Auth 配置

**`src/lib/auth-client.ts`**：

```typescript
import { createAuthClient } from "better-auth/react"

const baseURL = typeof window !== "undefined"
  ? window.location.origin
  : (process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000")

export const authClient = createAuthClient({ baseURL })

export const { signIn, signUp, signOut, useSession } = authClient
```

### 6. API 路由（Better Auth 自动生成）

Better Auth 会自动处理以下端点，无需手动编写：

- `POST /api/auth/email-otp/send-verification-otp`
  - Body: `{ email, type: "sign-in" }`
  - 触发 `sendVerificationOTP` 回调
- `POST /api/auth/sign-in/email-otp`
  - Body: `{ email, otp }`
  - 校验验证码并登录

只需在 `app/api/auth/[...all]/route.ts` 中暴露路由：

```typescript
import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST } = toNextJsHandler(auth.handler)
```

### 7. 登录页前端实现

关键逻辑（简化版，完整源码见 `login/page.tsx`）：

```tsx
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const router = useRouter()

  // 发送验证码
  const handleSendOtp = async () => {
    setLoading(true)
    const res = await fetch("/api/auth/email-otp/send-verification-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, type: "sign-in" }),
    })
    const data = await res.json()
    if (!res.ok || data.error) {
      toast.error(data.error || "发送失败")
      setLoading(false)
      return
    }
    setOtpSent(true)
    setLoading(false)
  }

  // 验证码登录
  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch("/api/auth/sign-in/email-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    })
    const data = await res.json()
    if (!res.ok || data.error) {
      toast.error(data.error || "登录失败")
      setLoading(false)
      return
    }
    router.push("/chat")  // 登录成功后跳转
  }

  return (
    <form onSubmit={handleOtpLogin}>
      <input
        type="email" value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="邮箱" required
      />
      {otpSent && (
        <input
          type="text" inputMode="numeric"
          value={otp}
          onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="验证码" required
        />
      )}
      {!otpSent ? (
        <button type="button" onClick={handleSendOtp} disabled={loading}>
          发送验证码
        </button>
      ) : (
        <button type="submit" disabled={loading || otp.length < 6}>
          登录
        </button>
      )}
    </form>
  )
}
```

---

## 数据库

Better Auth 配合 Drizzle ORM 自动创建用户表。需要先运行：

```bash
bun run db:generate  # 生成迁移
bun run db:migrate   # 执行迁移
```

---

## Resend 注册

1. 打开 [resend.com](https://resend.com) 注册账号
2. 在 API Keys 页面创建一个 API Key
3. 在 Domains 页面验证你的发件域名
4. 将 API Key 填入 `SMTP_PASS` 环境变量

---

## 流程总结

```
用户输入邮箱 → 点击"发送验证码"
  → POST /api/auth/email-otp/send-verification-otp
  → Better Auth 生成 6 位 OTP
  → sendVerificationOTP 回调调用 nodemailer
  → Resend SMTP 发送邮件 → 用户收到验证码

用户输入验证码 → 点击"登录"
  → POST /api/auth/sign-in/email-otp
  → Better Auth 校验 OTP
  → 校验通过 → 创建 session → 返回 token
  → 前端跳转到登录后页面
```

---

## 参考来源

- Ask Kelly 项目 (`/Users/zhanglu/Desktop/Ask Kelly`)
- Better Auth 文档: https://www.better-auth.com
- Resend SMTP: https://resend.com
