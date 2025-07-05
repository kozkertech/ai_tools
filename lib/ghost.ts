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

    const posts = await api.posts.browse({
      limit: "all",
      include: ["tags", "authors"],
      order: "published_at DESC",
      ...options,
    })

    return Array.isArray(posts) ? posts : []
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

      // Ensure featuredPosts is an array and has length property
      if (Array.isArray(featuredPosts) && featuredPosts.length > 0) {
        return featuredPosts
      }
    } catch (featuredError) {
      console.error("Error fetching featured posts, falling back to latest posts:", featuredError)
    }

    // If no featured posts or if the featured filter fails, fall back to latest posts
    const latestPosts = await api.posts.browse({
      limit: 3,
      include: ["tags", "authors"],
      order: "published_at DESC",
    })

    return Array.isArray(latestPosts) ? latestPosts : []
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

    const tags = await api.tags.browse({
      limit: "all",
    })

    return Array.isArray(tags) ? tags : []
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

    const posts = await api.posts.browse({
      limit: "all",
      include: ["tags", "authors"],
      filter: `(title:~'${query}'+slug:~'${query}'+custom_excerpt:~'${query}'+html:~'${query}')`,
    })

    return Array.isArray(posts) ? posts : []
  } catch (err) {
    console.error(`Error searching posts with query "${query}" from Ghost:`, err)
    return []
  }
}

// Get all case studies (posts with 'case-study' tag)
export async function getCaseStudies() {
  try {
    if (!process.env.GHOST_URL || !process.env.GHOST_CONTENT_API_KEY) {
      console.warn("Ghost API credentials are missing.")
      return []
    }

    if (!api) {
      console.error("Ghost API client is not initialized")
      return []
    }

    // Try multiple approaches to get case studies
    let result = []

    try {
      // Method 1: Direct filter with case-study tag
      result = await api.posts.browse({
        limit: "all",
        include: ["tags", "authors"],
        filter: "tag:case-study",
        order: "published_at DESC",
      })
      
      if (result && result.length > 0) {
        console.log("Found case studies with direct filter:", result.length)
        return result
      }
    } catch (error) {
      console.warn("Direct filter failed:", error.message)
    }

    try {
      // Method 2: Get all posts and filter manually
      console.log("Trying manual filter...")
      const allPosts = await api.posts.browse({
        limit: "all",
        include: ["tags", "authors"],
        order: "published_at DESC",
      })

      console.log("Total posts found:", allPosts.length)

      const caseStudyPosts = allPosts.filter(post => {
        const hasCaseStudyTag = post.tags?.some(tag => 
          tag.slug === 'case-study' || tag.name?.toLowerCase() === 'case-study'
        )
        
        if (hasCaseStudyTag) {
          console.log("Found case study post:", post.title, "with tags:", post.tags?.map(t => t.slug))
        }
        
        return hasCaseStudyTag
      })

      console.log("Case studies found after manual filter:", caseStudyPosts.length)
      return caseStudyPosts

    } catch (error) {
      console.error("Manual filter also failed:", error.message)
    }

    return []

  } catch (err) {
    console.error("Error fetching case studies from Ghost:", err)
    return []
  }
}

// Debug function to see all posts and their tags
export async function debugAllPosts() {
  try {
    const allPosts = await api.posts.browse({
      limit: "all",
      include: ["tags", "authors"],
      order: "published_at DESC",
    })

    console.log("=== DEBUG: All Posts ===")
    allPosts.forEach(post => {
      console.log(`Post: "${post.title}"`)
      console.log(`  Slug: ${post.slug}`)
      console.log(`  Tags: ${post.tags?.map(t => `${t.name} (${t.slug})`).join(', ') || 'No tags'}`)
      console.log(`  Published: ${post.published_at}`)
      console.log("---")
    })

    const caseStudyPosts = allPosts.filter(post => 
      post.tags?.some(tag => tag.slug === 'hash-case-study')
    )

    console.log(`\nFound ${caseStudyPosts.length} case study posts out of ${allPosts.length} total posts`)
    
    return {
      totalPosts: allPosts.length,
      caseStudyPosts: caseStudyPosts.length,
      allPosts: allPosts.map(post => ({
        title: post.title,
        slug: post.slug,
        tags: post.tags?.map(t => ({ name: t.name, slug: t.slug })) || []
      }))
    }

  } catch (error) {
    console.error("Debug function failed:", error)
    return { error: error.message }
  }
}

// Get a specific case study by slug
export async function getCaseStudy(slug: string) {
  try {
    if (!process.env.GHOST_URL || !process.env.GHOST_CONTENT_API_KEY) {
      console.warn("Ghost API credentials are missing.")
      return null
    }

    if (!api) {
      console.error("Ghost API client is not initialized")
      return null
    }

    if (!slug) {
      console.error("No slug provided to getCaseStudy")
      return null
    }

    // Method 1: Try to get the post directly by slug
    try {
      const post = await api.posts.read({
        slug,
        include: ["tags", "authors"],
      })

      // Check if it has case-study tag
      if (post && post.tags?.some(tag => tag.slug === 'hash-case-study')) {
        return post
      }
    } catch (error) {
      console.warn("Direct read failed:", error.message)
    }

    // Method 2: Get all case studies and find by slug
    const allCaseStudies = await getCaseStudies()
    const foundStudy = allCaseStudies.find(study => study.slug === slug)
    
    return foundStudy || null

  } catch (err) {
    console.error(`Error fetching case study ${slug} from Ghost:`, err)
    return null
  }
}
