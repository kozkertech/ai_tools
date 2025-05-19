"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

export function useBlogFilter(initialPosts: any[]) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get initial values from URL
  const initialQuery = searchParams?.get("q") || ""
  const initialCategories = searchParams?.get("categories")?.split(",").filter(Boolean) || []
  const initialSort = searchParams?.get("sort") || "newest"

  // State
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories)
  const [sortOption, setSortOption] = useState(initialSort)

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let result = [...initialPosts]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(query)) ||
          (post.html && post.html.toLowerCase().includes(query)),
      )
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      result = result.filter((post) => post.tags?.some((tag: any) => selectedCategories.includes(tag.slug)))
    }

    // Sort posts
    switch (sortOption) {
      case "newest":
        result.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime())
        break
      case "a-z":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "z-a":
        result.sort((a, b) => b.title.localeCompare(a.title))
        break
    }

    return result
  }, [initialPosts, searchQuery, selectedCategories, sortOption])

  // Update URL when filters change
  useEffect(() => {
    if (!searchParams) return

    const params = new URLSearchParams(searchParams.toString())

    if (searchQuery) {
      params.set("q", searchQuery)
    } else {
      params.delete("q")
    }

    if (selectedCategories.length > 0) {
      params.set("categories", selectedCategories.join(","))
    } else {
      params.delete("categories")
    }

    if (sortOption !== "newest") {
      params.set("sort", sortOption)
    } else {
      params.delete("sort")
    }

    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`
    router.push(newUrl, { scroll: false })
  }, [searchQuery, selectedCategories, sortOption, pathname, router, searchParams])

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  // Handle sort selection
  const handleSortSelect = (option: string) => {
    setSortOption(option)
  }

  return {
    posts: filteredPosts,
    searchQuery,
    selectedCategories,
    sortOption,
    handleSearch,
    handleCategorySelect,
    handleSortSelect,
  }
}
