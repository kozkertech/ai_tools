"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Sparkles, Target, Plus, Trash2, Copy, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FormattedOutput } from "@/components/formatted-output"

interface FormData {
  productName: string
  targetAudience: string
  keyBenefits: string[]
  callToAction: string
  tone: string
  scriptLength: string
  industry: string
  priceRange: string
}

export default function SalesScriptGenerator() {
  const [formData, setFormData] = useState<FormData>({
    productName: "",
    targetAudience: "",
    keyBenefits: [""],
    callToAction: "",
    tone: "",
    scriptLength: "short",
    industry: "",
    priceRange: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [generatedScript, setGeneratedScript] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setGeneratedScript("")

    try {
      const response = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/sales-script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      // Handle the response - it might be an array or object
      let scriptContent = ""
      if (Array.isArray(result) && result.length > 0) {
        scriptContent = typeof result[0] === "string" ? result[0] : JSON.stringify(result[0])
      } else if (result.script) {
        scriptContent = result.script
      } else if (result.generatedScript) {
        scriptContent = result.generatedScript
      } else {
        scriptContent = JSON.stringify(result, null, 2)
      }

      setGeneratedScript(scriptContent)
    } catch (err) {
      console.error("Error generating sales script:", err)
      setError("Failed to generate sales script. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...formData.keyBenefits]
    newBenefits[index] = value
    setFormData((prev) => ({ ...prev, keyBenefits: newBenefits }))
  }

  const addBenefit = () => {
    setFormData((prev) => ({
      ...prev,
      keyBenefits: [...prev.keyBenefits, ""],
    }))
  }

  const removeBenefit = (index: number) => {
    if (formData.keyBenefits.length > 1) {
      const newBenefits = formData.keyBenefits.filter((_, i) => i !== index)
      setFormData((prev) => ({ ...prev, keyBenefits: newBenefits }))
    }
  }

  const resetForm = () => {
    setFormData({
      productName: "",
      targetAudience: "",
      keyBenefits: [""],
      callToAction: "",
      tone: "",
      scriptLength: "short",
      industry: "",
      priceRange: "",
    })
    setGeneratedScript("")
    setError("")
  }

  const copyToClipboard = async () => {
    try {
      // Extract plain text from the formatted content for copying
      const plainText = generatedScript.replace(/<[^>]*>/g, "").replace(/\\n/g, "\n")
      await navigator.clipboard.writeText(plainText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const isFormValid =
    formData.productName &&
    formData.targetAudience &&
    formData.keyBenefits.some((benefit) => benefit.trim()) &&
    formData.callToAction &&
    formData.tone

  return (
    <div className="min-h-screen brand-section-bg">
      {/* Header */}
      <div className="brand-header-gradient py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="h-8 w-8" style={{ color: "#FF7435" }} />
              <h1 className="text-4xl font-poppins font-bold brand-heading">Sales Script Generator</h1>
            </div>
            <p className="text-lg brand-body max-w-2xl mx-auto">
              Create compelling sales scripts tailored to your product and audience. Fill in the details below and let
              AI craft the perfect pitch for you.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-poppins brand-heading">
                <Target className="h-5 w-5" style={{ color: "#FF7435" }} />
                Script Details
              </CardTitle>
              <CardDescription className="brand-body">
                Provide information about your product and target audience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Script Details Header */}

                <div className="h-1 brand-primary rounded-full mb-6"></div>

                {/* Product Name */}
                <div>
                  <Label htmlFor="productName" className="brand-heading font-medium">
                    Product Name *
                  </Label>
                  <Input
                    id="productName"
                    value={formData.productName}
                    onChange={(e) => handleInputChange("productName", e.target.value)}
                    placeholder="e.g., Mr Food's fries"
                    className="mt-2 border-gray-300 focus:border-orange-400 focus:ring-orange-400"
                    required
                  />
                </div>

                {/* Target Audience */}
                <div>
                  <Label htmlFor="targetAudience" className="brand-heading font-medium">
                    Target Audience *
                  </Label>
                  <Textarea
                    id="targetAudience"
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                    placeholder="e.g., children"
                    className="mt-2 border-gray-300 focus:border-orange-400 focus:ring-orange-400"
                    rows={3}
                    required
                  />
                </div>

                {/* Key Benefits */}
                <div>
                  <Label className="brand-heading font-medium">Key Benefits *</Label>
                  <div className="mt-2 space-y-3">
                    {formData.keyBenefits.map((benefit, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={benefit}
                          onChange={(e) => handleBenefitChange(index, e.target.value)}
                          placeholder="Enter a key benefit"
                          className="flex-1 border-gray-300 focus:border-orange-400 focus:ring-orange-400"
                        />
                        {formData.keyBenefits.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeBenefit(index)}
                            className="shrink-0 border-gray-300 hover:border-red-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={addBenefit}
                      className="w-full border-2 border-dashed border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Benefit
                    </Button>
                  </div>
                </div>

                {/* Call to Action */}
                <div>
                  <Label htmlFor="callToAction" className="brand-heading font-medium">
                    Call to Action *
                  </Label>
                  <Input
                    id="callToAction"
                    value={formData.callToAction}
                    onChange={(e) => handleInputChange("callToAction", e.target.value)}
                    placeholder="e.g., Hurry! Grab your first pack now"
                    className="mt-2 border-gray-300 focus:border-orange-400 focus:ring-orange-400"
                    required
                  />
                </div>

                {/* Tone */}
                <div>
                  <Label htmlFor="tone" className="brand-heading font-medium">
                    Tone *
                  </Label>
                  <Select value={formData.tone} onValueChange={(value) => handleInputChange("tone", value)}>
                    <SelectTrigger className="mt-2 border-gray-300 focus:border-orange-400 focus:ring-orange-400">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="persuasive">Persuasive</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                      <SelectItem value="consultative">Consultative</SelectItem>
                      <SelectItem value="authoritative">Authoritative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Script Length */}
                <div>
                  <Label className="brand-heading font-medium">Script Length *</Label>
                  <div className="mt-2 flex gap-6">
                    {["short", "medium", "long"].map((length) => (
                      <div key={length} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={length}
                          name="scriptLength"
                          value={length}
                          checked={formData.scriptLength === length}
                          onChange={(e) => handleInputChange("scriptLength", e.target.value)}
                          className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                        />
                        <Label htmlFor={length} className="brand-body capitalize">
                          {length}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optional Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="industry" className="brand-body font-medium">
                      Industry (Optional)
                    </Label>
                    <Input
                      id="industry"
                      value={formData.industry}
                      onChange={(e) => handleInputChange("industry", e.target.value)}
                      placeholder="e.g., Technology, Healthcare"
                      className="mt-2 border-gray-300 focus:border-orange-400 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="priceRange" className="brand-body font-medium">
                      Price Range (Optional)
                    </Label>
                    <Input
                      id="priceRange"
                      value={formData.priceRange}
                      onChange={(e) => handleInputChange("priceRange", e.target.value)}
                      placeholder="e.g., $99-$299"
                      className="mt-2 border-gray-300 focus:border-orange-400 focus:ring-orange-400"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 brand-primary brand-primary-hover text-white font-semibold py-3 px-4 rounded-lg"
                    disabled={!isFormValid || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Sales Script
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="px-8 border-gray-300 hover:border-orange-400 hover:text-orange-600 bg-transparent"
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="font-poppins brand-heading">Generated Sales Script</CardTitle>
              <CardDescription className="brand-body">Your personalized sales script will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: "#FF7435" }} />
                    <p className="brand-body">Crafting your perfect sales script...</p>
                  </div>
                </div>
              ) : generatedScript ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
                    <FormattedOutput content={generatedScript} />
                  </div>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="w-full border-gray-300 hover:border-orange-400 hover:text-orange-600 bg-transparent"
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Script to Clipboard
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 brand-body">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Fill out the form and click "Generate Sales Script" to see your personalized script here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
