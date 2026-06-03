"use client"

import { useEffect, useState, useRef } from "react"

interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {},
) {
  const ref = useRef<T>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      {
        threshold: options.threshold ?? 0.1,
        rootMargin: options.rootMargin ?? "0px",
      },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin])

  return [ref, isInView] as const
}

/**
 * Tracks which index in a list of elements is currently most visible.
 * Useful for scroll-linked navigation (timeline, table of contents).
 */
export function useActiveSection(
  totalSections: number,
  options: UseInViewOptions = {},
) {
  const [activeIndex, setActiveIndex] = useState(0)
  const refs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const elements = refs.current.filter(Boolean) as HTMLElement[]
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        let best: { index: number; ratio: number } | null = null
        for (const entry of entries) {
          const index = Number(
            (entry.target as HTMLElement).dataset.stageIndex,
          )
          if (!isNaN(index) && entry.isIntersecting) {
            if (!best || entry.intersectionRatio > best.ratio) {
              best = { index, ratio: entry.intersectionRatio }
            }
          }
        }
        if (best) {
          setActiveIndex(best.index)
        }
      },
      {
        threshold: options.threshold ?? 0.1,
        rootMargin: options.rootMargin ?? "-80px 0px -40% 0px",
      },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [totalSections, options.threshold, options.rootMargin])

  function setSectionRef(index: number) {
    return (el: HTMLElement | null) => {
      refs.current[index] = el
    }
  }

  return { activeIndex, setSectionRef }
}
