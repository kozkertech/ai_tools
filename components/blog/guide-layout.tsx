"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/breadcrumbs"

interface GuideLayoutProps {
  post: any
  tableOfContents: Array<{
    id: string
    text: string
    level: number
  }>
  children: React.ReactNode
  relatedPosts?: any[]
}

export function GuideLayout({ post, tableOfContents, children, relatedPosts = [] }: GuideLayoutProps) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
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

    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title, href: `/blog/${post.slug}` },
  ]

  // Filter out tags that contain '#' symbol
  const visibleTags = post.tags?.filter((tag: any) => !tag.name.includes("#")) || []

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 pr-8">
            {/* Breadcrumbs */}
            <div className="mb-8">
              <Breadcrumbs items={breadcrumbItems} />
            </div>

            {/* Tags */}
            {visibleTags.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {visibleTags.map((tag: any) => (
                  <Badge key={tag.id} variant="secondary" className="text-sm">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Post Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold tracking-tight mb-4">{post.title}</h1>
              {post.excerpt && <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>}

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {post.primary_author && (
                  <div className="flex items-center gap-2">
                    <span>By {post.primary_author.name}</span>
                  </div>
                )}
                {post.published_at && (
                  <time dateTime={post.published_at}>
                    {new Date(post.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                )}
                {post.reading_time && <span>{post.reading_time} min read</span>}
              </div>
            </div>

            {/* Post Content */}
            <div className="prose prose-lg max-w-none dark:prose-invert">{children}</div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {relatedPosts.slice(0, 4).map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="group block p-4 rounded-lg border hover:border-primary/50 transition-colors"
                    >
                      <h3 className="font-semibold group-hover:text-primary transition-colors">{relatedPost.title}</h3>
                      {relatedPost.excerpt && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{relatedPost.excerpt}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t">
              <Button variant="outline" size="sm" asChild>
                <Link href="/blog">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
            </div>
          </div>

          {/* Table of Contents - Right Sidebar */}
          {tableOfContents.length > 0 && (
            <div className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-8">
                <div className="space-y-2">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                    ON THIS PAGE
                  </h3>
                  <nav className="space-y-1">
                    {tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-sm transition-colors hover:text-foreground ${
                          activeId === item.id ? "text-foreground font-medium" : "text-muted-foreground"
                        } ${item.level === 2 ? "pl-0" : item.level === 3 ? "pl-4" : "pl-6"}`}
                        style={{
                          paddingLeft: `${(item.level - 2) * 16}px`,
                        }}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
