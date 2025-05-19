"use client"

import { Suspense } from "react"
import Header from "./header"

export default function HeaderWrapper() {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-50 w-full h-16 bg-background/95 backdrop-blur-md shadow-sm border-b">
          <div className="container flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <a href="/" className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">Kozker</span>
                <span className="text-2xl font-bold">Tech</span>
              </a>
            </div>
          </div>
        </header>
      }
    >
      <Header />
    </Suspense>
  )
}
