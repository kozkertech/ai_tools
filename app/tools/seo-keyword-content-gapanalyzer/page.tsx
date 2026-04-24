"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Loader2,
  Search,
  TrendingUp,
  Target,
  Users,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Globe,
  Mail,
  Zap,
  Activity,
  ShieldCheck,
  Sparkles,
  MousePointer2,
  ArrowUpRight,
  Filter,
  BarChart,
  LayoutDashboard,
  ExternalLink,
  MapPin,
  RefreshCcw,
  XCircle
} from "lucide-react"

import { SEOLoadingScreen } from "@/components/loading-screen"

interface KeywordData {
  word: string
  count: number
}

interface SEOReport {
  analysis_date: string
  seo_score: number
  current_keywords: KeywordData[]
  keyword_opportunities: {
    total_found: number
    priority_keywords: string[]
    long_tail_opportunities: string[]
  }
  content_gaps: {
    missing_topics: string[]
    gap_count: number
    coverage_score: number
  }
  competitor_analysis: {
    competitors_found: number
    competitor_domains: string[]
  }
  recommendations: string[]
  next_steps: string[]
}

interface AnalysisResult {
  seo_report: SEOReport
  lead_info: {
    email: string
    analysis_date: string
  }
}

export default function SEOAnalyzer() {
  const [formData, setFormData] = useState({
    email: "",
    website_url: "",
    main_topic: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/seo-analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Spectrum analysis failed. Re-calibration required.")
      }

      const data = await response.json()
      setResult(Array.isArray(data) ? data[0] : data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "A critical fault occurred during crawl.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const resetForm = () => {
    setResult(null)
    setFormData({ email: "", website_url: "", main_topic: "" })
    setError("")
  }

   if (isLoading) {  
     return <SEOLoadingScreen />  
   }

  if (result) {
    return (
      <div className="min-h-screen bg-[var(--mist)] text-[var(--night)] transition-colors duration-300 pb-32">
        {/* Premium Reporting Header */}
        <div className="bg-[var(--cloud)]/60 backdrop-blur-2xl border-b border-[var(--iron)] pt-24 pb-8 sticky top-0 w-full z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-[#FF7435] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#FF7435]/30">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <div>
                   <h1 className="text-2xl font-black font-poppins text-[var(--night)] tracking-tighter uppercase leading-none mb-1">
                      Signal <span className="text-[#FF7435]">Report</span>
                   </h1>
                   <p className="text-[10px] font-black text-[var(--steel)] uppercase tracking-[0.3em]">Analysis Node: {result.seo_report.analysis_date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black px-4 py-2 rounded-full text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Signal Authenticated
                 </Badge>
                 <Button onClick={resetForm} variant="outline" className="h-12 px-6 border-2 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all border-[var(--iron)] group">
                   <RefreshCcw className="w-3.5 h-3.5 mr-2 group-hover:rotate-180 transition-transform duration-500" /> New Scan
                 </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-16 max-w-7xl mx-auto px-6 lg:px-10 mt-8">
          {/* Executive Scorecard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              { label: "Search Affinity Score", value: `${result.seo_report.seo_score}%`, icon: TrendingUp, color: "text-[#FF7435]", bg: "bg-orange-50 border-orange-100" },
              { label: "Semantic Token Count", value: result.seo_report.current_keywords.length, icon: Search, color: "text-blue-500", bg: "bg-blue-50 border-blue-100" },
              { label: "Content Topology Coverage", value: `${result.seo_report.content_gaps.coverage_score}%`, icon: Target, color: "text-emerald-500", bg: "bg-emerald-50 border-emerald-100" },
              { label: "Market Competitors", value: result.seo_report.competitor_analysis.competitors_found, icon: Users, color: "text-purple-500", bg: "bg-purple-50 border-purple-100" }
            ].map((stat, i) => (
              <Card key={i} className={`card p-8 border-2 shadow-2xl shadow-black/5 ${stat.bg}`}>
                <div className="flex items-center justify-between mb-4">
                   <div className={`p-3 rounded-xl bg-white border-2 border-inherit ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                   </div>
                   <Activity className="w-4 h-4 opacity-20" />
                </div>
                <p className="text-[10px] font-black text-[var(--steel)] uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <p className={`text-4xl font-black font-poppins tracking-tighter ${stat.color}`}>{stat.value}</p>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Primary Analysis Grid */}
            <div className="lg:col-span-8 space-y-10">
              {/* Score Breakdown */}
              <Card className="card p-10 border-2 border-[var(--iron)] shadow-2xl shadow-black/5 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF7435]/5 rounded-bl-[12rem] pointer-events-none"></div>
                <CardHeader className="px-0 pt-0 pb-10 border-b-2 border-dashed border-[var(--iron)]/40 mb-10">
                   <CardTitle className="text-xl font-black font-poppins uppercase tracking-tight flex items-center gap-3">
                      <BarChart className="w-5 h-5 text-[#FF7435]" /> Score Breakdown
                   </CardTitle>
                </CardHeader>
                <div className="space-y-12">
                   <div className="space-y-4">
                      <div className="flex justify-between items-baseline">
                         <span className="text-xs font-black uppercase tracking-widest text-[var(--night)]">Global SEO Vector</span>
                         <span className="text-3xl font-black font-poppins text-[#FF7435]">{result.seo_report.seo_score}/100</span>
                      </div>
                      <div className="h-6 bg-[var(--mist)] rounded-full border-2 border-white shadow-inner overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${result.seo_report.seo_score}%` }} 
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-[#FF7435] to-orange-400 relative"
                        >
                           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 animate-pulse"></div>
                        </motion.div>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="flex justify-between items-baseline">
                         <span className="text-xs font-black uppercase tracking-widest text-[var(--night)]">Content Structural Integrity</span>
                         <span className="text-3xl font-black font-poppins text-emerald-500">{result.seo_report.content_gaps.coverage_score}/100</span>
                      </div>
                      <div className="h-6 bg-[var(--mist)] rounded-full border-2 border-white shadow-inner overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${result.seo_report.content_gaps.coverage_score}%` }} 
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 relative"
                        >
                           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                        </motion.div>
                      </div>
                   </div>
                </div>
              </Card>

              {/* Recommendations Flow */}
              <Card className="card p-10 border-2 border-[var(--iron)] shadow-2xl shadow-black/5 bg-white">
                <CardHeader className="px-0 pt-0 pb-10 border-b-2 border-dashed border-[var(--iron)]/40 mb-10">
                   <CardTitle className="text-xl font-black font-poppins uppercase tracking-tight flex items-center gap-3">
                      <Zap className="w-5 h-5 text-yellow-500" /> Strategic Recommendations
                   </CardTitle>
                </CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.seo_report.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-4 p-6 bg-[var(--mist)] rounded-3xl border-2 border-transparent hover:border-[#FF7435]/30 transition-all group">
                      <ArrowRight className="w-5 h-5 text-[#FF7435] mt-1 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                      <span className="text-sm font-bold text-[var(--night)] leading-relaxed">{rec}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Side Analytic Clusters */}
            <div className="lg:col-span-4 space-y-10">
              {/* Keyword Cloud */}
              <Card className="card p-0 shadow-2xl shadow-black/5 border-2 border-[var(--iron)] overflow-hidden">
                <CardHeader className="bg-[var(--night)] text-white p-8">
                   <CardTitle className="text-xs font-black uppercase tracking-[0.4em] opacity-60">High-Density Tokens</CardTitle>
                   <div className="mt-4 flex items-center justify-between">
                      <span className="text-3xl font-black font-poppins">Keyword Matrix</span>
                      <Filter className="w-5 h-5 text-[#FF7435]" />
                   </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {result.seo_report.current_keywords.slice(0, 15).map((keyword, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-[var(--mist)] rounded-2xl group hover:bg-white border-2 border-transparent hover:border-[var(--iron)] transition-all">
                        <span className="font-black text-xs uppercase tracking-tight text-[var(--night)]">{keyword.word}</span>
                        <Badge className="bg-white border-2 border-[var(--iron)] text-[var(--night)] font-black text-[10px] px-3 h-8 shadow-sm">
                          {keyword.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Competitive Landscape */}
              <Card className="card p-0 shadow-2xl shadow-black/5 border-2 border-[var(--iron)] overflow-hidden">
                <CardHeader className="bg-[var(--night)] text-white p-8">
                   <CardTitle className="text-xs font-black uppercase tracking-[0.4em] opacity-60">Market Vectors</CardTitle>
                   <div className="mt-4 flex items-center justify-between">
                      <span className="text-3xl font-black font-poppins">Competitors</span>
                      <Globe className="w-5 h-5 text-blue-500" />
                   </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-4">
                    {result.seo_report.competitor_analysis.competitor_domains.map((domain, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-[var(--mist)] rounded-2xl group border-2 border-transparent hover:border-blue-500/30 transition-all">
                        <div className="flex items-center gap-3">
                           <LayoutDashboard className="w-4 h-4 text-blue-500 opacity-40" />
                           <span className="text-xs font-bold text-[var(--night)] tracking-tight">{domain}</span>
                        </div>
                        <ExternalLink className="w-3 h-3 text-[var(--steel)] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Implementation Path */}
              <Card className="card p-8 border-2 border-[var(--iron)] bg-white">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--steel)] mb-8 flex items-center gap-3">
                   <Target className="w-4 h-4 text-[#FF7435]" /> Deployment Protocol
                </CardTitle>
                <div className="space-y-6">
                  {result.seo_report.next_steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[var(--night)] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-lg">
                        {index + 1}
                      </div>
                      <span className="text-xs font-bold text-[var(--night)] leading-relaxed pt-1.5">{step}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--mist)] text-[var(--night)] transition-colors duration-300 pb-32">
      {/* Premium Search Identity Header */}
      <div className="bg-[var(--cloud)]/60 backdrop-blur-2xl border-b border-[var(--iron)] pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-10 text-center">
          <div className="flex justify-center mb-8 animate-in zoom-in duration-700">
            <div className="w-20 h-20 bg-[#FF7435] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#FF7435]/30">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black font-poppins text-[var(--night)] mb-6 tracking-tighter uppercase animate-in fade-in slide-in-from-bottom-8 duration-700">
             Signal <span className="text-[#FF7435]">Crawl</span>
          </h1>
          <p className="text-xl text-[var(--steel)] max-w-2xl mx-auto font-bold italic leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000">
            De-obfuscate keyword density, synchronize content gaps, and manifest high-fidelity SEO strategies using executive-grade signal processing.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 -mt-12 mb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
           
           {/* Scan Configuration */}
           <div className="lg:col-span-12 xl:col-span-6 xl:col-start-4">
              <Card className="card p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border-2 border-[var(--iron)] bg-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF7435]/5 rounded-bl-[10rem] pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
                
                <CardHeader className="px-0 pt-0 pb-12 border-b-2 border-dashed border-[var(--iron)]/40 mb-10">
                  <CardTitle className="text-2xl font-black font-poppins uppercase tracking-tighter">Mission Blueprint</CardTitle>
                  <CardDescription className="font-bold text-[var(--steel)] italic uppercase tracking-[0.2em] text-[10px] mt-2">Initialize signal parameters for deep crawl.</CardDescription>
                </CardHeader>
                
                <CardContent className="px-0 pb-0">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                      <Label className="field-label font-black text-xs uppercase tracking-widest flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#FF7435]" /> Operational Terminal (Email)
                      </Label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@nexus.io"
                        required
                        className="input h-14"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="field-label font-black text-xs uppercase tracking-widest flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#FF7435]" /> Target Domain URL
                      </Label>
                      <Input
                        name="website_url"
                        type="url"
                        value={formData.website_url}
                        onChange={handleInputChange}
                        placeholder="https://target-signal.com"
                        required
                        className="input h-14"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="field-label font-black text-xs uppercase tracking-widest flex items-center gap-2">
                        <Target className="w-4 h-4 text-[#FF7435]" /> Core Industry / Topic Signal
                      </Label>
                      <Textarea
                        name="main_topic"
                        value={formData.main_topic}
                        onChange={handleInputChange}
                        placeholder="Define the semantic niche for extraction..."
                        required
                        className="min-h-[120px] input pt-8 px-8 rounded-[2.5rem]"
                      />
                    </div>

                    {error && (
                      <div className="p-6 bg-red-50 border-2 border-red-200 rounded-3xl animate-in shake-in">
                        <div className="flex items-center gap-3">
                           <XCircle className="w-5 h-5 text-red-600" />
                           <p className="text-red-900 font-black text-[10px] uppercase tracking-widest leading-none">{error}</p>
                        </div>
                      </div>
                    )}

                    <Button type="submit" disabled={isLoading} className="w-full btn-primary h-20 text-xs font-black uppercase tracking-[0.4em] rounded-full shadow-2xl shadow-[#FF7435]/30 group">
                      {isLoading ? (
                        <>
                          <Loader2 className="w-6 h-6 mr-4 animate-spin" />
                          Calibrating Spectrum...
                        </>
                      ) : (
                        <>
                          Initialize Signal Crawl
                          <Search className="w-6 h-6 ml-4 group-hover:scale-125 transition-transform" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
           </div>
        </div>

        {/* Informational Micro-Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto grayscale opacity-50 select-none">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-white border-2 border-[var(--iron)] rounded-3xl flex items-center justify-center mx-auto shadow-inner group transition-all">
              <Search className="w-8 h-8 text-[var(--steel)]" />
            </div>
            <div>
              <h3 className="text-lg font-black font-poppins uppercase text-[var(--night)]">Semantic Matrix</h3>
              <p className="text-[var(--steel)] font-bold text-xs leading-relaxed mt-2 italic">Deconstruct high-impact tokens with precision.</p>
            </div>
          </div>
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-white border-2 border-[var(--iron)] rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <Target className="w-8 h-8 text-[var(--steel)]" />
            </div>
            <div>
              <h3 className="text-lg font-black font-poppins uppercase text-[var(--night)]">Gap Extraction</h3>
              <p className="text-[var(--steel)] font-bold text-xs leading-relaxed mt-2 italic">Identify missing content vectors in the niche.</p>
            </div>
          </div>
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-white border-2 border-[var(--iron)] rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <TrendingUp className="w-8 h-8 text-[var(--steel)]" />
            </div>
            <div>
              <h3 className="text-lg font-black font-poppins uppercase text-[var(--night)]">Logical Synthesis</h3>
              <p className="text-[var(--steel)] font-bold text-xs leading-relaxed mt-2 italic">Actionable recommendations for growth.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
