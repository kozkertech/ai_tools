"use client"
import { useState, type FormEvent } from "react"
import { Copy, Loader2, CheckCircle, XCircle, Wand2, Megaphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ContentLoadingScreen } from "@/components/loading-screen"

interface FormData {
  name: string
  email: string
  product: string
  targetAudience: string
  tone: string
}

interface ResponseType {
  output: string
  [key: string]: any
}

interface Message {
  type: "success" | "error"
  text: string
}

export default function CopyGenerator() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    product: "",
    targetAudience: "",
    tone: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [copyResponse, setCopyResponse] = useState<ResponseType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<Message | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>("")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setCopyResponse(null)
    setMessage(null)
    setDebugInfo("")

    try {
      const response = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/785ebaf0-797f-4c57-9a13-706fb085b748", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to generate copy")
      }

      const responseData = await response.json()
      setDebugInfo(JSON.stringify(responseData, null, 2))

      setCopyResponse(responseData)
      setMessage({
        type: "success",
        text: "Copy generated successfully!",
      })
    } catch (err) {
      const errorMessage = "Failed to generate copy. Please try again."
      setError(errorMessage)
      setMessage({
        type: "error",
        text: errorMessage,
      })
      console.error("Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      product: "",
      targetAudience: "",
      tone: "",
    })
    setCopyResponse(null)
    setError(null)
    setMessage(null)
    setDebugInfo("")
  }

  const parseMarkdownToHTML = (markdown: string) => {
    if (!markdown) return ""
    return markdown
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-lg font-semibold text-gray-900 dark:text-white font-poppins mb-2 mt-4">$1</h3>',
      )
      .replace(
        /^## (.*$)/gim,
        '<h2 class="text-xl font-semibold text-gray-900 dark:text-white font-poppins mb-3 mt-6">$1</h2>',
      )
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-2xl font-bold text-gray-900 dark:text-white font-poppins mb-4 mt-8 first:mt-0">$1</h1>',
      )
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
      .split(/\n\s*\n/)
      .map((paragraph) => {
        const trimmed = paragraph.trim()
        if (!trimmed) return ""
        if (trimmed.match(/^<h[1-6]/)) return trimmed
        const withBreaks = trimmed.replace(/\n/g, "<br />")
        return `<p class="text-gray-500 dark:text-gray-400 font-inter mb-4 leading-relaxed">${withBreaks}</p>`
      })
      .filter(Boolean)
      .join("")
  }

  const renderCopyOutput = () => {
    if (!copyResponse) return null

    let content = ""
    if (Array.isArray(copyResponse)) {
      const firstItem = copyResponse[0]
      if (firstItem && typeof firstItem === "object") {
        content = firstItem.output || firstItem.message || firstItem.copy || ""
      }
    } else {
      content =
        copyResponse.output ||
        copyResponse.copy ||
        copyResponse.content ||
        copyResponse.message ||
        copyResponse.data?.output ||
        copyResponse.data?.content
    }

    if (!content) {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-poppins">Your generated copy</h2>
          <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-yellow-800 dark:text-yellow-100 font-inter mb-2">
              Response received but no content found
            </p>
            <details className="text-sm">
              <summary className="cursor-pointer text-yellow-600 dark:text-yellow-300 font-medium">
                View Raw Response
              </summary>
              <pre className="mt-2 text-xs text-yellow-700 dark:text-yellow-200 whitespace-pre-wrap">
                {JSON.stringify(copyResponse, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )
    }

    const htmlContent = parseMarkdownToHTML(content)

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-poppins">Your generated copy</h2>
          <Button
            onClick={() => navigator.clipboard.writeText(content)}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </Button>
        </div>
        <div
          className="prose prose-lg max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    )
  }

  if (isLoading) {
    return <ContentLoadingScreen />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-zinc-900 dark:to-zinc-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-[#FF7435] rounded-lg flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold font-poppins">AI Copy Generator</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-inter text-lg max-w-2xl mx-auto">
            Craft marketing copy tailored to your product, audience, and tone of voice
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row h-auto md:h-[calc(100vh-180px)]">
        {/* Form Section */}
        <div className="w-full md:w-1/2 bg-gray-50 dark:bg-[#0a0a0a] p-8 overflow-y-auto">
          <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-[#111111] rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="mb-6">
                <h2 className="text-xl font-semibold font-poppins mb-2">Generate Product Copy</h2>
                <p className="text-gray-500 dark:text-gray-400 font-inter">
                  Fill out the form below to create compelling marketing copy
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-medium font-inter">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 focus:border-[#FF7435] focus:ring-[#FF7435] font-inter rounded-lg"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium font-inter">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 focus:border-[#FF7435] focus:ring-[#FF7435] font-inter rounded-lg"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product" className="font-medium font-inter">
                    Product or Service
                  </Label>
                  <Textarea
                    id="product"
                    name="product"
                    value={formData.product}
                    onChange={(e) => handleInputChange("product", e.target.value)}
                    required
                    rows={4}
                    className="bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 focus:border-[#FF7435] focus:ring-[#FF7435] font-inter resize-none rounded-lg"
                    placeholder="Describe your product or service..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience" className="font-medium font-inter">
                    Target Audience
                  </Label>
                  <Textarea
                    id="targetAudience"
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                    required
                    rows={3}
                    className="bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 focus:border-[#FF7435] focus:ring-[#FF7435] font-inter resize-none rounded-lg"
                    placeholder="Describe your target audience..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone" className="font-medium font-inter">
                    Tone of Voice
                  </Label>
                  <Input
                    id="tone"
                    name="tone"
                    type="text"
                    value={formData.tone}
                    onChange={(e) => handleInputChange("tone", e.target.value)}
                    required
                    className="bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 focus:border-[#FF7435] focus:ring-[#FF7435] font-inter rounded-lg"
                    placeholder="e.g., Professional, Friendly, Casual"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#FF7435] hover:bg-[#E6681F] dark:hover:bg-[#d45616] text-white font-semibold rounded-lg transition-colors duration-200 font-inter"
                  style={{ padding: "16px", fontWeight: 600 }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Copy"
                  )}
                </Button>
              </form>

              {message && (
                <Alert
                  className={`mt-4 ${
                    message.type === "success"
                      ? "bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-800 text-green-800 dark:text-green-100"
                      : "bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-800 text-red-800 dark:text-red-100"
                  }`}
                >
                  <div className="flex items-center">
                    {message.type === "success" ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-2" />
                    )}
                    <AlertDescription className="font-inter">{message.text}</AlertDescription>
                  </div>
                </Alert>
              )}

              {debugInfo && (
                <details className="mt-4 text-xs">
                  <summary className="cursor-pointer text-gray-500 dark:text-gray-400 font-inter">Debug Info</summary>
                  <pre className="mt-2 p-2 bg-gray-100 dark:bg-zinc-800 rounded text-gray-600 dark:text-gray-300 whitespace-pre-wrap overflow-auto max-h-32">
                    {debugInfo}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="w-full md:w-1/2 bg-white dark:bg-[#111111] p-8 overflow-y-auto border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800">
          <div className="max-w-2xl mx-auto">
            {copyResponse ? (
              renderCopyOutput()
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                    <Megaphone className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-poppins mb-2">
                      Your generated copy will appear here
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 font-inter">
                      Fill out the form and click generate to get started.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
