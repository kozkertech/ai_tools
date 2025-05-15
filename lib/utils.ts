import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function for combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date for display
export function formatDate(date: string): string {
  const d = new Date(date)
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Extract excerpt from HTML content
export function extractExcerpt(html: string, maxLength = 200): string {
  // Remove HTML tags
  const text = html.replace(/<\/?[^>]+(>|$)/g, "")

  // Truncate to maxLength
  if (text.length <= maxLength) return text

  // Find the last space before maxLength
  const lastSpace = text.lastIndexOf(" ", maxLength)
  return text.substring(0, lastSpace) + "..."
}
