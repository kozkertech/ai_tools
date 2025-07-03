"use client"

import { CategoryFilter } from "./category-filter"
import { SortOptions, type SortOption } from "./sort-options"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

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
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"

  return (
    <div
      className={cn(
        "space-y-6 lg:block",
        isMobileFilterOpen
          ? "fixed inset-0 z-50 backdrop-blur-sm lg:static lg:bg-transparent lg:backdrop-blur-none"
          : "",
        isDarkMode ? "bg-gray-900/80 lg:bg-transparent" : "bg-background/80 lg:bg-transparent",
        !isMobileFilterOpen ? "hidden" : "",
      )}
    >
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full overflow-y-auto p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 lg:static lg:w-auto lg:p-0 lg:ring-0",
          isMobileFilterOpen ? "block" : "hidden lg:block",
          isDarkMode ? "bg-gray-900 sm:ring-gray-800" : "bg-background",
        )}
      >
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <h2 className="text-lg font-semibold dark:text-white">Filters</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCloseMobileFilter}
            className="dark:text-gray-300 dark:hover:bg-gray-800"
          >
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
