import { createAuthClient } from "better-auth/react"

// 浏览器端使用当前 origin，服务端渲染时 fallback
const baseURL = typeof window !== "undefined"
  ? window.location.origin
  : (process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000")

export const authClient = createAuthClient({
  baseURL,
})

export const { signIn, signUp, signOut, useSession } = authClient
