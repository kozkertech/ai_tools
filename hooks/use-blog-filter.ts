"use client"

import { useState, useMemo } from "react"

export interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
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

export function useBlogFilter(initialPosts: Post[] = [], initialTags: Tag[] = []) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  // Ensure we always have arrays to work with
  const posts = Array.isArray(initialPosts) ? initialPosts : []
  const tags = Array.isArray(initialTags) ? initialTags : []

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = [...posts]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post?.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post?.primary_author?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (post) =>
          post?.primary_tag?.slug === selectedCategory || post?.tags?.some((tag) => tag?.slug === selectedCategory),
      )
    }

    // Sort posts
    filtered.sort((a, b) => {
      if (!a || !b) return 0

      switch (sortBy) {
        case "oldest":
          return new Date(a.published_at || "").getTime() - new Date(b.published_at || "").getTime()
        case "title":
          return (a.title || "").localeCompare(b.title || "")
        case "newest":
        default:
          return new Date(b.published_at || "").getTime() - new Date(a.published_at || "").getTime()
      }
    })

    return filtered
  }, [posts, searchTerm, selectedCategory, sortBy])

  return {
    posts: filteredAndSortedPosts,
    tags,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
  }
}
