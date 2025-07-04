"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { ChevronRight } from "lucide-react"

interface TableOfContentsItem {
  id: string
  text: string
  level: number
}

interface GuideLayoutProps {
  post: any
  children: React.ReactNode
}

export function GuideLayout({ post, children }: GuideLayoutProps) {
  const [toc, setToc] = useState<TableOfContentsItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    // Generate table of contents from the post HTML
    const generateTOC = () => {
      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = post.html || ""

      // Only get H1 and H2 headings
      const headings = tempDiv.querySelectorAll("h1, h2")
      const tocItems: TableOfContentsItem[] = []

      headings.forEach((heading, index) => {
        const level = Number.parseInt(heading.tagName.charAt(1))
        // Only include H1 and H2
        if (level <= 2) {
          const id = heading.id || `heading-${index}`
          const text = heading.textContent || ""

          // Set ID if it doesn't exist
          if (!heading.id) {
            heading.id = id
          }

          tocItems.push({ id, text, level })
        }
      })

      setToc(tocItems)
    }

    generateTOC()
  }, [post.html])

  useEffect(() => {
    // Set up intersection observer for active section highlighting
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

    // Observe all headings after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const headings = document.querySelectorAll("h1[id], h2[id]")
      headings.forEach((heading) => observer.observe(heading))
    }, 100)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar - Table of Contents */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <ChevronRight className="w-4 h-4 mr-1" />
                  Table of Contents
                </h3>

                {toc.length > 0 ? (
                  <nav className="space-y-1">
                    {toc.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToHeading(item.id)}
                        className={`
                          block w-full text-left text-sm py-1.5 px-2 rounded transition-colors
                          ${item.level === 1 ? "font-medium" : "ml-3 font-normal"}
                          ${
                            activeId === item.id
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }
                        `}
                      >
                        {item.text}
                      </button>
                    ))}
                  </nav>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No headings found</p>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
