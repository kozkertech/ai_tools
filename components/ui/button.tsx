import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] text-base font-sans font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anthropic-focus disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-[0_0_0_1px_transparent,0_0_0_0_transparent]",
  {
    variants: {
      variant: {
        default: "bg-anthropic-terracotta text-anthropic-ivory hover:brightness-110 shadow-[0_0_0_1px_#c96442,0_2px_8px_rgba(201,100,66,0.2)]", // Primary CTA
        destructive:
          "bg-anthropic-error text-anthropic-ivory hover:brightness-110 shadow-[0_0_0_1px_#b53333]",
        outline:
          "border border-anthropic-borderWarm bg-transparent hover:bg-anthropic-ivory text-anthropic-charcoalWarm",
        secondary:
          "bg-anthropic-warmSand text-anthropic-charcoalWarm hover:translate-y-[-1px] shadow-[0_0_0_1px_#e8e6dc] hover:shadow-[0_0_0_1px_#d1cfc5]", // The workhorse warm button
        ghost: "hover:bg-anthropic-warmSand text-anthropic-charcoalWarm",
        link: "text-anthropic-charcoalWarm underline-offset-4 hover:underline",
        white: "bg-anthropic-white text-anthropic-nearBlack rounded-[12px] hover:bg-anthropic-warmSand shadow-[0_1px_2px_rgba(0,0,0,0.05)]", // White surface
        dark: "bg-anthropic-nearBlack text-anthropic-warmSilver border border-anthropic-borderDark hover:bg-anthropic-darkSurface", // Dark primary
      },
      size: {
        default: "px-[16px] py-[8px]",
        sm: "h-9 rounded-[8px] px-[12px] text-sm",
        lg: "px-[20px] py-[10px] text-lg rounded-[16px]",
        icon: "h-10 w-10 rounded-[8px]",
        asymmetric: "pl-[8px] pr-[12px] py-[6px] rounded-[8px]", // Icon-first layout from DESIGN.md
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
