import Image from "next/image"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, UserIcon } from "lucide-react"
import type { Post } from "@/hooks/use-blog-filter"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  if (!post) {
    return null // Or a placeholder card
  }

  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md">
      {post.feature_image && (
        <Link href={`/blog/${post.slug}`} className="relative block aspect-video overflow-hidden">
          <Image
            src={post.feature_image || "/placeholder.svg"}
            alt={`Featured image for ${post.title}`}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
      )}
      <CardContent className="flex flex-1 flex-col p-4">
        <div className="mb-2">
          {post.primary_tag && (
            <Link href={`/tag/${post.primary_tag.slug}`}>
              <Badge variant="secondary" className="text-xs">
                {post.primary_tag.name}
              </Badge>
            </Link>
          )}
        </div>
        <Link href={`/blog/${post.slug}`} className="flex-1">
          <h3 className="text-lg font-semibold leading-tight hover:underline">{post.title}</h3>
        </Link>
        {post.excerpt && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>}
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          {post.primary_author && (
            <div className="flex items-center">
              <UserIcon className="mr-1 h-3 w-3" />
              <span>{post.primary_author.name}</span>
            </div>
          )}
          {post.published_at && (
            <div className="flex items-center">
              <CalendarIcon className="mr-1 h-3 w-3" />
              <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
