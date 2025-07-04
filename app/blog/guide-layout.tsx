"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, UserIcon, BookOpen, ListIcon } from "lucide-react"

interface TocItem {
  id: string
  text: string
  level: number
}

interface GuideLayoutProps {
  post: any
  children: React.ReactNode
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function GuideLayout({ post, children }: GuideLayoutProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    // Extract headings from the content (only h1 and h2)
    const headings = document.querySelectorAll(".ghost-content h1, .ghost-content h2")
    const items: TocItem[] = []

    headings.forEach((heading, index) => {
      const id = heading.id || `heading-${index}`
      if (!heading.id) {
        heading.id = id
      }

      items.push({
        id,
        text: heading.textContent || "",
        level: Number.parseInt(heading.tagName.charAt(1)),
      })
    })

    setTocItems(items)

    // Set up intersection observer for active section tracking
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-20% 0% -35% 0%" },
    )

    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-8">
              {tocItems.length > 0 && (
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <ListIcon className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">Contents</h3>
                    </div>
                    <nav className="space-y-1">
                      {tocItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => scrollToHeading(item.id)}
                          className={cn(
                            "block w-full text-left py-2 px-3 rounded-md transition-all duration-200 text-sm hover:bg-muted/50",
                            item.level === 1 ? "font-medium" : "ml-4 text-muted-foreground",
                            activeId === item.id
                              ? "bg-primary/10 text-primary font-medium border-l-2 border-l-primary pl-2"
                              : "hover:text-foreground",
                          )}
                        >
                          {item.text}
                        </button>
                      ))}
                    </nav>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="space-y-8">
              {/* Post Header */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  {post.primary_tag && <Badge variant="secondary">{post.primary_tag.name}</Badge>}
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Guide
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{post.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <UserIcon className="mr-1 h-4 w-4" />
                    <span>{post.primary_author?.name || "Anonymous"}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                  </div>
                </div>

                {post.excerpt && <p className="text-xl text-muted-foreground leading-relaxed">{post.excerpt}</p>}
              </div>

              {/* Featured Image */}
              {post.feature_image && (
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <img
                    src={post.feature_image || "/placeholder.svg"}
                    alt={`Featured image for ${post.title}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}

              {/* Post Content */}
              <div className="ghost-content">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuideLayout
