"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useInView } from "react-intersection-observer"

interface LazyComponentProps {
  children: ReactNode
  threshold?: number
  rootMargin?: string
  placeholder?: ReactNode
}

/**
 * Component that lazily renders its children when they come into view
 */
export function LazyComponent({
  children,
  threshold = 0.1,
  rootMargin = "100px",
  placeholder = <div className="w-full h-40 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />,
}: LazyComponentProps) {
  const [shouldRender, setShouldRender] = useState(false)
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce: true,
  })

  useEffect(() => {
    if (inView) {
      setShouldRender(true)
    }
  }, [inView])

  return <div ref={ref}>{shouldRender ? children : placeholder}</div>
}
