"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Palette, CheckCircle, XCircle, Copy, Check } from "lucide-react"

interface FormData {
  name: string
  email: string
  industry: string
  brandDescription: string
  stylePreferences: string
}

interface ColorInfo {
  name: string
  role: string
  hexCode: string
  description: string
}

interface WebhookResponse {
  success?: boolean
  message?: string
  output?: string
  [key: string]: any
}

export default function LogoPaletteGenerator() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    industry: "",
    brandDescription: "",
    stylePreferences: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<WebhookResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [copiedHex, setCopiedHex] = useState<string | null>(null)

  const styleOptions = ["Modern", "Classic", "Minimalist", "Bold", "Elegant", "Playful", "Professional", "Creative"]

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const parseColorOutput = (output: string): ColorInfo[] => {
    const colors: ColorInfo[] = []
    const colorBlocks = output.split(/\n\n+/).filter((block) => block.trim())

    colorBlocks.forEach((block) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line)
      if (lines.length >= 4) {
        const name = lines[0].replace(/^\d+\)\s*/, "").trim()
        const role = lines[1].replace(/^Role:\s*/i, "").trim()
        const hexCode = lines[2].replace(/^Hex Code:\s*/i, "").trim()
        const description = lines[3].replace(/^Description:\s*/i, "").trim()

        colors.push({ name, role, hexCode, description })
      }
    })

    return colors
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedHex(text)
      setTimeout(() => setCopiedHex(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    setResponse(null)

    try {
      const webhookResponse = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/logo-palette", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const responseData = await webhookResponse.json()

      if (webhookResponse.ok) {
        setSuccess(true)
        setResponse(responseData)
      } else {
        setError(responseData.message || "Failed to generate palette")
      }
    } catch (err) {
      setError("Network error. Please try again.")
      console.error("Webhook error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid =
    formData.name && formData.email && formData.industry && formData.brandDescription && formData.stylePreferences

  // Parse colors from response
  let parsedColors: ColorInfo[] = []
  if (response && Array.isArray(response) && response[0]?.output) {
    parsedColors = parseColorOutput(response[0].output)
  } else if (response?.output) {
    parsedColors = parseColorOutput(response.output)
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-body">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-[#FFF7ED] to-[#FFF9F6] py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Palette className="h-12 w-12 text-[#FF7435] mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-[#111827] font-heading">
                Logo Colour Palette Generator
              </h1>
            </div>
            <p className="text-[#6B7280] text-lg md:text-xl">Generate the perfect colour palette for your brand</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-[#111827] font-heading">Tell us about your brand</CardTitle>
              <CardDescription className="text-[#6B7280]">
                We'll create a custom colour palette based on your preferences
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[#111827] font-medium">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="border-gray-300 focus:border-[#FF7435] focus:ring-[#FF7435]"
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#111827] font-medium">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="border-gray-300 focus:border-[#FF7435] focus:ring-[#FF7435]"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-[#111827] font-medium">
                    Industry *
                  </Label>
                  <Input
                    id="industry"
                    type="text"
                    value={formData.industry}
                    onChange={(e) => handleInputChange("industry", e.target.value)}
                    className="border-gray-300 focus:border-[#FF7435] focus:ring-[#FF7435]"
                    placeholder="e.g., Technology, Healthcare, Fashion"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brandDescription" className="text-[#111827] font-medium">
                    Brand Description *
                  </Label>
                  <Textarea
                    id="brandDescription"
                    value={formData.brandDescription}
                    onChange={(e) => handleInputChange("brandDescription", e.target.value)}
                    className="border-gray-300 focus:border-[#FF7435] focus:ring-[#FF7435] min-h-[100px]"
                    placeholder="Describe your brand, values, and target audience..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stylePreferences" className="text-[#111827] font-medium">
                    Style Preferences *
                  </Label>
                  <Select
                    value={formData.stylePreferences}
                    onValueChange={(value) => handleInputChange("stylePreferences", value)}
                    required
                  >
                    <SelectTrigger className="border-gray-300 focus:border-[#FF7435] focus:ring-[#FF7435]">
                      <SelectValue placeholder="Choose your preferred style" />
                    </SelectTrigger>
                    <SelectContent>
                      {styleOptions.map((style) => (
                        <SelectItem key={style} value={style.toLowerCase()}>
                          {style}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className="w-full bg-[#FF7435] hover:bg-[#E6681F] text-white font-semibold py-4 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Palette...
                    </>
                  ) : (
                    <>
                      <Palette className="mr-2 h-5 w-5" />
                      Generate Colour Palette
                    </>
                  )}
                </Button>
              </form>

              {/* Status Messages */}
              {error && (
                <Alert className="bg-red-50 border-red-200 animate-in slide-in-from-top-2 duration-300">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 border-green-200 animate-in slide-in-from-top-2 duration-300">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">Colour palette generated successfully!</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {parsedColors.length > 0 && (
              <Card className="bg-white shadow-lg border-0 animate-in slide-in-from-right-4 duration-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#111827] font-heading flex items-center">
                    <Palette className="mr-2 h-6 w-6 text-[#FF7435]" />
                    Your Brand Colour Palette
                  </CardTitle>
                  <CardDescription className="text-[#6B7280]">
                    Here are the perfect colours for your brand
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {parsedColors.map((color, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[#111827] font-heading">{color.name}</h3>
                        <div
                          className="w-12 h-12 rounded-lg shadow-md border border-gray-200"
                          style={{ backgroundColor: color.hexCode }}
                        />
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="font-bold text-[#111827]">Role:</span>{" "}
                          <span className="text-[#6B7280]">{color.role}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-[#111827]">Hex Code:</span>{" "}
                            <span className="text-[#6B7280] font-mono">{color.hexCode}</span>
                          </div>
                          <Button
                            onClick={() => copyToClipboard(color.hexCode)}
                            variant="outline"
                            size="sm"
                            className="ml-2 h-8 w-8 p-0 border-[#FF7435] text-[#FF7435] hover:bg-[#FF7435] hover:text-white"
                          >
                            {copiedHex === color.hexCode ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </Button>
                        </div>

                        <div>
                          <span className="font-bold text-[#111827]">Description:</span>
                          <p className="text-[#6B7280] mt-1 leading-relaxed">{color.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-[#6B7280] text-sm">Powered by advanced colour theory and brand psychology</p>
        </div>
      </div>
    </div>
  )
}
