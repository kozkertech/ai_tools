"use client"

import { useEffect } from "react"

interface GhostContentProps {
  html: string
  className?: string
}

export function GhostContent({ html, className = "" }: GhostContentProps) {
  useEffect(() => {
    // Load Prism.js for syntax highlighting
    const loadPrism = async () => {
      if (typeof window !== "undefined") {
        try {
          // Dynamically import Prism.js
          const Prism = (await import("prismjs")).default

          // Import common language support
          await import("prismjs/components/prism-javascript")
          await import("prismjs/components/prism-typescript")
          await import("prismjs/components/prism-jsx")
          await import("prismjs/components/prism-tsx")
          await import("prismjs/components/prism-css")
          await import("prismjs/components/prism-scss")
          await import("prismjs/components/prism-json")
          await import("prismjs/components/prism-python")
          await import("prismjs/components/prism-bash")
          await import("prismjs/components/prism-sql")
          await import("prismjs/components/prism-yaml")
          await import("prismjs/components/prism-markdown")

          // Highlight all code blocks
          Prism.highlightAll()
        } catch (error) {
          console.warn("Failed to load Prism.js for syntax highlighting:", error)
        }
      }
    }

    // Load Prism after content is rendered
    const timer = setTimeout(loadPrism, 100)
    return () => clearTimeout(timer)
  }, [html])

  return <div className={`ghost-content ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
}
