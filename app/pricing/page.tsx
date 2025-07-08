"use client"

import { useState } from "react"
import { Check, Star, Zap, BarChart3, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PriceDisplay } from "@/components/price-display"
import Link from "next/link"

const launchpadPlans = [
  {
    name: "Starter",
    setupFee: 7999,
    monthlyFee: 799,
    description: "Perfect for solopreneurs and new startups",
    features: [
      "3-page website",
      "Basic autoresponder WhatsApp Bot",
      "GMB Setup + Basic SEO",
      "Email Support (3-5 days)",
    ],
    popular: false,
    cta: "Get Started",
  },
  {
    name: "Pro",
    setupFee: 14999,
    monthlyFee: 1999,
    description: "Ideal for growing businesses and coaches",
    features: ["5-6 pages + Blog", "FAQ Bot + Lead Capture", "SEO + Email Campaign", "WhatsApp + Email Support"],
    popular: true,
    cta: "Choose Pro",
  },
  {
    name: "Premium",
    setupFee: 24999,
    monthlyFee: 3499,
    description: "For established professionals and consultants",
    features: [
      "8+ pages, Forms, Blog",
      "Smart Bot + Scheduler",
      "Full Funnel + Blog + Auto Newsletter",
      "Priority Support",
    ],
    popular: false,
    cta: "Go Premium",
  },
  {
    name: "Agency",
    setupFee: 49999,
    monthlyFee: 6999,
    description: "For agencies managing multiple clients",
    features: [
      "Unlimited sites w/ AI-gen (up to 10 sites)",
      "White-label Chatbot",
      "Multi-brand Content Gen",
      "Dedicated Manager + Reports",
    ],
    popular: false,
    cta: "Scale with Agency",
  },
]

const growthsuitePlans = [
  {
    name: "Starter",
    setupFee: 14999,
    monthlyFee: 1499,
    description: "Smart automation for growing SMBs",
    features: ["FAQ Bot (Web + Email)", "3 business flows", "Zapier/Sheets integration", "Email Support (3-day)"],
    popular: false,
    cta: "Start Growing",
  },
  {
    name: "Pro",
    setupFee: 29999,
    monthlyFee: 3999,
    description: "Advanced workflows for scaling businesses",
    features: [
      "WhatsApp + Email + Web Bot",
      "6-8 workflows + API",
      "CRM, Forms, Sheets integration",
      "WhatsApp + Email Support",
    ],
    popular: true,
    cta: "Choose Pro",
  },
  {
    name: "Premium",
    setupFee: 49999,
    monthlyFee: 6999,
    description: "Enterprise-grade automation suite",
    features: ["Agentic Bot + CRM + Docs", "12+ workflows + dashboards", "Full API + Webhooks", "Dedicated Manager"],
    popular: false,
    cta: "Go Premium",
  },
  {
    name: "Agency",
    setupFee: 99999,
    monthlyFee: 14999,
    description: "Multi-client automation platform",
    features: [
      "White-label AI Assistants (up to 5 clients)",
      "Custom flows per client",
      "Cross-client DB + CRM sync",
      "SLA + Onboarding + Reporting",
    ],
    popular: false,
    cta: "Scale Agency",
  },
]

const intelligencePlans = [
  {
    name: "Basic BI",
    setupFee: 24999,
    monthlyFee: 3499,
    description: "Essential business intelligence for SMBs",
    features: [
      "Excel, Forms data sources",
      "Sales, Leads dashboards",
      "Power BI Desktop",
      "5-10 Users",
      "Email Support",
    ],
    popular: false,
    cta: "Start with BI",
  },
  {
    name: "Pro BI",
    setupFee: 59999,
    monthlyFee: 7999,
    description: "Advanced analytics for growing companies",
    features: [
      "Sheets, CRM, API integration",
      "Ops, HR, Finance dashboards",
      "Power BI Cloud",
      "10-25 Users",
      "BI Review Calls",
    ],
    popular: true,
    cta: "Choose Pro BI",
  },
  {
    name: "Enterprise BI",
    setupFee: 125000,
    monthlyFee: 14999,
    description: "Complete BI solution for large organizations",
    features: [
      "ERP, Azure, SQL, APIs",
      "Full Org + Custom KPIs",
      "Power BI Premium + Azure",
      "25+ Users, RLS",
      "SLA + Weekly Support",
    ],
    popular: false,
    cta: "Enterprise Solution",
  },
  {
    name: "BI Agency",
    setupFee: 199999,
    monthlyFee: 24999,
    description: "White-label BI platform for agencies",
    features: [
      "Multi-client DB integrations (for 3 clients)",
      "White-label Dashboards",
      "Multi-tenant Power BI Stack",
      "10 users/client",
      "SLA + Account Manager",
    ],
    popular: false,
    cta: "BI Agency Platform",
  },
]

const addOns = [
  { name: "Additional Website / Brand", price: 3999 },
  { name: "Custom AI Flow", price: 2499 },
  { name: "WhatsApp API Setup + Chat History", price: 1999 },
  { name: "Dashboard Add-on (New dept/view)", price: 2999 },
  { name: "CRM/ERP Custom Integration", price: 4999 },
  { name: "Training Session (Team)", price: 2999 },
]

const freeTools = {
  launchpad: [
    { name: "Domain Name Generator", description: "AI-powered domain suggestions for your business" },
    { name: "Landing Page Copy Generator", description: "Create compelling hero copy that converts" },
    { name: "Tagline & Value Prop Creator", description: "Craft memorable taglines and value propositions" },
    { name: "SEO Keyword Gap Analyzer", description: "Find content gaps and keyword opportunities" },
  ],
  growthsuite: [
    { name: "Social Media Content Suggester", description: "Generate engaging social media content ideas" },
    { name: "Email Subject Line Generator", description: "Create high-converting email subject lines" },
    { name: "Blog Content Generator", description: "AI-powered blog post ideas and outlines" },
    { name: "Meeting Summary Extractor", description: "Extract key insights from meeting transcripts" },
  ],
  intelligence: [
    { name: "Data Cleanse Tool", description: "Clean and standardize your business data" },
    { name: "Power BI Measure Generator", description: "Generate DAX measures for Power BI" },
    { name: "Business Plan Generator", description: "AI-powered business plan creation" },
    { name: "Proposal Draft Generator", description: "Create professional business proposals" },
  ],
}

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState("launchpad")

  const PricingCard = ({ plan, index }: { plan: any; index: number }) => (
    <Card className={`relative ${plan.popular ? "border-blue-500 shadow-lg scale-105" : ""}`}>
      {plan.popular && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">Most Popular</Badge>
      )}
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {plan.name}
          {plan.popular && <Star className="h-5 w-5 text-yellow-500 fill-current" />}
        </CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Setup Fee: <PriceDisplay amount={plan.setupFee} className="text-lg font-semibold text-foreground" />
          </div>
          <div className="text-sm text-muted-foreground">
            Monthly: <PriceDisplay amount={plan.monthlyFee} className="text-2xl font-bold text-foreground" />
            /mo
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-6">
          {plan.features.map((feature: string, idx: number) => (
            <li key={idx} className="flex items-start">
              <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        <Button className={`w-full ${plan.popular ? "bg-blue-500 hover:bg-blue-600" : ""}`} asChild>
          <Link href="/contact">{plan.cta}</Link>
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Choose Your Growth Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            From AI-powered websites to enterprise business intelligence - we have the perfect solution for your
            business needs.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>All prices in INR</span>
            <Badge variant="outline">International pricing available on request</Badge>
          </div>
        </div>

        {/* Pricing Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-12 max-w-2xl mx-auto">
            <TabsTrigger value="launchpad" className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              LaunchPad
            </TabsTrigger>
            <TabsTrigger value="growthsuite" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              GrowthSuite
            </TabsTrigger>
            <TabsTrigger value="intelligence" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Intelligence
            </TabsTrigger>
          </TabsList>

          {/* LaunchPad Tab */}
          <TabsContent value="launchpad" className="space-y-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
                <Rocket className="h-8 w-8 text-blue-500" />
                LaunchPad
              </h2>
              <p className="text-lg text-muted-foreground mb-2">AI Website + Marketing + WhatsApp Starter Bots</p>
              <p className="text-sm text-muted-foreground">
                Perfect for: Solopreneurs, Startups, Coaches, Professionals, Consultants, Agencies
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {launchpadPlans.map((plan, index) => (
                <PricingCard key={plan.name} plan={plan} index={index} />
              ))}
            </div>

            {/* Free Tools for LaunchPad */}
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Free LaunchPad Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {freeTools.launchpad.map((tool, index) => (
                  <Card key={index} className="bg-white dark:bg-slate-800">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">{tool.name}</h4>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* GrowthSuite Tab */}
          <TabsContent value="growthsuite" className="space-y-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
                <Zap className="h-8 w-8 text-green-500" />
                GrowthSuite
              </h2>
              <p className="text-lg text-muted-foreground mb-2">AI Workflows + Smart WhatsApp + LLM Chatbots</p>
              <p className="text-sm text-muted-foreground">Perfect for: SMBs, Agencies, D2C, SaaS, Service Providers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {growthsuitePlans.map((plan, index) => (
                <PricingCard key={plan.name} plan={plan} index={index} />
              ))}
            </div>

            {/* Free Tools for GrowthSuite */}
            <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Free GrowthSuite Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {freeTools.growthsuite.map((tool, index) => (
                  <Card key={index} className="bg-white dark:bg-slate-800">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">{tool.name}</h4>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Intelligence Tab */}
          <TabsContent value="intelligence" className="space-y-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
                <BarChart3 className="h-8 w-8 text-purple-500" />
                Intelligence
              </h2>
              <p className="text-lg text-muted-foreground mb-2">BI / Reporting / Dashboards with Power BI + Azure</p>
              <p className="text-sm text-muted-foreground">
                Perfect for: Enterprises, Large SMBs, Multi-department Ops, BI-focused Agencies
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {intelligencePlans.map((plan, index) => (
                <PricingCard key={plan.name} plan={plan} index={index} />
              ))}
            </div>

            {/* Free Tools for Intelligence */}
            <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Free Intelligence Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {freeTools.intelligence.map((tool, index) => (
                  <Card key={index} className="bg-white dark:bg-slate-800">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">{tool.name}</h4>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add-Ons Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Add-Ons & Extras</h2>
          <p className="text-center text-muted-foreground mb-8">Enhance any plan with these additional services</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {addOns.map((addon, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">{addon.name}</h3>
                  <div className="text-2xl font-bold text-blue-600">
                    <PriceDisplay amount={addon.price} />
                    {addon.name.includes("Integration") && "+"}
                    {addon.name.includes("Training") && "/session"}
                    {addon.name.includes("Website") && "/site"}
                    {addon.name.includes("Flow") && "/flow"}
                    {addon.name.includes("Dashboard") && "/report"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What's the difference between setup fee and monthly fee?</h3>
                <p className="text-muted-foreground">
                  The setup fee is a one-time payment for initial development, configuration, and deployment. The
                  monthly fee covers ongoing maintenance, hosting, support, and feature updates.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Do you offer international pricing?</h3>
                <p className="text-muted-foreground">
                  Yes! While our standard pricing is in INR, we offer competitive international pricing in USD, EUR, and
                  other currencies. Contact us for a custom quote based on your location.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What does the Agency tier include?</h3>
                <p className="text-muted-foreground">
                  Agency tiers are designed for businesses managing multiple clients or brands. They include white-label
                  solutions, multi-client dashboards, dedicated account management, and scalable infrastructure.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Can I upgrade or downgrade my plan?</h3>
                <p className="text-muted-foreground">
                  You can upgrade anytime by paying the difference in setup fees. Downgrades are processed at your next
                  billing cycle. Contact our support team for assistance with plan changes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
              <p className="text-xl mb-8 opacity-90">
                Choose the perfect plan and start your digital transformation journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/contact">Get Custom Quote</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
                  asChild
                >
                  <Link href="/solutions">View Solutions</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
