import { create } from "zustand"
import { persist } from "zustand/middleware"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@/types"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  initialize: () => Promise<void>
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  sendOTP: (email: string) => Promise<{ success: boolean; error?: string }>
  verifyOTP: (email: string, token: string) => Promise<boolean>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: true,

      initialize: async () => {
        try {
          const supabase = createClient()
          const { data: { session } } = await supabase.auth.getSession()

          if (session?.user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single()

            if (profile) {
              set({
                user: {
                  id: profile.id,
                  email: profile.email || "",
                  name: profile.name || "",
                  avatar: profile.avatar,
                  role: profile.role || "registered",
                  createdAt: profile.created_at,
                },
                isAuthenticated: true,
                loading: false,
              })
              return
            }
          }
        } catch (e) {
          console.error("Auth init error:", e)
        }
        set({ user: null, isAuthenticated: false, loading: false })
      },

      login: async (emailOrUsername: string, password: string) => {
        try {
          const supabase = createClient()

          // 判断输入的是邮箱还是用户名
          const isEmail = emailOrUsername.includes("@")
          let email = emailOrUsername

          if (!isEmail) {
            // 用户名登录：从 profiles 表查找对应的邮箱
            const { data: profile } = await supabase
              .from("profiles")
              .select("email")
              .eq("name", emailOrUsername)
              .maybeSingle()

            if (!profile?.email) return false
            email = profile.email
          }

          const { data, error } = await supabase.auth.signInWithPassword({ email, password })
          if (error || !data.user) return false

          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single()

          if (profile) {
            set({
              user: {
                id: profile.id,
                email: profile.email || "",
                name: profile.name || "",
                avatar: profile.avatar,
                role: profile.role || "registered",
                createdAt: profile.created_at,
              },
              isAuthenticated: true,
              loading: false,
            })
            return true
          }
        } catch (e) {
          console.error("Login error:", e)
        }
        return false
      },

      register: async (email: string, password: string, name: string) => {
        try {
          const supabase = createClient()
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name } },
          })
          if (error) return { success: false, error: error.message }
          if (!data.user) return { success: false, error: "注册失败，未获取到用户信息" }

          // 如果 signUp 返回了 session（邮箱验证关闭的情况），直接设置用户状态
          if (data.session) {
            // 等待 profile 触发器完成（最多重试 3 次）
            for (let i = 0; i < 3; i++) {
              const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", data.user.id)
                .single()

              if (profile) {
                set({
                  user: {
                    id: profile.id,
                    email: profile.email || "",
                    name: profile.name || "",
                    avatar: profile.avatar,
                    role: profile.role || "registered",
                    createdAt: profile.created_at,
                  },
                  isAuthenticated: true,
                  loading: false,
                })
                return { success: true }
              }
              // 等待 300ms 后重试（给触发器时间完成）
              await new Promise((r) => setTimeout(r, 300))
            }
            // profile 仍未创建，用 auth 元数据兜底
            set({
              user: {
                id: data.user.id,
                email: data.user.email || email,
                name: data.user.user_metadata?.name || name,
                role: "registered",
                createdAt: data.user.created_at || new Date().toISOString(),
              },
              isAuthenticated: true,
              loading: false,
            })
          }
          return { success: true }
        } catch (e) {
          console.error("Register error:", e)
          return { success: false, error: "注册失败，请重试" }
        }
      },

      sendOTP: async (email: string) => {
        try {
          const supabase = createClient()
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { shouldCreateUser: true },
          })
          if (error) return { success: false, error: error.message }
          return { success: true }
        } catch (e) {
          console.error("Send OTP error:", e)
          return { success: false, error: "发送验证码失败，请重试" }
        }
      },

      verifyOTP: async (email: string, token: string) => {
        try {
          const supabase = createClient()
          const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: "email",
          })
          if (error || !data.user) return false

          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single()

          if (profile) {
            set({
              user: {
                id: profile.id,
                email: profile.email || "",
                name: profile.name || "",
                avatar: profile.avatar,
                role: profile.role || "registered",
                createdAt: profile.created_at,
              },
              isAuthenticated: true,
              loading: false,
            })
            return true
          }

          // fallback to auth metadata
          set({
            user: {
              id: data.user.id,
              email: data.user.email || email,
              name: data.user.user_metadata?.name || email.split("@")[0],
              role: "registered",
              createdAt: data.user.created_at || new Date().toISOString(),
            },
            isAuthenticated: true,
            loading: false,
          })
          return true
        } catch (e) {
          console.error("Verify OTP error:", e)
          return false
        }
      },

      logout: async () => {
        try {
          const supabase = createClient()
          await supabase.auth.signOut()
        } catch (e) {
          console.error("Logout error:", e)
        }
        set({ user: null, isAuthenticated: false, loading: false })
      },
    }),
    {
      name: "wp-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
