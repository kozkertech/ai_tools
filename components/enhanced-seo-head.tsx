import Head from "next/head"

interface EnhancedSEOHeadProps {
  title: string
  description: string
  keywords?: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
  canonicalUrl?: string
  schema?: any
  author?: string
  publishedTime?: string
  modifiedTime?: string
  locale?: string
  noIndex?: boolean
  alternateLanguages?: { [key: string]: string }
}

export function EnhancedSEOHead({
  title,
  description,
  keywords = "web development, WhatsApp automation, Power BI, Kochi, digital solutions",
  ogImage = "/og-image.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
  canonicalUrl,
  schema,
  author = "KozkerTech",
  publishedTime,
  modifiedTime,
  locale = "en_IN",
  noIndex = false,
  alternateLanguages,
}: EnhancedSEOHeadProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kozker.com"
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {author && <meta name="author" content={author} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content="KozkerTech" />
      <meta property="og:locale" content={locale} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={fullCanonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      <meta name="twitter:creator" content="@kozkertech" />

      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Alternate Languages */}
      {alternateLanguages &&
        Object.entries(alternateLanguages).map(([lang, url]) => (
          <link key={lang} rel="alternate" hrefLang={lang} href={url} />
        ))}

      {/* Structured Data / Schema.org */}
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />}
    </Head>
  )
}
