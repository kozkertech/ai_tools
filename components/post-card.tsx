import Link from "next/link"
import Image from "next/image"
import { formatDate, extractExcerpt } from "@/lib/utils"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, UserIcon } from "lucide-react"

interface PostCardProps {
  post: {
    slug: string
    title: string
    html: string
    excerpt?: string
    feature_image: string | null
    published_at: string
    primary_author: {
      name: string
    }
    primary_tag?: {
      name: string
      slug: string
    }
  }
}

export function PostCard({ post }: PostCardProps) {
  // Use the provided excerpt if available, otherwise extract from HTML
  const excerptText = post.excerpt || extractExcerpt(post.html)

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      {post.feature_image && (
        <div className="aspect-video relative overflow-hidden">
          <Link href={`/blog/${post.slug}`}>
            <Image
              src={post.feature_image || "/placeholder.svg"}
              alt={`Featured image for article: ${post.title}`}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
          </Link>
        </div>
      )}
      <CardHeader className="flex-grow">
        <div className="space-y-2">
          {post.primary_tag && (
            <Link href={`/tag/${post.primary_tag.slug}`}>
              <Badge variant="secondary">{post.primary_tag.name}</Badge>
            </Link>
          )}
          <Link href={`/blog/${post.slug}`} className="block">
            <h3 className="text-xl font-bold leading-tight hover:underline">{post.title}</h3>
          </Link>
          <div className="text-sm text-muted-foreground line-clamp-3">{excerptText}</div>
        </div>
      </CardHeader>
      <CardFooter className="border-t pt-4">
        <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
          <div className="flex items-center">
            <UserIcon className="mr-1 h-4 w-4" />
            <span>{post.primary_author.name}</span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="mr-1 h-4 w-4" />
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
