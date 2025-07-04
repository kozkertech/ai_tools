"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, UserIcon, ClockIcon, BookOpenIcon, ListIcon } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface GuideLayoutProps {
  post: {
    id: string
    title: string
    html: string
    excerpt?: string
    published_at: string
    updated_at?: string
    feature_image?: string
    primary_author: {
      name: string
      slug: string
    }
    primary_tag?: {
      name: string
      slug: string
    }
    tags?: Array<{
      name: string
      slug: string
    }>
  }
  children: React.ReactNode
}

interface TocItem {
  id: string
  text: string
  level: number
}

export function GuideLayout({ post, children }: GuideLayoutProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  // Extract table of contents from the HTML content (only h1 and h2)
  useEffect(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(post.html, "text/html")
    const headings = doc.querySelectorAll("h1, h2") // Only h1 and h2

    const items: TocItem[] = []
    headings.forEach((heading, index) => {
      const id = heading.id || `heading-${index}`
      const text = heading.textContent || ""
      const level = Number.parseInt(heading.tagName.charAt(1))

      // Add ID to heading if it doesn't have one
      if (!heading.id) {
        heading.id = id
      }

      items.push({ id, text, level })
    })

    setTocItems(items)
  }, [post.html])

  // Handle scroll to update active heading
  useEffect(() => {
    const handleScroll = () => {
      const headings = tocItems.map((item) => document.getElementById(item.id)).filter(Boolean)

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i]
        if (heading && heading.getBoundingClientRect().top <= 100) {
          setActiveId(heading.id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [tocItems])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Table of Contents Sidebar - Left Side */}
        <div className="lg:col-span-1 order-1">
          <div className="sticky top-8">
            {tocItems.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <ListIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                    Table of Contents
                  </h3>
                </div>

                <nav className="space-y-1">
                  {tocItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToHeading(item.id)}
                      className={cn(
                        "block w-full text-left py-2 px-3 rounded-md transition-all duration-200 text-sm hover:bg-gray-100 dark:hover:bg-gray-800",
                        item.level === 1
                          ? "font-medium text-gray-900 dark:text-gray-100"
                          : "font-normal pl-6 text-gray-600 dark:text-gray-400",
                        activeId === item.id
                          ? "bg-primary/10 text-primary font-medium border-l-2 border-l-primary"
                          : "hover:text-gray-900 dark:hover:text-gray-100",
                      )}
                    >
                      {item.text}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Right Side */}
        <div className="lg:col-span-3 order-2">
          <article className="space-y-8">
            {/* Header */}
            <div className="space-y-6">
              {post.primary_tag && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  <BookOpenIcon className="mr-1 h-3 w-3" />
                  {post.primary_tag.name}
                </Badge>
              )}

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{post.title}</h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <UserIcon className="mr-1 h-4 w-4" />
                  <span>{post.primary_author.name}</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="mr-1 h-4 w-4" />
                  <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="mr-1 h-4 w-4" />
                  <span>Guide</span>
                </div>
              </div>

              {post.excerpt && <p className="text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>}
            </div>

            {/* Featured Image */}
            {post.feature_image && (
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={post.feature_image || "/placeholder.svg"}
                  alt={`Featured image for ${post.title}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div className="max-w-none">{children}</div>
          </article>
        </div>
      </div>
    </div>
  )
}

export default GuideLayout
