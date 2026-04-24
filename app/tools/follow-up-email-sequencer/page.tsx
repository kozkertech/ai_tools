"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Mail, Sparkles, CheckCircle, XCircle, Copy, User, AtSign, Settings2, Trash2, ArrowRight, ChevronRight, Eye, Send, Target, ShieldCheck, Zap, MousePointer2 } from "lucide-react"

interface FormData {
  name: string
  email: string
  originalEmailContent: string
  emailType: string
  otherEmailType: string
  followUpGoal: string
  tone: string
  recipientName: string
  recipientRelationship: string
  followUpNumber: string
}

interface ParsedEmail {
  subject: string
  body: string
}

interface WebhookResponse {
  success?: boolean
  message?: string
  generatedEmail?: string
  output?: string
  [key: string]: any
}

export default function EmailGenerator() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    originalEmailContent: "",
    emailType: "",
    otherEmailType: "",
    followUpGoal: "",
    tone: "Professional",
    recipientName: "",
    recipientRelationship: "",
    followUpNumber: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<WebhookResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const emailTypes = [
    "Sales inquiry",
    "Meeting confirmation", 
    "Demo scheduling",
    "Partnership discussion",
    "Cold outreach",
    "Customer support",
    "Others",
  ]

  const tones = ["Professional", "Casual", "Urgent", "Friendly", "Formal", "Persuasive"]

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const parseEmailContent = (content: string): ParsedEmail => {
    const lines = content.split("\n")
    let subject = ""
    let body = ""
    
    const subjectLine = lines.find((line) => line.startsWith("Subject:"))
    if (subjectLine) {
      subject = subjectLine.replace("Subject:", "").trim()
    }

    const subjectIndex = lines.findIndex((line) => line.startsWith("Subject:"))
    if (subjectIndex !== -1) {
      let bodyStartIndex = subjectIndex + 1
      while (bodyStartIndex < lines.length && lines[bodyStartIndex].trim() === "") {
        bodyStartIndex++
      }
      if (bodyStartIndex < lines.length) {
        body = lines.slice(bodyStartIndex).join("\n").trim()
      }
    } else {
      body = content.trim()
    }

    return { subject, body }
  }

  const getEmailContent = (response: WebhookResponse): string => {
    if (Array.isArray(response) && response.length > 0 && response[0].output) {
      return response[0].output
    }
    if (response.output) {
      return response.output
    }
    if (response.generatedEmail) {
      return response.generatedEmail
    }
    return ""
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Linguistic buffer copy failed: ", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResponse(null)

    try {
      const submitData = {
        ...formData,
        emailType: formData.emailType === "Others" ? formData.otherEmailType : formData.emailType,
      }

      const res = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      if (!res.ok) {
        throw new Error(`Neural node synchronization failed: ${res.status}`)
      }

      const data = await res.json()
      setResponse(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Spectral connection failure in linguistic synthesis.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      originalEmailContent: "",
      emailType: "",
      otherEmailType: "",
      followUpGoal: "",
      tone: "Professional",
      recipientName: "",
      recipientRelationship: "",
      followUpNumber: "",
    })
    setResponse(null)
    setError(null)
  }

  const emailContent = response ? getEmailContent(response) : ""
  const parsedEmail = emailContent ? parseEmailContent(emailContent) : null

  return (
    <div className="min-h-screen bg-[var(--mist)] text-[var(--night)] transition-colors duration-300 pb-32">
      {/* Premium Sticky Header */}
      <div className="bg-[var(--cloud)]/60 backdrop-blur-2xl border-b border-[var(--iron)] pt-24 pb-8 fixed top-0 w-full z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#FF7435] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#FF7435]/30">
                <Send className="w-8 h-8 text-white" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-3xl font-black font-poppins text-[var(--night)] tracking-tighter uppercase leading-none mb-1">
                   Sequence <span className="text-[#FF7435]">Nexus</span>
                </h1>
                <Badge className="bg-[var(--night)] text-white border-none font-black px-3 py-1 rounded-lg text-[9px] uppercase tracking-widest opacity-80">v5.0 Multi-Chain Unit</Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block">
                  <div className="text-[9px] font-black uppercase tracking-widest text-[var(--steel)]">System Status</div>
                  <div className="text-xs font-black text-[var(--night)] uppercase">Synchronized</div>
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
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
          
          {/* Mission Deployment Form */}
          <div className="xl:col-span-5 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <Card className="card p-10 shadow-2xl shadow-black/5 border-2 border-[var(--iron)]/50">
              <CardHeader className="px-0 pt-0 pb-10 border-b-2 border-[var(--iron)]/40 mb-10">
                <div className="flex items-center gap-3">
                   <Settings2 className="w-6 h-6 text-[#FF7435]" />
                   <CardTitle className="text-2xl font-black font-poppins uppercase tracking-tighter">Mission Config</CardTitle>
                </div>
                <CardDescription className="font-bold text-[var(--steel)] italic uppercase tracking-widest text-[10px] mt-2">Initialize linguistic chain parameters.</CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-8">
                   <div className="flex items-center gap-3 text-[10px] font-black text-[#FF7435] uppercase tracking-[0.3em]">
                    <ShieldCheck className="w-4 h-4" /> Identity Vectors
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="field-label font-black">Lead Signal</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="input h-14"
                        placeholder="e.g. Alex"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="field-label font-black">Return Terminal</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="input h-14"
                        placeholder="alex@nexus.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-8 pt-10 border-t-2 border-[var(--iron)]/40">
                  <div className="flex items-center gap-3 text-[10px] font-black text-[#FF7435] uppercase tracking-[0.3em]">
                    <Zap className="w-4 h-4" /> Context Logic
                  </div>
                  <div className="space-y-3">
                    <Label className="field-label font-black">Previous Linguistic Stream</Label>
                    <Textarea
                      value={formData.originalEmailContent}
                      onChange={(e) => handleInputChange("originalEmailContent", e.target.value)}
                      className="input min-h-[140px] rounded-[2.5rem] pt-8"
                      placeholder="Input the core context or previous email chain..."
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="field-label font-black">Sequence Logic</Label>
                      <Select value={formData.emailType} onValueChange={(value) => handleInputChange("emailType", value)}>
                        <SelectTrigger className="input h-14 rounded-2xl">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {emailTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="field-label font-black">Tonal Protocol</Label>
                      <Select value={formData.tone} onValueChange={(value) => handleInputChange("tone", value)}>
                        <SelectTrigger className="input h-14 rounded-2xl">
                          <SelectValue placeholder="Select Frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          {tones.map((tone) => (
                            <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {formData.emailType === "Others" && (
                    <div className="pt-2 animate-in slide-in-from-top-4">
                      <Input
                        value={formData.otherEmailType}
                        onChange={(e) => handleInputChange("otherEmailType", e.target.value)}
                        className="input h-14"
                        placeholder="Specify Custom Protocol..."
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-8 pt-10 border-t-2 border-[var(--iron)]/40">
                  <div className="flex items-center gap-3 text-[10px] font-black text-[#FF7435] uppercase tracking-[0.3em]">
                    <Target className="w-4 h-4" /> Objective Parameters
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="field-label font-black text-xs uppercase tracking-widest">Recipient Identity</Label>
                      <Input
                        value={formData.recipientName}
                        onChange={(e) => handleInputChange("recipientName", e.target.value)}
                        className="input h-14"
                        placeholder="e.g. Sarah"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="field-label font-black text-xs uppercase tracking-widest">Environmental Status</Label>
                      <Input
                        value={formData.recipientRelationship}
                        onChange={(e) => handleInputChange("recipientRelationship", e.target.value)}
                        className="input h-14"
                        placeholder="e.g. Sales Prospect"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="field-label font-black text-xs uppercase tracking-widest">Conversion Goal</Label>
                      <Input
                        value={formData.followUpGoal}
                        onChange={(e) => handleInputChange("followUpGoal", e.target.value)}
                        className="input h-14"
                        placeholder="e.g. Schedule Demo"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="field-label font-black text-xs uppercase tracking-widest">Sequence Index</Label>
                      <Input
                        value={formData.followUpNumber}
                        onChange={(e) => handleInputChange("followUpNumber", e.target.value)}
                        className="input h-14"
                        placeholder="e.g. 1st Follow-up"
                        required
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="rounded-2xl border-2 animate-in shake-in">
                    <XCircle className="h-5 w-5" />
                    <AlertDescription className="font-black text-[10px] uppercase tracking-widest">{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full h-20 text-xs font-black uppercase tracking-[0.3em] rounded-full shadow-2xl shadow-[#FF7435]/30 group"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      Execute Sequence Logic
                      <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* High-Fidelity Sequence Preview */}
          <div className="xl:col-span-12 xl:col-span-7 space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
            {parsedEmail ? (
              <div className="space-y-10">
                <div className="flex flex-wrap items-center justify-between gap-8 px-4">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border-2 border-emerald-500/20">
                      <Eye className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black font-poppins text-[var(--night)] uppercase tracking-tighter">Draft Inspection</h2>
                        <p className="text-[10px] font-black text-[var(--steel)] uppercase tracking-[0.3em] opacity-60">High-Probability Conversion Chain</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => copyToClipboard(emailContent)}
                    className="btn-primary h-14 px-10 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-[#FF7435]/30 group"
                  >
                    {copied ? (
                      <CheckCircle className="w-5 h-5 mr-3" />
                    ) : (
                      <Copy className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    )}
                    {copied ? "Synthesized" : "Export Payload"}
                  </Button>
                </div>

                <div className="card p-0 overflow-hidden shadow-2xl border-2 border-[var(--iron)]/80 bg-white">
                  {/* Digital Signature / Header */}
                  <div className="bg-[var(--night)] text-white p-10 md:p-14 mb-0">
                    <div className="space-y-8">
                       <div className="flex items-center gap-6 pb-6 border-b border-white/10">
                          <div className="w-14 h-14 rounded-full bg-[#FF7435] flex items-center justify-center text-white font-black text-xl shadow-2xl">
                             {formData.name.charAt(0) || "U"}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-white font-black font-poppins text-lg tracking-tight">{formData.name || "Signal Lead"}</span>
                             <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Terminated: {formData.email || "email@nexus.com"}</span>
                          </div>
                          <div className="ml-auto hidden md:block">
                             <Badge className="bg-white/10 text-white/60 border-none font-black text-[9px] px-3 h-6 uppercase tracking-widest">SECURE OUTBOUND</Badge>
                          </div>
                       </div>
                       
                       <div className="space-y-6">
                          <div className="flex items-baseline gap-6">
                             <span className="text-white/30 font-black text-[10px] uppercase tracking-[0.4em] min-w-[100px]">Subject</span>
                             <p className="text-white font-black text-xl font-poppins tracking-tight leading-tight">
                               {parsedEmail.subject || "(Awaiting Subject Logic)"}
                             </p>
                          </div>
                          
                          <div className="flex items-center gap-6">
                             <span className="text-white/30 font-black text-[10px] uppercase tracking-[0.4em] min-w-[100px]">Recpt.</span>
                             <div className="flex items-center gap-3">
                                <Badge className="bg-[#FF7435] text-white border-none font-black text-[10px] h-6 px-4 uppercase">
                                   {formData.recipientName || "Target"}
                                </Badge>
                                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">({formData.recipientRelationship})</span>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Linguistic Synthesis / Email Body */}
                  <div className="p-12 md:p-24 bg-white min-h-[600px] relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF7435]/5 rounded-bl-[10rem] pointer-events-none -z-10"></div>
                    <div className="prose prose-lg max-w-none text-[var(--steel)] font-medium leading-relaxed pb-20 border-b-2 border-dashed border-[var(--iron)]/40">
                      <p className="whitespace-pre-wrap font-inter">
                        {parsedEmail.body}
                      </p>
                    </div>
                    
                    {/* Meta diagnostic footer */}
                    <div className="pt-10 flex items-center justify-between">
                       <div className="flex items-center gap-6">
                          <div className="flex flex-col">
                             <span className="text-[9px] font-black uppercase tracking-widest text-[var(--steel)] mb-1">Tone Calibration</span>
                             <Badge className="bg-[var(--mist)] text-[var(--night)] border-2 border-[var(--iron)] font-black text-[10px] uppercase">{formData.tone}</Badge>
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[9px] font-black uppercase tracking-widest text-[var(--steel)] mb-1">Sequence Index</span>
                             <Badge className="bg-[var(--night)] text-white border-none font-black text-[10px] uppercase">{formData.followUpNumber}</Badge>
                          </div>
                       </div>
                       <div className="text-right">
                          <span className="text-[9px] font-black uppercase tracking-widest text-[var(--steel)] block mb-1">Neural Goal</span>
                          <span className="text-xs font-black text-[var(--night)] uppercase italic">"Goal: {formData.followUpGoal}"</span>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 py-8 bg-[var(--cloud)]/50 rounded-[3rem] border border-[var(--iron)]/50 mx-4">
                   <ShieldCheck className="w-6 h-6 text-emerald-500" />
                   <p className="text-sm font-black text-[var(--steel)] uppercase tracking-widest">Verified for professional outbound transmission.</p>
                </div>
              </div>
            ) : (
              <div className="card p-32 flex flex-col items-center justify-center text-center space-y-12 border-dashed border-4 border-[var(--iron)]/40 grayscale opacity-40 bg-[var(--mist)]/30 rounded-[3rem] h-full min-h-[700px]">
                <div className="relative">
                   <div className="absolute inset-0 bg-[#FF7435]/10 rounded-[3rem] scale-125 blur-2xl"></div>
                   <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center mx-auto border-2 border-[var(--iron)] shadow-inner relative z-10">
                     <AtSign className="w-16 h-16 text-[var(--steel)]" />
                   </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black font-poppins text-[var(--night)] uppercase tracking-tighter">Draft Terminal</h3>
                  <p className="text-[var(--steel)] max-w-sm mx-auto font-bold italic leading-relaxed">
                    Initialize your sequence parameters to visualize the linguistic chain in a professional high-fidelity mail container.
                  </p>
                </div>
                
                <div className="w-full max-w-md pt-12 space-y-8 relative z-10 opacity-30 select-none pointer-events-none flex flex-col items-center">
                   <div className="h-20 bg-white rounded-3xl w-full border-2 border-dashed border-[var(--iron)]"></div>
                   <div className="h-16 bg-white rounded-full w-2/3 border-2 border-dashed border-[var(--iron)] text-center flex items-center justify-center">*** *** ***</div>
                   <div className="h-40 bg-white rounded-[2rem] w-full border-2 border-dashed border-[var(--iron)]"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
