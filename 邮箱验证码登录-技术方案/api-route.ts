// app/api/auth/[...all]/route.ts
// Better Auth 自动处理所有 /api/auth/* 路由

import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST } = toNextJsHandler(auth.handler)
