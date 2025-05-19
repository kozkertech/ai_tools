import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import SchemaMarkup from "@/components/schema-markup"

export const metadata: Metadata = {
  title: "Services | Kozker Tech",
  description: "Explore our comprehensive range of digital services designed to help your business grow and succeed.",
}

export default function ServicesPage() {
  const services = [
    {
      title: "AI-Powered Web Design",
      description:
        "Leverage artificial intelligence to create stunning, functional websites that adapt to your users' needs and preferences.",
      image: "/web-development-illustration.png",
      link: "/services/ai-powered-web-design",
    },
    {
      title: "24×7 Support Suite",
      description:
        "Round-the-clock customer support through live chat and email to ensure your users always get the help they need.",
      image: "/customer-support.png",
      link: "/services/support-suite",
    },
    {
      title: "WhatsApp Automation",
      description:
        "Streamline customer communication with automated WhatsApp messaging for notifications, support, and engagement.",
      image: "/whatsapp-business-automation.png",
      link: "/services/whatsapp-automation",
    },
    {
      title: "BI & Analytics Solutions",
      description:
        "Transform your data into actionable insights with comprehensive business intelligence and analytics solutions.",
      image: "/data-analytics-dashboard.png",
      link: "/services/bi-analytics",
    },
    {
      title: "Cloud & Data Integration",
      description:
        "Seamlessly integrate your data across platforms and migrate to cloud solutions for improved efficiency and scalability.",
      image: "/cloud-data-integration.png",
      link: "/services/cloud-data-integration",
    },
  ]

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.title,
        description: service.description,
        provider: {
          "@type": "Organization",
          name: "Kozker Tech",
        },
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://yourblog.com"}${service.link}`,
      },
    })),
  }

  return (
    <>
      <SchemaMarkup schema={schema} />
      <div className="container px-4 md:px-6 py-8 max-w-5xl mx-auto">
        <Breadcrumbs homeLabel="Home" className="mb-6" />

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Our Services</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive digital solutions designed to help your business grow, innovate, and succeed in today's
            competitive landscape.
          </p>
        </div>

        <div className="space-y-16">
          {services.map((service, index) => (
            <div
              key={index}
              className={`grid md:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
            >
              <div className={`${index % 2 === 1 ? "md:order-2" : ""}`}>
                <h2 className="text-3xl font-bold mb-4">{service.title}</h2>
                <p className="text-lg text-muted-foreground mb-6">{service.description}</p>
                <Button asChild className="group">
                  <Link href={service.link}>
                    Learn More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
              <div
                className={`relative h-[250px] md:h-[300px] rounded-xl overflow-hidden ${index % 2 === 1 ? "md:order-1" : ""}`}
              >
                <Image src={service.image || "/placeholder.svg"} alt={service.title} fill className="object-cover" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center bg-primary/5 p-8 md:p-12 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Contact us today to discuss how our services can help your business achieve its goals.
          </p>
          <Button asChild size="lg" className="rounded-full">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
