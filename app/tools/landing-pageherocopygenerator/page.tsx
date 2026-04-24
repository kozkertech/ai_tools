"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Loader2, Copy, Download, Sparkles, Target, Users, Zap,
  Settings2, Trash2, Layout, MessageSquare, AlertCircle,
  Monitor, ArrowRight, Check, RefreshCw, CheckCircle, XCircle, Globe, Smartphone, MousePointer2
} from "lucide-react"
import { ContentLoadingScreen } from "@/components/loading-screen"

interface HeroVariation {
  headline: string
  subheadline: string
  primaryCta: string
}

interface HeroData {
  brandName: string
  eyebrow: string
  headline: string
  subheadline: string
  primaryCta: string
  secondaryCta?: string
  supportingPoints?: string[]
  previewTheme?: string
  variations?: HeroVariation[]
}

interface N8NResponse {
  success: boolean
  data?: HeroData
  message?: string
}

export default function LandingPageHeroCopyGenerator() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<HeroData | null>(null)
  const [activeVariationIndex, setActiveVariationIndex] = useState<number>(-1)
  const [formData, setFormData] = useState({
    businessName: "",
    offer: "",
    targetAudience: "",
    mainResult: "",
    whyChooseUs: "",
    tone: "Premium",
    primaryCta: "",
  })

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!formData.businessName || !formData.offer || !formData.targetAudience || !formData.mainResult) {
      setError("Strategic parameters missing. Fill required fields.")
      return
    }

    setIsLoading(true)
    setError(null)

    const payload = {
      ...formData,
      sourceTool: "landing_page_hero_copy_generator",
      submittedAt: new Date().toISOString()
    }

    try {
      const response = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/landing-page-hero-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Node processing error: ${response.status}`)
      }

      const data: N8NResponse = await response.json()

      if (data.success && data.data) {
        setResult(data.data)
        setActiveVariationIndex(-1)
      } else {
        throw new Error(data.message || "Synthesizer failed to return valid data.")
      }
    } catch (err: any) {
      console.error("Submission error:", err)
      setError(err.message || "Internal system failure while generating copy.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleReset = () => {
    setFormData({
      businessName: "",
      offer: "",
      targetAudience: "",
      mainResult: "",
      whyChooseUs: "",
      tone: "Premium",
      primaryCta: "",
    })
    setResult(null)
    setError(null)
    setActiveVariationIndex(-1)
  }

  const useVariation = (index: number) => {
    if (!result || !result.variations) return
    setActiveVariationIndex(index)
  }

  const displayData = result ? (
    activeVariationIndex === -1 ? {
      headline: result.headline,
      subheadline: result.subheadline,
      primaryCta: result.primaryCta
    } : result.variations![activeVariationIndex]
  ) : null

  return (
    <div className="min-h-screen bg-[var(--mist)] text-[var(--night)] transition-colors duration-300 pb-32">
      {/* Fixed Premium Header */}
      <div className="bg-[var(--cloud)]/60 backdrop-blur-2xl border-b border-[var(--iron)] pt-24 pb-8 fixed top-0 w-full z-40 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#FF7435] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#FF7435]/30">
                <Layout className="w-8 h-8 text-white" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-3xl font-black font-poppins text-[var(--night)] tracking-tighter uppercase leading-none mb-1">
                   Hero <span className="text-[#FF7435]">Studio</span>
                </h1>
                <Badge className="bg-[var(--night)] text-white border-none font-black px-3 py-1 rounded-lg text-[9px] uppercase tracking-widest opacity-80">v2.0 Synthesis Unit</Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block">
                  <div className="text-[9px] font-black uppercase tracking-widest text-[var(--steel)]">Visual Fidelity</div>
                  <div className="text-xs font-black text-[var(--night)] uppercase">High Definition</div>
               </div>
               <div className="w-px h-10 bg-[var(--iron)]/60 mx-2"></div>
               <Button variant="ghost" onClick={handleReset} className="h-12 px-6 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl">
                  <Trash2 className="w-4 h-4 mr-2" /> Reset
               </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-[164px] max-w-[1440px] mx-auto px-6 lg:px-10 mt-16 lg:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Configuration Form */}
          <div className="lg:col-span-12 xl:col-span-4 space-y-8">
            <Card className="card p-10 shadow-2xl shadow-black/5 border-2 border-[var(--iron)]/50">
              <CardHeader className="px-0 pt-0 pb-10 border-b-2 border-[var(--iron)]/40 mb-10">
                <div className="flex items-center gap-3">
                   <Settings2 className="w-6 h-6 text-[#FF7435]" />
                   <CardTitle className="text-2xl font-black font-poppins uppercase tracking-tighter">Parameters</CardTitle>
                </div>
                <CardDescription className="font-bold text-[var(--steel)] italic">Fine-tune the neural copy engine.</CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-8">
                  <div className="flex items-center gap-3 text-[10px] font-black text-[#FF7435] uppercase tracking-[0.3em]">
                    <Globe className="w-4 h-4" /> Environmental Context
                  </div>

                  <div className="space-y-3">
                    <Label className="field-label font-black text-xs uppercase tracking-widest">Enterprise Identity</Label>
                    <Input
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder="e.g. KozkerTech"
                      className="input h-14"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="field-label font-black text-xs uppercase tracking-widest">Target Persona</Label>
                    <Input
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                      placeholder="e.g. Fintech CEOs"
                      className="input h-14"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="field-label font-black text-xs uppercase tracking-widest">Value Proposition</Label>
                    <Textarea
                      value={formData.offer}
                      onChange={(e) => setFormData({ ...formData, offer: e.target.value })}
                      placeholder="Identify the core offering and unique mechanics..."
                      className="min-h-[120px] input rounded-[2.5rem] pt-8"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-8 pt-10 border-t-2 border-[var(--iron)]/40">
                  <div className="flex items-center gap-3 text-[10px] font-black text-[#FF7435] uppercase tracking-[0.3em]">
                    <Zap className="w-4 h-4" /> Message Logic
                  </div>

                  <div className="space-y-3">
                    <Label className="field-label font-black text-xs uppercase tracking-widest">End Transformation</Label>
                    <Textarea
                      value={formData.mainResult}
                      onChange={(e) => setFormData({ ...formData, mainResult: e.target.value })}
                      placeholder="The ultimate emotional or financial result for the user..."
                      className="min-h-[120px] input rounded-[2.5rem] pt-8"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="field-label font-black">Linguistic Tone</Label>
                      <Select value={formData.tone} onValueChange={(value) => setFormData({ ...formData, tone: value })}>
                        <SelectTrigger className="input h-14 rounded-2xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["Premium", "Bold", "Professional", "Friendly", "Minimal", "Scientific"].map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label className="field-label font-black">CTA Protocol</Label>
                      <Input
                        value={formData.primaryCta}
                        onChange={(e) => setFormData({ ...formData, primaryCta: e.target.value })}
                        placeholder="e.g. Initiate Audit"
                        className="input h-14"
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
                  className="btn-primary w-full h-20 text-xs font-black uppercase tracking-[0.3em] rounded-full shadow-2xl shadow-[#FF7435]/30 group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      Synthesize Copy Vectors
                      <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* High-Fidelity Preview Panel */}
          <div className="lg:col-span-12 xl:col-span-8 space-y-12">
            <Card className="card p-0 overflow-hidden shadow-2xl border-2 border-[var(--iron)]/80 relative bg-white">
              <div className="bg-[var(--night)] text-white py-6 px-10 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/30"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/30"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/30"></div>
                  </div>
                  <div className="h-8 w-px bg-white/10 mx-2"></div>
                  <div className="flex items-center gap-3">
                    <Monitor className="w-5 h-5 text-[#FF7435]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">High-Resolution Canvas</span>
                  </div>
                </div>
                {result && (
                  <div className="flex items-center gap-4">
                     <Badge className="bg-[#FF7435] text-white border-none font-black text-[10px] tracking-tighter px-3 h-6 uppercase">Active Preview</Badge>
                     <Button
                        onClick={() => result && copyToClipboard(`${displayData?.headline}\n\n${displayData?.subheadline}`)}
                        variant="ghost"
                        className="text-white hover:bg-white/10 h-10 px-4 text-xs font-black uppercase tracking-widest rounded-xl"
                     >
                        <Copy className="w-4 h-4 mr-2" /> Export
                     </Button>
                  </div>
                )}
              </div>

              <div className="min-h-[700px] flex flex-col items-center justify-center relative">
                {isLoading ? (
                  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center space-y-10 bg-white/95 backdrop-blur-2xl animate-in fade-in">
                    <div className="relative">
                       <div className="absolute inset-0 bg-[#FF7435]/10 rounded-full animate-ping scale-150"></div>
                       <Loader2 className="w-16 h-16 text-[#FF7435] animate-spin relative z-10" />
                    </div>
                    <div className="text-center">
                       <h3 className="text-2xl font-black font-poppins text-[var(--night)] uppercase tracking-tight mb-2">Processing Vectors</h3>
                       <p className="text-[var(--steel)] font-bold italic">Drafting multi-variant high-conversion headlines...</p>
                    </div>
                  </div>
                ) : result && displayData ? (
                  <div className="p-12 md:p-24 flex flex-col items-center text-center space-y-12 relative w-full animate-in slide-in-from-bottom-12 duration-1000">
                    {/* Atmospheric Decor */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF7435]/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

                    <div className="space-y-8 max-w-5xl">
                      <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[var(--mist)] border-2 border-[var(--iron)] text-[var(--night)] text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-black/5">
                        <Sparkles className="w-4 h-4 text-[#FF7435]" />
                        {result.eyebrow || result.brandName || formData.businessName}
                      </div>
                      <h1 className="text-5xl md:text-6xl lg:text-[84px] font-black text-[var(--night)] leading-[0.95] tracking-[-0.04em] font-poppins">
                        {displayData.headline}
                      </h1>
                      <p className="text-xl md:text-2xl lg:text-3xl text-[var(--steel)] max-w-4xl mx-auto leading-relaxed font-medium italic opacity-90 pb-4">
                        "{displayData.subheadline}"
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-8 pt-8">
                      <Button className="btn-primary h-20 px-14 text-2xl rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(255,116,53,0.5)] group relative overflow-hidden">
                        <span className="relative z-10">{displayData.primaryCta}</span>
                        <ArrowRight className="w-8 h-8 ml-4 group-hover:translate-x-2 transition-all relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </Button>
                      {result.secondaryCta && (
                        <Button variant="ghost" className="h-20 px-14 text-2xl rounded-[2.5rem] border-4 border-[var(--iron)]/40 hover:border-[var(--night)] transition-all font-black uppercase text-[var(--night)]">
                          {result.secondaryCta}
                        </Button>
                      )}
                    </div>

                    {result.supportingPoints && result.supportingPoints.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 pt-20 border-t-2 border-[var(--iron)]/20 w-full max-w-5xl">
                        {result.supportingPoints.map((point, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-4 text-center group">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border-2 border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                              <CheckCircle className="w-6 h-6 text-emerald-600 font-black" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-[var(--steel)] group-hover:text-[var(--night)] transition-colors leading-relaxed">{point}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-20 flex flex-col items-center justify-center text-center space-y-10 opacity-30">
                    <div className="w-32 h-32 bg-[var(--cloud)] rounded-[3rem] flex items-center justify-center border-4 border-[var(--iron)]/40 shadow-inner">
                      <MousePointer2 className="w-16 h-16 text-[var(--steel)]" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-black font-poppins text-[var(--night)] uppercase tracking-tighter">Draft Canvas</h3>
                      <p className="text-[var(--steel)] max-w-sm mx-auto font-bold italic">
                        Input your parameters to generate a high-fidelity visual preview of your hero section.
                      </p>
                    </div>
                    <div className="w-full max-w-md space-y-6 pt-12 items-center flex flex-col pointer-events-none">
                       <div className="h-24 bg-[var(--iron)]/20 rounded-[3rem] w-full"></div>
                       <div className="h-16 bg-[var(--iron)]/20 rounded-full w-2/3"></div>
                       <div className="flex gap-4 w-full">
                          <div className="h-16 bg-[var(--iron)]/20 rounded-full flex-1"></div>
                          <div className="h-16 bg-[var(--iron)]/20 rounded-full flex-1"></div>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Variation Selection System */}
            {result && (
              <div className="space-y-8 animate-in slide-in-from-bottom-12 duration-1000">
                <div className="flex items-center justify-between border-b-2 border-[var(--iron)]/60 pb-6">
                   <div className="flex items-center gap-4">
                     <Sparkles className="w-8 h-8 text-[#FF7435]" />
                     <h3 className="text-2xl font-black font-poppins uppercase tracking-tighter">Copy Candidates</h3>
                   </div>
                   <Badge className="bg-[var(--mist)] text-[var(--steel)] border-2 border-[var(--iron)] font-black text-xs h-8 px-4">SYNTHESIS: COMPLETE</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   <div
                    onClick={() => useVariation(-1)}
                    className={`p-10 rounded-[3rem] cursor-pointer border-4 transition-all duration-500 relative group overflow-hidden ${activeVariationIndex === -1
                        ? "border-[#FF7435] bg-white shadow-2xl shadow-orange-500/10 scale-[1.03]"
                        : "border-[var(--iron)]/40 bg-[var(--cloud)]/30 hover:border-[#FF7435]/30 hover:bg-white"
                      }`}
                  >
                    <div className="flex justify-between items-start mb-8">
                      <span className="text-[10px] font-black text-[#FF7435] uppercase tracking-[0.3em] bg-orange-100/50 px-3 py-1.5 rounded-xl border border-orange-200/50">Primary Vector</span>
                      {activeVariationIndex === -1 && <div className="w-8 h-8 bg-[#FF7435] rounded-xl flex items-center justify-center text-white"><Check className="w-5 h-5 stroke-[4]" /></div>}
                    </div>
                    <h4 className="font-black text-xl text-[var(--night)] leading-tight mb-6 font-poppins break-words">{result.headline}</h4>
                    <p className="text-xs text-[var(--steel)] font-bold italic leading-relaxed mb-10 border-l-3 border-[var(--iron)] pl-4">"{result.subheadline}"</p>
                    <div className="flex justify-between items-center pt-6 border-t border-[var(--iron)]/60">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF7435]">{result.primaryCta}</span>
                      <ArrowRight className="w-5 h-5 text-[var(--steel)] group-hover:text-[#FF7435] transition-colors" />
                    </div>
                  </div>

                  {result.variations?.map((v, i) => (
                    <div
                      key={i}
                      onClick={() => useVariation(i)}
                      className={`p-10 rounded-[3rem] cursor-pointer border-4 transition-all duration-500 relative group overflow-hidden ${activeVariationIndex === i
                          ? "border-[#FF7435] bg-white shadow-2xl shadow-orange-500/10 scale-[1.03]"
                          : "border-[var(--iron)]/40 bg-[var(--cloud)]/30 hover:border-[#FF7435]/30 hover:bg-white"
                        }`}
                    >
                      <div className="flex justify-between items-start mb-8">
                        <span className="text-[10px] font-black text-[var(--steel)] uppercase tracking-[0.3em] bg-[var(--mist)] px-3 py-1.5 rounded-xl border border-[var(--iron)]/50 transition-colors group-hover:bg-white">Candidate 0{i + 1}</span>
                        {activeVariationIndex === i && <div className="w-8 h-8 bg-[#FF7435] rounded-xl flex items-center justify-center text-white"><Check className="w-5 h-5 stroke-[4]" /></div>}
                      </div>
                      <h4 className="font-black text-xl text-[var(--night)] leading-tight mb-6 font-poppins break-words">{v.headline}</h4>
                      <p className="text-xs text-[var(--steel)] font-bold italic leading-relaxed mb-10 border-l-3 border-[var(--iron)] pl-4">"{v.subheadline}"</p>
                      <div className="flex justify-between items-center pt-6 border-t border-[var(--iron)]/60">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF7435]">{v.primaryCta}</span>
                        <ArrowRight className="w-5 h-5 text-[var(--steel)] group-hover:text-[#FF7435] transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
