import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  ArrowRight,
  Zap,
  HeadphonesIcon,
  BarChart,
  Calendar,
  MapPin,
  Bot,
  Smartphone,
  Layout,
} from "lucide-react"
import { generateLocalBusinessSchema, generateWebsiteSchema, generateOrganizationSchema } from "@/lib/schema"
import { getFeaturedPosts } from "@/lib/ghost"
import { PostCard } from "@/components/post-card"

export default async function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kozker.com"

  // Fetch featured posts with better error handling
  let featuredPosts = []
  try {
    // Check if Ghost API credentials are available
    if (process.env.GHOST_URL && process.env.GHOST_CONTENT_API_KEY) {
      featuredPosts = await getFeaturedPosts()

      // If no featured posts are found, we'll leave the array empty
      // This will prevent the featured posts section from rendering
    }
  } catch (error) {
    console.error("Error fetching featured posts:", error)
    // We'll continue with an empty array, which will prevent the section from rendering
  }

  // Generate structured data
  const localBusinessSchema = generateLocalBusinessSchema(baseUrl)
  const websiteSchema = generateWebsiteSchema(baseUrl)
  const organizationSchema = generateOrganizationSchema(baseUrl)

  // Add additional schema for services
  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "Service",
        position: 1,
        name: "24/7 Live Chat Support",
        description:
          "Round-the-clock customer support through live chat to ensure your users always get the help they need.",
        provider: {
          "@type": "Organization",
          name: "KozkerTech",
        },
        url: `${baseUrl}/services/support-suite`,
      },
      {
        "@type": "Service",
        position: 2,
        name: "WhatsApp Automation",
        description:
          "Streamline customer communication with automated WhatsApp messaging for notifications, support, and engagement.",
        provider: {
          "@type": "Organization",
          name: "KozkerTech",
        },
        url: `${baseUrl}/services/whatsapp-automation`,
      },
      {
        "@type": "Service",
        position: 3,
        name: "Mobile-First Web Design",
        description:
          "Responsive, high-conversion websites designed for mobile users first, ensuring great experience across all devices.",
        provider: {
          "@type": "Organization",
          name: "KozkerTech",
        },
        url: `${baseUrl}/services/ai-powered-web-design`,
      },
    ],
  }

  return (
    <>
      {/* LocalBusiness Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />

      {/* Website Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />

      {/* Organization Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />

      {/* Services Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }} />

      {/* Hero Section */}
      <section className="py-20 md:py-28 hero-pattern">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="px-3 py-1 text-sm bg-orange-100 text-primary border-primary dark:bg-gray-800 dark:border-primary/50">
                Elevating Digital Experiences Since 2018
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight dark:text-white">
                High-Conversion Websites + 24/7 Support
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Launch a polished, mobile-first website in days—capture every opportunity with 24/7 live-chat and smart
                email routing, then accelerate sales through automated WhatsApp workflows.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-md">
                  <Link href="/contact">Get Started Today</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-md dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
                >
                  <Link href="/solutions">Explore Solutions</Link>
                </Button>
              </div>
              <div className="bg-orange-100 dark:bg-gray-800 p-3 rounded-lg mt-4">
                <p className="text-sm font-medium text-primary flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  All packages include a FREE 1-page website!
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
              <Image
                src="/chatbot-bro.svg"
                alt="Chat bot illustration representing 24/7 support and WhatsApp automation solutions"
                width={600}
                height={600}
                className="rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">150+</div>
              <p className="text-gray-600 dark:text-gray-300">Happy Clients</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">98%</div>
              <p className="text-gray-600 dark:text-gray-300">Client Retention</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">24/7</div>
              <p className="text-gray-600 dark:text-gray-300">Customer Support</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">5+</div>
              <p className="text-gray-600 dark:text-gray-300">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">Who We Are</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              We help Kochi's small businesses grow online fast and affordably, empowering local entrepreneurs to expand
              their digital presence and reach more customers effectively.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
              <Image
                src="/team-collaboration-analytics.webp"
                alt="Kozker Tech team collaborating on data-driven web solutions for small businesses in Kochi"
                width={600}
                height={480}
                className="rounded-lg shadow-lg w-full h-auto object-contain"
                priority
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold dark:text-white">Launch Fast</h3>
                    <p className="text-gray-600 dark:text-gray-300">
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
                    <h3 className="text-xl font-bold dark:text-white">Never Miss a Lead</h3>
                    <p className="text-gray-600 dark:text-gray-300">
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
                    <h3 className="text-xl font-bold dark:text-white">Data-Driven Decisions</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Make informed business decisions with our Power BI solutions that transform your data into
                      actionable insights.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold dark:text-white">Free Website with Every Package</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Every service package includes a free 1-page website to kickstart your online presence, designed
                      to convert visitors into customers from day one.
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
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">Our Services</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Comprehensive digital solutions to help your business thrive online
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary transition-all dark:bg-gray-900 dark:border-gray-800">
              <CardHeader>
                <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4 dark:bg-gray-800">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="dark:text-white">WhatsApp CRM & Sales Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Automate your sales process and customer follow-ups through WhatsApp, perfect for retailers and
                  service-based businesses.
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p className="font-medium mb-1">Ideal for:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Indian retailers (grocery, garments, electronics)</li>
                    <li>MSME/SMB companies using WhatsApp for business</li>
                    <li>Subscription-based services (education, fitness)</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  asChild
                  className="text-primary p-0 hover:text-primary/80 dark:hover:bg-gray-800"
                >
                  <Link href="/solutions#whatsapp-crm">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-2 hover:border-primary transition-all dark:bg-gray-900 dark:border-gray-800">
              <CardHeader>
                <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4 dark:bg-gray-800">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="dark:text-white">Local SEO & GMB Booster</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Dominate local search results and "near me" queries with our Google My Business optimization and local
                  SEO strategies.
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p className="font-medium mb-1">Ideal for:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Restaurants & cafés seeking "near me" visibility</li>
                    <li>Brick-and-mortar shops (salons, clinics, retail)</li>
                    <li>Local service providers needing foot traffic</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  asChild
                  className="text-primary p-0 hover:text-primary/80 dark:hover:bg-gray-800"
                >
                  <Link href="/solutions#local-seo">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-2 hover:border-primary transition-all dark:bg-gray-900 dark:border-gray-800">
              <CardHeader>
                <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4 dark:bg-gray-800">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="dark:text-white">AI Chatbot for Web & WhatsApp</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Intelligent chatbots that handle customer inquiries, product recommendations, and support requests
                  24/7.
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p className="font-medium mb-1">Ideal for:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>E-commerce stores (product recommendations)</li>
                    <li>Healthcare providers (appointment triage)</li>
                    <li>Educational institutes (admissions info)</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  asChild
                  className="text-primary p-0 hover:text-primary/80 dark:hover:bg-gray-800"
                >
                  <Link href="/solutions#ai-chatbot">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-2 hover:border-primary transition-all dark:bg-gray-900 dark:border-gray-800">
              <CardHeader>
                <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4 dark:bg-gray-800">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="dark:text-white">Automated Appointment Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Streamline scheduling with automated booking systems, reminders, and follow-ups to reduce no-shows.
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p className="font-medium mb-1">Ideal for:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Medical clinics & dental offices</li>
                    <li>Beauty & wellness salons</li>
                    <li>Professional consultants (lawyers, tutors)</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  asChild
                  className="text-primary p-0 hover:text-primary/80 dark:hover:bg-gray-800"
                >
                  <Link href="/solutions#appointment-booking">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-2 hover:border-primary transition-all dark:bg-gray-900 dark:border-gray-800">
              <CardHeader>
                <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4 dark:bg-gray-800">
                  <Layout className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="dark:text-white">Micro-Landing Page Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  High-converting landing pages designed specifically for campaigns, product launches, and lead
                  generation.
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p className="font-medium mb-1">Ideal for:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Digital marketers running PPC campaigns</li>
                    <li>Startups launching product microsites</li>
                    <li>Businesses with seasonal promotions</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  asChild
                  className="text-primary p-0 hover:text-primary/80 dark:hover:bg-gray-800"
                >
                  <Link href="/solutions#micro-landing">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-2 hover:border-primary transition-all dark:bg-gray-900 dark:border-gray-800">
              <CardHeader>
                <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4 dark:bg-gray-800">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="dark:text-white">Power BI Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Data visualization, interactive dashboards, and custom reporting to help you make data-driven
                  decisions.
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p className="font-medium mb-1">Ideal for:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Businesses needing performance analytics</li>
                    <li>Companies with complex data needs</li>
                    <li>Organizations seeking growth insights</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  asChild
                  className="text-primary p-0 hover:text-primary/80 dark:hover:bg-gray-800"
                >
                  <Link href="/solutions#power-bi">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-orange-100 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-lg font-bold text-primary mb-2">FREE Website with Every Package!</p>
              <p className="text-gray-600 dark:text-gray-300">
                All our service packages include a professionally designed 1-page website at no extra cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">Why Choose Us</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">We deliver results that matter for your business</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg bg-white hover:shadow-md transition-all dark:bg-gray-800">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 dark:bg-gray-700">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Speed</h3>
              <p className="text-gray-600 dark:text-gray-300">Launch your website in days, not weeks.</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-white hover:shadow-md transition-all dark:bg-gray-800">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 dark:bg-gray-700">
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
              <h3 className="text-xl font-bold mb-2 dark:text-white">Savings</h3>
              <p className="text-gray-600 dark:text-gray-300">AI cuts development hours by 50%, saving money.</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-white hover:shadow-md transition-all dark:bg-gray-800">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 dark:bg-gray-700">
                <HeadphonesIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Support</h3>
              <p className="text-gray-600 dark:text-gray-300">
                24×7 live chat and SLA-backed email ensure help anytime.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-white hover:shadow-md transition-all dark:bg-gray-800">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 dark:bg-gray-700">
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
              <h3 className="text-xl font-bold mb-2 dark:text-white">Growth</h3>
              <p className="text-gray-600 dark:text-gray-300">Automate follow-ups to boost your sales conversions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blog Posts - Only show if posts are available */}
      {featuredPosts && featuredPosts.length > 0 ? (
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">Latest Insights</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Stay updated with our latest articles and industry insights
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild>
                <Link href="/blog">
                  View All Articles <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Find answers to common questions about our services
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl dark:text-white">How long does it take to build a website?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Our AI-powered web design process allows us to build and launch websites much faster than traditional
                  methods. Most projects can be completed within 1-2 weeks, depending on complexity and content
                  requirements.
                </p>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl dark:text-white">
                  What makes your WhatsApp automation different?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Our WhatsApp automation solutions are fully customized to your business needs. We create personalized
                  workflows for lead capture, order updates, appointment reminders, and customer feedback that integrate
                  seamlessly with your existing systems.
                </p>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl dark:text-white">Do you offer ongoing support after launch?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, we provide comprehensive ongoing support for all our clients. Our support packages include 24/7
                  monitoring, regular updates, security patches, and dedicated customer service to ensure your digital
                  solutions continue to perform optimally.
                </p>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl dark:text-white">Is the free website really free?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes! Every service package includes a professionally designed 1-page website at no additional cost.
                  This free website is fully functional, mobile-responsive, and designed to convert visitors into
                  customers.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-300 mb-4">Still have questions? We're here to help!</p>
            <Button asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
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
              <div className="bg-white/20 p-3 rounded-lg inline-block">
                <p className="font-bold">FREE Website with Every Package!</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" variant="secondary" className="text-primary">
                  <Link href="/contact">Get Started Today</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-white border-white hover:bg-white/10 dark:text-white dark:border-white dark:hover:bg-white/10 text-primary border-primary hover:bg-primary/10"
                >
                  <Link href="/solutions">Explore Solutions</Link>
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
