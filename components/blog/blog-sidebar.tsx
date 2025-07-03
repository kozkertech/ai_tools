"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryFilter } from "./category-filter"
import { SortOptions } from "./sort-options"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { X, Filter } from "lucide-react"

interface BlogSidebarProps {
  categories: { id: string; name: string; slug: string; count?: { posts: number } }[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  isMobileFilterOpen?: boolean
  onCloseMobileFilter?: () => void
}

export function BlogSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  isMobileFilterOpen,
  onCloseMobileFilter,
}: BlogSidebarProps) {
  const sidebarContent = (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={onCategoryChange}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sort By</CardTitle>
        </CardHeader>
        <CardContent>
          <SortOptions sortBy={sortBy} onSortChange={onSortChange} />
        </CardContent>
      </Card>
    </div>
  )

  // Mobile version with Sheet
  if (isMobileFilterOpen) {
    return (
      <Sheet open={isMobileFilterOpen} onOpenChange={onCloseMobileFilter}>
        <SheetContent side="left" className="w-80 p-6">
          <SheetHeader className="flex flex-row items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={onCloseMobileFilter}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close filters</span>
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
