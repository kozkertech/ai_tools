import * as React from "react"
import { cn } from "@/lib/utils"

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

export function Heading({ className, level = 2, children, ...props }: HeadingProps) {
  const Component = `h${level}` as React.ElementType

  const sizeClasses = {
    1: "text-4xl md:text-5xl lg:text-6xl leading-[1.10]", // Hero 64px
    2: "text-3xl md:text-4xl lg:text-5xl leading-[1.20]", // Section Anchor 52px
    3: "text-2xl md:text-3xl lg:text-4xl leading-[1.30]", // Sub-heading Large 36px
    4: "text-xl md:text-2xl lg:text-3xl leading-[1.10]", // Sub-heading 32px
    5: "text-lg md:text-xl lg:text-2xl leading-[1.20]", // Sub-heading Small 25px
    6: "text-base md:text-lg lg:text-xl leading-[1.20]", // Feature Title 20px
  }

  return (
    <Component
      className={cn(
        "font-serif font-medium tracking-normal text-foreground",
        sizeClasses[level],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
