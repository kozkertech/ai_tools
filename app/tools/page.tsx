import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calculator, Search, BarChart3, MessageSquare, Globe, Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "Free Tools - Digital Assessment & Planning Tools | KozkerTech",
  description:
    "Access our free digital tools to assess your business needs, calculate ROI, and plan your digital transformation journey.",
}

// Mock data for free tools
const tools = [
  {
    id: 1,
    title: "Digital Readiness Assessment",
    description: "Evaluate your business's digital maturity and get personalized recommendations for improvement.",
    icon: BarChart3,
    category: "Assessment",
    estimatedTime: "5 minutes",
    users: "2,500+",
    benefits: [
      "Comprehensive digital audit",
      "Personalized improvement roadmap",
      "Industry benchmarking",
      "Priority action items",
    ],
    ctaText: "Start Assessment",
    href: "/tools/digital-readiness",
  },
  {
    id: 2,
    title: "ROI Calculator",
    description: "Calculate the potential return on investment for your digital transformation initiatives.",
    icon: Calculator,
    category: "Planning",
    estimatedTime: "3 minutes",
    users: "1,800+",
    benefits: ["Accurate ROI projections", "Cost-benefit analysis", "Timeline planning", "Investment recommendations"],
    ctaText: "Calculate ROI",
    href: "/tools/roi-calculator",
  },
  {
    id: 3,
    title: "Local SEO Checker",
    description: "Analyze your local search presence and discover opportunities to improve your visibility.",
    icon: Search,
    category: "LaunchPad",
    estimatedTime: "2 minutes",
    users: "3,200+",
    benefits: ["Local ranking analysis", "GMB optimization tips", "Competitor comparison", "Action plan generation"],
    ctaText: "Check SEO Score",
    href: "/tools/local-seo-checker",
  },
  {
    id: 4,
    title: "WhatsApp Automation Planner",
    description: "Design your WhatsApp automation workflow and estimate the impact on your business.",
    icon: MessageSquare,
    category: "GrowthSuite",
    estimatedTime: "7 minutes",
    users: "1,500+",
    benefits: [
      "Custom workflow design",
      "Time savings calculator",
      "Response rate projections",
      "Implementation roadmap",
    ],
    ctaText: "Plan Automation",
    href: "/tools/whatsapp-planner",
  },
  {
    id: 5,
    title: "Website Performance Analyzer",
    description: "Get a comprehensive analysis of your website's performance, speed, and conversion potential.",
    icon: Globe,
    category: "GrowthSuite",
    estimatedTime: "4 minutes",
    users: "2,100+",
    benefits: [
      "Speed optimization tips",
      "Conversion rate analysis",
      "Mobile responsiveness check",
      "SEO recommendations",
    ],
    ctaText: "Analyze Website",
    href: "/tools/website-analyzer",
  },
  {
    id: 6,
    title: "Power BI Readiness Check",
    description: "Assess your organization's readiness for Power BI implementation and data analytics.",
    icon: Zap,
    category: "Intelligence",
    estimatedTime: "6 minutes",
    users: "900+",
    benefits: [
      "Data maturity assessment",
      "Implementation timeline",
      "Resource requirements",
      "Success probability score",
    ],
    ctaText: "Check Readiness",
    href: "/tools/powerbi-readiness",
  },
]

export default function ToolsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Free Digital <span className="text-primary">Assessment Tools</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Evaluate your business's digital potential with our comprehensive suite of free tools. Get personalized
              insights and actionable recommendations to accelerate your growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="#tools">Explore Tools</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Get Expert Consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Instant Insights</h3>
              <p className="text-muted-foreground">
                Get immediate analysis and recommendations based on your specific business needs
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Actionable Results</h3>
              <p className="text-muted-foreground">
                Receive clear, prioritized action items you can implement immediately
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Calculator className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Data-Driven Planning</h3>
              <p className="text-muted-foreground">
                Make informed decisions with accurate projections and industry benchmarks
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Choose Your Assessment Tool</h2>
            <p className="text-xl text-muted-foreground">
              Select the tool that best matches your current business needs and goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => {
              const IconComponent = tool.icon
              return (
                <Card key={tool.id} className="hover:shadow-lg transition-shadow h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          tool.category === "Intelligence"
                            ? "bg-purple-100"
                            : tool.category === "GrowthSuite"
                              ? "bg-blue-100"
                              : tool.category === "LaunchPad"
                                ? "bg-green-100"
                                : "bg-orange-100"
                        }`}
                      >
                        <IconComponent
                          className={`h-6 w-6 ${
                            tool.category === "Intelligence"
                              ? "text-purple-600"
                              : tool.category === "GrowthSuite"
                                ? "text-blue-600"
                                : tool.category === "LaunchPad"
                                  ? "text-green-600"
                                  : "text-orange-600"
                          }`}
                        />
                      </div>
                      <Badge
                        className={
                          tool.category === "Intelligence"
                            ? "bg-purple-100 text-purple-700"
                            : tool.category === "GrowthSuite"
                              ? "bg-blue-100 text-blue-700"
                              : tool.category === "LaunchPad"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                        }
                      >
                        {tool.category}
                      </Badge>
                    </div>
                    <CardTitle className="line-clamp-2">{tool.title}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-3">{tool.description}</p>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span>⏱️ {tool.estimatedTime}</span>
                      <span>👥 {tool.users} users</span>
                    </div>

                    <div className="mb-6 flex-1">
                      <h4 className="font-semibold mb-2">What you'll get:</h4>
                      <ul className="space-y-1">
                        {tool.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button asChild className="w-full">
                      <Link href={tool.href}>
                        {tool.ctaText} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How Our Tools Work</h2>
            <p className="text-xl text-muted-foreground">
              Simple, effective process to get actionable insights for your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Choose Tool</h3>
              <p className="text-sm text-muted-foreground">
                Select the assessment tool that matches your business needs
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Answer Questions</h3>
              <p className="text-sm text-muted-foreground">
                Provide information about your current situation and goals
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Get Results</h3>
              <p className="text-sm text-muted-foreground">Receive instant analysis and personalized recommendations</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Take Action</h3>
              <p className="text-sm text-muted-foreground">
                Implement recommendations or get expert help from our team
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Accelerate Your Growth?</h2>
            <p className="text-xl opacity-90 mb-8">
              Use our free tools to identify opportunities, then let our experts help you implement the solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-primary">
                <Link href="/contact">Get Expert Consultation</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                <Link href="/solutions">Explore Our Solutions</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
