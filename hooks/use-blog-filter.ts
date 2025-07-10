"use client"

import { useState, useMemo } from "react"

export interface SortOption {
  value: string
  label: string
}

export function useBlogFilter(posts: any[], tags: any[]) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSortOption, setSelectedSortOption] = useState("newest")

  const sortOptions: SortOption[] = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "title-asc", label: "Title A-Z" },
    { value: "title-desc", label: "Title Z-A" },
  ]

  const filteredPosts = useMemo(() => {
    let filtered = [...posts]

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((post) => post.tags?.some((tag: any) => selectedCategories.includes(tag.slug)))
    }

    // Sort posts
    filtered.sort((a, b) => {
      switch (selectedSortOption) {
        case "oldest":
          return new Date(a.published_at).getTime() - new Date(b.published_at).getTime()
        case "title-asc":
          return a.title.localeCompare(b.title)
        case "title-desc":
          return b.title.localeCompare(a.title)
        case "newest":
        default:
          return new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      }
    })

    return filtered
  }, [posts, selectedCategories, selectedSortOption])

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categorySlug) ? prev.filter((slug) => slug !== categorySlug) : [...prev, categorySlug],
    )
  }

  const handleSortSelect = (sortValue: string) => {
    setSelectedSortOption(sortValue)
  }

  return {
    filteredPosts,
    selectedCategories,
    selectedSortOption,
    handleCategorySelect,
    handleSortSelect,
    sortOptions,
  }
}
