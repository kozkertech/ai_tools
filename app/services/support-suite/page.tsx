import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "24/7 Live Chat & Email Support Services in Kochi | KozkerTech",
  description:
    "Never miss a lead with our 24/7 live chat and smart email routing support services. Professional customer service available round-the-clock.",
  keywords: ["24/7 support", "live chat", "email support", "customer service", "kochi", "kerala"],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/services/support-suite`,
  },
  openGraph: {
    title: "24/7 Live Chat & Email Support Services in Kochi | KozkerTech",
    description:
      "Never miss a lead with our 24/7 live chat and smart email routing support services. Professional customer service available round-the-clock.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/services/support-suite`,
    type: "website",
  },
}

const SupportSuitePage = () => {
  return (
    <div>
      <h1>24/7 Support Suite</h1>
      <p>Never miss a lead with our round-the-clock support services.</p>
    </div>
  )
}

export default SupportSuitePage
