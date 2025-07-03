"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface SortOptionsProps {
  sortBy: string
  onSortChange: (value: string) => void
}

const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Title A-Z", value: "title" },
]

export function SortOptions({ sortBy, onSortChange }: SortOptionsProps) {
  const [open, setOpen] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"

  const currentSortLabel = sortOptions.find((option) => option.value === sortBy)?.label || "Sort by"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between w-full", isDarkMode ? "border-gray-800 bg-gray-900" : "")}
        >
          {currentSortLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-full p-0", isDarkMode ? "bg-gray-900 border-gray-800" : "")} align="start">
        <Command className={isDarkMode ? "bg-gray-900" : ""}>
          <CommandList>
            <CommandEmpty>No sort options found.</CommandEmpty>
            <CommandGroup>
              {sortOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    onSortChange(option.value)
                    setOpen(false)
                  }}
                  className={isDarkMode ? "hover:bg-gray-800" : ""}
                >
                  <Check className={cn("mr-2 h-4 w-4", sortBy === option.value ? "opacity-100" : "opacity-0")} />
                  <span className={isDarkMode ? "text-white" : ""}>{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
