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
    <header className="top-nav w-full">
      <div className="top-nav-inner">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="KozkerTech Logo" className="h-8 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={cn(
                "text-[14px] font-medium transition-colors hover:text-[var(--night)] text-[var(--steel)]",
                pathname === "/" && "text-[var(--night)] font-semibold",
              )}
            >
              Home
            </Link>

            <Link
              href="/tools"
              className={cn(
                "text-[14px] font-medium transition-colors hover:text-[var(--night)] text-[var(--steel)]",
                isFreeToolsPage && "text-[var(--night)] font-semibold",
              )}
            >
              Free Tools
            </Link>

            <Link
              href="/about"
              className={cn(
                "text-[14px] font-medium transition-colors hover:text-[var(--night)] text-[var(--steel)]",
                pathname === "/about" && "text-[var(--night)] font-semibold",
              )}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={cn(
                "text-[14px] font-medium transition-colors hover:text-[var(--night)] text-[var(--steel)]",
                pathname === "/contact" && "text-[var(--night)] font-semibold",
              )}
            >
              Contact
            </Link>
          </nav>
        </div>

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
        <div className="fixed inset-0 top-[72px] z-50 grid h-[calc(100vh-72px)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in md:hidden bg-[var(--white)] backdrop-blur-md border-t border-[var(--mist)]">
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
