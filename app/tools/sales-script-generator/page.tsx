"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import {
  Loader2,
  Sparkles,
  Target,
  Plus,
  Trash2,
  Copy,
  Check,
  Download,
  FileText,
  RefreshCw,
  ShoppingCart,
  Users,
  Settings,
  ArrowRight,
  ShieldCheck,
  Zap,
  Briefcase,
  Mail,
  UserCheck,
  LayoutDashboard,
  Coins
} from "lucide-react"

// Types
export interface FormData {
  name: string
  email: string
  productName: string
  targetAudience: string
  keyBenefits: string[]
  callToAction: string
  tone: string
  scriptLength: string
  industry: string
  priceRange: string
}

export interface ScriptResponse {
  script: string
  webhookResponse?: any
}

// FormattedOutput Component
interface FormattedOutputProps {
  content: string
}

function FormattedOutput({ content }: FormattedOutputProps) {
  const parseContent = (text: string) => {
    let cleanText = text
      .replace(/<n8n-output>|<\/n8n-output>/g, "")
      .replace(/^\[|\]$/g, "")
      .trim()

    if (cleanText.startsWith("{") && cleanText.endsWith("}")) {
      cleanText = cleanText.slice(1, -1).trim()
    }

    cleanText = cleanText.replace(/^"?text"?\s*:\s*"?/, "").replace(/"$/, "")
    cleanText = cleanText.replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\\\/g, "\\").replace(/\\'/g, "'")

    const lines = cleanText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && line !== '""')

    return lines
      .map((line, index) => {
        if (line.match(/^\*\*[^*:]+\*\*$/)) {
          const heading = line.replace(/\*\*/g, "")
          return (
            <h2 key={index} className="text-2xl font-black font-poppins text-[var(--night)] tracking-tighter uppercase mb-6 mt-12 first:mt-0 border-b-4 border-[#FF7435] pb-4 inline-block">
              {heading}
            </h2>
          )
        }

        if (line.match(/^\*\*[^*]+:\*\*$/)) {
          const heading = line.replace(/\*\*/g, "").replace(":", "")
          return (
            <h3 key={index} className="text-lg font-black font-poppins text-[var(--night)] tracking-tighter uppercase mb-4 mt-8 flex items-center gap-3">
              <div className="h-6 w-1.5 bg-[#FF7435] rounded-full"></div>
              {heading}:
            </h3>
          )
        }

        if (line.match(/^\*".*"\*$/)) {
          const text = line.replace(/^\*"|"\*$/g, "")
          return (
            <div
              key={index}
              className="text-xl font-black font-poppins text-[var(--night)] italic mb-8 pl-10 py-10 pr-10 border-l-8 border-[#FF7435] bg-[var(--mist)] rounded-r-[3rem] shadow-inner relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF7435]/5 rounded-bl-full"></div>
              "{text}"
            </div>
          )
        }

        if (line.startsWith("✔")) {
          const text = line.replace("✔", "").trim()
          return (
            <div key={index} className="flex items-start gap-4 mb-4 group px-4">
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center mt-1 group-hover:scale-110 transition-transform shrink-0">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-sm font-bold text-[var(--night)]/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInlineText(text) }} />
            </div>
          )
        }

        if (line.startsWith("→")) {
          const text = line.replace("→", "").trim()
          return (
            <div key={index} className="flex items-start gap-4 mb-4 ml-8 group px-4">
              <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center mt-1 group-hover:scale-110 transition-transform shrink-0">
                <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-sm font-bold text-[var(--night)]/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInlineText(text) }} />
            </div>
          )
        }

        if (line && !line.startsWith("*") && !line.startsWith("✔") && !line.startsWith("→")) {
          return (
            <p
              key={index}
              className="text-sm font-bold text-[var(--night)]/70 leading-loose mb-6 italic px-4"
              dangerouslySetInnerHTML={{ __html: formatInlineText(line) }}
            />
          )
        }

        return null
      })
      .filter(Boolean)
  }

  const formatInlineText = (text: string) => {
    return (
      text
        .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-black text-[var(--night)] bg-[var(--mist)] px-1.5 rounded-md border border-[var(--iron)]/40">$1</strong>')
        .replace(/(?<!")(\*)([^*"]+)(\*)(?!")/g, '<em class="italic opacity-80">$2</em>')
        .replace(/\\(.)/g, "$1")
    )
  }

  return <div className="space-y-2 text-left">{parseContent(content)}</div>
}

// Form Steps
const STEPS = [
  { id: 1, title: "Product Blueprint", description: "Identity & Core Metrics", icon: ShoppingCart },
  { id: 2, title: "Target Analysis", description: "Audience & Resonance", icon: Users },
  { id: 3, title: "Script Protocol", description: "Benefits & Triggers", icon: Settings },
]

export default function SalesScriptGenerator() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<ScriptResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    name: "", email: "", productName: "", targetAudience: "", keyBenefits: [""], callToAction: "", tone: "persuasive", scriptLength: "medium", industry: "", priceRange: "",
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateStep = (step: number) => {
    const newErrors: Partial<FormData> = {}
    if (step === 1) {
      if (!formData.name) newErrors.name = "Identity required."
      if (!formData.email) newErrors.email = "Terminal email required."
      if (!formData.productName) newErrors.productName = "Product designation required."
    } else if (step === 2) {
      if (!formData.targetAudience) newErrors.targetAudience = "Audience vector required."
    } else if (step === 3) {
      if (!formData.callToAction) newErrors.callToAction = "Mission directive required."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length))
    }
  }

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(currentStep)) return

    setIsLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/sales-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error(`Logical breach in script synthesis: ${res.status}`)

      const result = await res.json()
      let scriptContent = ""
      if (Array.isArray(result) && result.length > 0) {
        scriptContent = typeof result[0] === "string" ? result[0] : JSON.stringify(result[0])
      } else if (result.script) {
        scriptContent = result.script
      } else if (result.generatedScript) {
        scriptContent = result.generatedScript
      } else {
        scriptContent = JSON.stringify(result, null, 2)
      }

      setResponse({ script: scriptContent, webhookResponse: result })
    } catch (err) {
      setError(err instanceof Error ? err.message : "A critical fault occurred during linguistic synthesis.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (!response) return
    try {
      const plainText = response.script.replace(/<[^>]*>/g, "").replace(/\\n/g, "\n")
      await navigator.clipboard.writeText(plainText)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy node: ", err)
    }
  }

  const downloadText = () => {
    if (!response) return
    let textContent = `SALES SCRIPT MANIFEST\n${"=".repeat(30)}\n\n`
    textContent += `PROJECT: ${formData.productName}\n`
    textContent += `AUDIENCE: ${formData.targetAudience}\n`
    textContent += `TONE: ${formData.tone}\n\n`
    textContent += `MANIFEST:\n${"-".repeat(10)}\n`
    textContent += response.script.replace(/<[^>]*>/g, "").replace(/\\n/g, "\n").replace(/\*\*(.*?)\*\*/g, "$1")
    
    const dataUri = "data:text/plain;charset=utf-8," + encodeURIComponent(textContent)
    const link = document.createElement("a")
    link.setAttribute("href", dataUri)
    link.setAttribute("download", `script-${formData.productName.toLowerCase().replace(/\s+/g, "-")}.txt`)
    link.click()
  }

  const resetGenerator = () => {
    setResponse(null)
    setCurrentStep(1)
    setFormData({
       name: "", email: "", productName: "", targetAudience: "", keyBenefits: [""], callToAction: "", tone: "persuasive", scriptLength: "medium", industry: "", priceRange: "",
    })
  }

  return (
    <div className="min-h-screen bg-[var(--mist)] text-[var(--night)] pb-32">
       {/* High-Performance Stepper Header */}
      <div className="bg-[var(--cloud)]/60 backdrop-blur-2xl border-b border-[var(--iron)] pt-24 pb-8 sticky top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#FF7435] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#FF7435]/30">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black font-poppins text-[var(--night)] tracking-tighter uppercase leading-none mb-1">
                   Script <span className="text-[#FF7435]">Nexus</span>
                </h1>
                <p className="text-[10px] font-black text-[var(--steel)] uppercase tracking-[0.4em]">Persuasion Engine v2.0</p>
              </div>
            </div>

            <div className="flex flex-1 max-w-2xl items-center gap-8 px-10">
              {STEPS.map((step, i) => (
                <div key={step.id} className="flex-1 relative flex flex-col items-center group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-500 z-10 ${currentStep >= step.id ? "bg-[var(--night)] border-[var(--night)] text-white" : "bg-white border-[var(--iron)] text-[var(--steel)]"}`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div className="absolute top-5 left-[50%] w-full h-0.5 bg-[var(--iron)] -z-0 last:hidden">
                    <div className={`h-full bg-[#FF7435] transition-all duration-700 ${currentStep > step.id ? "w-full" : "w-0"}`}></div>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest mt-3 transition-colors ${currentStep >= step.id ? "text-[var(--night)]" : "text-[var(--steel)]"}`}>{step.title}</span>
                </div>
              ))}
            </div>

            <Button onClick={resetGenerator} variant="outline" className="h-14 px-8 border-2 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all border-[var(--iron)] group">
               <RefreshCw className="w-4 h-4 mr-3 group-hover:rotate-180 transition-transform duration-500" /> Reset Node
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-16 max-w-7xl mx-auto px-6 lg:px-10 mt-12">
        <AnimatePresence mode="wait">
          {!response ? (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
               
               {/* Strategic Parameters workspace */}
               <div className="lg:col-span-8">
                  <Card className="card p-12 md:p-16 shadow-2xl shadow-black/5 border-2 border-[var(--iron)]/50 bg-white relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF7435]/5 rounded-bl-[10rem] pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
                     
                     <CardHeader className="px-0 pt-0 pb-12 border-b-2 border-dashed border-[var(--iron)]/40 mb-12">
                        <div className="flex items-center gap-4">
                           <LayoutDashboard className="w-6 h-6 text-[#FF7435]" />
                           <div>
                              <CardTitle className="text-2xl font-black font-poppins uppercase tracking-tighter">{STEPS[currentStep - 1].title}</CardTitle>
                              <CardDescription className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--steel)] mt-1">{STEPS[currentStep - 1].description}</CardDescription>
                           </div>
                        </div>
                     </CardHeader>

                     <CardContent className="px-0 pb-0">
                        <form onSubmit={handleSubmit} className="space-y-10">
                           {currentStep === 1 && (
                              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                       <Label className="field-label font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><UserCheck className="w-3 h-3 text-[#FF7435]"/> Administrator Identity *</Label>
                                       <Input value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} placeholder="John Doe" className="input h-14" />
                                       {errors.name && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-3">
                                       <Label className="field-label font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Mail className="w-3 h-3 text-[#FF7435]"/> Terminal Email *</Label>
                                       <Input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="john@nexus.com" className="input h-14" />
                                       {errors.email && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">{errors.email}</p>}
                                    </div>
                                 </div>
                                 <div className="space-y-3">
                                    <Label className="field-label font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><ShoppingCart className="w-3 h-3 text-[#FF7435]"/> Product/Service Designation *</Label>
                                    <Input value={formData.productName} onChange={(e) => handleInputChange("productName", e.target.value)} placeholder="Nexus Premium Service" className="input h-14" />
                                    {errors.productName && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">{errors.productName}</p>}
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                       <Label className="field-label font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Briefcase className="w-3 h-3 text-[#FF7435]"/> Market Industry</Label>
                                       <Input value={formData.industry} onChange={(e) => handleInputChange("industry", e.target.value)} placeholder="SaaS / Fintech" className="input h-14" />
                                    </div>
                                    <div className="space-y-3">
                                       <Label className="field-label font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Coins className="w-3 h-3 text-[#FF7435]"/> Pricing Spectrum</Label>
                                       <Input value={formData.priceRange} onChange={(e) => handleInputChange("priceRange", e.target.value)} placeholder="Enterprise / Premium" className="input h-14" />
                                    </div>
                                 </div>
                              </div>
                           )}

                           {currentStep === 2 && (
                              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                 <div className="space-y-3">
                                    <Label className="field-label font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Target className="w-3 h-3 text-[#FF7435]"/> Audience Resonance Vector *</Label>
                                    <Textarea value={formData.targetAudience} onChange={(e) => handleInputChange("targetAudience", e.target.value)} placeholder="Define the psychographic profile of your ideal client..." rows={5} className="input pt-6 px-6 min-h-[160px] rounded-[3rem]" />
                                    {errors.targetAudience && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">{errors.targetAudience}</p>}
                                 </div>
                                 <div className="space-y-3">
                                    <Label className="field-label font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Sparkles className="w-3 h-3 text-[#FF7435]"/> Linguistic Resonance (Tone)</Label>
                                    <Select value={formData.tone} onValueChange={(val) => handleInputChange("tone", val)}>
                                       <SelectTrigger className="input h-14">
                                          <SelectValue placeholder="Select Resonance Frequency" />
                                       </SelectTrigger>
                                       <SelectContent className="bg-white border-2 border-[var(--iron)] rounded-2xl shadow-2xl">
                                          {["persuasive", "professional", "casual", "urgent", "friendly", "consultative", "authoritative"].map((t) => (
                                             <SelectItem key={t} value={t} className="font-bold py-3 uppercase text-[10px] tracking-widest">
                                                {t}
                                             </SelectItem>
                                          ))}
                                       </SelectContent>
                                    </Select>
                                 </div>
                              </div>
                           )}

                           {currentStep === 3 && (
                              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                 <div className="space-y-4">
                                    <Label className="field-label font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Zap className="w-3 h-3 text-[#FF7435]"/> Strategic Levers (Benefits) *</Label>
                                    <div className="grid grid-cols-1 gap-4">
                                       {formData.keyBenefits.map((benefit, i) => (
                                          <div key={i} className="flex gap-4">
                                             <Input value={benefit} onChange={(e) => {
                                                const newB = [...formData.keyBenefits];
                                                newB[i] = e.target.value;
                                                handleInputChange("keyBenefits", newB);
                                             }} placeholder={`Strategic Benefit #${i+1}...`} className="input h-14" />
                                             {formData.keyBenefits.length > 1 && (
                                                <Button type="button" variant="outline" size="icon" onClick={() => {
                                                   const newB = formData.keyBenefits.filter((_, idx) => idx !== i);
                                                   handleInputChange("keyBenefits", newB);
                                                }} className="h-14 w-14 shrink-0 rounded-2xl border-2 border-[var(--iron)] hover:border-red-400 hover:text-red-500">
                                                   <Trash2 className="w-5 h-5" />
                                                </Button>
                                             )}
                                          </div>
                                       ))}
                                       <Button type="button" variant="ghost" onClick={() => handleInputChange("keyBenefits", [...formData.keyBenefits, ""])} className="w-full h-14 border-2 border-dashed border-[var(--iron)] rounded-2xl hover:bg-[#FF7435]/5 hover:border-[#FF7435] font-black uppercase text-[10px] tracking-widest transition-all">
                                          <Plus className="w-4 h-4 mr-2" /> Add Lever
                                       </Button>
                                    </div>
                                 </div>
                                 <div className="space-y-3">
                                    <Label className="field-label font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Target className="w-3 h-3 text-[#FF7435]"/> Conversion Directive (CTA) *</Label>
                                    <Input value={formData.callToAction} onChange={(e) => handleInputChange("callToAction", e.target.value)} placeholder="Define the primary action threshold..." className="input h-14" />
                                    {errors.callToAction && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">{errors.callToAction}</p>}
                                 </div>
                                 <div className="space-y-3">
                                    <Label className="field-label font-black text-[10px] uppercase tracking-widest">Protocol Density (Length)</Label>
                                    <div className="flex items-center gap-4 bg-[var(--mist)] p-3 rounded-2xl border-2 border-[var(--iron)]/40">
                                       {["short", "medium", "long"].map(l => (
                                          <button key={l} type="button" onClick={() => handleInputChange("scriptLength", l)} className={`flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.scriptLength === l ? "bg-[var(--night)] text-white shadow-xl" : "text-[var(--steel)] hover:bg-white"}`}>
                                             {l}
                                          </button>
                                       ))}
                                    </div>
                                 </div>
                              </div>
                           )}

                           <div className="pt-8 border-t-2 border-dashed border-[var(--iron)]/40 flex items-center justify-between gap-6">
                              <Button type="button" onClick={prevStep} disabled={currentStep === 1} variant="outline" className="h-14 px-10 border-2 rounded-full font-black uppercase text-[10px] tracking-widest disabled:opacity-30">
                                 Back
                              </Button>
                              {currentStep < 3 ? (
                                 <Button type="button" onClick={nextStep} className="btn-primary h-14 px-14 rounded-full text-[10px] font-black uppercase tracking-widest group">
                                    Next Phase <ArrowRight className="w-4 h-4 ml-4 group-hover:translate-x-2 transition-transform" />
                                 </Button>
                              ) : (
                                 <Button type="submit" disabled={isLoading} className="btn-primary h-20 px-20 rounded-full text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-[#FF7435]/30 group">
                                    {isLoading ? (
                                       <><Loader2 className="w-6 h-6 mr-4 animate-spin" /> Synthesizing...</>
                                    ) : (
                                       <>Manifest Script <Sparkles className="w-6 h-6 ml-4 group-hover:scale-125 transition-transform" /></>
                                    )}
                                 </Button>
                              )}
                           </div>
                        </form>
                     </CardContent>
                  </Card>
               </div>

               {/* Strategic sidebar */}
               <div className="lg:col-span-4 space-y-8">
                  <div className="card p-10 bg-[var(--night)] text-white border-none rounded-[3rem] shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-[8rem] pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
                     <div className="relative z-10 space-y-8">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                           <ShieldCheck className="w-6 h-6 text-[#FF7435]" />
                        </div>
                        <div className="space-y-2">
                           <h3 className="text-xl font-black font-poppins uppercase tracking-tighter">Protocol Guard</h3>
                           <p className="text-xs font-bold text-white/50 leading-relaxed italic">Your strategy is calibrated against 250+ top-performing psychological sales anchors.</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                           <Badge className="bg-white/10 text-white font-black px-4 py-2 rounded-xl text-[8px] uppercase tracking-widest border-none">AI Optimized</Badge>
                           <Badge className="bg-white/10 text-white font-black px-4 py-2 rounded-xl text-[8px] uppercase tracking-widest border-none">Conversion Focused</Badge>
                        </div>
                     </div>
                  </div>

                  <div className="card p-10 border-2 border-[var(--iron)]/50 bg-white rounded-[3rem] space-y-8 grayscale opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--steel)]">Calibration Metrics</h4>
                     <div className="space-y-6">
                        {["Resonance", "Impact", "Retention"].map(m => (
                           <div key={m} className="space-y-2">
                              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                                 <span>{m}</span>
                                 <span>95%</span>
                              </div>
                              <div className="h-1.5 bg-[var(--iron)]/40 rounded-full overflow-hidden">
                                 <div className="h-full bg-[#FF7435] w-[95%]"></div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
               {/* Fixed Action Bar for Results */}
               <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-[var(--night)] rounded-2xl flex items-center justify-center shadow-2xl">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black font-poppins text-[var(--night)] tracking-tighter uppercase leading-none mb-1">Generated Manifest</h2>
                      <p className="text-[10px] font-black text-[var(--steel)] uppercase tracking-[0.4em]">Protocol: {formData.productName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <Button onClick={copyToClipboard} className="h-14 px-8 bg-[var(--night)] hover:bg-[#FF7435] text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-2xl transition-all group">
                        {isCopied ? <><Check className="w-4 h-4 mr-3" /> Node Copied</> : <><Copy className="w-4 h-4 mr-3" /> Copy Full Node</>}
                     </Button>
                     <Button variant="outline" onClick={downloadText} className="h-14 px-8 border-2 border-[var(--iron)] rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all group">
                        <Download className="w-4 h-4 mr-3 group-hover:translate-y-1 transition-transform" /> Export Report
                     </Button>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  {/* Main Script Manifest */}
                  <div className="lg:col-span-8">
                     <Card className="card p-12 md:p-20 border-2 border-[var(--iron)] shadow-2xl shadow-black/5 bg-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-[#FF7435]/5 rounded-bl-[30rem] pointer-events-none"></div>
                        <CardContent className="p-0 relative z-10 prose-custom max-h-[800px] overflow-y-auto custom-scrollbar">
                           <FormattedOutput content={response.script} />
                        </CardContent>
                     </Card>
                  </div>

                  {/* Sidebar stats */}
                  <div className="lg:col-span-4 space-y-8">
                     <Card className="card p-10 border-2 border-[var(--iron)]/50 bg-white rounded-[3rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF7435]/5 rounded-bl-[5rem] pointer-events-none"></div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--steel)] mb-10 border-b-2 border-dashed border-[var(--iron)] pb-6">Protocol Anchors</h4>
                        <div className="space-y-8">
                           <div className="space-y-2">
                              <Label className="text-[9px] font-black text-[var(--night)]/40 uppercase tracking-widest">Resonance Frequency</Label>
                              <p className="text-sm font-black uppercase tracking-widest text-[#FF7435]">{formData.tone}</p>
                           </div>
                           <div className="space-y-2">
                              <Label className="text-[9px] font-black text-[var(--night)]/40 uppercase tracking-widest">Density Payload</Label>
                              <p className="text-sm font-black uppercase tracking-widest text-[#FF7435]">{formData.scriptLength}</p>
                           </div>
                           <div className="space-y-4">
                              <Label className="text-[9px] font-black text-[var(--night)]/40 uppercase tracking-widest">Target Vector</Label>
                              <p className="text-[10px] font-bold text-[var(--night)]/80 leading-relaxed italic">{formData.targetAudience}</p>
                           </div>
                           <div className="pt-6 border-t-2 border-dashed border-[var(--iron)]/40">
                              <Label className="text-[9px] font-black text-[var(--night)]/40 uppercase tracking-widest block mb-4">Strategic Levers</Label>
                              <div className="flex flex-wrap gap-2">
                                 {formData.keyBenefits.filter(b => b.trim()).map((b, i) => (
                                    <Badge key={i} className="bg-[var(--mist)] text-[var(--night)] border border-[var(--iron)]/60 font-black px-3 py-1.5 rounded-lg text-[8px] uppercase tracking-widest italic">{b}</Badge>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </Card>

                     <Button onClick={resetGenerator} className="w-full h-20 rounded-[2.5rem] bg-[var(--night)] hover:bg-[#FF7435] text-white font-black uppercase text-xs tracking-[0.3em] shadow-2xl transition-all group">
                        Initialize New Protocol <RefreshCw className="w-5 h-5 ml-4 group-hover:rotate-180 transition-transform duration-500" />
                     </Button>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

       {/* Security Status Badge - Floating Footer */}
       <div className="fixed bottom-10 left-10 z-50 hidden sm:block">
          <div className="bg-[var(--night)] text-white px-6 py-3 rounded-2xl flex items-center gap-4 shadow-2xl border border-white/10 group">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80 group-hover:opacity-100 transition-opacity">Neural Synthesis Secured</span>
          </div>
       </div>
    </div>
  )
}
