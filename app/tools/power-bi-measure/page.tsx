"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Copy, CheckCircle, BarChart3, TrendingUp, Sparkles, Database, Code2, Presentation, ShieldCheck, Zap, Activity, Info, ArrowRight, MousePointer2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ContentLoadingScreen } from "@/components/loading-screen"

interface GeneratedKPI {
  title: string
  daxMeasure: string
  visualization: string
}

export default function PowerBIMeasureGenerator() {
  const [businessContext, setBusinessContext] = useState("")
  const [kpiDescription, setKpiDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string>("")
  const [parsedKPIs, setParsedKPIs] = useState<GeneratedKPI[]>([])
  const { toast } = useToast()

  const parseKPIContent = (content: string): GeneratedKPI[] => {
    const kpis: GeneratedKPI[] = []
    const sections = content.split("---").filter((section) => section.trim())

    sections.forEach((section) => {
      const lines = section
        .trim()
        .split("\n")
        .filter((line) => line.trim())
      if (lines.length === 0) return

      let title = ""
      let daxMeasure = ""
      let visualization = ""
      let inCodeBlock = false
      let codeLines: string[] = []

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()

        if (line.match(/^\d+\.\s\*\*.*\*\*/) || (line.startsWith("**") && line.endsWith("**"))) {
          title = line.replace(/^\d+\.\s/, "").replace(/\*\*/g, "")
        } else if (line.includes("**DAX Measure**:")) {
          continue
        } else if (line === "```" && !inCodeBlock) {
          inCodeBlock = true
          codeLines = []
        } else if (line === "```" && inCodeBlock) {
          inCodeBlock = false
          daxMeasure = codeLines.join("\n")
        } else if (inCodeBlock) {
          codeLines.push(line)
        } else if (line.includes("**Recommended Visualization**:")) {
          visualization = line.replace("**Recommended Visualization**:", "").trim()
        }
      }

      if (title && (daxMeasure || visualization)) {
        kpis.push({ title, daxMeasure, visualization })
      }
    })

    return kpis
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!businessContext.trim() || !kpiDescription.trim()) {
      toast({
        title: "Information Gap Detected",
        description: "Linguistic input requires both context and KPI parameters for synchronization.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setGeneratedContent("")
    setParsedKPIs([])

    try {
      const response = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/pbi-measure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessContext,
          kpiDescription,
        }),
      })

      if (!response.ok) {
        throw new Error(`Data node synchronization failed: ${response.status}`)
      }

      const data = await response.json()

      if (data && Array.isArray(data) && data.length > 0 && data[0].text) {
        const content = data[0].text
        setGeneratedContent(content)
        const parsed = parseKPIContent(content)
        setParsedKPIs(parsed)

        toast({
          title: "Synthesis Complete",
          description: "DAX logical clusters have been successfully generated.",
        })
      } else {
        throw new Error("Received malformed linguistic output bundle.")
      }
    } catch (error) {
      console.error("Neural processing error:", error)
      toast({
        title: "Synthesis Error",
        description: "Failed to calibrate DAX measures. Please re-engage.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Vector Copied",
        description: "DAX logical string is now in your clipboard.",
      })
    } catch (error) {
      toast({
        title: "Buffer Error",
        description: "Failed to store vector in local clipboard.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-[var(--mist)] text-[var(--night)] transition-colors duration-300 pb-32">
      {/* Premium Sticky Identity Header */}
      <div className="bg-[var(--cloud)]/60 backdrop-blur-2xl border-b border-[var(--iron)] pt-24 pb-8 fixed top-0 w-full z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#FF7435] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#FF7435]/30">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-3xl font-black font-poppins text-[var(--night)] tracking-tighter uppercase leading-none mb-1">
                   DAX <span className="text-[#FF7435]">Nexus</span>
                </h1>
                <Badge className="bg-[var(--night)] text-white border-none font-black px-3 py-1 rounded-lg text-[9px] uppercase tracking-widest opacity-80">v2.4 Analytic Engine</Badge>
              </div>
            </div>
            <div className="flex items-center gap-6">
               <div className="text-right hidden sm:block">
                  <div className="text-[9px] font-black uppercase tracking-widest text-[var(--steel)]">Processor Mode</div>
                  <div className="text-xs font-black text-[var(--night)] uppercase flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                     Active
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-[164px] max-w-7xl mx-auto px-6 lg:px-10 mt-16 lg:mt-24">
        {isLoading ? (
          <div className="h-[60vh] flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-700">
             <div className="relative">
                <div className="w-24 h-24 border-8 border-[var(--iron)] rounded-full animate-spin border-t-[#FF7435]"></div>
                <Database className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-[#FF7435]" />
             </div>
             <p className="text-sm font-black uppercase tracking-[0.4em] text-[var(--steel)] animate-pulse">Synchronizing Data Models...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
            
            {/* Mission Configuration Panel */}
            <div className="xl:col-span-5 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
              <Card className="card p-10 shadow-2xl shadow-black/5 border-2 border-[var(--iron)]/50">
                <CardHeader className="px-0 pt-0 pb-10 border-b-2 border-[var(--iron)]/40 mb-10">
                  <div className="flex items-center gap-3">
                     <Database className="w-6 h-6 text-[#FF7435]" />
                     <CardTitle className="text-2xl font-black font-poppins uppercase tracking-tighter">Data Blueprint</CardTitle>
                  </div>
                  <CardDescription className="font-bold text-[var(--steel)] italic uppercase tracking-widest text-[10px] mt-2">Initialize measurement logic.</CardDescription>
                </CardHeader>
                
                <CardContent className="px-0 pb-0">
                  <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="space-y-4">
                      <Label className="field-label font-black text-xs uppercase tracking-widest flex items-center gap-2">
                         <Info className="w-3.5 h-3.5 text-[#FF7435]" /> Business Environmental Context
                      </Label>
                      <Textarea
                        placeholder="Detail your operational environment and data architecture..."
                        value={businessContext}
                        onChange={(e) => setBusinessContext(e.target.value)}
                        className="min-h-[160px] input rounded-[2.5rem] pt-8"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-4 pt-10 border-t-2 border-[var(--iron)]/40">
                      <Label className="field-label font-black text-xs uppercase tracking-widest flex items-center gap-2">
                         <Target className="w-3.5 h-3.5 text-[#FF7435]" /> Extraction Objectives (KPIs)
                      </Label>
                      <Textarea
                        placeholder="Define the specific performance metrics required..."
                        value={kpiDescription}
                        onChange={(e) => setKpiDescription(e.target.value)}
                        className="min-h-[160px] input rounded-[2.5rem] pt-8"
                        disabled={isLoading}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || !businessContext.trim() || !kpiDescription.trim()}
                      className="btn-primary w-full h-20 text-xs font-black uppercase tracking-[0.3em] rounded-full shadow-2xl shadow-[#FF7435]/30 group"
                    >
                      <>
                        Execute Logical Synthesis
                        <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-1" />
                      </>
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Generated Analytic Outputs */}
            <div className="xl:col-span-7 space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
              {parsedKPIs.length > 0 ? (
                <div className="space-y-10">
                   <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-4">
                         <Sparkles className="w-8 h-8 text-[#FF7435]" />
                         <div>
                            <h3 className="text-3xl font-black font-poppins uppercase tracking-tighter">Analytic Assets</h3>
                            <p className="text-[10px] font-black text-[var(--steel)] uppercase tracking-[0.3em] opacity-60">Verified DAX Logical Units</p>
                         </div>
                      </div>
                      <Badge className="bg-emerald-500 text-white border-none font-black px-4 py-2 rounded-full text-[10px] uppercase tracking-widest animate-pulse">Synced</Badge>
                   </div>
                   
                   <div className="space-y-8 max-h-[1000px] overflow-y-auto custom-scrollbar pr-4">
                     {parsedKPIs.map((kpi, index) => (
                       <Card key={index} className="card p-10 md:p-14 border-2 border-[var(--iron)]/60 bg-white shadow-2xl shadow-black/5 relative overflow-hidden group">
                          {/* Premium Decor for Results */}
                          <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF7435]/5 rounded-bl-[10rem] pointer-events-none -z-10"></div>
                          
                          <div className="flex items-center justify-between mb-10">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[var(--night)] text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg">
                                   {index + 1}
                                </div>
                                <h3 className="text-2xl font-black font-poppins text-[var(--night)] tracking-tight">
                                  {kpi.title}
                                </h3>
                             </div>
                             <div className="flex items-center gap-3">
                                <Activity className="w-4 h-4 text-[#FF7435] opacity-40" />
                                <Badge className="bg-[var(--mist)] text-[var(--night)] border-2 border-[var(--iron)] font-black text-[9px] px-3 h-6 uppercase tracking-widest">Optimized</Badge>
                             </div>
                          </div>

                          <div className="space-y-12">
                             {kpi.daxMeasure && (
                               <div className="space-y-4">
                                 <div className="flex items-center justify-between">
                                   <div className="text-[10px] font-black text-[#FF7435] uppercase tracking-[0.4em] flex items-center gap-3">
                                      <Code2 className="w-4 h-4" /> Logical String (DAX)
                                   </div>
                                   <Button
                                     variant="ghost"
                                     size="sm"
                                     onClick={() => copyToClipboard(kpi.daxMeasure)}
                                     className="h-10 px-4 rounded-xl bg-[var(--mist)] border-2 border-[var(--iron)]/40 hover:bg-[#FF7435] hover:text-white hover:border-[#FF7435] text-[10px] font-black uppercase tracking-widest transition-all"
                                   >
                                     <Copy className="h-4 w-4 mr-2" />
                                     Copy Vector
                                   </Button>
                                 </div>
                                 <div className="relative group/code">
                                    <pre className="bg-[var(--night)] text-white p-8 rounded-[2rem] text-sm overflow-x-auto font-mono leading-relaxed border-4 border-white/5 shadow-inner">
                                      <code className="text-orange-200">{kpi.daxMeasure}</code>
                                    </pre>
                                    <div className="absolute top-4 right-4 group-hover/code:opacity-100 opacity-0 transition-opacity">
                                       <Zap className="w-5 h-5 text-[#FF7435] animate-pulse" />
                                    </div>
                                 </div>
                               </div>
                             )}

                             {kpi.visualization && (
                               <div className="space-y-4 pt-10 border-t-2 border-[var(--iron)]/40">
                                 <div className="text-[10px] font-black text-[var(--steel)] uppercase tracking-[0.4em] flex items-center gap-3">
                                    <Presentation className="w-4 h-4" /> Aesthetic Mapping
                                 </div>
                                 <div className="bg-emerald-500/5 border-2 border-emerald-500/20 rounded-[2.5rem] p-8 flex items-center gap-6">
                                    <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border-2 border-emerald-500/20 shadow-inner">
                                       <Activity className="w-8 h-8 text-emerald-500" />
                                    </div>
                                    <p className="text-emerald-900 font-bold text-lg leading-tight italic break-words flex-1">
                                       {kpi.visualization}
                                    </p>
                                 </div>
                               </div>
                             )}
                          </div>
                       </Card>
                     ))}
                   </div>
                </div>
              ) : (
                <div className="card p-32 flex flex-col items-center justify-center text-center space-y-12 border-dashed border-4 border-[var(--iron)]/40 grayscale opacity-40 bg-[var(--mist)]/30 rounded-[3rem] h-full min-h-[700px]">
                   <div className="relative">
                      <div className="absolute inset-0 bg-[#FF7435]/10 rounded-[3rem] scale-125 blur-2xl"></div>
                      <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center mx-auto border-2 border-[var(--iron)] shadow-inner relative z-10">
                        <BarChart3 className="w-16 h-16 text-[var(--steel)]" />
                      </div>
                   </div>
                   <div className="space-y-4">
                     <h3 className="text-3xl font-black font-poppins text-[var(--night)] uppercase tracking-tighter">Extraction Canvas</h3>
                     <p className="text-[var(--steel)] max-w-sm mx-auto font-bold italic leading-relaxed">
                       Input your data environment parameters to synthesize high-fidelity DAX measures and visualization strategies.
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
        )}
      </div>
    </div>
  )
}
