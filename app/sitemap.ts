import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kozker.com"

  // Static pages
  const staticPages = [
    "",
    "/about",
    "/contact",
    "/services",
    "/solutions",
    "/pricing",
    "/tools",
    "/blog",
    "/case-studies",
    "/privacy",
    "/terms",
    "/launchpad",
    "/growthsuite",
    "/intelligence",
    "/services/ai-powered-web-design",
    "/services/whatsapp-automation",
    "/services/24x7-ai-powered-customer-support",
    "/services/support-suite",
    "/services/bi-analytics",
    "/services/cloud-data-integration",
    "/tools/domain-name-generator",
    "/tools/social-media-suggester",
    "/tools/meeting-summary-extractor",
    "/tools/blog-generator",
    "/tools/email-subject-line",
    "/tools/proposal-draft-generator",
    "/tools/tagline-value-prop-creator",
    "/tools/landing-pageherocopygenerator",
    "/tools/seo-keyword-content-gapanalyzer",
    "/tools/data-cleanse",
    "/tools/power-bi-measure",
    "/tools/ai-business-plan-generator",
  ]

  const staticSitemap = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }))

  // Add mock case study pages
  const mockCaseStudies = [
    "restaurant-chain-300-percent-increase",
    "ecommerce-conversion-rate-boost",
    "manufacturing-roi-increase",
  ]

  const caseStudySitemap = mockCaseStudies.map((slug) => ({
    url: `${baseUrl}/case-studies/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return [...staticSitemap, ...caseStudySitemap]
}
