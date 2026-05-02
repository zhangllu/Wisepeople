"use client"

import { useState } from "react"
import { useReviewStore, useAuthStore } from "@/lib/stores"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface ReviewEditorProps {
  workSlug: string
  workTitle: string
  onDone?: () => void
}

export function ReviewEditor({ workSlug, workTitle, onDone }: ReviewEditorProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const { addReview } = useReviewStore()
  const { user } = useAuthStore()

  const handlePublish = () => {
    if (!user) {
      toast("请先登录")
      return
    }
    if (!title.trim() || !content.trim()) {
      toast("请填写标题和内容")
      return
    }
    addReview({
      userId: user.id,
      userName: user.name,
      workSlug,
      workTitle,
      title: title.trim(),
      content: content.trim(),
      status: "pending_review",
    })
    toast("发布成功，等待审核")
    setTitle("")
    setContent("")
    onDone?.()
  }

  const handleSaveDraft = () => {
    if (!user || !content.trim()) return
    addReview({
      userId: user.id,
      userName: user.name,
      workSlug,
      workTitle,
      title: title.trim() || "无标题",
      content: content.trim(),
      status: "draft",
    })
    toast("已保存草稿")
  }

  return (
    <div className="space-y-3">
      <Input
        placeholder="书评标题"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-sm"
      />
      <Textarea
        placeholder="写下您的读书笔记或感想..."
        className="min-h-[150px] text-sm"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={handlePublish}>
          发布
        </Button>
        <Button size="sm" variant="outline" onClick={handleSaveDraft}>
          保存草稿
        </Button>
      </div>
    </div>
  )
}
