"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  const finalCategories =
    Array.isArray(categories) && categories.length > 0 ? categories : Array.isArray(tags) ? tags : []
  const finalOnSelectCategory = onSelectCategory || onCategoryChange
  const finalSortBy = selectedSortOption !== "newest" ? selectedSortOption : sortBy
  const finalOnSortChange = onSelectSortOption || onSortChange

  const sidebarContent = (
    <div className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            key="all-categories"
            variant={selectedCategory === "all" ? "default" : "ghost"}
            size="sm"
            className="w-full justify-start"
            onClick={() => finalOnSelectCategory && finalOnSelectCategory("all")}
          >
            All Categories
          </Button>
          {finalCategories.map((category) => (
            <Button
              key={category.id || category.slug || category.name}
              variant={selectedCategory === (category.slug || category.name) ? "default" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => finalOnSelectCategory && finalOnSelectCategory(category.slug || category.name)}
            >
              {category.name}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Sort Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sort By</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={finalSortBy} onValueChange={finalOnSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select sort option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
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
