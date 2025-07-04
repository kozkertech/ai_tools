"use client"

import { useEffect } from "react"

interface GhostContentProps {
  html: string
  className?: string
}

export function GhostContent({ html, className = "" }: GhostContentProps) {
  useEffect(() => {
    // Add syntax highlighting after content is rendered
    if (typeof window !== "undefined") {
      // Load Prism.js dynamically for syntax highlighting
      const loadPrism = async () => {
        try {
          const Prism = await import("prismjs")
          await import("prismjs/components/prism-javascript")
          await import("prismjs/components/prism-typescript")
          await import("prismjs/components/prism-jsx")
          await import("prismjs/components/prism-tsx")
          await import("prismjs/components/prism-css")
          await import("prismjs/components/prism-json")
          await import("prismjs/components/prism-bash")
          await import("prismjs/components/prism-python")
          await import("prismjs/components/prism-sql")

          Prism.highlightAll()
        } catch (error) {
          console.log("Prism.js not available, using fallback styling")
        }
      }

      loadPrism()
    }
  }, [html])

  return <div className={`ghost-content ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
}
