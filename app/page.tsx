import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  ArrowRight,
  Zap,
  TrendingUp,
  Brain,
  Rocket,
  Target,
  BarChart3,
  Star,
  Globe,
  Sparkles,
  Bot,
  Type,
  LayoutTemplate,
  Lightbulb,
  FileText,
  Mail,
} from "lucide-react"
import { getFeaturedPosts } from "@/lib/ghost"
import { PostCard } from "@/components/post-card"

export const metadata: Metadata = {
  title: "KozkerTech - AI-Powered Business Tools | Automate Your Growth",
  description:
    "Launch, grow, and scale your business with AI. Generate domains, proposals, dashboards, and more instantly. Free AI tools for every business stage.",
}

export default async function Home() {
  let featuredPosts = []
  try {
    if (process.env.GHOST_URL && process.env.GHOST_CONTENT_API_KEY) {
      featuredPosts = await getFeaturedPosts()
    }
  } catch (error) {
    console.error("Error fetching featured posts:", error)
  }

  return (
    <>
      {/* Hero Section - AI-Focused */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/30 via-blue-300/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-purple-300/20 via-primary/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="px-4 py-2 text-sm bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Business Tools
              </Badge>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                Launch, Grow <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">&amp; Scale</span> with AI
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                Generate domains, branding, content, pricing, proposals, analytics and more — instantly. 
                No waiting. No agencies. No dependencies. Just pure AI acceleration.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 h-14">
                  <Link href="/tools">
                    Explore Our Free AI Tools <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 h-14 border-2">
                  <Link href="#tools-showcase">See How It Works</Link>
                </Button>
              </div>

              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  ✨ 12+ free tools • 0 setup required • Forever free
                </p>
              </div>
            </div>

            {/* Animated Tool Cards Preview */}
            <div className="relative h-96 hidden lg:block">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Floating Card 1 - Domain */}
                <div className="absolute w-64 h-40 bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-md border border-green-200/40 rounded-xl p-4 shadow-xl transform -rotate-12 -translate-y-12 -translate-x-12 animate-bounce" style={{ animationDelay: "0s", animationDuration: "4s" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-sm">Domain Suggestions</span>
                  </div>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div>✓ techstartup.com</div>
                    <div>✓ innovatetech.in</div>
                    <div>✓ growthventure.co</div>
                  </div>
                </div>

                {/* Floating Card 2 - Proposal */}
                <div className="absolute w-64 h-40 bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-md border border-blue-200/40 rounded-xl p-4 shadow-xl transform rotate-6 translate-y-8 animate-bounce" style={{ animationDelay: "0.5s", animationDuration: "4s" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-sm">Proposal Draft</span>
                  </div>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div>Scope • Timeline • Pricing</div>
                    <div>Terms • Deliverables</div>
                    <div className="text-blue-600 pt-1">→ Ready to send</div>
                  </div>
                </div>

                {/* Floating Card 3 - Dashboard */}
                <div className="absolute w-64 h-40 bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-md border border-purple-200/40 rounded-xl p-4 shadow-xl transform rotate-12 translate-y-16 translate-x-12 animate-bounce" style={{ animationDelay: "1s", animationDuration: "4s" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold text-sm">Dashboard Blueprint</span>
                  </div>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div>KPI selection</div>
                    <div>Visualization design</div>
                    <div className="text-purple-600 pt-1">→ Ready to build</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Can Build Section */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What You Can Build with AI</h2>
            <p className="text-xl text-muted-foreground">
              Instant tools for every business function. No waiting. No dependencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Launch Your Brand */}
            <Card className="border-2 border-green-200/50 hover:border-green-500 transition-all group overflow-hidden">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Rocket className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Launch Your Brand</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Generate everything needed to establish your brand identity instantly.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Domain names (generated in seconds)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Taglines & brand messages</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Color palettes & design</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Automate Growth */}
            <Card className="border-2 border-blue-200/50 hover:border-blue-500 transition-all group overflow-hidden">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Automate Your Growth</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Generate sales and marketing content that converts at scale.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-sm">Proposals (drafted in minutes)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-sm">Email sequences & sales scripts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-sm">Content & campaign copy</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Make Smarter Decisions */}
            <Card className="border-2 border-purple-200/50 hover:border-purple-500 transition-all group overflow-hidden">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Make Smarter Decisions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Transform data into actionable intelligence instantly.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span className="text-sm">Dashboards (designed in minutes)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span className="text-sm">Data models & queries</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span className="text-sm">Insights & recommendations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Tool - Domain Name Genie */}
      <section id="tools-showcase" className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Feature Details */}
            <div className="space-y-8">
              <div>
                <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-200">
                  Most Popular Tool
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Domain Name Genie</h2>
                <p className="text-lg text-muted-foreground">
                  Get 100+ AI-generated domain suggestions instantly. No more brainstorming for hours.
                  Just describe your business, and let AI generate perfect names in seconds.
                </p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Instant Generation</div>
                    <div className="text-sm text-muted-foreground">100+ suggestions in seconds</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Real-Time Availability</div>
                    <div className="text-sm text-muted-foreground">Check if domains are available</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Multiple TLDs</div>
                    <div className="text-sm text-muted-foreground">.com, .io, .co, .in and more</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">One-Click Booking</div>
                    <div className="text-sm text-muted-foreground">Direct links to register immediately</div>
                  </div>
                </li>
              </ul>

              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 h-12">
                <Link href="/tools/domain-name-generator">
                  Try Domain Name Genie Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Right: Interactive Preview */}
            <div className="relative">
              <Card className="border-2 border-green-200/50 overflow-hidden">
                <CardContent className="p-0 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background">
                  <div className="p-6 space-y-4">
                    <div className="text-center pb-4 border-b">
                      <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold mb-2">
                        ✨ Live Preview
                      </div>
                      <div className="font-semibold text-sm text-muted-foreground">Domain Suggestions</div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border border-green-200/50 hover:border-green-400 transition-colors">
                        <div>
                          <div className="font-semibold text-sm">techstartup.com</div>
                          <div className="text-xs text-muted-foreground">Top choice</div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">Available</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border border-blue-200/50 hover:border-blue-400 transition-colors">
                        <div>
                          <div className="font-semibold text-sm">innovatebiz.io</div>
                          <div className="text-xs text-muted-foreground">Fresh & modern</div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700">Available</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border border-purple-200/50 hover:border-purple-400 transition-colors">
                        <div>
                          <div className="font-semibold text-sm">growthventure.co</div>
                          <div className="text-xs text-muted-foreground">Premium name</div>
                        </div>
                        <Badge className="bg-purple-100 text-purple-700">Available</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border border-orange-200/50 hover:border-orange-400 transition-colors">
                        <div>
                          <div className="font-semibold text-sm">smarttech.cloud</div>
                          <div className="text-xs text-muted-foreground">Future-focused</div>
                        </div>
                        <Badge className="bg-orange-100 text-orange-700">Available</Badge>
                      </div>
                    </div>

                    <div className="text-center pt-4 border-t">
                      <Button asChild variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                        <Link href="/tools/domain-name-generator">
                          See more suggestions →
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* AI Tool Ecosystem Overview */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">AI Tools for Every Stage</h2>
            <p className="text-xl text-muted-foreground">
              Curated AI tool collections designed for your business journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* LaunchPad */}
            <Link href="/launchpad" className="group">
              <Card className="h-full border-2 border-green-200/50 hover:border-green-500 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <Rocket className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>LaunchPad</CardTitle>
                  <p className="text-sm text-muted-foreground font-normal mt-2">AI Launch Toolkit</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    For founders building their brand and launching instantly.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Domain generation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Brand messaging</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Business planning</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <span className="text-sm font-semibold text-green-600 group-hover:text-green-700">
                      Explore → 
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* GrowthSuite */}
            <Link href="/growthsuite" className="group">
              <Card className="h-full border-2 border-blue-200/50 hover:border-blue-500 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>GrowthSuite</CardTitle>
                  <p className="text-sm text-muted-foreground font-normal mt-2">AI Growth Automation Stack</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    For growing businesses accelerating sales and marketing.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Proposal generation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Email sequences</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Content automation</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                      Explore → 
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Intelligence */}
            <Link href="/intelligence" className="group">
              <Card className="h-full border-2 border-purple-200/50 hover:border-purple-500 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                    <Brain className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Intelligence</CardTitle>
                  <p className="text-sm text-muted-foreground font-normal mt-2">AI Decision Intelligence</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    For enterprises transforming data into strategic decisions.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Dashboard generation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Data modeling</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Insight extraction</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <span className="text-sm font-semibold text-purple-600 group-hover:text-purple-700">
                      Explore → 
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Why AI Over Agencies */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Use AI Instead of Agencies?</h2>
            <p className="text-xl text-muted-foreground">
              The future of business is self-service, instant, and AI-powered
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* AI Side */}
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Badge className="bg-gradient-to-r from-blue-100 to-green-100 text-blue-700 text-sm py-2 px-4">
                  <Sparkles className="h-4 w-4 mr-1 inline" /> AI Tools
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200/50">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">Instant Output</div>
                    <div className="text-xs text-muted-foreground">Seconds, not weeks</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200/50">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">Total Control</div>
                    <div className="text-xs text-muted-foreground">Generate, edit, iterate freely</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200/50">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">Zero Dependency</div>
                    <div className="text-xs text-muted-foreground">No vendor lock-in</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200/50">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">Unlimited Iterations</div>
                    <div className="text-xs text-muted-foreground">Test as many versions as you need</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200/50">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">Low Cost</div>
                    <div className="text-xs text-muted-foreground">Free forever, scale as you grow</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Traditional Services Side */}
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Badge variant="outline" className="text-sm py-2 px-4">
                  Traditional Agencies
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200/50">
                  <div className="text-red-600 font-bold mt-0.5 flex-shrink-0">✕</div>
                  <div>
                    <div className="font-semibold text-sm">Extended Delays</div>
                    <div className="text-xs text-muted-foreground">Weeks or months for deliverables</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200/50">
                  <div className="text-red-600 font-bold mt-0.5 flex-shrink-0">✕</div>
                  <div>
                    <div className="font-semibold text-sm">Limited Control</div>
                    <div className="text-xs text-muted-foreground">Dependency on agency for changes</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200/50">
                  <div className="text-red-600 font-bold mt-0.5 flex-shrink-0">✕</div>
                  <div>
                    <div className="font-semibold text-sm">Vendor Lock-In</div>
                    <div className="text-xs text-muted-foreground">Ongoing dependency for revisions</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200/50">
                  <div className="text-red-600 font-bold mt-0.5 flex-shrink-0">✕</div>
                  <div>
                    <div className="font-semibold text-sm">High Revision Costs</div>
                    <div className="text-xs text-muted-foreground">Extra fees for changes and iterations</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200/50">
                  <div className="text-red-600 font-bold mt-0.5 flex-shrink-0">✕</div>
                  <div>
                    <div className="font-semibold text-sm">Premium Pricing</div>
                    <div className="text-xs text-muted-foreground">High upfront investment required</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blog Posts */}
      {featuredPosts && featuredPosts.length > 0 && (
        <section className="py-20 bg-muted/50">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Latest Insights</h2>
              <p className="text-xl text-muted-foreground">
                Learn how to leverage AI tools for your business
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                asChild
                variant="outline"
                className="bg-transparent hover:bg-primary hover:text-white border-primary text-primary"
              >
                <Link href="/blog">
                  View All Articles <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        {/* Background gradient animation */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-transparent to-purple-600/0"></div>
        </div>

        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Start Building with AI Today
            </h2>
            <p className="text-xl opacity-90 mb-8">
              All tools are free to start. No credit card required. No commitment. 
              Build your business at your pace.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-blue-600 text-lg px-8 h-14 font-semibold">
                <Link href="/tools">
                  Explore All AI Tools <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-white hover:bg-white hover:text-blue-600 text-white bg-transparent text-lg px-8 h-14 font-semibold"
              >
                <Link href="/tools/domain-name-generator">
                  Try Domain Name Genie
                </Link>
              </Button>
            </div>

            <p className="text-sm opacity-75 mt-8">
              ✨ 12+ free tools • ⚡ Generate in seconds • 💎 Premium quality • 🚀 Enterprise ready
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
