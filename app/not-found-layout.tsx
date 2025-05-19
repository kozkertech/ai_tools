import type { ReactNode } from "react"
import { Inter } from "next/font/google"
import "./globals.css"

// Optimize font loading
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
})

export default function NotFoundLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <title>404 - Page Not Found | KozkerTech</title>
        <meta name="description" content="The page you are looking for doesn't exist or has been moved." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
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
          <main className="flex-1">{children}</main>
          <footer className="border-t py-6 md:py-8">
            <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6 lg:px-8">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} KozkerTech. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
