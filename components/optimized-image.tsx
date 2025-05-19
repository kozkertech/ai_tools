"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  fill?: boolean
  quality?: number
  loading?: "lazy" | "eager"
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  fill = false,
  quality = 85,
  loading = "lazy",
  objectFit = "cover",
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      // Create a fallback image URL with the alt text as a query parameter
      const fallbackSrc = `/placeholder.svg?height=${height || 400}&width=${width || 600}&query=${encodeURIComponent(alt)}`
      setImgSrc(fallbackSrc)
      setHasError(true)
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        className,
        isLoading ? "animate-pulse bg-gray-200 dark:bg-gray-800" : "",
      )}
    >
      <Image
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          fill ? "object-cover" : "",
          objectFit === "contain" ? "object-contain" : "",
          objectFit === "cover" ? "object-cover" : "",
          objectFit === "fill" ? "object-fill" : "",
          objectFit === "none" ? "object-none" : "",
          objectFit === "scale-down" ? "object-scale-down" : "",
        )}
        onError={handleError}
        onLoad={handleLoad}
        priority={priority}
        sizes={sizes}
        quality={quality}
        loading={loading}
        fill={fill}
      />
    </div>
  )
}
