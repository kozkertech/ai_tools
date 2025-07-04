import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getPost, getPosts } from "@/lib/ghost"
import { GhostContent } from "@/components/ghost-content"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock } from "lucide-react"
import { GuideLayout } from "@/components/blog/guide-layout"
import { SchemaMarkup } from "@/components/schema-markup"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  try {
    const posts = await getPosts()
    return posts.map((post) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = await getPost(params.slug)

    if (!post) {
      return {
        title: "Post Not Found",
        description: "The requested blog post could not be found.",
      }
    }

    return {
      title: post.title,
      description: post.excerpt || post.meta_description,
      openGraph: {
        title: post.title,
        description: post.excerpt || post.meta_description,
        type: "article",
        publishedTime: post.published_at,
        modifiedTime: post.updated_at,
        authors: post.authors?.map((author) => author.name) || [],
        tags: post.tags?.map((tag) => tag.name) || [],
        images: post.feature_image
          ? [
              {
                url: post.feature_image,
                width: 1200,
                height: 630,
                alt: post.feature_image_alt || post.title,
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt || post.meta_description,
        images: post.feature_image ? [post.feature_image] : [],
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Error",
      description: "An error occurred while loading the post.",
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const post = await getPost(params.slug)

    if (!post) {
      notFound()
    }

    // Check if this post should use the guide layout
    const hasGuideTag =
      post.tags?.some(
        (tag) => tag.name === "toc-guide" || tag.name === "#toc-guide" || tag.name === "hash-toc-guide",
      ) || false

    const breadcrumbItems = [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: post.title, href: `/blog/${post.slug}` },
    ]

    const readingTime = Math.ceil((post.html?.length || 0) / 1000)

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt || post.meta_description,
      image: post.feature_image,
      author: {
        "@type": "Person",
        name: post.authors?.[0]?.name || "Anonymous",
      },
      publisher: {
        "@type": "Organization",
        name: "Your Site Name",
        logo: {
          "@type": "ImageObject",
          url: "/logo.png",
        },
      },
      datePublished: post.published_at,
      dateModified: post.updated_at,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
      },
    }

    // If it has the guide tag, use the guide layout
    if (hasGuideTag) {
      return (
        <>
          <SchemaMarkup data={jsonLd} />
          <GuideLayout post={post} />
        </>
      )
    }

    // Otherwise, use the regular blog post layout
    return (
      <>
        <SchemaMarkup data={jsonLd} />
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <Breadcrumbs items={breadcrumbItems} />

            <article className="max-w-4xl mx-auto">
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
          </div>
        </div>
      </>
    )
  } catch (error) {
    console.error("Error loading blog post:", error)
    notFound()
  }
}
