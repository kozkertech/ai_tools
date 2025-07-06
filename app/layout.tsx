import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { CurrencyProvider } from "@/contexts/currency-context"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://kozker.com"),
  title: {
    default: "KozkerTech - Digital Solutions from Launch to Scale",
    template: "%s | KozkerTech",
  },
  description:
    "Comprehensive digital solutions for businesses at every stage. From rapid website launches to advanced BI analytics and automation.",
  keywords: [
    "digital solutions",
    "web development",
    "power bi consulting",
    "whatsapp automation",
    "business intelligence",
    "data analytics",
    "startup solutions",
    "enterprise consulting",
  ],
  authors: [{ name: "KozkerTech" }],
  creator: "KozkerTech",
  publisher: "KozkerTech",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  themeColor: "#FF6E30",
  appleWebApp: {
    title: "KozkerTech",
    statusBarStyle: "black-translucent",
    capable: true,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://kozker.com",
    siteName: "KozkerTech",
    title: "KozkerTech - Digital Solutions from Launch to Scale",
    description:
      "Comprehensive digital solutions for businesses at every stage. From rapid website launches to advanced BI analytics and automation.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KozkerTech - Digital Solutions from Launch to Scale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KozkerTech - Digital Solutions from Launch to Scale",
    description:
      "Comprehensive digital solutions for businesses at every stage. From rapid website launches to advanced BI analytics and automation.",
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
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png",
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
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/icon-512.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FF6E30" />
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
