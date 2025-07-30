"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, HelpCircle, Download, Copy, RefreshCw, CheckCircle, Plus, Minus, FileText } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Types
interface FormData {
  businessName: string
  industry: string
  targetAudience: string
  productService: string
  commonQuestions: string
  specificTopics: string
}

interface FAQItem {
  question: string
  answer: string
  category?: string
}

interface FAQResponse {
  faqs: FAQItem[]
  categories: string[]
  insights: {
    totalQuestions: number
    averageAnswerLength: number
    keyTopics: string[]
  }
  webhookResponse?: any
}

// FAQ Results Component
interface FAQResultsProps {
  response: FAQResponse
  onReset: () => void
}

function FAQResults({ response, onReset }: FAQResultsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const copyAllFAQs = async () => {
    const faqText = response.faqs
      .map((faq, index) => `Q${index + 1}: ${faq.question}\nA${index + 1}: ${faq.answer}\n`)
      .join("\n")

    try {
      await navigator.clipboard.writeText(faqText)
      setCopiedIndex(-1)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (error) {
      console.error("Failed to copy all FAQs:", error)
    }
  }

  const downloadFAQs = () => {
    const faqText = response.faqs
      .map((faq, index) => `Q${index + 1}: ${faq.question}\nA${index + 1}: ${faq.answer}\n`)
      .join("\n")

    const blob = new Blob([faqText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "faqs.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedItems(newExpanded)
  }

  const groupedFAQs = response.categories.reduce(
    (acc, category) => {
      acc[category] = response.faqs.filter((faq) => faq.category === category)
      return acc
    },
    {} as Record<string, FAQItem[]>,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white dark:from-zinc-900 dark:to-zinc-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Your FAQ Collection</h1>
          <p className="text-gray-600 dark:text-gray-400">Generated frequently asked questions for your business</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button
            onClick={copyAllFAQs}
            className="bg-orange-600 hover:bg-orange-700 dark:hover:bg-[#d45616] text-white"
          >
            {copiedIndex === -1 ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Copied All!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy All FAQs
              </>
            )}
          </Button>
          <Button
            onClick={downloadFAQs}
            variant="outline"
            className="border-orange-200 dark:border-orange-600 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 bg-transparent"
          >
            <Download className="w-4 h-4 mr-2" />
            Download FAQs
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            className="border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Create New FAQs
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main FAQ Content */}
          <div className="lg:col-span-3">
            <Card className="border-orange-200 dark:border-orange-600 bg-white dark:bg-[#111111]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-300">
                  <HelpCircle className="w-5 h-5" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                  {response.faqs.length} questions generated across {response.categories.length} categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.keys(groupedFAQs).length > 0 ? (
                    Object.entries(groupedFAQs).map(([category, faqs]) => (
                      <div key={category}>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300"
                          >
                            {category}
                          </Badge>
                          <span className="text-sm text-gray-500 dark:text-gray-400">({faqs.length} questions)</span>
                        </h3>
                        <div className="space-y-4">
                          {faqs.map((faq, index) => {
                            const globalIndex = response.faqs.indexOf(faq)
                            const isExpanded = expandedItems.has(globalIndex)
                            return (
                              <Collapsible
                                key={globalIndex}
                                open={isExpanded}
                                onOpenChange={() => toggleExpanded(globalIndex)}
                              >
                                <Card className="border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-500 transition-colors">
                                  <CollapsibleTrigger asChild>
                                    <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                      <div className="flex items-center justify-between">
                                        <CardTitle className="text-base text-gray-900 dark:text-white text-left">
                                          {faq.question}
                                        </CardTitle>
                                        <div className="flex items-center gap-2">
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              copyToClipboard(`Q: ${faq.question}\nA: ${faq.answer}`, globalIndex)
                                            }}
                                            className="text-gray-500 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400"
                                          >
                                            {copiedIndex === globalIndex ? (
                                              <CheckCircle className="w-4 h-4" />
                                            ) : (
                                              <Copy className="w-4 h-4" />
                                            )}
                                          </Button>
                                          {isExpanded ? (
                                            <Minus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                          ) : (
                                            <Plus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                          )}
                                        </div>
                                      </div>
                                    </CardHeader>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                    <CardContent className="pt-0">
                                      <Separator className="mb-4 border-gray-200 dark:border-gray-700" />
                                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                                    </CardContent>
                                  </CollapsibleContent>
                                </Card>
                              </Collapsible>
                            )
                          })}
                        </div>
                        {Object.keys(groupedFAQs).indexOf(category) < Object.keys(groupedFAQs).length - 1 && (
                          <Separator className="mt-8 border-gray-200 dark:border-gray-700" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="space-y-4">
                      {response.faqs.map((faq, index) => {
                        const isExpanded = expandedItems.has(index)
                        return (
                          <Collapsible key={index} open={isExpanded} onOpenChange={() => toggleExpanded(index)}>
                            <Card className="border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-500 transition-colors">
                              <CollapsibleTrigger asChild>
                                <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                  <div className="flex items-center justify-between">
                                    <CardTitle className="text-base text-gray-900 dark:text-white text-left">
                                      {faq.question}
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          copyToClipboard(`Q: ${faq.question}\nA: ${faq.answer}`, index)
                                        }}
                                        className="text-gray-500 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400"
                                      >
                                        {copiedIndex === index ? (
                                          <CheckCircle className="w-4 h-4" />
                                        ) : (
                                          <Copy className="w-4 h-4" />
                                        )}
                                      </Button>
                                      {isExpanded ? (
                                        <Minus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                      ) : (
                                        <Plus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                      )}
                                    </div>
                                  </div>
                                </CardHeader>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <CardContent className="pt-0">
                                  <Separator className="mb-4 border-gray-200 dark:border-gray-700" />
                                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                                </CardContent>
                              </CollapsibleContent>
                            </Card>
                          </Collapsible>
                        )
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Insights */}
            <Card className="border-orange-200 dark:border-orange-600 bg-white dark:bg-[#111111]">
              <CardHeader>
                <CardTitle className="text-orange-800 dark:text-orange-300">FAQ Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                    <p className="text-sm text-orange-600 dark:text-orange-300 font-medium">Total Questions</p>
                    <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                      {response.insights.totalQuestions}
                    </p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                    <p className="text-sm text-orange-600 dark:text-orange-300 font-medium">Avg. Answer Length</p>
                    <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                      {response.insights.averageAnswerLength} words
                    </p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                    <p className="text-sm text-orange-600 dark:text-orange-300 font-medium">Categories</p>
                    <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                      {response.categories.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Topics */}
            <Card className="border-orange-200 dark:border-orange-600 bg-white dark:bg-[#111111]">
              <CardHeader>
                <CardTitle className="text-orange-800 dark:text-orange-300">Key Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {response.insights.keyTopics.map((topic, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300"
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Usage Tips */}
            <Card className="border-orange-200 dark:border-orange-600 bg-white dark:bg-[#111111]">
              <CardHeader>
                <CardTitle className="text-orange-800 dark:text-orange-300">Usage Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                  <li>• Add these FAQs to your website's help section</li>
                  <li>• Use them for customer support training</li>
                  <li>• Include in product documentation</li>
                  <li>• Share with your sales team</li>
                  <li>• Update regularly based on new questions</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// API Functions
async function generateFAQs(formData: FormData): Promise<FAQResponse> {
  try {
    // Send data to your webhook
    const webhookResponse = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/CLI", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    if (!webhookResponse.ok) {
      throw new Error(`Webhook request failed: ${webhookResponse.status} ${webhookResponse.statusText}`)
    }

    const webhookData = await webhookResponse.json()

    // If the webhook returns the expected FAQ format, use it directly
    if (webhookData.faqs) {
      return webhookData
    }

    // Otherwise, generate fallback FAQs
    const faqs = generateFallbackFAQs(formData)
    const categories = [...new Set(faqs.map((faq) => faq.category).filter(Boolean))]

    return {
      faqs,
      categories,
      insights: {
        totalQuestions: faqs.length,
        averageAnswerLength: Math.round(faqs.reduce((sum, faq) => sum + faq.answer.split(" ").length, 0) / faqs.length),
        keyTopics: extractKeyTopics(formData),
      },
      webhookResponse: webhookData,
    }
  } catch (error) {
    console.error("Error calling webhook:", error)
    throw new Error(`Failed to generate FAQs: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// Fallback FAQ generation
function generateFallbackFAQs(formData: FormData): FAQItem[] {
  const commonFAQs = [
    {
      question: `What services does ${formData.businessName} offer?`,
      answer: `${formData.businessName} specializes in ${formData.productService} for ${formData.targetAudience} in the ${formData.industry} industry. We provide comprehensive solutions tailored to meet your specific needs.`,
      category: "General",
    },
    {
      question: "How can I get started?",
      answer:
        "Getting started is easy! Simply contact us through our website or give us a call. We'll schedule a consultation to understand your needs and provide a customized solution.",
      category: "Getting Started",
    },
    {
      question: "What makes you different from competitors?",
      answer: `Our focus on ${formData.targetAudience} and deep expertise in ${formData.industry} sets us apart. We understand the unique challenges in this space and provide tailored solutions.`,
      category: "General",
    },
    {
      question: "Do you offer support after implementation?",
      answer:
        "Yes, we provide ongoing support to ensure you get the most value from our services. Our support team is available to help with any questions or issues that may arise.",
      category: "Support",
    },
    {
      question: "How long does the typical project take?",
      answer:
        "Project timelines vary depending on scope and complexity. During our initial consultation, we'll provide a detailed timeline based on your specific requirements.",
      category: "Process",
    },
    {
      question: "What are your pricing options?",
      answer:
        "We offer flexible pricing options to accommodate different budgets and needs. Contact us for a personalized quote based on your specific requirements.",
      category: "Pricing",
    },
  ]

  // Add specific questions based on user input
  const specificQuestions = formData.commonQuestions
    .split(/[.!?]+/)
    .filter((q) => q.trim().length > 10)
    .slice(0, 4)
    .map((question, index) => ({
      question: question.trim() + "?",
      answer: `This is an important question about ${formData.productService}. We recommend contacting our team for detailed information specific to your situation.`,
      category: "Specific",
    }))

  return [...commonFAQs, ...specificQuestions]
}

function extractKeyTopics(formData: FormData): string[] {
  const topics = [
    formData.industry,
    formData.productService.split(" ")[0],
    formData.targetAudience.split(" ")[0],
    "Support",
    "Pricing",
    "Implementation",
  ]

  return topics.filter(Boolean).slice(0, 6)
}

// Main Component
export default function FAQBuilder() {
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    industry: "",
    targetAudience: "",
    productService: "",
    commonQuestions: "",
    specificTopics: "",
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [faqResponse, setFaqResponse] = useState<FAQResponse | null>(null)
  const [submitError, setSubmitError] = useState<string>("")
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.businessName.trim()) newErrors.businessName = "Business name is required"
    if (!formData.industry.trim()) newErrors.industry = "Industry is required"
    if (!formData.targetAudience.trim()) newErrors.targetAudience = "Target audience is required"
    if (!formData.productService.trim()) newErrors.productService = "Product/service description is required"
    if (!formData.commonQuestions.trim()) newErrors.commonQuestions = "Common questions are required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const submitForm = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitError("")
    setSubmitSuccess(false)

    try {
      const result = await generateFAQs(formData)
      setFaqResponse(result)
      setSubmitSuccess(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      businessName: "",
      industry: "",
      targetAudience: "",
      productService: "",
      commonQuestions: "",
      specificTopics: "",
    })
    setFaqResponse(null)
    setSubmitSuccess(false)
    setSubmitError("")
    setErrors({})
  }

  if (faqResponse && submitSuccess) {
    return <FAQResults response={faqResponse} onReset={resetForm} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white dark:from-zinc-900 dark:to-zinc-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">FAQ Builder</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate comprehensive FAQs for your business automatically
          </p>
        </div>

        {/* Form */}
        <Card className="border-orange-200 dark:border-orange-600 bg-white dark:bg-[#111111]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-300">
              <FileText className="w-5 h-5" />
              Business Information
            </CardTitle>
            <CardDescription>Provide details about your business to generate relevant FAQs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-sm font-medium text-gray-700 dark:text-white">
                  Business Name *
                </Label>
                <Input
                  id="businessName"
                  placeholder="e.g., Acme Solutions"
                  value={formData.businessName}
                  onChange={(e) => updateFormData("businessName", e.target.value)}
                  className={`bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white ${
                    errors.businessName
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-zinc-700 focus:border-orange-500"
                  }`}
                />
                {errors.businessName && <p className="text-red-600 dark:text-red-400 text-sm">{errors.businessName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry" className="text-sm font-medium text-gray-700 dark:text-white">
                  Industry *
                </Label>
                <Input
                  id="industry"
                  placeholder="e.g., Technology, Healthcare, Finance"
                  value={formData.industry}
                  onChange={(e) => updateFormData("industry", e.target.value)}
                  className={`bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white ${
                    errors.industry
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-zinc-700 focus:border-orange-500"
                  }`}
                />
                {errors.industry && <p className="text-red-600 dark:text-red-400 text-sm">{errors.industry}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="targetAudience" className="text-sm font-medium text-gray-700 dark:text-white">
                  Target Audience *
                </Label>
                <Input
                  id="targetAudience"
                  placeholder="e.g., Small business owners, Enterprise clients"
                  value={formData.targetAudience}
                  onChange={(e) => updateFormData("targetAudience", e.target.value)}
                  className={`bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white ${
                    errors.targetAudience
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-zinc-700 focus:border-orange-500"
                  }`}
                />
                {errors.targetAudience && (
                  <p className="text-red-600 dark:text-red-400 text-sm">{errors.targetAudience}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="productService" className="text-sm font-medium text-gray-700 dark:text-white">
                  Product/Service *
                </Label>
                <Input
                  id="productService"
                  placeholder="e.g., Web development, Consulting services"
                  value={formData.productService}
                  onChange={(e) => updateFormData("productService", e.target.value)}
                  className={`bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white ${
                    errors.productService
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-zinc-700 focus:border-orange-500"
                  }`}
                />
                {errors.productService && (
                  <p className="text-red-600 dark:text-red-400 text-sm">{errors.productService}</p>
                )}
              </div>
            </div>

            {/* Detailed Information */}
            <div className="space-y-2">
              <Label htmlFor="commonQuestions" className="text-sm font-medium text-gray-700 dark:text-white">
                Common Customer Questions *
              </Label>
              <Textarea
                id="commonQuestions"
                placeholder="List the questions your customers frequently ask. For example: How much does it cost? How long does implementation take? Do you offer support? What makes you different?"
                value={formData.commonQuestions}
                onChange={(e) => updateFormData("commonQuestions", e.target.value)}
                className={`min-h-[120px] bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 ${
                  errors.commonQuestions
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 dark:border-zinc-700 focus:border-orange-500"
                }`}
              />
              {errors.commonQuestions && (
                <p className="text-red-600 dark:text-red-400 text-sm">{errors.commonQuestions}</p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Include any questions you receive via email, phone, or chat support
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specificTopics" className="text-sm font-medium text-gray-700 dark:text-white">
                Specific Topics to Cover (Optional)
              </Label>
              <Textarea
                id="specificTopics"
                placeholder="Any specific areas you want to ensure are covered in the FAQs. For example: pricing models, technical requirements, integration process, security features"
                value={formData.specificTopics}
                onChange={(e) => updateFormData("specificTopics", e.target.value)}
                className="min-h-[100px] bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 border-gray-300 dark:border-zinc-700 focus:border-orange-500"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This helps ensure important topics are included in your FAQ collection
              </p>
            </div>

            {/* Error Alert */}
            {submitError && (
              <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                <AlertDescription className="text-red-800 dark:text-red-100">{submitError}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                onClick={submitForm}
                disabled={isSubmitting}
                className="bg-orange-600 hover:bg-orange-700 dark:hover:bg-[#d45616] text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating FAQs...
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Generate FAQs
                  </>
                )}
              </Button>

              <Button
                onClick={resetForm}
                variant="outline"
                className="border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Form
              </Button>
            </div>

            {/* Tips */}
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">💡 Tips for Better Results</h4>
              <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                <li>• Be specific about your products/services and target audience</li>
                <li>• Include real questions from customer interactions</li>
                <li>• Mention any unique features or differentiators</li>
                <li>• Consider questions about pricing, support, and implementation</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
