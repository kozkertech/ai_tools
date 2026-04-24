"use client"

import * as React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Copy, RefreshCw, Download, ChevronDown, Sparkles, MessageSquare, Target, Settings2, Trash2, XCircle, FileText, Globe, List, ShieldCheck, Zap, ArrowRight, MousePointer2 } from "lucide-react"
import ReactMarkdown from "react-markdown"

export default function FAQBuilderClient() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    faq_type: "",
    audience: "",
    custom_audience: "",
    tone: "Professional",
    source_url: "",
    extra_notes: "",
    faq_count: 5,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [faqContent, setFaqContent] = useState<string>("")

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setLoading(true)
    setError(null)
    setFaqContent("")

    try {
      const response = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/faq-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Neural synthesis error: " + response.status)
      }

      const data = await response.json()

      let newFaqContent = ""

      if (Array.isArray(data)) {
        newFaqContent = data?.[0]?.output || data?.[0]?.content || ""
      } else if (data && typeof data === "object") {
        newFaqContent = data.output || data.content || ""
      }

      if (!newFaqContent || typeof newFaqContent !== "string") {
        throw new Error("Invalid linguistic stream received.")
      }

      setFaqContent(newFaqContent)
    } catch (err: any) {
      setError(err.message || "Something went wrong during construction.")
    } finally {
      setLoading(false)
    }
  }

  const handleCopyAll = () => {
    navigator.clipboard.writeText(faqContent)
  }

  const handleExport = (format: "md" | "txt" = "md") => {
    if (!faqContent) return

    const mimeType = format === "md" ? "text/markdown;charset=utf-8" : "text/plain;charset=utf-8"
    const extension = format === "md" ? "md" : "txt"
    
    let filename = `faq-export-${new Date().toISOString().split("T")[0]}.${extension}`
    
    if (formData.title?.trim()) {
      const sanitized = formData.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")
      if (sanitized) {
        filename = `${sanitized}-faq.${extension}`
      }
    }

    const blob = new Blob([faqContent], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 100)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      faq_type: "",
      audience: "",
      custom_audience: "",
      tone: "Professional",
      source_url: "",
      extra_notes: "",
      faq_count: 5,
    })
    setFaqContent("")
    setError(null)
  }

  return (
    <div className="min-h-screen bg-[var(--mist)] text-[var(--night)] transition-colors duration-300 pb-32">
      {/* Premium Sticky Identity Header */}
      <div className="bg-[var(--cloud)]/60 backdrop-blur-2xl border-b border-[var(--iron)] pt-24 pb-8 fixed top-0 w-full z-40 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#FF7435] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#FF7435]/30">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-3xl font-black font-poppins text-[var(--night)] tracking-tighter uppercase leading-none mb-1">
                   FAQ <span className="text-[#FF7435]">Architect</span>
                </h1>
                <Badge className="bg-[var(--night)] text-white border-none font-black px-3 py-1 rounded-lg text-[9px] uppercase tracking-widest opacity-80">v3.0 Dynamic Builder</Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block">
                  <div className="text-[9px] font-black uppercase tracking-widest text-[var(--steel)]">Logic Engine</div>
                  <div className="text-xs font-black text-[var(--night)] uppercase">Connected</div>
               </div>
               <div className="w-px h-10 bg-[var(--iron)]/60 mx-2"></div>
               <Button variant="ghost" onClick={resetForm} className="h-12 px-6 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl">
                  <Trash2 className="w-4 h-4 mr-2" /> Reset
               </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-[164px] max-w-[1440px] mx-auto px-6 lg:px-10 mt-16 lg:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Configuration Form */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <Card className="card p-10 shadow-2xl shadow-black/5 border-2 border-[var(--iron)]/50">
              <CardHeader className="px-0 pt-0 pb-10 border-b-2 border-[var(--iron)]/40 mb-10">
                <div className="flex items-center gap-3">
                   <Settings2 className="w-6 h-6 text-[#FF7435]" />
                   <CardTitle className="text-2xl font-black font-poppins uppercase tracking-tighter">Blueprint</CardTitle>
                </div>
                <CardDescription className="font-bold text-[var(--steel)] italic uppercase tracking-widest text-[10px] mt-2">Define the architectural scope.</CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-8">
                  <div className="flex items-center gap-3 text-[10px] font-black text-[#FF7435] uppercase tracking-[0.3em]">
                    <Target className="w-4 h-4" /> Core Mission
                  </div>

                  <div className="space-y-3">
                    <Label className="field-label font-black text-xs uppercase tracking-widest">Topic / Branding Anchor</Label>
                    <Input
                      placeholder="e.g. KozkerTech Enterprise"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                      className="input h-14"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="field-label font-black text-xs uppercase tracking-widest">Contextual Summary</Label>
                    <Textarea
                      placeholder="Detail the product, service, or policy vector..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      required
                      className="min-h-[140px] input rounded-[2.5rem] pt-8"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="field-label font-black">Architecture Type</Label>
                      <Select value={formData.faq_type} onValueChange={(v) => handleInputChange("faq_type", v)}>
                        <SelectTrigger className="input h-14 rounded-2xl">
                          <SelectValue placeholder="Select Cluster" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Website FAQ">Website FAQ</SelectItem>
                          <SelectItem value="Product FAQ">Product FAQ</SelectItem>
                          <SelectItem value="Service FAQ">Service FAQ</SelectItem>
                          <SelectItem value="Support FAQ">Support FAQ</SelectItem>
                          <SelectItem value="Pricing FAQ">Pricing FAQ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="field-label font-black">Linguistic Tone</Label>
                      <Select value={formData.tone} onValueChange={(v) => handleInputChange("tone", v)}>
                        <SelectTrigger className="input h-14 rounded-2xl">
                          <SelectValue placeholder="Select Frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Professional">Professional</SelectItem>
                          <SelectItem value="Friendly">Friendly</SelectItem>
                          <SelectItem value="Formal">Formal</SelectItem>
                          <SelectItem value="Sales-focused">Sales-focused</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="field-label font-black text-xs uppercase tracking-widest">Persona Targeting</Label>
                    <Select value={formData.audience} onValueChange={(v) => handleInputChange("audience", v)}>
                      <SelectTrigger className="input h-14 rounded-2xl">
                        <SelectValue placeholder="Select Segment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General Customers">General Customers</SelectItem>
                        <SelectItem value="Prospects / Leads">Prospects / Leads</SelectItem>
                        <SelectItem value="Business Owners">Business Owners</SelectItem>
                        <SelectItem value="Custom">Custom Vector</SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.audience === "Custom" && (
                      <div className="pt-2 animate-in slide-in-from-top-4">
                        <Input
                          placeholder="Specify semantic audience parameters..."
                          value={formData.custom_audience}
                          onChange={(e) => handleInputChange("custom_audience", e.target.value)}
                          className="input h-14"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <Collapsible className="rounded-[2.5rem] border-2 border-[var(--iron)]/40 bg-[var(--mist)]/30 overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="flex w-full justify-between items-center py-8 px-10 hover:bg-white transition-all group">
                      <div className="flex items-center gap-4">
                        <Sparkles className="w-5 h-5 text-[#FF7435]" />
                        <span className="font-black font-poppins uppercase tracking-[0.2em] text-xs text-[var(--night)]">Advanced Logic</span>
                      </div>
                      <ChevronDown className="h-6 w-6 text-[var(--steel)] group-data-[state=open]:rotate-180 transition-all" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-10 pb-10 space-y-8 pt-4 animate-in slide-in-from-top-8 duration-500">
                    <div className="space-y-3">
                      <Label className="field-label flex items-center gap-2 font-black uppercase text-[10px] tracking-widest">
                        <Globe className="w-3 h-3" /> Data Source URL
                      </Label>
                      <Input
                        placeholder="https://terminal.com"
                        value={formData.source_url}
                        onChange={(e) => handleInputChange("source_url", e.target.value)}
                        className="input h-12"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="field-label flex items-center gap-2 font-black uppercase text-[10px] tracking-widest">
                        <List className="w-3 h-3" /> Technical Constraints
                      </Label>
                      <Textarea
                        placeholder="Forbidden keywords or specific logic vectors..."
                        value={formData.extra_notes}
                        onChange={(e) => handleInputChange("extra_notes", e.target.value)}
                        className="input min-h-[100px] rounded-[1.5rem]"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="field-label flex items-center justify-between font-black uppercase text-[10px] tracking-widest">
                        <span>Linguistic Quantity</span>
                        <Badge className="bg-[var(--night)] text-white border-none">{formData.faq_count}</Badge>
                      </Label>
                      <Input
                        type="number"
                        min={3}
                        max={15}
                        value={formData.faq_count}
                        onChange={(e) => handleInputChange("faq_count", parseInt(e.target.value, 10) || 5)}
                        className="input h-12"
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {error && (
                  <Alert variant="destructive" className="rounded-2xl border-2 animate-in shake-in">
                    <XCircle className="h-5 w-5" />
                    <AlertDescription className="font-black text-[10px] uppercase tracking-widest">{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="btn-primary w-full h-20 text-xs font-black uppercase tracking-[0.3em] rounded-full shadow-2xl shadow-[#FF7435]/30 group" disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      Execute Synthesis Protocol
                      <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Synthesis Results */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-12">
            {faqContent ? (
              <div className="space-y-10 animate-in slide-in-from-right-12 duration-1000">
                <div className="flex flex-wrap items-center justify-between gap-8 px-4">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border-2 border-emerald-500/20">
                      <ShieldCheck className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black font-poppins text-[var(--night)] uppercase tracking-tighter">Verified Content</h2>
                        <p className="text-[10px] font-black text-[var(--steel)] uppercase tracking-[0.3em] opacity-60">Ready for Production Injection</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="ghost" className="h-12 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 border-[var(--iron)]/60 hover:bg-[#FF7435] hover:text-white hover:border-[#FF7435] transition-all" onClick={() => handleSubmit()} disabled={loading}>
                      <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                      Recalibrate
                    </Button>
                    <Button variant="ghost" className="h-12 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 border-[var(--iron)]/60" onClick={handleCopyAll}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Nexus
                    </Button>
                    <div className="flex gap-2">
                      <Button onClick={() => handleExport("md")} className="btn-primary h-12 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest group shadow-2xl shadow-[#FF7435]/30">
                        <Download className="mr-3 h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
                        Export .MD
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="card p-12 md:p-20 border-2 border-[var(--iron)]/80 bg-white shadow-2xl relative overflow-hidden group">
                  {/* High-End Decor */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF7435]/5 rounded-bl-[8rem] pointer-events-none -z-10"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-tr-[4rem] pointer-events-none -z-10"></div>

                  <div className="prose prose-stone prose-lg max-w-none prose-headings:font-black prose-headings:font-poppins prose-headings:tracking-tighter prose-headings:uppercase prose-headings:text-[var(--night)] prose-p:text-[var(--steel)] prose-p:font-medium prose-p:leading-relaxed prose-strong:text-[#FF7435] prose-strong:font-black prose-li:text-[var(--steel)] prose-code:bg-[var(--mist)] prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-[#FF7435] prose-code:font-black">
                    <ReactMarkdown>{faqContent}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-32 flex flex-col items-center justify-center text-center space-y-12 border-dashed border-4 border-[var(--iron)]/40 grayscale opacity-40 bg-[var(--mist)]/30 rounded-[3rem]">
                <div className="relative">
                   <div className="absolute inset-0 bg-[var(--iron)]/20 rounded-[2.5rem] scale-125 blur-xl"></div>
                   <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center mx-auto border-2 border-[var(--iron)] shadow-inner relative z-10">
                     <FileText className="w-16 h-16 text-[var(--steel)]" />
                   </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black font-poppins text-[var(--night)] uppercase tracking-tighter">Drafting Canvas</h3>
                  <p className="text-[var(--steel)] max-w-sm mx-auto font-bold italic leading-relaxed">
                    Synchronize your mission parameters on the terminal to generate high-fidelity linguistic architecture.
                  </p>
                </div>
                <div className="w-full max-w-md space-y-8 pt-10 select-none pointer-events-none opacity-50 flex flex-col items-center">
                   <div className="h-20 bg-white rounded-3xl w-full border-2 border-dashed border-[var(--iron)]"></div>
                   <div className="h-16 bg-white rounded-full w-3/4 border-2 border-dashed border-[var(--iron)]"></div>
                   <div className="h-32 bg-white rounded-[2rem] w-full border-2 border-dashed border-[var(--iron)]"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
