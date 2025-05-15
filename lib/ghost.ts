import GhostContentAPI from "@tryghost/content-api"

// Initialize the Ghost Content API client
const api = new GhostContentAPI({
  url: process.env.GHOST_URL || "",
  key: process.env.GHOST_CONTENT_API_KEY || "",
  version: "v5.0",
})

// Get all posts with their tags and authors
export async function getPosts(options = {}) {
  return await api.posts
    .browse({
      limit: "all",
      include: ["tags", "authors"],
      order: "published_at DESC",
      ...options,
    })
    .catch((err) => {
      console.error(err)
      return []
    })
}

// Get a specific post by its slug
export async function getPost(slug: string) {
  return await api.posts
    .read({
      slug,
      include: ["tags", "authors"],
    })
    .catch((err) => {
      console.error(err)
      return null
    })
}

// Get featured posts
export async function getFeaturedPosts() {
  return await api.posts
    .browse({
      limit: 3,
      include: ["tags", "authors"],
      filter: "featured:true",
    })
    .catch((err) => {
      console.error(err)
      return []
    })
}

// Get all tags
export async function getTags() {
  return await api.tags
    .browse({
      limit: "all",
    })
    .catch((err) => {
      console.error(err)
      return []
    })
}

// Search posts by query
export async function searchPosts(query: string) {
  return await api.posts
    .browse({
      limit: "all",
      include: ["tags", "authors"],
      filter: `(title:~'${query}'+slug:~'${query}'+custom_excerpt:~'${query}'+html:~'${query}')`,
    })
    .catch((err) => {
      console.error(err)
      return []
    })
}
