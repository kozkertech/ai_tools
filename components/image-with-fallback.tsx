"use client"

import Image, { type ImageProps } from "next/image"
import { useState } from "react"

type ImageWithFallbackProps = ImageProps & {
  fallbackSrc?: string
}

export function ImageWithFallback({ src, alt, fallbackSrc = "/placeholder.svg", ...rest }: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [error, setError] = useState(false)

  return (
    <Image
      {...rest}
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      onError={() => {
        if (!error) {
          setImgSrc(fallbackSrc)
          setError(true)
        }
      }}
    />
  )
}
