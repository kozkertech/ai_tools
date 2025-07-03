"use client"

import { PostCard } from "@/components/post-card"

interface BlogGridProps {
  posts: any[]
  emptyMessage?: string
}

export function BlogGrid({ posts = [], emptyMessage = "No posts found" }: BlogGridProps) {
  // Ensure posts is always an array
  const safePosts = Array.isArray(posts) ? posts : []

  if (safePosts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-muted-foreground mb-2">No Posts Found</h3>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {safePosts.map((post) => (
        <PostCard key={post.id || post.slug} post={post} />
      ))}
    </div>
  )
}
