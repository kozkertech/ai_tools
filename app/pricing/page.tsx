import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PriceDisplay } from "@/components/price-display"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export const metadata: Metadata = {
  title: "Pricing - KozkerTech",
  description: "Affordable AI automation solutions with one-time setup and monthly subscription plans.",
}

export default function PricingPage() {
  return (
    <div className="container px-4 py-12 md:py-24 mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">AI Automation Pricing</h1>
        <p className="text-xl text-muted-foreground">Affordable. Fast. Fully AI-Powered.</p>
        <p className="mt-4 text-lg text-muted-foreground">One-Time Setup + Monthly Subscription</p>
      </div>

      <Tabs defaultValue="plans" className="max-w-5xl mx-auto mb-12">
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="plans">Plans Overview</TabsTrigger>
            <TabsTrigger value="features">Detailed Features</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="plans" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="relative flex flex-col rounded-2xl border bg-background p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-5">
                <h3 className="text-xl font-bold">Starter</h3>
                <div className="mt-3">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-muted-foreground">One-Time Setup</span>
                    <span className="ml-auto font-bold">
                      <PriceDisplay amount={4999} />
                    </span>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-sm font-medium text-muted-foreground">Monthly Fee</span>
                    <div className="ml-auto">
                      <PriceDisplay amount={499} className="font-bold" />
                      <span className="text-sm text-muted-foreground">/mo</span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">Perfect for individuals & local stores.</p>
              </div>
              <div className="flex-1">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>1-page site (Home + WhatsApp CTA)</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Basic WhatsApp autoresponder</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>1 simple automation workflow</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Email support (5-day response)</span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button asChild className="w-full rounded-full">
                  <Link href="/contact?plan=starter">Get Started</Link>
                </Button>
              </div>
            </div>

            {/* Smart Plan */}
            <div className="relative flex flex-col rounded-2xl border bg-background p-6 shadow-lg transition-all before:absolute before:-inset-px before:-z-10 before:rounded-2xl before:bg-gradient-to-b before:from-primary/50 before:to-primary/10">
              <div className="absolute -top-5 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                Most Popular
              </div>
              <div className="mb-5">
                <h3 className="text-xl font-bold">Smart</h3>
                <div className="mt-3">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-muted-foreground">One-Time Setup</span>
                    <span className="ml-auto font-bold">
                      <PriceDisplay amount={9999} />
                    </span>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-sm font-medium text-muted-foreground">Monthly Fee</span>
                    <div className="ml-auto">
                      <PriceDisplay amount={1499} className="font-bold" />
                      <span className="text-sm text-muted-foreground">/mo</span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">Ideal for growing small businesses.</p>
              </div>
              <div className="flex-1">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>3-page site (Home, Services, Contact)</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>FAQ bot + lead collection</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>2–3 workflows (lead gen, emails, sheets)</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>WhatsApp + Email support (2-day response)</span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button asChild className="w-full rounded-full">
                  <Link href="/contact?plan=smart">Get Started</Link>
                </Button>
              </div>
            </div>

            {/* Scale Plan */}
            <div className="relative flex flex-col rounded-2xl border bg-background p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-5">
                <h3 className="text-xl font-bold">Scale</h3>
                <div className="mt-3">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-muted-foreground">One-Time Setup</span>
                    <span className="ml-auto font-bold">
                      <PriceDisplay amount={14999} />
                    </span>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-sm font-medium text-muted-foreground">Monthly Fee</span>
                    <div className="ml-auto">
                      <PriceDisplay amount={2499} className="font-bold" />
                      <span className="text-sm text-muted-foreground">/mo</span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">Perfect for teams & service providers.</p>
              </div>
              <div className="flex-1">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>5–7 page site with chatbot + forms</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Full AI bot with CRM sync + scheduled replies</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>5+ flows with API, dashboards, multi-step logic</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>Priority support + free monthly updates</span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button asChild className="w-full rounded-full">
                  <Link href="/contact?plan=scale">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-8">
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Feature</TableHead>
                  <TableHead>Starter</TableHead>
                  <TableHead>Smart</TableHead>
                  <TableHead>Scale</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">AI Website</TableCell>
                  <TableCell>1-page site (Home + WhatsApp CTA)</TableCell>
                  <TableCell>3-page site (Home, Services, Contact)</TableCell>
                  <TableCell>5–7 page site with chatbot + forms automation</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">WhatsApp & Email Bot</TableCell>
                  <TableCell>Basic autoresponder</TableCell>
                  <TableCell>FAQ bot + lead collection</TableCell>
                  <TableCell>Full AI bot with CRM sync + scheduled replies</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Workflow Automation</TableCell>
                  <TableCell>1 simple automation</TableCell>
                  <TableCell>2–3 workflows (lead gen, emails, sheets)</TableCell>
                  <TableCell>5+ flows with API, dashboards, multi-step logic</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Support</TableCell>
                  <TableCell>Email (5-day response)</TableCell>
                  <TableCell>WhatsApp + Email (2-day response)</TableCell>
                  <TableCell>Priority support + free monthly updates</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add-Ons Section */}
      <div className="max-w-4xl mx-auto mt-24">
        <h2 className="text-3xl font-bold text-center mb-8">Add-Ons</h2>
        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[70%]">Add-On</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Extra AI Flow</TableCell>
                <TableCell>
                  <PriceDisplay amount={999} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>CRM / Google Sheets Integration</TableCell>
                <TableCell>
                  <PriceDisplay amount={1499} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Custom Dashboard (Reports)</TableCell>
                <TableCell>
                  <PriceDisplay amount={2499} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>E-commerce Add-on (Product sync)</TableCell>
                <TableCell>
                  <PriceDisplay amount={1999} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Live Agent Handover (WhatsApp)</TableCell>
                <TableCell>
                  <PriceDisplay amount={1499} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Example Automations */}
      <div className="max-w-4xl mx-auto mt-24">
        <h2 className="text-3xl font-bold text-center mb-8">Example Automations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-muted/50 p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-3">
                1
              </div>
              <h3 className="font-medium">Inquiry to CRM</h3>
            </div>
            <p className="text-muted-foreground">Inquiry form → WhatsApp follow-up → CRM update</p>
          </div>
          <div className="bg-muted/50 p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-3">
                2
              </div>
              <h3 className="font-medium">Smart WhatsApp Bot</h3>
            </div>
            <p className="text-muted-foreground">WhatsApp chatbot with FAQ + pricing logic</p>
          </div>
          <div className="bg-muted/50 p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-3">
                3
              </div>
              <h3 className="font-medium">Lead Management</h3>
            </div>
            <p className="text-muted-foreground">Lead form → email alert → Google Sheets + Telegram</p>
          </div>
          <div className="bg-muted/50 p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-3">
                4
              </div>
              <h3 className="font-medium">Booking Automation</h3>
            </div>
            <p className="text-muted-foreground">Auto-confirm service booking + send reminder</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto mt-24">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-xl font-medium mb-2">What's included in the one-time setup fee?</h3>
            <p className="text-muted-foreground">
              The one-time setup fee covers the initial configuration of your AI website, WhatsApp bot, and automation
              workflows. This includes customization to match your brand, integration with your existing systems, and
              training on how to use the platform.
            </p>
          </div>
          <div className="border-b pb-4">
            <h3 className="text-xl font-medium mb-2">Can I upgrade my plan later?</h3>
            <p className="text-muted-foreground">
              Yes, you can upgrade your plan at any time. You'll only need to pay the difference in setup fees between
              your current and new plan, plus the new monthly subscription rate going forward.
            </p>
          </div>
          <div className="border-b pb-4">
            <h3 className="text-xl font-medium mb-2">How long does the setup process take?</h3>
            <p className="text-muted-foreground">
              Typically, we can complete the setup within 3-7 business days, depending on the complexity of your
              requirements and how quickly you provide the necessary information.
            </p>
          </div>
          <div className="border-b pb-4">
            <h3 className="text-xl font-medium mb-2">Do I need technical knowledge to use these systems?</h3>
            <p className="text-muted-foreground">
              No technical knowledge is required. We design all our systems to be user-friendly with simple interfaces.
              We also provide training and documentation to help you get the most out of your automation tools.
            </p>
          </div>
          <div className="border-b pb-4">
            <h3 className="text-xl font-medium mb-2">Can I customize the AI chatbot responses?</h3>
            <p className="text-muted-foreground">
              Yes, all our AI chatbots can be customized to match your brand voice and provide specific responses to
              common questions. The Scale plan offers the most customization options, including scheduled replies and
              CRM integration.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto mt-24 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Automate Your Business?</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Choose the plan that's right for you and start transforming your digital presence today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/contact">Contact Sales</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link href="/solutions">Explore Solutions</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
