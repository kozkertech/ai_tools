import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Play, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Webinars & Events - Learn from Industry Experts | KozkerTech",
  description:
    "Join our expert-led webinars and masterclasses on digital transformation, Power BI, automation, and business growth strategies.",
}

// Mock data for webinars - in a real app, this would come from a CMS or API
const upcomingWebinars = [
  {
    id: 1,
    title: "Power BI for E-commerce: Advanced Analytics Strategies",
    description: "Learn how to build comprehensive analytics dashboards for your e-commerce business using Power BI.",
    date: "2024-02-15",
    time: "2:00 PM IST",
    duration: "60 minutes",
    speaker: "Govind Bhat",
    speakerTitle: "BI Consultant & CEO",
    registrations: 156,
    image: "/webinar-power-bi-ecommerce.png",
    category: "Intelligence",
    level: "Intermediate",
  },
  {
    id: 2,
    title: "WhatsApp Automation for Small Businesses",
    description: "Discover how to automate customer communication and boost sales using WhatsApp Business API.",
    date: "2024-02-20",
    time: "3:00 PM IST",
    duration: "45 minutes",
    speaker: "Joel Joseph",
    speakerTitle: "Product Lead",
    registrations: 89,
    image: "/webinar-whatsapp-automation.png",
    category: "GrowthSuite",
    level: "Beginner",
  },
  {
    id: 3,
    title: "Digital Transformation Masterclass for Startups",
    description:
      "Complete guide to launching your digital presence and scaling your startup with the right technology stack.",
    date: "2024-02-25",
    time: "4:00 PM IST",
    duration: "90 minutes",
    speaker: "Alan Alves Palat",
    speakerTitle: "Multi-Utility Specialist",
    registrations: 234,
    image: "/webinar-digital-transformation.png",
    category: "LaunchPad",
    level: "Beginner",
  },
]

const pastWebinars = [
  {
    id: 4,
    title: "Building High-Converting Landing Pages",
    description: "Learn the secrets of creating landing pages that convert visitors into customers.",
    date: "2024-01-30",
    duration: "50 minutes",
    speaker: "Govind Bhat",
    views: 1250,
    image: "/webinar-landing-pages.png",
    category: "GrowthSuite",
    level: "Intermediate",
  },
  {
    id: 5,
    title: "Data Integration Best Practices",
    description: "Master the art of connecting multiple data sources for comprehensive business intelligence.",
    date: "2024-01-15",
    duration: "75 minutes",
    speaker: "Joel Joseph",
    views: 890,
    image: "/webinar-data-integration.png",
    category: "Intelligence",
    level: "Advanced",
  },
  {
    id: 6,
    title: "Local SEO for Small Businesses",
    description: "Dominate local search results and attract more customers to your physical location.",
    date: "2024-01-10",
    duration: "40 minutes",
    speaker: "Alan Alves Palat",
    views: 567,
    image: "/webinar-local-seo.png",
    category: "LaunchPad",
    level: "Beginner",
  },
]

export default function WebinarsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Learn from Industry <span className="text-primary">Experts</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Join our expert-led webinars and masterclasses on digital transformation, business intelligence,
              automation, and growth strategies. Gain actionable insights to accelerate your business success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="#upcoming">View Upcoming Events</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#archive">Browse Archive</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Webinars */}
      <section id="upcoming" className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Upcoming Webinars</h2>
            <p className="text-xl text-muted-foreground">
              Register now for our upcoming sessions and don't miss out on valuable insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingWebinars.map((webinar) => (
              <Card key={webinar.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image src={webinar.image || "/placeholder.svg"} alt={webinar.title} fill className="object-cover" />
                  <div className="absolute top-4 left-4">
                    <Badge
                      className={
                        webinar.category === "Intelligence"
                          ? "bg-purple-100 text-purple-700"
                          : webinar.category === "GrowthSuite"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                      }
                    >
                      {webinar.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">{webinar.level}</Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="line-clamp-2">{webinar.title}</CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">{webinar.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(webinar.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{webinar.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {webinar.speaker
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{webinar.speaker}</p>
                      <p className="text-xs text-muted-foreground">{webinar.speakerTitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{webinar.registrations} registered</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{webinar.duration}</span>
                  </div>

                  <Button className="w-full">Register Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Past Webinars Archive */}
      <section id="archive" className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Webinar Archive</h2>
            <p className="text-xl text-muted-foreground">
              Access recordings of our past sessions and catch up on valuable insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastWebinars.map((webinar) => (
              <Card key={webinar.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image src={webinar.image || "/placeholder.svg"} alt={webinar.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="h-8 w-8 text-primary ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge
                      className={
                        webinar.category === "Intelligence"
                          ? "bg-purple-100 text-purple-700"
                          : webinar.category === "GrowthSuite"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                      }
                    >
                      {webinar.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">{webinar.level}</Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="line-clamp-2">{webinar.title}</CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">{webinar.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(webinar.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{webinar.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {webinar.speaker
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{webinar.speaker}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Play className="h-4 w-4" />
                      <span>{webinar.views} views</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Watch Recording
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/webinars/archive">
                View All Recordings <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Never Miss an Event</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Subscribe to our newsletter and be the first to know about upcoming webinars and exclusive content
            </p>

            <Card className="p-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button>Subscribe</Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">We respect your privacy. Unsubscribe at any time.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
            <p className="text-xl opacity-90 mb-8">
              Apply the insights from our webinars with our expert consulting services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-primary">
                <Link href="/contact">Schedule Consultation</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                <Link href="/solutions">Explore Solutions</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
