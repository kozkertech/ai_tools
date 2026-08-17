import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,

  Sparkles,
  CheckCircle,
} from "lucide-react"

export const metadata: Metadata = {
  title: "AI Tools Platform for Business Growth | Free Generative AI Tools | KozkerTech",
  description:
    "Discover free AI tools for business: generative AI tools for content, automation, analytics & more. AI-powered solutions for startups and enterprises. No credit card required.",
}

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-28 hero-pattern">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
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
                    Start Building for Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 h-14 border-2">
                  <Link href="/tools">Explore All Tools</Link>
                </Button>
              </div>

              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  ✨ 12+ free tools • 0 setup required • Forever free
                </p>
              </div>
            </div>

            {/* Illustration */}
            <div className="relative">
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
                <Link href="/tools">
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
                        <Link href="/tools">
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


    </>
  )
}
