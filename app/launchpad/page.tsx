import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Rocket, Globe, Palette, Type, Calculator, ArrowRight, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "LaunchPad AI Tools | Free AI Tools for Startups & Founders",
  description:
    "Launch your startup with powerful free AI tools. Generate domain names, taglines, pricing strategies, branding assets and more — instantly.",
}

export default function LaunchPadPage() {
  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section className="py-24 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/30">
        <div className="container text-center max-w-4xl">
          <Badge className="mb-6 bg-green-100 text-green-700 border-green-200">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Launch Tools
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Everything You Need to Launch
            <span className="text-green-600"> — Powered by AI</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10">
            LaunchPad is a collection of free AI tools built for founders, startups, and small businesses.
            Generate your brand, domain, messaging, pricing and more — in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link href="/tools">Explore Launch Tools</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/tools/domain-name-generator">
                Try Domain Name Genie
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ================= TOOL GRID ================= */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              LaunchPad AI Tool Suite
            </h2>
            <p className="text-xl text-muted-foreground">
              Designed specifically for idea-stage and launch-stage businesses.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Domain Name Genie */}
            <Card className="hover:shadow-xl transition-all border-2 hover:border-green-300">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Domain Name Genie</CardTitle>
                <CardDescription>
                  AI-powered domain suggestions with availability check.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                  <Link href="/tools/domain-name-generator">
                    Try Now
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Tagline Creator */}
            <Card className="hover:shadow-xl transition-all border-2 hover:border-green-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Type className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Tagline & UVP Creator</CardTitle>
                <CardDescription>
                  Craft compelling taglines and value propositions instantly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/tools/tagline-value-prop-creator">
                    Generate Tagline
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Logo Palette */}
            <Card className="hover:shadow-xl transition-all border-2 hover:border-green-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Palette className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Logo Color Palette Picker</CardTitle>
                <CardDescription>
                  Generate brand-aligned color palettes for your startup.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/tools/logo-color-palette-picker">
                    Create Palette
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pricing Calculator */}
            <Card className="hover:shadow-xl transition-all border-2 hover:border-green-300">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Pricing Strategy Calculator</CardTitle>
                <CardDescription>
                  Find optimal pricing based on costs and margins.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/tools/pricing-generator">
                    Calculate Pricing
                  </Link>
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* ================= HOW IT HELPS ================= */}
      <section className="py-20 bg-muted/50">
        <div className="container max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Founders Use LaunchPad
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10 text-center">

            <div>
              <Rocket className="mx-auto h-10 w-10 text-green-600 mb-4" />
              <h3 className="font-bold text-xl mb-2">Launch Faster</h3>
              <p className="text-muted-foreground">
                Go from idea to execution in hours, not weeks.
              </p>
            </div>

            <div>
              <CheckCircle className="mx-auto h-10 w-10 text-blue-600 mb-4" />
              <h3 className="font-bold text-xl mb-2">Zero Cost</h3>
              <p className="text-muted-foreground">
                All core LaunchPad tools are completely free to use.
              </p>
            </div>

            <div>
              <Sparkles className="mx-auto h-10 w-10 text-purple-600 mb-4" />
              <h3 className="font-bold text-xl mb-2">AI-Optimized</h3>
              <p className="text-muted-foreground">
                Built with AI to generate high-quality, practical outputs instantly.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 bg-green-600 text-white text-center">
        <div className="container max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Launch Your Business?
          </h2>

          <p className="text-xl mb-8 opacity-90">
            Start with a domain name, build your brand, define your pricing —
            all powered by AI.
          </p>

          <Button asChild size="lg" variant="secondary" className="text-green-700">
            <Link href="/tools">
              Explore All Launch Tools
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
