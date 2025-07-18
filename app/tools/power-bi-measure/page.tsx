"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Copy, CheckCircle, BarChart3, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { ContentLoadingScreen } from "@/components/loading-screen" // Import the loading screen


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
 if (isLoading) {    
        return < ContentLoadingScreen />  }
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
          // Start looking for code block
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
        title: "Missing Information",
        description: "Please fill in both Business Context and KPI Description fields.",
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
        throw new Error(`HTTP error! status: ${response.status}`)
      }


        
      const data = await response.json()

      if (data && Array.isArray(data) && data.length > 0 && data[0].text) {
        const content = data[0].text
        setGeneratedContent(content)
        const parsed = parseKPIContent(content)
        setParsedKPIs(parsed)

        toast({
          title: "Success!",
          description: "Power BI measures generated successfully.",
        })
      } else {
        throw new Error("Invalid response format")
      }
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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: "DAX measure copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-25 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-500 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 font-semibold">Power BI Measure Generator</h1>
          </div>
          <p className="text-gray-600 font-medium text-lg">
            Generate DAX measures and visualization recommendations for your Power BI dashboards
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="text-gray-900 font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  Input Details
                </CardTitle>
                <CardDescription className="text-gray-600 font-medium">
                  Provide your business context and KPI requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessContext" className="text-gray-900 font-medium font-medium">
                      Business Context
                    </Label>
                    <Textarea
                      id="businessContext"
                      placeholder="Describe your business scenario, data structure, and objectives. For example: 'School final exam marks dashboard with student performance analysis across subjects and classes...'"
                      value={businessContext}
                      onChange={(e) => setBusinessContext(e.target.value)}
                      className="min-h-[120px] border-gray-300 focus:border-orange-500 focus:ring-orange-500 font-medium"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kpiDescription" className="text-gray-900 font-medium font-medium">
                      KPI Description
                    </Label>
                    <Textarea
                      id="kpiDescription"
                      placeholder="Specify the key performance indicators you need. For example: 'Average marks per subject, top 5 students, failure rate, subject-wise toppers, pass percentage...'"
                      value={kpiDescription}
                      onChange={(e) => setKpiDescription(e.target.value)}
                      className="min-h-[120px] border-gray-300 focus:border-orange-500 focus:ring-orange-500 font-medium"
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !businessContext.trim() || !kpiDescription.trim()}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-lg font-medium transition-colors duration-200"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Measures...
                      </>
                    ) : (
                      "Generate Power BI Measures"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Output Display */}
          <div className="space-y-6">
            {parsedKPIs.length > 0 && (
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="bg-gray-50 border-b border-gray-200">
                  <CardTitle className="text-gray-900 font-semibold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Generated KPIs & Measures
                  </CardTitle>
                  <CardDescription className="text-gray-600 font-medium">
                    {parsedKPIs.length} KPI{parsedKPIs.length !== 1 ? "s" : ""} generated with DAX measures and
                    visualization recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[600px] overflow-y-auto">
                    {parsedKPIs.map((kpi, index) => (
                      <div key={index} className="p-6 border-b border-gray-100 last:border-b-0">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 font-semibold">
                            {index + 1}. {kpi.title}
                          </h3>

                          {kpi.daxMeasure && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-gray-700 font-medium">DAX Measure</h4>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(kpi.daxMeasure)}
                                  className="text-orange-600 border-orange-200 hover:bg-orange-50 font-medium"
                                >
                                  <Copy className="h-3 w-3 mr-1" />
                                  Copy
                                </Button>
                              </div>
                              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto font-mono">
                                <code>{kpi.daxMeasure}</code>
                              </pre>
                            </div>
                          )}

                          {kpi.visualization && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-gray-700 font-medium">
                                Recommended Visualization
                              </h4>
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-blue-800 text-sm font-medium">{kpi.visualization}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {isLoading && (
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
                  <p className="text-gray-600 font-medium">Generating your Power BI measures and visualizations...</p>
                </CardContent>
              </Card>
            )}

            {!isLoading && !generatedContent && (
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-8 text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 font-medium">
                    Fill in the form and click "Generate" to see your Power BI measures and visualization
                    recommendations here.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
