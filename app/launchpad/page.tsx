import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Rocket, Globe, Zap, Sparkles, ArrowRight, Lightbulb, Palette, Calculator, FileText, Brain, Target } from "lucide-react"

export const metadata: Metadata = {
  title: "LaunchPad - AI Tools for Startups | Free AI Launch Toolkit | KozkerTech",
  description:
    "Launch your business instantly with free AI tools for startups. AI-powered domain generator, branding tools, and business planning software. Perfect for entrepreneurs and first-time founders.",
}

export default function LaunchPadPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="px-4 py-2 text-sm bg-green-100 text-green-700 border-green-200">
                <Rocket className="h-4 w-4 mr-2" />
                AI Launch Toolkit
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Launch Your Business with <span className="text-green-600">AI-Powered Tools</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Everything you need to build your brand foundation in minutes. Use free AI tools to generate domain names, craft your brand message,
                create pricing strategies, and build your business plan—all powered by instant generative AI solutions for startups.
              </p>

              <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-green-700 dark:text-green-300 font-semibold flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Instant AI tools • No agency fees • Your complete control
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                  <Link href="/tools">Explore LaunchPad AI Tools</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/tools/domain-name-generator">Start with Domain Name Genie</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Version%20control-bro-Qh89MYaKZ0pQ3bE5Ki22coNF2ls8tw.png"
                alt="AI-powered tools generating business foundations with instant outputs"
                width={600}
                height={600}
                className="rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Best AI Tools for Startup Founders</h2>
            <p className="text-xl text-muted-foreground">
              LaunchPad is the ultimate AI tools for startups, designed for founders and entrepreneurs ready to launch independently, fast, and affordably using free AI tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">First-Time Founders</h3>
              <p className="text-muted-foreground">
                Get your business identity, brand message, and initial business plan generated in minutes using AI tools for entrepreneurs
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Local Service Businesses</h3>
              <p className="text-muted-foreground">
                Generate pricing models, service descriptions, and marketing messaging instantly without agency dependency
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Lean Startups</h3>
              <p className="text-muted-foreground">
                Launch with zero budget for external services. AI tools replace expensive consultants and agencies
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Tools Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">AI Tools Included in LaunchPad</h2>
            <p className="text-xl text-muted-foreground">
              Explore our complete collection of free AI tools for startup success. Instantly generate everything your startup needs to launch and scale with intelligent automation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Domain Name Genie */}
            <Card className="p-6 border-2 border-green-200/50 hover:border-green-500 transition-colors">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Globe className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>Domain Name Genie</CardTitle>
                    <Badge className="mt-1 bg-green-100 text-green-700 hover:bg-green-200">AI-Powered</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Generate perfect domain names in seconds based on your business idea
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Instant AI suggestions (100+ names)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Real-time availability checking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Multiple TLD options included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Direct registration links</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Tagline & UVP Creator */}
            <Card className="p-6 border-2 border-green-200/50 hover:border-green-500 transition-colors">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Tagline & UVP Creator</CardTitle>
                    <Badge className="mt-1 bg-blue-100 text-blue-700 hover:bg-blue-200">Instant Output</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Craft compelling brand messaging and value propositions instantly
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Generate in seconds</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Multiple tagline variations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Customer-focused messaging</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Unlimited iterations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Pricing Calculator */}
            <Card className="p-6 border-2 border-green-200/50 hover:border-green-500 transition-colors">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calculator className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>Pricing Strategy Generator</CardTitle>
                    <Badge className="mt-1 bg-purple-100 text-purple-700 hover:bg-purple-200">Strategic</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Generate competitive pricing models and strategy recommendations
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Market-based pricing tiers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Value-based pricing model</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Instant revenue projections</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Competitive analysis included</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* AI Business Plan Generator */}
            <Card className="p-6 border-2 border-green-200/50 hover:border-green-500 transition-colors">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle>AI Business Plan Generator</CardTitle>
                    <Badge className="mt-1 bg-orange-100 text-orange-700 hover:bg-orange-200">Comprehensive</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Create a complete, structured business plan in minutes
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Executive summary generation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Market analysis and positioning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Financial projections</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Downloadable document</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Logo Color Palette Picker */}
            <Card className="p-6 border-2 border-green-200/50 hover:border-green-500 transition-colors">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Palette className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <CardTitle>Brand Color Palette Generator</CardTitle>
                    <Badge className="mt-1 bg-pink-100 text-pink-700 hover:bg-pink-200">Design</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Generate professional color palettes for your brand identity
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-pink-500" />
                    <span className="text-sm">Instant color palette generation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-pink-500" />
                    <span className="text-sm">Psychology-based recommendations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-pink-500" />
                    <span className="text-sm">Accessibility compliance checked</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-pink-500" />
                    <span className="text-sm">Export as CSS/Hex codes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* FAQ Builder */}
            <Card className="p-6 border-2 border-green-200/50 hover:border-green-500 transition-colors">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Brain className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle>FAQ & Messaging Builder</CardTitle>
                    <Badge className="mt-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200">Content Ready</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Generate customer FAQs and response templates instantly
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm">AI-generated FAQ sections</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm">Customer service templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm">Objection handling responses</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm">Fully customizable</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Founders Use LaunchPad AI</h2>
            <p className="text-xl text-muted-foreground">
              Empower yourself with AI—move fast, control your narrative, and launch affordably
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Launch in Minutes</h3>
              <p className="text-muted-foreground">
                From idea to business foundation in minutes, not weeks. Get everything you need instantly.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">100% Founder Control</h3>
              <p className="text-muted-foreground">
                No agency dependency. You generate, iterate, and refine at your pace. Your brand, your rules.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Zero Cost to Start</h3>
              <p className="text-muted-foreground">
                All LaunchPad tools are free. No hidden fees, no consulting costs, no setup charges.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Unlimited Iterations</h3>
              <p className="text-muted-foreground">
                Generate as many variations as you need. Test messaging, pricing, and brand concepts instantly.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Expert-Level Output</h3>
              <p className="text-muted-foreground">
                AI-powered tools deliver professional-quality results that rival expensive consultants.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fully Integrated</h3>
              <p className="text-muted-foreground">
                All tools work together seamlessly. Build your complete brand foundation in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-Product Link Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Next Steps: Scale Your Business with AI Tools</h2>
            <p className="text-xl text-muted-foreground mb-8">
              After launching with LaunchPad, explore our AI automation tools and AI analytics tools for scaling.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-blue-200/50 p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl">GrowthSuite</CardTitle>
                <p className="text-sm text-muted-foreground font-normal mt-2">Scale with AI Automation & Marketing Tools</p>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Ready to accelerate growth? Explore our AI marketing tools, sales automation, and AI automation tools for scaling your business.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/growthsuite">Explore GrowthSuite →</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-2 border-purple-200/50 p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl">Intelligence</CardTitle>
                <p className="text-sm text-muted-foreground font-normal mt-2">Data-Driven Decisions with AI Analytics</p>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Transform your data into insights. Discover our AI analytics tools, machine learning tools, and dashboard generators.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/intelligence">Explore Intelligence →</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Launch Your Business?</h2>
            <p className="text-xl opacity-90 mb-8">
              Start with LaunchPad AI tools today. Build your brand foundation, strategy, and launch plan in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-green-600">
                <Link href="/tools">Start Using AI Tools Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white hover:bg-white hover:text-green-600 text-white bg-transparent"
              >
                <Link href="/tools/domain-name-generator">Generate My Domain Names</Link>
              </Button>
            </div>
            <p className="text-sm opacity-75 mt-4">Free forever • No credit card required • Unlimited generations</p>
          </div>
        </div>
      </section>
    </>
  )
}
