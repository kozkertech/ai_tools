"use client"

import { useState, useMemo } from "react"

export interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  custom_excerpt?: string
  published_at: string
  feature_image?: string
  primary_author?: {
    name: string
    slug: string
  }
  primary_tag?: {
    name: string
    slug: string
  }
  tags?: Array<{
    id: string
    name: string
    slug: string
  }>
  reading_time?: number
}

export interface Tag {
  id: string
  name: string
  slug: string
  count?: { posts: number }
}

export function useBlogFilter(initialPosts: Post[] = [], initialTags: Tag[] = []) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  // Ensure we always work with arrays
  const posts = Array.isArray(initialPosts) ? initialPosts : []
  const tags = Array.isArray(initialTags) ? initialTags : []

  // Extract and format categories from tags and posts
  const categories = useMemo(() => {
    const uniqueCategories = new Map<string, Tag>()

    // Add "All Categories" as the first option
    uniqueCategories.set("all", { id: "all", name: "All Categories", slug: "all", count: { posts: posts.length } })

    // Add categories from initialTags (from Ghost)
    tags.forEach((tag) => {
      if (tag?.slug && tag?.name) {
        uniqueCategories.set(tag.slug, {
          id: tag.id || tag.slug,
          name: tag.name,
          slug: tag.slug,
          count: tag.count || { posts: 0 },
        })
      }
    })

    // Add categories from posts if they are not already in initialTags, and update counts
    posts.forEach((post) => {
      post.tags?.forEach((tag) => {
        if (tag?.slug && tag?.name) {
          const currentTag = uniqueCategories.get(tag.slug)
          if (currentTag) {
            // If tag already exists, increment its post count
            uniqueCategories.set(tag.slug, {
              ...currentTag,
              count: { posts: (currentTag.count?.posts || 0) + 1 },
            })
          } else {
            // If new tag, add it with count 1
            uniqueCategories.set(tag.slug, {
              id: tag.id || tag.slug,
              name: tag.name,
              slug: tag.slug,
              count: { posts: 1 },
            })
          }
        }
      })
    })

    // Sort categories alphabetically by name, keeping "All Categories" first
    const sortedCategories = Array.from(uniqueCategories.values()).sort((a, b) => {
      if (a.slug === "all") return -1
      if (b.slug === "all") return 1
      return a.name.localeCompare(b.name)
    })

    return sortedCategories
  }, [posts, tags])

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = [...posts]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((post) => {
        if (!post) return false

        const title = post.title?.toLowerCase() || ""
        const excerpt = post.excerpt?.toLowerCase() || ""
        const customExcerpt = post.custom_excerpt?.toLowerCase() || ""
        const authorName = post.primary_author?.name?.toLowerCase() || ""

        return (
          title.includes(query) ||
          excerpt.includes(query) ||
          customExcerpt.includes(query) ||
          authorName.includes(query)
        )
      })
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => {
        if (!post?.tags || !Array.isArray(post.tags)) return false
        return post.tags.some((tag) => tag?.slug === selectedCategory)
      })
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (!a || !b) return 0

      switch (sortBy) {
        case "newest":
          return new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime()
        case "oldest":
          return new Date(a.published_at || 0).getTime() - new Date(b.published_at || 0).getTime()
        case "title":
          return (a.title || "").localeCompare(b.title || "")
        default:
          return 0
      }
    })

    return filtered
  }, [posts, searchQuery, selectedCategory, sortBy])

  return {
    filteredPosts: filteredAndSortedPosts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    categories,
  }
}
