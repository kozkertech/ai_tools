"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const isFreeToolsPage = pathname === "/tools"

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled
          ? isDarkMode
            ? "bg-gray-900/95 backdrop-blur-md shadow-md border-b border-gray-800"
            : "bg-background/95 backdrop-blur-md shadow-sm border-b"
          : "bg-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="KozkerTech Logo" className="h-8 w-auto" />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary relative group",
              pathname === "/" && "text-primary font-semibold",
            )}
          >
            Home
            <span
              className={cn(
                "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 w-0 group-hover:w-full",
                pathname === "/" && "w-full",
              )}
            ></span>
          </Link>

          <Link
            href="/tools"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary relative group",
              isFreeToolsPage && "text-primary font-semibold",
            )}
          >
            Free Tools
            <span
              className={cn(
                "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 w-0 group-hover:w-full",
                isFreeToolsPage && "w-full",
              )}
            ></span>
          </Link>

          <Link
            href="/about"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary relative group",
              pathname === "/about" && "text-primary font-semibold",
            )}
          >
            About
            <span
              className={cn(
                "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 w-0 group-hover:w-full",
                pathname === "/about" && "w-full",
              )}
            ></span>
          </Link>

          <Link
            href="/contact"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary relative group",
              pathname === "/contact" && "text-primary font-semibold",
            )}
          >
            Contact
            <span
              className={cn(
                "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 w-0 group-hover:w-full",
                pathname === "/contact" && "w-full",
              )}
            ></span>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ModeToggle />
          <Button asChild className="hidden md:inline-flex rounded-full">
            <Link href="/contact">Get Started</Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden rounded-full w-9 h-9" onClick={toggleMenu}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in md:hidden bg-background/98 backdrop-blur-md border-t">
          <div className="relative z-20 grid gap-6 rounded-xl p-4 bg-background">
            <Link
              href="/"
              className="flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors hover:bg-primary/10 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="text-base font-medium">Home</span>
            </Link>

            <Link
              href="/tools"
              className="flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors hover:bg-primary/10 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="text-base font-medium">Free Tools</span>
            </Link>

            <Link
              href="/about"
              className="flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors hover:bg-primary/10"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="text-base font-medium">About</span>
            </Link>

            <Link
              href="/contact"
              className="flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors hover:bg-primary/10"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="text-base font-medium">Contact</span>
            </Link>

            <Button asChild className="mt-2 rounded-full">
              <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                Get Started
              </Link>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 rounded-full w-9 h-9"
            onClick={() => setIsMenuOpen(false)}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      )}
    </header>
  )
}
