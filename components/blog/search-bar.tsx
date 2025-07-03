"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface SearchBarProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onSearch?: (query: string) => void
  initialQuery?: string
}

export function SearchBar({ searchQuery = "", onSearchChange, onSearch, initialQuery = "" }: SearchBarProps) {
  const [query, setQuery] = useState(searchQuery || initialQuery)

  const handleSearch = (value: string) => {
    setQuery(value)
    if (onSearchChange) {
      onSearchChange(value)
    }
    if (onSearch) {
      onSearch(value)
    }
  }

  const clearSearch = () => {
    setQuery("")
    if (onSearchChange) {
      onSearchChange("")
    }
    if (onSearch) {
      onSearch("")
    }
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder="Search posts..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10 pr-10"
      />
      {query && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearSearch}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
