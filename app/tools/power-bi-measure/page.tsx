"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Loader2,
  Copy,
  CheckCircle,
  BarChart3,
  TrendingUp,
  Upload,
  X,
  FileText,
  FileSpreadsheet,
  FileJson,
  FileCode,
  Layout,
  ClipboardList,
  Database,
  Lightbulb,
  BookOpen,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { ContentLoadingScreen } from "@/components/loading-screen"

interface Measure {
  kpiName: string
  description: string
  daxMeasureName: string
  dax: string
  recommendedVisualization: string
  fieldsUsed: string[]
  businessUse: string
}

interface N8nResponseData {
  summary: string
  schemaUsed: boolean
  detectedTables: string[]
  detectedFields: string[]
  measures: Measure[]
  additionalRecommendations: string[]
  modelingNotes: string[]
  visualLayoutSuggestion: string[]
}

interface NormalizedResponse {
  success: boolean
  data: N8nResponseData | null
  rawText: string
}

// Keep the old interface for text parsing fallback
interface GeneratedKPI {
  title: string
  daxMeasure: string
  visualization: string
  businessUse?: string
  fieldsUsed?: string
}

export default function PowerBIMeasureGenerator() {
  const [businessContext, setBusinessContext] = useState("")
  const [kpiDescription, setKpiDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [generatedResult, setGeneratedResult] = useState<NormalizedResponse | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [schemaText, setSchemaText] = useState("")
  const [uploadedFileName, setUploadedFileName] = useState("")
  const [uploadedFileType, setUploadedFileType] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  function normalizeN8nResponse(response: any): NormalizedResponse {
    const root = Array.isArray(response) ? response[0] : response

    if (!root) {
      return {
        success: false,
        data: null,
        rawText: "",
      }
    }

    if (root.data && typeof root.data === "object") {
      return {
        success: root.success ?? true,
        data: root.data,
        rawText: "",
      }
    }

    if (root.text || root.output) {
      return {
        success: true,
        data: null,
        rawText: root.text || root.output,
      }
    }

    if (typeof root === "string") {
      return {
        success: true,
        data: null,
        rawText: root,
      }
    }

    return {
      success: true,
      data: null,
      rawText: JSON.stringify(root, null, 2),
    }
  }

  const validateFile = (file: File) => {
    const supportedTypes = [".csv", ".txt", ".json", ".sql", ".md"]
    const extension = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase()
    const isSupported = supportedTypes.includes(`.${extension}`) || file.type === "text/csv" || file.type === "application/json"

    if (!isSupported) {
      toast({
        title: "Unsupported File",
        description: "Please upload a .csv, .txt, .json, .sql, or .md file.",
        variant: "destructive",
      })
      return false
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Maximum file size is 2MB.",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const parseCSVPreview = (text: string, fileName: string): string => {
    const lines = text.split("\n").filter((line) => line.trim())
    if (lines.length === 0) return `Dataset File: ${fileName}\nEmpty file.`

    const headers = lines[0].split(",").map((h) => h.trim())
    const sampleRows = lines.slice(1, 6)
    const estimatedRows = lines.length - 1

    let summary = `Dataset File: ${fileName}\nDetected Type: CSV\n\nColumns:\n- ${headers.join("\n- ")}\n\n`
    summary += `Sample Rows:\n`
    sampleRows.forEach((row, idx) => {
      const values = row.split(",")
      const rowText = headers.map((h, i) => `${h}: ${values[i] || ""}`).join(", ")
      summary += `${idx + 1}. ${rowText}\n`
    })
    summary += `\nEstimated Rows: ${estimatedRows}`

    return summary
  }

  const parseUploadedFile = async (selectedFile: File) => {
    if (!validateFile(selectedFile)) return

    setIsParsing(true)
    setFile(selectedFile)
    setUploadedFileName(selectedFile.name)
    setUploadedFileType(selectedFile.type || "text/plain")

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const extension = selectedFile.name.split(".").pop()?.toLowerCase()

      if (extension === "csv") {
        setSchemaText(parseCSVPreview(content, selectedFile.name))
      } else if (extension === "json") {
        try {
          const parsed = JSON.parse(content)
          setSchemaText(JSON.stringify(parsed, null, 2).slice(0, 12000))
        } catch {
          setSchemaText(content.slice(0, 12000))
        }
      } else {
        setSchemaText(content.slice(0, 12000))
      }
      setIsParsing(false)
    }
    reader.readAsText(selectedFile)
  }

  const handleRemoveFile = () => {
    setFile(null)
    setSchemaText("")
    setUploadedFileName("")
    setUploadedFileType("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

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
      let businessUse = ""
      let fieldsUsed = ""
      let inCodeBlock = false
      let codeLines: string[] = []

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()

        if (line.match(/^\d+\.\s\*\*.*\*\*/) || (line.startsWith("**") && line.endsWith("**"))) {
          title = line.replace(/^\d+\.\s/, "").replace(/\*\*/g, "")
        } else if (line.includes("**DAX Measure**:")) {
          continue
        } else if (line.startsWith("```") && !inCodeBlock) {
          inCodeBlock = true
          codeLines = []
        } else if (line.startsWith("```") && inCodeBlock) {
          inCodeBlock = false
          daxMeasure = codeLines.join("\n")
        } else if (inCodeBlock) {
          codeLines.push(line)
        } else if (line.includes("**Recommended Visualization**:")) {
          visualization = line.replace("**Recommended Visualization**:", "").trim()
        } else if (line.includes("**Business Use**:") || line.includes("**Business Use / Purpose**:")) {
          businessUse = line.replace(/\*\*Business Use( \/ Purpose)?\*\*:/, "").trim()
        } else if (line.includes("**Fields Used**:")) {
          fieldsUsed = line.replace("**Fields Used**:", "").trim()
        }
      }

      if (title && (daxMeasure || visualization)) {
        kpis.push({ title, daxMeasure, visualization, businessUse, fieldsUsed })
      }
    })

    return kpis
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!businessContext.trim() || !kpiDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both Business Context and KPI Description fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setGeneratedResult(null)

    try {
      const response = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/pbi-measure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessContext,
          kpiDescription,
          schemaText,
          schemaFileName: uploadedFileName,
          schemaFileType: uploadedFileType,
          hasSchemaUpload: !!file,
          sourceTool: "power_bi_measure_generator",
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()
      const normalized = normalizeN8nResponse(responseData)
      setGeneratedResult(normalized)

      toast({
        title: "Success!",
        description: "Power BI measures generated successfully.",
      })
    } catch (error) {
      console.error("Error generating measures:", error)
      toast({
        title: "Error",
        description: "Failed to generate Power BI measures. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string, message = "Copied to clipboard!") => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: message,
      })
    })
  }

  const copyFullKPI = (title: string, dax: string, visualization: string, businessUse?: string, fieldsUsed?: string | string[]) => {
    const fieldsText = Array.isArray(fieldsUsed) ? fieldsUsed.join(", ") : fieldsUsed
    const text = `KPI: ${title}\n\nDAX Measure:\n${dax}\n\nVisualization: ${visualization}${businessUse ? `\n\nBusiness Use: ${businessUse}` : ""}${fieldsText ? `\n\nFields Used: ${fieldsText}` : ""}`
    copyToClipboard(text, "Full KPI details copied.")
  }

  const copyAllMeasures = () => {
    if (!generatedResult) return

    let text = ""
    if (generatedResult.data?.measures) {
      text = generatedResult.data.measures
        .map((m) => `// ${m.kpiName || m.daxMeasureName}\n${m.dax}`)
        .join("\n\n")
    } else if (generatedResult.rawText) {
      const parsed = parseKPIContent(generatedResult.rawText)
      text = parsed.map((kpi) => `// ${kpi.title}\n${kpi.daxMeasure}`).join("\n\n")
    }

    copyToClipboard(text, "All DAX measures copied.")
  }

  if (isLoading) {
    return <ContentLoadingScreen />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0b0b] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-25 dark:from-zinc-900 dark:to-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-orange-500 rounded-xl shadow-lg shadow-orange-500/20">
              <BarChart3 className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold font-poppins tracking-tight text-gray-900 dark:text-white">
              Power BI Measure Generator
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium text-lg max-w-2xl">
            Generate complex DAX measures and visualization recommendations by providing context or uploading your data schema.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Input Form */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border border-gray-200 dark:border-zinc-800 shadow-xl dark:bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gray-50/50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800">
                <CardTitle className="text-xl text-gray-900 dark:text-white font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  Configure Requirements
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Fill in the details to generate precise Power BI measures
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessContext" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Business Context <span className="text-orange-500">*</span>
                    </Label>
                    <Textarea
                      id="businessContext"
                      placeholder="e.g. Retail sales dashboard with tables for Sales, Products, and Calendar..."
                      value={businessContext}
                      onChange={(e) => setBusinessContext(e.target.value)}
                      className="min-h-[100px] bg-white dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700 focus:ring-orange-500 rounded-xl transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kpiDescription" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      KPI Description <span className="text-orange-500">*</span>
                    </Label>
                    <Textarea
                      id="kpiDescription"
                      placeholder="e.g. Month-over-month sales growth, Top 10 products by profit margin..."
                      value={kpiDescription}
                      onChange={(e) => setKpiDescription(e.target.value)}
                      className="min-h-[100px] bg-white dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700 focus:ring-orange-500 rounded-xl transition-all"
                      required
                    />
                  </div>

                  {/* Upload Section */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Upload Schema / CSV <span className="text-gray-400 font-normal">(Optional)</span>
                      </Label>
                      {file && (
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-medium"
                        >
                          <X className="h-3 w-3" /> Remove
                        </button>
                      )}
                    </div>

                    {!file ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const droppedFile = e.dataTransfer.files[0]
                          if (droppedFile) parseUploadedFile(droppedFile)
                        }}
                        className="border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl p-8 text-center hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50/30 dark:hover:bg-orange-500/5 cursor-pointer transition-all group"
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={(e) => e.target.files?.[0] && parseUploadedFile(e.target.files[0])}
                          className="hidden"
                          accept=".csv,.txt,.json,.sql,.md"
                        />
                        <div className="flex flex-col items-center">
                          <div className="p-3 bg-gray-100 dark:bg-zinc-800 rounded-full mb-3 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20 group-hover:scale-110 transition-all">
                            <Upload className="h-6 w-6 text-gray-500 dark:text-gray-400 group-hover:text-orange-500" />
                          </div>
                          <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            CSV, SQL, JSON, TXT, or MD (max 2MB)
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 p-4 bg-orange-50/50 dark:bg-orange-500/5 border border-orange-200 dark:border-orange-500/20 rounded-xl">
                        <div className="p-2 bg-orange-500/10 rounded-lg">
                          {uploadedFileName.endsWith(".csv") ? (
                            <FileSpreadsheet className="h-6 w-6 text-orange-600" />
                          ) : uploadedFileName.endsWith(".json") ? (
                            <FileJson className="h-6 w-6 text-orange-600" />
                          ) : uploadedFileName.endsWith(".sql") ? (
                            <FileCode className="h-6 w-6 text-orange-600" />
                          ) : (
                            <FileText className="h-6 w-6 text-orange-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {uploadedFileName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(file.size / 1024).toFixed(1)} KB • {uploadedFileName.split(".").pop()?.toUpperCase()}
                          </p>
                        </div>
                        {isParsing && <Loader2 className="h-4 w-4 animate-spin text-orange-500" />}
                      </div>
                    )}
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed italic">
                      Upload a sample dataset or schema to improve DAX accuracy. We parse it locally; the raw file is never uploaded.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || isParsing || !businessContext.trim() || !kpiDescription.trim()}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating Measures...
                      </>
                    ) : isParsing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Reading file...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="mr-2 h-5 w-5" />
                        Generate Measures
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7 space-y-6">
            {generatedResult ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header Actions */}
                <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500/10 p-2 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Generated Insights</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {generatedResult.data?.measures?.length || parseKPIContent(generatedResult.rawText).length} Results ready
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={copyAllMeasures}
                    className="text-orange-600 border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-500/10 dark:border-zinc-800 rounded-lg font-bold"
                  >
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Copy All
                  </Button>
                </div>

                {/* Case 1: Structured Data Rendering */}
                {generatedResult.data && (
                  <div className="space-y-6">
                    {/* Summary Card */}
                    <Card className="border border-gray-200 dark:border-zinc-800 shadow-lg dark:bg-zinc-900/50">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-bold text-orange-500">
                            <Lightbulb className="h-4 w-4" /> Summary
                          </div>
                          {generatedResult.data.schemaUsed && (
                            <div className="px-2 py-0.5 bg-orange-100 dark:bg-orange-500/20 text-orange-600 text-[10px] font-bold rounded-full border border-orange-200 dark:border-orange-500/30 flex items-center gap-1">
                              <Database className="h-3 w-3" /> Schema Leveraged
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic">
                          {generatedResult.data.summary}
                        </p>

                        {(generatedResult.data.detectedTables?.length > 0 || generatedResult.data.detectedFields?.length > 0) && (
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-zinc-800">
                            {generatedResult.data.detectedTables?.map((t, i) => (
                              <span key={i} className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md border border-blue-100 dark:border-blue-500/20">
                                Table: {t}
                              </span>
                            ))}
                            {generatedResult.data.detectedFields?.map((f, i) => (
                              <span key={i} className="text-[10px] font-bold px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 rounded-md border border-gray-200 dark:border-zinc-700">
                                Field: {f}
                              </span>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Measures List */}
                    <div className="space-y-6">
                      {Array.isArray(generatedResult.data.measures) && generatedResult.data.measures.length > 0 ? (
                        generatedResult.data.measures.map((m, idx) => (
                          <Card key={idx} className="border border-gray-200 dark:border-zinc-800 shadow-lg overflow-hidden group hover:border-orange-500/50 transition-all duration-300 dark:bg-zinc-900/50">
                            <CardHeader className="p-6 bg-gray-50/50 dark:bg-zinc-800/30 border-b border-gray-100 dark:border-zinc-800">
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                  <span className="text-[10px] uppercase tracking-wider font-bold text-orange-500">Measure {idx + 1}</span>
                                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                                    {m.kpiName || m.daxMeasureName}
                                  </CardTitle>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{m.description}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => copyFullKPI(m.kpiName || m.daxMeasureName, m.dax, m.recommendedVisualization, m.businessUse, m.fieldsUsed)}
                                    className="h-9 w-9 rounded-full hover:bg-orange-100 dark:hover:bg-orange-500/20 text-gray-500 hover:text-orange-600"
                                    title="Copy Full Details"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                              {/* DAX Code Block */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                    <FileCode className="h-3.5 w-3.5" /> DAX Measure
                                  </Label>
                                  <button
                                    onClick={() => copyToClipboard(m.dax, "DAX copied.")}
                                    className="text-[11px] font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
                                  >
                                    <Copy className="h-3 w-3" /> Copy Formula
                                  </button>
                                </div>
                                <div className="relative group/code">
                                  <pre className="bg-zinc-950 text-orange-400 p-5 rounded-xl text-sm overflow-x-auto font-mono leading-relaxed border border-zinc-800/50 shadow-inner">
                                    <code>{m.dax}</code>
                                  </pre>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Visualization */}
                                <div className="space-y-2">
                                  <Label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                    <Layout className="h-3.5 w-3.5" /> Visualization
                                  </Label>
                                  <div className="p-3 bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 rounded-xl">
                                    <p className="text-sm font-bold text-blue-700 dark:text-blue-400">{m.recommendedVisualization}</p>
                                  </div>
                                </div>

                                {/* Fields Used */}
                                {m.fieldsUsed?.length > 0 && (
                                  <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                      <ClipboardList className="h-3.5 w-3.5" /> Fields Used
                                    </Label>
                                    <div className="p-3 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl">
                                      <p className="text-sm text-gray-700 dark:text-gray-300">{m.fieldsUsed.join(", ")}</p>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Business Use */}
                              {m.businessUse && (
                                <div className="space-y-2">
                                  <Label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Business Use & Purpose</Label>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-zinc-800/30 p-4 rounded-xl border border-gray-100 dark:border-zinc-800/50">
                                    {m.businessUse}
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <Card className="border-dashed border-2 border-gray-200 dark:border-zinc-800 p-8 text-center">
                          <p className="text-gray-500 dark:text-gray-400">No measures returned. Please try again.</p>
                        </Card>
                      )}
                    </div>

                    {/* Additional Sections */}
                    {(generatedResult.data.additionalRecommendations?.length > 0 || generatedResult.data.modelingNotes?.length > 0 || generatedResult.data.visualLayoutSuggestion?.length > 0) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {generatedResult.data.additionalRecommendations?.length > 0 && (
                          <Card className="border border-gray-200 dark:border-zinc-800 shadow-md dark:bg-zinc-900/50">
                            <CardHeader className="p-4 bg-orange-50/30 dark:bg-orange-500/5 border-b border-gray-100 dark:border-zinc-800">
                              <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Lightbulb className="h-4 w-4 text-orange-500" /> Recommendations
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                              <ul className="space-y-2">
                                {generatedResult.data.additionalRecommendations.map((item, i) => (
                                  <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                    <span className="text-orange-500 mt-0.5">•</span> {item}
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}

                        {generatedResult.data.modelingNotes?.length > 0 && (
                          <Card className="border border-gray-200 dark:border-zinc-800 shadow-md dark:bg-zinc-900/50">
                            <CardHeader className="p-4 bg-blue-50/30 dark:bg-blue-500/5 border-b border-gray-100 dark:border-zinc-800">
                              <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-blue-500" /> Modeling Notes
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                              <ul className="space-y-2">
                                {generatedResult.data.modelingNotes.map((item, i) => (
                                  <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                    <span className="text-blue-500 mt-0.5">•</span> {item}
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Case 2: Raw Text Rendering (Fallback) */}
                {generatedResult.rawText && (
                  <div className="space-y-6">
                    {parseKPIContent(generatedResult.rawText).map((kpi, index) => (
                      <Card key={index} className="border border-gray-200 dark:border-zinc-800 shadow-lg overflow-hidden group hover:border-orange-500/50 transition-all duration-300 dark:bg-zinc-900/50">
                        <CardHeader className="p-6 bg-gray-50/50 dark:bg-zinc-800/30 border-b border-gray-100 dark:border-zinc-800">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase tracking-wider font-bold text-orange-500">Measure {index + 1}</span>
                              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                                {kpi.title}
                              </CardTitle>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyFullKPI(kpi.title, kpi.daxMeasure, kpi.visualization, kpi.businessUse, kpi.fieldsUsed)}
                                className="h-9 w-9 rounded-full hover:bg-orange-100 dark:hover:bg-orange-500/20 text-gray-500 hover:text-orange-600"
                                title="Copy Full Details"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                <FileCode className="h-3.5 w-3.5" /> DAX Measure
                              </Label>
                              <button
                                onClick={() => copyToClipboard(kpi.daxMeasure, "DAX copied.")}
                                className="text-[11px] font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
                              >
                                <Copy className="h-3 w-3" /> Copy Formula
                              </button>
                            </div>
                            <div className="relative group/code">
                              <pre className="bg-zinc-950 text-orange-400 p-5 rounded-xl text-sm overflow-x-auto font-mono leading-relaxed border border-zinc-800/50 shadow-inner">
                                <code>{kpi.daxMeasure}</code>
                              </pre>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                <Layout className="h-3.5 w-3.5" /> Visualization
                              </Label>
                              <div className="p-3 bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 rounded-xl">
                                <p className="text-sm font-bold text-blue-700 dark:text-blue-400">{kpi.visualization}</p>
                              </div>
                            </div>

                            {kpi.fieldsUsed && (
                              <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                  <ClipboardList className="h-3.5 w-3.5" /> Fields Used
                                </Label>
                                <div className="p-3 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl">
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{kpi.fieldsUsed}</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {kpi.businessUse && (
                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Business Use & Purpose</Label>
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-zinc-800/30 p-4 rounded-xl border border-gray-100 dark:border-zinc-800/50">
                                {kpi.businessUse}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center min-h-[500px] border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl p-10 text-center bg-white/50 dark:bg-zinc-900/30 backdrop-blur-sm">
                <div className="p-6 bg-gray-100 dark:bg-zinc-800 rounded-3xl mb-6">
                  <BarChart3 className="h-16 w-16 text-gray-300 dark:text-zinc-700" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Ready to Generate?</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                  Fill in the form and optionally upload a schema or CSV to generate Power BI measures and visual recommendations.
                </p>
                <div className="mt-8 flex gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <span className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 rounded-full">DAX Ready</span>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 rounded-full">AI Powered</span>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 rounded-full">Export Clean</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
