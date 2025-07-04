"use client"

import { useState } from "react"
import { Search, Filter, SortAsc, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

interface BlogTopBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  categories: Array<{ id: string; name: string; slug: string }>
  totalPosts: number
}

export function BlogTopBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  categories = [],
  totalPosts,
}: BlogTopBarProps) {
  const [categoryOpen, setCategoryOpen] = useState(false)

  // Filter out categories with '#' symbol
  const visibleCategories = categories.filter((category) => !category.name.includes("#"))

  const selectedCategoryName = visibleCategories.find((cat) => cat.slug === selectedCategory)?.name || "All Categories"

  const clearSearch = () => {
    onSearchChange("")
  }

  const clearCategory = () => {
    onCategoryChange("all")
  }

  return (
    <div className="space-y-4">
      {/* Main Top Bar */}
      <div className="flex flex-col gap-4 p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
        {/* Top Row - Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search posts by title, content, or author..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-10 h-11"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <SortAsc className="h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-[180px] h-11">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bottom Row - Categories Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Categories:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Selector */}
            <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={categoryOpen}
                  className="justify-between min-w-[200px] h-9 bg-transparent"
                >
                  {selectedCategoryName}
                  <Filter className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search categories..." />
                  <CommandList>
                    <CommandEmpty>No categories found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="all"
                        onSelect={() => {
                          onCategoryChange("all")
                          setCategoryOpen(false)
                        }}
                      >
                        All Categories
                      </CommandItem>
                      {visibleCategories.map((category) => (
                        <CommandItem
                          key={category.id}
                          value={category.slug}
                          onSelect={() => {
                            onCategoryChange(category.slug)
                            setCategoryOpen(false)
                          }}
                        >
                          {category.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Active Category Badge */}
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {selectedCategoryName}
                <button
                  onClick={clearCategory}
                  className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-primary"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove category filter</span>
                </button>
              </Badge>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm text-muted-foreground">
            {totalPosts} {totalPosts === 1 ? "post" : "posts"} found
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== "all" && ` in ${selectedCategoryName}`}
          </span>

          {/* Clear All Filters */}
          {(searchQuery || selectedCategory !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clearSearch()
                clearCategory()
              }}
              className="text-xs"
            >
              Clear all filters
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
