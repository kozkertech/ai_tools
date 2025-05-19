import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mobile-First Web Design Services in Kochi | KozkerTech",
  description:
    "Launch a polished, mobile-first website in days with our AI-powered web design services. Professional, responsive websites that convert visitors into customers.",
  keywords: ["mobile-first", "web design", "responsive websites", "ai-powered design", "kochi", "kerala"],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/services/ai-powered-web-design`,
  },
  openGraph: {
    title: "Mobile-First Web Design Services in Kochi | KozkerTech",
    description:
      "Launch a polished, mobile-first website in days with our AI-powered web design services. Professional, responsive websites that convert visitors into customers.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/services/ai-powered-web-design`,
    type: "website",
  },
}

const AiPoweredWebDesignPage = () => {
  return (
    <div>
      <h1>AI-Powered Web Design Services</h1>
      <p>We offer mobile-first web design services to help you launch a polished, responsive website.</p>
    </div>
  )
}

export default AiPoweredWebDesignPage
