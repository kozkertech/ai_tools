"use client"

import * as React from "react"
import { ChevronRightIcon, HomeIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  separator?: React.ReactNode
  homeLink?: string
}

export function Breadcrumbs({
  className,
  separator = <ChevronRightIcon className="h-4 w-4" />,
  homeLink = "/",
  ...props
}: BreadcrumbsProps) {
  const pathname = usePathname()
  const pathSegments = pathname.split("/").filter(Boolean)

  const breadcrumbItems: BreadcrumbItem[] = React.useMemo(() => {
    const items: BreadcrumbItem[] = []
    let currentPath = ""

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
      items.push({ label, href: currentPath })
    })

    return items
  }, [pathname, pathSegments])

  return (
    <nav aria-label="Breadcrumb" className={cn("flex", className)} {...props}>
      <ol className="flex items-center space-x-1 text-sm text-muted-foreground">
        <li>
          <Link href={homeLink} className="flex items-center hover:text-foreground">
            <HomeIcon className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.href}>
            {separator && <li className="mx-1">{separator}</li>}
            <li>
              {index === breadcrumbItems.length - 1 ? (
                <span className="font-medium text-foreground">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-foreground">
                  {item.label}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}
