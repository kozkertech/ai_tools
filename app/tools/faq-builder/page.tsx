"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Copy, Download, Loader2, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface FAQ {
  question: string
  answer: string
  category: string
}

interface FAQData {
  general: FAQ[]
  pricing: FAQ[]
  support: FAQ[]
  technical: FAQ[]
}

export default function FAQBuilder() {
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    industry: "",
    businessDescription: "",
    targetAudience: "",
    mainServices: "",
    commonConcerns: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [faqData, setFaqData] = useState<FAQData | null>(null)
  const [openCategories, setOpenCategories] = useState<string[]>(["general"])
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call - replace with actual webhook
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Mock FAQ data
      const mockFAQs: FAQData = {
        general: [
          {
            question: `What services does ${formData.businessName} offer?`,
            answer: `${formData.businessName} specializes in ${formData.mainServices}. We provide comprehensive solutions tailored to ${formData.targetAudience} in the ${formData.industry} industry.`,
            category: "general",
          },
          {
            question: `How long has ${formData.businessName} been in business?`,
            answer: `${formData.businessName} has been serving clients in the ${formData.industry} sector with dedication and expertise. Our experience allows us to understand the unique challenges faced by ${formData.targetAudience}.`,
            category: "general",
          },
        ],
        pricing: [
          {
            question: "What are your pricing options?",
            answer: `Our pricing is competitive and tailored to the specific needs of ${formData.targetAudience}. We offer flexible packages that scale with your business requirements. Contact us for a personalized quote.`,
            category: "pricing",
          },
          {
            question: "Do you offer payment plans?",
            answer:
              "Yes, we understand that businesses have different financial needs. We offer flexible payment options and can work with you to create a payment plan that fits your budget.",
            category: "pricing",
          },
        ],
        support: [
          {
            question: "What kind of support do you provide?",
            answer: `We provide comprehensive support to all our clients. Our team is available to help with any questions or concerns you may have about our ${formData.mainServices}.`,
            category: "support",
          },
          {
            question: "How can I contact customer support?",
            answer: `You can reach our support team at ${formData.email}. We typically respond within 24 hours and are committed to resolving any issues quickly and efficiently.`,
            category: "support",
          },
        ],
        technical: [
          {
            question: "What technical requirements do I need?",
            answer: `Our solutions are designed to be user-friendly and accessible. We'll work with you to ensure all technical requirements are met and provide training as needed for ${formData.targetAudience}.`,
            category: "technical",
          },
          {
            question: "Do you provide technical training?",
            answer:
              "Yes, we provide comprehensive training and onboarding to ensure you get the most out of our services. Our team will guide you through every step of the process.",
            category: "technical",
          },
        ],
      }

      setFaqData(mockFAQs)
      toast({
        title: "FAQ Generated Successfully!",
        description: "Your customized FAQ has been created based on your business information.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate FAQ. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]))
  }

  const copyToClipboard = () => {
    if (!faqData) return

    let text = `FAQ for ${formData.businessName}\n\n`
    Object.entries(faqData).forEach(([category, faqs]) => {
      text += `${category.toUpperCase()}\n${"=".repeat(category.length)}\n\n`
      faqs.forEach((faq, index) => {
        text += `${index + 1}. ${faq.question}\n${faq.answer}\n\n`
      })
    })

    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard!",
      description: "FAQ content has been copied to your clipboard.",
    })
  }

  const downloadFAQ = () => {
    if (!faqData) return

    let content = `FAQ for ${formData.businessName}\n\n`
    Object.entries(faqData).forEach(([category, faqs]) => {
      content += `${category.toUpperCase()}\n${"=".repeat(category.length)}\n\n`
      faqs.forEach((faq, index) => {
        content += `${index + 1}. ${faq.question}\n${faq.answer}\n\n`
      })
    })

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${formData.businessName.replace(/\s+/g, "_")}_FAQ.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Download started!",
      description: "Your FAQ file is being downloaded.",
    })
  }

  const resetForm = () => {
    setFormData({
      businessName: "",
      email: "",
      industry: "",
      businessDescription: "",
      targetAudience: "",
      mainServices: "",
      commonConcerns: "",
    })
    setFaqData(null)
    setOpenCategories(["general"])
  }

  if (faqData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Your FAQ is Ready!</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">Customized FAQ for {formData.businessName}</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="flex gap-4 mb-6 justify-center">
              <Button onClick={copyToClipboard} variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Copy FAQ
              </Button>
              <Button onClick={downloadFAQ} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Create New FAQ
              </Button>
            </div>

            <div className="space-y-4">
              {Object.entries(faqData).map(([category, faqs]) => (
                <Card key={category}>
                  <Collapsible open={openCategories.includes(category)} onOpenChange={() => toggleCategory(category)}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center justify-between">
                          <CardTitle className="capitalize text-orange-600 dark:text-orange-400">
                            {category} ({faqs.length} questions)
                          </CardTitle>
                          <ChevronDown
                            className={`w-5 h-5 transition-transform ${
                              openCategories.includes(category) ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {faqs.map((faq, index) => (
                            <div key={index} className="border-l-4 border-orange-200 dark:border-orange-800 pl-4">
                              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">FAQ Builder</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Generate comprehensive FAQs for your business</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Provide details about your business to generate relevant FAQs</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange("businessName", e.target.value)}
                      placeholder="Your Business Name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="contact@yourbusiness.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Select onValueChange={(value) => handleInputChange("industry", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessDescription">Business Description *</Label>
                  <Textarea
                    id="businessDescription"
                    value={formData.businessDescription}
                    onChange={(e) => handleInputChange("businessDescription", e.target.value)}
                    placeholder="Describe what your business does..."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience *</Label>
                  <Input
                    id="targetAudience"
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                    placeholder="e.g., Small businesses, Enterprise clients, Individual consumers"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mainServices">Main Services/Products *</Label>
                  <Textarea
                    id="mainServices"
                    value={formData.mainServices}
                    onChange={(e) => handleInputChange("mainServices", e.target.value)}
                    placeholder="List your main services or products..."
                    rows={2}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commonConcerns">Common Customer Concerns</Label>
                  <Textarea
                    id="commonConcerns"
                    value={formData.commonConcerns}
                    onChange={(e) => handleInputChange("commonConcerns", e.target.value)}
                    placeholder="What questions or concerns do customers typically have?"
                    rows={2}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating FAQ...
                    </>
                  ) : (
                    "Generate FAQ"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
