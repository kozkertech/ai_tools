import type { Metadata } from "next"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ContactForm } from "@/components/contact-form"
import { generateContactPageSchema } from "@/lib/schema"

export const metadata: Metadata = {
  title: "Contact Us for 24/7 Support & Web Solutions - KozkerTech",
  description:
    "Get in touch with KozkerTech for mobile-first web development, 24/7 customer support, WhatsApp automation, and Power BI solutions in Kochi, Kerala.",
  keywords: ["contact", "kochi", "kerala", "web development", "24/7 support", "whatsapp automation", "live chat"],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
  },
  openGraph: {
    title: "Contact Us for 24/7 Support & Web Solutions - KozkerTech",
    description:
      "Get in touch with KozkerTech for mobile-first web development, 24/7 customer support, WhatsApp automation, and Power BI solutions in Kochi, Kerala.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
    type: "website",
  },
}

export default function ContactPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kozker.com"
  const contactSchema = generateContactPageSchema(baseUrl)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />

      {/* Hero Section */}
      <section className="py-16 md:py-20 hero-pattern">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">Contact Us</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Ready to launch your mobile-first website or set up 24/7 support? Get in touch with our team today.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information and Form */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 dark:text-white">Send Us a Message</h2>
              <ContactForm />
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6 dark:text-white">Contact Information</h2>
                <div className="space-y-4">
                  <Card className="border-0 shadow-sm dark:bg-gray-800">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold dark:text-white">Phone</h3>
                        <p className="text-gray-600 dark:text-gray-300">+91-7306261147</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm dark:bg-gray-800">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold dark:text-white">Email</h3>
                        <p className="text-gray-600 dark:text-gray-300">hello@kozker.com</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm dark:bg-gray-800">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold dark:text-white">Location</h3>
                        <p className="text-gray-600 dark:text-gray-300">Kochi, Kerala, India</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm dark:bg-gray-800">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold dark:text-white">Business Hours</h3>
                        <p className="text-gray-600 dark:text-gray-300">Monday - Friday: 9:00 AM - 6:00 PM</p>
                        <p className="text-gray-600 dark:text-gray-300">Saturday: 10:00 AM - 2:00 PM</p>
                        <p className="text-gray-600 dark:text-gray-300">Sunday: Closed</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 dark:text-white">Connect With Us</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Follow us on social media for the latest updates, tips, and insights.
                </p>
                <div className="flex gap-4">
                  <Button variant="outline" size="icon" className="rounded-full dark:border-gray-700" asChild>
                    <a href="https://www.facebook.com/KozkerTech/" target="_blank" rel="noopener noreferrer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-600 dark:text-blue-400"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                      <span className="sr-only">Facebook</span>
                    </a>
                  </Button>

                  <Button variant="outline" size="icon" className="rounded-full dark:border-gray-700" asChild>
                    <a href="https://x.com/KozkerTech" target="_blank" rel="noopener noreferrer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-400 dark:text-blue-300"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </svg>
                      <span className="sr-only">Twitter</span>
                    </a>
                  </Button>

                  <Button variant="outline" size="icon" className="rounded-full dark:border-gray-700" asChild>
                    <a href="https://www.instagram.com/kozkertech/" target="_blank" rel="noopener noreferrer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-pink-600 dark:text-pink-400"
                      >
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                      <span className="sr-only">Instagram</span>
                    </a>
                  </Button>

                  <Button variant="outline" size="icon" className="rounded-full dark:border-gray-700" asChild>
                    <a href="https://www.linkedin.com/company/kozker-tech" target="_blank" rel="noopener noreferrer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-700 dark:text-blue-500"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect width="4" height="12" x="2" y="9" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                      <span className="sr-only">LinkedIn</span>
                    </a>
                  </Button>

                  <Button variant="outline" size="icon" className="rounded-full dark:border-gray-700" asChild>
                    <a href="https://github.com/Kozker-lab" target="_blank" rel="noopener noreferrer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-800 dark:text-gray-200"
                      >
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      </svg>
                      <span className="sr-only">GitHub</span>
                    </a>
                  </Button>

                  <Button variant="outline" size="icon" className="rounded-full dark:border-gray-700" asChild>
                    <a href="https://in.pinterest.com/kozkertech/" target="_blank" rel="noopener noreferrer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-red-600 dark:text-red-400"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="m8 20 4-9" />
                        <path d="M10.7 13.5C13 13 16 15 16 19" />
                        <path d="M11.3 10S14 8 14 5c0-1.7-1-3-3-3-2.3 0-3 1.3-3 2.8 0 1.7 1.5 2.2 1.5 2.2" />
                      </svg>
                      <span className="sr-only">Pinterest</span>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 dark:text-white">Find Us</h2>
            <p className="text-gray-600 dark:text-gray-300">Visit our office in Kochi, Kerala</p>
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg h-[400px] w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.0122734352603!2d76.25938431029776!3d9.932935374144725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b086d764998c439%3A0xe6d73818b0fca5b!2sKozker%20Tech!5e0!3m2!1sen!2sin!4v1747673120462!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="KozkerTech Office Location"
              className="grayscale hover:grayscale-0 transition-all duration-300"
            ></iframe>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let's work together to create a mobile-first website with 24/7 support and WhatsApp automation that drives
            growth for your business.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-primary">
            <a href="tel:+917306261147">
              <Phone className="mr-2 h-4 w-4" /> Call Us Now
            </a>
          </Button>
        </div>
      </section>
    </>
  )
}
