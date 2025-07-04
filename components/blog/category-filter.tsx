"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface CategoryFilterProps {
  categories: { id: string; name: string; slug: string; count?: { posts: number } }[]
  selectedCategories: string[]
  onSelectCategory: (category: string) => void
}

export function CategoryFilter({ categories = [], selectedCategories = [], onSelectCategory }: CategoryFilterProps) {
  const [open, setOpen] = useState(false)

  // Filter out hashtag-style tags (tags that start with #)
  const filteredCategories = categories.filter(
    (category) =>
      !category.name.startsWith("#") &&
      !category.slug.startsWith("#") &&
      category.name.toLowerCase() !== "hash-toc-guide" &&
      category.name.toLowerCase() !== "hash-tools" &&
      category.name.toLowerCase() !== "hash-notion",
  )

  const safeCategories = Array.isArray(filteredCategories) ? filteredCategories : []
  const safeSelectedCategories = Array.isArray(selectedCategories) ? selectedCategories : []

  const selectedCategoryNames = safeSelectedCategories
    .map((slug) => safeCategories.find((cat) => cat.slug === slug)?.name)
    .filter(Boolean)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Filter by Category</h3>
        {safeSelectedCategories.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => safeSelectedCategories.forEach((cat) => onSelectCategory(cat))}
          >
            Clear all
          </Button>
        )}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-[40px] px-3 py-2 bg-transparent"
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {safeSelectedCategories.length === 0 ? (
                <span className="text-muted-foreground">Select categories...</span>
              ) : (
                selectedCategoryNames.slice(0, 2).map((name) => (
                  <Badge key={name} variant="secondary" className="text-xs">
                    {name}
                  </Badge>
                ))
              )}
              {safeSelectedCategories.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{safeSelectedCategories.length - 2} more
                </Badge>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search categories..." className="h-9" />
            <CommandList>
              <CommandEmpty>No categories found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-[200px]">
                  {safeCategories.map((category) => (
                    <CommandItem
                      key={category.id}
                      value={category.slug}
                      onSelect={() => {
                        onSelectCategory(category.slug)
                      }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            safeSelectedCategories.includes(category.slug) ? "opacity-100" : "opacity-0",
                          )}
                        />
                        <span>{category.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {category.count?.posts || 0}
                      </Badge>
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Categories Display */}
      {safeSelectedCategories.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Selected categories:</p>
          <div className="flex flex-wrap gap-2">
            {safeSelectedCategories.map((slug) => {
              const category = safeCategories.find((c) => c.slug === slug)
              return (
                <Badge key={slug} variant="default" className="flex items-center gap-1 text-xs">
                  {category?.name}
                  <button
                    className="ml-1 rounded-full outline-none hover:bg-primary/20 p-0.5"
                    onClick={() => onSelectCategory(slug)}
                    aria-label={`Remove ${category?.name}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
