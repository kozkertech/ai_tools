import { Breadcrumbs } from "@/components/breadcrumbs"
import BlogPageClientWrapper from "./BlogPageClientWrapper"
import { getPosts, getTags } from "@/lib/ghost"
import { SEOHead } from "@/components/seo-head"

export const metadata = {
  title: "Blog - Latest Articles and Insights",
  description: "Explore our latest articles, guides, and insights on technology, business, and innovation.",
}

export default async function BlogPage() {
  let posts = []
  let tags = []
  let error = null

  try {
    // Check if Ghost API credentials are available
    if (process.env.GHOST_URL && process.env.GHOST_CONTENT_API_KEY) {
      // Use Promise.allSettled to prevent one failed request from affecting the other
      const [postsResult, tagsResult] = await Promise.allSettled([getPosts(), getTags()])

      if (postsResult.status === "fulfilled") {
        posts = postsResult.value
      } else {
        error = "Failed to load posts"
      }

      if (tagsResult.status === "fulfilled") {
        tags = tagsResult.value
      }
    } else {
      error = "Ghost API credentials are missing"
    }
  } catch (err) {
    console.error("Error in blog page:", err)
    error = "An error occurred while loading the blog"
  }

  // Generate JSON-LD structured data for the blog page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "KozkerTech Blog",
    description: "Explore our latest articles, guides, and insights on technology, business, and innovation.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://kozker.com"}/blog`,
    publisher: {
      "@type": "Organization",
      name: "KozkerTech",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://kozker.com"}/logo.png`,
      },
    },
  }

  return (
    <div className="container py-8 md:py-12">
      <SEOHead metadata={metadata} schema={jsonLd} />
      <Breadcrumbs className="mb-8" />

      {error ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium">Error loading blog</h2>
          <p className="text-muted-foreground mt-2">{error}. Please check your Ghost CMS configuration.</p>
        </div>
      ) : (
        <BlogPageClientWrapper initialPosts={posts} tags={tags} />
      )}
    </div>
  )
}
