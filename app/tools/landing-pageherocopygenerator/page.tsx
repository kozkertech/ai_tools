"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Copy, CheckCircle, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { ContentLoadingScreen } from "@/components/loading-screen" // Import the loading screen


interface GeneratedCopy {
  adCopy: string
  ctas: string[]
}

export default function HeroCopyGenerator() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    productName: "",
    productFeatures: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [generatedCopy, setGeneratedCopy] = useState<GeneratedCopy | null>(null)
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const { toast } = useToast()

   if (isLoading) {    
        return < ContentLoadingScreen />  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const parseBackendResponse = (responseText: string): GeneratedCopy => {
    // Split by **CTAs:** to separate ad copy from CTAs
    const parts = responseText.split("**CTAs:**")
    const adCopy = parts[0].replace("**Ad Copy:**", "").trim()

    // Extract CTAs
    const ctaSection = parts[1] || ""
    const ctaMatches = ctaSection.match(/\*\*(.*?)\*\*/g) || []
    const ctas = ctaMatches.map((cta) => cta.replace(/\*\*/g, ""))
    

    return { adCopy, ctas }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setGeneratedCopy(null)

    try {
      const response = await fetch(
        "https://n8n.srv832341.hstgr.cloud/webhook/6b699db4-53f1-45ae-b155-390996beb2b5",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to generate copy")
      }


        
      const data = await response.json()

      // Parse the response based on the expected format
      if (data && data.length > 0 && data[0]["SoMe Text"]) {
        const parsedCopy = parseBackendResponse(data[0]["SoMe Text"])
        setGeneratedCopy(parsedCopy)
        toast({
          title: "Success!",
          description: "Your hero copy has been generated successfully.",
        })
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to generate copy. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(type)
      setTimeout(() => setCopiedText(null), 2000)
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  const isFormValid = formData.name && formData.email && formData.productName && formData.productFeatures

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(90deg, #FFF7ED 0%, #FFF9F6 100%)" }}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8" style={{ color: "#FF7435" }} />
            <h1
              className="text-4xl font-bold"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                color: "#111827",
              }}
            >
              Hero Copy Generator
            </h1>
          </div>
          <p
            className="text-lg"
            style={{
              color: "#6B7280",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            Generate compelling landing page copy for your product in seconds
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Form */}
          <Card className="shadow-lg border-0" style={{ backgroundColor: "#F9FAFB" }}>
            <CardHeader>
              <CardTitle
                style={{
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                  color: "#111827",
                }}
              >
                Product Details
              </CardTitle>
              <CardDescription
                style={{
                  color: "#6B7280",
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                }}
              >
                Tell us about your product to generate personalized copy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    style={{
                      color: "#111827",
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Your Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="border-gray-200 focus:border-[#FF7435] focus:ring-[#FF7435]"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    style={{
                      color: "#111827",
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="border-gray-200 focus:border-[#FF7435] focus:ring-[#FF7435]"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="productName"
                    style={{
                      color: "#111827",
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Product Name
                  </Label>
                  <Input
                    id="productName"
                    name="productName"
                    type="text"
                    placeholder="Enter your product name"
                    value={formData.productName}
                    onChange={handleInputChange}
                    required
                    className="border-gray-200 focus:border-[#FF7435] focus:ring-[#FF7435]"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="productFeatures"
                    style={{
                      color: "#111827",
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    Product Features
                  </Label>
                  <Textarea
                    id="productFeatures"
                    name="productFeatures"
                    placeholder="Describe your product's key features and benefits..."
                    value={formData.productFeatures}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="border-gray-200 focus:border-[#FF7435] focus:ring-[#FF7435] resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className="w-full text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 hover:shadow-lg"
                  style={{
                    backgroundColor: "#FF7435",
                    fontFamily:
                      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                    fontWeight: 600,
                    padding: "16px",
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
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Copy...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Hero Copy
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Generated Copy Display */}
          <div className="space-y-6">
            {generatedCopy ? (
              <>
                {/* Ad Copy Section */}
                <Card className="shadow-lg border-0" style={{ backgroundColor: "#F9FAFB" }}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle
                        style={{
                          fontFamily:
                            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                          color: "#111827",
                        }}
                      >
                        Generated Ad Copy
                      </CardTitle>
                      <CardDescription
                        style={{
                          color: "#6B7280",
                          fontFamily:
                            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                        }}
                      >
                        Your personalized hero section copy
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedCopy.adCopy, "Ad Copy")}
                      className="shrink-0"
                    >
                      {copiedText === "Ad Copy" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 rounded-lg border-l-4 bg-white" style={{ borderLeftColor: "#FF7435" }}>
                      <p
                        className="text-sm leading-relaxed whitespace-pre-line"
                        style={{
                          color: "#111827",
                          fontFamily:
                            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                        }}
                      >
                        {generatedCopy.adCopy}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* CTAs Section */}
                {generatedCopy.ctas.length > 0 && (
                  <Card className="shadow-lg border-0" style={{ backgroundColor: "#F9FAFB" }}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle
                          style={{
                            fontFamily:
                              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                            color: "#111827",
                          }}
                        >
                          Call-to-Action Buttons
                        </CardTitle>
                        <CardDescription
                          style={{
                            color: "#6B7280",
                            fontFamily:
                              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                          }}
                        >
                          Ready-to-use CTA suggestions
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generatedCopy.ctas.join("\n"), "CTAs")}
                        className="shrink-0"
                      >
                        {copiedText === "CTAs" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {generatedCopy.ctas.map((cta, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                            <span
                              className="font-medium"
                              style={{
                                color: "#111827",
                                fontFamily:
                                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                              }}
                            >
                              {cta}
                            </span>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(cta, `CTA ${index + 1}`)}>
                              {copiedText === `CTA ${index + 1}` ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="shadow-lg border-0" style={{ backgroundColor: "#F9FAFB" }}>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Sparkles className="h-12 w-12 mb-4" style={{ color: "#FF7435" }} />
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                      color: "#111827",
                    }}
                  >
                    Ready to Generate Copy?
                  </h3>
                  <p
                    className="text-center"
                    style={{
                      color: "#6B7280",
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                    }}
                  >
                    Fill out the form to generate compelling hero copy for your landing page.
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
