import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  TrendingUp,
  MessageSquare,
  FileText,
  Zap,
  ArrowRight,
  Sparkles,
  BarChart3,
  Target,
  Rocket,
  Brain,
  Mail,
  PenTool,
} from "lucide-react"

export const metadata: Metadata = {
  title: "GrowthSuite - AI Marketing & Sales Tools | AI Automation Software | KozkerTech",
  description:
    "Scale faster with AI-powered growth and automation tools. AI marketing tools, sales automation, proposal generator, and email sequencer. Automate your sales pipeline and grow revenue.",
}

export default function GrowthSuitePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="px-4 py-2 text-sm bg-blue-100 text-blue-700 border-blue-200">
                <TrendingUp className="h-4 w-4 mr-2" />
                AI Growth Stack
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Scale Smarter with <span className="text-blue-600">AI-Driven Growth Tools</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Use AI automation tools to generate campaigns, proposals, and email sequences instantly. Automate your sales pipeline with intelligent automation, accelerate conversions,
                and scale without the marketing costs. AI sales automation does the work, you close the deals.
              </p>

              <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-blue-700 dark:text-blue-300 font-semibold flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Instant content generation • Automated workflows • No agency needed
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/tools">Explore GrowthSuite AI Tools</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/tools/proposal-draft-generator">Generate a Proposal Now</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Webinar-rafiki-ZpKQZr2G6pGwpmVXCqSHEHG3XFggOk.png"
                alt="AI-powered growth tools generating marketing campaigns, proposals, and sales content"
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Best AI Tools for Growing Businesses</h2>
            <p className="text-xl text-muted-foreground">
              GrowthSuite accelerates revenue growth with AI automation tools for businesses ready to automate their entire sales and marketing pipeline using intelligent automation and AI marketing tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Growing B2B Companies</h3>
              <p className="text-muted-foreground">
                Automate proposal generation, sales sequences, and customer communication at scale
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">E-Commerce & Retail</h3>
              <p className="text-muted-foreground">
                Generate product marketing, customer emails, and promotional content instantly
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Agencies & Service Firms</h3>
              <p className="text-muted-foreground">
                Deliver client work faster. Proposals, content, and strategies generated instantly
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Tools Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">AI Tools in GrowthSuite</h2>
            <p className="text-xl text-muted-foreground">
              Complete AI automation tools and sales software stack for pipeline acceleration, content generation, marketing automation, and revenue growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Proposal Generator */}
            <Card className="p-6 border-2 border-blue-200/50 hover:border-blue-500 transition-colors">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Proposal Draft Generator</CardTitle>
                    <Badge className="mt-1 bg-blue-100 text-blue-700 hover:bg-blue-200">Instant</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Generate professional proposals in seconds from brief requirements
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Instant proposal drafts in seconds</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Customizable by industry and scope</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Pricing and terms included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Unlimited variations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Email Sequencer */}
            <Card className="p-6 border-2 border-blue-200/50 hover:border-blue-500 transition-colors">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>Follow-Up Email Sequencer</CardTitle>
                    <Badge className="mt-1 bg-green-100 text-green-700 hover:bg-green-200">Automated</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Generate complete email sequences for nurturing and closing deals
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Multi-email campaign sequences</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Objection handling included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Time-optimized send scheduling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Copy variations for A/B testing</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* SEO Content Analyzer */}
            <Card className="p-6 border-2 border-blue-200/50 hover:border-blue-500 transition-colors">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>SEO Keyword & Content Gap Analyzer</CardTitle>
                    <Badge className="mt-1 bg-purple-100 text-purple-700 hover:bg-purple-200">Strategic</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Identify content opportunities and competitive gaps instantly
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Instant keyword research</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Competitor content analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Content gap identification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Priority recommendations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Sales Script Generator */}
            <Card className="p-6 border-2 border-blue-200/50 hover:border-blue-500 transition-colors">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle>Sales Script Generator</CardTitle>
                    <Badge className="mt-1 bg-orange-100 text-orange-700 hover:bg-orange-200">Conversion</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Generate conversion-optimized sales scripts for calls and meetings
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Opening lines and hooks</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Objection handling scripts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Closing techniques included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">By industry and use case</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Customer Persona Generator */}
            <Card className="p-6 border-2 border-blue-200/50 hover:border-blue-500 transition-colors">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <CardTitle>Customer Persona Generator</CardTitle>
                    <Badge className="mt-1 bg-pink-100 text-pink-700 hover:bg-pink-200">Insights</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Create detailed customer personas to target your campaigns precisely
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-pink-500" />
                    <span className="text-sm">Instant persona development</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-pink-500" />
                    <span className="text-sm">Pain points and motivations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-pink-500" />
                    <span className="text-sm">Demographic and behavioral data</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-pink-500" />
                    <span className="text-sm">Multiple persona variations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Press Release Template */}
            <Card className="p-6 border-2 border-blue-200/50 hover:border-blue-500 transition-colors">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <PenTool className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle>Press Release Generator</CardTitle>
                    <Badge className="mt-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200">PR Ready</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Generate professional press releases for launches and announcements
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm">Industry-standard formatting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm">Media-ready copy</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm">Distribution guidelines</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm">Multiple announcement types</span>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Growing Businesses Choose AI Over Agencies</h2>
            <p className="text-xl text-muted-foreground">
              Control, speed, and cost efficiency at enterprise scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">90% Faster Execution</h3>
              <p className="text-muted-foreground">
                Generate campaigns, proposals, and content in minutes instead of days or weeks
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">60% Cost Reduction</h3>
              <p className="text-muted-foreground">
                Eliminate agency markups. Automated tools cost a fraction of external services
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Instant Variations</h3>
              <p className="text-muted-foreground">
                Test unlimited campaign variations. A/B test copy, messaging, and strategies instantly
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Instant Insights</h3>
              <p className="text-muted-foreground">
                AI analyzes market data, competitor strategies, and opportunities in real-time
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Pipeline Acceleration</h3>
              <p className="text-muted-foreground">
                Nurture leads automatically. Accelerate sales cycles with AI-driven workflows
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Scalable Growth</h3>
              <p className="text-muted-foreground">
                Handle 10x more leads without proportional cost increases. Scale infinitely
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Accelerate Your Growth?</h2>
            <p className="text-xl opacity-90 mb-8">
              Start using GrowthSuite AI tools to automate your pipeline, generate content instantly, and scale revenue without proportional costs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-blue-600">
                <Link href="/tools">Start Using AI Tools Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white hover:bg-white hover:text-blue-600 text-white bg-transparent"
              >
                <Link href="/tools/proposal-draft-generator">Generate Your First Proposal</Link>
              </Button>
            </div>
            <p className="text-sm opacity-75 mt-4">Free forever • Unlimited usage • Instant results</p>
          </div>
        </div>
      </section>
    </>
  )
}
