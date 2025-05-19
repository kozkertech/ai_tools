"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"
import { Menu, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { CurrencySwitcher } from "./currency-switcher"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"

  // Track scroll position to add background when scrolled
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

  // Check if the current path is a services or solutions page
  const isServicesPage = pathname.startsWith("/services")
  const isSolutionsPage = pathname === "/solutions"
  const isPricingPage = pathname === "/pricing"

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
            <span className="text-2xl font-bold text-primary">Kozker</span>
            <span className="text-2xl font-bold">Tech</span>
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

          {/* Services Dropdown - Desktop */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="link"
                className={cn(
                  "p-0 h-auto text-sm font-medium flex items-center gap-1.5 hover:text-primary relative group",
                  isServicesPage && "text-primary font-semibold",
                )}
              >
                <Link href="/services" className="flex items-center gap-1.5">
                  Services
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Link>
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 w-0 group-hover:w-full",
                    isServicesPage && "w-full",
                  )}
                ></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              sideOffset={8}
              className="w-56 p-2 rounded-xl border border-border/50 shadow-lg animate-in fade-in-80 zoom-in-95 dark:bg-gray-900 dark:border-gray-800"
            >
              <DropdownMenuItem asChild>
                <Link
                  href="/services/ai-powered-web-design"
                  className={cn(
                    "w-full cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary flex items-center",
                    pathname === "/services/ai-powered-web-design" && "bg-primary/10 text-primary",
                  )}
                >
                  AI-Powered Web Design
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/services/support-suite"
                  className={cn(
                    "w-full cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary flex items-center",
                    pathname === "/services/support-suite" && "bg-primary/10 text-primary",
                  )}
                >
                  24×7 Support Suite
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/services/whatsapp-automation"
                  className={cn(
                    "w-full cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary flex items-center",
                    pathname === "/services/whatsapp-automation" && "bg-primary/10 text-primary",
                  )}
                >
                  WhatsApp Automation
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/services/bi-analytics"
                  className={cn(
                    "w-full cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary flex items-center",
                    pathname === "/services/bi-analytics" && "bg-primary/10 text-primary",
                  )}
                >
                  BI & Analytics Solutions
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/services/cloud-data-integration"
                  className={cn(
                    "w-full cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary flex items-center",
                    pathname === "/services/cloud-data-integration" && "bg-primary/10 text-primary",
                  )}
                >
                  Cloud & Data Integration
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Solutions - Desktop */}
          <Link
            href="/solutions"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary relative group",
              isSolutionsPage && "text-primary font-semibold",
            )}
          >
            Solutions
            <span
              className={cn(
                "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 w-0 group-hover:w-full",
                isSolutionsPage && "w-full",
              )}
            ></span>
          </Link>

          {/* Pricing - Desktop */}
          <Link
            href="/pricing"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary relative group",
              isPricingPage && "text-primary font-semibold",
            )}
          >
            Pricing
            <span
              className={cn(
                "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 w-0 group-hover:w-full",
                isPricingPage && "w-full",
              )}
            ></span>
          </Link>

          <Link
            href="/blog"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary relative group",
              pathname === "/blog" && "text-primary font-semibold",
            )}
          >
            Blog
            <span
              className={cn(
                "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 w-0 group-hover:w-full",
                pathname === "/blog" && "w-full",
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
            Contact Us
            <span
              className={cn(
                "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 w-0 group-hover:w-full",
                pathname === "/contact" && "w-full",
              )}
            ></span>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <CurrencySwitcher />
          <ModeToggle />
          <Button asChild className="hidden md:inline-flex rounded-full">
            <Link href="/contact">Get Started</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full w-9 h-9 dark:text-gray-200 dark:hover:bg-gray-800"
            onClick={toggleMenu}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in md:hidden",
          isDarkMode ? "bg-gray-900/95 backdrop-blur-md" : "bg-background/95 backdrop-blur-md",
          isMenuOpen ? "slide-in-from-top-80" : "hidden",
        )}
      >
        <div className="relative z-20 grid gap-6 rounded-xl p-4 dark:bg-gray-900 bg-background">
          <Link
            href="/"
            className={cn(
              "flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors hover:bg-primary/10",
              pathname === "/" && "text-primary font-semibold bg-primary/10",
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="text-base font-medium">Home</span>
          </Link>

          {/* Services Section - Mobile */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Link
                href="/services"
                className={cn(
                  "flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors hover:bg-primary/10 flex-1",
                  pathname === "/services" && "text-primary font-semibold bg-primary/10",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-base font-medium">Services</span>
              </Link>
            </div>
            <div className="pl-4 border-l-2 border-primary/20 space-y-2 ml-3">
              <Link
                href="/services/ai-powered-web-design"
                className={cn(
                  "flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors hover:bg-primary/10",
                  pathname === "/services/ai-powered-web-design" && "text-primary bg-primary/10",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-sm font-medium">AI-Powered Web Design</span>
              </Link>
              <Link
                href="/services/support-suite"
                className={cn(
                  "flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors hover:bg-primary/10",
                  pathname === "/services/support-suite" && "text-primary bg-primary/10",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-sm font-medium">24×7 Support Suite</span>
              </Link>
              <Link
                href="/services/whatsapp-automation"
                className={cn(
                  "flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors hover:bg-primary/10",
                  pathname === "/services/whatsapp-automation" && "text-primary bg-primary/10",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-sm font-medium">WhatsApp Automation</span>
              </Link>
              <Link
                href="/services/bi-analytics"
                className={cn(
                  "flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors hover:bg-primary/10",
                  pathname === "/services/bi-analytics" && "text-primary bg-primary/10",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-sm font-medium">BI & Analytics Solutions</span>
              </Link>
              <Link
                href="/services/cloud-data-integration"
                className={cn(
                  "flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors hover:bg-primary/10",
                  pathname === "/services/cloud-data-integration" && "text-primary bg-primary/10",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-sm font-medium">Cloud & Data Integration</span>
              </Link>
            </div>
          </div>

          {/* Solutions - Mobile */}
          <Link
            href="/solutions"
            className={cn(
              "flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors hover:bg-primary/10",
              isSolutionsPage && "text-primary font-semibold bg-primary/10",
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="text-base font-medium">Solutions</span>
          </Link>

          {/* Pricing - Mobile */}
          <Link
            href="/pricing"
            className={cn(
              "flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors hover:bg-primary/10",
              isPricingPage && "text-primary font-semibold bg-primary/10",
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="text-base font-medium">Pricing</span>
          </Link>

          <Link
            href="/blog"
            className={cn(
              "flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors hover:bg-primary/10",
              pathname === "/blog" && "text-primary font-semibold bg-primary/10",
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="text-base font-medium">Blog</span>
          </Link>

          <Link
            href="/contact"
            className={cn(
              "flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors hover:bg-primary/10",
              pathname === "/contact" && "text-primary font-semibold bg-primary/10",
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="text-base font-medium">Contact Us</span>
          </Link>

          <div className="flex items-center gap-2 mt-2">
            <CurrencySwitcher />
            <ModeToggle />
          </div>

          <Button asChild className="mt-2 rounded-full">
            <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
              Get Started
            </Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 rounded-full w-9 h-9 dark:text-gray-200 dark:hover:bg-gray-800"
          onClick={() => setIsMenuOpen(false)}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
    </header>
  )
}
