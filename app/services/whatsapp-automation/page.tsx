import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { CheckCircle2, MessageSquare, Bell, Users, BarChart3, ShoppingCart } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import SchemaMarkup from "@/components/schema-markup"

export const metadata: Metadata = {
  title: "WhatsApp Automation | Kozker Tech",
  description:
    "Streamline customer communication with automated WhatsApp messaging for notifications, support, and engagement.",
}

export default function WhatsAppAutomationPage() {
  const features = [
    {
      icon: MessageSquare,
      title: "Automated Responses",
      description: "Instant replies to common customer queries, providing immediate assistance 24/7.",
    },
    {
      icon: Bell,
      title: "Notifications & Alerts",
      description: "Automated updates on orders, appointments, deliveries, and other important events.",
    },
    {
      icon: Users,
      title: "Customer Engagement",
      description: "Personalized messages based on customer behavior, preferences, and history.",
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Comprehensive data on message performance, customer engagement, and conversion rates.",
    },
    {
      icon: ShoppingCart,
      title: "Transactional Messaging",
      description: "Seamless order processing, payment confirmations, and shipping updates via WhatsApp.",
    },
  ]

  const useCases = [
    {
      title: "Retail & E-commerce",
      description:
        "Send order confirmations, shipping updates, and personalized product recommendations to enhance the shopping experience.",
    },
    {
      title: "Healthcare",
      description:
        "Automate appointment reminders, medication alerts, and follow-up messages to improve patient care and reduce no-shows.",
    },
    {
      title: "Hospitality",
      description:
        "Streamline booking confirmations, check-in instructions, and guest service requests for a seamless guest experience.",
    },
    {
      title: "Financial Services",
      description:
        "Deliver transaction alerts, payment reminders, and account updates securely through WhatsApp's encrypted platform.",
    },
  ]

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "WhatsApp Automation",
    provider: {
      "@type": "Organization",
      name: "Kozker Tech",
    },
    description:
      "Streamline customer communication with automated WhatsApp messaging for notifications, support, and engagement.",
    serviceType: "Business Communication",
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
            <h1 className="text-4xl font-bold tracking-tight mb-4">WhatsApp Automation</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Transform your customer communication with intelligent WhatsApp automation that engages, informs, and
              converts.
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link href="/contact">Get Started</Link>
            </Button>
          </div>
          <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">
            <Image
              src="/whatsapp-business-automation.png"
              alt="WhatsApp Automation"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="my-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
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
          <h2 className="text-3xl font-bold mb-6">Why Choose WhatsApp for Business Communication?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg">Global Reach</h3>
                <p className="text-muted-foreground">
                  Over 2 billion users worldwide, making it the most popular messaging platform.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg">High Engagement</h3>
                <p className="text-muted-foreground">
                  95% open rate and 60% response rate, far exceeding email and SMS.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg">Rich Media Support</h3>
                <p className="text-muted-foreground">
                  Send images, videos, documents, and interactive buttons for enhanced communication.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg">End-to-End Encryption</h3>
                <p className="text-muted-foreground">
                  Secure communication channel for sensitive customer information.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="my-16">
          <h2 className="text-3xl font-bold mb-8 text-center">How Our WhatsApp Automation Works</h2>
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="bg-primary/10 text-primary text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div className="flex-1 md:border-l-2 md:border-primary/20 md:pl-6">
                <h3 className="text-xl font-semibold mb-2">WhatsApp Business API Integration</h3>
                <p className="text-muted-foreground">
                  We set up and configure the WhatsApp Business API for your company, ensuring compliance with
                  WhatsApp's policies and guidelines.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="bg-primary/10 text-primary text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div className="flex-1 md:border-l-2 md:border-primary/20 md:pl-6">
                <h3 className="text-xl font-semibold mb-2">Workflow Design</h3>
                <p className="text-muted-foreground">
                  We design automated messaging workflows based on your business processes, customer journey, and
                  communication goals.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="bg-primary/10 text-primary text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div className="flex-1 md:border-l-2 md:border-primary/20 md:pl-6">
                <h3 className="text-xl font-semibold mb-2">System Integration</h3>
                <p className="text-muted-foreground">
                  We integrate WhatsApp automation with your existing systems (CRM, e-commerce platform, booking system,
                  etc.) for seamless data flow.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="bg-primary/10 text-primary text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div className="flex-1 md:border-l-2 md:border-primary/20 md:pl-6">
                <h3 className="text-xl font-semibold mb-2">Testing & Optimization</h3>
                <p className="text-muted-foreground">
                  We thoroughly test all automated messages and workflows, optimizing them for maximum engagement and
                  effectiveness.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="bg-primary/10 text-primary text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                5
              </div>
              <div className="flex-1 md:border-l-2 md:border-primary/20 md:pl-6">
                <h3 className="text-xl font-semibold mb-2">Launch & Monitoring</h3>
                <p className="text-muted-foreground">
                  We launch your WhatsApp automation solution and provide ongoing monitoring, analytics, and
                  optimization to ensure optimal performance.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="my-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Industry Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-card p-6 rounded-xl border border-border/50">
                <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                <p className="text-muted-foreground">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="my-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Customer Communication?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Harness the power of WhatsApp automation to engage customers, streamline communication, and drive business
            growth.
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
