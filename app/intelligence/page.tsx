import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Brain,
  BarChart3,
  Database,
  TrendingUp,
  Zap,
  ArrowRight,
  Sparkles,
  Filter,
  Lightbulb,
  Target,
  Rocket,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Intelligence - AI Decision Intelligence Platform | KozkerTech",
  description:
    "Turn data into decisions instantly. AI-powered dashboards, data modeling, and insights. Automate analysis, empower decisions.",
}

export default function IntelligencePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="px-4 py-2 text-sm bg-purple-100 text-purple-700 border-purple-200">
                <Brain className="h-4 w-4 mr-2" />
                Decision Intelligence
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Turn Data into Decisions with <span className="text-purple-600">AI Intelligence</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Generate dashboards, DAX measures, data schemas, and insight summaries instantly. 
                Automate repetitive analysis. Empower faster, smarter decisions at every level of your organization.
              </p>

              <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-lg">
                <p className="text-purple-700 dark:text-purple-300 font-semibold flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Instant insights • Structured outputs • Enterprise scale
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                  <Link href="/tools">Explore Intelligence AI Tools</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/tools/data-cleanse">Start with Data Cleanse Tool</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Portfolio%20Update-amico-OhL64K0etmJPJS3dEZtqcPssksdkvh.png"
                alt="AI-powered intelligence platform generating dashboards and data insights instantly"
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">For Data-Driven Organizations</h2>
            <p className="text-xl text-muted-foreground">
              Intelligence accelerates decision-making for enterprises, data teams, and analytics leaders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Enterprise Teams</h3>
              <p className="text-muted-foreground">
                Automate dashboard development, measure generation, and data modeling. Scale BI operations.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Analytics Leaders</h3>
              <p className="text-muted-foreground">
                Reduce time spent on data prep. Focus on insights instead of infrastructure.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Data Professionals</h3>
              <p className="text-muted-foreground">
                AI-assisted data modeling, schema design, and transformation logic generation.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Tools Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">AI Tools for Data Intelligence</h2>
            <p className="text-xl text-muted-foreground">
              Automate the entire BI pipeline from data prep to insights to executive dashboards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Power BI Measure Generator */}
            <Card className="p-6 border-2 border-purple-200/50 hover:border-purple-500 transition-colors">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>Power BI Measure & Viz Generator</CardTitle>
                    <Badge className="mt-1 bg-purple-100 text-purple-700 hover:bg-purple-200">Instant</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Generate DAX measures and visualizations instantly from business requirements
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">AI-generated DAX formulas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Visualization recommendations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Performance optimization tips</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Copy-paste ready code</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Cleanse & Schema Helper */}
            <Card className="p-6 border-2 border-purple-200/50 hover:border-purple-500 transition-colors">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Filter className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Data Cleanse & Schema Helper</CardTitle>
                    <Badge className="mt-1 bg-blue-100 text-blue-700 hover:bg-blue-200">Foundation</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Prepare and structure raw data for analysis in minutes
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Automatic data quality analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Schema design recommendations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Star schema templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Data cleaning guidance</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Dashboard Blueprint Generator */}
            <Card className="p-6 border-2 border-purple-200/50 hover:border-purple-500 transition-colors">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>Dashboard Blueprint Generator</CardTitle>
                    <Badge className="mt-1 bg-green-100 text-green-700 hover:bg-green-200">Design</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Design complete dashboards by describing your analytics needs
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Instant dashboard wireframes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">KPI selection guidance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Visual layout recommendations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Best practices included</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Insight Summary Generator */}
            <Card className="p-6 border-2 border-purple-200/50 hover:border-purple-500 transition-colors">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle>Executive Insight Summarizer</CardTitle>
                    <Badge className="mt-1 bg-orange-100 text-orange-700 hover:bg-orange-200">Summary</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Transform raw data into executive-ready insights and recommendations
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">One-page insight summaries</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Actionable recommendations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Risk and opportunity flagging</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Strategic decision support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* SQL Query Generator */}
            <Card className="p-6 border-2 border-purple-200/50 hover:border-purple-500 transition-colors">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Database className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <CardTitle>SQL & Data Transformation Helper</CardTitle>
                    <Badge className="mt-1 bg-pink-100 text-pink-700 hover:bg-pink-200">Automation</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Generate SQL queries and ETL logic from plain English requirements
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-pink-500" />
                    <span className="text-sm">AI-generated SQL queries</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-pink-500" />
                    <span className="text-sm">ETL transformation templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-pink-500" />
                    <span className="text-sm">Optimization recommendations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-pink-500" />
                    <span className="text-sm">Database-agnostic support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Predictive Analytics Generator */}
            <Card className="p-6 border-2 border-purple-200/50 hover:border-purple-500 transition-colors">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle>Predictive Analytics Generator</CardTitle>
                    <Badge className="mt-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200">Advanced</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Build predictive models and forecasts without advanced ML knowledge
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm">Model selection guidance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm">Forecast generation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm">Accuracy metrics included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm">Scenario simulation ready</span>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">AI-Powered Decision Advantage</h2>
            <p className="text-xl text-muted-foreground">
              Move from data overload to decision clarity at enterprise scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">10x Faster Insights</h3>
              <p className="text-muted-foreground">
                Dashboard development and analysis that normally takes weeks happens in hours
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">70% Less Manual Work</h3>
              <p className="text-muted-foreground">
                Reduce repetitive data prep and transformation tasks. Focus on strategy, not mechanics
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Structured Decisions</h3>
              <p className="text-muted-foreground">
                AI ensures consistent, logic-based decision frameworks across the organization
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Executive Clarity</h3>
              <p className="text-muted-foreground">
                One-page summaries cut through complexity. Leaders get actionable insights, not data dumps
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Enterprise Scalability</h3>
              <p className="text-muted-foreground">
                Handle unlimited dashboards, models, and users without proportional cost increases
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Future-Proof Analytics</h3>
              <p className="text-muted-foreground">
                AI-powered recommendations keep your data architecture modern and competitive
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-600 text-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Turn Data Into Strategic Advantage</h2>
            <p className="text-xl opacity-90 mb-8">
              Start using Intelligence AI tools to automate analysis, generate insights, and empower smarter decisions at every level.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-purple-600">
                <Link href="/tools">Start Using AI Tools Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white hover:bg-white hover:text-purple-600 text-white bg-transparent"
              >
                <Link href="/tools/data-cleanse">Begin Data Prep</Link>
              </Button>
            </div>
            <p className="text-sm opacity-75 mt-4">Enterprise-grade • Instant deployment • Unlimited scalability</p>
          </div>
        </div>
      </section>
    </>
  )
}
