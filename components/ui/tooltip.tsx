"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Simplified Tooltip that doesn't depend on @radix-ui/react-tooltip
// since it is not installed in the project.

const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>

const Tooltip = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false)
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === TooltipTrigger) return child
          if (child.type === TooltipContent && open) return child
        }
        return null
      })}
    </div>
  )
}

const TooltipTrigger = ({ children, asChild, ...props }: any) => {
  return <div {...props}>{children}</div>
}

const TooltipContent = ({ className, children, side = "top", ...props }: any) => {
  const sideClasses = {
    top: "-top-2 left-1/2 -translate-x-1/2 -translate-y-full mb-2",
    bottom: "-bottom-2 left-1/2 -translate-x-1/2 translate-y-full mt-2",
    left: "top-1/2 -left-2 -translate-x-full -translate-y-1/2 mr-2",
    right: "top-1/2 -right-2 translate-x-full -translate-y-1/2 ml-2",
  }

  return (
    <div
      className={cn(
        "absolute z-50 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-50 shadow-md",
        sideClasses[side as keyof typeof sideClasses],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
