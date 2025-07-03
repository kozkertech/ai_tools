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
    name: string
    slug: string
  }>
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export function useBlogFilter(initialPosts: any[] = [], initialTags: any[] = []) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  // Ensure we always work with arrays
  const posts = Array.isArray(initialPosts) ? initialPosts : []
  const tags = Array.isArray(initialTags) ? initialTags : []

  // Extract categories from posts and tags
  const categories = useMemo(() => {
    const categorySet = new Set(["all"])

    // Add categories from post tags
    posts.forEach((post) => {
      if (post?.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag: any) => {
          if (tag?.name) {
            categorySet.add(tag.name)
          }
        })
      }
    })

    // Add categories from initial tags
    tags.forEach((tag) => {
      if (tag?.name) {
        categorySet.add(tag.name)
      }
    })

    return Array.from(categorySet)
  }, [posts, tags])

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = [...posts]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((post) => {
        if (!post) return false

        const title = post.title?.toLowerCase() || ""
        const excerpt = post.excerpt?.toLowerCase() || ""
        const customExcerpt = post.custom_excerpt?.toLowerCase() || ""
        const slug = post.slug?.toLowerCase() || ""

        return title.includes(query) || excerpt.includes(query) || customExcerpt.includes(query) || slug.includes(query)
      })
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => {
        if (!post?.tags || !Array.isArray(post.tags)) return false
        return post.tags.some((tag: any) => tag?.name === selectedCategory)
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
    filteredPosts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    categories,
  }
}
