import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "WhatsApp Automation Services for Business Growth | KozkerTech",
  description:
    "Accelerate sales through automated WhatsApp workflows. Streamline customer communication with personalized messaging for notifications, support, and engagement.",
  keywords: [
    "whatsapp automation",
    "whatsapp business",
    "automated messaging",
    "customer engagement",
    "kochi",
    "kerala",
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/services/whatsapp-automation`,
  },
  openGraph: {
    title: "WhatsApp Automation Services for Business Growth | KozkerTech",
    description:
      "Accelerate sales through automated WhatsApp workflows. Streamline customer communication with personalized messaging for notifications, support, and engagement.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/services/whatsapp-automation`,
    type: "website",
  },
}

const WhatsappAutomationPage = () => {
  return (
    <div>
      <h1>WhatsApp Automation Services</h1>
      <p>
        Accelerate sales through automated WhatsApp workflows. Streamline customer communication with personalized
        messaging for notifications, support, and engagement.
      </p>
    </div>
  )
}

export default WhatsappAutomationPage
