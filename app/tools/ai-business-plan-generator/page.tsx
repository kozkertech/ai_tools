"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Sparkles, CheckCircle, XCircle, Download } from "lucide-react"

import { ContentLoadingScreen } from "@/components/loading-screen" // Import the loading screen

interface FormData {
  name: string
  email: string
  businessIdea: string
  targetMarketSize: string
  industrySector: string
  businessModel: string
  geographicFocus: string
}

interface WebhookResponse {
  output?: string
  success?: boolean
  message?: string
  [key: string]: any
}

// Simple markdown renderer component to replace the missing import
const SimpleMarkdownRenderer = ({ content }: { content: string }) => {
  // Basic markdown parsing for common elements
  const parseMarkdown = (text: string) => {
    // Split by lines and process each line
    const lines = text.split('\n')
    const elements: React.ReactNode[] = []
    let currentParagraph: string[] = []
    let listItems: string[] = []
    let inCodeBlock = false
    let codeBlockContent: string[] = []
    
    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const paragraphText = currentParagraph.join(' ')
        elements.push(
          <p key={elements.length} className="mb-4 leading-relaxed" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
            {parseInlineMarkdown(paragraphText)}
          </p>
        )
        currentParagraph = []
      }
    }
    
    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={elements.length} className="mb-4 list-disc list-inside space-y-1">
            {listItems.map((item, idx) => (
              <li key={idx} style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>{parseInlineMarkdown(item)}</li>
            ))}
          </ul>
        )
        listItems = []
      }
    }
    
    const flushCodeBlock = () => {
      if (codeBlockContent.length > 0) {
        elements.push(
          <pre key={elements.length} className="mb-4 p-4 rounded-lg overflow-x-auto border border-gray-200" style={{ backgroundColor: '#F3F4F6' }}>
            <code className="text-sm font-mono" style={{ color: '#374151', fontFamily: 'monospace' }}>
              {codeBlockContent.join('\n')}
            </code>
          </pre>
        )
        codeBlockContent = []
      }
    }
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim()
      
      // Handle code blocks
      if (trimmedLine.startsWith('```')) {
        if (inCodeBlock) {
          flushCodeBlock()
          inCodeBlock = false
        } else {
          flushParagraph()
          flushList()
          inCodeBlock = true
        }
        return
      }
      
      if (inCodeBlock) {
        codeBlockContent.push(line)
        return
      }
      
      // Handle headings
      if (trimmedLine.startsWith('# ')) {
        flushParagraph()
        flushList()
        elements.push(
          <h1 key={elements.length} className="text-3xl font-bold mb-4" style={{ color: '#111827', fontFamily: 'Poppins, sans-serif' }}>
            {trimmedLine.slice(2)}
          </h1>
        )
      } else if (trimmedLine.startsWith('## ')) {
        flushParagraph()
        flushList()
        elements.push(
          <h2 key={elements.length} className="text-2xl font-bold mb-3" style={{ color: '#111827', fontFamily: 'Poppins, sans-serif' }}>
            {trimmedLine.slice(3)}
          </h2>
        )
      } else if (trimmedLine.startsWith('### ')) {
        flushParagraph()
        flushList()
        elements.push(
          <h3 key={elements.length} className="text-xl font-bold mb-2" style={{ color: '#111827', fontFamily: 'Poppins, sans-serif' }}>
            {trimmedLine.slice(4)}
          </h3>
        )
      } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        flushParagraph()
        listItems.push(trimmedLine.slice(2))
      } else if (trimmedLine === '') {
        flushParagraph()
        flushList()
      } else {
        flushList()
        currentParagraph.push(trimmedLine)
      }
    })
    
    // Flush any remaining content
    flushParagraph()
    flushList()
    flushCodeBlock()
    
    return elements
  }
  
  const parseInlineMarkdown = (text: string) => {
    // Handle bold text
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Handle italic text
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Handle inline code
    text = text.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')
    
    return <span dangerouslySetInnerHTML={{ __html: text }} />
  }
  
  return (
    <div className="prose prose-gray max-w-none">
      {parseMarkdown(content)}
    </div>
  )
}

export default function BusinessPlanGenerator() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    businessIdea: "",
    targetMarketSize: "",
    industrySector: "",
    businessModel: "",
    geographicFocus: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<WebhookResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

 if (isLoading) {   
        return < ContentLoadingScreen />  }
        
  const extractBusinessPlanContent = (data: any): string | null => {
    // Handle array response (your webhook returns an array)
    if (Array.isArray(data) && data.length > 0) {
      const firstItem = data[0]
      if (firstItem.output) {
        return firstItem.output
      }
      if (firstItem.message) {
        return firstItem.message
      }
    }

    // Handle direct object response
    if (data && typeof data === "object") {
      if (data.output) {
        return data.output
      }
      if (data.message) {
        return data.message
      }
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    setResponse(null)

    try {
      const response = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/biz-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          business_idea: formData.businessIdea,
          target_market_size: formData.targetMarketSize,
          industry_sector: formData.industrySector,
          business_model: formData.businessModel,
          geographic_focus: formData.geographicFocus,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Webhook response:", data) // Keep for debugging

      // Extract the business plan content
      const businessPlanContent = extractBusinessPlanContent(data)

     
      

      if (businessPlanContent) {
        setResponse({ output: businessPlanContent })
        setSuccess(true)
      } else {
        setError("No business plan content found in the response")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while generating your business plan")
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = Object.values(formData).every((value) => value.trim() !== "")

  const downloadBusinessPlan = () => {
    if (response?.output) {
      const element = document.createElement("a")
      const file = new Blob([response.output], { type: "text/plain" })
      element.href = URL.createObjectURL(file)
      element.download = `${formData.name.replace(/\s+/g, "_")}_business_plan.txt`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(90deg, #FFF7ED 0%, #FFF9F6 100%)' }} className="border-b border-gray-200">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 animate-pulse" style={{ color: '#FF7435' }} />
              <h1 className="text-4xl md:text-5xl font-bold" style={{ color: '#111827', fontFamily: 'Poppins, sans-serif' }}>AI Business Plan Generator</h1>
              <Sparkles className="h-8 w-8 animate-pulse" style={{ color: '#FF7435' }} />
            </div>
            <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
              Transform your business idea into a comprehensive plan with the power of AI
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form Section */}
          <Card className="bg-white shadow-lg border border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold" style={{ color: '#111827', fontFamily: 'Poppins, sans-serif' }}>Tell Us About Your Business</CardTitle>
              <CardDescription style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                Fill out the form below to generate your personalized business plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-medium" style={{ color: '#111827', fontFamily: 'Inter, sans-serif' }}>
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="border-gray-300"
                    style={{ fontFamily: 'Inter, sans-serif', '--tw-ring-color': '#FF743580' } as React.CSSProperties}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium" style={{ color: '#111827', fontFamily: 'Inter, sans-serif' }}>
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="border-gray-300"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessIdea" className="font-medium" style={{ color: '#111827', fontFamily: 'Inter, sans-serif' }}>
                    Business Idea (Short Description)
                  </Label>
                  <Textarea
                    id="businessIdea"
                    value={formData.businessIdea}
                    onChange={(e) => handleInputChange("businessIdea", e.target.value)}
                    className="border-gray-300 min-h-[100px]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    placeholder="Describe your business idea in a few sentences..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetMarketSize" className="font-medium" style={{ color: '#111827', fontFamily: 'Inter, sans-serif' }}>
                      Target Market Size
                    </Label>
                    <Input
                      id="targetMarketSize"
                      type="text"
                      value={formData.targetMarketSize}
                      onChange={(e) => handleInputChange("targetMarketSize", e.target.value)}
                      className="border-gray-300"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                      placeholder="e.g., 10M users, $5B market"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industrySector" className="font-medium" style={{ color: '#111827', fontFamily: 'Inter, sans-serif' }}>
                      Industry/Sector
                    </Label>
                    <Input
                      id="industrySector"
                      type="text"
                      value={formData.industrySector}
                      onChange={(e) => handleInputChange("industrySector", e.target.value)}
                      className="border-gray-300"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                      placeholder="e.g., Technology, Healthcare"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessModel" className="font-medium" style={{ color: '#111827', fontFamily: 'Inter, sans-serif' }}>
                      Business Model
                    </Label>
                    <Input
                      id="businessModel"
                      type="text"
                      value={formData.businessModel}
                      onChange={(e) => handleInputChange("businessModel", e.target.value)}
                      className="border-gray-300"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                      placeholder="Freemium, Subscription, One-time"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="geographicFocus" className="font-medium" style={{ color: '#111827', fontFamily: 'Inter, sans-serif' }}>
                      Geographic Focus
                    </Label>
                    <Input
                      id="geographicFocus"
                      type="text"
                      value={formData.geographicFocus}
                      onChange={(e) => handleInputChange("geographicFocus", e.target.value)}
                      className="border-gray-300"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                      placeholder="Global, US, Europe, etc."
                      required
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!isFormValid || isLoading}
                  className="w-full text-white font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{ 
                    backgroundColor: '#FF7435',
                    padding: '16px',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && isFormValid) {
                      e.currentTarget.style.backgroundColor = '#E6651E'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading && isFormValid) {
                      e.currentTarget.style.backgroundColor = '#FF7435'
                    }
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span style={{ fontFamily: 'Inter, sans-serif' }}>Generating Your Business Plan...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      <span style={{ fontFamily: 'Inter, sans-serif' }}>Generate Business Plan</span>
                    </>
                  )}
                </Button>
                </div>
            </CardContent>
          </Card>

          {/* Response Section */}
          <div className="space-y-6">
            {/* Status Messages */}
            {error && (
              <Alert className="bg-red-50 border-red-200 animate-in slide-in-from-right duration-500">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription style={{ color: '#7F1D1D', fontFamily: 'Inter, sans-serif' }}>{error}</AlertDescription>
              </Alert>
            )}

            {success && !error && (
              <Alert className="bg-green-50 border-green-200 animate-in slide-in-from-right duration-500">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription style={{ color: '#14532D', fontFamily: 'Inter, sans-serif' }}>Business plan generated successfully!</AlertDescription>
              </Alert>
            )}

            {/* Response Display */}
            {response?.output && (
              <Card className="bg-white shadow-lg border border-gray-200 animate-in slide-in-from-right duration-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-6 w-6" style={{ color: '#FF7435' }} />
                      <CardTitle className="text-2xl font-bold" style={{ color: '#111827', fontFamily: 'Poppins, sans-serif' }}>
                        Your AI-Generated Business Plan
                      </CardTitle>
                    </div>
                    <Button
                      onClick={downloadBusinessPlan}
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      style={{ 
                        borderColor: '#FF7435',
                        color: '#FF7435',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FF7435'
                        e.currentTarget.style.color = 'white'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = '#FF7435'
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <CardDescription style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                    Here's your personalized business plan based on your inputs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg p-6 border border-gray-200 max-h-[600px] overflow-y-auto" style={{ backgroundColor: '#F9FAFB' }}>
                    <SimpleMarkdownRenderer content={response.output} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Placeholder when no response */}
            {!response && !isLoading && (
              <Card className="bg-white shadow-lg border border-gray-200">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Sparkles className="h-16 w-16 mb-4 animate-pulse" style={{ color: '#FF7435' }} />
                  <h3 className="text-xl font-semibold mb-2" style={{ color: '#111827', fontFamily: 'Poppins, sans-serif' }}>Ready to Generate</h3>
                  <p style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                    Fill out the form and click generate to see your AI-powered business plan appear here
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
