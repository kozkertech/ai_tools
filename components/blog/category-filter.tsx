"use client"

import { useState } from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CategoryFilterProps {
  categories: Array<{
    name: string
    slug: string
    count: number
  }>
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
}

export function CategoryFilter({ categories, selectedCategories, onCategoryChange }: CategoryFilterProps) {
  const [open, setOpen] = useState(false)

  // Filter out hashtag categories (those starting with #)
  const filteredCategories = categories.filter(
    (category) => !category.name.startsWith("#") && !category.slug.startsWith("#"),
  )

  const handleCategoryToggle = (categorySlug: string) => {
    const newCategories = selectedCategories.includes(categorySlug)
      ? selectedCategories.filter((c) => c !== categorySlug)
      : [...selectedCategories, categorySlug]

    onCategoryChange(newCategories)
  }

  const clearAllCategories = () => {
    onCategoryChange([])
  }

  const selectedCategoryNames = filteredCategories
    .filter((cat) => selectedCategories.includes(cat.slug))
    .map((cat) => cat.name)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Categories</h3>
        {selectedCategories.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllCategories}
            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
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
            className="w-full justify-between text-left font-normal bg-transparent"
          >
            {selectedCategories.length === 0 ? (
              <span className="text-muted-foreground">Select categories...</span>
            ) : (
              <span className="truncate">
                {selectedCategories.length === 1
                  ? selectedCategoryNames[0]
                  : `${selectedCategories.length} categories selected`}
              </span>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandList>
              <CommandEmpty>No categories found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-[200px]">
                  {filteredCategories.map((category) => (
                    <CommandItem
                      key={category.slug}
                      value={category.name}
                      onSelect={() => handleCategoryToggle(category.slug)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="flex h-4 w-4 items-center justify-center">
                          {selectedCategories.includes(category.slug) && <Check className="h-3 w-3" />}
                        </div>
                        <span className="truncate">{category.name}</span>
                      </div>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {category.count}
                      </Badge>
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected categories display */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedCategoryNames.map((categoryName, index) => (
            <Badge key={selectedCategories[index]} variant="secondary" className="text-xs flex items-center gap-1">
              {categoryName}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => handleCategoryToggle(selectedCategories[index])}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
