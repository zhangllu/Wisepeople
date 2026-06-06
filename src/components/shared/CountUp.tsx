"use client"

import { useEffect, useState } from "react"
import { useInView } from "@/hooks/use-in-view"

interface CountUpProps {
  end: number
  duration?: number
  className?: string
}

export function CountUp({ end, duration = 1500, className }: CountUpProps) {
  const [count, setCount] = useState(0)
  const [ref, isInView] = useInView<HTMLSpanElement>({ threshold: 0.3 })

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  }, [isInView, end, duration])

  return (
    <span ref={ref} className={className}>
      {count}
    </span>
  )
}
