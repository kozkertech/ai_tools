import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, Zap, Clock, HeadphonesIcon, MessageSquare } from "lucide-react"

export default function Home() {
  // Add structured data for the homepage
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KozkerTech",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://yourblog.com",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://yourblog.com"}/logo.png`,
    sameAs: [
      "https://facebook.com/kozkertech",
      "https://twitter.com/kozkertech",
      "https://instagram.com/kozkertech",
      "https://linkedin.com/company/kozkertech",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-7306261147",
      contactType: "customer service",
      availableLanguage: ["English", "Malayalam"],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kochi",
      addressRegion: "Kerala",
      addressCountry: "IN",
    },
    description:
      "Transform your business with KozkerTech's expert digital solutions in Kochi. Get high-converting websites, 24/7 customer support, WhatsApp automation, and Power BI analytics. Local expertise, global standards.",
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Hero Section */}
      <section className="py-20 md:py-28 hero-pattern">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="px-3 py-1 text-sm bg-orange-100 text-primary border-primary">
                Kochi's Digital Growth Partner
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                High-Conversion Websites + 24/7 Support
              </h1>
              <p className="text-xl text-gray-600">
                Get online fast. Sell more. Delight every customer with AI-Accelerated Builds, Integrated Live Chat &
                Email Support, and Automated WhatsApp Workflows.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-md">
                  <Link href="/contact">Get Started Today</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-md">
                  <Link href="/solutions">Explore Solutions</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
              <Image
                src="/geometric-hero-image.png"
                alt="Abstract geometric pattern representing digital solutions"
                width={600}
                height={600}
                className="rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Who We Are</h2>
            <p className="text-xl text-gray-600">
              We help Kochi's small businesses grow online fast and affordably, empowering local entrepreneurs to expand
              their digital presence and reach more customers effectively.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
              <Image
                src="/website-design-team.png"
                alt="KozkerTech Team"
                width={500}
                height={500}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Launch Fast</h3>
                    <p className="text-gray-600">
                      Launch polished, mobile-first sites in days, not weeks, ensuring your business looks great on any
                      device while saving you valuable time.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Never Miss a Lead</h3>
                    <p className="text-gray-600">
                      Professional customer-service and WhatsApp automation help you never miss a lead, streamlining
                      communication and improving engagement with your customers 24/7.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Data-Driven Decisions</h3>
                    <p className="text-gray-600">
                      Make informed business decisions with our Power BI solutions that transform your data into
                      actionable insights.
                    </p>
                  </div>
                </div>
              </div>
              <Button asChild className="mt-6">
                <Link href="/about">
                  Learn More About Us <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Services</h2>
            <p className="text-xl text-gray-600">Comprehensive digital solutions to help your business thrive online</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 hover:border-primary transition-all">
              <CardHeader>
                <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI-Powered Web Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Custom layouts generated automatically using your brand assets, optimized for SEO, speed, and mobile
                  devices.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" asChild className="text-primary p-0 hover:text-primary/80">
                  <Link href="/solutions#web-design">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="border-2 hover:border-primary transition-all">
              <CardHeader>
                <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4">
                  <HeadphonesIcon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Customer Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Live chat and email routing with FAQs and SLA-driven response times to keep your customers happy.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" asChild className="text-primary p-0 hover:text-primary/80">
                  <Link href="/solutions#customer-support">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="border-2 hover:border-primary transition-all">
              <CardHeader>
                <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>WhatsApp Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Automated lead capture, order updates, appointment reminders, and feedback requests via WhatsApp.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" asChild className="text-primary p-0 hover:text-primary/80">
                  <Link href="/solutions#whatsapp">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="border-2 hover:border-primary transition-all">
              <CardHeader>
                <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Power BI Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Data visualization, interactive dashboards, and custom reporting to help you make data-driven
                  decisions.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" asChild className="text-primary p-0 hover:text-primary/80">
                  <Link href="/solutions#power-bi">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Us</h2>
            <p className="text-xl text-gray-600">We deliver results that matter for your business</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:shadow-md transition-all">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Speed</h3>
              <p className="text-gray-600">Launch your website in days, not weeks.</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:shadow-md transition-all">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Savings</h3>
              <p className="text-gray-600">AI cuts development hours by 50%, saving money.</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:shadow-md transition-all">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <HeadphonesIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Support</h3>
              <p className="text-gray-600">24×7 live chat and SLA-backed email ensure help anytime.</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:shadow-md transition-all">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Growth</h3>
              <p className="text-gray-600">Automate follow-ups to boost your sales conversions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Grow?</h2>
              <p className="text-xl">
                Let's build your online presence—together. Partner with us to create a powerful, mobile-friendly website
                that drives results and accelerates your business growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" variant="secondary" className="text-primary">
                  <Link href="/contact">Get Started Today</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                  <Link href="/solutions">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4">Get Started Today</h3>
                <ol className="space-y-4">
                  <li className="flex items-center gap-4">
                    <div className="bg-white text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      1
                    </div>
                    <span>Fill out our quick intake form</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="bg-white text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      2
                    </div>
                    <span>Choose your ideal package</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="bg-white text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      3
                    </div>
                    <span>Launch in days and watch your sales grow</span>
                  </li>
                </ol>
                <div className="mt-6 p-4 bg-white/20 rounded-lg">
                  <p className="font-bold">Special Local Offer:</p>
                  <p>10% off for the first 5 customers to sign up.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
