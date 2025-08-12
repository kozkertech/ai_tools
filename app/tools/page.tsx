import type { Metadata } from "next"
import ToolsPageClient from "./ToolsPageClient"

export const metadata: Metadata = {
  title: "Free AI Business Tools – Automate, Create & Grow | KozkerTech",
  description:
    "Access 20+ free AI-powered tools to boost business growth. Instantly generate domain names, marketing copy, blog posts, sales scripts, and automate workflows to save time and scale faster.",
  keywords:
    "free AI tools, AI business tools, business automation software, domain name generator, AI marketing tools, content creation AI, SEO tools, sales automation, productivity AI tools, marketing automation, KozkerTech"
}

export default function ToolsPage() {
  return <ToolsPageClient />
}
