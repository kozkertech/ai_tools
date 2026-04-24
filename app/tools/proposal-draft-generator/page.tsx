"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Loader2, FileText, Download, Copy, RefreshCcw, ShieldCheck, Mail, Target, Briefcase, FileSignature, ArrowRight, Sparkles, Building2, Globe, LayoutDashboard } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { ContentLoadingScreen } from "@/components/loading-screen"

interface FormData {
  name: string
  cost: string
  email: string
  scope: string
  problem: string
  website: string
  solution: string
  howSoon: string
  companyName: string
}

interface WebhookResponse {
  [key: string]: any
}

export default function ProposalGenerator() {
  const [formData, setFormData] = useState<FormData>({
    name: "", cost: "", email: "", scope: "", problem: "", website: "", solution: "", howSoon: "", companyName: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [webhookResponse, setWebhookResponse] = useState<WebhookResponse | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const extractMarkdownContent = (response: any): string | null => {
    if (Array.isArray(response) && response.length > 0 && response[0].markdown) return response[0].markdown
    if (response?.markdown) return response.markdown
    for (const key in response) {
      if (typeof response[key] === "string" && response[key].includes("# Business Proposal")) {
        return response[key]
      }
    }
    return null
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const downloadAsMarkdown = (content: string) => {
    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `proposal-${formData.companyName || "client"}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSubmitStatus("idle")
    setErrorMessage("")
    setWebhookResponse(null)

    try {
      const response = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/fdf6b12c-513e-4fd8-a13c-b3049fc958f7", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const responseData = await response.json()
        setWebhookResponse(responseData)
        setSubmitStatus("success")
      } else {
        throw new Error(`Data node synchronization error: ${response.status}`)
      }
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "An unexpected logic breach occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <ContentLoadingScreen />

  const markdownContent = webhookResponse ? extractMarkdownContent(webhookResponse) : null

  const preprocessMarkdown = (content: string): string => {
    return content.replace(/\*\*(.*?)\*\*/g, "**$1**").replace(/\*(.*?)\*/g, "*$1*").trim()
  }

  const resetTerminal = () => {
     setWebhookResponse(null)
     setSubmitStatus("idle")
     setFormData({
       name: "", cost: "", email: "", scope: "", problem: "", website: "", solution: "", howSoon: "", companyName: "",
     })
  }

  return (
    <div className="min-h-screen bg-[var(--mist)] text-[var(--night)] transition-colors duration-300 pb-32">
       {/* Premium Sticky Identity Header */}
      <div className="bg-[var(--cloud)]/60 backdrop-blur-2xl border-b border-[var(--iron)] pt-24 pb-8 sticky top-0 w-full z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#FF7435] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#FF7435]/30">
                <FileSignature className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black font-poppins text-[var(--night)] tracking-tighter uppercase leading-none mb-1">
                   Proposal <span className="text-[#FF7435]">Draft</span>
                </h1>
                <p className="text-[10px] font-black text-[var(--steel)] uppercase tracking-[0.4em]">Strategic Manifestation v4.0</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block mr-4">
                  <div className="text-[9px] font-black uppercase tracking-widest text-[var(--steel)]">Document Status</div>
                  <div className="text-xs font-black text-[var(--night)] uppercase flex items-center justify-end gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                     Ready
                  </div>
               </div>
               <Button onClick={resetTerminal} variant="outline" className="h-14 px-8 border-2 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all border-[var(--iron)] group">
                 <RefreshCcw className="w-4 h-4 mr-3 group-hover:rotate-180 transition-transform duration-500" /> New Blueprint
               </Button>
            </div>
          </div>
        </div>
      </div>

       <div className="pt-16 max-w-7xl mx-auto px-6 lg:px-10 mt-12 mb-20">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
          
          {/* Proposition Configuration Form */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-10 animate-in fade-in slide-in-from-left-8 duration-700">
             <Card className="card p-12 shadow-2xl shadow-black/5 border-2 border-[var(--iron)]/50 bg-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF7435]/5 rounded-bl-[10rem] pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
                
                <CardHeader className="px-0 pt-0 pb-10 border-b-2 border-dashed border-[var(--iron)]/40 mb-10">
                   <div className="flex items-center gap-4">
                      <LayoutDashboard className="w-6 h-6 text-[#FF7435]" />
                      <CardTitle className="text-2xl font-black font-poppins uppercase tracking-tighter">Draft Configuration</CardTitle>
                   </div>
                </CardHeader>
                
                <CardContent className="px-0 pb-0 space-y-8">
                   <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                         <div className="space-y-3">
                            <Label className="field-label font-black text-[10px] uppercase tracking-widest opacity-70 flex items-center gap-2"><UserCheck className="w-3 h-3 text-[#FF7435]"/> Identity *</Label>
                            <Input name="name" value={formData.name} onChange={handleInputChange} required placeholder="Jane Doe" className="input h-14" />
                         </div>
                         <div className="space-y-3">
                            <Label className="field-label font-black text-[10px] uppercase tracking-widest opacity-70 flex items-center gap-2"><Building2 className="w-3 h-3 text-[#FF7435]"/> Client Entity *</Label>
                            <Input name="companyName" value={formData.companyName} onChange={handleInputChange} required placeholder="Client Corp." className="input h-14" />
                         </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                         <div className="space-y-3">
                            <Label className="field-label font-black text-[10px] uppercase tracking-widest opacity-70 flex items-center gap-2"><Mail className="w-3 h-3 text-[#FF7435]"/> Secure Terminal *</Label>
                            <Input name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="jane@example.com" className="input h-14" />
                         </div>
                         <div className="space-y-3">
                            <Label className="field-label font-black text-[10px] uppercase tracking-widest opacity-70 flex items-center gap-2"><Sparkles className="w-3 h-3 text-[#FF7435]"/> Project Valuation *</Label>
                            <Input name="cost" value={formData.cost} onChange={handleInputChange} required placeholder="E.g. $10,000" className="input h-14" />
                         </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                         <div className="space-y-3">
                            <Label className="field-label font-black text-[10px] uppercase tracking-widest opacity-70 flex items-center gap-2"><Globe className="w-3 h-3 text-[#FF7435]"/> Digital Node *</Label>
                            <Input name="website" value={formData.website} onChange={handleInputChange} required placeholder="https://client-site.com" className="input h-14" />
                         </div>
                         <div className="space-y-3">
                            <Label className="field-label font-black text-[10px] uppercase tracking-widest opacity-70 flex items-center gap-2"><Target className="w-3 h-3 text-[#FF7435]"/> Deployment Phase *</Label>
                            <Input name="howSoon" value={formData.howSoon} onChange={handleInputChange} required placeholder="Timeline designation" className="input h-14" />
                         </div>
                      </div>

                      <div className="space-y-3">
                         <Label className="field-label font-black text-[10px] uppercase tracking-widest opacity-70 flex items-center gap-2"><Briefcase className="w-3 h-3 text-[#FF7435]"/> Mission Scope *</Label>
                         <Textarea name="scope" value={formData.scope} onChange={handleInputChange} required rows={3} placeholder="Define the boundaries of the engagement..." className="input pt-6 px-6 min-h-[100px] rounded-[2rem]" />
                      </div>

                      <div className="space-y-3">
                         <Label className="field-label font-black text-[10px] uppercase tracking-widest opacity-70 flex items-center gap-2"><AlertCircle className="w-3 h-3 text-[#FF7435]"/> Critical Problem Signal *</Label>
                         <Textarea name="problem" value={formData.problem} onChange={handleInputChange} required rows={3} placeholder="Analyze the primary client fault points..." className="input pt-6 px-6 min-h-[100px] rounded-[2rem]" />
                      </div>

                      <div className="space-y-3">
                         <Label className="field-label font-black text-[10px] uppercase tracking-widest opacity-70 flex items-center gap-2"><Zap className="w-3 h-3 text-[#FF7435]"/> Proposed Resolution *</Label>
                         <Textarea name="solution" value={formData.solution} onChange={handleInputChange} required rows={3} placeholder="Linguistic manifestation of the solution..." className="input pt-6 px-6 min-h-[100px] rounded-[2rem]" />
                      </div>

                      <Button type="submit" disabled={isLoading} className="w-full btn-primary h-20 text-xs font-black uppercase tracking-[0.4em] rounded-full shadow-2xl shadow-[#FF7435]/30 group">
                        {isLoading ? (
                          <><Loader2 className="w-6 h-6 mr-4 animate-spin" /> Manifesting Proposal...</>
                        ) : (
                          <>Initialize Proposal Draft <FileText className="w-6 h-6 ml-4 group-hover:scale-125 transition-transform" /></>
                        )}
                      </Button>
                   </form>
                </CardContent>
             </Card>
          </div>

          {/* Proposition Output Display */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-10">
             {submitStatus === "success" && !markdownContent && (
                <Card className="rounded-[2.5rem] border-2 border-emerald-200 bg-emerald-50 p-8 shadow-2xl shadow-emerald-500/5 animate-in fade-in duration-700">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                         <ShieldCheck className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-emerald-900 leading-none mb-1">Manifestation Secured</p>
                         <p className="text-xs font-bold text-emerald-700">Proposal initialized. Syncing document node...</p>
                      </div>
                   </div>
                </Card>
             )}

             {submitStatus === "error" && (
                <Card className="rounded-[2.5rem] border-2 border-red-200 bg-red-50 p-8 shadow-2xl shadow-red-500/5 animate-in shake-in">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                         <AlertCircle className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-red-900 leading-none mb-1">Signal Fault</p>
                         <p className="text-xs font-bold text-red-700">{errorMessage || "Linguistic synthesis failed."}</p>
                      </div>
                   </div>
                </Card>
             )}

             {markdownContent ? (
                <Card className="card p-0 border-2 border-[var(--iron)] shadow-2xl shadow-black/5 bg-white relative overflow-hidden animate-in fade-in slide-in-from-right-8 duration-1000">
                   <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF7435]/5 rounded-bl-[12rem] pointer-events-none"></div>
                   
                   <CardHeader className="bg-[var(--night)] p-10 md:p-14 border-none flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                        <FileText className="h-6 w-6 text-[#FF7435]" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-black font-poppins uppercase tracking-tighter text-white">Generated Manifest</CardTitle>
                        <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em] mt-1">Status: Executive Approved</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(markdownContent)} className="h-12 px-6 bg-white/5 border-2 border-white/10 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-[var(--night)] transition-all">
                        <Copy className="h-4 w-4 mr-3" /> Copy Node
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => downloadAsMarkdown(markdownContent)} className="h-12 px-6 bg-[#FF7435] border-none text-white font-black uppercase text-[10px] tracking-widest hover:opacity-90 shadow-xl shadow-[#FF7435]/20 transition-all">
                        <Download className="h-4 w-4 mr-3" /> Export .MD
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-0 bg-white relative z-10">
                    <div className="max-h-[1000px] overflow-y-auto custom-scrollbar">
                      <div className="p-12 md:p-20">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => (
                              <h1 className="text-4xl md:text-5xl font-black font-poppins text-[var(--night)] tracking-tighter uppercase mb-12 border-b-8 border-[#FF7435] pb-6 text-center">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-2xl font-black font-poppins text-[var(--night)] tracking-tighter uppercase mb-8 mt-16 flex items-center gap-4">
                                <div className="h-8 w-2 bg-[#FF7435] rounded-full shrink-0"></div>
                                <span className="bg-gradient-to-r from-[var(--mist)] to-transparent px-4 py-2 rounded-xl w-full">{children}</span>
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-xl font-black font-poppins text-[var(--night)] tracking-tighter uppercase mb-6 mt-12 text-[#FF7435] px-6">
                                {children}
                              </h3>
                            ),
                            p: ({ children }) => (
                              <p className="text-base font-bold text-[var(--night)]/70 leading-loose mb-8 px-6 italic">{children}</p>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-none text-[var(--night)] font-bold mb-8 space-y-4 px-6">{children}</ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal list-inside text-[var(--night)] font-bold mb-8 space-y-4 px-10">
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => (
                              <li className="flex items-start">
                                <span className="inline-block w-4 h-4 rounded bg-[#FF7435]/20 border-2 border-[#FF7435]/40 mt-1.5 mr-4 flex-shrink-0"></span>
                                <span className="text-sm font-bold opacity-80 leading-relaxed">{children}</span>
                              </li>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-black text-[var(--night)] bg-[var(--mist)] px-2 rounded-lg py-0.5 border border-[var(--iron)]/40 shadow-sm">
                                {children}
                              </strong>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-8 border-[#FF7435] bg-[var(--mist)] px-10 py-10 italic text-[var(--night)] font-black text-xl my-12 rounded-r-[3rem] shadow-inner">
                                {children}
                              </blockquote>
                            ),
                            table: ({ children }) => (
                              <div className="overflow-x-auto mb-12 rounded-[2.5rem] border-2 border-[var(--iron)] shadow-2xl shadow-black/5 bg-white mx-6">
                                <table className="min-w-full border-collapse">{children}</table>
                              </div>
                            ),
                            thead: ({ children }) => (
                              <thead className="bg-[var(--night)]">{children}</thead>
                            ),
                            th: ({ children }) => (
                              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.4em] text-white/50">
                                {children}
                              </th>
                            ),
                            td: ({ children }) => (
                              <td className="px-8 py-5 text-sm font-bold text-[var(--night)]/80 border-b border-[var(--iron)]/40">
                                {children}
                              </td>
                            ),
                            hr: () => <hr className="my-16 border-2 border-dashed border-[var(--iron)]/40 mx-20" />,
                          }}
                        >
                          {preprocessMarkdown(markdownContent)}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </CardContent>
                </Card>
             ) : (
                <div className="card p-32 flex flex-col items-center justify-center text-center space-y-12 border-dashed border-4 border-[var(--iron)]/40 grayscale opacity-40 bg-[var(--mist)]/30 rounded-[4rem] h-full min-h-[800px] select-none pointer-events-none">
                   <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center mx-auto border-2 border-[var(--iron)] shadow-inner">
                     <FileText className="w-16 h-16 text-[var(--steel)]" />
                   </div>
                   <div className="space-y-4">
                     <h3 className="text-3xl font-black font-poppins text-[var(--night)] uppercase tracking-tighter">Awaiting Logic Synthesis</h3>
                     <p className="text-[var(--steel)] max-w-sm mx-auto font-bold italic leading-relaxed">
                        Configure the draft mission parameters on the left to manifest high-fidelity strategic documentation here.
                     </p>
                   </div>
                   
                   <div className="w-full max-w-md pt-12 space-y-8 opacity-20">
                      <div className="h-12 bg-white rounded-2xl border-2 border-dashed border-[var(--iron)]"></div>
                      <div className="h-64 bg-white rounded-[3rem] border-2 border-dashed border-[var(--iron)]"></div>
                   </div>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  )
}
