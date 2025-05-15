"use client"

import { useState } from "react"
import { SearchBar } from "@/components/blog/search-bar"
import { BlogSidebar } from "@/components/blog/blog-sidebar"
import { BlogGrid } from "@/components/blog/blog-grid"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"
import { useBlogFilter } from "@/hooks/use-blog-filter"
import { useSearchParams } from "next/navigation"

interface BlogContainerProps {
  initialPosts: any[]
  initialTags: any[]
}

export function BlogContainer({ initialPosts, initialTags }: BlogContainerProps) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const searchParams = useSearchParams()

  const {
    posts: filteredPosts,
    searchQuery,
    selectedCategories,
    sortOption,
    handleSearch,
    handleCategorySelect,
    handleSortSelect,
  } = useBlogFilter(initialPosts)

  // Sort options
  const sortOptions = [
    { label: "Newest first", value: "newest" },
    { label: "Oldest first", value: "oldest" },
    { label: "A-Z", value: "a-z" },
    { label: "Z-A", value: "z-a" },
  ]

  return (
    <div className="mt-8 space-y-6">
      <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(selectedCategories.length > 0 || searchQuery) && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">{filteredPosts.length}</span> results
            </p>
          )}
        </div>
        <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setIsMobileFilterOpen(true)}>
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="mt-6 lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <BlogSidebar
            categories={initialTags}
            selectedCategories={selectedCategories}
            onSelectCategory={handleCategorySelect}
            sortOptions={sortOptions}
            selectedSortOption={sortOption}
            onSelectSortOption={handleSortSelect}
            isMobileFilterOpen={isMobileFilterOpen}
            onCloseMobileFilter={() => setIsMobileFilterOpen(false)}
          />
        </div>

        {/* Main content */}
        <div className="mt-6 lg:col-span-3 lg:mt-0">
          <BlogGrid
            posts={filteredPosts}
            emptyMessage={
              searchQuery
                ? `No posts found for "${searchQuery}"`
                : selectedCategories.length > 0
                  ? "No posts found for the selected categories"
                  : "No posts found"
            }
          />
        </div>
      </div>
    </div>
  )
}
