"use client"

import { CategoryFilter } from "./category-filter"
import { SortOptions, type SortOption } from "./sort-options"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface BlogSidebarProps {
  categories: { id: string; name: string; slug: string; count?: { posts: number } }[]
  selectedCategories: string[]
  onSelectCategory: (category: string) => void
  sortOptions: SortOption[]
  selectedSortOption: string
  onSelectSortOption: (option: string) => void
  isMobileFilterOpen: boolean
  onCloseMobileFilter: () => void
}

export function BlogSidebar({
  categories,
  selectedCategories,
  onSelectCategory,
  sortOptions,
  selectedSortOption,
  onSelectSortOption,
  isMobileFilterOpen,
  onCloseMobileFilter,
}: BlogSidebarProps) {
  return (
    <div
      className={`space-y-6 lg:block ${
        isMobileFilterOpen
          ? "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:static lg:bg-transparent lg:backdrop-blur-none"
          : "hidden"
      }`}
    >
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 lg:static lg:w-auto lg:p-0 lg:ring-0 ${
          isMobileFilterOpen ? "block" : "hidden lg:block"
        }`}
      >
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button variant="ghost" size="icon" onClick={onCloseMobileFilter}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <div className="space-y-6">
          <CategoryFilter
            categories={categories}
            selectedCategories={selectedCategories}
            onSelectCategory={onSelectCategory}
          />
          <SortOptions options={sortOptions} selectedOption={selectedSortOption} onSelectOption={onSelectSortOption} />
        </div>
      </div>
    </div>
  )
}
