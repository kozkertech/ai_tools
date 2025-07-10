"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Mail, TrendingUp, Star } from "lucide-react"

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
        throw new Error("Failed to generate email lines")
      }

      const data: ApiResponse[] = await response.json()
      if (data[0]?.success) {
        setResults(data[0].results.generated_lines)
        setMetadata(data[0].metadata)
      } else {
        throw new Error("Generation failed")
      }
    } catch (err) {
      setError("Failed to generate email lines. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "urgency":
        return "bg-red-100 text-red-800"
      case "offer":
        return "bg-green-100 text-green-800"
      case "general":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-50 to-orange-25">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 font-poppins">Email Subject-Line Generator</h1>
          <p className="text-gray-600 text-lg font-inter">
            Generate high-converting email subject lines and preview text with AI
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900 font-poppins flex items-center gap-2">
                <Mail className="w-5 h-5 text-orange-500" />
                Campaign Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="campaign_type" className="text-gray-900 font-medium">
                    Campaign Type
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("campaign_type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select campaign type" />
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

                <div className="space-y-2">
                  <Label htmlFor="target_audience" className="text-gray-900 font-medium">
                    Target Audience
                  </Label>
                  <Textarea
                    id="target_audience"
                    placeholder="e.g., young e-commerce founders who want to boost sales using automation"
                    value={formData.target_audience}
                    onChange={(e) => handleInputChange("target_audience", e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product_service" className="text-gray-900 font-medium">
                    Product/Service
                  </Label>
                  <Input
                    id="product_service"
                    placeholder="e.g., AI-powered email automation platform"
                    value={formData.product_service}
                    onChange={(e) => handleInputChange("product_service", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand_voice" className="text-gray-900 font-medium">
                      Brand Voice
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("brand_voice", value)}>
                      <SelectTrigger>
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

                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-gray-900 font-medium">
                      Industry
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("industry", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="saas">SaaS</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="best_subject" className="text-gray-900 font-medium">
                    Best Performing Subject (Optional)
                  </Label>
                  <Input
                    id="best_subject"
                    placeholder="e.g., Unlock smarter outreach with AI – Try free today!"
                    value={formData.best_subject}
                    onChange={(e) => handleInputChange("best_subject", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="average_open_rate" className="text-gray-900 font-medium">
                    Current Average Open Rate (%)
                  </Label>
                  <Input
                    id="average_open_rate"
                    type="number"
                    step="0.1"
                    placeholder="20.6"
                    value={formData.average_open_rate}
                    onChange={(e) => handleInputChange("average_open_rate", e.target.value)}
                  />
                </div>

                {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

                <Button
                  type="submit"
                  disabled={loading || !formData.campaign_type || !formData.target_audience}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Subject Lines"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {metadata && (
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-900 font-poppins flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900 font-poppins">{metadata.total_options}</div>
                      <div className="text-sm text-gray-600">Generated Options</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-500 font-poppins">
                        {metadata.avg_predicted_open_rate}
                      </div>
                      <div className="text-sm text-gray-600">Avg. Open Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {results.length > 0 && (
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-900 font-poppins flex items-center gap-2">
                    <Star className="w-5 h-5 text-orange-500" />
                    Generated Subject Lines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {results
                      .sort((a, b) => b.predicted_open_rate - a.predicted_open_rate)
                      .map((line, index) => (
                        <div
                          key={line.id}
                          className="p-4 border border-gray-200 rounded-lg hover:border-orange-200 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <Badge className={getCategoryColor(line.category)}>{line.category}</Badge>
                            <div className="flex items-center gap-1 text-orange-500 font-semibold">
                              <TrendingUp className="w-4 h-4" />
                              {line.predicted_open_rate}%
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <div className="text-xs text-gray-500 mb-1">SUBJECT LINE</div>
                              <div className="font-semibold text-gray-900 font-inter">{line.subject}</div>
                            </div>

                            <div>
                              <div className="text-xs text-gray-500 mb-1">PREVIEW TEXT</div>
                              <div className="text-gray-600 text-sm font-inter">{line.preview}</div>
                            </div>
                          </div>

                          {index === 0 && <Badge className="mt-2 bg-orange-100 text-orange-800">Best Performing</Badge>}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {results.length === 0 && !loading && (
              <Card className="bg-white shadow-lg">
                <CardContent className="text-center py-12">
                  <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-inter">
                    Fill out the form and click "Generate Subject Lines" to see your results here.
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
