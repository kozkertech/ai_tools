import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Rocket, Globe, Calendar, MessageSquare, MapPin, Star } from "lucide-react"

export const metadata: Metadata = {
  title: "LaunchPad - Digital Solutions for Startups & Local SMBs | KozkerTech",
  description:
    "Get online fast with our LaunchPad solutions. Perfect for startups and local SMBs. Includes free 1-page website, local SEO, and basic automation.",
}

export default function LaunchPadPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="px-4 py-2 text-sm bg-green-100 text-green-700 border-green-200">
                <Rocket className="h-4 w-4 mr-2" />
                LaunchPad Solutions
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Launch Your Digital Presence <span className="text-green-600">Fast & Affordable</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Perfect for startups and local SMBs ready to establish their online presence. Get a professional
                website, local visibility, and basic automation to start growing your business.
              </p>

              <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-green-700 dark:text-green-300 font-semibold flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  FREE 1-Page Website Included with Every Package!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                  <Link href="/contact?solution=launchpad">Get Started Free</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/launchpad-hero.png"
                alt="LaunchPad digital solutions for startups"
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Perfect For</h2>
            <p className="text-xl text-muted-foreground">
              LaunchPad is designed for businesses just starting their digital journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Startups</h3>
              <p className="text-muted-foreground">
                New businesses looking to establish their online presence quickly and affordably
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Local Businesses</h3>
              <p className="text-muted-foreground">
                Restaurants, salons, clinics, and shops wanting to attract local customers
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Service Providers</h3>
              <p className="text-muted-foreground">
                Consultants, tutors, and professionals needing appointment booking and basic automation
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What's Included</h2>
            <p className="text-xl text-muted-foreground">Everything you need to launch your digital presence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* AI Web Design */}
            <Card className="p-6">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Globe className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>AI Web Design</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      FREE 1-Page Website
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Professional, mobile-first website designed to convert visitors into customers
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Responsive design for all devices</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">WhatsApp integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Contact forms and CTAs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Fast loading and SEO optimized</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Local SEO & GMB */}
            <Card className="p-6">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Local SEO & GMB Optimization</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">Dominate local search results and "near me" queries</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Google My Business setup & optimization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Local keyword optimization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">NAP consistency across directories</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Review management setup</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Appointment Booking */}
            <Card className="p-6">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Automated Appointment Booking</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">Streamline scheduling with automated booking and reminders</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Online booking calendar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Automated confirmation emails</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">SMS/WhatsApp reminders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">No-show reduction features</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Basic Automation */}
            <Card className="p-6">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>Basic WhatsApp Automation</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">Simple automation to handle common customer inquiries</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Auto-responder setup</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">FAQ responses</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Business hours messaging</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Lead capture forms</span>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose LaunchPad?</h2>
            <p className="text-xl text-muted-foreground">Get online fast without breaking the bank</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Launch in Days</h3>
              <p className="text-muted-foreground">Get your website live in 3-5 business days, not weeks</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Free Website</h3>
              <p className="text-muted-foreground">Professional 1-page website included at no extra cost</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Local Focus</h3>
              <p className="text-muted-foreground">Optimized for local search and "near me" queries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Everything you need to get started, with no hidden fees
            </p>

            <Card className="p-8 border-2 border-green-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold">LaunchPad Starter</h3>
                <div className="text-4xl font-bold text-green-600 mt-2">₹4,999</div>
                <p className="text-muted-foreground">One-time setup + ₹499/month</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>FREE 1-page website</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Local SEO optimization</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Basic WhatsApp automation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Appointment booking system</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Email support</span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="flex-1 bg-green-600 hover:bg-green-700">
                  <Link href="/contact?solution=launchpad">Get Started Free</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="flex-1">
                  <Link href="/pricing">View All Plans</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Launch Your Digital Presence?</h2>
            <p className="text-xl opacity-90 mb-8">
              Join hundreds of local businesses who have successfully launched with LaunchPad
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-green-600">
                <Link href="/contact?solution=launchpad">Start Your Free Consultation</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                <Link href="/case-studies?filter=launchpad">See Success Stories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
