import type { MetadataRoute } from "next"
import { getPosts, getTags } from "@/lib/ghost"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Make sure we're using the correct base URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kozker.com"
  // Remove trailing slash if present
  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl

  console.log("Generating sitemap with base URL:", normalizedBaseUrl)

  // Get all posts and tags
  const posts = await getPosts()
  const tags = await getTags()

  // Create sitemap entries for posts
  const postEntries = posts.map((post) => ({
    url: `${normalizedBaseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || post.published_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Create sitemap entries for tags
  const tagEntries = tags.map((tag) => ({
    url: `${normalizedBaseUrl}/tag/${tag.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }))

  // Add static pages
  const staticPages = [
    {
      url: normalizedBaseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${normalizedBaseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${normalizedBaseUrl}/tags`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${normalizedBaseUrl}/solutions`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${normalizedBaseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${normalizedBaseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${normalizedBaseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${normalizedBaseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ]

  return [...staticPages, ...postEntries, ...tagEntries]
}
