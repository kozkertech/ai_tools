"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Loader2, 
  Sparkles, 
  Target, 
  Users, 
  Building2, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  RefreshCcw, 
  Palette, 
  Globe, 
  UserCheck, 
  LayoutDashboard,
  Gem,
  Megaphone,
  Fingerprint
} from "lucide-react"

import { ContentLoadingScreen } from "@/components/loading-screen"

interface FormData {
  name: string
  email: string
  companyName: string
  industry: string
  targetAudience: string
  keyProductsServices: string
  differentiator: string
  tonePreference: string
}

interface TaglineResult {
  tagline: string
  uvp: string
  explanation: string
}

export default function TaglineCreator() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    companyName: "",
    industry: "",
    targetAudience: "",
    keyProductsServices: "",
    differentiator: "",
    tonePreference: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<TaglineResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const industries = [
    "Technology", "Healthcare", "Finance", "E-commerce", "Education",
    "Manufacturing", "Real Estate", "Food & Beverage", "Fashion",
    "Automotive", "Entertainment", "Consulting", "Other",
  ]

  const toneOptions = [
    "Professional", "Friendly", "Bold", "Creative", "Trustworthy",
    "Innovative", "Playful", "Sophisticated", "Energetic", "Reliable",
  ]

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const parseResponse = (responseText: string): TaglineResult => {
    // Parse the markdown-like response
    const taglineMatch = responseText.match(/\*\*Tagline:\*\*\s*\*"([^"]+)"\*/)
    const uvpMatch = responseText.match(/\*\*UVP:\*\*\s*\*"([^"]+)"\*/)
    const explanationMatch = responseText.match(/\*$$([^)]+)$$\*/)

    return {
      tagline: taglineMatch ? taglineMatch[1] : "The standard in executive excellence.",
      uvp: uvpMatch ? uvpMatch[1] : "A high-fidelity value proposition for modern markets.",
      explanation: explanationMatch ? explanationMatch[1] : "Synthesis optimized for strategic clarity.",
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/785ebaf0-797f-4c57-9a13-706fb085b748", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Linguistic synthesis failed. Re-calibration required.")
      }

      const responseData = await response.json()
      const outputText = responseData[0]?.output || responseData.output || JSON.stringify(responseData)

      const parsedResult = parseResponse(outputText)
      setResult(parsedResult)
    } catch (err) {
      setError("Strategic manifestation failed. Please re-initialize parameters.")
      console.error("Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <ContentLoadingScreen />
  }

  const resetForm = () => {
    setFormData({
      name: "", email: "", companyName: "", industry: "",
      targetAudience: "", keyProductsServices: "", differentiator: "", tonePreference: "",
    })
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-[var(--mist)] text-[var(--night)] transition-colors duration-300 pb-32">
      {/* Premium Identity Header */}
      <div className="bg-[var(--cloud)]/60 backdrop-blur-2xl border-b border-[var(--iron)] pt-24 pb-8 sticky top-0 w-full z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#FF7435] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#FF7435]/30">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black font-poppins text-[var(--night)] tracking-tighter uppercase leading-none mb-1">
                   Oracle <span className="text-[#FF7435]">Identity</span>
                </h1>
                <p className="text-[10px] font-black text-[var(--steel)] uppercase tracking-[0.4em]">Brand Resonance Protocol v2.0</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block mr-4">
                  <div className="text-[9px] font-black uppercase tracking-widest text-[var(--steel)]">Sync Status</div>
                  <div className="text-xs font-black text-[var(--night)] uppercase flex items-center justify-end gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                     Synched
                  </div>
               </div>
               <Button onClick={resetForm} variant="outline" className="h-14 px-8 border-2 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all border-[var(--iron)] group">
                 <RefreshCcw className="w-4 h-4 mr-3 group-hover:rotate-180 transition-transform duration-500" /> Reset Terminal
               </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-16 max-w-7xl mx-auto px-6 lg:px-10 mt-12 mb-20 animate-in fade-in duration-700">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Mission Parameters Form */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-10">
             <Card className="card p-12 shadow-2xl shadow-black/5 border-2 border-[var(--iron)]/50 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF7435]/5 rounded-bl-[8rem] pointer-events-none"></div>
                
                <CardHeader className="px-0 pt-0 pb-10 border-b-2 border-dashed border-[var(--iron)]/40 mb-10">
                   <div className="flex items-center gap-4">
                      <Building2 className="w-6 h-6 text-[#FF7435]" />
                      <CardTitle className="text-2xl font-black font-poppins uppercase tracking-tighter">Corporate Blueprint</CardTitle>
                   </div>
                   <CardDescription className="text-[10px] font-black text-[var(--steel)] uppercase tracking-[0.2em] mt-3 italic">Initialize brand data for deep manifestation.</CardDescription>
                </CardHeader>
                
                <CardContent className="px-0 pb-0 space-y-8">
                   <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                         <div className="space-y-3">
                            <Label className="field-label font-black text-[10px] uppercase tracking-widest opacity-70">Liaison Name *</Label>
                            <Input value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required placeholder="John Doe" className="input h-14" />
                         </div>
                         <div className="space-y-3">
                            <Label className="field-label font-black text-[10px] uppercase tracking-widest opacity-70">Contact Terminal *</Label>
                            <Input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} required placeholder="john@nexus.com" className="input h-14" />
                         </div>
                      </div>

                      <div className="space-y-3">
                         <Label className="field-label font-black text-[10px] uppercase tracking-widest opacity-70">Company Entity *</Label>
                         <Input value={formData.companyName} onChange={(e) => handleInputChange("companyName", e.target.value)} required placeholder="Nexus Automata Inc." className="input h-14" />
                      </div>

                      <div className="space-y-3">
                         <Label className="field-label font-black text-[10px] uppercase tracking-widest opacity-70">Sector Designation *</Label>
                         <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                           <SelectTrigger className="input h-14"><SelectValue placeholder="Select Sector" /></SelectTrigger>
                           <SelectContent>
                             {industries.map((industry) => (
                               <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                      </div>

                      <div className="space-y-3">
                         <Label className="field-label font-black text-[10px] uppercase tracking-widest opacity-70">Target Demographic Signal *</Label>
                         <Textarea value={formData.targetAudience} onChange={(e) => handleInputChange("targetAudience", e.target.value)} required placeholder="E.g., High-growth SaaS founders seeking automation..." rows={3} className="input pt-6 px-6 min-h-[100px] rounded-[2rem]" />
                      </div>

                      <div className="space-y-3">
                         <Label className="field-label font-black text-[10px] uppercase tracking-widest opacity-70">Core Offering *</Label>
                         <Textarea value={formData.keyProductsServices} onChange={(e) => handleInputChange("keyProductsServices", e.target.value)} required placeholder="Define the primary manifestation of value..." rows={3} className="input pt-6 px-6 min-h-[100px] rounded-[2rem]" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                         <div className="space-y-3">
                            <Label className="field-label font-black text-[10px] uppercase tracking-widest opacity-70">Identity Tonality *</Label>
                            <Select value={formData.tonePreference} onValueChange={(value) => handleInputChange("tonePreference", value)}>
                              <SelectTrigger className="input h-14"><SelectValue placeholder="Select Frequency" /></SelectTrigger>
                              <SelectContent>
                                {toneOptions.map((tone) => (
                                  <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                         </div>
                         <div className="space-y-3">
                            <Label className="field-label font-black text-[10px] uppercase tracking-widest opacity-70">Prime Differentiator *</Label>
                            <Input value={formData.differentiator} onChange={(e) => handleInputChange("differentiator", e.target.value)} required placeholder="Strategic advantage" className="input h-14" />
                         </div>
                      </div>

                      <Button type="submit" disabled={isLoading} className="w-full btn-primary h-20 text-xs font-black uppercase tracking-[0.4em] rounded-full shadow-2xl shadow-[#FF7435]/30 group">
                        {isLoading ? (
                          <><Loader2 className="w-6 h-6 mr-4 animate-spin" /> Synthesizing Identity...</>
                        ) : (
                          <>Manifest Identity Array <Zap className="w-6 h-6 ml-4 group-hover:scale-125 transition-transform" /></>
                        )}
                      </Button>
                   </form>
                </CardContent>
             </Card>
          </div>

          {/* Results Manifestation */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-12">
             {error && (
                <Card className="rounded-[2.5rem] border-2 border-red-200 bg-red-50 p-8 shadow-2xl shadow-red-500/5 animate-in shake-in">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                         <Target className="w-6 h-6 text-red-600" />
                      </div>
                      <p className="text-xs font-bold text-red-700">{error}</p>
                   </div>
                </Alert>
             )}

             {result ? (
                <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-1000">
                   {/* Main Tagline Hero */}
                   <Card className="card p-12 md:p-20 border-2 border-[var(--iron)] shadow-2xl shadow-black/5 bg-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF7435]/5 rounded-bl-[12rem] pointer-events-none"></div>
                      <CardHeader className="px-0 pt-0 pb-12 border-b-2 border-dashed border-[var(--iron)]/40 mb-12">
                         <div className="flex items-center gap-4 text-[#FF7435]">
                            <Megaphone className="w-6 h-6 shrink-0" />
                            <CardTitle className="text-xs font-black uppercase tracking-[0.4em]">Primary Manifestation</CardTitle>
                         </div>
                      </CardHeader>
                      <CardContent className="px-0 pb-0 text-center">
                         <h2 className="text-5xl md:text-7xl font-black font-poppins text-[var(--night)] tracking-tighter leading-tight drop-shadow-sm mb-12">
                           "{result.tagline}"
                         </h2>
                         <div className="inline-flex items-center gap-3 px-6 py-3 bg-[var(--mist)] rounded-2xl border-2 border-[var(--iron)]/40">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--steel)]">Identity Verified & Optimized</span>
                         </div>
                      </CardContent>
                   </Card>

                   {/* UVP & Logic Section */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <Card className="card p-12 border-2 border-[var(--iron)] shadow-2xl shadow-black/5 bg-[var(--night)] text-white overflow-hidden group">
                         <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-[2rem] group-hover:scale-110 transition-transform duration-700"></div>
                         <CardHeader className="px-0 pt-0 pb-8 border-b border-white/10 mb-8">
                            <div className="flex items-center gap-4 text-[#FF7435]">
                               <Gem className="w-5 h-5" />
                               <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 text-white">Value Proposition</CardTitle>
                            </div>
                         </CardHeader>
                         <CardContent className="px-0 pb-0">
                            <p className="text-2xl font-black font-poppins leading-tight tracking-tight mb-6">Unique Tactical Position</p>
                            <p className="text-white/80 font-bold italic text-lg leading-relaxed">{result.uvp}</p>
                         </CardContent>
                      </Card>

                      <Card className="card p-12 border-2 border-[var(--iron)] shadow-2xl shadow-black/5 bg-white relative">
                         <CardHeader className="px-0 pt-0 pb-8 border-b-2 border-dashed border-[var(--iron)]/40 mb-8">
                            <div className="flex items-center gap-4 text-blue-500">
                               <Fingerprint className="w-5 h-5" />
                               <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 text-[var(--night)]">Strategic Synthesis</CardTitle>
                            </div>
                         </CardHeader>
                         <CardContent className="px-0 pb-0">
                            <p className="text-xs font-black uppercase tracking-widest text-[#FF7435] mb-4">Linguistic Logic</p>
                            <p className="text-sm font-bold text-[var(--steel)] leading-relaxed italic">{result.explanation}</p>
                            <div className="mt-8 pt-8 border-t border-[var(--iron)]/40 flex items-center justify-between">
                               <div className="flex -space-x-2">
                                  {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-[var(--mist)]"></div>)}
                               </div>
                               <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-[#FF7435] hover:bg-orange-50">
                                  Export Blueprint <ArrowRight className="w-3 h-3 ml-2" />
                                </Button>
                            </div>
                         </CardContent>
                      </Card>
                   </div>
                </div>
             ) : (
                /* Static State Display */
                <div className="card p-32 flex flex-col items-center justify-center text-center space-y-12 border-dashed border-4 border-[var(--iron)]/40 grayscale opacity-40 bg-[var(--mist)]/30 rounded-[4rem] h-full min-h-[600px] select-none pointer-events-none">
                   <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center mx-auto border-2 border-[var(--iron)] shadow-inner">
                     <Building2 className="w-16 h-16 text-[var(--steel)]" />
                   </div>
                   <div className="space-y-4">
                     <h3 className="text-3xl font-black font-poppins text-[var(--night)] uppercase tracking-tighter">Awaiting Brand Injection</h3>
                     <p className="text-[var(--steel)] max-w-sm mx-auto font-bold italic leading-relaxed">
                        Populate the corporate blueprint on the left to manifest high-fidelity identity assets here.
                     </p>
                   </div>
                   
                   <div className="w-full max-w-md pt-12 space-y-8 opacity-30">
                      <div className="h-12 bg-white rounded-2xl border-2 border-dashed border-[var(--iron)]"></div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="h-48 bg-white rounded-3xl border-2 border-dashed border-[var(--iron)]"></div>
                         <div className="h-48 bg-white rounded-3xl border-2 border-dashed border-[var(--iron)]"></div>
                      </div>
                   </div>
                </div>
             )}
          </div>
        </div>

        {/* Global Features Footnote */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-12 border-t-2 border-[var(--iron)]/40 pt-20 grayscale opacity-40 select-none">
           {[
             { label: "Semantic Synthesis", icon: Sparkles, desc: "AI-driven linguistic resonance." },
             { label: "Market Calibration", icon: Target, desc: "Deep demographic alignment." },
             { label: "Executive Clarity", icon: Gem, desc: "High-fidelity value definition." },
             { label: "Rapid Deployment", icon: Zap, desc: "Instant identity generation." }
           ].map((feat, i) => (
             <div key={i} className="text-center space-y-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto border-2 border-[var(--iron)] shadow-sm">
                   <feat.icon className="w-6 h-6 text-[var(--steel)]" />
                </div>
                <div>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">{feat.label}</h4>
                   <p className="text-[9px] font-bold italic text-[var(--steel)]">{feat.desc}</p>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  )
}
