"use client"

import { useState, KeyboardEvent } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { X, Plus } from "lucide-react"

interface TagInputFieldProps {
  label: string
  tags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder?: string
}

export function TagInputField({ label, tags, onTagsChange, placeholder = "Add new..." }: TagInputFieldProps) {
  const [inputValue, setInputValue] = useState("")

  const addTag = () => {
    const trimmedValue = inputValue.trim()
    if (trimmedValue && !tags.includes(trimmedValue)) {
      onTagsChange([...tags, trimmedValue])
      setInputValue("")
    }
  }

  const removeTag = (indexToRemove: number) => {
    onTagsChange(tags.filter((_, index) => index !== indexToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <Badge 
            key={index} 
            variant="secondary" 
            className="group px-3 py-1 bg-[var(--mist)] border border-[var(--iron)] text-[var(--night)] flex items-center gap-1.5"
          >
            {tag}
            <button 
              type="button" 
              onClick={() => removeTag(index)}
              className="p-0.5 rounded-full text-[var(--steel)] hover:text-[#ef4444] transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
      
      <div className="relative">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="input h-10 pr-10"
        />
        <button
          type="button"
          onClick={addTag}
          className={`absolute inset-y-0 right-0 px-3 flex items-center transition-colors ${
            inputValue.trim() ? "text-[#ff7a59]" : "text-[var(--steel)] cursor-not-allowed"
          }`}
          disabled={!inputValue.trim()}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
