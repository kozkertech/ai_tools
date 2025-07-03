"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type SortOption = {
  label: string
  value: string
}

interface SortOptionsProps {
  options: SortOption[]
  selectedOption: string
  onSelectOption: (value: string) => void
}

export function SortOptions({ options = [], selectedOption, onSelectOption }: SortOptionsProps) {
  const safeSortOptions = Array.isArray(options) ? options : []

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Sort By</h4>
      <Select value={selectedOption} onValueChange={onSelectOption}>
        <SelectTrigger>
          <SelectValue placeholder="Select sort option" />
        </SelectTrigger>
        <SelectContent>
          {safeSortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
