"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot } from "lucide-react"
import { useChatStore } from "@/lib/stores"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const { messages, isStreaming, sendMessage, clearMessages } = useChatStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || isStreaming) return
    sendMessage(input.trim())
    setInput("")
  }

  return (
    <>
      {/* FAB Button */}
      {!open && (
        <Button
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg z-50"
          onClick={() => setOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] border rounded-lg shadow-xl bg-background z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold">AI 助手</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={clearMessages}>
                <span className="text-xs">清空</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea ref={scrollRef} className="flex-1 p-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-xs text-muted-foreground">
                <Bot className="h-10 w-10 mb-2 text-muted-foreground/30" />
                <p>您好！我是智者网的 AI 助手</p>
                <p className="mt-1">可以问我关于智者、著作或书单的问题</p>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-xs whitespace-pre-wrap">{msg.content}</p>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 pt-1 border-t border-border/40">
                      <p className="text-[10px] opacity-60">来源</p>
                      {msg.sources.map((s, i) => (
                        <span key={i} className="text-[10px] opacity-60 block">
                          {s.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isStreaming && (
              <div className="flex justify-start mb-3">
                <div className="bg-muted rounded-lg p-3">
                  <span className="text-xs animate-pulse">思考中...</span>
                </div>
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="p-3 border-t flex gap-2">
            <Input
              placeholder="输入您的问题..."
              className="h-9 text-xs"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isStreaming}
            />
            <Button size="icon" className="h-9 w-9 shrink-0" onClick={handleSend} disabled={isStreaming || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="px-3 pb-2 text-[10px] text-muted-foreground/50">
            AI 生成，仅供参考
          </div>
        </div>
      )}
    </>
  )
}
