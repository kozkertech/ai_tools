import GhostContentAPI from "@tryghost/content-api"

// Create API instance with site credentials
const api = new GhostContentAPI({
  url: process.env.GHOST_URL || "https://ghost.org", // Default to ghost.org if not set
  key: process.env.GHOST_CONTENT_API_KEY || "22444f78447824223cefc48062", // Default to a public key if not set
  version: "v5.0",
})

export async function getPosts() {
  try {
    const posts = await api.posts
      .browse({
        limit: "all",
        include: ["tags", "authors"],
        fields: ["id", "title", "slug", "excerpt", "feature_image", "published_at", "updated_at", "reading_time"],
      })
      .catch((err) => {
        console.error("Error fetching posts from Ghost:", err)
        return []
      })
    return posts
  } catch (error) {
    console.error("Error in getPosts:", error)
    return []
  }
}

export async function getSinglePost(postSlug: string) {
  try {
    const post = await api.posts
      .read(
        { slug: postSlug },
        {
          include: ["tags", "authors"],
        },
      )
      .catch((err) => {
        console.error(`Error fetching single post (${postSlug}) from Ghost:`, err)
        return null
      })
    return post
  } catch (error) {
    console.error("Error in getSinglePost:", error)
    return null
  }
}

export async function getPost(slug: string) {
  try {
    const post = await api.posts.read({ slug }, { include: ["tags", "authors"] }).catch((err) => {
      console.error(`Error fetching post with slug ${slug}:`, err)
      return null
    })
    return post
  } catch (error) {
    console.error(`Error in getPost for slug ${slug}:`, error)
    return null
  }
}

export async function getTags() {
  try {
    const tags = await api.tags
      .browse({
        limit: "all",
        fields: ["id", "name", "slug", "description"],
        include: ["count.posts"], // Include post count for each tag
      })
      .catch((err) => {
        console.error("Error fetching tags from Ghost:", err)
        return []
      })
    return tags
  } catch (error) {
    console.error("Error in getTags:", error)
    return []
  }
}

export async function getFeaturedPosts() {
  try {
    const featuredPosts = await api.posts
      .browse({
        filter: "featured:true",
        limit: 3, // Limit to 3 featured posts
        include: ["tags", "authors"],
        fields: ["id", "title", "slug", "excerpt", "feature_image", "published_at", "primary_author", "primary_tag"],
      })
      .catch((err) => {
        console.warn("Error fetching featured posts, falling back to latest posts:", err)
        return [] // Return empty array on error
      })

    // If no featured posts or error, fetch latest posts
    if (!featuredPosts || featuredPosts.length === 0) {
      console.log("No featured posts found or error occurred, fetching latest posts.")
      return await api.posts
        .browse({
          limit: 3, // Limit to 3 latest posts
          include: ["tags", "authors"],
          fields: ["id", "title", "slug", "excerpt", "feature_image", "published_at", "primary_author", "primary_tag"],
        })
        .catch((err) => {
          console.error("Error fetching latest posts as fallback:", err)
          return []
        })
    }
    return featuredPosts
  } catch (error) {
    console.error("Error in getFeaturedPosts (outer catch):", error)
    return []
  }
}

export async function getSettings() {
  try {
    const settings = await api.settings.browse().catch((err) => {
      console.error("Error fetching settings from Ghost:", err)
      return null
    })
    return settings
  } catch (error) {
    console.error("Error in getSettings:", error)
    return null
  }
}
