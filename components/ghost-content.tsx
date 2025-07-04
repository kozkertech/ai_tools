"use client"

import { useEffect, useRef } from "react"

interface GhostContentProps {
  html: string
}

export function GhostContent({ html }: GhostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return

    // Add IDs to headings for table of contents
    const addHeadingIds = () => {
      const headings = contentRef.current?.querySelectorAll("h1, h2, h3, h4, h5, h6")
      headings?.forEach((heading, index) => {
        if (!heading.id) {
          const text = heading.textContent || ""
          const id =
            text
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "") || `heading-${index}`
          heading.id = id
        }
      })
    }

    // Load Prism.js for syntax highlighting
    const loadPrism = async () => {
      try {
        // Dynamically import Prism.js
        const Prism = (await import("prismjs")).default

        // Import common language components
        await Promise.all([
          import("prismjs/components/prism-javascript"),
          import("prismjs/components/prism-typescript"),
          import("prismjs/components/prism-python"),
          import("prismjs/components/prism-css"),
          import("prismjs/components/prism-sql"),
          import("prismjs/components/prism-json"),
          import("prismjs/components/prism-bash"),
          import("prismjs/components/prism-yaml"),
          import("prismjs/components/prism-markdown"),
        ])

        // Process code blocks
        const codeBlocks = contentRef.current?.querySelectorAll("pre code")
        codeBlocks?.forEach((block) => {
          const pre = block.parentElement
          if (pre) {
            // Try to detect language from class names
            const className = block.className || ""
            const languageMatch = className.match(/language-(\w+)/)
            const language = languageMatch ? languageMatch[1] : "text"

            // Add language attribute to pre element
            pre.setAttribute("data-language", language)

            // Add language class if not present
            if (!block.classList.contains(`language-${language}`)) {
              block.classList.add(`language-${language}`)
            }
          }
        })

        // Highlight all code blocks
        Prism.highlightAllUnder(contentRef.current)
      } catch (error) {
        console.warn("Failed to load syntax highlighting:", error)
      }
    }

    // Add heading IDs first
    addHeadingIds()

    // Then load syntax highlighting
    loadPrism()
  }, [html])

  return <div ref={contentRef} className="ghost-content" dangerouslySetInnerHTML={{ __html: html }} />
}

// Extend window type for Prism
declare global {
  interface Window {
    Prism: any
  }
}
