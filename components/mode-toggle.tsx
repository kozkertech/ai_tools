"use client"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isDarkMode = resolvedTheme === "dark"

  // Ensure we only render theme-dependent UI after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className={cn("rounded-full w-9 h-9", isDarkMode ? "border-gray-800 bg-gray-900" : "border-primary/20")}
      >
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "rounded-full w-9 h-9 relative overflow-hidden",
            isDarkMode ? "border-gray-800 bg-gray-900" : "border-primary/20",
          )}
          aria-label="Toggle theme"
        >
          <Sun
            className={`h-[1.2rem] w-[1.2rem] transition-all duration-500 ${
              currentTheme === "dark" ? "rotate-90 opacity-0 scale-0" : "rotate-0 opacity-100 scale-100"
            }`}
          />
          <Moon
            className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 ${
              currentTheme === "dark" ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-0"
            }`}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn(
          "min-w-[8rem] rounded-xl p-1 border shadow-lg",
          isDarkMode ? "bg-gray-900 border-gray-800" : "border-border/50",
        )}
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            currentTheme === "light" ? "bg-primary/10 text-primary" : "hover:bg-accent"
          }`}
        >
          <Sun className="h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            currentTheme === "dark" ? "bg-primary/10 text-primary" : "hover:bg-accent"
          }`}
        >
          <Moon className="h-4 w-4" />
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
