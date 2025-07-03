"use client"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface BlogSidebarProps {
  categories?: any[]
  selectedCategories?: string[]
  onSelectCategory?: (category: string) => void
  sortOptions?: { label: string; value: string }[]
  selectedSortOption?: string
  onSelectSortOption?: (option: string) => void
  isMobileFilterOpen?: boolean
  onCloseMobileFilter?: () => void
  selectedCategory?: string
  onCategoryChange?: (category: string) => void
  sortBy?: string
  onSortChange?: (sort: string) => void
  tags?: any[]
}

export function BlogSidebar({
  categories = [],
  selectedCategories = [],
  onSelectCategory,
  sortOptions = [],
  selectedSortOption = "newest",
  onSelectSortOption,
  isMobileFilterOpen = false,
  onCloseMobileFilter,
  selectedCategory = "all",
  onCategoryChange,
  sortBy = "newest",
  onSortChange,
  tags = [],
}: BlogSidebarProps) {
  // Use the appropriate props based on what's provided
  const finalCategories = categories.length > 0 ? categories : tags
  const finalSelectedCategories = selectedCategories.length > 0 ? selectedCategories : []
  const finalOnSelectCategory = onSelectCategory || onCategoryChange
  const finalSortBy = selectedSortOption !== "newest" ? selectedSortOption : sortBy
  const finalOnSortChange = onSelectSortOption || onSortChange

  const sidebarContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Filter Posts</h3>

        {/* Categories */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Categories</h4>
            <div className="space-y-2">
              <Button
                key="all-categories" // Added key here
                variant={selectedCategory === "all" ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
                onClick={() => finalOnSelectCategory && finalOnSelectCategory("all")}
              >
                All Categories
              </Button>
              {finalCategories.map((category) => (
                <Button
                  key={category.id || category.slug} // Added key here
                  variant={selectedCategory === category.slug ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => finalOnSelectCategory && finalOnSelectCategory(category.slug)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <h4 className="text-sm font-medium mb-2">Sort By</h4>
            <div className="space-y-2">
              {[
                { label: "Newest First", value: "newest" },
                { label: "Oldest First", value: "oldest" },
                { label: "Title A-Z", value: "title" },
              ].map((option) => (
                <Button
                  key={option.value} // Added key here
                  variant={finalSortBy === option.value ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => finalOnSortChange && finalOnSortChange(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Mobile version with Sheet
  if (isMobileFilterOpen) {
    return (
      <Sheet open={isMobileFilterOpen} onOpenChange={onCloseMobileFilter}>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Filter Posts</SheetTitle>
            <Button variant="ghost" size="sm" className="absolute right-4 top-4" onClick={onCloseMobileFilter}>
              <X className="h-4 w-4" />
            </Button>
          </SheetHeader>
          <div className="mt-6">{sidebarContent}</div>
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop version
  return <div className="w-full">{sidebarContent}</div>
}
