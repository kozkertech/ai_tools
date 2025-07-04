"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TocItem {
  id: string
  text: string
  level: number
}

interface GuideLayoutProps {
  children: React.ReactNode
  showToc?: boolean
}

export function GuideLayout({ children, showToc = true }: GuideLayoutProps) {
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    // Extract headings from the content (only h1 and h2)
    const headings = Array.from(document.querySelectorAll(".ghost-content h1, .ghost-content h2"))

    const tocItems: TocItem[] = headings.map((heading) => ({
      id: heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, "-") || "",
      text: heading.textContent || "",
      level: Number.parseInt(heading.tagName.charAt(1)),
    }))

    // Set IDs for headings that don't have them
    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = tocItems[index].id
      }
    })

    setToc(tocItems)

    // Set up intersection observer for active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-20% 0% -35% 0%",
        threshold: 0,
      },
    )

    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  if (!showToc || toc.length === 0) {
    return <div className="ghost-content">{children}</div>
  }

  return (
    <div className="flex gap-8 max-w-none">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="ghost-content">{children}</div>
      </div>

      {/* Table of Contents */}
      <div className="hidden xl:block w-64 flex-shrink-0">
        <div className="sticky top-24">
          <div className="border-l border-gray-200 dark:border-gray-700 pl-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Table of Contents</h3>
            <nav className="space-y-1">
              {toc.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToHeading(item.id)}
                  className={cn(
                    "block w-full text-left text-sm transition-colors hover:text-gray-900 dark:hover:text-gray-100",
                    item.level === 1 ? "font-medium" : "font-normal pl-3",
                    activeId === item.id ? "text-primary font-medium" : "text-gray-600 dark:text-gray-400",
                  )}
                >
                  {item.text}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
