import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Brain, Rocket } from "lucide-react"
import { getFeaturedPosts } from "@/lib/ghost"

export default async function Home() {
  // Fetch featured posts with error handling
  let featuredPosts = []
  try {
    if (process.env.GHOST_URL && process.env.GHOST_CONTENT_API_KEY) {
      featuredPosts = await getFeaturedPosts()
    }
  } catch (error) {
    console.error("Error fetching featured posts:", error)
  }

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-28 hero-pattern">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                Digital Solutions from Launch to Scale
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Transform Your Business with <span className="text-primary">Smart Technology</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                From rapid website launches to advanced business intelligence, we provide comprehensive digital
                solutions tailored to your business stage and growth ambitions.
              </p>

              {/* Solution Tier Quick Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <Link href="/solutions/launchpad" className="group">
                  <Card className="border-2 hover:border-primary transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Rocket className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">LaunchPad</h3>
                          <p className="text-sm text-muted-foreground">Startups & Local SMBs</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/solutions/growthsuite" className="group">
                  <Card className="border-2 hover:border-primary transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">GrowthSuite</h3>
                          <p className="text-sm text-muted-foreground">Growing SMBs</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/solutions/intelligence" className="group">
                  <Card className="border-2 hover:border-primary transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Brain className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Intelligence</h3>
                          <p className="text-sm text-muted-foreground">Data-Driven Enterprises</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link href="/contact">Get Started Today</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8">
                  <Link href="/solutions">Explore Solutions</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Version%20control-cuate-YRsQMAMnXjBxoCb1anqOAVrGoQz2Mg.svg"
                alt="Version control and software development workflow illustration showing collaborative coding and project management"
                width={600}
                height={600}
                className="rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">100+</div>
              <p className="text-muted-foreground">Projects Completed</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">98%</div>
              <p className="text-muted-foreground">Client Satisfaction</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">50+</div>
              <p className="text-muted-foreground">Expert Team Members</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
