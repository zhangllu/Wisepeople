import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/types"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, _password: string) => {
        // Mock 登录：匹配预设账户或 demo 账户
        if (email === "demo@wisepeople.cn" || email === "test@wisepeople.cn") {
          set({
            user: {
              id: "u-demo-001",
              email,
              name: email === "demo@wisepeople.cn" ? "Demo用户" : "测试用户",
              role: "registered",
              createdAt: new Date().toISOString(),
            },
            isAuthenticated: true,
          })
          return true
        }
        return false
      },

      register: async (email: string, _password: string, name: string) => {
        set({
          user: {
            id: `u-${Date.now()}`,
            email,
            name,
            role: "registered",
            createdAt: new Date().toISOString(),
          },
          isAuthenticated: true,
        })
        return true
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
    }),
    { name: "wp-auth" }
  )
)
