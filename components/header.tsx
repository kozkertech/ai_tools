"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">Kozker</span>
            <span className="text-2xl font-bold">Tech</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/solutions" className="text-sm font-medium transition-colors hover:text-primary">
            Solutions
          </Link>
          <Link href="/blog" className="text-sm font-medium transition-colors hover:text-primary">
            Blog
          </Link>
          <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
            Contact Us
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button asChild className="hidden md:inline-flex">
            <Link href="/contact">Get Started</Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in md:hidden bg-background",
          isMenuOpen ? "slide-in-from-top-80" : "hidden",
        )}
      >
        <div className="relative z-20 grid gap-6 rounded-md bg-background p-4">
          <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
            <span className="text-lg font-bold">Home</span>
          </Link>
          <Link href="/solutions" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
            <span className="text-lg font-bold">Solutions</span>
          </Link>
          <Link href="/blog" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
            <span className="text-lg font-bold">Blog</span>
          </Link>
          <Link href="/contact" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
            <span className="text-lg font-bold">Contact Us</span>
          </Link>
          <Button asChild>
            <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
              Get Started
            </Link>
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={() => setIsMenuOpen(false)}>
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
    </header>
  )
}
