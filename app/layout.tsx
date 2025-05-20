import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { CurrencyProvider } from "@/contexts/currency-context"

const inter = Inter({ subsets: ["latin"] })

// Helper function to normalize URLs
function normalizeUrl(url: string | undefined): string {
  if (!url) return "https://kozker.com"
  return url.endsWith("/") ? url.slice(0, -1) : url
}

export const metadata: Metadata = {
  metadataBase: new URL(normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL)),
  title: {
    default: "KozkerTech - Web Development & 24/7 Support Solutions in Kochi",
    template: "%s | KozkerTech",
  },
  description:
    "Launch a polished, mobile-first website in days—capture every opportunity with 24/7 live-chat and smart email routing, then accelerate sales through automated WhatsApp workflows.",
  keywords: [
    "web development",
    "power bi",
    "kochi",
    "website design",
    "whatsapp automation",
    "24/7 support",
    "live chat",
    "mobile-first websites",
  ],
  authors: [{ name: "KozkerTech" }],
  creator: "KozkerTech",
  publisher: "KozkerTech",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  appleWebApp: {
    title: "KozkerTech",
    statusBarStyle: "black-translucent",
    capable: true,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL),
    siteName: "KozkerTech",
    title: "KozkerTech - Web Development & 24/7 Support Solutions in Kochi",
    description:
      "Launch a polished, mobile-first website in days—capture every opportunity with 24/7 live-chat and smart email routing, then accelerate sales through automated WhatsApp workflows.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KozkerTech - Web Development & 24/7 Support Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KozkerTech - Web Development & 24/7 Support Solutions in Kochi",
    description:
      "Launch a polished, mobile-first website in days—capture every opportunity with 24/7 live-chat and smart email routing, then accelerate sales through automated WhatsApp workflows.",
    images: ["/og-image.jpg"],
    creator: "@kozkertech",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code", // Replace with actual verification code
  },
  alternates: {
    canonical: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL),
    languages: {
      en: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL),
    },
  },
    generator: 'v0.dev'
}

export const viewport = {
  themeColor: "#FF6E30",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <CurrencyProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
