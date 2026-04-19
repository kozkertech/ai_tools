"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Loader2, CheckCircle, XCircle, Sparkles, ChevronRight,
  Briefcase, LayoutTemplate, Copy, RefreshCw, ChevronLeft,
  Check, List, Target, Lightbulb, Search, FileText
} from "lucide-react"

// Types
interface BusinessContext {
  name: string
  email: string
  websiteUrl: string
  businessName?: string
  industry?: string
  targetAudience?: string
  goal?: string
  tone?: string
  market?: string
  notes?: string
}

interface WebsiteAnalysis {
  businessSummary: string
  services: string[]
  targetAudienceInferred: string[]
  existingKeywords: string[]
  keywordOpportunities: string[]
  contentGaps: string[]
}

interface Topic {
  id?: string
  title: string
  targetKeyword: string
  searchIntent: string
  funnelStage: string
  reason: string
}

interface OutlineData {
  title: string
  metaTitle: string
  metaDescription: string
  primaryKeyword: string
  secondaryKeywords: string[]
  outline: string[] | { heading: string, description: string }[] | any[]
  ctaDirection: string
}

interface FinalBlog {
  title: string
  metaTitle: string
  metaDescription: string
  slug: string
  content: string
  faq: { question: string, answer: string }[] | any[]
  cta: string
  internalLinks: { text: string, url: string, anchor?: string }[] | any[]
}

const WEBHOOK_URL = "https://n8n.srv832341.hstgr.cloud/webhook/blog-generator-router-agent"

// Helper Components
const KeywordChip = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border border-orange-200 dark:border-orange-800/50">
    {children}
  </span>
)

const SectionCard = ({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon?: any }) => (
  <div className="bg-white dark:bg-[#111111] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm h-full">
    <h3 className="text-lg font-semibold font-poppins mb-4 flex items-center gap-2">
      {Icon && <Icon className="w-5 h-5 text-[#FF7435]" />}
      {title}
    </h3>
    {children}
  </div>
)

// Main Component
export default function BlogGenerator() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<BusinessContext>({
    name: "",
    email: "",
    websiteUrl: "",
    businessName: "",
    industry: "",
    targetAudience: "",
    goal: "",
    tone: "",
    market: "",
    notes: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const [websiteAnalysis, setWebsiteAnalysis] = useState<WebsiteAnalysis | null>(null)
  const [topics, setTopics] = useState<Topic[] | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [outlineData, setOutlineData] = useState<OutlineData | null>(null)
  const [finalBlog, setFinalBlog] = useState<FinalBlog | null>(null)

  const [copied, setCopied] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const callBlogWorkflow = async (action: string, payloadContext: any, loadingText: string) => {
    setIsLoading(true)
    setLoadingMsg(loadingText)
    setErrorMsg("")
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          action,
          ...payloadContext
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
      }

      const resData = await response.json()

      if (resData.success === false) {
        throw new Error(resData.message || resData.error || "Generation failed from backend")
      }

      return resData.data || resData
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyzeWebsite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.websiteUrl) {
      setErrorMsg("Please fill in all required fields.")
      return
    }

    const payload = { ...formData }

    const data = await callBlogWorkflow("analyze_website", payload, "Analyzing website and understanding business focus...")

    if (data) {
      setWebsiteAnalysis(data)
      setCurrentStep(2)
    }
  }

  const handleGenerateTopics = async (isRegenerate = false) => {
    const payload = {
      context: {
        ...formData,
        websiteAnalysis
      }
    }

    const data = await callBlogWorkflow(
      "generate_topics",
      payload,
      isRegenerate ? "Regenerating topic ideas..." : "Finding SEO opportunities and generating topics..."
    )

    if (data && data.topics) {
      setTopics(data.topics)
      if (isRegenerate) setSelectedTopic(null)
      setCurrentStep(3)
    } else if (data && Array.isArray(data)) {
      setTopics(data)
      if (isRegenerate) setSelectedTopic(null)
      setCurrentStep(3)
    } else if (data) {
      setErrorMsg("No topic suggestions were returned.")
    }
  }

  const handleGenerateOutline = async (isRegenerate = false) => {
    if (!selectedTopic) return

    const payload = {
      context: {
        ...formData,
        websiteAnalysis,
        selectedTopic
      }
    }

    const data = await callBlogWorkflow(
      "generate_outline",
      payload,
      isRegenerate ? "Rebuilding SEO outline..." : "Building SEO outline and preparing headings/metadata..."
    )

    if (data) {
      setOutlineData(data.outlineData || data)
      setCurrentStep(4)
    }
  }

  const handleGenerateBlog = async (isRegenerate = false) => {
    const payload = {
      context: {
        ...formData,
        websiteAnalysis,
        selectedTopic,
        outlineData
      }
    }

    const data = await callBlogWorkflow(
      "generate_blog",
      payload,
      isRegenerate ? "Rewriting final blog post..." : "Writing final blog post and structuring content..."
    )

    if (data) {
      setFinalBlog(data.finalBlog || data)
      setCurrentStep(5)
    }
  }

  const handleCopyContent = () => {
    if (finalBlog?.content) {
      navigator.clipboard.writeText(finalBlog.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleStartOver = () => {
    setCurrentStep(1)
    setFormData({
      name: "", email: "", websiteUrl: "", businessName: "", industry: "",
      targetAudience: "", goal: "", tone: "", market: "", notes: ""
    })
    setWebsiteAnalysis(null)
    setTopics(null)
    setSelectedTopic(null)
    setOutlineData(null)
    setFinalBlog(null)
    setErrorMsg("")
  }

  const parseMarkdownToHTML = (markdown: string) => {
    if (!markdown) return ""
    return (
      markdown
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 dark:text-white font-poppins mb-2 mt-4">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-900 dark:text-white font-poppins mb-3 mt-6">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 dark:text-white font-poppins mb-4 mt-8 first:mt-0">$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
        .split(/\n\s*\n/)
        .map((paragraph) => {
          const trimmed = paragraph.trim()
          if (!trimmed) return ""
          if (trimmed.match(/^<h[1-6]/)) return trimmed
          const withBreaks = trimmed.replace(/\n/g, "<br />")
          return `<p class="text-gray-500 dark:text-gray-400 font-inter mb-4 leading-relaxed">${withBreaks}</p>`
        })
        .filter(Boolean)
        .join("")
    )
  }

  const renderStepper = () => {
    const steps = ["Business Context", "Website Analysis", "Topic Suggestions", "Blog Outline", "Final Blog"]

    return (
      <div className="w-full bg-white dark:bg-[#111111] border-b border-gray-200 dark:border-gray-800 p-4 sticky top-0 z-10 transition-all">
        <div className="max-w-6xl mx-auto overflow-x-auto">
          <div className="flex items-center min-w-max justify-between md:min-w-0">
            {steps.map((step, index) => {
              const stepNumber = index + 1
              const isActive = currentStep === stepNumber
              const isCompleted = currentStep > stepNumber

              return (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold text-sm transition-colors shrink-0 ${isActive
                      ? "border-[#FF7435] bg-[#FF7435] text-white"
                      : isCompleted
                        ? "border-[#FF7435] text-[#FF7435] bg-orange-50 dark:bg-orange-900/20"
                        : "border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400"
                    }`}>
                    {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
                  </div>
                  <span className={`ml-2 text-sm font-medium hidden md:block ${isActive || isCompleted ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
                    }`}>
                    {step}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-8 md:w-12 lg:w-24 h-0.5 mx-2 md:mx-4 shrink-0 transition-colors ${isCompleted ? "bg-[#FF7435]" : "bg-gray-200 dark:bg-gray-800"
                      }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-in fade-in duration-500">
      <Loader2 className="w-12 h-12 text-[#FF7435] animate-spin mb-6" />
      <h3 className="text-xl font-bold font-poppins mb-2 text-gray-900 dark:text-white">Please wait</h3>
      <p className="text-gray-500 dark:text-gray-400">{loadingMsg || "Processing request..."}</p>
    </div>
  )

  const renderStepContent = () => {
    if (isLoading) {
      return <LoadingState />
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold font-poppins mb-3">Business Context</h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg">Tell us about your business so we can create perfectly tailored content.</p>
            </div>

            <form onSubmit={handleAnalyzeWebsite} className="space-y-8 bg-white dark:bg-[#111111] p-6 sm:p-10 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold font-poppins text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">Required Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required placeholder="John Doe" className="bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 focus:border-[#FF7435] focus:ring-[#FF7435]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="john@example.com" className="bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 focus:border-[#FF7435] focus:ring-[#FF7435]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Website URL *</Label>
                  <Input id="websiteUrl" name="websiteUrl" type="url" value={formData.websiteUrl} onChange={handleInputChange} required placeholder="https://example.com" className="bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 focus:border-[#FF7435] focus:ring-[#FF7435]" />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold font-poppins text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">Optional Context</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input id="businessName" name="businessName" value={formData.businessName} onChange={handleInputChange} placeholder="Acme Corp" className="bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry / Niche</Label>
                    <Input id="industry" name="industry" value={formData.industry} onChange={handleInputChange} placeholder="Software Development" className="bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Input id="targetAudience" name="targetAudience" value={formData.targetAudience} onChange={handleInputChange} placeholder="Small business owners" className="bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tone">Tone of Voice</Label>
                    <Input id="tone" name="tone" value={formData.tone} onChange={handleInputChange} placeholder="Professional yet approachable" className="bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal">Goal of Blog Content</Label>
                    <Input id="goal" name="goal" value={formData.goal} onChange={handleInputChange} placeholder="Drive signups for our newsletter" className="bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="market">Target Market / Location</Label>
                    <Input id="market" name="market" value={formData.market} onChange={handleInputChange} placeholder="North America" className="bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} rows={4} placeholder="Any specific requirements, SEO context, or ideas..." className="bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 resize-none" />
                </div>
              </div>

              {errorMsg && (
                <Alert className="bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300">
                  <XCircle className="w-4 h-4 mr-2" />
                  <AlertDescription>{errorMsg}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button type="button" variant="outline" onClick={() => setFormData({
                  name: "", email: "", websiteUrl: "", businessName: "", industry: "",
                  targetAudience: "", goal: "", tone: "", market: "", notes: ""
                })}
                  className="w-1/3 md:w-1/4"
                >
                  Reset
                </Button>
                <Button type="submit" disabled={!formData.name || !formData.email || !formData.websiteUrl} className="flex-1 bg-[#FF7435] hover:bg-[#E6681F] text-white group text-lg p-6">
                  Analyze Website
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </form>
          </div>
        )

      case 2:
        return (
          <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h2 className="text-3xl font-bold font-poppins mb-2">Website Analysis</h2>
                <p className="text-gray-500 dark:text-gray-400">Review the insights extracted from <span className="font-semibold text-gray-800 dark:text-gray-200">{formData.websiteUrl}</span></p>
              </div>
            </div>

            {errorMsg && (
              <Alert className="bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300">
                <XCircle className="w-4 h-4 mr-2" />
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            )}

            {websiteAnalysis && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                  <SectionCard title="Business Summary" icon={Briefcase}>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                      {websiteAnalysis.businessSummary || "No summary available."}
                    </p>
                  </SectionCard>
                </div>

                <div className="lg:col-span-1">
                  <SectionCard title="Target Audience" icon={Target}>
                    {websiteAnalysis.targetAudienceInferred?.length > 0 ? (
                      <ul className="space-y-3">
                        {websiteAnalysis.targetAudienceInferred.map((aud, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-[#FF7435] mr-3 mt-1 text-lg">•</span>
                            <span className="text-gray-600 dark:text-gray-300 font-medium">{aud}</span>
                          </li>
                        ))}
                      </ul>
                    ) : <p className="text-gray-500 text-sm">Not found</p>}
                  </SectionCard>
                </div>

                <div className="lg:col-span-2">
                  <SectionCard title="Services / Offerings" icon={List}>
                    {websiteAnalysis.services?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {websiteAnalysis.services.map((srv, i) => (
                          <div key={i} className="bg-gray-50 dark:bg-zinc-900 p-3 rounded-lg border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-medium shadow-sm">
                            {srv}
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-gray-500 text-sm">Not found</p>}
                  </SectionCard>
                </div>

                <div className="md:col-span-1 lg:col-span-1">
                  <SectionCard title="Existing Keywords" icon={Search}>
                    <div className="flex flex-wrap gap-2">
                      {websiteAnalysis.existingKeywords?.length > 0 ? (
                        websiteAnalysis.existingKeywords.map((kw, i) => (
                          <KeywordChip key={i}>{kw}</KeywordChip>
                        ))
                      ) : <p className="text-gray-500 text-sm">Not found</p>}
                    </div>
                  </SectionCard>
                </div>

                <div className="md:col-span-1 lg:col-span-2">
                  <SectionCard title="Keyword Opportunities" icon={Lightbulb}>
                    <div className="flex flex-wrap gap-2">
                      {websiteAnalysis.keywordOpportunities?.length > 0 ? (
                        websiteAnalysis.keywordOpportunities.map((kw, i) => (
                          <KeywordChip key={i}>{kw}</KeywordChip>
                        ))
                      ) : <p className="text-gray-500 text-sm">Not found</p>}
                    </div>
                  </SectionCard>
                </div>

                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                  <SectionCard title="Content Gaps" icon={LayoutTemplate}>
                    {websiteAnalysis.contentGaps?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {websiteAnalysis.contentGaps.map((gap, i) => (
                          <div key={i} className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-lg border border-orange-100 dark:border-orange-800/30 text-gray-800 dark:text-gray-300 text-sm flex items-start">
                            <span className="text-[#FF7435] mr-3 mt-0.5">•</span>
                            <span className="font-medium leading-relaxed">{gap}</span>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-gray-500 text-sm">Not found</p>}
                  </SectionCard>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-8 mt-8 border-t border-gray-200 dark:border-gray-800">
              <Button variant="outline" onClick={() => setCurrentStep(1)} className="px-6">
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button onClick={() => handleGenerateTopics()} className="bg-[#FF7435] hover:bg-[#E6681F] text-white px-8">
                Generate Topic Ideas <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h2 className="text-3xl font-bold font-poppins mb-2">Topic Suggestions</h2>
                <p className="text-gray-500 dark:text-gray-400">Select a topic to generate an outline for.</p>
              </div>
              <Button variant="outline" onClick={() => handleGenerateTopics(true)}>
                <RefreshCw className="w-4 h-4 mr-2" /> Regenerate
              </Button>
            </div>

            {errorMsg && (
              <Alert className="bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 mb-6">
                <XCircle className="w-4 h-4 mr-2" />
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics?.map((topic, i) => {
                const tId = topic.id || `topic_${i}`
                const safeTopic = { ...topic, id: tId }
                const isSelected = selectedTopic?.id === tId

                return (
                  <div
                    key={tId}
                    onClick={() => setSelectedTopic(safeTopic)}
                    className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-200 relative flex flex-col h-full transform hover:-translate-y-1 ${isSelected
                        ? "border-[#FF7435] bg-orange-50/50 dark:bg-orange-900/10 shadow-lg shadow-orange-500/10"
                        : "border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111111] shadow-sm hover:border-orange-200 dark:hover:border-orange-800/50 hover:shadow-md"
                      }`}
                  >
                    {isSelected && (
                      <div className="absolute top-5 right-5 text-[#FF7435] bg-white dark:bg-[#111111] rounded-full">
                        <CheckCircle className="w-6 h-6 fill-current" />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-4 pr-8">
                      <span className="text-xs font-semibold px-2.5 py-1 bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 rounded-md border border-green-200 dark:border-green-800/50 uppercase tracking-wider">
                        {topic.searchIntent}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 rounded-md border border-purple-200 dark:border-purple-800/50 uppercase tracking-wider">
                        {topic.funnelStage}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-poppins mb-4 text-gray-900 dark:text-white leading-tight flex-grow">{topic.title}</h3>

                    <div className="bg-gray-50 dark:bg-zinc-900 p-3 rounded-lg mb-4 border border-gray-100 dark:border-gray-800 flex items-start gap-2">
                      <Search className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-0.5">Target Keyword</div>
                        <div className="font-medium text-gray-900 dark:text-gray-200">{topic.targetKeyword}</div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400 bg-orange-50/50 dark:bg-orange-900/10 p-4 rounded-lg border border-orange-100 dark:border-orange-800/30">
                      <strong className="block text-gray-900 dark:text-white mb-1"><Lightbulb className="w-4 h-4 inline mr-1 mb-1" />Why this fits:</strong>
                      <span className="leading-relaxed block">{topic.reason}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-between pt-8 mt-8 border-t border-gray-200 dark:border-gray-800">
              <Button variant="outline" onClick={() => setCurrentStep(2)} className="px-6">
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button
                disabled={!selectedTopic}
                onClick={() => handleGenerateOutline()}
                className="bg-[#FF7435] hover:bg-[#E6681F] text-white px-8"
              >
                Generate Outline <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h2 className="text-3xl font-bold font-poppins mb-2">Blog Outline</h2>
                <p className="text-gray-500 dark:text-gray-400">Review and approve the content structure.</p>
              </div>
              <Button variant="outline" onClick={() => handleGenerateOutline(true)}>
                <RefreshCw className="w-4 h-4 mr-2" /> Regenerate
              </Button>
            </div>

            {errorMsg && (
              <Alert className="bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300">
                <XCircle className="w-4 h-4 mr-2" />
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            )}

            {outlineData && (
              <div className="space-y-6">
                {/* Meta Summary Card */}
                <div className="bg-white dark:bg-[#111111] p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#FF7435]"></div>

                  <div className="mb-6">
                    <span className="text-sm font-semibold text-[#FF7435] uppercase tracking-wider mb-2 block">Working Title</span>
                    <h3 className="text-3xl font-bold font-poppins text-gray-900 dark:text-white leading-tight">
                      {outlineData.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-zinc-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 mb-6">
                    <div>
                      <strong className="block text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide mb-1">Meta Title</strong>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">{outlineData.metaTitle}</span>
                    </div>
                    <div>
                      <strong className="block text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide mb-1">CTA Direction</strong>
                      <span className="text-gray-900 dark:text-gray-100 font-medium flex items-center"><Target className="w-4 h-4 mr-2 text-[#FF7435]" /> {outlineData.ctaDirection}</span>
                    </div>
                    <div className="md:col-span-2">
                      <strong className="block text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide mb-1">Meta Description</strong>
                      <span className="text-gray-900 dark:text-gray-100">{outlineData.metaDescription}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <strong className="block text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide mb-2">Primary Keyword</strong>
                      <KeywordChip>{outlineData.primaryKeyword}</KeywordChip>
                    </div>
                    <div>
                      <strong className="block text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide mb-2">Secondary Keywords</strong>
                      <div className="flex flex-wrap gap-2">
                        {outlineData.secondaryKeywords?.map((kw, i) => (
                          <KeywordChip key={i}>{kw}</KeywordChip>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outline Details Cards */}
                <div className="bg-white dark:bg-[#111111] p-0 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                  <div className="bg-gray-50 dark:bg-zinc-900 border-b border-gray-100 dark:border-gray-800 p-6">
                    <h3 className="text-xl font-bold font-poppins flex items-center gap-2">
                      <LayoutTemplate className="w-6 h-6 text-[#FF7435]" /> Article Structure
                    </h3>
                  </div>
                  <div className="p-8">
                    <div className="space-y-6">
                      {Array.isArray(outlineData.outline) ? outlineData.outline.map((section: any, i: number) => {
                        const heading = typeof section === 'string' ? section : section.heading || section.title || `Section ${i + 1}`
                        const description = typeof section === 'object' ? (section.description || section.details || "") : ""

                        return (
                          <div key={i} className="flex gap-6 group">
                            <div className="flex flex-col items-center">
                              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-[#FF7435] flex items-center justify-center font-bold text-lg shrink-0 border border-orange-200 dark:border-orange-800/50 shadow-sm group-hover:scale-110 group-hover:bg-[#FF7435] group-hover:text-white transition-all">
                                {i + 1}
                              </div>
                              {i !== outlineData.outline.length - 1 && (
                                <div className="w-px h-full bg-gray-200 dark:bg-gray-800 group-hover:bg-[#FF7435]/50 transition-colors my-2"></div>
                              )}
                            </div>
                            <div className="pb-8 w-full pt-1">
                              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{heading}</h4>
                              {description && <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed bg-gray-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800/50 shadow-sm">{description}</p>}
                            </div>
                          </div>
                        )
                      }) : (
                        <p className="text-gray-500">Invalid outline format.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-8 mt-8 border-t border-gray-200 dark:border-gray-800">
              <Button variant="outline" onClick={() => setCurrentStep(3)} className="px-6">
                <ChevronLeft className="w-4 h-4 mr-2" /> Back to Topics
              </Button>
              <Button onClick={() => handleGenerateBlog()} className="bg-[#FF7435] hover:bg-[#E6681F] text-white px-8 text-lg py-6">
                Generate Full Blog <FileText className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-800 gap-4">
              <div>
                <h2 className="text-3xl font-bold font-poppins mb-2">Final Blog Post</h2>
                <p className="text-gray-500 dark:text-gray-400">Your content is ready to publish.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => handleGenerateBlog(true)}>
                  <RefreshCw className="w-4 h-4 mr-2" /> Regenerate
                </Button>
                <Button variant="outline" onClick={handleStartOver} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  Start Over
                </Button>
              </div>
            </div>

            {errorMsg && (
              <Alert className="bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300">
                <XCircle className="w-4 h-4 mr-2" />
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            )}

            {finalBlog && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative items-start">

                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Blog Content */}
                  <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="bg-gray-50 dark:bg-zinc-900 border-b border-gray-100 dark:border-gray-800 p-6 flex justify-between items-center sticky top-0 z-10 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
                      <h3 className="text-xl font-bold font-poppins flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#FF7435]" /> Article Content
                      </h3>
                      <Button onClick={handleCopyContent} className="bg-[#FF7435] hover:bg-[#E6681F] text-white font-medium">
                        {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        {copied ? "Copied!" : "Copy Content"}
                      </Button>
                    </div>

                    <div className="p-8 md:p-12 min-h-[500px]">
                      <div
                        className="prose prose-lg dark:prose-invert max-w-none prose-orange prose-headings:font-poppins prose-headings:font-bold prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: parseMarkdownToHTML(finalBlog.content) }}
                      />
                    </div>
                  </div>

                  {/* FAQs */}
                  {finalBlog.faq && finalBlog.faq.length > 0 && (
                    <div className="bg-white dark:bg-[#111111] p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                      <h3 className="text-2xl font-bold font-poppins mb-6 flex items-center gap-2">
                        Frequently Asked Questions
                      </h3>
                      <div className="space-y-4">
                        {finalBlog.faq.map((faqItem: any, i: number) => (
                          <div key={i} className="bg-gray-50 dark:bg-zinc-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 transition-all hover:border-gray-200 dark:hover:border-gray-700">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">{faqItem.question}</h4>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base">{faqItem.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
                  {/* Meta Information */}
                  <SectionCard title="SEO Metadata">
                    <div className="space-y-5 text-sm">
                      <div className="group">
                        <strong className="block text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide text-xs">Title Tag</strong>
                        <div className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200 font-medium group-hover:border-[#FF7435] transition-colors">
                          {finalBlog.metaTitle}
                        </div>
                      </div>
                      <div className="group">
                        <strong className="block text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide text-xs">Meta Description</strong>
                        <div className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200 leading-relaxed group-hover:border-[#FF7435] transition-colors">
                          {finalBlog.metaDescription}
                        </div>
                      </div>
                      <div className="group">
                        <strong className="block text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide text-xs">URL Slug</strong>
                        <div className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200 font-mono text-xs overflow-hidden text-ellipsis whitespace-nowrap group-hover:border-[#FF7435] transition-colors">
                          /{finalBlog.slug}
                        </div>
                      </div>
                    </div>
                  </SectionCard>

                  {/* Internal Links Suggestions */}
                  {finalBlog.internalLinks && finalBlog.internalLinks.length > 0 && (
                    <SectionCard title="Internal Linking">
                      <ul className="space-y-4">
                        {finalBlog.internalLinks.map((link: any, i: number) => (
                          <li key={i} className="text-sm bg-gray-50 dark:bg-zinc-900 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                            <div className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center justify-between">
                              <span className="truncate pr-2">"{link.text || link.anchor}"</span>
                              <span className="text-xs bg-gray-200 dark:bg-zinc-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-400 shrink-0">Anchor</span>
                            </div>
                            <a href={link.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-xs truncate break-all block">
                              {link.url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </SectionCard>
                  )}

                  {/* CTA Setup */}
                  {finalBlog.cta && (
                    <SectionCard title="Recommended CTA">
                      <div className="p-5 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-900/5 border border-orange-200 dark:border-orange-800/30 rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-[#FF7435] opacity-5 rounded-bl-full"></div>
                        <Target className="w-6 h-6 text-[#FF7435] mb-3" />
                        <p className="text-sm text-gray-800 dark:text-gray-200 font-medium leading-relaxed italic relative z-10">
                          "{finalBlog.cta}"
                        </p>
                      </div>
                    </SectionCard>
                  )}
                </div>

              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white font-inter">
      {/* Header */}
      <div className="bg-white dark:bg-[#111111] border-b border-gray-200 dark:border-gray-800 pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF7435] to-[#E6681F] rounded-xl flex items-center justify-center shadow-md mb-4">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold font-poppins text-gray-900 dark:text-white mb-2">Blog Post Generator</h1>
            <p className="text-gray-500 dark:text-gray-400 font-inter text-lg max-w-2xl mx-auto">
              Create high-quality, SEO-optimized blog posts powered by data-driven insights.
            </p>
          </div>
        </div>
      </div>

      {/* Stepper Header */}
      {renderStepper()}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 pb-24">
        {renderStepContent()}
      </div>
    </div>
  )
}
