// SEO utility functions to standardize metadata across the site

/**
 * Generates standardized metadata for pages
 */
export function generatePageMetadata({
  title,
  description,
  keywords = [],
  ogImage = "/og-image.jpg",
  ogType = "website",
  canonicalPath = "",
  noIndex = false,
}: {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  ogType?: "website" | "article" | "profile"
  canonicalPath?: string
  noIndex?: boolean
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kozker.com"
  const canonicalUrl = canonicalPath ? `${baseUrl}${canonicalPath}` : baseUrl

  return {
    title,
    description,
    keywords: keywords.join(", "),
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "KozkerTech",
      images: [
        {
          url: ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_IN",
      type: ogType,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`],
      creator: "@kozkertech",
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  }
}

/**
 * Generates breadcrumb schema markup for SEO
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kozker.com"

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
    })),
  }
}
