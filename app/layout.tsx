import type React from "react"
import type { Metadata } from "next"
import { IBM_Plex_Sans, DM_Sans, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

import Header from "@/components/header"
import Footer from "@/components/footer"
import Analytics from "@/components/analytics"
import ChatWidget from '@/components/ChatWidget';

import { Suspense } from "react"

const ibmPlexSans = IBM_Plex_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "Kozker Tech - AI Automation & Business Intelligence Solutions",
    template: "%s | Kozker",
  },
  description:
    "Transform your business with AI-powered web design, WhatsApp automation, Power BI analytics, and comprehensive digital solutions. Get started with our LaunchPad, GrowthSuite, and Intelligence packages.",
  keywords: [
    "business solutions",
    "business intelligence",
    "power bi",
    "whatsapp automation",
    "web design",
    "ai solutions",
    "data analytics",
    "business automation",
    "web development",
    "cloud solutions",
  ],
  authors: [{ name: "Kozker Team" }],
  creator: "Kozker Tech",
  publisher: "Kozker Tech",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://kozker.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Kozker Tech - AI Automation & Business Intelligence Solutions",
    description: "Transform your business with AI-powered solutions, automation, and analytics.",
    siteName: "Kozker Tech",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kozker Tech - AI Solutions",
    description: "Transform your business with AI-powered solutions, automation, and analytics.",
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
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${ibmPlexSans.variable} ${dmSans.variable} ${jetBrainsMono.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Suspense fallback={null}>
              <div className="app-shell">
                <Header />
                <main className="page section flex-1">{children}</main>
                <Footer />
              </div>
              <Analytics />
              <ChatWidget />
            </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
