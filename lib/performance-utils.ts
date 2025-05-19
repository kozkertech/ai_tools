// Function to defer non-critical JavaScript
export const deferNonCritical = (callback: Function, timeout = 2000) => {
  if (typeof window !== "undefined") {
    // Use requestIdleCallback if available, otherwise use setTimeout
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => callback(), { timeout })
    } else {
      setTimeout(() => callback(), timeout)
    }
  }
}

// Function to preload critical resources
export const preloadCriticalResources = (resources: string[]) => {
  if (typeof document !== "undefined") {
    resources.forEach((resource) => {
      const link = document.createElement("link")
      link.rel = "preload"
      link.href = resource

      // Determine the as attribute based on the file extension
      if (resource.endsWith(".js")) {
        link.as = "script"
      } else if (resource.endsWith(".css")) {
        link.as = "style"
      } else if (resource.endsWith(".woff2") || resource.endsWith(".woff") || resource.endsWith(".ttf")) {
        link.as = "font"
        link.crossOrigin = "anonymous"
      } else if (
        resource.endsWith(".jpg") ||
        resource.endsWith(".jpeg") ||
        resource.endsWith(".png") ||
        resource.endsWith(".webp")
      ) {
        link.as = "image"
      }

      document.head.appendChild(link)
    })
  }
}

// Function to optimize image loading
export const getImageProps = (src: string, width: number, height: number, priority = false) => {
  return {
    src,
    width,
    height,
    loading: priority ? "eager" : "lazy",
    decoding: "async",
    fetchPriority: priority ? "high" : "auto",
  }
}

// Function to generate responsive image sizes
export const getResponsiveSizes = (defaultSize = "100vw") => {
  return "(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, " + defaultSize
}
