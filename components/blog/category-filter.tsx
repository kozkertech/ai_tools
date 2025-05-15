"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CategoryFilterProps {
  categories: { id: string; name: string; slug: string; count?: { posts: number } }[]
  selectedCategories: string[]
  onSelectCategory: (category: string) => void
}

export function CategoryFilter({ categories, selectedCategories, onSelectCategory }: CategoryFilterProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Categories</h3>
        {selectedCategories.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-xs text-muted-foreground"
            onClick={() => selectedCategories.forEach((cat) => onSelectCategory(cat))}
          >
            Clear all
          </Button>
        )}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between w-full">
            {selectedCategories.length > 0 ? `${selectedCategories.length} selected` : "Select categories"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandList>
              <CommandEmpty>No categories found.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.slug}
                    onSelect={() => {
                      onSelectCategory(category.slug)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCategories.includes(category.slug) ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span>{category.name}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {category.count?.posts || 0}
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedCategories.map((slug) => {
            const category = categories.find((c) => c.slug === slug)
            return (
              <Badge key={slug} variant="secondary" className="flex items-center gap-1">
                {category?.name}
                <button
                  className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-primary"
                  onClick={() => onSelectCategory(slug)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                  <span className="sr-only">Remove {category?.name}</span>
                </button>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
