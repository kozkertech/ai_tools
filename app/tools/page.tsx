import type { Metadata } from "next"
import ToolsPageClient from "./ToolsPageClient"

export const metadata: Metadata = {
  title: "Best Free AI Tools for Business 2026 | AI Tools Directory | KozkerTech",
  description:
    "Discover 20+ best free AI tools for business: AI content generators, AI automation tools, generative AI solutions, and AI marketing tools. No credit card required. Instant AI business tools for startups and enterprises.",
  keywords:
    "free AI tools, best AI tools, generative AI tools, AI business tools, AI tools for startups, AI automation tools, AI marketing tools, AI content generator, AI SEO tools, free generative AI, AI tools for small business, AI analytics tools, KozkerTech"
}

export default function ToolsPage() {
  return <ToolsPageClient />
}
