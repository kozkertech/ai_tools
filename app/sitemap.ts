import type { MetadataRoute } from "next"
import { getPosts, getTags } from "@/lib/blog-data"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Make sure we're using the correct base URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kozker.com"

  console.log("Generating sitemap with base URL:", baseUrl)

  // Get all posts and tags
  const posts = await getPosts()
  const tags = await getTags()

  // Create sitemap entries for posts
  const postEntries = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || post.published_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Create sitemap entries for tags
  const tagEntries = tags.map((tag) => ({
    url: `${baseUrl}/tag/${tag.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }))

  // Add static pages - Core site structure
  const staticPages = [
    // Homepage - highest priority
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },

    // Main service pages - high priority
    {
      url: `${baseUrl}/solutions`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },

    // Individual solution pages - based on your homepage navigation
    {
      url: `${baseUrl}/solutions/launchpad`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/solutions/growthsuite`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/solutions/intelligence`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },

    // Pricing and contact - important conversion pages
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },

    // Blog section - content marketing
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },

    // Company pages
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },

    // Service-specific pages based on your homepage content
    {
      url: `${baseUrl}/services/web-design`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services/whatsapp-automation`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services/ai-chatbots`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services/power-bi`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services/local-seo`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },

    // Industry/location pages (based on your Kochi focus)
    {
      url: `${baseUrl}/kochi-web-development`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/kerala-digital-marketing`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },

    // Legal and policy pages
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },

    // Additional pages you might want to add
    {
      url: `${baseUrl}/case-studies`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/testimonials`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ]

  // Add dynamic service pages if you have them
  const serviceCategories = ["web-development", "digital-marketing", "automation", "analytics", "consulting"]

  const serviceCategoryEntries = serviceCategories.map((category) => ({
    url: `${baseUrl}/services/${category}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  // Add technology-specific pages
  const technologies = ["nextjs", "react", "nodejs", "powerbi", "whatsapp-api", "openai-integration"]

  const technologyEntries = technologies.map((tech) => ({
    url: `${baseUrl}/technologies/${tech}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }))

  console.log(
    `Generated sitemap with ${staticPages.length + postEntries.length + tagEntries.length + serviceCategoryEntries.length + technologyEntries.length} entries`,
  )

  return [...staticPages, ...postEntries, ...tagEntries, ...serviceCategoryEntries, ...technologyEntries]
}
