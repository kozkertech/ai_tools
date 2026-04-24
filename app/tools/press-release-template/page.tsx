"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Send, CheckCircle, XCircle, FileText, Copy, Download, Sparkles, Globe, Megaphone, Newspaper, UserCheck, Mail, Pin, Calendar, ArrowRight, ShieldCheck, Zap, Activity } from 'lucide-react'

interface FormData {
  eventNews: string
  companyName: string
  industry: string
  dateOfRelease: string
  location: string
  boilerplate: string
  mediaContactName: string
  mediaContactEmail: string
}

interface ApiResponse {
  success: boolean
  message?: string
  pressRelease?: string
  webhookResponse?: any
  error?: string
}

export default function PressReleaseGenerator() {
  const [formData, setFormData] = useState<FormData>({
    eventNews: "",
    companyName: "",
    industry: "",
    dateOfRelease: "",
    location: "",
    boilerplate: "",
    mediaContactName: "",
    mediaContactEmail: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [showResponse, setShowResponse] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResponse(null)
    setShowResponse(false)

    try {
      const res = await fetch("/api/generate-press-release", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      setResponse(data)
      setShowResponse(true)
    } catch (error) {
      setResponse({
        success: false,
        error: "Critical transmission failure. News cycle synchronization lost.",
      })
      setShowResponse(true)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      eventNews: "",
      companyName: "",
      industry: "",
      dateOfRelease: "",
      location: "",
      boilerplate: "",
      mediaContactName: "",
      mediaContactEmail: "",
    })
    setResponse(null)
    setShowResponse(false)
  }

  const parseN8nResponse = (webhookResponse: any): string => {
    try {
      if (typeof webhookResponse === "string") {
        const n8nMatch = webhookResponse.match(/<n8n-output>\s*(.*?)\s*<\/n8n-output>/s)
        if (n8nMatch) {
          try {
            const jsonContent = JSON.parse(n8nMatch[1])
            if (Array.isArray(jsonContent) && jsonContent[0]?.output) {
              return extractMarkdownContent(jsonContent[0].output)
            }
          } catch { }
        }
        return webhookResponse
      }

      if (Array.isArray(webhookResponse) && webhookResponse[0]?.output) {
        return extractMarkdownContent(webhookResponse[0].output)
      }

      if (typeof webhookResponse === "object" && webhookResponse !== null) {
        if (webhookResponse.output) return extractMarkdownContent(webhookResponse.output)
        if (webhookResponse.pressRelease) return extractMarkdownContent(webhookResponse.pressRelease)
        if (webhookResponse.content) return extractMarkdownContent(webhookResponse.content)
        if (webhookResponse.result) return extractMarkdownContent(webhookResponse.result)
        if (webhookResponse.message) return extractMarkdownContent(webhookResponse.message)
      }

      return JSON.stringify(webhookResponse, null, 2)
    } catch (error) {
      console.error("Linguistic parsing error:", error)
      return String(webhookResponse)
    }
  }

  const extractMarkdownContent = (content: string): string => {
    const markdownMatch = content.match(/```markdown\s*([\s\S]*?)\s*```/)
    if (markdownMatch) {
      return markdownMatch[1].trim()
    }
    return content
  }

  const renderMarkdownContent = (content: string) => {
    const lines = content.split('\n')
    const elements: React.ReactNode[] = []
    let currentParagraph: string[] = []

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const paragraphText = currentParagraph.join(' ').trim()
        if (paragraphText) {
          elements.push(
            <p key={elements.length} className="text-[var(--night)]/80 leading-relaxed mb-6 font-inter text-lg">
              {renderInlineFormatting(paragraphText)}
            </p>
          )
        }
        currentParagraph = []
      }
    }

    lines.forEach((line, index) => {
      const trimmedLine = line.trim()
      
      if (!trimmedLine) {
        flushParagraph()
        return
      }

      if (trimmedLine.startsWith('# ')) {
        flushParagraph()
        const headingText = trimmedLine.substring(2).trim()
        elements.push(
          <h1 key={elements.length} className="text-4xl font-black text-[var(--night)] mb-10 font-poppins tracking-tighter leading-tight border-b-4 border-[#FF7435]/20 pb-6 uppercase">
            {renderInlineFormatting(headingText)}
          </h1>
        )
      } else if (trimmedLine.startsWith('## ')) {
        flushParagraph()
        const headingText = trimmedLine.substring(3).trim()
        elements.push(
          <h2 key={elements.length} className="text-2xl font-black text-[var(--night)] mb-6 mt-10 font-poppins tracking-tight uppercase">
            {renderInlineFormatting(headingText)}
          </h2>
        )
      } else if (trimmedLine.startsWith('### ')) {
        flushParagraph()
        const headingText = trimmedLine.substring(4).trim()
        elements.push(
          <h3 key={elements.length} className="text-xl font-black text-[var(--night)] mb-4 mt-8 font-poppins opacity-80 uppercase tracking-widest">
            {renderInlineFormatting(headingText)}
          </h3>
        )
      } else {
        currentParagraph.push(trimmedLine)
      }
    })

    flushParagraph()
    return elements
  }

  const renderInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|__.*?__)/g)
    return parts.map((part, index) => {
      if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
        return (
          <strong key={index} className="font-black text-[var(--night)] bg-[#FF7435]/5 px-1 px-1 rounded">
            {part.slice(2, -2)}
          </strong>
        )
      }
      return part
    })
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Vector copy error: ", err)
    }
  }

  const downloadAsText = (content: string, filename: string = "press-release.txt") => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getParsedContent = () => {
    if (!response?.webhookResponse) return ""
    return parseN8nResponse(response.webhookResponse)
  }

  return (
    <div className="min-h-screen bg-[var(--mist)] text-[var(--night)] transition-colors duration-300 pb-32">
      {/* Premium Sticky Identity Header */}
      <div className="bg-[var(--cloud)]/60 backdrop-blur-2xl border-b border-[var(--iron)] pt-24 pb-8 fixed top-0 w-full z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#FF7435] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#FF7435]/30">
                <Newspaper className="w-8 h-8 text-white" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-3xl font-black font-poppins text-[var(--night)] tracking-tighter uppercase leading-none mb-1">
                   Media <span className="text-[#FF7435]">Nexus</span>
                </h1>
                <Badge className="bg-[var(--night)] text-white border-none font-black px-3 py-1 rounded-lg text-[9px] uppercase tracking-widest opacity-80">v4.2 News Cycle Engine</Badge>
              </div>
            </div>
            <div className="flex items-center gap-6">
               <div className="text-right hidden sm:block">
                  <div className="text-[9px] font-black uppercase tracking-widest text-[var(--steel)]">Global Status</div>
                  <div className="text-xs font-black text-[var(--night)] uppercase flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                     Broadcasting
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-[164px] max-w-7xl mx-auto px-6 lg:px-10 mt-16 lg:mt-24">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
          
          {/* Mission Configuration Panel */}
          <div className="xl:col-span-5 space-y-10 animate-in fade-in slide-in-from-left-8 duration-700">
            <Card className="card p-10 shadow-2xl shadow-black/5 border-2 border-[var(--iron)]/50">
              <CardHeader className="px-0 pt-0 pb-10 border-b-2 border-[var(--iron)]/40 mb-10">
                <div className="flex items-center gap-3">
                   <Megaphone className="w-6 h-6 text-[#FF7435]" />
                   <CardTitle className="text-2xl font-black font-poppins uppercase tracking-tighter">News Blueprint</CardTitle>
                </div>
                <CardDescription className="font-bold text-[var(--steel)] italic uppercase tracking-widest text-[10px] mt-2">Initialize dissemination protocol.</CardDescription>
              </CardHeader>
              
              <CardContent className="px-0 pb-0">
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="space-y-4">
                    <Label className="field-label font-black text-xs uppercase tracking-widest flex items-center gap-2">
                       <Zap className="w-3.5 h-3.5 text-[#FF7435]" /> Primary Event Narrative *
                    </Label>
                    <Textarea
                      name="eventNews"
                      value={formData.eventNews}
                      onChange={handleInputChange}
                      placeholder="Describe the core news vector..."
                      required
                      className="min-h-[140px] input rounded-[2.5rem] pt-8"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t-2 border-[var(--iron)]/40">
                    <div className="space-y-4">
                      <Label className="field-label font-black text-xs uppercase tracking-widest">Entity Name *</Label>
                      <Input
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Corporate Brand..."
                        required
                        className="input h-14"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-4">
                      <Label className="field-label font-black text-xs uppercase tracking-widest">Sector Cluster *</Label>
                      <Input
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        placeholder="e.g. AI, Biotech..."
                        required
                        className="input h-14"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label className="field-label font-black text-xs uppercase tracking-widest">Release Date *</Label>
                      <Input
                        name="dateOfRelease"
                        type="date"
                        value={formData.dateOfRelease}
                        onChange={handleInputChange}
                        required
                        className="input h-14"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-4">
                      <Label className="field-label font-black text-xs uppercase tracking-widest">Geographical Hub *</Label>
                      <div className="relative">
                         <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF7435]" />
                         <Input
                           name="location"
                           value={formData.location}
                           onChange={handleInputChange}
                           placeholder="City, HQ..."
                           required
                           className="input h-14 pl-12"
                           disabled={isLoading}
                         />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-10 border-t-2 border-[var(--iron)]/40">
                    <Label className="field-label font-black text-xs uppercase tracking-widest flex items-center gap-2">
                       <Activity className="w-3.5 h-3.5 text-[#FF7435]" /> Narrative Boilerplate *
                    </Label>
                    <Textarea
                      name="boilerplate"
                      value={formData.boilerplate}
                      onChange={handleInputChange}
                      placeholder="Detailed corporate description protocol..."
                      required
                      className="min-h-[100px] input rounded-[2.5rem] pt-8"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label className="field-label font-black text-xs uppercase tracking-widest">Contact Identity *</Label>
                      <div className="relative">
                         <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF7435]" />
                         <Input
                           name="mediaContactName"
                           value={formData.mediaContactName}
                           onChange={handleInputChange}
                           placeholder="PR Lead Name..."
                           required
                           className="input h-14 pl-12"
                           disabled={isLoading}
                         />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label className="field-label font-black text-xs uppercase tracking-widest">Contact Terminal *</Label>
                      <div className="relative">
                         <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF7435]" />
                         <Input
                           name="mediaContactEmail"
                           type="email"
                           value={formData.mediaContactEmail}
                           onChange={handleInputChange}
                           placeholder="pr@brand.io"
                           required
                           className="input h-14 pl-12"
                           disabled={isLoading}
                         />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-8">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary flex-1 h-20 text-xs font-black uppercase tracking-[0.3em] rounded-full shadow-2xl shadow-[#FF7435]/30 group"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                          Synthesizing...
                        </>
                      ) : (
                        <>
                          Execute Media Broadcast
                          <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      className="px-8 h-20 border-2 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all border-[var(--iron)]"
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Newsroom Manifestation Panel */}
          <div className="xl:col-span-7 space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
            {showResponse && response ? (
              <Card className="card p-0 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border-2 border-[var(--iron)]/60 overflow-hidden bg-white">
                <CardHeader className={`p-12 border-b-2 relative overflow-hidden ${response.success ? "bg-emerald-500 text-white border-emerald-400" : "bg-red-500 text-white border-red-400"}`}>
                  {/* Atmospheric Background Logo */}
                  <Newspaper className="absolute top-0 right-0 w-64 h-64 text-white/10 -rotate-12 translate-x-12 -translate-y-6 pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                       <ShieldCheck className="w-6 h-6 text-white/80" />
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80">Cycle State: Synchronized</span>
                    </div>
                    <CardTitle className="text-4xl font-black font-poppins tracking-tighter uppercase leading-none">
                      {response.success ? "Media Payload Ready" : "Protocol Breach Detected"}
                    </CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent className="p-12 md:p-16">
                  {response.success ? (
                    <div className="space-y-12">
                      {response.message && (
                        <div className="p-6 bg-emerald-50 border-1 border-emerald-100 rounded-2xl flex items-center gap-4">
                           <Activity className="w-5 h-5 text-emerald-600 animate-pulse" />
                           <p className="text-emerald-900 font-bold text-xs uppercase tracking-widest">{response.message}</p>
                        </div>
                      )}

                      {response.webhookResponse && (
                        <div className="space-y-10">
                          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10 border-b-2 border-[var(--iron)]/40">
                            <div>
                               <h3 className="text-2xl font-black font-poppins text-[var(--night)] uppercase tracking-tighter">
                                 Linguistic Artifact
                               </h3>
                               <p className="text-[10px] font-black text-[var(--steel)] uppercase tracking-[0.3em] mt-1">High-Fidelity Press Release</p>
                            </div>
                            <div className="flex gap-4">
                              <Button
                                onClick={() => copyToClipboard(getParsedContent())}
                                variant="outline"
                                className="h-14 px-8 border-2 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#FF7435] hover:text-white hover:border-[#FF7435] transition-all group"
                              >
                                {copied ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-3 animate-in zoom-in" />
                                    Synced
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
                                    Copy Vector
                                  </>
                                )}
                              </Button>
                              <Button
                                onClick={() => downloadAsText(getParsedContent(), `pr-${formData.companyName.toLowerCase().replace(/\s+/g, '-')}.txt`)}
                                variant="outline"
                                className="h-14 px-8 border-2 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[var(--night)] hover:text-white hover:border-[var(--night)] transition-all group"
                              >
                                <Download className="h-4 w-4 mr-3 group-hover:translate-y-0.5 transition-transform" />
                                Export .txt
                              </Button>
                            </div>
                          </div>
                          
                          <div className="bg-[var(--mist)]/40 rounded-[3rem] p-10 md:p-16 border-2 border-[var(--iron)]/40 relative shadow-inner group/content">
                             {/* Floating indicator */}
                             <div className="absolute top-10 right-10 flex items-center gap-2 opacity-20 group-hover/content:opacity-60 transition-opacity">
                                <Activity className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Read Density: Optimal</span>
                             </div>
                             
                             <div className="prose prose-zinc prose-lg max-w-none prose-headings:font-black prose-headings:font-poppins prose-p:font-inter prose-strong:text-[#FF7435]">
                                {renderMarkdownContent(getParsedContent())}
                             </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-10 bg-red-50 border-2 border-red-100 rounded-[2.5rem] text-center space-y-6">
                       <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-red-500/20">
                          <XCircle className="w-10 h-10 text-white" />
                       </div>
                       <div>
                         <h4 className="text-xl font-black text-red-900 uppercase font-poppins">Broadcast Interrupted</h4>
                         <p className="text-red-700/70 font-bold text-xs uppercase tracking-widest mt-2">
                           {response.error || "A synchronized news sequence could not be established."}
                         </p>
                       </div>
                       <Button onClick={() => setShowResponse(false)} variant="outline" className="h-12 px-8 border-2 border-red-200 text-red-700 font-black uppercase text-[10px] tracking-widest hover:bg-red-50 rounded-xl">Re-Initiate Protocol</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              /* Newsroom Instructions Display */
              <Card className="card p-0 shadow-2xl shadow-black/5 border-2 border-[var(--iron)]/40 bg-white overflow-hidden h-full min-h-[800px]">
                <CardHeader className="bg-[var(--night)] p-12 relative">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[4rem]"></div>
                   <div className="flex items-center gap-3 mb-4">
                      <Megaphone className="w-5 h-5 text-[#FF7435]" />
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Newsroom Manual</span>
                   </div>
                   <CardTitle className="text-3xl font-black font-poppins text-white uppercase tracking-tighter">Dissemination Manual</CardTitle>
                </CardHeader>
                <CardContent className="p-12 space-y-12">
                  <div className="grid gap-8">
                    {[
                      { step: 1, title: "Narrative Input", desc: "Parameterize your core event details and corporate identity vectors." },
                      { step: 2, title: "Neural Synthesis", desc: "Our high-density logic engines structure the release into professional news format." },
                      { step: 3, title: "Artifact Review", desc: "Validate the linguistic payload and ensure all key mission targets are addressed." },
                      { step: 4, title: "Media Export", desc: "Synchronize the final artifact with your media dissemination terminals." }
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-8 group">
                        <div className="w-12 h-12 bg-[var(--mist)] border-2 border-[var(--iron)] rounded-2xl flex items-center justify-center font-black text-xl group-hover:bg-[#FF7435] group-hover:text-white group-hover:border-[#FF7435] transition-all shrink-0">
                          {item.step}
                        </div>
                        <div className="pt-1">
                          <h4 className="text-lg font-black font-poppins uppercase text-[var(--night)] tracking-tight group-hover:text-[#FF7435] transition-colors">{item.title}</h4>
                          <p className="text-[var(--steel)] font-bold text-sm leading-relaxed mt-1 opacity-80">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-12 border-t-2 border-[var(--iron)]/20 text-center space-y-8 grayscale opacity-30 select-none">
                     <FileText className="w-24 h-24 mx-auto text-[var(--steel)] opacity-20" />
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--steel)] max-w-xs mx-auto">Awaiting payload initialization to manifest news artifact.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
