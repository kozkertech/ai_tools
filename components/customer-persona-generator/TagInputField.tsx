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
            className="group px-3 py-1 bg-zinc-800 border-white/5 text-gray-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            {tag}
            <button 
              type="button" 
              onClick={() => removeTag(index)}
              className="p-0.5 rounded-full hover:bg-zinc-700 text-gray-500 hover:text-red-400 transition-colors"
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
          className="bg-zinc-900/50 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 h-10 pr-10"
        />
        <button
          type="button"
          onClick={addTag}
          className={`absolute inset-y-0 right-0 px-3 flex items-center transition-colors ${
            inputValue.trim() ? "text-primary hover:text-primary-dark" : "text-gray-600 cursor-not-allowed"
          }`}
          disabled={!inputValue.trim()}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
