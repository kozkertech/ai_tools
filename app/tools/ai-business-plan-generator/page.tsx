"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, CheckCircle, XCircle, Download, Rocket, Briefcase, Globe, Target, BarChart, User, Mail, FileText, ArrowRight } from "lucide-react"
import { ContentLoadingScreen } from "@/components/loading-screen"

interface FormData {
  name: string
  email: string
  businessIdea: string
  targetMarketSize: string
  industrySector: string
  businessModel: string
  geographicFocus: string
}

interface WebhookResponse {
  output?: string
  success?: boolean
  message?: string
  [key: string]: any
}

// Premium Markdown renderer
const SimpleMarkdownRenderer = ({ content }: { content: string }) => {
  const parseMarkdown = (text: string) => {
    const lines = text.split("\n")
    const elements: React.ReactNode[] = []
    let currentParagraph: string[] = []
    let listItems: string[] = []
    let inCodeBlock = false
    let codeBlockContent: string[] = []

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        elements.push(
          <p key={elements.length} className="mb-6 leading-relaxed text-[var(--steel)] font-medium text-sm md:text-base">
            {parseInlineMarkdown(currentParagraph.join(" "))}
          </p>
        )
        currentParagraph = []
      }
    }

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={elements.length} className="mb-8 space-y-3">
            {listItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 p-4 bg-[var(--mist)] border-2 border-[var(--iron)]/30 rounded-2xl text-sm font-medium text-[var(--night)]">
                 <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                 {parseInlineMarkdown(item)}
              </li>
            ))}
          </ul>
        )
        listItems = []
      }
    }

    const flushCodeBlock = () => {
      if (codeBlockContent.length > 0) {
        elements.push(
          <pre key={elements.length} className="mb-8 p-6 rounded-[2rem] overflow-x-auto border-2 border-[var(--iron)]/50 bg-[var(--cloud)]/30 backdrop-blur-sm shadow-inner font-mono text-xs">
            <code className="text-[var(--night)]">{codeBlockContent.join("\n")}</code>
          </pre>
        )
        codeBlockContent = []
      }
    }

    lines.forEach((line) => {
      const trimmed = line.trim()
      if (trimmed.startsWith("```")) {
        inCodeBlock ? flushCodeBlock() : (flushParagraph(), flushList())
        inCodeBlock = !inCodeBlock
        return
      }

      if (inCodeBlock) {
        codeBlockContent.push(line)
        return
      }

      if (trimmed.startsWith("# ")) {
        flushParagraph()
        flushList()
        elements.push(<h1 key={elements.length} className="text-3xl font-black mb-8 text-[var(--night)] mt-12 first:mt-0 font-poppins tracking-tight border-b-4 border-[#FF7435]/20 pb-4">{trimmed.slice(2)}</h1>)
      } else if (trimmed.startsWith("## ")) {
        flushParagraph()
        flushList()
        elements.push(<h2 key={elements.length} className="text-2xl font-black mb-6 text-[var(--night)] mt-10 first:mt-0 font-poppins tracking-tight uppercase tracking-[0.1em]">{trimmed.slice(3)}</h2>)
      } else if (trimmed.startsWith("### ")) {
        flushParagraph()
        flushList()
        elements.push(<h3 key={elements.length} className="text-lg font-black mb-4 text-[#FF7435] mt-8 first:mt-0 font-poppins tracking-tight uppercase">{trimmed.slice(4)}</h3>)
      } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        flushParagraph()
        listItems.push(trimmed.slice(2))
      } else if (trimmed === "") {
        flushParagraph()
        flushList()
      } else {
        flushList()
        currentParagraph.push(trimmed)
      }
    })

    flushParagraph()
    flushList()
    flushCodeBlock()

    return elements
  }

  const parseInlineMarkdown = (text: string) => {
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: text
            .replace(/\*\*(.*?)\*\*/g, "<strong class='font-black text-[var(--night)]'>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em class='italic font-medium'>$1</em>")
            .replace(/`(.*?)`/g, '<code class="bg-[var(--night)] text-white px-2 py-0.5 rounded-lg text-xs font-mono">$1</code>')
        }}
      />
    )
  }

  return <div className="max-w-none">{parseMarkdown(content)}</div>
}

export default function BusinessPlanGenerator() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    businessIdea: "",
    targetMarketSize: "",
    industrySector: "",
    businessModel: "",
    geographicFocus: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<WebhookResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return <ContentLoadingScreen />
  }

  const extractBusinessPlanContent = (data: any): string | null => {
    if (Array.isArray(data) && data.length > 0) {
      const firstItem = data[0]
      return firstItem.output || firstItem.message || null
    }

    if (data && typeof data === "object") {
      return data.output || data.message || null
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    setResponse(null)

    try {
      const response = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/biz-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          business_idea: formData.businessIdea,
          target_market_size: formData.targetMarketSize,
          industry_sector: formData.industrySector,
          business_model: formData.businessModel,
          geographic_focus: formData.geographicFocus,
        }),
      })

      if (!response.ok) {
        throw new Error(`Strategic node error: ${response.status}`)
      }

      const data = await response.json()
      const businessPlanContent = extractBusinessPlanContent(data)

      if (businessPlanContent) {
        setResponse({ output: businessPlanContent })
        setSuccess(true)
      } else {
        setError("Synthesis failed. No structured output detected.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "The analysis engine encountered a failure.")
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = Object.values(formData).every((value) => value.trim() !== "")

  const downloadBusinessPlan = () => {
    if (response?.output) {
      const element = document.createElement("a")
      const file = new Blob([response.output], { type: "text/plain" })
      element.href = URL.createObjectURL(file)
      element.download = `plan_${formData.name.toLowerCase().replace(/\s+/g, "_")}.txt`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--mist)] text-[var(--night)] transition-colors duration-300 pb-24">
      {/* Premium Sticky Header */}
      <div className="border-b border-[var(--iron)] bg-[var(--cloud)]/60 backdrop-blur-xl pt-24 pb-8 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto max-w-6xl px-6">
           <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-[#FF7435] rounded-2xl flex items-center justify-center shadow-xl shadow-[#FF7435]/20">
                    <Rocket className="w-8 h-8 text-white" />
                 </div>
                 <div>
                    <h1 className="text-3xl font-black font-poppins text-[var(--night)] tracking-tight uppercase">
                       BizPlan <span className="text-[#FF7435]">Forge</span>
                    </h1>
                    <p className="text-sm font-bold text-[var(--steel)] italic">High-fidelity strategic planning unit.</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black px-4 py-1.5 uppercase text-[10px] tracking-widest rounded-full">
                    AI Analysis Online
                 </Badge>
              </div>
           </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-6 mt-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          {/* Input Unit */}
          <div className="lg:col-span-12 xl:col-span-5">
             <Card className="card border-2 border-[var(--iron)]/50 shadow-none overflow-hidden">
                <CardHeader className="bg-[var(--cloud)]/20 border-b border-[var(--iron)]/50 px-8 py-6">
                   <CardTitle className="text-xl font-black font-poppins flex items-center gap-3">
                      <Briefcase className="w-6 h-6 text-[#FF7435]" />
                      Core Parameters
                   </CardTitle>
                   <CardDescription className="font-medium text-[var(--steel)]">Input your business fundamentals for synthesis.</CardDescription>
                </CardHeader>
                
                <CardContent className="p-8">
                   <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                           <Label className="field-label flex items-center gap-2 font-black">
                              <User className="w-3 h-3" /> Founder Identity
                           </Label>
                           <Input
                             value={formData.name}
                             onChange={(e) => handleInputChange("name", e.target.value)}
                             placeholder="Full name"
                             className="input"
                             required
                           />
                         </div>
                         <div className="space-y-2">
                           <Label className="field-label flex items-center gap-2 font-black">
                              <Mail className="w-3 h-3" /> Secure Email
                           </Label>
                           <Input
                             type="email"
                             value={formData.email}
                             onChange={(e) => handleInputChange("email", e.target.value)}
                             placeholder="founder@venture.com"
                             className="input"
                             required
                           />
                         </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="field-label flex items-center gap-2 font-black">
                           <FileText className="w-3 h-3" /> Executive Brief / Idea
                        </Label>
                        <Textarea
                          value={formData.businessIdea}
                          onChange={(e) => handleInputChange("businessIdea", e.target.value)}
                          placeholder="Describe the core problem and your innovative solution..."
                          className="input min-h-[140px] rounded-[2rem] pt-8"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                           <Label className="field-label flex items-center gap-2 font-black">
                              <Building2 className="w-3 h-3" /> Industry Sector
                           </Label>
                           <Input
                             value={formData.industrySector}
                             onChange={(e) => handleInputChange("industrySector", e.target.value)}
                             placeholder="e.g. Cleantech"
                             className="input"
                             required
                           />
                         </div>
                         <div className="space-y-2">
                           <Label className="field-label flex items-center gap-2 font-black">
                              <Target className="w-3 h-3" /> Monetization
                           </Label>
                           <Input
                             value={formData.businessModel}
                             onChange={(e) => handleInputChange("businessModel", e.target.value)}
                             placeholder="e.g. Freemium SaaS"
                             className="input"
                             required
                           />
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                           <Label className="field-label flex items-center gap-2 font-black">
                              <BarChart className="w-3 h-3" /> Market TAM
                           </Label>
                           <Input
                             value={formData.targetMarketSize}
                             onChange={(e) => handleInputChange("targetMarketSize", e.target.value)}
                             placeholder="e.g. $12B Global"
                             className="input"
                             required
                           />
                         </div>
                         <div className="space-y-2">
                           <Label className="field-label flex items-center gap-2 font-black">
                              <Globe className="w-3 h-3" /> Geofocus
                           </Label>
                           <Input
                             value={formData.geographicFocus}
                             onChange={(e) => handleInputChange("geographicFocus", e.target.value)}
                             placeholder="e.g. North America"
                             className="input"
                             required
                           />
                         </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={!isFormValid || isLoading}
                        className="btn-primary w-full h-16 text-lg font-black uppercase tracking-widest shadow-2xl shadow-[#FF7435]/20 group rounded-full"
                      >
                        {isLoading ? (
                           <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <>
                            <Sparkles className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
                            Forge Business Plan
                          </>
                        )}
                      </Button>
                   </form>
                </CardContent>
             </Card>
          </div>

          {/* Results Unit */}
          <div className="lg:col-span-12 xl:col-span-7">
            {error && (
              <Alert variant="destructive" className="mb-8 rounded-[2rem] border-2 animate-in shake-in">
                <XCircle className="h-5 w-5" />
                <AlertDescription className="font-black text-xs uppercase tracking-widest leading-relaxed">{error}</AlertDescription>
              </Alert>
            )}

            {response?.output ? (
              <div className="animate-in fade-in slide-in-from-right-12 duration-1000">
                <Card className="card border-2 border-[var(--iron)] shadow-2xl shadow-black/5 overflow-hidden">
                  <div className="p-8 border-b-2 border-[var(--iron)]/50 flex items-center justify-between bg-[var(--night)] text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#FF7435] rounded-xl flex items-center justify-center">
                         <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-black font-poppins tracking-tight uppercase">Strategic Blueprint</h3>
                    </div>
                    <Button
                      onClick={downloadBusinessPlan}
                      className="btn-primary h-12 px-6 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#FF7435]/20"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  <div className="p-10 md:p-14 max-h-[900px] overflow-y-auto custom-scrollbar bg-white dark:bg-zinc-900/50">
                    <SimpleMarkdownRenderer content={response.output} />
                    
                    <div className="mt-16 pt-10 border-t-4 border-[var(--iron)]/30 flex items-center justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
                       <Rocket className="w-10 h-10" />
                       <Target className="w-10 h-10" />
                       <BarChart className="w-10 h-10" />
                    </div>
                  </div>
                </Card>
              </div>
            ) : !isLoading && !error && (
              <div className="h-full min-h-[600px] flex flex-col items-center justify-center p-12 bg-[var(--cloud)]/30 border-4 border-dashed border-[var(--iron)] rounded-[4rem] text-center opacity-40">
                 <div className="w-24 h-24 bg-[var(--iron)]/30 rounded-[2rem] flex items-center justify-center mb-8 rotate-3">
                    <Sparkles className="w-12 h-12 text-[var(--night)]" />
                 </div>
                 <h3 className="text-2xl font-black font-poppins text-[var(--night)] uppercase tracking-tight">System Idle</h3>
                 <p className="text-base font-bold text-[var(--steel)] max-w-sm mt-4 px-8 leading-relaxed italic">
                    The intelligence engine is awaiting parameters. Supply your business identity to initiate the forging process.
                 </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Building2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  )
}
