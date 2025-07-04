import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPost, getPosts } from "@/lib/ghost"
import { GhostContent } from "@/components/ghost-content"
import { GuideLayout } from "@/components/blog/guide-layout"
import { generateSEOMetadata } from "@/lib/seo"
import { Breadcrumbs } from "@/components/breadcrumbs"

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

    return generateSEOMetadata({
      title: post.title,
      description: post.excerpt || post.meta_description || "",
      path: `/blog/${post.slug}`,
      image: post.feature_image || undefined,
      type: "article",
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      tags: post.tags?.map((tag) => tag.name),
      author: post.primary_author?.name,
    })
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Blog Post",
      description: "Read our latest blog post.",
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
    const hasGuideTag = post.tags?.some(
      (tag) => tag.name === "toc-guide" || tag.name === "#toc-guide" || tag.name === "hash-toc-guide",
    )

    const breadcrumbItems = [
      { name: "Home", url: "/" },
      { name: "Blog", url: "/blog" },
      { name: post.title, url: `/blog/${post.slug}` },
    ]

    // If it has the guide tag, use the guide layout
    if (hasGuideTag) {
      return (
        <GuideLayout post={post}>
          <div className="space-y-6">
            <Breadcrumbs items={breadcrumbItems} />

            <article className="max-w-none">
              <header className="mb-8">
                {post.feature_image && (
                  <img
                    src={post.feature_image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
                  />
                )}

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {post.tags?.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                    {post.title}
                  </h1>

                  {post.excerpt && (
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">{post.excerpt}</p>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    {post.primary_author && (
                      <div className="flex items-center space-x-2">
                        {post.primary_author.profile_image && (
                          <img
                            src={post.primary_author.profile_image || "/placeholder.svg"}
                            alt={post.primary_author.name}
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <span>{post.primary_author.name}</span>
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
              </header>

              <div className="ghost-content">
                <GhostContent html={post.html || ""} />
              </div>
            </article>
          </div>
        </GuideLayout>
      )
    }

    // Regular blog post layout (without guide layout)
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <Breadcrumbs items={breadcrumbItems} />

            <article>
              <header className="mb-8">
                {post.feature_image && (
                  <img
                    src={post.feature_image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
                  />
                )}

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {post.tags?.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                    {post.title}
                  </h1>

                  {post.excerpt && (
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">{post.excerpt}</p>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    {post.primary_author && (
                      <div className="flex items-center space-x-2">
                        {post.primary_author.profile_image && (
                          <img
                            src={post.primary_author.profile_image || "/placeholder.svg"}
                            alt={post.primary_author.name}
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <span>{post.primary_author.name}</span>
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
              </header>

              <div className="ghost-content">
                <GhostContent html={post.html || ""} />
              </div>
            </article>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading blog post:", error)
    notFound()
  }
}
