"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"

interface ImageWithFallbackProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string
}

/**
 * Enhanced Image component with fallback and lazy loading
 */
export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "/placeholder.svg",
  className,
  ...rest
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={cn("relative", isLoading && "animate-pulse bg-gray-200 dark:bg-gray-800")}>
      <Image
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        className={cn(className, isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-500")}
        onError={() => {
          setImgSrc(fallbackSrc)
        }}
        onLoad={() => setIsLoading(false)}
        loading="lazy"
        {...rest}
      />
    </div>
  )
}
