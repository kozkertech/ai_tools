import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { CurrencyProvider } from "@/contexts/currency-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://kozker.com"),
  title: {
    default: "KozkerTech - Web Development & Power BI Solutions",
    template: "%s | KozkerTech",
  },
  description:
    "High-Conversion Websites, 24/7 Support, WhatsApp Automation, and Power BI Solutions for businesses in Kochi and beyond.",
  keywords: ["web development", "power bi", "kochi", "website design", "whatsapp automation", "customer support"],
  authors: [{ name: "KozkerTech" }],
  creator: "KozkerTech",
  publisher: "KozkerTech",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://kozker.com",
    siteName: "KozkerTech",
    title: "KozkerTech - Web Development & Power BI Solutions",
    description:
      "High-Conversion Websites, 24/7 Support, WhatsApp Automation, and Power BI Solutions for businesses in Kochi and beyond.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KozkerTech - Web Development & Power BI Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KozkerTech - Web Development & Power BI Solutions",
    description:
      "High-Conversion Websites, 24/7 Support, WhatsApp Automation, and Power BI Solutions for businesses in Kochi and beyond.",
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
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
    languages: {
      en: process.env.NEXT_PUBLIC_SITE_URL || "https://kozker.com",
    },
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
