import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { SchemaMarkup } from "@/components/schema-markup"

export const metadata: Metadata = {
  title: "AI-Powered Web Design | Kozker Tech",
  description:
    "Leverage artificial intelligence to create stunning, functional websites that adapt to your users' needs and preferences.",
}

export default function AIWebDesignPage() {
  const benefits = [
    "Automated design suggestions based on your brand and industry",
    "AI-generated content that resonates with your target audience",
    "User experience optimization through behavior analysis",
    "Faster development cycles with AI-assisted coding",
    "Personalized user experiences that adapt to visitor preferences",
    "Continuous improvement through AI-driven analytics",
  ]

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI-Powered Web Design",
    provider: {
      "@type": "Organization",
      name: "Kozker Tech",
    },
    description:
      "Leverage artificial intelligence to create stunning, functional websites that adapt to your users' needs and preferences.",
    serviceType: "Web Design",
    offers: {
      "@type": "Offer",
      price: "Custom",
      priceCurrency: "USD",
    },
  }

  return (
    <>
      <SchemaMarkup schema={schema} />
      <div className="container px-4 md:px-6 py-8 max-w-5xl mx-auto">
        <Breadcrumbs homeLabel="Home" className="mb-6" />

        <div className="grid md:grid-cols-2 gap-12 items-center py-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">AI-Powered Web Design</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Harness the power of artificial intelligence to create websites that are not only visually stunning but
              also highly functional and user-focused.
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link href="/contact">Get Started</Link>
            </Button>
          </div>
          <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">
            <img
              src="/Website-Creator-bro.svg"
              alt="AI-Powered Web Design Illustration"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="my-16">
          <h2 className="text-3xl font-bold mb-8 text-center">How AI Enhances Your Web Design</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-xl border border-border/50">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-lightbulb"
                >
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Intelligent Design Suggestions</h3>
              <p className="text-muted-foreground">
                Our AI analyzes thousands of successful websites in your industry to suggest design elements, layouts,
                and color schemes that resonate with your target audience.
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border/50">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-file-text"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" x2="8" y1="13" y2="13" />
                  <line x1="16" x2="8" y1="17" y2="17" />
                  <line x1="10" x2="8" y1="9" y2="9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Generated Content</h3>
              <p className="text-muted-foreground">
                Create compelling copy, product descriptions, and blog posts with our AI content generator that
                understands your brand voice and messaging goals.
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border/50">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-user-check"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <polyline points="16 11 18 13 22 9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">UX Optimization</h3>
              <p className="text-muted-foreground">
                Our AI continuously analyzes user behavior to optimize navigation paths, call-to-action placement, and
                overall user experience for maximum engagement and conversion.
              </p>
            </div>
          </div>
        </div>

        <div className="my-16 bg-primary/5 p-8 md:p-10 rounded-2xl">
          <h2 className="text-3xl font-bold mb-6">Key Benefits</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="my-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our AI Web Design Process</h2>
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="bg-primary/10 text-primary text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div className="flex-1 md:border-l-2 md:border-primary/20 md:pl-6">
                <h3 className="text-xl font-semibold mb-2">Discovery & Analysis</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your business goals, target audience, and industry benchmarks to establish a
                  foundation for your web design project.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="bg-primary/10 text-primary text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div className="flex-1 md:border-l-2 md:border-primary/20 md:pl-6">
                <h3 className="text-xl font-semibold mb-2">AI-Generated Design Concepts</h3>
                <p className="text-muted-foreground">
                  Based on the analysis, our AI generates multiple design concepts that align with your brand identity
                  and business objectives.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="bg-primary/10 text-primary text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div className="flex-1 md:border-l-2 md:border-primary/20 md:pl-6">
                <h3 className="text-xl font-semibold mb-2">Collaborative Refinement</h3>
                <p className="text-muted-foreground">
                  Work with our team to refine the AI-generated concepts, incorporating your feedback and preferences to
                  create the perfect design.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="bg-primary/10 text-primary text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div className="flex-1 md:border-l-2 md:border-primary/20 md:pl-6">
                <h3 className="text-xl font-semibold mb-2">Development & Implementation</h3>
                <p className="text-muted-foreground">
                  Our developers bring the design to life, implementing AI-assisted coding for faster development and
                  fewer bugs.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="bg-primary/10 text-primary text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                5
              </div>
              <div className="flex-1 md:border-l-2 md:border-primary/20 md:pl-6">
                <h3 className="text-xl font-semibold mb-2">Continuous Optimization</h3>
                <p className="text-muted-foreground">
                  After launch, our AI continues to analyze user behavior and suggest improvements to enhance
                  performance and user experience.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="my-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Web Presence?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let our AI-powered web design service create a stunning, high-performing website that drives results for
            your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/contact">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link href="/services">Explore Other Services</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
