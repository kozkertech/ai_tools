import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Globe,
  Type,
  LayoutTemplate,
  Share2,
  Rss,
  Mail,
  Bot,
  BarChart2,
  ClipboardList,
  Filter,
  FileSearch,
  Briefcase,
  ArrowRight,
  Sparkles,
} from "lucide-react"

export const metadata: Metadata = {
  title: "AI-Powered Business Tools | KozkerTech",
  description:
    "Discover our collection of AI-powered tools designed to accelerate your business growth. From domain name generation to content creation and automation.",
  keywords: "AI tools, business automation, domain generator, content creation, digital marketing tools",
}

const tools = [
  {
    id: "domain-name-genie",
    name: "Domain Name Genie",
    description: "Find your perfect domain with AI-powered suggestions based on your business description.",
    icon: Globe,
    href: "/tools/domain-name-generator",
    status: "Available",
    category: "Branding",
    features: ["AI-powered suggestions", "Real-time availability check", "Multiple TLD options"],
  },
  {
    id: "tagline-creator",
    name: "Tagline & Value-Prop Creator",
    description: "Crafts a punchy tagline and 1-sentence UVP based on user inputs.",
    icon: Type,
    href: "/tools/tagline-value-prop-creator",
    status: "Available",
    category: "Branding",
    features: ["Punchy taglines", "Value propositions", "Brand messaging"],
  },
  {
    id: "hero-copy-generator",
    name: "Landing-Page Hero Copy Generator",
    description: "Generates headline, sub-headline, and CTA variations for conversion.",
    icon: LayoutTemplate,
    href: "/tools/landing-pageherocopygenerator",
    status: "Available",
    category: "Content",
    features: ["Headlines", "Sub-headlines", "CTA variations"],
  },
  {
    id: "social-media-suggester",
    name: "Social-Media Caption & Hashtag Suggester",
    description: "Creates platform-tailored captions plus trending hashtags.",
    icon: Share2,
    href: "/tools/social-media-suggester",
    status: "Available",
    category: "Marketing",
    features: ["Platform-specific captions", "Trending hashtags", "Engagement optimization"],
  },
  {
    id: "blog-outline-builder",
    name: "Blog-Post Topic & Outline Builder",
    description: "Spins up a SEO-optimized blog structure with headings and key points.",
    icon: Rss,
    href: "/tools/blog-generator",
    status: "Available",
    category: "Content",
    features: ["SEO optimization", "Content structure", "Topic research"],
  },
  {
    id: "email-subject-generator",
    name: "Email Subject-Line & Preview-Text Generator",
    description: "Produces subject lines and preheader options to maximize opens.",
    icon: Mail,
    href: "/tools/email-subject-line",
    status: "Available",
    category: "Marketing",
    features: ["Subject line optimization", "Preview text", "Open rate improvement"],
  },
  {
    id: "ai-business-plan-generator",
    name: "AI Business Plan Generator",
    description: "Effortless Business Planning with AI",
    icon: Bot,
    href: "/tools/ai-business-plan-generator",
    status: "Available",
    category: "Automation",
    features: ["AI-powered business summaries", "Realistic financial projections", "Detailed end-to-end Business strategies"],
  },
  {
    id: "powerbi-generator",
    name: "Power BI Measure & Viz Snippet Generator",
    description: "Outputs DAX measures and a JSON snippet for a chart from KPI description.",
    icon: BarChart2,
    href: "/tools/power-bi-measure",
    status: "Available",
    category: "Analytics",
    features: ["DAX measures", "Visualization snippets", "KPI tracking"],
  },
  {
    id: "meeting-extractor",
    name: "Meeting-Summary & Action-Item Extractor",
    description: "Get bullet-point summary + assigned tasks from transcript or notes.",
    icon: ClipboardList,
    href: "/tools/meeting-summary-extractor",
    status: "Available",
    category: "Productivity",
    features: ["Meeting summaries", "Action items", "Task assignment"],
  },
  {
    id: "data-cleanse-helper",
    name: "Data-Cleanse & Schema-Map Helper",
    description: "Infers column types, flags anomalies, and proposes a star-schema from CSV.",
    icon: Filter,
    href: "/tools/data-cleanse",
    status: "Available",
    category: "Analytics",
    features: ["Data cleaning", "Schema mapping", "Anomaly detection"],
  },
  {
    id: "seo-analyzer",
    name: "SEO-Keyword & Content-Gap Analyzer",
    description: "Delivers untapped keyword ideas and content gaps versus competitors.",
    icon: FileSearch,
    href: "/tools/seo-keyword-content-gapanalyzer",
    status: "Available",
    category: "Marketing",
    features: ["Keyword research", "Content gaps", "Competitor analysis"],
  },
  {
    id: "proposal-generator",
    name: "Proposal-Draft Generator",
    description: "Get a formatted first-draft proposal from prospect details & service package.",
    icon: Briefcase,
    href: "/tools/proposal-draft-generator",
    status: "Available",
    category: "Business",
    features: ["Proposal drafts", "Service packages", "Client customization"],
  },
]

const categories = ["All", "Branding", "Content", "Marketing", "Automation", "Analytics", "Productivity", "Business"]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-3xl mx-4"></div>
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Business Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Accelerate Your Business with AI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover our collection of AI-powered tools designed to streamline your workflow, enhance creativity, and
            drive business growth.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const IconComponent = tool.icon
              const isAvailable = tool.status === "Available"

              return (
                <Card
                  key={tool.id}
                  className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <Badge variant={isAvailable ? "default" : "secondary"} className="mb-2">
                            {tool.status}
                          </Badge>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {tool.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{tool.name}</CardTitle>
                    <CardDescription className="text-base">{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Key Features:</h4>
                        <ul className="space-y-1">
                          {tool.features.map((feature, index) => (
                            <li key={index} className="text-sm flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {isAvailable ? (
                        <Button asChild className="w-full group">
                          <Link href={tool.href}>
                            Try Now
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      ) : (
                        <Button disabled className="w-full">
                          Coming Soon
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start with our Domain Name Genie and discover the perfect domain for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link href="/tools/digital-readiness">Try Domain Name Genie</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 border-white hover:bg-white hover:text-primary text-slate-600"
            >
              <Link href="/contact">Request Custom Tool</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
