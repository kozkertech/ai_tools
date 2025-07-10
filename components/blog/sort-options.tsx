"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export type SortOption = {
  label: string
  value: string
}

interface SortOptionsProps {
  options: SortOption[]
  selectedOption: string
  onSelectOption: (value: string) => void
}

export function SortOptions({ options, selectedOption, onSelectOption }: SortOptionsProps) {
  const [open, setOpen] = useState(false)
  const selectedLabel = options.find((option) => option.value === selectedOption)?.label || options[0].label
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-sm font-medium dark:text-white">Sort by</h3>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("justify-between w-full", isDarkMode ? "border-gray-800 bg-gray-900" : "")}
          >
            {selectedLabel}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("w-full p-0", isDarkMode ? "bg-gray-900 border-gray-800" : "")}>
          <Command className={isDarkMode ? "bg-gray-900" : ""}>
            <CommandInput placeholder="Search sort options..." className={isDarkMode ? "border-gray-800" : ""} />
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onSelectOption(currentValue)
                      setOpen(false)
                    }}
                    className={isDarkMode ? "hover:bg-gray-800" : ""}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${selectedOption === option.value ? "opacity-100" : "opacity-0"}`}
                    />
                    <span className={isDarkMode ? "text-white" : ""}>{option.label}</span>
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
