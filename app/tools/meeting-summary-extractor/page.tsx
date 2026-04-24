"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, FileText, Sparkles, MessageSquare, ListChecks, ArrowRight, User, Mail, Zap } from "lucide-react"
import { ContentLoadingScreen } from "@/components/loading-screen"

interface FormData {
  name: string
  email: string
  transcript: string
}

interface WebhookResponse {
  output?: string
  [key: string]: any
}

const parseMarkdown = (text: string): string => {
  return (
    text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>")
      .replace(/^- (.*$)/gim, "<li>$1</li>")
      .replace(/(<li>.*<\/li>)(\s*<br>\s*<li>.*<\/li>)*/g, (match) => {
        const items = match.replace(/<br>\s*/g, "").split("</li>").filter((item) => item.trim())
        return "<ul>" + items.map((item) => item + "</li>").join("") + "</ul>"
      })
  )
}

export default function MeetingSummaryExtractor() {
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", transcript: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string; data?: WebhookResponse } | null>(null)

  if (isLoading) return <ContentLoadingScreen />

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/meeting-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const responseData: WebhookResponse = await response.json()
        setMessage({ type: "success", text: "Transcript analyzed with specialized AI models.", data: responseData })
        setFormData({ name: "", email: "", transcript: "" })
      } else {
        const errorData = await response.text()
        throw new Error(errorData || "Failed to process transcript")
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `Analysis failed: ${error instanceof Error ? error.message : "Internal system error"}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--mist)] text-[var(--night)] transition-colors duration-300 pb-20">
      {/* Header */}
      <div className="border-b border-[var(--iron)] bg-[var(--cloud)]/50 backdrop-blur-md pt-24 pb-8 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto max-w-5xl px-6">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FF7435] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF7435]/20">
                 <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                 <h1 className="text-2xl font-black font-poppins text-[var(--night)] tracking-tight uppercase">Meeting Intelligence</h1>
                 <p className="text-sm font-medium text-[var(--steel)]">Advanced extraction of action items, summaries, and key insights.</p>
              </div>
           </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Input Area */}
          <div className="lg:col-span-12 xl:col-span-5">
            <Card className="card border-2 border-[var(--iron)]/50 shadow-none">
              <CardHeader className="bg-[var(--cloud)]/20 border-b border-[var(--iron)]/50 px-8 py-6">
                 <CardTitle className="text-xl font-black font-poppins flex items-center gap-3">
                    <Zap className="w-5 h-5 text-[#FF7435]" />
                    Transcript Data
                 </CardTitle>
                 <CardDescription className="text-xs font-bold text-[var(--steel)] uppercase tracking-widest italic">Phase 01: Capture</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <Label className="field-label flex items-center gap-2">
                          <User className="w-3 h-3 text-[var(--night)]" /> Full Name
                       </Label>
                       <Input
                         name="name"
                         value={formData.name}
                         onChange={handleInputChange}
                         className="input"
                         placeholder="Jane Smith"
                         required
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="field-label flex items-center gap-2">
                          <Mail className="w-3 h-3 text-[var(--night)]" /> Email Address
                       </Label>
                       <Input
                         name="email"
                         type="email"
                         value={formData.email}
                         onChange={handleInputChange}
                         className="input"
                         placeholder="jane@corporate.com"
                         required
                       />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="field-label flex items-center gap-2">
                       <FileText className="w-3 h-3 text-[var(--night)]" /> Full Transcript
                    </Label>
                    <Textarea
                      name="transcript"
                      value={formData.transcript}
                      onChange={handleInputChange}
                      className="input min-h-[300px] rounded-[2.5rem] pt-8"
                      placeholder="Paste meeting raw text or notes here..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full h-14 rounded-full font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-[#FF7435]/20 group"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Start Extraction <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>

                {message?.type === "error" && (
                  <Alert variant="destructive" className="mt-8 rounded-2xl border-2">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription className="font-bold text-xs">{message.text}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-12 xl:col-span-7">
            {message?.type === "success" && message.data?.output ? (
              <div className="animate-in slide-in-from-right-8 duration-700">
                <Card className="card border-2 border-[var(--iron)]">
                  <CardHeader className="bg-[var(--night)] text-white p-8">
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Meeting Synthesis</span>
                        <Badge className="bg-emerald-500 text-white border-none text-[10px] h-5">Verified</Badge>
                     </div>
                     <CardTitle className="text-2xl font-black font-poppins flex items-center gap-3">
                        <ListChecks className="w-6 h-6 text-emerald-400" />
                        Executive Summary
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-10">
                    <div 
                      className="prose prose-stone max-w-none 
                      [&>ul]:space-y-4 [&>ul]:list-none [&>ul]:pl-0 
                      [&>ul>li]:p-4 [&>ul>li]:bg-[var(--mist)] [&>ul>li]:border-2 [&>ul>li]:border-[var(--iron)]/40 [&>ul>li]:rounded-2xl [&>ul>li]:font-medium [&>ul>li]:text-sm [&>ul>li]:text-[var(--night)]
                      [&>strong]:text-[#FF7435] [&>strong]:font-black
                      leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: parseMarkdown(message.data.output) }}
                    />
                    
                    <div className="mt-10 pt-10 border-t border-[var(--iron)]/50 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                             <CheckCircle className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest text-[var(--steel)]">Analysis Validated</span>
                       </div>
                       <Button variant="ghost" onClick={() => window.print()} className="text-[10px] font-black uppercase tracking-widest hover:text-[#FF7435]">
                          Download Report
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : !isLoading && (
              <div className="h-full flex flex-col items-center justify-center p-12 bg-[var(--cloud)]/30 border-4 border-dashed border-[var(--iron)] rounded-[3rem] text-center opacity-60">
                 <div className="w-20 h-20 bg-[var(--iron)]/30 rounded-full flex items-center justify-center mb-6">
                    <Sparkles className="w-10 h-10 text-[var(--steel)]" />
                 </div>
                 <h3 className="text-lg font-black font-poppins text-[var(--night)]">Intelligent Analysis Awaits</h3>
                 <p className="text-sm font-medium text-[var(--steel)] max-w-xs mt-2">Paste your meeting raw transcript to witness the AI synthesis. We extract key decisions and next steps.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
