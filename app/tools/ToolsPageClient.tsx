"use client"

import { useState } from "react"
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
  Users,
  Palette,
  Calculator,
  Receipt,
  UserPlus,
  MessageSquare,
  HelpCircle,
  Megaphone,
  Send,
  Clock,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const tools = [
  {
    id: "domain-name-genie",
    name: "Domain Name Genie",
    description: "Find your perfect domain with AI-powered suggestions based on your business description.",
    icon: Globe,
    href: "/tools/domain-name-generator",
    status: "Available",
    category: "Branding",
    solution:"LaunchPad",
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
    solution:"LaunchPad",
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
    solution:"LaunchPad",
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
    solution:"LaunchPad",
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
    solution:"Intelligence",
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
    solution:"Intelligence",
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
    solution:"LaunchPad",
    features: [
      "AI-powered business summaries",
      "Realistic financial projections",
      "Detailed end-to-end Business strategies",
    ],
  },
  {
    id: "powerbi-generator",
    name: "Power BI Measure & Viz Snippet Generator",
    description: "Outputs DAX measures and a JSON snippet for a chart from KPI description.",
    icon: BarChart2,
    href: "/tools/power-bi-measure",
    status: "Available",
    category: "Analytics",
    solution:"GrowthSuite",
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
    solution:"GrowthSuite",
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
    solution:"Intelligence",
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
    solution:"GrowthSuite",
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
    solution:"GrowthSuite",
    features: ["Proposal drafts", "Service packages", "Client customization"],
  },
  {
    id: "follow-up-email-sequencer",
    name: "Follow-Up Email Sequencer",
    description: "Create automated email sequences to nurture leads and close deals effectively.",
    icon: Send,
    href: "/tools/follow-up-email-sequencer",
    status: "Available",
    category: "Marketing",
    solution:"GrowthSuite",
    features: ["Email sequences", "Lead nurturing", "Automated follow-ups"],
  },
  {
    id: "job-description-generator",
    name: "Job Description Generator",
    description: "Generate comprehensive job descriptions with requirements and responsibilities.",
    icon: UserPlus,
    href: "/tools/job-description-generator",
    status: "Available",
    category: "Business",
    solution:"GrowthSuite",
    features: ["Role requirements", "Responsibility mapping", "Skills assessment"],
  },
  {
    id: "customer-persona-generator",
    name: "Customer Persona & ICP Generator",
    description: "Create detailed customer personas and ideal customer profiles for targeted marketing.",
    icon: Users,
    href: "/tools/customer-persona-generator",
    status: "Available",
    category: "Marketing",
    solution:"GrowthSuite",
    features: ["Detailed personas", "ICP mapping", "Target audience insights"],
  },
  {
    id: "logo-color-picker",
    name: "Logo Color Palette Picker",
    description: "Generate harmonious color palettes for your brand and logo design.",
    icon: Palette,
    href: "/tools/logo-color-palette-picker",
    status: "Available",
    category: "Branding",
    solution:"LaunchPad",
    features: ["Color harmony analysis", "Brand color schemes", "Accessibility compliance"],
  },
  {
    id: "pricing-calculator",
    name: "Pricing Calculator",
    description: "Calculate optimal pricing strategies based on costs, market analysis, and profit margins.",
    icon: Calculator,
    href: "/tools/pricing-generator",
    status: "Available",
    category: "Business",
    solution:"LaunchPad",
    features: ["Cost analysis", "Profit margin optimization", "Competitive pricing"],
  },
  {
    id: "invoice-template-builder",
    name: "Invoice Template Builder",
    description: "Create professional invoice templates with custom branding and automated calculations.",
    icon: Receipt,
    href: "/tools/invoice-template-builder",
    status: "Available",
    category: "Business",
    solution:"GrowthSuite",
    features: ["Custom templates", "Automated calculations", "Brand integration"],
  },
  {
    id: "sales-script-generator",
    name: "Sales Script Generator",
    description: "Generate persuasive sales scripts for calls, emails, and presentations.",
    icon: MessageSquare,
    href: "/tools/sales-script-generator",
    status: "Available",
    category: "Marketing",
    solution:"GrowthSuite",
    features: ["Persuasive scripts", "Objection handling", "Closing techniques"],
  },
  {
    id: "faq-builder",
    name: "FAQ Builder",
    description: "Build comprehensive FAQ sections to address common customer questions.",
    icon: HelpCircle,
    href: "/tools/faq-builder",
    status: "Available",
    category: "Content",
    solution:"LaunchPad",
    features: ["Question categorization", "Answer optimization", "Search functionality"],
  },
  {
    id: "press-release-template",
    name: "Press Release Template",
    description: "Create professional press releases for announcements and media outreach.",
    icon: Megaphone,
    href: "/tools/press-release-template",
    status: "Available",
    category: "Marketing",
    solution:"GrowthSuite",
    features: ["Media-ready format", "SEO optimization", "Distribution guidelines"],
  },
  {
    id: "project-timeline-builder",
    name: "Project Timeline Builder",
    description: "Build detailed project timelines with milestones, dependencies, and resource allocation.",
    icon: Clock,
    href: "/tools/project-timeline-builder",
    status: "Available",
    category: "Productivity",
    solution:"GrowthSuite",
    features: ["Milestone tracking", "Dependency mapping", "Resource planning"],
  },
]

const categories = ["All", "Branding", "Content", "Marketing", "Automation", "Analytics", "Productivity", "Business"]
const solutions = ["All", "GrowthSuite", "LaunchPad", "Intelligence"]

export default function ToolsPageClient() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeSolution, setActiveSolution] = useState("All")

  // Filter tools based on active category and solution
  const filteredTools = tools.filter((tool) => {
    const categoryMatch = activeCategory === "All" || tool.category === activeCategory
    const solutionMatch = activeSolution === "All" || tool.solution === activeSolution
    return categoryMatch && solutionMatch
  })

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
      {/* Filter Section */} 
      <section className="py-8 px-4 bg-white/50 dark:bg-slate-800/50">
       <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
         <h2 className="text-2xl font-bold">Browse Tools by Category</h2> 
         <p className="text-muted-foreground"> {filteredTools.length} tool{filteredTools.length !== 1 ? "s" : ""} available </p> 
         </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
           <div className="flex items-center gap-4">
             <label htmlFor="category-filter" className="text-sm font-medium text-muted-foreground"> Filter by Category: </label>
              <Select value={activeCategory} onValueChange={setActiveCategory}> 
                <SelectTrigger className="w-[200px]"> 
                  <SelectValue placeholder="Select category" /> 
                </SelectTrigger>
               <SelectContent> 
                 {categories.map((category) => ( 
                   <SelectItem key={category} value={category}> {category} </SelectItem> 
                 ))} 
               </SelectContent>
              </Select> 
           </div>
           <div className="flex items-center gap-4">
             <label htmlFor="solution-filter" className="text-sm font-medium text-muted-foreground"> Filter by Solution: </label>
              <Select value={activeSolution} onValueChange={setActiveSolution}> 
                <SelectTrigger className="w-[200px]"> 
                  <SelectValue placeholder="Select solution" /> 
                </SelectTrigger>
               <SelectContent> 
                 {solutions.map((solution) => ( 
                   <SelectItem key={solution} value={solution}> {solution} </SelectItem> 
                 ))} 
               </SelectContent>
              </Select> 
           </div>
        </div> 
       </div> 
      </section>

{/* Tools Grid */}
<section className="py-16 px-4">
  <div className="max-w-7xl mx-auto">
    {filteredTools.length === 0 ? (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <Filter className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-muted-foreground">No Tools Found</h3>
          <p className="text-muted-foreground mb-6">
            No tools match your current filter selection. Try adjusting your category or solution filters to see more results.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="outline" 
              onClick={() => {
                setActiveCategory("All")
                setActiveSolution("All")
              }}
            >
              Clear All Filters
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setActiveCategory("All")}
            >
              Reset Category
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setActiveSolution("All")}
            >
              Reset Solution
            </Button>
          </div>
        </div>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => {
          const IconComponent = tool.icon
          const isAvailable = tool.status === "Available"

          return (
            <Card
              key={tool.id}
              className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 flex flex-col h-full"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <Badge variant={isAvailable ? "default" : "secondary"} className="text-xs whitespace-nowrap">
                        {tool.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs whitespace-nowrap">
                        {tool.category}
                      </Badge>
                      {tool.solution === "GrowthSuite" ? (
                        <Link 
                          href="/solutions/growthsuite" 
                          scroll={false}
                          onClick={() => {
                            // Force scroll to top after navigation
                            setTimeout(() => {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }, 100);
                          }}
                        >
                          <Badge 
                            variant="outline" 
                            className="text-xs whitespace-nowrap border-[#2563EB] text-[#2563EB] bg-[#2563EB]/10 hover:bg-[#2563EB]/20 transition-colors cursor-pointer"
                          >
                            {tool.solution}
                          </Badge>
                        </Link>
                      ) : tool.solution === "LaunchPad" ? (
                        <Link 
                          href="/solutions/launchpad" 
                          scroll={false}
                          onClick={() => {
                            // Force scroll to top after navigation
                            setTimeout(() => {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }, 100);
                          }}
                        >
                          <Badge 
                            variant="outline" 
                            className="text-xs whitespace-nowrap border-[#059669] text-[#059669] bg-[#059669]/10 hover:bg-[#059669]/20 transition-colors cursor-pointer"
                          >
                            {tool.solution}
                          </Badge>
                        </Link>
                      ) : tool.solution === "Intelligence" ? (
                        <Link 
                          href="/solutions/intelligence" 
                          scroll={false}
                          onClick={() => {
                            // Force scroll to top after navigation
                            setTimeout(() => {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }, 100);
                          }}
                        >
                          <Badge 
                            variant="outline" 
                            className="text-xs whitespace-nowrap border-[#7C3AED] text-[#7C3AED] bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 transition-colors cursor-pointer"
                          >
                            {tool.solution}
                          </Badge>
                        </Link>
                      ) : (
                        <Badge variant="outline" className="text-xs whitespace-nowrap">
                          {tool.solution}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{tool.name}</CardTitle>
                <CardDescription className="text-base">{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <div className="space-y-4 flex-grow">
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
                </div>
                <div className="mt-auto pt-4">
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
    )}
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
              className="text-lg px-8 border-white hover:bg-white hover:text-primary text-slate-600 bg-transparent"
            >
              <Link href="/contact">Request Custom Tool</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
