"use client"

import { useEffect, useState, type ReactNode } from "react"

interface LazyComponentProps {
  children: ReactNode
  placeholder?: ReactNode
}

export function LazyComponent({ children, placeholder }: LazyComponentProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "200px" },
    )

    const currentElement = document.getElementById("lazy-component")
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [])

  return (
    <div id="lazy-component">
      {isVisible ? children : placeholder || <div className="h-40 animate-pulse bg-muted rounded-md" />}
    </div>
  )
}
