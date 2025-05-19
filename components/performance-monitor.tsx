"use client"

import { useEffect } from "react"

export function PerformanceMonitor() {
  useEffect(() => {
    // Skip in development to avoid console noise
    if (process.env.NODE_ENV !== "production") return

    // Function to send metrics to analytics
    const sendMetric = (name: string, value: number) => {
      // Log to console in development
      console.log(`Performance Metric: ${name}`, value)

      // Send to Google Analytics if available
      if (typeof window !== "undefined" && (window as any).gtag) {
        ;(window as any).gtag("event", "performance", {
          event_category: "Web Vitals",
          event_label: name,
          value: Math.round(value),
          non_interaction: true,
        })
      }
    }

    // Create performance observer for paint metrics
    try {
      const paintObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          // Report FCP (First Contentful Paint)
          if (entry.name === "first-contentful-paint") {
            sendMetric("FCP", entry.startTime)
          }
        }
      })
      paintObserver.observe({ type: "paint", buffered: true })

      // Create performance observer for layout shifts
      const layoutShiftObserver = new PerformanceObserver((entryList) => {
        let cumulativeLayoutShift = 0
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            // @ts-ignore - value exists on layout shift entries
            cumulativeLayoutShift += entry.value
          }
        }
        sendMetric("CLS", cumulativeLayoutShift)
      })
      layoutShiftObserver.observe({ type: "layout-shift", buffered: true })

      // Create performance observer for largest contentful paint
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]
        sendMetric("LCP", lastEntry.startTime)
      })
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true })

      // Measure TTI (Time to Interactive) approximation
      setTimeout(() => {
        const navigationEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
        if (navigationEntry) {
          const tti = navigationEntry.domInteractive
          sendMetric("TTI", tti)
        }
      }, 0)

      // Cleanup function
      return () => {
        paintObserver.disconnect()
        layoutShiftObserver.disconnect()
        lcpObserver.disconnect()
      }
    } catch (error) {
      console.error("Error setting up performance monitoring:", error)
    }
  }, [])

  // This component doesn't render anything
  return null
}
