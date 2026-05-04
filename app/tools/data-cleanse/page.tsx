"use client"

import type React from "react"
import { useState } from "react"
import {
  Upload, FileText, CheckCircle, AlertCircle, Loader2,
  BarChart3, Database, AlertTriangle, Network, Code, LayoutDashboard,
  Download, Copy, Trash2, ShieldAlert, FileWarning, Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { ContentLoadingScreen } from "@/components/loading-screen"

interface FormData {
  name: string
  email: string
  files: File[]
}

interface DatasetSummary {
  fileName: string
  detectedPurpose: string
  rows: number
  columns: number
  primaryKeyGuess: string
  foreignKeyGuess: string[]
  status: string
}

interface DataQualityIssue {
  severity: "critical" | "warning" | "info" | string
  dataset: string
  column: string
  issueType: string
  description: string
  suggestedFix: string
}

interface StarSchema {
  factTable: {
    name: string
    grain: string
    measures: string[]
    foreignKeys: string[]
  }
  dimensions: {
    name: string
    primaryKey: string
    attributes: string[]
  }[]
}

interface Relationship {
  fromTable: string
  fromColumn: string
  relationship: string
  toTable: string
  toColumn: string
  cardinality: string
}

interface MQuery {
  cleaningSteps?: string
  dimensionTables?: string
  factTable?: string
  dateTable?: string
}

interface AnalysisResult {
  overview: {
    totalFiles: number
    totalRows: number
    totalColumns: number
    issuesFound: number
    factTables: number
    dimensionTables: number
  }
  datasets: DatasetSummary[]
  dataQualityIssues: DataQualityIssue[]
  starSchema: StarSchema
  relationships: Relationship[]
  relationshipDiagram: string
  mQuery: MQuery
  recommendations: string[]
  rawText?: string
}

interface SubmissionState {
  isLoading: boolean
  success: boolean
  error: string | null
  result: AnalysisResult | null
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
  const [activeTab, setActiveTab] = useState("overview")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    const csvFiles = newFiles.filter((file) => file.type === "text/csv" || file.name.endsWith(".csv"))

    setFormData((prev) => {
      const combined = [...prev.files, ...csvFiles]
      return {
        ...prev,
        files: combined.slice(0, 3) // Max 3 files
      }
    })
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

    setFormData((prev) => {
      const combined = [...prev.files, ...csvFiles]
      return {
        ...prev,
        files: combined.slice(0, 3) // Max 3 files
      }
    })
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
    setActiveTab("overview")
  }

  const normalizeResponse = (responseText: string): AnalysisResult | null => {
    try {
      let data
      try {
        data = JSON.parse(responseText)
      } catch {
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/)
        if (jsonMatch && jsonMatch[1]) {
          data = JSON.parse(jsonMatch[1])
        } else {
          return {
            overview: { totalFiles: 0, totalRows: 0, totalColumns: 0, issuesFound: 0, factTables: 0, dimensionTables: 0 },
            datasets: [],
            dataQualityIssues: [],
            starSchema: { factTable: { name: "", grain: "", measures: [], foreignKeys: [] }, dimensions: [] },
            relationships: [],
            relationshipDiagram: "",
            mQuery: {},
            recommendations: [],
            rawText: responseText,
          }
        }
      }

      if (Array.isArray(data)) {
        data = data[0]
      }

      if (data && data.success === true && data.data) {
        data = data.data
      }

      if (typeof data === "object" && data !== null) {
        return {
          overview: data.overview || { totalFiles: 0, totalRows: 0, totalColumns: 0, issuesFound: 0, factTables: 0, dimensionTables: 0 },
          datasets: data.datasets || [],
          dataQualityIssues: data.dataQualityIssues || [],
          starSchema: data.starSchema || { factTable: { name: "", grain: "", measures: [], foreignKeys: [] }, dimensions: [] },
          relationships: data.relationships || [],
          relationshipDiagram: data.relationshipDiagram || "",
          mQuery: data.mQuery || {},
          recommendations: data.recommendations || [],
          rawText: (!data.overview && !data.datasets) ? JSON.stringify(data, null, 2) : undefined,
        }
      }

      return null
    } catch (error) {
      console.error("Error normalizing response:", error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || formData.files.length === 0) {
      setSubmissionState((prev) => ({
        ...prev,
        error: "Please fill in all fields and upload at least one CSV file.",
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
      formDataToSend.append("sourceTool", "star_schema_data_cleanser")
      formDataToSend.append(
        "requestedOutputs",
        JSON.stringify(["dataset_summary", "data_quality", "star_schema", "relationships", "m_query"])
      )
      formDataToSend.append("generatedAt", new Date().toISOString())

      formData.files.forEach((file) => {
        formDataToSend.append("files", file)
      })

      // Dummy webhook URL
      const WEBHOOK_URL = "https://n8n.srv832341.hstgr.cloud/webhook/star-schema-data-cleanser"

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
        const responseText = await response.text()
        const normalizedData = normalizeResponse(responseText)

        if (normalizedData) {
          setSubmissionState({
            isLoading: false,
            success: true,
            error: null,
            result: normalizedData,
          })
          setActiveTab(normalizedData.rawText ? "raw" : "overview")
        } else {
          throw new Error("Failed to parse response format")
        }
      } else {
        throw new Error(`Analysis failed. Please check the uploaded files and try again.`)
      }
    } catch (error) {
      setSubmissionState({
        isLoading: false,
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        result: null,
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  const downloadTextFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const handleExportMarkdown = () => {
    if (!submissionState.result) return
    const res = submissionState.result
    let md = `# Star Schema Analysis Report\n\n`

    md += `## Overview\n`
    md += `- Total Files: ${res.overview?.totalFiles || 0}\n`
    md += `- Total Rows: ${res.overview?.totalRows || 0}\n`
    md += `- Issues Found: ${res.overview?.issuesFound || 0}\n\n`

    md += `## Datasets\n`
    res.datasets?.forEach(ds => {
      md += `### ${ds.fileName}\n`
      md += `- Purpose: ${ds.detectedPurpose}\n`
      md += `- Rows: ${ds.rows}, Columns: ${ds.columns}\n`
      md += `- Primary Key: ${ds.primaryKeyGuess}\n\n`
    })

    md += `## Star Schema\n`
    md += `### Fact Table: ${res.starSchema?.factTable?.name || "N/A"}\n`
    md += `- Grain: ${res.starSchema?.factTable?.grain || "N/A"}\n`
    md += `- Measures: ${res.starSchema?.factTable?.measures?.join(", ") || "N/A"}\n\n`

    md += `### Dimensions\n`
    res.starSchema?.dimensions?.forEach(dim => {
      md += `- **${dim.name}** (PK: ${dim.primaryKey})\n`
    })
    md += "\n"

    md += `## Recommendations\n`
    res.recommendations?.forEach(rec => {
      md += `- ${rec}\n`
    })

    downloadTextFile("star-schema-analysis.md", md)
  }

  const renderTabs = () => {
    const tabs = [
      { id: "overview", label: "Overview", icon: LayoutDashboard },
      { id: "data-quality", label: "Data Quality", icon: AlertTriangle },
      { id: "star-schema", label: "Star Schema", icon: BarChart3 },
      { id: "relationships", label: "Relationships", icon: Network },
      { id: "m-query", label: "M Query", icon: Code },
      { id: "export", label: "Export", icon: Download },
    ]

    if (submissionState.result?.rawText) {
      tabs.push({ id: "raw", label: "Raw Analysis", icon: FileText })
    }

    return (
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${isActive
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-transparent"
                }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>
    )
  }

  const renderOverview = () => {
    const { result } = submissionState
    if (!result) return null

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
              <FileText className="w-6 h-6 text-blue-500 mb-1" />
              <p className="text-sm text-gray-500">Total Files</p>
              <p className="text-2xl font-bold">{result.overview?.totalFiles || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
              <Database className="w-6 h-6 text-green-500 mb-1" />
              <p className="text-sm text-gray-500">Total Rows</p>
              <p className="text-2xl font-bold">{result.overview?.totalRows || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
              <AlertCircle className="w-6 h-6 text-red-500 mb-1" />
              <p className="text-sm text-gray-500">Issues Found</p>
              <p className="text-2xl font-bold">{result.overview?.issuesFound || 0}</p>
            </CardContent>
          </Card>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-3">Datasets Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 bg-white text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-3 text-left font-semibold">Dataset Name</th>
                <th className="border p-3 text-left font-semibold">Purpose</th>
                <th className="border p-3 text-right font-semibold">Rows</th>
                <th className="border p-3 text-right font-semibold">Cols</th>
                <th className="border p-3 text-left font-semibold">Primary Key</th>
                <th className="border p-3 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {result.datasets?.map((ds, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border p-3 font-medium">{ds.fileName}</td>
                  <td className="border p-3">{ds.detectedPurpose}</td>
                  <td className="border p-3 text-right">{ds.rows}</td>
                  <td className="border p-3 text-right">{ds.columns}</td>
                  <td className="border p-3">
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{ds.primaryKeyGuess}</code>
                  </td>
                  <td className="border p-3 text-center">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {ds.status}
                    </span>
                  </td>
                </tr>
              ))}
              {(!result.datasets || result.datasets.length === 0) && (
                <tr>
                  <td colSpan={6} className="border p-4 text-center text-gray-500">No datasets information available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderDataQuality = () => {
    const { result } = submissionState
    if (!result) return null

    const getSeverityIcon = (severity: string) => {
      switch (severity?.toLowerCase()) {
        case "critical": return <ShieldAlert className="w-5 h-5 text-red-500" />
        case "warning": return <FileWarning className="w-5 h-5 text-yellow-500" />
        default: return <Info className="w-5 h-5 text-blue-500" />
      }
    }

    return (
      <div className="space-y-4">
        {result.dataQualityIssues?.map((issue, idx) => (
          <Card key={idx} className="border-l-4" style={{
            borderLeftColor: issue.severity?.toLowerCase() === 'critical' ? '#ef4444' : issue.severity?.toLowerCase() === 'warning' ? '#f59e0b' : '#3b82f6'
          }}>
            <CardContent className="p-4 flex gap-4">
              <div className="flex-shrink-0 mt-1">
                {getSeverityIcon(issue.severity)}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-lg">{issue.issueType}</h4>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full uppercase font-medium tracking-wider text-gray-600">
                    {issue.dataset} • {issue.column}
                  </span>
                </div>
                <p className="text-gray-700">{issue.description}</p>
                <div className="bg-green-50 text-green-800 p-3 rounded-md text-sm border border-green-100">
                  <span className="font-semibold block mb-1">Suggested Fix:</span>
                  {issue.suggestedFix}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!result.dataQualityIssues || result.dataQualityIssues.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p>No critical data quality issues found!</p>
          </div>
        )}
      </div>
    )
  }

  const renderStarSchema = () => {
    const { result } = submissionState
    if (!result) return null
    const schema = result.starSchema

    if (!schema || !schema.factTable || !schema.factTable.name) {
      return <div className="text-center py-8 text-gray-500">No star schema generated.</div>
    }

    return (
      <div className="space-y-6">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Fact Table: {schema.factTable.name}
            </CardTitle>
            <CardDescription>{schema.factTable.grain}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold mb-2 text-sm text-gray-500 uppercase tracking-wider">Measures</h5>
                <ul className="space-y-1">
                  {schema.factTable.measures?.map((m, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm bg-white p-2 rounded border shadow-sm">
                      <BarChart3 className="w-4 h-4 text-green-500" /> {m}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-2 text-sm text-gray-500 uppercase tracking-wider">Foreign Keys</h5>
                <ul className="space-y-1">
                  {schema.factTable.foreignKeys?.map((fk, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm bg-white p-2 rounded border shadow-sm">
                      <Network className="w-4 h-4 text-blue-500" /> {fk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <h3 className="text-lg font-semibold mt-8 mb-4">Dimension Tables</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schema.dimensions?.map((dim, idx) => (
            <Card key={idx} className="border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-orange-500" />
                  {dim.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-3 text-sm">
                  <span className="font-semibold text-gray-500">PK: </span>
                  <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{dim.primaryKey}</code>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-gray-500 block mb-1">Attributes:</span>
                  <div className="flex flex-wrap gap-1">
                    {dim.attributes?.map((attr, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {attr}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const renderRelationships = () => {
    const { result } = submissionState
    if (!result) return null

    return (
      <div className="space-y-6">
        {result.relationshipDiagram && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Relationship Diagram</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                {result.relationshipDiagram}
              </pre>
            </CardContent>
          </Card>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 bg-white text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-3 text-left font-semibold">From Table</th>
                <th className="border p-3 text-left font-semibold">Column</th>
                <th className="border p-3 text-center font-semibold">Relationship</th>
                <th className="border p-3 text-left font-semibold">To Table</th>
                <th className="border p-3 text-left font-semibold">Column</th>
                <th className="border p-3 text-center font-semibold">Cardinality</th>
              </tr>
            </thead>
            <tbody>
              {result.relationships?.map((rel, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border p-3 font-medium text-blue-600">{rel.fromTable}</td>
                  <td className="border p-3"><code className="text-xs bg-gray-100 px-1 py-0.5 rounded">{rel.fromColumn}</code></td>
                  <td className="border p-3 text-center text-gray-500">{rel.relationship}</td>
                  <td className="border p-3 font-medium text-green-600">{rel.toTable}</td>
                  <td className="border p-3"><code className="text-xs bg-gray-100 px-1 py-0.5 rounded">{rel.toColumn}</code></td>
                  <td className="border p-3 text-center font-bold">{rel.cardinality}</td>
                </tr>
              ))}
              {(!result.relationships || result.relationships.length === 0) && (
                <tr>
                  <td colSpan={6} className="border p-4 text-center text-gray-500">No relationships found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderMQuery = () => {
    const { result } = submissionState
    if (!result || !result.mQuery || Object.keys(result.mQuery).length === 0) {
      return <div className="text-center py-8 text-gray-500">No M Query generated.</div>
    }

    const mQueryBlocks = [
      { title: "Cleaning Steps", code: result.mQuery.cleaningSteps },
      { title: "Date Table", code: result.mQuery.dateTable },
      { title: "Dimension Tables", code: result.mQuery.dimensionTables },
      { title: "Fact Table", code: result.mQuery.factTable },
    ].filter(block => block.code)

    if (mQueryBlocks.length === 0) {
      return <div className="text-center py-8 text-gray-500">No M Query steps available.</div>
    }

    return (
      <div className="space-y-6">
        {mQueryBlocks.map((block, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between py-3 bg-gray-50 border-b">
              <CardTitle className="text-base font-semibold">{block.title}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(block.code || "")}>
                  <Copy className="w-4 h-4 mr-2" /> Copy
                </Button>
                <Button variant="outline" size="sm" onClick={() => downloadTextFile(`${block.title.replace(/\s+/g, "_")}.txt`, block.code || "")}>
                  <Download className="w-4 h-4 mr-2" /> Download
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm font-mono m-0 rounded-b-lg">
                {block.code}
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const renderExport = () => {
    const { result } = submissionState
    if (!result) return null

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Export Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline" onClick={handleExportMarkdown}>
              <Download className="w-4 h-4 mr-2" /> Download Analysis as Markdown
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => {
              const mQueryText = Object.entries(result.mQuery || {})
                .filter(([_, v]) => v)
                .map(([k, v]) => `// ${k}\n${v}`)
                .join("\n\n")
              downloadTextFile("power-query-m-code.txt", mQueryText)
            }}>
              <Download className="w-4 h-4 mr-2" /> Download M Query as TXT
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => {
              let text = result.relationshipDiagram ? `Diagram:\n${result.relationshipDiagram}\n\n` : ""
              text += "Relationships:\n"
              result.relationships?.forEach(r => {
                text += `${r.fromTable}[${r.fromColumn}] ${r.relationship} ${r.toTable}[${r.toColumn}] (${r.cardinality})\n`
              })
              downloadTextFile("relationship-model.txt", text)
            }}>
              <Download className="w-4 h-4 mr-2" /> Download Relationship Model as TXT
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}>
              <Copy className="w-4 h-4 mr-2" /> Copy Full Analysis JSON
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderRaw = () => {
    return (
      <div className="space-y-4">
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="w-4 h-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            The AI response could not be fully parsed into the structured dashboard. The raw output is shown below.
          </AlertDescription>
        </Alert>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap">
          {submissionState.result?.rawText}
        </pre>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-section font-sans">
      {/* Header */}
      <div className="bg-header-gradient border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-heading">Star Schema Data Cleanser</h1>
            <p className="text-lg text-body max-w-2xl mx-auto">
              Upload multiple CSV files and generate a clean star schema, relationship model, and Power Query M transformations.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {!submissionState.success ? (
          <Card className="shadow-lg border-gray-200 max-w-2xl mx-auto">
            <CardContent className="p-8">
              {submissionState.isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-6">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">Analyzing uploaded datasets...</h3>
                    <ul className="text-sm text-gray-500 space-y-2 text-left inline-block">
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Uploading files</li>
                      <li className="flex items-center gap-2 animate-pulse"><Loader2 className="w-4 h-4 animate-spin" /> Detecting data structure</li>
                      <li className="flex items-center gap-2 text-gray-300"><Loader2 className="w-4 h-4" /> Finding relationships</li>
                      <li className="flex items-center gap-2 text-gray-300"><Loader2 className="w-4 h-4" /> Generating star schema</li>
                      <li className="flex items-center gap-2 text-gray-300"><Loader2 className="w-4 h-4" /> Creating M Query</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submissionState.error && (
                    <Alert className="bg-red-50 border-red-200 text-red-800">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{submissionState.error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-heading font-medium">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="border-gray-300 focus:border-primary focus:ring-primary"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-heading font-medium">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border-gray-300 focus:border-primary focus:ring-primary"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-heading font-medium">CSV Files Upload</Label>

                    <div
                      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${dragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50 hover:bg-gray-50"
                        }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        multiple
                        accept=".csv"
                        onChange={handleFileChange}
                        disabled={formData.files.length >= 3}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <Upload className={`w-12 h-12 mx-auto mb-4 ${formData.files.length >= 3 ? 'text-gray-300' : 'text-primary'}`} />
                      <p className="text-heading text-lg mb-2 font-medium">Drop your CSV files here or click to browse</p>
                      <p className="text-body text-sm mb-4">Upload related datasets such as Orders, Customers, Products, etc. (Max 3 files)</p>
                    </div>

                    {formData.files.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <p className="text-heading text-sm font-medium">Selected Files ({formData.files.length}/3):</p>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {formData.files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-section rounded-lg p-3 border border-gray-200">
                              <div className="flex items-center space-x-3 overflow-hidden">
                                <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                                <span className="text-heading text-sm truncate font-medium">{file.name}</span>
                                <span className="text-body text-xs whitespace-nowrap">({(file.size / 1024).toFixed(1)} KB)</span>
                                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 flex-shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={submissionState.isLoading || !formData.name || !formData.email || formData.files.length === 0}
                    className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-4 px-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                  >
                    Start Data Analysis
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                Analysis Complete
              </h2>
              <Button onClick={resetForm} variant="outline" className="border-primary text-primary hover:bg-primary/5">
                Analyze Another Dataset
              </Button>
            </div>

            <Card className="shadow-md border-gray-200">
              <CardContent className="p-0 sm:p-6">
                <div className="p-4 sm:p-0">
                  {renderTabs()}
                  <div className="mt-6">
                    {activeTab === "overview" && renderOverview()}
                    {activeTab === "data-quality" && renderDataQuality()}
                    {activeTab === "star-schema" && renderStarSchema()}
                    {activeTab === "relationships" && renderRelationships()}
                    {activeTab === "m-query" && renderMQuery()}
                    {activeTab === "export" && renderExport()}
                    {activeTab === "raw" && renderRaw()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
