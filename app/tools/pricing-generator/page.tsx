"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2, Sparkles, Check, X, LayoutDashboard, Zap, ShieldCheck, Mail, Target, Package, ArrowRight, RefreshCcw, Coins, Building2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface FormData {
  name: string
  email: string
  productService: string
  planDifferentiation: string
  numberOfPlans: string
}

interface WebhookResponse {
  output?: string
  [key: string]: any
}

export default function PricingGenerator() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    productService: "",
    planDifferentiation: "",
    numberOfPlans: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<WebhookResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    setResponse(null)

    try {
      const res = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/pricing-page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || `Logical breach in financial synthesis: ${res.status}`)
      }

      if (Array.isArray(data) && data.length > 0 && data[0].output) {
        setResponse({ output: data[0].output })
      } else if (data.output) {
        setResponse(data)
      } else {
        setResponse(data)
      }
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "A critical fault occurred during valuation synthesis.")
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.name && formData.email && formData.productService && formData.numberOfPlans

  const renderMarkdownContent = (content: string) => {
    const lines = content.split("\n")
    const elements: React.ReactNode[] = []
    let currentTable: string[][] = []
    let inTable = false

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()

        if (!line) {
            if (inTable && currentTable.length > 0) {
                elements.push(renderTable(currentTable, elements.length))
                currentTable = []
                inTable = false
            }
            elements.push(<div key={elements.length} className="h-6" />)
            continue
        }

        if (line.startsWith("|") && line.endsWith("|")) {
            if (!inTable) {
                inTable = true
                currentTable = []
            }
            const cells = line
                .split("|")
                .slice(1, -1)
                .map((cell) => cell.trim())
            if (!cells.every((cell) => cell.match(/^-+$/))) {
                currentTable.push(cells)
            }
            continue
        } else if (inTable) {
            if (currentTable.length > 0) {
                elements.push(renderTable(currentTable, elements.length))
                currentTable = []
            }
            inTable = false
        }

        if (line.startsWith("# ")) {
            elements.push(
                <h1 key={elements.length} className="text-4xl md:text-5xl font-black font-poppins text-[var(--night)] tracking-tighter uppercase mb-8 border-b-4 border-[#FF7435] pb-4 inline-block">
                    {parseInlineFormatting(line.substring(2))}
                </h1>,
            )
        } else if (line.startsWith("## ")) {
            elements.push(
                <h2 key={elements.length} className="text-2xl md:text-3xl font-black font-poppins text-[var(--night)] tracking-tighter uppercase mb-6 mt-12 flex items-center gap-4">
                    <div className="h-8 w-2 bg-[#FF7435] rounded-full"></div>
                    {parseInlineFormatting(line.substring(3))}
                </h2>,
            )
        } else if (line.startsWith("### ")) {
            elements.push(
                <h3 key={elements.length} className="text-xl md:text-2xl font-black font-poppins text-[var(--night)] tracking-tighter uppercase mb-4 mt-10">
                    {parseInlineFormatting(line.substring(4))}
                </h3>,
            )
        } else if (line === "---") {
            elements.push(<hr key={elements.length} className="border-[var(--iron)] border-2 border-dashed my-12" />)
        } else if (line.startsWith("- ")) {
            elements.push(
                <div key={elements.length} className="flex items-start mb-3 group">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center mr-4 mt-0.5 group-hover:scale-110 transition-transform">
                       <Check className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-sm font-bold text-[var(--night)]/80 leading-relaxed">{parseInlineFormatting(line.substring(2))}</span>
                </div>,
            )
        } else if (line.startsWith("👉 ")) {
            elements.push(
                <div key={elements.length} className="my-8">
                   <Button
                     className="h-14 px-10 bg-[var(--night)] hover:bg-[#FF7435] text-white font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl shadow-2xl transition-all group"
                   >
                     {parseInlineFormatting(line.substring(3))}
                     <ArrowRight className="w-4 h-4 ml-4 group-hover:translate-x-2 transition-transform" />
                   </Button>
                </div>
            )
        } else {
            elements.push(
                <p key={elements.length} className="text-sm font-bold text-[var(--night)]/70 leading-loose mb-6 italic">
                    {parseInlineFormatting(line)}
                </p>,
            )
        }
    }

    if (inTable && currentTable.length > 0) {
        elements.push(renderTable(currentTable, elements.length))
    }

    return elements
  }

  const parseInlineFormatting = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index} className="font-black text-[var(--night)]">{part.slice(2, -2)}</strong>
      }
      if (part === "✅") return <CheckCircle key={index} className="w-4 h-4 text-emerald-500 inline mr-1" />
      if (part === "❌") return <XCircle key={index} className="w-4 h-4 text-red-500 inline mr-1" />
      return part
    })
  }

  const renderTable = (tableData: string[][], key: number) => {
    if (tableData.length === 0) return null
    const headers = tableData[0]
    const rows = tableData.slice(1)

    return (
      <div key={key} className="overflow-hidden mb-12 rounded-[2rem] border-2 border-[var(--iron)] shadow-2xl shadow-black/5 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[var(--night)]">
                {headers.map((header, index) => (
                  <th key={index} className="px-8 py-6 text-left font-black text-[10px] uppercase tracking-[0.4em] text-white/60">
                    {parseInlineFormatting(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--iron)]/40">
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-[var(--mist)] transition-colors group">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-8 py-6 text-xs font-bold text-[var(--night)]/80 leading-relaxed group-hover:text-[var(--night)] transition-colors">
                      {parseInlineFormatting(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--mist)] text-[var(--night)] transition-colors duration-300 pb-32">
      {/* Premium Identity Header */}
      <div className="bg-[var(--cloud)]/60 backdrop-blur-2xl border-b border-[var(--iron)] pt-24 pb-8 sticky top-0 w-full z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#FF7435] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#FF7435]/30">
                <Coins className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black font-poppins text-[var(--night)] tracking-tighter uppercase leading-none mb-1">
                   Price <span className="text-[#FF7435]">Nexus</span>
                </h1>
                <p className="text-[10px] font-black text-[var(--steel)] uppercase tracking-[0.4em]">Valuation Synthesis Engine v1.1</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block mr-4">
                  <div className="text-[9px] font-black uppercase tracking-widest text-[var(--steel)]">Market Status</div>
                  <div className="text-xs font-black text-[var(--night)] uppercase flex items-center justify-end gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                     Stable
                  </div>
               </div>
               <Button onClick={() => setResponse(null)} variant="outline" className="h-14 px-8 border-2 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all border-[var(--iron)] group">
                 <RefreshCcw className="w-4 h-4 mr-3 group-hover:rotate-180 transition-transform duration-500" /> New Ledger
               </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-16 max-w-7xl mx-auto px-6 lg:px-10 mt-12 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Valuation Parameters Form */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-10">
             <Card className="card p-12 shadow-2xl shadow-black/5 border-2 border-[var(--iron)]/50 bg-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF7435]/5 rounded-bl-[10rem] pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
                
                <CardHeader className="px-0 pt-0 pb-10 border-b-2 border-dashed border-[var(--iron)]/40 mb-10">
                   <div className="flex items-center gap-4">
                      <LayoutDashboard className="w-6 h-6 text-[#FF7435]" />
                      <CardTitle className="text-2xl font-black font-poppins uppercase tracking-tighter">Mission Parameters</CardTitle>
                   </div>
                </CardHeader>
                
                <CardContent className="px-0 pb-0 space-y-8">
                   <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                         <div className="space-y-3">
                            <Label className="field-label font-black text-[10px] uppercase tracking-widest opacity-70">Administrator Name *</Label>
                            <Input value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required placeholder="John Doe" className="input h-14" />
                         </div>
                         <div className="space-y-3">
                            <Label className="field-label font-black text-[10px] uppercase tracking-widest opacity-70">Secured Email *</Label>
                            <Input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} required placeholder="john@nexus.com" className="input h-14" />
                         </div>
                      </div>

                      <div className="space-y-3">
                         <Label className="field-label font-black text-[10px] uppercase tracking-widest opacity-70">Asset/Service Description *</Label>
                         <Textarea value={formData.productService} onChange={(e) => handleInputChange("productService", e.target.value)} required placeholder="Define core features and market utility..." rows={4} className="input pt-6 px-6 min-h-[120px] rounded-[2.5rem]" />
                      </div>

                      <div className="space-y-3">
                         <Label className="field-label font-black text-[10px] uppercase tracking-widest opacity-70">Tier Differentiation Strategy</Label>
                         <Textarea value={formData.planDifferentiation} onChange={(e) => handleInputChange("planDifferentiation", e.target.value)} placeholder="Define the structural levers for each plan..." rows={3} className="input pt-6 px-6 min-h-[100px] rounded-[2rem]" />
                      </div>

                      <div className="space-y-3">
                         <Label className="field-label font-black text-[10px] uppercase tracking-widest opacity-70">Ledger Count (Plans) *</Label>
                         <Select value={formData.numberOfPlans} onValueChange={(value) => handleInputChange("numberOfPlans", value)}>
                           <SelectTrigger className="input h-14">
                             <SelectValue placeholder="Select Plan Density" />
                           </SelectTrigger>
                           <SelectContent className="bg-white border-2 border-[var(--iron)] rounded-2xl shadow-2xl">
                             {[1, 2, 3, 4, 5].map((num) => (
                               <SelectItem key={num} value={num.toString()} className="font-bold py-3">
                                 {num} {num === 1 ? "Strategic Plan" : "Strategic Plans"}
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                      </div>

                      <Button type="submit" disabled={!isFormValid || isLoading} className="w-full btn-primary h-20 text-xs font-black uppercase tracking-[0.4em] rounded-full shadow-2xl shadow-[#FF7435]/30 group">
                        {isLoading ? (
                          <><Loader2 className="w-6 h-6 mr-4 animate-spin" /> Calculating Ratios...</>
                        ) : (
                          <>Manifest Financial tiers <Sparkles className="w-6 h-6 ml-4 group-hover:scale-125 transition-transform" /></>
                        )}
                      </Button>
                   </form>

                   <AnimatePresence>
                      {error && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-red-50 border-2 border-red-200 rounded-3xl flex items-center gap-4">
                           <XCircle className="w-6 h-6 text-red-600 shrink-0" />
                           <span className="text-xs font-black uppercase tracking-widest text-red-900 leading-tight">{error}</span>
                        </motion.div>
                      )}
                      {success && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-emerald-50 border-2 border-emerald-200 rounded-3xl flex items-center gap-4">
                           <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                           <span className="text-xs font-black uppercase tracking-widest text-emerald-900 leading-tight">Synthesis successful. Ledger updated.</span>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </CardContent>
             </Card>
          </div>

          {/* Generated Commercial Canvas Display */}
          <div className="lg:col-span-12 xl:col-span-7">
             <AnimatePresence mode="wait">
                {response && response.output ? (
                  <motion.div key="results" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-4">
                     <Card className="card p-12 md:p-16 border-2 border-[var(--iron)] shadow-2xl shadow-black/5 bg-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF7435]/5 rounded-bl-[12rem] pointer-events-none"></div>
                        <CardHeader className="px-0 pt-0 pb-12 border-b-2 border-dashed border-[var(--iron)]/40 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                           <div className="flex items-center gap-4">
                              <Package className="w-6 h-6 text-[#FF7435]" />
                              <div>
                                 <CardTitle className="text-xs font-black uppercase tracking-[0.4em] opacity-60">Commercial Manifest</CardTitle>
                                 <p className="text-2xl font-black font-poppins uppercase tracking-tighter">Valuation Ledger</p>
                              </div>
                           </div>
                           <Badge className="bg-[var(--night)] text-white border-none font-black px-4 py-2 rounded-xl text-[9px] uppercase tracking-widest opacity-80 h-10">Export Ready</Badge>
                        </CardHeader>
                        <CardContent className="px-0 pb-0">
                           <div className="prose-custom">
                              {renderMarkdownContent(response.output)}
                           </div>
                        </CardContent>
                     </Card>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-32 flex flex-col items-center justify-center text-center space-y-12 border-dashed border-4 border-[var(--iron)]/40 grayscale opacity-40 bg-[var(--mist)]/30 rounded-[4rem] h-full min-h-[600px] select-none pointer-events-none">
                     <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center mx-auto border-2 border-[var(--iron)] shadow-inner">
                       <Building2 className="w-16 h-16 text-[var(--steel)]" />
                     </div>
                     <div className="space-y-4">
                       <h3 className="text-3xl font-black font-poppins text-[var(--night)] uppercase tracking-tighter">Awaiting Logic Injection</h3>
                       <p className="text-[var(--steel)] max-w-sm mx-auto font-bold italic leading-relaxed">
                          Define your commercial parameters on the left to manifest high-fidelity financial tiers here.
                       </p>
                     </div>
                     <div className="w-full max-w-md pt-12 space-y-8 opacity-30">
                        <div className="h-12 bg-white rounded-2xl border-2 border-dashed border-[var(--iron)]"></div>
                        <div className="h-48 bg-white rounded-3xl border-2 border-dashed border-[var(--iron)]"></div>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>

        {/* Informational Micro-Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-12 border-t-2 border-[var(--iron)]/40 pt-20 grayscale opacity-40 select-none">
           {[
             { label: "Market Calibration", icon: Target, desc: "Competitive tier benchmarking." },
             { label: "Psychological Anchor", icon: Zap, desc: "Optimized conversion pricing." },
             { label: "Structural Integrity", icon: ShieldCheck, desc: "Rigid margin protection." },
             { label: "Asset Manifest", icon: Package, desc: "High-fidelity feature grids." }
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
