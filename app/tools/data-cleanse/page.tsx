"use client"

import type React from "react"
import { useState } from "react"
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, BarChart3, Database, AlertTriangle, Sparkles, XCircle, Trash2, ShieldCheck, Zap, ArrowRight, Table, Fingerprint, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ContentLoadingScreen } from "@/components/loading-screen"

interface FormData {
  name: string
  email: string
  files: File[]
}

interface SubmissionState {
  isLoading: boolean
  success: boolean
  error: string | null
  result: string | null
}

export default function DataAnalyzer() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    files: [],
  })

  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    isLoading: false,
    success: false,
    error: null,
    result: null,
  })

  const [dragActive, setDragActive] = useState(false)

  if (submissionState.isLoading) {
    return <ContentLoadingScreen />
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const csvFiles = files.filter((file) => file.type === "text/csv" || file.name.endsWith(".csv"))

    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...csvFiles],
    }))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    const csvFiles = files.filter((file) => file.type === "text/csv" || file.name.endsWith(".csv"))

    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...csvFiles],
    }))
  }

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }))
  }

  const resetForm = () => {
    setFormData({ name: "", email: "", files: [] })
    setSubmissionState({ isLoading: false, success: false, error: null, result: null })
  }

  const extractAnalysisOutput = (responseText: string): string => {
    try {
      const jsonResponse = JSON.parse(responseText)
      if (Array.isArray(jsonResponse) && jsonResponse[0]?.output) {
        return jsonResponse[0].output
      } else if (jsonResponse.output) {
        return jsonResponse.output
      } else {
        return responseText
      }
    } catch (error) {
      console.error("Error parsing response:", error)
      return responseText
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || formData.files.length === 0) {
      setSubmissionState((prev) => ({
        ...prev,
        error: "Required parameters missing. Minimum 1 CSV required.",
      }))
      return
    }

    setSubmissionState({
      isLoading: true,
      success: false,
      error: null,
      result: null,
    })

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("email", formData.email)

      formData.files.forEach((file, index) => {
        formDataToSend.append(`Please_upload_the_CSV_file_${index}`, file)
      })

      const response = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/data-cleanse", {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
        const responseText = await response.text()
        const analysisOutput = extractAnalysisOutput(responseText)

        setSubmissionState({
          isLoading: false,
          success: true,
          error: null,
          result: analysisOutput,
        })
      } else {
        throw new Error(`Data node failed: ${response.status}`)
      }
    } catch (error) {
      setSubmissionState({
        isLoading: false,
        success: false,
        error: error instanceof Error ? error.message : "Spectral connection failure.",
        result: null,
      })
    }
  }

  const formatAnalysisOutput = (output: string) => {
    const sections = output.split(/###\s*\d+\.\s*/)

    return sections
      .map((section, index) => {
        if (index === 0 && section.trim()) {
          return (
            <div key={index} className="mb-12 text-center max-w-2xl mx-auto">
              <p className="text-xl font-black font-poppins text-[#FF7435] leading-relaxed italic uppercase tracking-tighter">
                "{section.trim()}"
              </p>
            </div>
          )
        }

        if (!section.trim()) return null

        const lines = section.trim().split("\n")
        const title = lines[0]?.replace(/[*:]/g, "").trim()
        const content = lines.slice(1).join("\n").trim()

        let icon = <Database className="w-6 h-6 text-[#FF7435]" />
        let accentClass = "border-[#FF7435]/20 bg-orange-50/10 shadow-orange-500/5"

        if (title?.toLowerCase().includes("anomalies")) {
          icon = <AlertTriangle className="w-6 h-6 text-yellow-500" />
          accentClass = "border-yellow-500/20 bg-yellow-50/10 shadow-yellow-500/5"
        } else if (title?.toLowerCase().includes("star schema")) {
          icon = <BarChart3 className="w-6 h-6 text-purple-500" />
          accentClass = "border-purple-500/20 bg-purple-50/10 shadow-purple-500/5"
        }

        return (
          <div key={index} className={`card p-10 md:p-14 mb-12 border-2 ${accentClass} animate-in fade-in slide-in-from-bottom-8 duration-700`}>
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-2xl font-black font-poppins flex items-center gap-4 text-[var(--night)] uppercase tracking-tight">
                 {icon}
                 {title}
               </h3>
               <Badge className="bg-[var(--night)] text-white border-none font-black text-[10px] h-6 px-3">REPORT NO. {index}</Badge>
            </div>
            
            <div className="space-y-6">
              {content.split("\n").map((line, lineIndex) => {
                const trimmedLine = line.trim()
                if (!trimmedLine) return <div key={lineIndex} className="h-6" />

                if (trimmedLine.includes("**") && trimmedLine.includes("Table:**")) {
                  return (
                    <div key={lineIndex} className="mt-12 mb-6 flex items-center gap-4 border-b-4 border-[var(--night)] pb-4 first:mt-0">
                       <Table className="w-5 h-5 text-[var(--night)]" />
                       <h4 className="text-xl font-black text-[var(--night)] font-poppins uppercase tracking-tighter">
                         {trimmedLine.replace(/\*\*/g, "").replace(" Table:", " Entity")}
                       </h4>
                    </div>
                  )
                }

                if (trimmedLine.includes("**")) {
                  return (
                    <h5 key={lineIndex} className="text-[10px] font-black text-[var(--night)] mt-8 mb-4 uppercase tracking-[0.3em] bg-[var(--night)] text-white px-4 py-1.5 rounded-full w-fit">
                      {trimmedLine.replace(/\*\*/g, "")}
                    </h5>
                  )
                }

                if (trimmedLine.startsWith("- ") && trimmedLine.includes(":")) {
                  const parts = trimmedLine.substring(2).split(":")
                  const fieldName = parts[0].trim()
                  const description = parts.slice(1).join(":").trim()

                  return (
                    <div key={lineIndex} className="flex items-start gap-5 py-4 px-6 bg-white dark:bg-zinc-800/50 rounded-2xl border-2 border-[var(--iron)]/40 group hover:border-[#FF7435]/30 transition-all">
                      <div className="w-2 h-2 rounded-full bg-[#FF7435] mt-2 shrink-0 group-hover:scale-125 transition-transform" />
                      <div className="flex flex-col gap-1">
                        <code className="text-xs font-black font-mono text-[#FF7435] uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded-lg w-fit">
                          {fieldName}
                        </code>
                        <span className="text-[var(--steel)] font-bold text-sm leading-relaxed">{description}</span>
                      </div>
                    </div>
                  )
                }

                if (trimmedLine.startsWith("- ")) {
                  return (
                    <div key={lineIndex} className="flex items-start gap-5 py-4 px-6 bg-[var(--mist)]/40 rounded-2xl border border-[var(--iron)]/40 group hover:bg-white transition-all">
                      <Zap className="w-4 h-4 text-[#FF7435] mt-1 shrink-0 group-hover:rotate-12 transition-transform" />
                      <span className="text-[var(--night)] font-bold text-sm leading-relaxed">{trimmedLine.substring(2)}</span>
                    </div>
                  )
                }

                if (trimmedLine.match(/^\d+\.\s/)) {
                  const match = trimmedLine.match(/^(\d+)\.\s(.*)/)
                  if (match) {
                    return (
                      <div key={lineIndex} className="flex items-start gap-5 py-4 px-6 border-l-4 border-[#FF7435]/20 group hover:border-[#FF7435] transition-all">
                        <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-[var(--night)] text-white text-[10px] font-black shrink-0">
                          {match[1]}
                        </span>
                        <span className="text-[var(--night)] font-black text-sm leading-relaxed pt-1">{match[2]}</span>
                      </div>
                    )
                  }
                }

                return (
                  <p key={lineIndex} className="text-[var(--steel)] font-medium leading-relaxed bg-white p-6 rounded-[2rem] border-2 border-dashed border-[var(--iron)]">
                    {trimmedLine}
                  </p>
                )
              })}
            </div>
          </div>
        )
      })
      .filter(Boolean)
  }

  const renderAnalysisResults = () => {
    if (!submissionState.result) return null

    return (
      <div className="space-y-16 animate-in fade-in duration-1000 pb-20">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto border-4 border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
            <CheckCircle className="w-12 h-12 text-emerald-500" />
          </div>
          <h3 className="text-4xl font-black font-poppins text-[var(--night)] tracking-tighter uppercase">Synthesis Complete</h3>
          <p className="text-[var(--steel)] font-bold italic max-w-xl mx-auto px-6">
            The data engine has processed your vectors. Review the schema optimizations and anomalies below.
          </p>
        </div>

        <div className="space-y-12">{formatAnalysisOutput(submissionState.result)}</div>

        <div className="text-center pt-12 border-t-4 border-[var(--iron)]/30">
          <Button
            onClick={resetForm}
            className="btn-primary px-12 h-16 text-xs font-black uppercase tracking-[0.2em] rounded-full shadow-2xl shadow-[#FF7435]/30 group"
          >
            Initiate New Scan <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--mist)] text-[var(--night)] transition-colors duration-300 pb-32">
      {/* Premium Sticky Header */}
      <div className="bg-[var(--cloud)]/60 backdrop-blur-2xl border-b border-[var(--iron)] pt-24 pb-8 sticky top-0 z-30 shadow-sm text-center">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col items-center gap-4">
             <div className="w-14 h-14 bg-[#FF7435] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#FF7435]/30 mb-2">
                <Database className="w-8 h-8 text-white" />
             </div>
             <div>
                <h1 className="text-3xl font-black font-poppins text-[var(--night)] tracking-tighter uppercase mb-1">
                   Star Schema <span className="text-[#FF7435]">Nexus</span>
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--steel)] opacity-60">High-Fidelity Data Cleansing Unit</p>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-16 lg:mt-24">
        {!submissionState.success ? (
          <form onSubmit={handleSubmit} className="card p-10 md:p-16 space-y-12 shadow-2xl shadow-black/5 border-2 border-[var(--iron)]/50">
            <div className="flex items-center justify-between mb-8 pb-8 border-b-2 border-[var(--iron)]/40">
               <div>
                  <h2 className="text-xl font-black font-poppins text-[var(--night)] uppercase tracking-tight">Mission Input</h2>
                  <p className="text-xs font-bold text-[var(--steel)] italic uppercase tracking-widest mt-1">Status: Awaiting Vectors</p>
               </div>
               <div className="flex items-center gap-3">
                  <Fingerprint className="w-6 h-6 text-[#FF7435] opacity-20" />
                  <Activity className="w-6 h-6 text-[#FF7435] opacity-20" />
               </div>
            </div>

            {submissionState.error && (
              <Alert variant="destructive" className="rounded-2xl border-2 animate-in shake-in">
                <XCircle className="h-5 w-5" />
                <AlertDescription className="font-black text-[10px] uppercase tracking-widest">{submissionState.error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <Label className="field-label flex items-center gap-2 font-black uppercase tracking-[0.1em]">
                   Lead Analyst
                </Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input h-14"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label className="field-label flex items-center gap-2 font-black uppercase tracking-[0.1em]">
                   Contact Terminal
                </Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input h-14"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-6">
              <Label className="field-label flex items-center justify-between">
                <span className="font-black uppercase tracking-[0.1em]">Dataset Carrier (CSV)</span>
                <Badge className="bg-[#FF7435] text-white border-none font-black text-[9px] uppercase tracking-[0.2em]">{formData.files.length} UNIT(S)</Badge>
              </Label>

              <div
                className={`relative border-4 border-dashed rounded-[3rem] p-16 text-center transition-all duration-700 group overflow-hidden ${
                  dragActive
                    ? "border-[#FF7435] bg-[#FF7435]/5 scale-[1.02]"
                    : "border-[var(--iron)]/40 bg-[var(--cloud)]/30 hover:border-[#FF7435]/40 hover:bg-white"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                 {dragActive && (
                    <div className="absolute inset-0 bg-[#FF7435]/5 animate-pulse" />
                 )}
                <input
                  type="file"
                  multiple
                  accept=".csv"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                <div className="relative z-10 space-y-6">
                  <div className="w-24 h-24 bg-white dark:bg-zinc-800 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl border-2 border-[var(--iron)]/50 group-hover:bg-[#FF7435] group-hover:rotate-12 transition-all duration-700">
                    <Upload className="w-10 h-10 text-[#FF7435] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black font-poppins text-[var(--night)] mb-2 tracking-tight uppercase">Upload Dataset</h3>
                    <p className="text-[var(--steel)] font-bold italic">Drag vectors here or interact with terminal</p>
                  </div>
                  <div className="pt-6 flex items-center justify-center gap-5 text-[10px] font-black text-[var(--steel)] uppercase tracking-[0.2em] opacity-60">
                     <span className="flex items-center gap-2"><Table className="w-4 h-4" /> Multi-Source</span>
                     <div className="w-1.5 h-1.5 rounded-full bg-[var(--iron)] opacity-40"></div>
                     <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Secure Pipeline</span>
                  </div>
                </div>
              </div>

              {formData.files.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 animate-in slide-in-from-bottom-8">
                  {formData.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white dark:bg-zinc-800/80 rounded-[1.5rem] p-6 border-2 border-[var(--iron)]/40 group hover:border-[#FF7435]/40 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-12 h-12 bg-[var(--mist)] rounded-xl flex items-center justify-center shrink-0 border-2 border-[var(--iron)]/50">
                          <FileText className="w-6 h-6 text-[#FF7435]" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[var(--night)] text-xs font-black truncate uppercase tracking-tighter">{file.name}</span>
                          <span className="text-[10px] font-bold text-[var(--steel)]">SIZE: {(file.size / 1024).toFixed(1)} KB</span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-[var(--steel)] hover:text-red-500 hover:bg-red-50 h-10 w-10 p-0 rounded-xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={submissionState.isLoading}
              className="btn-primary w-full h-20 text-xs font-black uppercase tracking-[0.3em] rounded-full shadow-2xl shadow-[#FF7435]/30 group"
            >
              {submissionState.isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 mr-4 animate-spin" />
                  Analyzing Quantum Vectors...
                </>
              ) : (
                <>
                  <Activity className="w-6 h-6 mr-4 group-hover:scale-110 transition-transform" />
                  Engage Analysis Protocol
                </>
              )}
            </Button>
          </form>
        ) : (
          renderAnalysisResults()
        )}
      </div>
    </div>
  )
}
