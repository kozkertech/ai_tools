import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Zap, HeadphonesIcon, MessageSquare, BarChart3, LineChart, PieChart } from "lucide-react"

export const metadata = {
  title: "Web Development & Power BI Solutions - KozkerTech",
  description:
    "Explore our comprehensive web development, customer support, WhatsApp automation, and Power BI solutions for businesses in Kochi and beyond.",
  keywords: ["web solutions", "power bi", "whatsapp automation", "customer support", "kochi", "kerala"],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/solutions`,
  },
  openGraph: {
    title: "Web Development & Power BI Solutions - KozkerTech",
    description:
      "Explore our comprehensive web development, customer support, WhatsApp automation, and Power BI solutions for businesses in Kochi and beyond.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/solutions`,
    type: "website",
    images: [
      {
        url: "/solutions-og.jpg",
        width: 1200,
        height: 630,
        alt: "KozkerTech Solutions",
      },
    ],
  },
}

export default function SolutionsPage() {
  // Add structured data for the solutions page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "Service",
        position: 1,
        name: "AI-Powered Web Design",
        description:
          "Custom layouts generated automatically using your brand assets, optimized for SEO, speed, and mobile devices.",
        provider: {
          "@type": "Organization",
          name: "KozkerTech",
        },
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/solutions#web-design`,
      },
      {
        "@type": "Service",
        position: 2,
        name: "Customer Support",
        description:
          "Live chat and email routing with FAQs and SLA-driven response times to keep your customers happy.",
        provider: {
          "@type": "Organization",
          name: "KozkerTech",
        },
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/solutions#customer-support`,
      },
      {
        "@type": "Service",
        position: 3,
        name: "WhatsApp Automation",
        description:
          "Automated lead capture, order updates, appointment reminders, and feedback requests via WhatsApp.",
        provider: {
          "@type": "Organization",
          name: "KozkerTech",
        },
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/solutions#whatsapp`,
      },
      {
        "@type": "Service",
        position: 4,
        name: "Power BI Solutions",
        description:
          "Data visualization, interactive dashboards, and custom reporting to help you make data-driven decisions.",
        provider: {
          "@type": "Organization",
          name: "KozkerTech",
        },
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/solutions#power-bi`,
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Hero Section */}
      <section className="py-20 md:py-28 hero-pattern">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Solutions</h1>
            <p className="text-xl text-gray-600 mb-8">
              Comprehensive digital solutions to help your business thrive online and make data-driven decisions
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild>
                <a href="#web-solutions">Web Solutions</a>
              </Button>
              <Button asChild variant="outline">
                <a href="#power-bi">Power BI Solutions</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Web Solutions Section */}
      <section id="web-solutions" className="py-20 bg-white scroll-mt-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Web Solutions</h2>
            <p className="text-xl text-gray-600">High-Conversion Websites + 24/7 Support + WhatsApp Automation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="border-2 hover:border-primary transition-all" id="web-design">
              <CardHeader>
                <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI-Powered Web Design</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Custom layouts generated automatically using your brand assets, optimized for SEO, speed, and mobile
                  devices.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Mobile-first responsive design</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>SEO optimization built-in</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Fast loading speeds</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Conversion-focused layouts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all" id="customer-support">
              <CardHeader>
                <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4">
                  <HeadphonesIcon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Customer Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Live chat and email routing with FAQs and SLA-driven response times to keep your customers happy.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>24/7 live chat support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Email ticket management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Automated FAQ responses</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>SLA-driven response times</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all" id="whatsapp">
              <CardHeader>
                <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>WhatsApp Automation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Automated lead capture, order updates, appointment reminders, and feedback requests via WhatsApp.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Automated lead capture</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Order status updates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Appointment reminders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Feedback collection</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Section */}
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">Packages & Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-2 hover:border-primary transition-all">
                <CardHeader>
                  <CardTitle>Bronze Package</CardTitle>
                  <CardDescription>Ideal for startups and small businesses</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-3xl font-bold">₹5,299</span>
                    <span className="text-gray-500"> one-time</span>
                    <p className="text-sm text-gray-500">+ ₹1,399/month</p>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>1-page AI-generated website</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Mobile optimization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Basic SEO</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Analytics setup</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/contact">Get Started</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-2 border-primary transition-all relative">
                <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-sm font-medium rounded-bl-lg rounded-tr-lg">
                  Popular
                </div>
                <CardHeader>
                  <CardTitle>Silver Package</CardTitle>
                  <CardDescription>Perfect for growing businesses</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-3xl font-bold">₹8,299</span>
                    <span className="text-gray-500"> one-time</span>
                    <p className="text-sm text-gray-500">+ ₹3,799/month</p>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>5-page website</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Regular content updates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Enhanced SEO</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Enhanced support services</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/contact">Get Started</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-2 hover:border-primary transition-all">
                <CardHeader>
                  <CardTitle>Gold Package</CardTitle>
                  <CardDescription>For established businesses</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-3xl font-bold">₹15,299</span>
                    <span className="text-gray-500"> one-time</span>
                    <p className="text-sm text-gray-500">+ ₹4,699 – 6,199/month</p>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>10-page website + blog</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>WhatsApp automation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Advanced SEO</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/contact">Get Started</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Power BI Solutions Section */}
      <section id="power-bi" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Power BI Solutions</h2>
            <p className="text-xl text-gray-600">
              Transform your data into powerful insights with our Power BI solutions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <Image
                src="/placeholder-rduq3.png"
                alt="Power BI Dashboard"
                width={600}
                height={500}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Data Visualization & Interactive Dashboards</h3>
              <p className="text-gray-600">
                Power BI is a powerful business intelligence tool that allows you to visualize your data in a variety of
                ways. With Power BI, you can create interactive dashboards, custom reports, and more.
              </p>
              <p className="text-gray-600">
                Data visualization is the process of representing data in a graphical format. This can be done using
                charts, graphs, maps, and other visual elements. Data visualization can help you to identify trends,
                patterns, and outliers in your data.
              </p>
              <p className="text-gray-600">
                Interactive dashboards are a type of data visualization that allows you to explore your data in a more
                interactive way. With interactive dashboards, you can drill down into your data, filter your data, and
                more.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="border-2 hover:border-primary transition-all">
              <CardHeader>
                <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Data-Driven Decisions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Turn insights into smart, growth-focused decisions that move your business forward.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all">
              <CardHeader>
                <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4">
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
                    className="text-primary"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <CardTitle>End-to-End Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get tailor-made visualizations that align with your KPIs, delivering exactly what you need to optimize
                  performance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all">
              <CardHeader>
                <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Real-Time Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get tailor-made visualizations that align with your KPIs, delivering exactly what you need to optimize
                  performance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all">
              <CardHeader>
                <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4">
                  <PieChart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Scalable Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Access up-to-the-minute analytics, empowering teams to act on data immediately.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">Our BI Solutions Delivery Process</h3>
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Analyze</h4>
                  <p className="text-gray-600">
                    Assess specific needs and data sources to provide custom Power BI solutions.
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Integrate</h4>
                  <p className="text-gray-600">
                    Connect and seamlessly collect data from almost all popular systems and technologies.
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Develop</h4>
                  <p className="text-gray-600">
                    Create tailored industry-specific visualizations for enhanced data reporting.
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-primary">4</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Implement</h4>
                  <p className="text-gray-600">
                    Ensure smooth adoption and empower your team with Power BI training for corporate teams.
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-primary">5</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Ongoing Support</h4>
                  <p className="text-gray-600">
                    Continuous assistance for your evolving needs, including Power BI consulting services.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Power BI Pricing */}
          <div className="max-w-5xl mx-auto mt-16">
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">Power BI Pricing Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-2 hover:border-primary transition-all">
                <CardHeader>
                  <CardTitle>Focused</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">$599</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    A three to four-page functional report covering one business vertical.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Single business vertical</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>3-4 page report</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Basic data integration</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/contact">Get Started</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-2 border-primary transition-all relative">
                <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-sm font-medium rounded-bl-lg rounded-tr-lg">
                  Popular
                </div>
                <CardHeader>
                  <CardTitle>Full Solution</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">$1,599</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    A Complete 360° cross-functional solution that covers multiple reports across all areas of your
                    business.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Multiple business areas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Comprehensive reporting</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Advanced data integration</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/contact">Get Started</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-2 hover:border-primary transition-all">
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <div className="mt-4"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    A fully customized solution tailored to your specific business needs and goals.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Custom reporting solutions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Dedicated support team</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Advanced analytics and insights</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
