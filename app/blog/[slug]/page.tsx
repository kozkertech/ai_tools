import { notFound } from "next/navigation"
import { getPost, getPosts } from "@/lib/ghost"
import { GhostContent } from "@/components/ghost-content"
import { GuideLayout } from "@/components/blog/guide-layout"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { formatDate } from "@/lib/utils"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  try {
    const posts = await getPosts()
    return posts.map((post: any) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  try {
    const post = await getPost(params.slug)

    if (!post) {
      return {
        title: "Post Not Found",
      }
    }

    return {
      title: post.title,
      description: post.excerpt || post.custom_excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt || post.custom_excerpt,
        images: post.feature_image ? [{ url: post.feature_image }] : [],
        type: "article",
        publishedTime: post.published_at,
        authors: post.primary_author?.name ? [post.primary_author.name] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt || post.custom_excerpt,
        images: post.feature_image ? [post.feature_image] : [],
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Post Not Found",
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const post = await getPost(params.slug)

    if (!post) {
      notFound()
    }

    // Check if this is a guide post by looking for the #toc-guide tag
    const isGuidePost = post.tags?.some((tag: any) => tag.slug === "hash-toc-guide")

    const breadcrumbItems = [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: post.title, href: `/blog/${post.slug}` },
    ]

    if (isGuidePost) {
      return (
        <div className="container py-8">
          <Breadcrumbs items={breadcrumbItems} />
          <GuideLayout
            title={post.title}
            description={post.excerpt || post.custom_excerpt || ""}
            author={post.primary_author?.name || ""}
            publishDate={post.published_at}
            readingTime={post.reading_time || 5}
            tags={post.tags || []}
            difficulty="Beginner"
          >
            <GhostContent html={post.html || ""} />
          </GuideLayout>
        </div>
      )
    }

    return (
      <div className="container py-8">
        <Breadcrumbs items={breadcrumbItems} />
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            {post.feature_image && (
              <img
                src={post.feature_image || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              {post.primary_author?.name && <span>By {post.primary_author.name}</span>}
              {post.published_at && <span>{formatDate(post.published_at)}</span>}
              {post.reading_time && <span>{post.reading_time} min read</span>}
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag: any) => (
                  <span key={tag.id} className="px-2 py-1 bg-muted rounded-md text-sm">
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </header>
          <GhostContent html={post.html || ""} />
        </article>
      </div>
    )
  } catch (error) {
    console.error("Error loading blog post:", error)
    notFound()
  }
}
