import GhostContentAPI from "@tryghost/content-api"

// Fallback data for when Ghost API is unavailable
export const fallbackPosts = [
  {
    id: "fallback-1",
    title: "Sample Post Title",
    slug: "sample-post",
    html: "<p>This is a fallback post when the Ghost API is unavailable.</p>",
    feature_image: "/blog-post-concept.png",
    published_at: new Date().toISOString(),
    reading_time: 5,
    excerpt: "This is a fallback post when the Ghost API is unavailable.",
    tags: [{ name: "Sample", slug: "sample" }],
    primary_tag: { name: "Sample", slug: "sample" },
    primary_author: { name: "Admin", slug: "admin" },
    authors: [{ name: "Admin", slug: "admin" }],
    updated_at: new Date().toISOString(),
  },
]

export const fallbackTags = [
  {
    id: "fallback-tag-1",
    name: "Sample Tag",
    slug: "sample",
    description: "This is a fallback tag when the Ghost API is unavailable.",
    feature_image: "/graffiti-tag.png",
    count: { posts: 1 },
  },
]

// Initialize the Ghost Content API client with proper error handling
let api: any = null

try {
  // Only initialize if environment variables are available
  if (process.env.GHOST_URL && process.env.GHOST_CONTENT_API_KEY) {
    api = new GhostContentAPI({
      url: process.env.GHOST_URL,
      key: process.env.GHOST_CONTENT_API_KEY,
      version: "v5.0",
    })
  } else {
    console.warn("Ghost API credentials are missing. Using fallback data.")
  }
} catch (error) {
  console.error("Failed to initialize Ghost API client:", error)
}

// Get all posts with their tags and authors
export async function getPosts(options = {}) {
  // If API is not initialized, return fallback data
  if (!api) {
    console.warn("Ghost API client not initialized. Using fallback data for posts.")
    return fallbackPosts
  }

  try {
    return await api.posts.browse({
      limit: "all",
      include: ["tags", "authors"],
      order: "published_at DESC",
      ...options,
    })
  } catch (err) {
    console.error("Error fetching posts from Ghost:", err)
    return fallbackPosts
  }
}

// Get a specific post by its slug
export async function getPost(slug: string) {
  // If API is not initialized, return fallback data
  if (!api) {
    console.warn(`Ghost API client not initialized. Using fallback data for post: ${slug}`)
    return fallbackPosts[0]
  }

  try {
    return await api.posts.read({
      slug,
      include: ["tags", "authors"],
    })
  } catch (err) {
    console.error(`Error fetching post ${slug} from Ghost:`, err)
    return fallbackPosts[0]
  }
}

// Get featured posts
export async function getFeaturedPosts() {
  // If API is not initialized, return fallback data
  if (!api) {
    console.warn("Ghost API client not initialized. Using fallback data for featured posts.")
    return fallbackPosts
  }

  try {
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
    return fallbackPosts
  }
}

// Get all tags
export async function getTags() {
  // If API is not initialized, return fallback data
  if (!api) {
    console.warn("Ghost API client not initialized. Using fallback data for tags.")
    return fallbackTags
  }

  try {
    return await api.tags.browse({
      limit: "all",
    })
  } catch (err) {
    console.error("Error fetching tags from Ghost:", err)
    return fallbackTags
  }
}

// Search posts by query
export async function searchPosts(query: string) {
  // If API is not initialized, return fallback data
  if (!api) {
    console.warn(`Ghost API client not initialized. Using fallback data for search: ${query}`)
    return fallbackPosts
  }

  try {
    return await api.posts.browse({
      limit: "all",
      include: ["tags", "authors"],
      filter: `(title:~'${query}'+slug:~'${query}'+custom_excerpt:~'${query}'+html:~'${query}')`,
    })
  } catch (err) {
    console.error(`Error searching posts with query "${query}" from Ghost:`, err)
    return fallbackPosts
  }
}
