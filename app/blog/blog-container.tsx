"use client"

import { useBlogFilter } from "@/hooks/use-blog-filter"
import { BlogTopBar } from "@/components/blog/blog-top-bar"
import { BlogGrid } from "@/components/blog/blog-grid"

interface BlogContainerProps {
  initialPosts: any[]
  initialTags: any[]
}

export function BlogContainer({ initialPosts = [], initialTags = [] }: BlogContainerProps) {
  const {
    filteredPosts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    categories,
  } = useBlogFilter(initialPosts, initialTags)

  return (
    <div className="space-y-8">
      {/* Top Bar with Search, Sort, and Categories */}
      <BlogTopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        categories={categories}
        totalPosts={filteredPosts.length}
      />

      {/* Blog Posts Grid */}
      <BlogGrid
        posts={filteredPosts}
        emptyMessage={
          searchQuery || selectedCategory !== "all"
            ? "No posts match your current filters. Try adjusting your search or category selection."
            : "No blog posts available at the moment."
        }
      />
    </div>
  )
}
