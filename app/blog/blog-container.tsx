"use client"

import { useState } from "react"
import { useBlogFilter } from "@/hooks/use-blog-filter"
import { BlogGrid } from "@/components/blog/blog-grid"
import { BlogSidebar } from "@/components/blog/blog-sidebar"
import { SearchBar } from "@/components/blog/search-bar"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"

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

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 mt-8">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <BlogSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col gap-6">
        {/* Search Bar and Mobile Filter Trigger */}
        <div className="flex items-center gap-4">
          <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden shrink-0 bg-transparent"
            onClick={() => setIsMobileFilterOpen(true)}
          >
            <Filter className="h-5 w-5" />
            <span className="sr-only">Open filters</span>
          </Button>
        </div>

        {/* Blog Grid */}
        <BlogGrid posts={filteredPosts} />
      </div>

      {/* Mobile Filter Sheet */}
      <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
        <SheetContent side="left" className="w-80 p-6">
          <BlogSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            isMobileFilterOpen={isMobileFilterOpen}
            onCloseMobileFilter={() => setIsMobileFilterOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
