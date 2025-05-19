"use client"

import { Suspense } from "react"
import BlogPageClient from "./BlogPageClient"

export default function BlogPageClientWrapper({ initialPosts, tags }) {
  return (
    <Suspense
      fallback={
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-muted-foreground">Loading blog posts...</p>
        </div>
      }
    >
      <BlogPageClient initialPosts={initialPosts} tags={tags} />
    </Suspense>
  )
}
