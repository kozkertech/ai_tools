"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onSearch?: (query: string) => void
  initialQuery?: string
  placeholder?: string
}

export function SearchBar({
  searchQuery = "",
  onSearchChange,
  onSearch,
  initialQuery = "",
  placeholder = "Search posts...",
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery || searchQuery)

  useEffect(() => {
    if (initialQuery !== undefined) {
      setQuery(initialQuery)
    }
  }, [initialQuery])

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
        placeholder={placeholder}
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
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  )
}
