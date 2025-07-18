"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sparkles, Target, Users, Building2 } from "lucide-react"

import { ContentLoadingScreen } from "@/components/loading-screen" // Import the loading screen

interface FormData {
  name: string
  email: string
  companyName: string
  industry: string
  targetAudience: string
  keyProductsServices: string
  differentiator: string
  tonePreference: string
}

interface TaglineResult {
  tagline: string
  uvp: string
  explanation: string
}

export default function TaglineCreator() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    companyName: "",
    industry: "",
    targetAudience: "",
    keyProductsServices: "",
    differentiator: "",
    tonePreference: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<TaglineResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "E-commerce",
    "Education",
    "Manufacturing",
    "Real Estate",
    "Food & Beverage",
    "Fashion",
    "Automotive",
    "Entertainment",
    "Consulting",
    "Other",
  ]

  const toneOptions = [
    "Professional",
    "Friendly",
    "Bold",
    "Creative",
    "Trustworthy",
    "Innovative",
    "Playful",
    "Sophisticated",
    "Energetic",
    "Reliable",
  ]

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const parseResponse = (responseText: string): TaglineResult => {
    // Parse the markdown-like response
    const taglineMatch = responseText.match(/\*\*Tagline:\*\*\s*\*"([^"]+)"\*/)
    const uvpMatch = responseText.match(/\*\*UVP:\*\*\s*\*"([^"]+)"\*/)
    const explanationMatch = responseText.match(/\*$$([^)]+)$$\*/)

    return {
      tagline: taglineMatch ? taglineMatch[1] : "Generated tagline will appear here",
      uvp: uvpMatch ? uvpMatch[1] : "Generated UVP will appear here",
      explanation: explanationMatch ? explanationMatch[1] : "Explanation will appear here",
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        "https://n8n.srv832341.hstgr.cloud/webhook/785ebaf0-797f-4c57-9a13-706fb085b748",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to generate tagline")
      }

      // Parse the JSON response first
      const responseData = await response.json()

      // Extract the output from the array structure
      const outputText = responseData[0]?.output || responseData.output || JSON.stringify(responseData)

      // Parse the extracted text
      const parsedResult = parseResponse(outputText)
      setResult(parsedResult)
    } catch (err) {
      setError("Failed to generate tagline. Please try again.")
      console.error("Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

   if (isLoading) {    
        return < ContentLoadingScreen />  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      companyName: "",
      industry: "",
      targetAudience: "",
      keyProductsServices: "",
      differentiator: "",
      tonePreference: "",
    })
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F9FAFB" }}>
      {/* Header */}
      <div
        className="py-12 px-4"
        style={{
          background: "linear-gradient(90deg, #FFF7ED 0%, #FFF9F6 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 mr-3" style={{ color: "#FF7435" }} />
            <h1
              className="text-4xl font-bold"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                color: "#111827",
              }}
            >
              AI Tagline Creator
            </h1>
          </div>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
              color: "#6B7280",
            }}
          >
            Create compelling taglines and unique value propositions that capture your brand's essence and resonate with
            your target audience.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle
                className="text-2xl flex items-center"
                style={{
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                  color: "#111827",
                }}
              >
                <Building2 className="w-6 h-6 mr-2" style={{ color: "#FF7435" }} />
                Tell Us About Your Business
              </CardTitle>
              <CardDescription
                style={{
                  color: "#6B7280",
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                }}
              >
                Provide details about your company to generate the perfect tagline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      style={{
                        color: "#111827",
                        fontFamily:
                          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                      }}
                    >
                      Your Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      style={{
                        color: "#111827",
                        fontFamily:
                          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                      }}
                    >
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="companyName"
                    style={{
                      color: "#111827",
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                    }}
                  >
                    Company Name *
                  </Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    required
                    placeholder="Your Company Inc."
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="industry"
                    style={{
                      color: "#111827",
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                    }}
                  >
                    Industry *
                  </Label>
                  <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="targetAudience"
                    style={{
                      color: "#111827",
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                    }}
                  >
                    Target Audience *
                  </Label>
                  <Textarea
                    id="targetAudience"
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                    required
                    placeholder="Describe your ideal customers (e.g., small business owners, tech enthusiasts, young professionals)"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="keyProductsServices"
                    style={{
                      color: "#111827",
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                    }}
                  >
                    Key Products/Services *
                  </Label>
                  <Textarea
                    id="keyProductsServices"
                    value={formData.keyProductsServices}
                    onChange={(e) => handleInputChange("keyProductsServices", e.target.value)}
                    required
                    placeholder="What are your main offerings? (e.g., AI automation tools, consulting services, mobile apps)"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="differentiator"
                    style={{
                      color: "#111827",
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                    }}
                  >
                    What Makes You Different? *
                  </Label>
                  <Textarea
                    id="differentiator"
                    value={formData.differentiator}
                    onChange={(e) => handleInputChange("differentiator", e.target.value)}
                    required
                    placeholder="What sets you apart from competitors? (e.g., faster delivery, better pricing, unique features)"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="tonePreference"
                    style={{
                      color: "#111827",
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                    }}
                  >
                    Preferred Tone *
                  </Label>
                  <Select
                    value={formData.tonePreference}
                    onValueChange={(value) => handleInputChange("tonePreference", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your preferred tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {toneOptions.map((tone) => (
                        <SelectItem key={tone} value={tone}>
                          {tone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full text-white font-semibold py-4 rounded-lg transition-colors"
                  style={{
                    backgroundColor: "#FF7435",
                    padding: "16px",
                    fontWeight: "600",
                    fontFamily:
                      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#E6661F"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#FF7435"
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Your Tagline...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate My Tagline
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <p
                    className="text-red-600"
                    style={{
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                    }}
                  >
                    {error}
                  </p>
                </CardContent>
              </Card>
            )}

            {result && (
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle
                    className="text-2xl flex items-center"
                    style={{
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                      color: "#111827",
                    }}
                  >
                    <Target className="w-6 h-6 mr-2" style={{ color: "#FF7435" }} />
                    Your Generated Tagline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-6 rounded-lg" style={{ backgroundColor: "#FFF7ED" }}>
                    <h3
                      className="text-lg font-semibold mb-3"
                      style={{
                        fontFamily:
                          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                        color: "#111827",
                      }}
                    >
                      Tagline
                    </h3>
                    <p
                      className="text-2xl font-bold"
                      style={{
                        fontFamily:
                          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                        color: "#FF7435",
                      }}
                    >
                      "{result.tagline}"
                    </p>
                  </div>

                  <div className="p-6 rounded-lg" style={{ backgroundColor: "#F9FAFB" }}>
                    <h3
                      className="text-lg font-semibold mb-3 flex items-center"
                      style={{
                        fontFamily:
                          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                        color: "#111827",
                      }}
                    >
                      <Users className="w-5 h-5 mr-2" style={{ color: "#FF7435" }} />
                      Unique Value Proposition
                    </h3>
                    <p
                      className="text-base leading-relaxed"
                      style={{
                        fontFamily:
                          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                        color: "#6B7280",
                      }}
                    >
                      {result.uvp}
                    </p>
                  </div>

                  

                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="w-full font-semibold py-4 rounded-lg"
                    style={{
                      borderColor: "#FF7435",
                      color: "#FF7435",
                      padding: "16px",
                      fontWeight: "600",
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                    }}
                  >
                    Create Another Tagline
                  </Button>
                </CardContent>
              </Card>
            )}

            {!result && !isLoading && (
              <Card className="shadow-lg border-0 opacity-50">
                <CardHeader>
                  <CardTitle
                    className="text-2xl flex items-center"
                    style={{
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                      color: "#111827",
                    }}
                  >
                    <Target className="w-6 h-6 mr-2" style={{ color: "#FF7435" }} />
                    Your Results Will Appear Here
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    style={{
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                      color: "#6B7280",
                    }}
                  >
                    Fill out the form and click "Generate My Tagline" to see your personalized tagline and unique value
                    proposition.
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
