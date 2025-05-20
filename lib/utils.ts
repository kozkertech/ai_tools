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
  if (!html) return ""

  // Remove HTML tags
  const text = html.replace(/<\/?[^>]+(>|$)/g, "")

  // Remove extra whitespace
  const cleanText = text.replace(/\s+/g, " ").trim()

  // Truncate to maxLength
  if (cleanText.length <= maxLength) return cleanText

  // Find the last space before maxLength
  const lastSpace = cleanText.lastIndexOf(" ", maxLength)
  return lastSpace > 0 ? cleanText.substring(0, lastSpace) + "..." : cleanText.substring(0, maxLength) + "..."
}

/**
 * Normalizes a URL to prevent double slashes
 * @param baseUrl The base URL (e.g., https://example.com)
 * @param path The path to append (e.g., /blog)
 * @returns A properly formatted URL without double slashes
 */
export function normalizeUrl(baseUrl: string, path?: string): string {
  // Remove trailing slash from baseUrl
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl

  // If no path is provided, return the normalized base
  if (!path) return normalizedBase

  // Ensure path starts with a slash
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  return `${normalizedBase}${normalizedPath}`
}
