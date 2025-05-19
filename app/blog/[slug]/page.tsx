import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getPost, fallbackPosts } from "@/lib/ghost"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, UserIcon } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import type { Metadata } from "next"

export async function generateStaticParams() {
  // During build time, just use fallback data to avoid API calls
  return fallbackPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const post = await getPost(params.slug)

    if (!post) {
      return {
        title: "Post Not Found",
        description: "The post you are looking for does not exist",
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kozker.com"
    const postUrl = `${baseUrl}/blog/${post.slug}`

    return {
      title: post.title,
      description: post.excerpt || post.meta_description || `Read our article about ${post.title}`,
      authors: [{ name: post.primary_author.name }],
      openGraph: {
        title: post.title,
        description: post.excerpt || post.meta_description || `Read our article about ${post.title}`,
        url: postUrl,
        siteName: "KozkerTech Blog",
        images: post.feature_image ? [{ url: post.feature_image }] : [],
        locale: "en_US",
        type: "article",
        publishedTime: post.published_at,
        modifiedTime: post.updated_at,
        authors: [post.primary_author.name],
        tags: post.tags?.map((tag) => tag.name) || [],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt || post.meta_description || `Read our article about ${post.title}`,
        images: post.feature_image ? [post.feature_image] : [],
      },
      alternates: {
        canonical: postUrl,
      },
    }
  } catch (error) {
    console.error("Error generating metadata for post:", error)
    return {
      title: "Blog Post",
      description: "Read our latest blog post",
    }
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  try {
    const post = await getPost(params.slug)

    if (!post) {
      notFound()
    }

    // Generate JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt || post.meta_description || `Read our article about ${post.title}`,
      image: post.feature_image ? [post.feature_image] : [],
      datePublished: post.published_at,
      dateModified: post.updated_at || post.published_at,
      author: {
        "@type": "Person",
        name: post.primary_author.name,
      },
      publisher: {
        "@type": "Organization",
        name: "KozkerTech",
        logo: {
          "@type": "ImageObject",
          url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://kozker.com"}/logo.png`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://kozker.com"}/blog/${post.slug}`,
      },
    }

    return (
      <article className="container py-8 md:py-12">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Breadcrumbs className="mb-8" />
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="space-y-6">
            {post.primary_tag && (
              <Link href={`/tag/${post.primary_tag.slug}`}>
                <Badge variant="secondary">{post.primary_tag.name}</Badge>
              </Link>
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
            </div>
          </div>

          {post.feature_image && (
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src={post.feature_image || "/placeholder.svg"}
                alt={`Featured image for ${post.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            </div>
          )}

          <div
            className="ghost-content prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>
      </article>
    )
  } catch (error) {
    console.error("Error rendering post page:", error)
    return (
      <div className="container py-8 md:py-12">
        <Breadcrumbs className="mb-8" />
        <div className="mx-auto max-w-3xl text-center py-12">
          <h2 className="text-xl font-medium">Error loading post</h2>
          <p className="text-muted-foreground mt-2">
            There was an error loading this post. Please check your Ghost CMS configuration.
          </p>
        </div>
      </div>
    )
  }
}
