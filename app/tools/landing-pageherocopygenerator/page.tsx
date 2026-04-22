"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Loader2, Copy, Download, Sparkles, Target, Users, Zap,
  Settings2, Trash2, Layout, MessageSquare, AlertCircle,
  Monitor, ArrowRight, Check, RefreshCw, CheckCircle
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
    tone: "Professional",
    primaryCta: "",
  })

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    // Basic validation
    if (!formData.businessName || !formData.offer || !formData.targetAudience || !formData.mainResult) {
      setError("Please fill in all required fields.")
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
      const response = await fetch("https://n8n.srv832341.hstgr.cloud/webhook-test/landing-page-hero-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const data: N8NResponse = await response.json()

      if (data.success && data.data) {
        setResult(data.data)
        setActiveVariationIndex(-1) // Reset to main version
      } else {
        throw new Error(data.message || "Unable to generate hero copy right now.")
      }
    } catch (err: any) {
      console.error("Submission error:", err)
      setError(err.message || "Something went wrong while generating your hero copy. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Would usually show a toast here - since toast is in UI I can use it if available
    // But for now I'll just assume success
  }

  const handleReset = () => {
    setFormData({
      businessName: "",
      offer: "",
      targetAudience: "",
      mainResult: "",
      whyChooseUs: "",
      tone: "Professional",
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

  // Display data (either main result or selected variation)
  const displayData = result ? (
    activeVariationIndex === -1 ? {
      headline: result.headline,
      subheadline: result.subheadline,
      primaryCta: result.primaryCta
    } : result.variations![activeVariationIndex]
  ) : null

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">

        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF6E30]/10 text-[#FF6E30] rounded-full text-sm font-medium mb-4 border border-[#FF6E30]/20">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Copywriting</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 mb-4">
            Landing Page Hero Copy Generator
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Generate high-converting hero copy and preview it like a real landing page section in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Panel: Form */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-slate-900">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-[#FF6E30]" />
                    Configuration
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-slate-500 hover:text-red-500">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-8">

                  {/* Section A: Business Context */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <Layout className="w-3.5 h-3.5" />
                      Business Context
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessName" className="text-sm font-medium flex items-center justify-between">
                        Business Name <span className="text-red-500 text-xs">*</span>
                      </Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="e.g., KozkerTech"
                        className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 outline-none focus:ring-[#FF6E30]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="offer" className="text-sm font-medium flex items-center justify-between">
                        What do you offer? <span className="text-red-500 text-xs">*</span>
                      </Label>
                      <Textarea
                        id="offer"
                        value={formData.offer}
                        onChange={(e) => setFormData({ ...formData, offer: e.target.value })}
                        placeholder="e.g., AI automation and Power BI solutions for growing businesses"
                        className="min-h-[80px] bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 resize-none outline-none"
                        required
                      />
                      <p className="text-[11px] text-slate-500">Briefly describe your product or service</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="targetAudience" className="text-sm font-medium flex items-center justify-between">
                        Who is this for? <span className="text-red-500 text-xs">*</span>
                      </Label>
                      <Input
                        id="targetAudience"
                        value={formData.targetAudience}
                        onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                        placeholder="e.g., small business owners, clinics, startups"
                        className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                        required
                      />
                      <p className="text-[11px] text-slate-500">Mention the main audience you want to attract</p>
                    </div>
                  </div>

                  {/* Section B: Messaging Direction */}
                  <div className="space-y-5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Messaging Direction
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mainResult" className="text-sm font-medium flex items-center justify-between">
                        What main result do customers get? <span className="text-red-500 text-xs">*</span>
                      </Label>
                      <Textarea
                        id="mainResult"
                        value={formData.mainResult}
                        onChange={(e) => setFormData({ ...formData, mainResult: e.target.value })}
                        placeholder="e.g., save time, automate repetitive work, improve visibility"
                        className="min-h-[80px] bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 resize-none"
                        required
                      />
                      <p className="text-[11px] text-slate-500">Focus on the outcome customers care about most</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whyChooseUs" className="text-sm font-medium">
                        Why choose you over alternatives? <span className="text-slate-400 text-[10px] font-normal font-mono">(OPTIONAL)</span>
                      </Label>
                      <Textarea
                        id="whyChooseUs"
                        value={formData.whyChooseUs}
                        onChange={(e) => setFormData({ ...formData, whyChooseUs: e.target.value })}
                        placeholder="e.g., faster delivery, niche expertise, simple onboarding"
                        className="min-h-[80px] bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 resize-none"
                      />
                      <p className="text-[11px] text-slate-500">Mention what makes your offer more compelling</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tone" className="text-sm font-medium">Tone</Label>
                        <Select value={formData.tone} onValueChange={(value) => setFormData({ ...formData, tone: value })}>
                          <SelectTrigger className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["Professional", "Bold", "Friendly", "Premium", "Minimal", "Trustworthy"].map(t => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="primaryCta" className="text-sm font-medium">Primary CTA</Label>
                        <Input
                          id="primaryCta"
                          value={formData.primaryCta}
                          onChange={(e) => setFormData({ ...formData, primaryCta: e.target.value })}
                          placeholder="e.g., Book a Demo"
                          className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                        />
                      </div>
                    </div>

                    {/* CTA Suggestion Chips */}
                    <div className="flex flex-wrap gap-2">
                      {["Get Started", "Book a Demo", "Schedule a Call", "Free Quote"].map(cta => (
                        <button
                          key={cta}
                          type="button"
                          onClick={() => setFormData({ ...formData, primaryCta: cta })}
                          className={`text-[10px] px-2 py-1 rounded-md border transition-all ${formData.primaryCta === cta
                              ? "bg-[#FF6E30] text-white border-[#FF6E30]"
                              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-[#FF6E30]/50"
                            }`}
                        >
                          {cta}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-[#FF6E30] hover:bg-[#E05A20] text-white h-12 text-base font-semibold shadow-lg shadow-[#FF6E30]/20 transition-all active:scale-[0.98]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating Hero Content...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Generate Hero Copy
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel: Preview */}
          <div className="lg:col-span-7 space-y-6">

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-200 dark:ring-white/5">
              {/* Preview Header / Frame */}
              <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 py-3 px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                  </div>
                  <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 px-0"></div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Monitor className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-widest">Preview Mode</span>
                  </div>
                </div>
                {result && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs gap-1 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      onClick={() => result && copyToClipboard(`${displayData?.headline}\n\n${displayData?.subheadline}\n\n${displayData?.primaryCta}`)}
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy All
                    </Button>
                  </div>
                )}
              </div>

              {/* Preview Content Area */}
              <div className="min-h-[500px] relative">

                {isLoading ? (
                  /* Loading State */
                  <div className="absolute inset-0 z-10 p-12 flex flex-col items-center justify-center space-y-8 animate-pulse bg-white/50 dark:bg-slate-900/50 backdrop-blur-[2px]">
                    <div className="w-32 h-6 bg-slate-100 dark:bg-slate-800 rounded-full mb-4"></div>
                    <div className="w-full max-w-lg h-16 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                    <div className="w-full max-w-sm h-10 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                    <div className="flex gap-4 mt-8">
                      <div className="w-40 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                      <div className="w-40 h-12 border border-slate-100 dark:border-slate-800 rounded-lg"></div>
                    </div>
                    <div className="absolute bottom-12 flex flex-col items-center">
                      <Loader2 className="w-6 h-6 text-[#FF6E30] animate-spin mb-2" />
                      <p className="text-sm font-medium text-slate-500 italic">AI is crafting your high-converting copy...</p>
                    </div>
                  </div>
                ) : result && displayData ? (
                  /* Success State - Realistic Preview */
                  <div className="p-12 md:p-20 flex flex-col items-center text-center space-y-8 relative overflow-hidden group">
                    {/* Background decoration */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FF6E30]/5 rounded-full blur-3xl group-hover:bg-[#FF6E30]/10 transition-all duration-700"></div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-700"></div>

                    {/* Brand/Eyebrow */}
                    <div className="relative z-10 space-y-4">
                      <div className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-700 shadow-sm">
                        {result.eyebrow || result.brandName || formData.businessName}
                      </div>
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight max-w-3xl mx-auto group-hover:scale-[1.01] transition-transform duration-500">
                        {displayData.headline}
                      </h1>
                      <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
                        {displayData.subheadline}
                      </p>
                    </div>

                    <div className="relative z-10 flex flex-col sm:flex-row gap-4 pt-4">
                      <Button className="bg-[#FF6E30] hover:bg-[#E05A20] text-white h-14 px-8 text-lg font-bold rounded-xl shadow-xl shadow-[#FF6E30]/20 min-w-[200px]">
                        {displayData.primaryCta}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                      {result.secondaryCta && (
                        <Button variant="outline" className="h-14 px-8 text-lg font-bold rounded-xl border-2 border-slate-200 dark:border-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all min-w-[180px]">
                          {result.secondaryCta}
                        </Button>
                      )}
                    </div>

                    {/* Supporting Points */}
                    {result.supportingPoints && result.supportingPoints.length > 0 && (
                      <div className="relative z-10 flex flex-wrap justify-center gap-y-4 gap-x-8 pt-8 opacity-80">
                        {result.supportingPoints.map((point, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                              <Check className="w-3 h-3 text-green-500" />
                            </div>
                            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{point}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Initial Placeholder State */
                  <div className="p-12 md:p-20 flex flex-col items-center justify-center h-full text-center space-y-6">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-700 shadow-inner">
                      <Layout className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Your Hero Preview</h3>
                      <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                        This area will show a realistic preview of your generated landing page hero section.
                      </p>
                    </div>

                    {/* Placeholder visual */}
                    <div className="w-full max-w-md pt-8 space-y-4 opacity-30 select-none pointer-events-none">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-1/3 mx-auto"></div>
                      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
                      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-xl w-3/4 mx-auto"></div>
                      <div className="flex gap-3 justify-center pt-4">
                        <div className="w-40 h-10 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                        <div className="w-32 h-10 border border-slate-200 dark:border-slate-800 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Variations & Secondary Actions */}
            {result && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Field Copy Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 justify-start gap-3 hover:text-[#FF6E30] transition-colors"
                    onClick={() => copyToClipboard(displayData?.headline || "")}
                  >
                    <div className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Layout className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold">Copy Headline</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 justify-start gap-3 hover:text-[#FF6E30] transition-colors"
                    onClick={() => copyToClipboard(displayData?.subheadline || "")}
                  >
                    <div className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold">Copy Subheadline</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 justify-start gap-3 hover:text-[#FF6E30] transition-colors"
                    onClick={() => handleSubmit()}
                    disabled={isLoading}
                  >
                    <div className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    </div>
                    <span className="text-xs font-semibold">Regenerate</span>
                  </Button>
                </div>

                {/* Alternative Variations */}
                {result.variations && result.variations.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#FF6E30]" />
                      Alternative Variations
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.variations.map((v, i) => (
                        <Card
                          key={i}
                          className={`group cursor-pointer transition-all duration-300 overflow-hidden ${activeVariationIndex === i
                              ? "ring-2 ring-[#FF6E30] border-transparent shadow-md"
                              : "border-slate-200 dark:border-slate-800 hover:border-[#FF6E30]/30 hover:shadow-sm"
                            }`}
                          onClick={() => useVariation(i)}
                        >
                          <CardContent className="p-5 space-y-3">
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Variation #{i + 1}</span>
                              {activeVariationIndex === i && <CheckCircle className="w-4 h-4 text-[#FF6E30]" />}
                            </div>
                            <h5 className="font-bold text-sm text-slate-900 dark:text-white leading-tight line-clamp-2">
                              {v.headline}
                            </h5>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 italic">
                              {v.subheadline}
                            </p>
                            <div className="pt-2 flex items-center justify-between">
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold">{v.primaryCta}</span>
                              <Button size="sm" variant="ghost" className="h-7 px-2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                Select <ArrowRight className="w-3 h-3 ml-1" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {/* Original Version Card */}
                      <Card
                        className={`group cursor-pointer transition-all duration-300 overflow-hidden ${activeVariationIndex === -1
                            ? "ring-2 ring-[#FF6E30] border-transparent shadow-md"
                            : "border-slate-200 dark:border-slate-800 hover:border-[#FF6E30]/30 hover:shadow-sm"
                          }`}
                        onClick={() => useVariation(-1)}
                      >
                        <CardContent className="p-5 space-y-3">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Original Generation</span>
                            {activeVariationIndex === -1 && <CheckCircle className="w-4 h-4 text-[#FF6E30]" />}
                          </div>
                          <h5 className="font-bold text-sm text-slate-900 dark:text-white leading-tight line-clamp-2">
                            {result.headline}
                          </h5>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 italic">
                            {result.subheadline}
                          </p>
                          <div className="pt-2 flex items-center justify-between">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-[#FF6E30]/10 text-[#FF6E30] font-bold">{result.primaryCta}</span>
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                              Select <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
