"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface LazyComponentProps {
  children: React.ReactNode
  threshold?: number
}

export function LazyComponent({ children, threshold = 0.1 }: LazyComponentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold])

  return (
    <div ref={ref} className="min-h-[20px]">
      {isVisible ? children : <div className="w-full h-20" />}
    </div>
  )
}
