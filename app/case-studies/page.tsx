import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TrendingUp, Clock, Target } from "lucide-react"

export const metadata: Metadata = {
  title: "Case Studies - Real Results from Real Clients | KozkerTech",
  description:
    "Discover how businesses have transformed their operations and achieved remarkable growth with KozkerTech's digital solutions.",
}

// Mock data for case studies - in a real app, this would come from a CMS or API
const caseStudies = [
  {
    id: 1,
    title: "Local Restaurant Chain Increases Online Orders by 300%",
    client: "Spice Garden Restaurants",
    industry: "Food & Beverage",
    solution: "LaunchPad",
    challenge: "Limited online presence and no digital ordering system during COVID-19 pandemic",
    results: [
      "300% increase in online orders",
      "50% reduction in phone order errors",
      "25% increase in average order value",
      "Expanded to 3 new locations",
    ],
    timeline: "6 weeks",
    image: "/case-study-restaurant.png",
    testimonial:
      "KozkerTech's LaunchPad solution saved our business during the pandemic. The WhatsApp ordering system was a game-changer.",
    clientName: "Rajesh Kumar",
    clientTitle: "Owner, Spice Garden Restaurants",
  },
  {
    id: 2,
    title: "E-commerce Store Boosts Conversion Rate by 45%",
    client: "TechGadgets Pro",
    industry: "E-commerce",
    solution: "GrowthSuite",
    challenge: "Low conversion rates and poor customer engagement on their existing website",
    results: [
      "45% increase in conversion rate",
      "60% reduction in cart abandonment",
      "40% increase in customer lifetime value",
      "2x improvement in customer support efficiency",
    ],
    timeline: "8 weeks",
    image: "/case-study-ecommerce.png",
    testimonial:
      "The AI chatbot and WhatsApp automation transformed our customer experience. Sales have never been better.",
    clientName: "Priya Sharma",
    clientTitle: "Founder, TechGadgets Pro",
  },
  {
    id: 3,
    title: "Manufacturing Company Achieves 40% ROI Increase",
    client: "Precision Engineering Ltd",
    industry: "Manufacturing",
    solution: "Intelligence",
    challenge: "Lack of data visibility across operations and inability to make data-driven decisions",
    results: [
      "40% increase in ROI",
      "30% reduction in production waste",
      "50% faster decision-making process",
      "Real-time visibility across all operations",
    ],
    timeline: "12 weeks",
    image: "/case-study-manufacturing.png",
    testimonial:
      "The Power BI dashboards gave us insights we never had before. We can now optimize our operations in real-time.",
    clientName: "Amit Patel",
    clientTitle: "Operations Director, Precision Engineering Ltd",
  },
  {
    id: 4,
    title: "Healthcare Clinic Reduces No-Shows by 70%",
    client: "City Health Clinic",
    industry: "Healthcare",
    solution: "LaunchPad",
    challenge: "High patient no-show rates and inefficient appointment scheduling system",
    results: [
      "70% reduction in no-shows",
      "80% of appointments now booked online",
      "50% reduction in administrative workload",
      "95% patient satisfaction score",
    ],
    timeline: "4 weeks",
    image: "/case-study-healthcare.png",
    testimonial: "The automated appointment system and WhatsApp reminders have transformed our practice efficiency.",
    clientName: "Dr. Sarah Johnson",
    clientTitle: "Director, City Health Clinic",
  },
  {
    id: 5,
    title: "Digital Agency Scales Operations by 200%",
    client: "Creative Solutions Agency",
    industry: "Digital Marketing",
    solution: "GrowthSuite",
    challenge: "Manual client communication and project management processes limiting growth",
    results: [
      "200% increase in client capacity",
      "75% reduction in manual tasks",
      "90% improvement in client satisfaction",
      "3x faster project delivery",
    ],
    timeline: "10 weeks",
    image: "/case-study-agency.png",
    testimonial:
      "The automation suite allowed us to scale without hiring additional staff. Our clients love the improved communication.",
    clientName: "Michael Chen",
    clientTitle: "CEO, Creative Solutions Agency",
  },
  {
    id: 6,
    title: "Retail Chain Optimizes Inventory with Data Analytics",
    client: "Fashion Forward Stores",
    industry: "Retail",
    solution: "Intelligence",
    challenge: "Poor inventory management leading to stockouts and overstock situations",
    results: [
      "35% reduction in inventory costs",
      "90% improvement in stock availability",
      "25% increase in profit margins",
      "Real-time inventory tracking across 15 stores",
    ],
    timeline: "14 weeks",
    image: "/case-study-retail.png",
    testimonial:
      "The analytics dashboard helps us make smarter inventory decisions. We've eliminated most stockouts and reduced waste significantly.",
    clientName: "Lisa Rodriguez",
    clientTitle: "Operations Manager, Fashion Forward Stores",
  },
]

export default function CaseStudiesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Real Results from <span className="text-primary">Real Clients</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Discover how businesses across industries have transformed their operations and achieved remarkable growth
              with KozkerTech's digital solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="#case-studies">Explore Success Stories</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Start Your Transformation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Overview */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">200+</div>
              <p className="text-muted-foreground">Successful Projects</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">40%</div>
              <p className="text-muted-foreground">Average ROI Increase</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">95%</div>
              <p className="text-muted-foreground">Client Satisfaction</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">6+</div>
              <p className="text-muted-foreground">Years of Excellence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section id="case-studies" className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Success Stories</h2>
            <p className="text-xl text-muted-foreground">
              See how our solutions have delivered measurable results across different industries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudies.map((study) => (
              <Card key={study.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image src={study.image || "/placeholder.svg"} alt={study.title} fill className="object-cover" />
                  <div className="absolute top-4 left-4">
                    <Badge
                      className={
                        study.solution === "Intelligence"
                          ? "bg-purple-100 text-purple-700"
                          : study.solution === "GrowthSuite"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                      }
                    >
                      {study.solution}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">{study.industry}</Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="line-clamp-2">{study.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    <strong>{study.client}</strong> • {study.industry}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Challenge</h4>
                    <p className="text-sm text-muted-foreground">{study.challenge}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Key Results</h4>
                    <ul className="space-y-1">
                      {study.results.slice(0, 3).map((result, index) => (
                        <li key={index} className="text-sm flex items-center gap-2">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <span>{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{study.timeline}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      <span>{study.solution}</span>
                    </div>
                  </div>

                  <blockquote className="border-l-4 border-primary pl-4 italic text-sm">
                    "{study.testimonial}"
                    <footer className="mt-2 text-xs text-muted-foreground">
                      — {study.clientName}, {study.clientTitle}
                    </footer>
                  </blockquote>

                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/case-studies/${study.id}`}>
                      Read Full Case Study <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Filter Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Industries We Serve</h2>
            <p className="text-xl text-muted-foreground">Specialized expertise across key industry verticals</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {["Healthcare", "E-commerce", "Manufacturing", "Food & Beverage", "Digital Marketing", "Retail"].map(
              (industry) => (
                <Button key={industry} variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <span className="font-medium">{industry}</span>
                </Button>
              ),
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Write Your Success Story?</h2>
            <p className="text-xl opacity-90 mb-8">
              Join hundreds of businesses who have transformed their operations with our proven solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-primary">
                <Link href="/contact">Start Your Transformation</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                <Link href="/solutions">Explore Our Solutions</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
