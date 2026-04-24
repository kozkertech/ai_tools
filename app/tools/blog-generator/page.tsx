"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Loader2, CheckCircle, XCircle, Sparkles, ChevronRight,
  Briefcase, LayoutTemplate, Copy, RefreshCw, ChevronLeft,
  Check, List, Target, Lightbulb, Search, FileText, ArrowRight,
  Smartphone, Globe, Zap, Settings, ShieldCheck, Download
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
  <span className="tag bg-[var(--cloud)] border-2 border-[var(--iron)] text-[var(--night)] font-bold text-[10px] uppercase tracking-widest px-3 py-1 scale-95">
    {children}
  </span>
)

const SectionCard = ({ title, children, icon: Icon, className = "" }: { title: string, children: React.ReactNode, icon?: any, className?: string }) => (
  <div className={`card overflow-hidden group hover:border-[#FF7435]/30 transition-all duration-500 ${className}`}>
    <div className="bg-[var(--cloud)]/20 border-b border-[var(--iron)]/50 px-6 py-4 flex items-center justify-between">
       <h3 className="text-sm font-black font-poppins flex items-center gap-2 text-[var(--night)] uppercase tracking-widest">
         {Icon && <Icon className="w-4 h-4 text-[#FF7435]" />}
         {title}
       </h3>
       <div className="w-1.5 h-1.5 rounded-full bg-[#FF7435]/20"></div>
    </div>
    <div className="p-6 text-[var(--steel)]">{children}</div>
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
        throw new Error(`Strategic node error: ${response.status}`)
      }

      const resData = await response.json()

      if (resData.success === false) {
        throw new Error(resData.message || resData.error || "Generation engine returned negative status.")
      }

      return resData.data || resData
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || "An unexpected error occurred during synthesis.")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyzeWebsite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.websiteUrl) {
      setErrorMsg("Required parameters missing.")
      return
    }

    const payload = { ...formData }

    const data = await callBlogWorkflow("analyze_website", payload, "Indexing website architecture and business logic...")

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
      isRegenerate ? "Re-evaluating content opportunities..." : "Identifying strategic search intent and content gaps..."
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
      setErrorMsg("No viable topic vectors were detected.")
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
      isRegenerate ? "Restructuring semantic roadmap..." : "Drafting technical SEO outline and content milestones..."
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
      isRegenerate ? "Synthesizing final revision..." : "Synthesizing full article content with advanced NLP..."
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
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-black text-[var(--night)] font-poppins mb-4 mt-12">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-black text-[var(--night)] font-poppins mb-6 mt-16 border-b-4 border-[#FF7435]/10 pb-4 uppercase tracking-tighter">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-black text-[var(--night)] font-poppins mb-10 mt-20 first:mt-0 tracking-tighter">$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-[var(--night)]">$1</strong>')
        .split(/\n\s*\n/)
        .map((paragraph) => {
          const trimmed = paragraph.trim()
          if (!trimmed) return ""
          if (trimmed.match(/^<h[1-6]/)) return trimmed
          const withBreaks = trimmed.replace(/\n/g, "<br />")
          return `<p class="text-[var(--steel)] font-medium mb-8 leading-relaxed text-lg">${withBreaks}</p>`
        })
        .filter(Boolean)
        .join("")
    )
  }

  const renderStepper = () => {
    const steps = ["Strategy", "Intelligence", "Vectors", "Draft", "Publish"]

    return (
      <div className="w-full bg-[var(--cloud)]/60 backdrop-blur-2xl border-b border-[var(--iron)] p-4 sticky top-[124px] z-30 transition-all shadow-sm">
        <div className="max-w-6xl mx-auto overflow-x-auto">
          <div className="flex items-center min-w-max justify-between md:min-w-0">
            {steps.map((step, index) => {
              const stepNumber = index + 1
              const isActive = currentStep === stepNumber
              const isCompleted = currentStep > stepNumber

              return (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center justify-center w-9 h-9 rounded-xl border-2 font-black text-xs transition-all shrink-0 ${isActive
                      ? "border-[#FF7435] bg-[#FF7435] text-white shadow-xl shadow-[#FF7435]/30 scale-110"
                      : isCompleted
                        ? "border-[#FF7435] text-[#FF7435] bg-orange-50/50"
                        : "border-[var(--iron)] text-[var(--steel)] bg-[var(--mist)]"
                    }`}>
                    {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
                  </div>
                  <span className={`ml-4 text-[10px] font-black uppercase tracking-[0.2em] hidden lg:block ${isActive || isCompleted ? "text-[var(--night)]" : "text-[var(--steel)]"
                    }`}>
                    {step}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-8 lg:w-16 h-1 mx-4 shrink-0 rounded-full transition-colors ${isCompleted ? "bg-[#FF7435]" : "bg-[var(--iron)]"
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
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center animate-in fade-in duration-700">
      <div className="relative mb-10">
         <div className="absolute inset-0 bg-[#FF7435]/10 rounded-full animate-ping scale-150"></div>
         <Loader2 className="w-16 h-16 text-[#FF7435] animate-spin relative z-10" />
      </div>
      <h3 className="text-2xl font-black font-poppins mb-3 text-[var(--night)] tracking-tight uppercase">Processing Synthesis</h3>
      <p className="text-[var(--steel)] font-bold italic max-w-sm">{loadingMsg || "Synchronizing with semantic models..."}</p>
    </div>
  )

  const renderStepContent = () => {
    if (isLoading) {
      return <LoadingState />
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
            <div className="text-center mb-16">
               <Badge className="bg-[#FF7435]/10 text-[#FF7435] border-none font-black px-4 py-1.5 uppercase text-[10px] tracking-widest rounded-full mb-6">Phase 01: Initial Parameters</Badge>
              <h2 className="text-4xl font-black font-poppins mb-4 text-[var(--night)] tracking-tight uppercase">Strategic Context</h2>
              <p className="text-[var(--steel)] text-lg font-medium italic">Define the mission vectors for your content generation.</p>
            </div>

            <form onSubmit={handleAnalyzeWebsite} className="card p-10 md:p-16 space-y-12 shadow-2xl shadow-black/5">
              <div className="space-y-8">
                <h3 className="text-sm font-black font-poppins text-[#FF7435] uppercase tracking-[0.3em] flex items-center gap-3">
                   <ShieldCheck className="w-4 h-4" /> Required Identity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="field-label flex items-center gap-2 font-black leading-none">
                       <User className="w-3 h-3" /> Founder/Lead
                    </Label>
                    <Input name="name" value={formData.name} onChange={handleInputChange} required placeholder="John Doe" className="input h-14" />
                  </div>
                  <div className="space-y-3">
                    <Label className="field-label flex items-center gap-2 font-black leading-none">
                       <Mail className="w-3 h-3" /> Secure Email
                    </Label>
                    <Input name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="john@example.com" className="input h-14" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="field-label flex items-center gap-2 font-black leading-none">
                     <Globe className="w-3 h-3" /> Website Terminal
                  </Label>
                  <Input name="websiteUrl" type="url" value={formData.websiteUrl} onChange={handleInputChange} required placeholder="https://venture.com" className="input h-14" />
                </div>
              </div>

              <div className="space-y-8 bg-[var(--mist)] p-8 md:p-12 rounded-[2.5rem] border-2 border-[var(--iron)]/40">
                <h3 className="text-sm font-black font-poppins text-[var(--night)] uppercase tracking-[0.3em] flex items-center gap-3">
                   <Settings className="w-4 h-4" /> Neural Tuning
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="field-label font-black">Business Model</Label>
                    <Input name="businessName" value={formData.businessName} onChange={handleInputChange} placeholder="Acme SaaS" className="input h-12 rounded-2xl" />
                  </div>
                  <div className="space-y-3">
                    <Label className="field-label font-black">Industry Focus</Label>
                    <Input name="industry" value={formData.industry} onChange={handleInputChange} placeholder="Fintech, Health, etc" className="input h-12 rounded-2xl" />
                  </div>
                  <div className="space-y-3">
                    <Label className="field-label font-black">Ideal Persona</Label>
                    <Input name="targetAudience" value={formData.targetAudience} onChange={handleInputChange} placeholder="Decision makers..." className="input h-12 rounded-2xl" />
                  </div>
                  <div className="space-y-3">
                    <Label className="field-label font-black">Linguistic Tone</Label>
                    <Input name="tone" value={formData.tone} onChange={handleInputChange} placeholder="Authoritative..." className="input h-12 rounded-2xl" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="field-label font-black">Additional Logic</Label>
                  <Textarea name="notes" value={formData.notes} onChange={handleInputChange} className="input min-h-[140px] rounded-[2rem] pt-8" placeholder="Specific SEO targets or mission constraints..." />
                </div>
              </div>

              {errorMsg && (
                <Alert variant="destructive" className="rounded-2xl border-2 animate-in shake-in">
                  <XCircle className="w-5 h-5" />
                  <AlertDescription className="font-bold text-xs uppercase tracking-widest">{errorMsg}</AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t-2 border-[var(--iron)]/50">
                <Button type="button" variant="ghost" onClick={() => setFormData({
                  name: "", email: "", websiteUrl: "", businessName: "", industry: "",
                  targetAudience: "", goal: "", tone: "", market: "", notes: ""
                })}
                  className="px-8 h-16 font-black uppercase text-[10px] tracking-widest"
                >
                  Clear Terminal
                </Button>
                <Button type="submit" disabled={!formData.name || !formData.email || !formData.websiteUrl} className="btn-primary flex-1 h-16 text-xs font-black uppercase tracking-[0.2em] group shadow-2xl shadow-[#FF7435]/20 rounded-full">
                  Engage Website Analysis
                  <ChevronRight className="w-5 h-5 ml-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </form>
          </div>
        )

      case 2:
        return (
          <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b-2 border-[var(--iron)]/60">
              <div>
                 <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black px-4 py-1.5 uppercase text-[10px] tracking-widest rounded-full mb-4">Phase 02: Intelligent Scan</Badge>
                <h2 className="text-4xl font-black font-poppins text-[var(--night)] uppercase tracking-tight">Environmental Analysis</h2>
                <p className="text-[var(--steel)] font-medium italic mt-2">Insights extracted from <span className="text-[#FF7435] font-black">{formData.websiteUrl}</span></p>
              </div>
            </div>

            {errorMsg && (
              <Alert variant="destructive" className="rounded-2xl border-2">
                <XCircle className="w-5 h-5" />
                <AlertDescription className="font-black text-xs uppercase tracking-widest">{errorMsg}</AlertDescription>
              </Alert>
            )}

            {websiteAnalysis && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="md:col-span-12 lg:col-span-12">
                   <SectionCard title="Strategic Summary" icon={Zap} className="border-2 border-[#FF7435]/20">
                      <p className="text-[var(--night)] leading-relaxed text-xl font-bold font-poppins">
                        {websiteAnalysis.businessSummary || "No data."}
                      </p>
                   </SectionCard>
                </div>

                <div className="md:col-span-12 lg:col-span-4">
                  <SectionCard title="Target Segments" icon={Target}>
                    <div className="space-y-4">
                      {websiteAnalysis.targetAudienceInferred?.map((aud, i) => (
                        <div key={i} className="flex items-start bg-[var(--mist)] p-5 rounded-[1.5rem] border-2 border-[var(--iron)]/30">
                           <div className="w-6 h-6 bg-[var(--night)] text-white rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 mr-4">0{i+1}</div>
                           <span className="text-[var(--night)] font-bold text-sm leading-tight">{aud}</span>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                </div>

                <div className="md:col-span-12 lg:col-span-8">
                  <SectionCard title="Core Solutions" icon={List}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {websiteAnalysis.services?.map((srv, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2rem] border-2 border-[var(--iron)] text-[var(--night)] font-black text-sm shadow-sm flex items-center gap-4 group hover:bg-[var(--night)] hover:text-white transition-all">
                           <div className="w-3 h-3 rounded-full bg-[#FF7435] group-hover:scale-125 transition-transform" />
                           {srv}
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                </div>

                <div className="md:col-span-12 lg:col-span-5">
                   <SectionCard title="Current Authority" icon={Search}>
                      <div className="flex flex-wrap gap-3">
                         {websiteAnalysis.existingKeywords?.map((kw, i) => <KeywordChip key={i}>{kw}</KeywordChip>)}
                      </div>
                   </SectionCard>
                </div>

                <div className="md:col-span-12 lg:col-span-7">
                   <SectionCard title="Content Vulnerabilities / Gaps" icon={LayoutTemplate}>
                      <div className="space-y-4">
                         {websiteAnalysis.contentGaps?.map((gap, i) => (
                            <div key={i} className="bg-[#FF7435]/5 p-5 rounded-2xl border-2 border-[#FF7435]/10 text-[var(--night)] font-bold flex items-center gap-4 group hover:border-[#FF7435]/30 transition-all">
                               <Sparkles className="w-5 h-5 text-[#FF7435]" />
                               <span>{gap}</span>
                            </div>
                         ))}
                      </div>
                   </SectionCard>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between pt-12 mt-12 border-t-2 border-[var(--iron)] gap-6">
              <Button variant="ghost" onClick={() => setCurrentStep(1)} className="px-10 h-16 text-xs font-black uppercase tracking-widest">
                <ChevronLeft className="w-5 h-5 mr-3" /> Back
              </Button>
              <Button onClick={() => handleGenerateTopics()} className="btn-primary min-w-[280px] h-16 text-xs font-black uppercase tracking-[0.2em] rounded-full shadow-2xl shadow-[#FF7435]/20">
                Generate Subject Vectors <ChevronRight className="w-5 h-5 ml-4" />
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b-2 border-[var(--iron)]/60">
              <div>
                 <Badge className="bg-purple-500/10 text-purple-600 border-none font-black px-4 py-1.5 uppercase text-[10px] tracking-widest rounded-full mb-4">Phase 03: Strategy Design</Badge>
                <h2 className="text-4xl font-black font-poppins text-[var(--night)] uppercase tracking-tight">Topic Suggestions</h2>
                <p className="text-[var(--steel)] font-medium italic mt-2">Select a content vector to initiate the drafting process.</p>
              </div>
              <Button variant="ghost" onClick={() => handleGenerateTopics(true)} className="h-14 px-8 text-xs font-black uppercase tracking-widest border-2 border-[var(--iron)] rounded-2xl hover:bg-[#FF7435]/5 hover:border-[#FF7435]/20">
                <RefreshCw className="w-4 h-4 mr-3" /> Recalibrate
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {topics?.map((topic, i) => {
                const tId = topic.id || `topic_${i}`
                const safeTopic = { ...topic, id: tId }
                const isSelected = selectedTopic?.id === tId

                return (
                  <div
                    key={tId}
                    onClick={() => setSelectedTopic(safeTopic)}
                    className={`cursor-pointer group p-10 rounded-[3rem] border-4 transition-all duration-500 relative flex flex-col h-full transform hover:-translate-y-4 ${isSelected
                        ? "border-[#FF7435] bg-white shadow-2xl shadow-orange-500/20 scale-[1.03]"
                        : "border-[var(--iron)]/40 bg-[var(--cloud)]/30 hover:border-[#FF7435]/30 hover:bg-white hover:shadow-2xl"
                      }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-4 -right-4 bg-[#FF7435] text-white p-3 rounded-2xl shadow-2xl border-4 border-white animate-in zoom-in spin-in-6">
                        <Check className="w-6 h-6 stroke-[4]" />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-8 uppercase tracking-[0.2em] font-black text-[9px]">
                      <span className="px-3 py-1 bg-[var(--night)] text-white rounded-lg">{topic.searchIntent}</span>
                      <span className="px-3 py-1 border-2 border-[var(--iron)] text-[var(--steel)] rounded-lg">{topic.funnelStage}</span>
                    </div>

                    <h3 className="text-2xl font-black font-poppins mb-8 text-[var(--night)] leading-tight flex-grow tracking-tight">{topic.title}</h3>

                    <div className="bg-[var(--mist)] p-6 rounded-[2rem] mb-8 border-2 border-[var(--iron)]/40 flex items-center gap-4">
                      <div className="w-10 h-10 bg-white border-2 border-[var(--iron)]/50 rounded-xl flex items-center justify-center shadow-sm">
                         <Search className="w-4 h-4 text-[#FF7435]" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-[9px] text-[var(--steel)] uppercase tracking-[0.2em] font-black mb-1">Vector Keyword</div>
                        <div className="font-black text-[var(--night)] text-sm truncate">{topic.targetKeyword}</div>
                      </div>
                    </div>

                    <div className="text-sm font-bold text-[var(--steel)] leading-relaxed italic opacity-80 border-t-2 border-[var(--iron)]/20 pt-6">
                       "{topic.reason}"
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-col sm:flex-row justify-between pt-12 mt-12 border-t-2 border-[var(--iron)] gap-6">
              <Button variant="ghost" onClick={() => setCurrentStep(2)} className="px-10 h-16 text-xs font-black uppercase tracking-widest">
                <ChevronLeft className="w-5 h-5 mr-3" /> Back
              </Button>
              <Button
                disabled={!selectedTopic}
                onClick={() => handleGenerateOutline()}
                className="btn-primary min-w-[320px] h-16 text-xs font-black uppercase tracking-[0.2em] rounded-full shadow-2xl shadow-[#FF7435]/30 group"
              >
                Assemble Content Roadmap
                <ChevronRight className="w-5 h-5 ml-4 group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b-2 border-[var(--iron)]/60">
              <div>
                 <Badge className="bg-orange-500/10 text-orange-600 border-none font-black px-4 py-1.5 uppercase text-[10px] tracking-widest rounded-full mb-4">Phase 04: Blueprint Design</Badge>
                <h2 className="text-4xl font-black font-poppins text-[var(--night)] uppercase tracking-tight">Semantic Roadmap</h2>
                <p className="text-[var(--steel)] font-medium italic mt-2">Validate the structural integrity of the proposed article.</p>
              </div>
              <Button variant="ghost" onClick={() => handleGenerateOutline(true)} className="h-14 px-8 text-xs font-black uppercase tracking-widest border-2 border-[var(--iron)] rounded-2xl">
                <RefreshCw className="w-4 h-4 mr-3" /> Rebuild
              </Button>
            </div>

            {outlineData && (
              <div className="space-y-12">
                <Card className="card border-4 border-[var(--night)] shadow-2xl p-10 md:p-16 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--night)] text-white/5 flex items-center justify-center rotate-12 -mr-16 -mt-8 translate-x-4">
                     <LayoutTemplate className="w-24 h-24" />
                  </div>
                  
                  <div className="max-w-2xl">
                    <span className="text-[10px] font-black text-[#FF7435] uppercase tracking-[0.3em] mb-4 block">Authoritative Title</span>
                    <h3 className="text-4xl font-black font-poppins text-[var(--night)] leading-[1.1] tracking-tighter mb-10">
                      {outlineData.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
                     <div className="lg:col-span-8 space-y-8 bg-[var(--mist)] p-10 rounded-[3rem] border-2 border-[var(--iron)]/40 shadow-inner">
                        <div>
                           <strong className="block text-[var(--steel)] text-[10px] uppercase tracking-[0.2em] font-black mb-4">Meta Specification</strong>
                           <div className="space-y-6">
                              <div>
                                 <span className="text-[10px] font-black text-[var(--night)] uppercase opacity-60">Title Tag</span>
                                 <p className="font-black text-[var(--night)] mt-1">{outlineData.metaTitle}</p>
                              </div>
                              <div className="pt-4 border-t border-[var(--iron)]/50">
                                 <span className="text-[10px] font-black text-[var(--night)] uppercase opacity-60">Description</span>
                                 <p className="text-[var(--steel)] font-bold italic text-sm mt-1 leading-relaxed">"{outlineData.metaDescription}"</p>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="lg:col-span-4 space-y-8">
                        <div>
                           <strong className="block text-[var(--steel)] text-[10px] uppercase tracking-[0.2em] font-black mb-4">Strategic CTA</strong>
                           <div className="p-6 bg-[#FF7435] text-white rounded-[2rem] font-black text-center shadow-xl shadow-[#FF7435]/20 text-xs tracking-widest uppercase">
                              {outlineData.ctaDirection}
                           </div>
                        </div>
                        <div>
                           <strong className="block text-[var(--steel)] text-[10px] uppercase tracking-[0.2em] font-black mb-4">Keyword Vectors</strong>
                           <div className="flex flex-wrap gap-2">
                              <KeywordChip>{outlineData.primaryKeyword}</KeywordChip>
                              {outlineData.secondaryKeywords?.slice(0, 3).map((kw, i) => <KeywordChip key={i}>{kw}</KeywordChip>)}
                           </div>
                        </div>
                     </div>
                  </div>
                </Card>

                <div className="card border-2 border-[var(--iron)]/60 overflow-hidden">
                  <div className="bg-[var(--cloud)]/40 border-b-2 border-[var(--iron)]/60 px-10 py-8 flex items-center justify-between">
                    <h3 className="text-xl font-black font-poppins flex items-center gap-4 text-[var(--night)] uppercase tracking-widest">
                      <List className="w-6 h-6 text-[#FF7435]" /> Roadmap Milestones
                    </h3>
                    <Badge className="bg-[var(--iron)] text-[var(--steel)] border-none font-black px-4 py-1">UNITS: {Array.isArray(outlineData.outline) ? outlineData.outline.length : 0}</Badge>
                  </div>
                  <div className="p-10 md:p-20">
                    <div className="space-y-16">
                      {Array.isArray(outlineData.outline) ? outlineData.outline.map((section: any, i: number) => {
                        const heading = typeof section === 'string' ? section : section.heading || section.title || `Unit ${i + 1}`
                        const description = typeof section === 'object' ? (section.description || section.details || "") : ""

                        return (
                          <div key={i} className="flex gap-10 group relative">
                            <div className="flex flex-col items-center">
                              <div className="w-16 h-16 rounded-[1.5rem] bg-[var(--night)] text-[#FF7435] flex items-center justify-center font-black text-2xl shrink-0 border-4 border-white shadow-2xl group-hover:bg-[#FF7435] group-hover:text-white transition-all duration-500 z-10">
                                0{i + 1}
                              </div>
                              {i !== outlineData.outline.length - 1 && (
                                <div className="absolute top-16 left-8 w-1 h-full bg-[var(--iron)]/40 group-hover:bg-[#FF7435]/20 transition-colors pointer-events-none -translate-x-0.5"></div>
                              )}
                            </div>
                            <div className="w-full pb-10">
                              <h4 className="text-3xl font-black text-[var(--night)] mb-6 tracking-tight group-hover:text-[#FF7435] transition-colors">{heading}</h4>
                              {description && (
                                <div className="bg-[var(--mist)] p-8 rounded-[2rem] border-2 border-[var(--iron)]/30 group-hover:border-[#FF7435]/20 transition-all font-medium text-[var(--steel)] leading-relaxed italic">
                                   {description}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      }) : null}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between pt-12 mt-12 border-t-2 border-[var(--iron)] gap-6">
              <Button variant="ghost" onClick={() => setCurrentStep(3)} className="px-10 h-16 text-xs font-black uppercase tracking-widest">
                <ChevronLeft className="w-5 h-5 mr-3" /> Back
              </Button>
              <Button onClick={() => handleGenerateBlog()} className="btn-primary min-w-[340px] h-16 text-xs font-black uppercase tracking-[0.2em] rounded-full shadow-2xl shadow-[#FF7435]/30 group">
                 Synthesize Full Output
                <FileText className="w-5 h-5 ml-4 group-hover:scale-110" />
              </Button>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b-2 border-[var(--iron)]/60">
              <div>
                 <Badge className="bg-emerald-500 text-white border-none font-black px-4 py-1.5 uppercase text-[10px] tracking-widest rounded-full mb-4 shadow-lg shadow-emerald-500/20">Phase 05: Deployment Ready</Badge>
                <h2 className="text-4xl font-black font-poppins text-[var(--night)] uppercase tracking-tight">Final Synthesis</h2>
                <p className="text-[var(--steel)] font-medium italic mt-2">Content validated and optimized for conversion.</p>
              </div>
              <div className="flex gap-4">
                 <Button variant="ghost" onClick={() => handleGenerateBlog(true)} className="h-14 px-8 text-xs font-black uppercase tracking-widest border-2 border-[var(--iron)] rounded-2xl">
                    <RefreshCw className="w-4 h-4 mr-3" /> Revision
                 </Button>
                 <Button variant="ghost" onClick={handleStartOver} className="h-14 px-8 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 hover:text-red-600 rounded-2xl">
                    Reset Engine
                 </Button>
              </div>
            </div>

            {finalBlog && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative items-start">
                {/* Articles Sidebar */}
                <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-[12rem]">
                   <Card className="card border-2 border-[var(--iron)]/60 overflow-hidden shadow-none">
                      <CardHeader className="bg-[var(--night)] text-white p-8">
                         <div className="flex items-center justify-between uppercase font-black text-[9px] tracking-widest opacity-60 mb-2">
                            <span>Diagnostic Score</span>
                            <span className="text-[#FF7435]">98/100</span>
                         </div>
                         <CardTitle className="text-xl font-black font-poppins uppercase tracking-wide">SEO Profile</CardTitle>
                      </CardHeader>
                      <CardContent className="p-8 space-y-10">
                         <div className="space-y-6">
                            <div className="group">
                               <span className="text-[10px] font-black uppercase tracking-widest text-[var(--steel)] mb-3 block">Primary Authority</span>
                               <div className="p-5 bg-[var(--mist)] rounded-2xl border-2 border-[var(--iron)]/40 font-black text-[var(--night)] text-xs truncate group-hover:border-[#FF7435]/30 transition-all">
                                  {finalBlog.metaTitle}
                               </div>
                            </div>
                            <div className="group">
                               <span className="text-[10px] font-black uppercase tracking-widest text-[var(--steel)] mb-3 block">Semantic Slug</span>
                               <div className="p-4 bg-[var(--cloud)] rounded-xl border-2 border-dashed border-[var(--iron)] font-mono text-[10px] text-[var(--steel)] truncate">
                                  /{finalBlog.slug}
                               </div>
                            </div>
                            <div className="group">
                               <span className="text-[10px] font-black uppercase tracking-widest text-[var(--steel)] mb-3 block">Executive Summary</span>
                               <p className="text-[11px] font-bold text-[var(--steel)] leading-relaxed italic border-l-4 border-[#FF7435]/20 pl-4 py-1">
                                  "{finalBlog.metaDescription}"
                                </p>
                            </div>
                         </div>
                      </CardContent>
                   </Card>

                   {finalBlog.cta && (
                      <div className="card p-10 bg-[var(--night)] text-white border-none shadow-2xl relative overflow-hidden group">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF7435] opacity-10 rounded-bl-[4rem] group-hover:scale-125 transition-transform duration-700"></div>
                         <Badge className="bg-[#FF7435] text-white border-none font-black text-[9px] mb-6 tracking-tight">MISSION CRITICAL CTA</Badge>
                         <p className="text-lg font-black font-poppins text-center italic leading-relaxed tracking-tight relative z-10">
                            "{finalBlog.cta}"
                         </p>
                      </div>
                   )}
                </div>

                {/* Main Article Display */}
                <div className="lg:col-span-8 space-y-10">
                  <div className="card border-2 border-[var(--iron)]/80 shadow-2xl overflow-hidden bg-white">
                    <div className="p-8 border-b-2 border-[var(--iron)]/40 flex flex-col md:flex-row justify-between items-center gap-6 bg-[var(--mist)]/30">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white border-2 border-[var(--iron)]/50 rounded-2xl flex items-center justify-center">
                             <FileText className="w-6 h-6 text-[#FF7435]" />
                          </div>
                          <div>
                             <h3 className="text-xl font-black font-poppins text-[var(--night)] uppercase tracking-tight">Encoded Content</h3>
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--steel)]">Ready for deployment</p>
                          </div>
                       </div>
                       <Button onClick={handleCopyContent} className="btn-primary h-14 px-10 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#FF7435]/20 group">
                          {copied ? (
                             <>
                                <CheckCircle className="w-5 h-5 mr-3" /> Copied
                             </>
                          ) : (
                            <>
                               <Copy className="w-5 h-5 mr-3 group-hover:translate-x-0.5" /> Synchronize to Clipboard
                            </>
                          )}
                       </Button>
                    </div>

                    <div className="p-10 md:p-20">
                       <article 
                        className="prose prose-stone max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-[var(--night)] prose-p:text-[var(--steel)] prose-p:font-medium prose-p:text-lg prose-p:leading-relaxed prose-strong:text-[var(--night)] prose-strong:font-black"
                        dangerouslySetInnerHTML={{ __html: parseMarkdownToHTML(finalBlog.content) }}
                       />
                       
                       {/* FAQs Integration */}
                       {finalBlog.faq && finalBlog.faq.length > 0 && (
                          <div className="mt-24 pt-20 border-t-4 border-[var(--iron)]/30">
                             <h3 className="text-3xl font-black font-poppins text-[var(--night)] uppercase tracking-tighter mb-12">Session Inquiries (FAQ)</h3>
                             <div className="space-y-8">
                                {finalBlog.faq.map((faqItem: any, i: number) => (
                                   <div key={i} className="bg-[var(--mist)] p-10 rounded-[2.5rem] border-2 border-[var(--iron)]/40 hover:border-[#FF7435]/30 transition-all">
                                      <h4 className="text-xl font-black text-[var(--night)] mb-4 font-poppins">{faqItem.question}</h4>
                                      <p className="text-[var(--steel)] font-medium leading-relaxed italic border-l-4 border-[var(--iron)] pl-6">{faqItem.answer}</p>
                                   </div>
                                ))}
                             </div>
                          </div>
                       )}
                    </div>
                  </div>
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
    <div className="min-h-screen bg-[var(--mist)] text-[var(--night)] font-inter transition-colors duration-300 pb-40">
      {/* Absolute Premium Strategic Header */}
      <div className="bg-[var(--cloud)]/60 backdrop-blur-2xl border-b border-[var(--iron)] pt-24 pb-10 fixed top-0 w-full z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#FF7435] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#FF7435]/30 transform hover:scale-105 transition-transform cursor-pointer">
                <Sparkles className="w-8 h-8 text-white fill-white" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-3xl font-black font-poppins text-[var(--night)] tracking-tight uppercase leading-none mb-1">
                   SEO Intelligence <span className="text-[#FF7435]">Nexus</span>
                </h1>
                <Badge className="bg-[var(--night)] text-white border-none font-black px-3 py-1 rounded-lg text-[9px] uppercase tracking-widest opacity-80">v5.0 Stable Protocol</Badge>
              </div>
            </div>
            <div className="flex items-center gap-6">
               <div className="flex flex-col items-end text-right">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[var(--steel)]">System Status</span>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                     <span className="text-xs font-black text-[var(--night)] uppercase">Connected</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-[164px]">
        {/* Stepper Integration */}
        {renderStepper()}

        {/* Global Error Banner */}
        {errorMsg && currentStep === 1 && (
           <div className="max-w-6xl mx-auto px-6 mt-8">
              <Alert variant="destructive" className="rounded-2xl border-2">
                <XCircle className="w-5 h-5" />
                <AlertDescription className="font-bold text-xs uppercase tracking-widest">{errorMsg}</AlertDescription>
              </Alert>
           </div>
        )}

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 mt-16">
          {renderStepContent()}
        </div>
      </div>
    </div>
  )
}
