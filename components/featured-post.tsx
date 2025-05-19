import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, UserIcon } from "lucide-react"
import { OptimizedImage } from "@/components/optimized-image"

interface FeaturedPostProps {
  post: {
    slug: string
    title: string
    feature_image: string | null
    excerpt: string
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

export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border bg-background shadow-sm hover:shadow-md transition-shadow">
      <div className="md:grid md:grid-cols-2">
        <div className="relative aspect-video md:aspect-auto md:h-full">
          {post.feature_image ? (
            <OptimizedImage
              src={post.feature_image}
              alt={`Featured image for article: ${post.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              quality={85}
            />
          ) : (
            <div className="h-full w-full bg-muted" aria-hidden="true" />
          )}
        </div>
        <div className="p-6 flex flex-col">
          <div className="space-y-4 flex-grow">
            {post.primary_tag && (
              <Link
                href={`/tag/${post.primary_tag.slug}`}
                aria-label={`View all posts tagged with ${post.primary_tag.name}`}
              >
                <Badge variant="secondary">{post.primary_tag.name}</Badge>
              </Link>
            )}
            <Link href={`/blog/${post.slug}`} aria-label={`Read article: ${post.title}`}>
              <h2 className="text-3xl font-bold leading-tight tracking-tighter hover:underline">{post.title}</h2>
            </Link>
            <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
          </div>
          <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <UserIcon className="mr-1 h-4 w-4" aria-hidden="true" />
              <span>{post.primary_author.name}</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="mr-1 h-4 w-4" aria-hidden="true" />
              <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
