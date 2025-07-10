// SEO utility functions

// Generate a canonical URL
export function getCanonicalUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourblog.com"
  return `${baseUrl}${path}`
}

// Generate structured data for breadcrumbs
export function generateBreadcrumbSchema(items: { name: string; url: string }[]): any {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// Generate structured data for FAQ
export function generateFaqSchema(questions: { question: string; answer: string }[]): any {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  }
}

// Generate structured data for local business
export function generateLocalBusinessSchema(data: {
  name: string
  image: string
  telephone: string
  address: {
    streetAddress?: string
    addressLocality: string
    addressRegion: string
    postalCode?: string
    addressCountry: string
  }
  geo?: {
    latitude: number
    longitude: number
  }
  url: string
  description: string
  priceRange?: string
  openingHours?: string[]
}): any {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: data.name,
    image: data.image,
    telephone: data.telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress: data.address.streetAddress,
      addressLocality: data.address.addressLocality,
      addressRegion: data.address.addressRegion,
      postalCode: data.address.postalCode,
      addressCountry: data.address.addressCountry,
    },
    ...(data.geo && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: data.geo.latitude,
        longitude: data.geo.longitude,
      },
    }),
    url: data.url,
    description: data.description,
    ...(data.priceRange && { priceRange: data.priceRange }),
    ...(data.openingHours && {
      openingHoursSpecification: data.openingHours.map((hours) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: hours.split(" ")[0],
        opens: hours.split(" ")[1].split("-")[0],
        closes: hours.split(" ")[1].split("-")[1],
      })),
    }),
  }
}
