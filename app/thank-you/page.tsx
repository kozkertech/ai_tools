"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Facebook, Twitter, Linkedin, Mail, Share2 } from "lucide-react"

export default function ThankYouPage() {
  // Base URL for sharing
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kozker.com"
  const pageTitle = "Check out Kozker Tech - Digital Solutions for Small Businesses in Kochi"
  const pageDescription =
    "Kozker Tech provides affordable digital solutions for small businesses in Kochi, including web design, WhatsApp automation, and more."

  // Encoded values for sharing
  const encodedTitle = encodeURIComponent(pageTitle)
  const encodedDescription = encodeURIComponent(pageDescription)
  const encodedUrl = encodeURIComponent(siteUrl)

  // Social media sharing URLs
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  const emailShareUrl = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`

  return (
    <div className="container max-w-4xl py-12 md:py-24">
      <div className="flex flex-col items-center text-center space-y-8">
        <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
          <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Thank You!</h1>

        <p className="text-xl text-muted-foreground">
          Your message has been received. We'll get back to you as soon as possible.
        </p>

        <div className="pt-2">
          <Button asChild>
            <Link href="/">Return to Homepage</Link>
          </Button>
        </div>

        <div className="border-t w-full max-w-md pt-8 mt-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Share Kozker Tech</h3>
            </div>

            <p className="text-sm text-muted-foreground mb-2">
              Know someone who might benefit from our services? Share Kozker Tech with them!
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => window.open(facebookShareUrl, "_blank", "width=600,height=400")}
              >
                <Facebook className="h-4 w-4" />
                <span>Facebook</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => window.open(twitterShareUrl, "_blank", "width=600,height=400")}
              >
                <Twitter className="h-4 w-4" />
                <span>Twitter</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => window.open(linkedinShareUrl, "_blank", "width=600,height=400")}
              >
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => window.open(emailShareUrl)}
              >
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
