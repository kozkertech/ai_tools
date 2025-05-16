import GhostContentAPI from "@tryghost/content-api"

// Initialize the Ghost Content API client with proper error handling
const api = new GhostContentAPI({
  url: process.env.GHOST_URL || "",
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

    return await api.posts.browse({
      limit: 3,
      include: ["tags", "authors"],
      filter: "featured:true",
    })
  } catch (err) {
    console.error("Error fetching featured posts from Ghost:", err)
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
