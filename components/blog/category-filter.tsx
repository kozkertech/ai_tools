"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface CategoryFilterProps {
  categories: { id: string; name: string; slug: string; count?: { posts: number } }[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export function CategoryFilter({ categories = [], selectedCategory = "all", onSelectCategory }: CategoryFilterProps) {
  const [open, setOpen] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"

  const safeCategories = Array.isArray(categories) ? categories : []

  const currentCategoryName = safeCategories.find((cat) => cat.slug === selectedCategory)?.name || "Select category"

  return (
    <div className="flex flex-col space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("justify-between w-full", isDarkMode ? "border-gray-800 bg-gray-900" : "")}
          >
            {currentCategoryName}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("w-full p-0", isDarkMode ? "bg-gray-900 border-gray-800" : "")} align="start">
          <Command className={isDarkMode ? "bg-gray-900" : ""}>
            <CommandInput placeholder="Search categories..." className={isDarkMode ? "border-gray-800" : ""} />
            <CommandList>
              <CommandEmpty>No categories found.</CommandEmpty>
              <CommandGroup>
                {safeCategories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.slug}
                    onSelect={() => {
                      onSelectCategory(category.slug)
                      setOpen(false)
                    }}
                    className={isDarkMode ? "hover:bg-gray-800" : ""}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", selectedCategory === category.slug ? "opacity-100" : "opacity-0")}
                    />
                    <span className={isDarkMode ? "text-white" : ""}>{category.name}</span>
                    {category.count && category.count.posts > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {category.count.posts}
                      </Badge>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
