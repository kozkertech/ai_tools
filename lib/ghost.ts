import GhostContentAPI from "@tryghost/content-api"

// Utility function to normalize URLs
function normalizeUrl(url: string): string {
  // Remove trailing slash if present
  return url.endsWith("/") ? url.slice(0, -1) : url
}

// Initialize the Ghost Content API client with proper error handling
const api = new GhostContentAPI({
  url: normalizeUrl(process.env.GHOST_URL || ""),
  key: process.env.GHOST_CONTENT_API_KEY || "",
  version: "v5.0",
})

// Get all posts with their tags and authors
export async function getPosts(options = {}) {
  try {
    if (!process.env.GHOST_URL || !process.env.GHOST_CONTENT_API_KEY) {
      console.error("Ghost API credentials are missing. Please check your environment variables.")
      return []
    }

    return await api.posts.browse({
      limit: "all",
      include: ["tags", "authors"],
      order: "published_at DESC",
      ...options,
    })
  } catch (err) {
    console.error("Error fetching posts from Ghost:", err)
    return []
  }
}

// Get a specific post by its slug
export async function getPost(slug: string) {
  try {
    if (!process.env.GHOST_URL || !process.env.GHOST_CONTENT_API_KEY) {
      console.error("Ghost API credentials are missing. Please check your environment variables.")
      return null
    }

    return await api.posts.read({
      slug,
      include: ["tags", "authors"],
    })
  } catch (err) {
    console.error(`Error fetching post ${slug} from Ghost:`, err)
    return null
  }
}

// Get featured posts
export async function getFeaturedPosts() {
  try {
    if (!process.env.GHOST_URL || !process.env.GHOST_CONTENT_API_KEY) {
      console.error("Ghost API credentials are missing. Please check your environment variables.")
      return []
    }

    // First try to get posts with the featured filter
    try {
      const featuredPosts = await api.posts.browse({
        limit: 3,
        include: ["tags", "authors"],
        filter: "featured:true",
      })

      if (featuredPosts.length > 0) {
        return featuredPosts
      }
    } catch (featuredError) {
      console.error("Error fetching featured posts, falling back to latest posts:", featuredError)
    }

    // If no featured posts or if the featured filter fails, fall back to latest posts
    return await api.posts.browse({
      limit: 3,
      include: ["tags", "authors"],
      order: "published_at DESC",
    })
  } catch (err) {
    console.error("Error fetching posts from Ghost:", err)
    return []
  }
}

// Get all tags
export async function getTags() {
  try {
    if (!process.env.GHOST_URL || !process.env.GHOST_CONTENT_API_KEY) {
      console.error("Ghost API credentials are missing. Please check your environment variables.")
      return []
    }

    return await api.tags.browse({
      limit: "all",
    })
  } catch (err) {
    console.error("Error fetching tags from Ghost:", err)
    return []
  }
}

// Search posts by query
export async function searchPosts(query: string) {
  try {
    if (!process.env.GHOST_URL || !process.env.GHOST_CONTENT_API_KEY) {
      console.error("Ghost API credentials are missing. Please check your environment variables.")
      return []
    }

    return await api.posts.browse({
      limit: "all",
      include: ["tags", "authors"],
      filter: `(title:~'${query}'+slug:~'${query}'+custom_excerpt:~'${query}'+html:~'${query}')`,
    })
  } catch (err) {
    console.error(`Error searching posts with query "${query}" from Ghost:`, err)
    return []
  }
}

// Example function to build URLs for posts
export function getPostUrl(post: any): string {
  const baseUrl = normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL || "https://yourblog.com")
  return `${baseUrl}/blog/${post.slug}`
}

// Example function to build URLs for tags
export function getTagUrl(tag: any): string {
  const baseUrl = normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL || "https://yourblog.com")
  return `${baseUrl}/tag/${tag.slug}`
}
