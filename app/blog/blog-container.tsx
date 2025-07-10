"use client"

import { useState } from "react"
import { BlogGrid } from "@/components/blog/blog-grid"
import { BlogSidebar } from "@/components/blog/blog-sidebar"
import { SearchBar } from "@/components/blog/search-bar"
import { FeaturedPost } from "@/components/featured-post"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { useBlogFilter } from "@/hooks/use-blog-filter"
import { searchPosts } from "@/lib/blog-data"

interface BlogContainerProps {
  initialPosts: any[]
  initialTags: any[]
}

export function BlogContainer({ initialPosts, initialTags }: BlogContainerProps) {
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const { filteredPosts, selectedCategories, selectedSortOption, handleCategorySelect, handleSortSelect, sortOptions } =
    useBlogFilter(searchResults.length > 0 ? searchResults : initialPosts, initialTags)

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    try {
      const results = await searchPosts(query)
      setSearchResults(results)
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const featuredPost = initialPosts[0]

  return (
    <div className="mt-8 md:mt-12">
      {/* Featured Post */}
      {featuredPost && !searchResults.length && (
        <div className="mb-12">
          <FeaturedPost post={featuredPost} />
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} isLoading={isSearching} />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden">
          <Button variant="outline" onClick={() => setIsMobileFilterOpen(true)} className="w-full justify-start">
            <Filter className="mr-2 h-4 w-4" />
            Filters & Sort
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <BlogGrid
            posts={filteredPosts}
            emptyMessage={
              searchResults.length > 0
                ? "No posts found matching your search"
                : selectedCategories.length > 0
                  ? "No posts found for selected categories"
                  : "No posts available"
            }
          />
        </div>

        {/* Sidebar */}
        <div className="lg:w-80">
          <BlogSidebar
            categories={initialTags}
            selectedCategories={selectedCategories}
            onSelectCategory={handleCategorySelect}
            sortOptions={sortOptions}
            selectedSortOption={selectedSortOption}
            onSelectSortOption={handleSortSelect}
            isMobileFilterOpen={isMobileFilterOpen}
            onCloseMobileFilter={() => setIsMobileFilterOpen(false)}
          />
        </div>
      </div>
    </div>
  )
}
