"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Mail, TrendingUp, Star, Sparkles, XCircle, ChevronRight, Copy, Share2, MousePointer2, ArrowRight, Zap, Target, Activity, ShieldCheck, CheckCircle } from "lucide-react"
import { ContentLoadingScreen } from "@/components/loading-screen"

interface GeneratedLine {
  id: number
  subject: string
  preview: string
  predicted_open_rate: number
  category: string
}

interface ApiResponse {
  success: boolean
  timestamp: string
  results: {
    generated_lines: GeneratedLine[]
    total_generated: number
    avg_predicted_rate: number
  }
  metadata: {
    total_options: number
    avg_predicted_open_rate: string
    best_performing: GeneratedLine
  }
}

export default function EmailGenerator() {
  const [formData, setFormData] = useState({
    campaign_type: "",
    target_audience: "",
    product_service: "",
    brand_voice: "",
    industry: "",
    best_subject: "",
    average_open_rate: "",
  })

  const [results, setResults] = useState<GeneratedLine[]>([])
  const [metadata, setMetadata] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/4410c45f-0d03-423a-8276-3080561d6bb4", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          average_open_rate: Number.parseFloat(formData.average_open_rate) || 20.6,
        }),
      })

      if (!response.ok) {
        throw new Error("Linguistic node failed to synchronize.")
      }

      const data: ApiResponse[] = await response.json()
      if (data[0]?.success) {
        setResults(data[0].results.generated_lines)
        setMetadata(data[0].metadata)
      } else {
        throw new Error("Generation failure.")
      }
    } catch (err) {
      setError("Strategic synthesis failed. Please re-engage.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryStyles = (category: string) => {
    switch (category.toLowerCase()) {
      case "urgency":
        return "bg-red-500 text-white border-none shadow-red-500/20"
      case "offer":
        return "bg-emerald-500 text-white border-none shadow-emerald-500/20"
      case "general":
        return "bg-[var(--night)] text-white border-none"
      default:
        return "bg-[var(--iron)] text-[var(--steel)] border-none"
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-[var(--mist)] text-[var(--night)] transition-colors duration-300 pb-32">
      {/* Premium Sticky Header */}
      <div className="bg-[var(--cloud)]/60 backdrop-blur-2xl border-b border-[var(--iron)] pt-24 pb-8 fixed top-0 w-full z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#FF7435] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#FF7435]/30">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-3xl font-black font-poppins text-[var(--night)] tracking-tighter uppercase leading-none mb-1">
                   Subject <span className="text-[#FF7435]">Nexus</span>
                </h1>
                <Badge className="bg-[var(--night)] text-white border-none font-black px-3 py-1 rounded-lg text-[9px] uppercase tracking-widest opacity-80">v4.2 Synthesis Protocol</Badge>
              </div>
            </div>
            <div className="flex items-center gap-6">
               <div className="text-right hidden sm:block">
                  <div className="text-[9px] font-black uppercase tracking-widest text-[var(--steel)]">Neural Mode</div>
                  <div className="text-xs font-black text-[var(--night)] uppercase flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                     Engaged
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-[164px] max-w-7xl mx-auto px-6 lg:px-10 mt-16 lg:mt-24">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
          
          {/* Diagnostic Form Panel */}
          <div className="xl:col-span-5 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <Card className="card p-10 shadow-2xl shadow-black/5 border-2 border-[var(--iron)]/50">
              <CardHeader className="px-0 pt-0 pb-10 border-b-2 border-[var(--iron)]/40 mb-10">
                 <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-[#FF7435]" />
                    <CardTitle className="text-2xl font-black font-poppins uppercase tracking-tighter">Campaign Vectors</CardTitle>
                 </div>
                 <CardDescription className="font-bold text-[var(--steel)] italic uppercase tracking-widest text-[10px] mt-2">Initialize linguistic parameters.</CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="field-label font-black text-xs uppercase tracking-widest">Logic Core</Label>
                    <Select onValueChange={(value) => handleInputChange("campaign_type", value)}>
                      <SelectTrigger className="input h-14 rounded-2xl">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="promotional">Promotional</SelectItem>
                        <SelectItem value="newsletter">Newsletter</SelectItem>
                        <SelectItem value="welcome">Welcome</SelectItem>
                        <SelectItem value="abandoned_cart">Abandoned Cart</SelectItem>
                        <SelectItem value="follow_up">Follow Up</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="field-label font-black text-xs uppercase tracking-widest">Tonal Frequency</Label>
                    <Select onValueChange={(value) => handleInputChange("brand_voice", value)}>
                      <SelectTrigger className="input h-14 rounded-2xl">
                        <SelectValue placeholder="Select voice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="playful">Playful</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="field-label font-black text-xs uppercase tracking-widest">Target Persona</Label>
                  <Textarea
                    placeholder="Identify the specific segment for engagement..."
                    value={formData.target_audience}
                    onChange={(e) => handleInputChange("target_audience", e.target.value)}
                    className="min-h-[120px] input rounded-[2.5rem] pt-8"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label className="field-label font-black text-xs uppercase tracking-widest">Mission Objective / Service</Label>
                  <Input
                    placeholder="The core offering to be communicated..."
                    value={formData.product_service}
                    onChange={(e) => handleInputChange("product_service", e.target.value)}
                    className="input h-14"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="field-label font-black text-xs uppercase tracking-widest">Industry Cluster</Label>
                    <Select onValueChange={(value) => handleInputChange("industry", value)}>
                      <SelectTrigger className="input h-14 rounded-2xl">
                        <SelectValue placeholder="Select cluster" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="saas">SaaS</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="field-label font-black text-xs uppercase tracking-widest">Base Calibration (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="20.6"
                      value={formData.average_open_rate}
                      onChange={(e) => handleInputChange("average_open_rate", e.target.value)}
                      className="input h-14"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="field-label font-black text-xs uppercase tracking-widest">Performance Anchor (Optional)</Label>
                  <Input
                    placeholder="Baseline for current performance comparison..."
                    value={formData.best_subject}
                    onChange={(e) => handleInputChange("best_subject", e.target.value)}
                    className="input h-14"
                  />
                </div>

                {error && (
                  <Alert variant="destructive" className="rounded-2xl border-2 animate-in shake-in">
                    <XCircle className="h-5 w-5" />
                    <AlertDescription className="font-black text-[10px] uppercase tracking-widest">{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={loading || !formData.campaign_type || !formData.target_audience}
                  className="btn-primary w-full h-20 text-xs font-black uppercase tracking-[0.3em] rounded-full shadow-2xl shadow-[#FF7435]/30 group"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      Execute Linguistic Synthesis
                      <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Synthesis Results Panel */}
          <div className="xl:col-span-7 space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
            {metadata && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="card p-10 flex flex-col items-center justify-center text-center space-y-4 border-2 border-[var(--iron)]/50 bg-white">
                  <div className="text-5xl font-black font-poppins text-[var(--night)] tracking-tighter">{metadata.total_options}</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--steel)]">Variations Synthesized</div>
                </Card>
                <Card className="card p-10 flex flex-col items-center justify-center text-center space-y-4 border-2 border-[#FF7435]/20 bg-orange-50/10">
                  <div className="text-5xl font-black font-poppins text-[#FF7435] tracking-tighter">
                    {metadata.avg_predicted_open_rate}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--steel)]">Avg. Conversion Probability</div>
                </Card>
              </div>
            )}

            {results.length > 0 ? (
              <div className="space-y-10">
                <div className="flex items-center justify-between px-2">
                   <div className="flex items-center gap-4">
                      <Star className="w-8 h-8 text-[#FF7435] fill-[#FF7435]" />
                      <h3 className="text-3xl font-black font-poppins uppercase tracking-tighter">High-Yield Outputs</h3>
                   </div>
                   <Badge className="bg-[var(--night)] text-white border-none font-black px-4 py-2 rounded-full text-[10px] uppercase tracking-widest animate-pulse">Live Ranking</Badge>
                </div>
                
                <div className="space-y-8 max-h-[1000px] overflow-y-auto custom-scrollbar pr-4">
                  {results
                    .sort((a, b) => b.predicted_open_rate - a.predicted_open_rate)
                    .map((line, index) => (
                      <div
                        key={line.id}
                        className={`card p-10 md:p-14 border-2 transition-all duration-700 relative group overflow-hidden ${
                          index === 0 
                            ? "border-[#FF7435] bg-white shadow-2xl shadow-orange-500/10 scale-[1.02]" 
                            : "border-[var(--iron)]/50 hover:border-[#FF7435]/40 hover:bg-white"
                        }`}
                      >
                         {/* Ambient Background for Winner */}
                         {index === 0 && (
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF7435]/5 rounded-bl-[10rem] pointer-events-none -z-10 animate-in fade-in duration-1000"></div>
                         )}

                        <div className="flex items-center justify-between mb-10">
                          <Badge className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg ${getCategoryStyles(line.category)}`}>
                            {line.category}
                          </Badge>
                          <div className="flex items-center gap-3 text-[#FF7435]">
                             <Activity className="w-5 h-5 opacity-40" />
                             <div className="flex flex-col items-end">
                                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--steel)]">Conv. Prob.</span>
                                <span className="text-2xl font-black font-poppins leading-none">{line.predicted_open_rate}%</span>
                             </div>
                          </div>
                        </div>

                        <div className="space-y-10">
                          <div className="space-y-4">
                            <div className="text-[9px] font-black text-[#FF7435] uppercase tracking-[0.4em] flex items-center gap-3">
                              <MousePointer2 className="w-3.5 h-3.5" /> Subject Vector
                            </div>
                            <div className="flex items-start justify-between gap-10">
                              <p className="text-2xl md:text-3xl font-black text-[var(--night)] leading-[1.1] font-poppins tracking-tight break-words">{line.subject}</p>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="shrink-0 h-14 w-14 rounded-2xl bg-[var(--mist)] border-2 border-[var(--iron)]/40 hover:bg-[#FF7435] hover:text-white hover:border-[#FF7435] transition-all"
                                onClick={() => copyToClipboard(line.subject)}
                              >
                                <Copy className="w-6 h-6" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-4 pt-10 border-t-2 border-[var(--iron)]/40">
                            <div className="text-[9px] font-black text-[var(--steel)] uppercase tracking-[0.4em] flex items-center gap-3">
                              <ShieldCheck className="w-3.5 h-3.5" /> Integrated Preview String
                            </div>
                            <p className="text-lg text-[var(--steel)] font-bold leading-relaxed italic opacity-80 pl-6 border-l-4 border-[var(--iron)]">
                               "{line.preview}"
                            </p>
                          </div>
                        </div>

                        {index === 0 && (
                          <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                             <div className="bg-[#FF7435] text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-2xl border-2 border-white animate-pulse">
                                Highest Confidence Pick
                             </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="card p-32 flex flex-col items-center justify-center text-center space-y-10 border-dashed border-4 border-[var(--iron)]/40 grayscale opacity-40 bg-[var(--mist)]/30 rounded-[3rem]">
                <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center border-2 border-[var(--iron)] shadow-inner">
                  <Activity className="w-12 h-12 text-[var(--steel)]" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black font-poppins text-[var(--night)] uppercase tracking-tighter">Diagnostic Nexus</h3>
                  <p className="text-[var(--steel)] max-w-sm mx-auto font-bold italic leading-relaxed">
                    Awaiting vector input through the primary terminal. Once synchronized, AI will extrapolate performance metrics here.
                  </p>
                </div>
                <div className="w-full max-w-md space-y-6 pt-12 opacity-50 flex flex-col items-center pointer-events-none">
                   <div className="h-20 bg-white rounded-3xl w-full border-2 border-dashed border-[var(--iron)]"></div>
                   <div className="h-16 bg-white rounded-full w-2/3 border-2 border-dashed border-[var(--iron)]"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
