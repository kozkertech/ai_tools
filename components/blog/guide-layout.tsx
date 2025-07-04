"use client"

import { useEffect, useState } from "react"
import { GhostContent } from "@/components/ghost-content"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock, List } from "lucide-react"

interface TOCItem {
  id: string
  text: string
  level: number
}

interface GuideLayoutProps {
  post: {
    id: string
    title: string
    slug: string
    html?: string
    excerpt?: string
    feature_image?: string
    feature_image_alt?: string
    published_at: string
    updated_at: string
    authors?: Array<{
      id: string
      name: string
      slug: string
    }>
    tags?: Array<{
      id: string
      name: string
      slug: string
    }>
  }
}

export function GuideLayout({ post }: GuideLayoutProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    // Generate table of contents from HTML
    if (post.html) {
      const parser = new DOMParser()
      const doc = parser.parseFromString(post.html, "text/html")
      const headings = doc.querySelectorAll("h1, h2")

      const items: TOCItem[] = Array.from(headings).map((heading, index) => {
        const level = Number.parseInt(heading.tagName.charAt(1))
        const text = heading.textContent || ""
        const id = heading.id || `heading-${index}`

        // Ensure heading has an ID for linking
        if (!heading.id) {
          heading.id = id
        }

        return { id, text, level }
      })

      setTocItems(items)
    }
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

    // Observe all headings after content is rendered
    const timer = setTimeout(() => {
      const headings = document.querySelectorAll("h1, h2")
      headings.forEach((heading) => observer.observe(heading))
    }, 500)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [post.html])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title, href: `/blog/${post.slug}` },
  ]

  const readingTime = Math.ceil((post.html?.length || 0) / 1000)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex gap-8 max-w-7xl mx-auto">
          {/* Table of Contents - Left Sidebar */}
          <aside className="w-64 flex-shrink-0 hidden lg:block">
            <div className="sticky top-8">
              <div className="bg-card border rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <List className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Table of Contents</h3>
                </div>

                <nav className="space-y-1">
                  {tocItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToHeading(item.id)}
                      className={`
                        block w-full text-left px-3 py-2 text-sm rounded-md transition-colors
                        ${item.level === 2 ? "ml-4" : ""}
                        ${
                          activeId === item.id
                            ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }
                      `}
                    >
                      {item.text}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <article>
              {/* Header */}
              <header className="mb-8">
                {post.feature_image && (
                  <div className="mb-8">
                    <img
                      src={post.feature_image || "/placeholder.svg"}
                      alt={post.feature_image_alt || post.title}
                      className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags
                        .filter((tag) => !tag.name.startsWith("#") && !tag.name.includes("toc-guide"))
                        .map((tag) => (
                          <Badge key={tag.id} variant="secondary">
                            {tag.name}
                          </Badge>
                        ))}
                    </div>
                  )}

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                    {post.title}
                  </h1>

                  {post.excerpt && <p className="text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>}

                  {/* Meta information */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {post.authors && post.authors.length > 0 && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{post.authors[0].name}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={post.published_at}>
                        {new Date(post.published_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{readingTime} min read</span>
                    </div>
                  </div>
                </div>
              </header>

              {/* Content */}
              <div className="prose prose-lg max-w-none">{post.html && <GhostContent html={post.html} />}</div>
            </article>
          </main>
        </div>
      </div>
    </div>
  )
}
