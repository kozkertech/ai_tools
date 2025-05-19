import Link from "next/link"
import { formatDate, extractExcerpt } from "@/lib/utils"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, UserIcon } from "lucide-react"
import { OptimizedImage } from "@/components/optimized-image"

interface PostCardProps {
  post: {
    id: string
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
    <Card className="overflow-hidden flex flex-col h-full dark:bg-gray-900 dark:border-gray-800 transition-transform hover:shadow-md">
      {post.feature_image && (
        <div className="aspect-video relative overflow-hidden">
          <Link href={`/blog/${post.slug}`} aria-label={`Read article: ${post.title}`}>
            <OptimizedImage
              src={post.feature_image}
              alt={`Featured image for article: ${post.title}`}
              fill
              className="transition-transform hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              quality={80}
            />
          </Link>
        </div>
      )}
      <CardHeader className="flex-grow">
        <div className="space-y-2">
          {post.primary_tag && (
            <Link
              href={`/tag/${post.primary_tag.slug}`}
              aria-label={`View all posts tagged with ${post.primary_tag.name}`}
            >
              <Badge variant="secondary" className="dark:bg-gray-800 dark:text-white">
                {post.primary_tag.name}
              </Badge>
            </Link>
          )}
          <Link href={`/blog/${post.slug}`} className="block" aria-label={`Read article: ${post.title}`}>
            <h3 className="text-xl font-bold leading-tight hover:underline dark:text-white">{post.title}</h3>
          </Link>
          <div className="text-sm text-muted-foreground line-clamp-3 dark:text-gray-400">{excerptText}</div>
        </div>
      </CardHeader>
      <CardFooter className="border-t pt-4 dark:border-gray-800">
        <div className="flex items-center justify-between w-full text-sm text-muted-foreground dark:text-gray-400">
          <div className="flex items-center">
            <UserIcon className="mr-1 h-4 w-4" aria-hidden="true" />
            <span>{post.primary_author.name}</span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="mr-1 h-4 w-4" aria-hidden="true" />
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
