import type { Metadata } from "next"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { ChatWidget } from "@/components/chat/ChatWidget"
import { Toaster } from "@/components/ui/sonner"
import { AuthInitializer } from "@/components/shared/AuthInitializer"

export const metadata: Metadata = {
  title: "智者网 - 为成年人打造的通识教育地图",
  description: "智者网是一个面向终身学习者的通识教育平台，围绕十大问题导览、智者库、代表作索引、最小限度书单四大板块，为您提供系统性构建跨学科知识框架的行动空间。",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh" className="h-full antialiased">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&family=Lora:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" />
        <script async crossOrigin="anonymous" src="https://tweakcn.com/live-preview.min.js" />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthInitializer>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatWidget />
          <Toaster />
        </AuthInitializer>
      </body>
    </html>
  )
}
