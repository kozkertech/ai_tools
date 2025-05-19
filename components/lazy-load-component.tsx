"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useInView } from "react-intersection-observer"

interface LazyLoadComponentProps {
  children: ReactNode
  threshold?: number
  rootMargin?: string
  placeholder?: ReactNode
  className?: string
}

export function LazyLoadComponent({
  children,
  threshold = 0.1,
  rootMargin = "200px 0px",
  placeholder,
  className,
}: LazyLoadComponentProps) {
  const [isClient, setIsClient] = useState(false)
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce: true,
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  // If we're on the server or haven't mounted yet, render the placeholder
  if (!isClient) {
    return (
      <div className={className}>
        {placeholder || <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-40 w-full rounded-md" />}
      </div>
    )
  }

  return (
    <div ref={ref} className={className}>
      {inView
        ? children
        : placeholder || <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-40 w-full rounded-md" />}
    </div>
  )
}
