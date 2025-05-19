import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, MessageSquare, Mail, Users, BarChart } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import SchemaMarkup from "@/components/schema-markup"

export const metadata: Metadata = {
  title: "24×7 Support Suite | Kozker Tech",
  description:
    "Round-the-clock customer support through live chat and email to ensure your users always get the help they need.",
}

export default function SupportSuitePage() {
  const features = [
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Support available around the clock, ensuring your customers get help whenever they need it.",
    },
    {
      icon: MessageSquare,
      title: "Live Chat Support",
      description: "Real-time assistance through an intuitive chat interface for immediate problem resolution.",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Comprehensive email support with guaranteed response times for detailed inquiries.",
    },
    {
      icon: Users,
      title: "Multilingual Agents",
      description: "Support in multiple languages to serve your global customer base effectively.",
    },
    {
      icon: BarChart,
      title: "Performance Analytics",
      description: "Detailed reports on support performance, customer satisfaction, and common issues.",
    },
  ]

  const benefits = [
    "Increased customer satisfaction and loyalty",
    "Reduced customer churn and improved retention",
    "Faster resolution of customer issues",
    "Valuable insights from customer interactions",
    "Scalable support that grows with your business",
    "Reduced operational costs compared to in-house support",
  ]

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "24×7 Support Suite",
    provider: {
      "@type": "Organization",
      name: "Kozker Tech",
    },
    description:
      "Round-the-clock customer support through live chat and email to ensure your users always get the help they need.",
    serviceType: "Customer Support",
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
            <h1 className="text-4xl font-bold tracking-tight mb-4">24×7 Support Suite</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Provide exceptional customer support around the clock with our comprehensive live chat and email support
              solution.
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link href="/contact">Get Started</Link>
            </Button>
          </div>
          <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">
            <Image src="/customer-support.png" alt="24×7 Support Suite" fill className="object-cover" priority />
          </div>
        </div>

        <div className="my-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Comprehensive Support Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-card p-6 rounded-xl border border-border/50">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
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
          <h2 className="text-3xl font-bold mb-8 text-center">How Our Support Suite Works</h2>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 -translate-x-1/2 hidden md:block"></div>
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2 md:text-right md:pr-8">
                  <div className="bg-primary/10 text-primary text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center mb-4 md:ml-auto">
                    1
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Integration</h3>
                  <p className="text-muted-foreground">
                    We seamlessly integrate our support tools with your website, app, or platform, ensuring a consistent
                    brand experience.
                  </p>
                </div>
                <div className="md:w-1/2 hidden md:block"></div>
              </div>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2 hidden md:block"></div>
                <div className="md:w-1/2 md:pl-8">
                  <div className="bg-primary/10 text-primary text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Customization</h3>
                  <p className="text-muted-foreground">
                    We customize the support interface and workflows to match your specific requirements and customer
                    journey.
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2 md:text-right md:pr-8">
                  <div className="bg-primary/10 text-primary text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center mb-4 md:ml-auto">
                    3
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Agent Training</h3>
                  <p className="text-muted-foreground">
                    Our support agents undergo rigorous training on your products, services, and company policies to
                    provide accurate assistance.
                  </p>
                </div>
                <div className="md:w-1/2 hidden md:block"></div>
              </div>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2 hidden md:block"></div>
                <div className="md:w-1/2 md:pl-8">
                  <div className="bg-primary/10 text-primary text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    4
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Launch & Monitor</h3>
                  <p className="text-muted-foreground">
                    We launch the support channels and continuously monitor performance, making adjustments as needed to
                    optimize the customer experience.
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2 md:text-right md:pr-8">
                  <div className="bg-primary/10 text-primary text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center mb-4 md:ml-auto">
                    5
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Reporting & Optimization</h3>
                  <p className="text-muted-foreground">
                    We provide regular reports on support metrics and customer feedback, using these insights to
                    continuously improve the support experience.
                  </p>
                </div>
                <div className="md:w-1/2 hidden md:block"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="my-16 grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-card p-8 rounded-xl border border-border/50">
            <h3 className="text-2xl font-bold mb-4">Live Chat Support</h3>
            <p className="text-muted-foreground mb-4">
              Our live chat support provides immediate assistance to your customers, with features including:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Real-time conversation with support agents</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>File sharing capabilities for troubleshooting</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Chat history for reference and continuity</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Proactive chat initiation based on user behavior</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Chatbot integration for common queries</span>
              </li>
            </ul>
          </div>
          <div className="bg-card p-8 rounded-xl border border-border/50">
            <h3 className="text-2xl font-bold mb-4">Email Support</h3>
            <p className="text-muted-foreground mb-4">
              Our email support system ensures thorough assistance for more complex issues, featuring:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Guaranteed response times (typically within 4 hours)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Detailed, step-by-step solutions</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Ticket tracking system for issue management</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Automated follow-ups to ensure resolution</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Satisfaction surveys for quality assurance</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="my-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Elevate Your Customer Support Experience</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Provide exceptional 24/7 support that builds customer loyalty and sets your business apart from the
            competition.
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
