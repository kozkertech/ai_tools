"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Filter } from "lucide-react"

interface BlogSidebarProps {
  categories: any[]
  selectedCategories: string[]
  onSelectCategory: (category: string) => void
  sortOptions: { label: string; value: string }[]
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
  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Sort Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sort By</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedSortOption} onValueChange={onSelectSortOption}>
            <SelectTrigger>
              <SelectValue placeholder="Select sort option" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Categories */}
      {categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.slug} className="flex items-center justify-between">
                  <Button
                    variant={selectedCategories.includes(category.slug) ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onSelectCategory(category.slug)}
                    className="justify-start flex-1"
                  >
                    {category.name}
                  </Button>
                  {selectedCategories.includes(category.slug) && (
                    <Badge variant="secondary" className="ml-2">
                      ✓
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters */}
      {selectedCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((categorySlug) => {
                const category = categories.find((cat) => cat.slug === categorySlug)
                return (
                  <Badge key={categorySlug} variant="secondary" className="flex items-center gap-1">
                    {category?.name || categorySlug}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectCategory(categorySlug)}
                      className="h-4 w-4 p-0 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileFilterOpen} onOpenChange={onCloseMobileFilter}>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
