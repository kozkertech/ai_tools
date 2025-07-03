import { PostCard } from "@/components/post-card"

interface BlogGridProps {
  posts: any[]
  emptyMessage?: string
}

export function BlogGrid({ posts, emptyMessage = "No posts found" }: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium">{emptyMessage}</h2>
        <p className="text-muted-foreground mt-2">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
