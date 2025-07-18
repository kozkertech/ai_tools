"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, Hash, MessageSquare } from "lucide-react"

import { ContentLoadingScreen } from "@/components/loading-screen" // Import the loading screen

interface FormData {
  name: string
  email: string
  postDetails: string
  targetAudience: string
  tonality: string
}

interface WebhookResponse {
  output?: string
  message?: string
  error?: string
}

export default function CaptionGenerator() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    postDetails: "",
    targetAudience: "",
    tonality: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<WebhookResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    setResponse(null)

    try {
      const webhookResponse = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/caption-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!webhookResponse.ok) {
        throw new Error(`HTTP error! status: ${webhookResponse.status}`)
      }

      const data = await webhookResponse.json()
      setResponse(data)
      setSuccess(true)

      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        postDetails: "",
        targetAudience: "",
        tonality: "",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while generating your caption")
    } finally {
      setIsLoading(false)
    }
  }

   if (isLoading) {    
        return < ContentLoadingScreen />  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-amber-50 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center py-8 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageSquare className="h-8 w-8 text-orange-500" />
            <Hash className="h-8 w-8 text-orange-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-poppins">
            Caption & Hashtag Generator
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Create engaging social media captions and hashtags tailored to your audience and tone
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Card */}
          <Card className="backdrop-blur-lg bg-white/95 border-gray-200 shadow-2xl animate-slide-up">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-lg">
              <CardTitle className="text-gray-900 text-2xl font-poppins">Generate Your Content</CardTitle>
              <CardDescription className="text-gray-600">
                Fill in the details below to create perfect captions and hashtags
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-900 font-medium font-poppins">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500 transition-all duration-300"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-900 font-medium font-poppins">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500 transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postDetails" className="text-gray-900 font-medium font-poppins">
                    Post Details
                  </Label>
                  <Textarea
                    id="postDetails"
                    name="postDetails"
                    value={formData.postDetails}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500 transition-all duration-300 resize-none"
                    placeholder="Describe what your post is about..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience" className="text-gray-900 font-medium font-poppins">
                    Target Audience
                  </Label>
                  <Input
                    id="targetAudience"
                    name="targetAudience"
                    type="text"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    required
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500 transition-all duration-300"
                    placeholder="e.g., young professionals, fitness enthusiasts"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tonality" className="text-gray-900 font-medium font-poppins">
                    Tonality
                  </Label>
                  <Input
                    id="tonality"
                    name="tonality"
                    type="text"
                    value={formData.tonality}
                    onChange={handleInputChange}
                    required
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500 transition-all duration-300"
                    placeholder="e.g., formal, humorous, casual, persuasive"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Caption & Hashtags"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Card */}
          <div className="space-y-6">
            {/* Status Messages */}
            {error && (
              <Alert className="bg-red-50 border-red-200 animate-fade-in">
                <XCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            {success && !error && (
              <Alert className="bg-green-50 border-green-200 animate-fade-in">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-700">
                  Caption and hashtags generated successfully!
                </AlertDescription>
              </Alert>
            )}

            {/* Response Display */}
            {response && (
              <div className="space-y-6">
                {/* Clean heading like in the photo */}
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-gray-900 font-poppins">
                    Your Social media caption with hashtags
                  </h2>
                </div>

                <Card className="backdrop-blur-lg bg-white/95 border-gray-200 shadow-lg">
                  <CardContent className="p-6">
                    {response.output && (
                      <div className="space-y-4">
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                          <div className="prose prose-gray max-w-none">
                            {response.output.split("\n").map((line, index) => {
                              if (line.trim() === "") {
                                return <br key={index} />
                              }

                              // Check if line contains hashtags
                              const hashtagRegex = /#[\w]+/g
                              const parts = line.split(hashtagRegex)
                              const hashtags = line.match(hashtagRegex) || []

                              return (
                                <p key={index} className="text-gray-700 leading-relaxed mb-3 last:mb-0">
                                  {parts.map((part, partIndex) => (
                                    <span key={partIndex}>
                                      {part}
                                      {hashtags[partIndex] && (
                                        <span className="inline-flex items-center bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-sm font-medium mx-1">
                                          {hashtags[partIndex]}
                                        </span>
                                      )}
                                    </span>
                                  ))}
                                </p>
                              )
                            })}
                          </div>
                        </div>

                        {/* Copy to Clipboard Button */}
                        <Button
                          onClick={() => navigator.clipboard.writeText(response.output || "")}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105"
                        >
                          Copy to Clipboard
                        </Button>
                      </div>
                    )}

                    {response.message && (
                      <div className="space-y-2 mt-4">
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                          <p className="text-gray-700">{response.message}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Placeholder when no content */}
            {!response && !error && !isLoading && (
              <div className="space-y-6">
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-gray-400 font-poppins">
                    Your Social media caption with hashtags
                  </h2>
                </div>

                <Card className="backdrop-blur-lg bg-gray-50 border-gray-200 shadow-lg">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex items-center gap-2 mb-4 opacity-50">
                      <MessageSquare className="h-8 w-8 text-gray-400" />
                      <Hash className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">Your generated content will appear here</p>
                    <p className="text-gray-400 text-sm mt-2">Fill out the form and click generate to get started</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
