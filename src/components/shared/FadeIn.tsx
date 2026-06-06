"use client"

import { useInView } from "@/hooks/use-in-view"
import { useRef } from "react"
import type { ReactNode } from "react"

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 })
  const revealed = useRef(false)
  if (isInView) revealed.current = true

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: revealed.current ? 1 : 0,
        transform: revealed.current ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease-out, transform 0.6s ease-out`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
