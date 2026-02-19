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
  Briefcase,
  PenTool,
  LineChart,
} from "lucide-react"
import { getFeaturedPosts } from "@/lib/ghost"
import { PostCard } from "@/components/post-card"

export const metadata: Metadata = {
  title: "AI Tools Platform for Business Growth | Free Generative AI Tools | KozkerTech",
  description:
    "Discover free AI tools for business: generative AI tools for content, automation, analytics & more. AI-powered solutions for startups and enterprises. No credit card required.",
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
      {/* Hero Section */}
      <section className="py-20 md:py-28 hero-pattern">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <Badge className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Business Tools
              </Badge>

              <h1 className="text-5xl md:text-6xl lg:text-6xl font-bold tracking-tight leading-tight">
                Launch, Grow <span className="text-primary">&amp; Scale</span> Your Business with AI
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                Discover powerful AI tools designed to help you create content, generate images, write code, automate workflows, and make smarter business decisions — all in minutes.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                From AI writing tools to AI automation tools, our platform gives you everything you need to build and scale faster.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="text-lg px-8 h-14">
                  <Link href="/tools">
                    Explore Our Free AI Tools <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 h-14 border-2">
                  <Link href="#ai-ecosystem">See AI Tool Suites</Link>
                </Button>
              </div>

              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  ✨ 12+ free tools • 0 setup required • Forever free
                </p>
              </div>
            </div>

            {/* Original SVG Illustration */}
            <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Version%20control-cuate-yIM8dgQYh75USr7RBxwMELEfYb0KvG.png"
                alt="Software developer working on code with workflow diagrams and development processes"
                width={600}
                height={600}
                className="rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>


      {/* What You Can Do with AI Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What You Can Do with AI</h2>
            <p className="text-xl text-muted-foreground">
              Our AI tools are built for founders, marketers, developers, and business teams who want faster execution and smarter workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1️⃣ Launch Your Brand */}
            <Card className="border-2 border-green-200/50 hover:border-green-500 transition-all group overflow-hidden">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Rocket className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">1️⃣ Launch Your Brand</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Generate domain names, create compelling taglines, define pricing strategies, and build your business foundation using intelligent AI tools.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">AI writing tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">AI content generator</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Brand messaging tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">AI pricing calculators</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* 2️⃣ Create & Scale Content */}
            <Card className="border-2 border-blue-200/50 hover:border-blue-500 transition-all group overflow-hidden">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">2️⃣ Create & Scale Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Produce high-quality content instantly with powerful AI writing tools and AI SEO tools. Our AI keyword research tools help you discover high-volume opportunities.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-sm">Blog posts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-sm">AI SEO content</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-sm">Keyword research insights</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-sm">AI content outlines</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* 3️⃣ Build Visuals & Media */}
            <Card className="border-2 border-purple-200/50 hover:border-purple-500 transition-all group overflow-hidden">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <PenTool className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">3️⃣ Build Visuals & Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Turn ideas into visuals using advanced AI image generator and AI video generator tools. Our AI image generator makes design accessible and efficient.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span className="text-sm">Text to image AI designs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span className="text-sm">Social media visuals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span className="text-sm">AI-generated thumbnails</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span className="text-sm">Text to video presentations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* 4️⃣ Automate Workflows */}
            <Card className="border-2 border-orange-200/50 hover:border-orange-500 transition-all group overflow-hidden">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">4️⃣ Automate Workflows</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Reduce repetitive work with AI automation tools and workflow automation AI systems. Focus on strategy while AI handles execution.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <span className="text-sm">Email sequences</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <span className="text-sm">Proposal drafting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <span className="text-sm">Lead follow-ups</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <span className="text-sm">Customer onboarding</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* 5️⃣ Develop & Code Faster */}
            <Card className="border-2 border-pink-200/50 hover:border-pink-500 transition-all group overflow-hidden">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Bot className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle className="text-lg">5️⃣ Develop & Code Faster</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Speed up development with intelligent AI coding tools. Our AI coding tools help developers move faster with confidence.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-pink-500 flex-shrink-0" />
                    <span className="text-sm">Coding assistant AI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-pink-500 flex-shrink-0" />
                    <span className="text-sm">AI code snippet generator</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-pink-500 flex-shrink-0" />
                    <span className="text-sm">AI debugging helpers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-pink-500 flex-shrink-0" />
                    <span className="text-sm">AI documentation generators</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* 6️⃣ Communicate with AI Chat & Voice Tools */}
            <Card className="border-2 border-cyan-200/50 hover:border-cyan-500 transition-all group overflow-hidden">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Type className="h-6 w-6 text-cyan-600" />
                </div>
                <CardTitle className="text-lg">6️⃣ AI Chat & Voice Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Enhance engagement using AI chat tools and AI voice generator solutions. Scale communication without increasing workload.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-cyan-500 flex-shrink-0" />
                    <span className="text-sm">AI chat assistant tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-cyan-500 flex-shrink-0" />
                    <span className="text-sm">Text to speech AI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-cyan-500 flex-shrink-0" />
                    <span className="text-sm">AI voice generator</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-cyan-500 flex-shrink-0" />
                    <span className="text-sm">AI-powered customer replies</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Tool - Domain Name Genie */}
      <section id="featured-tool" className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Feature Details */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Start with Our Most Popular AI Tool</h2>
                <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Domain Name Genie</h3>
                <p className="text-lg text-muted-foreground">
                  Find the perfect domain name using our AI-powered domain generator. Get brand-friendly suggestions with real-time availability checks.
                </p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">AI-powered domain suggestions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">Multiple TLD options</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">Instant results</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-sm">Built for startups and small businesses</span>
                </li>
              </ul>

              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 h-12">
                <Link href="/tools/domain-name-generator">
                  Try Domain Name Genie Free →
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

                      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors">
                        <div>
                          <div className="font-semibold text-sm">innovatebiz.io</div>
                          <div className="text-xs text-muted-foreground">Fresh & modern</div>
                        </div>
                        <Badge className="bg-primary/10 text-primary">Available</Badge>
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

      {/* Use Cases Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How Businesses Use Our AI Tools</h2>
            <p className="text-xl text-muted-foreground">
              Real-world examples of how teams accelerate their work every day
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Startup Founder */}
            <Card className="border-2 border-green-200/50 hover:border-green-500 hover:shadow-lg transition-all group cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Rocket className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Startup Founder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Generates domain names, taglines, and pricing models in one afternoon to validate an idea quickly.
                </p>
              </CardContent>
            </Card>

            {/* Marketing Manager */}
            <Card className="border-2 border-primary/30 hover:border-primary hover:shadow-lg transition-all group cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Marketing Manager</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Uses AI writing tools and AI SEO tools to create campaigns and content faster.
                </p>
              </CardContent>
            </Card>

            {/* Sales Team */}
            <Card className="border-2 border-blue-200/50 hover:border-blue-500 hover:shadow-lg transition-all group cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Sales Team</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Creates professional proposals and follow-up sequences using AI automation tools.
                </p>
              </CardContent>
            </Card>

            {/* Business Analyst */}
            <Card className="border-2 border-purple-200/50 hover:border-purple-500 hover:shadow-lg transition-all group cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <LineChart className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Business Analyst</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Uses AI-powered analytics tools to clean data and generate dashboards efficiently.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Tool Ecosystem Overview */}
      <section id="ai-ecosystem" className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">AI Tools for Every Stage of Business</h2>
            <p className="text-xl text-muted-foreground">
              Choose the right AI tool suite for your business needs
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
                  <p className="text-sm text-muted-foreground font-normal mt-2">AI Tools for Startups</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    AI tools designed for startups and early-stage businesses. Build your brand, messaging, pricing, and launch assets using generative AI and intelligent automation.
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
              <Card className="h-full border-2 border-primary/30 hover:border-primary transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>GrowthSuite</CardTitle>
                  <p className="text-sm text-muted-foreground font-normal mt-2">AI Growth Tools for Scaling</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    AI growth and marketing tools for scaling businesses. Generate proposals, AI SEO tools, automation workflows, and conversion-driven content.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Proposal generation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Email sequences</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Content automation</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <span className="text-sm font-semibold text-primary group-hover:text-primary/80">
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
                  <p className="text-sm text-muted-foreground font-normal mt-2">AI Analytics & BI</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    AI-powered analytics and business intelligence tools. Turn raw data into structured insights using AI analytics tools and machine learning-driven dashboards.
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

      {/* Why Businesses Use AI Tools */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Businesses Use AI Tools</h2>
            <p className="text-lg text-muted-foreground">
              AI tools provide speed, flexibility, and intelligent assistance — helping teams move faster and experiment more efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
            <div className="flex items-start gap-3 p-4">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <div className="font-semibold">Generate results instantly</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <div className="font-semibold">Reduce repetitive manual work</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <div className="font-semibold">Improve workflow efficiency</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <div className="font-semibold">Access powerful AI tools at no cost</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 md:col-span-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <div className="font-semibold">Iterate and refine ideas quickly</div>
              </div>
            </div>
          </div>

          <div className="text-center max-w-2xl mx-auto">
            <p className="text-lg text-muted-foreground">
              Our AI tools are designed to support businesses of all sizes — from startups to enterprises.
            </p>
          </div>
        </div>
      </section>

      {/* Why AI Over Agencies */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Use Free AI Tools Instead of Agencies?</h2>
            <p className="text-xl text-muted-foreground">
              The future of business is self-service, instant, and powered by intelligent automation and AI tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* AI Side */}
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Badge className="bg-primary/10 text-primary text-sm py-2 px-4">
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

      {/* AI Tools Directory Section */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-muted-foreground leading-relaxed">
              KozkerTech provides a growing AI tools directory including AI content generators, AI automation tools, AI marketing tools, AI analytics tools, and generative AI applications built for startups and enterprises. Explore free AI tools for small business, AI tools for entrepreneurs, and best generative AI tools designed to accelerate your business growth.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Blog Posts */}
      {featuredPosts && featuredPosts.length > 0 && (
        <section className="py-20 bg-muted/50">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Latest Insights on AI Business Tools</h2>
              <p className="text-xl text-muted-foreground">
                Learn how to leverage AI tools and generative AI for your business growth
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
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/0 to-primary/0"></div>
        </div>

        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Start Building with AI Today
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Explore our growing collection of AI writing tools, AI image generator tools, AI coding assistants, AI SEO tools, AI automation tools, and AI chat & voice generators.
            </p>
            <p className="text-lg opacity-90 mb-8">
              Discover how intelligent automation can simplify your business workflows.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-primary text-lg px-8 h-14 font-semibold">
                <Link href="/tools">
                  🚀 Explore Our Free AI Tools Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
