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
import { Loader2, Palette, CheckCircle, XCircle, Copy, Check, Sparkles, Building2, User, Mail, Compass } from "lucide-react"

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
        setError(responseData.message || "The palette engine failed. Please verify your inputs.")
      }
    } catch (err) {
      setError("Strategic connection error. Please try again.")
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
    <div className="min-h-screen bg-[var(--mist)] text-[var(--night)] transition-colors duration-300 pb-20">
      {/* Header */}
      <div className="border-b border-[var(--iron)] bg-[var(--cloud)]/50 backdrop-blur-md pt-24 pb-8 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto max-w-5xl px-6">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FF7435] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF7435]/20">
                 <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                 <h1 className="text-2xl font-black font-poppins text-[var(--night)] tracking-tight uppercase">Logo Palette Studio</h1>
                 <p className="text-sm font-medium text-[var(--steel)]">Advanced color theory engine for premium brand identities.</p>
              </div>
           </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Form Section */}
          <div className="lg:col-span-12 xl:col-span-5">
            <Card className="card border-2 border-[var(--iron)]/50 shadow-none">
              <CardHeader className="bg-[var(--cloud)]/20 border-b border-[var(--iron)]/50 px-8 py-6">
                <CardTitle className="text-xl font-black font-poppins flex items-center gap-3">
                   <Sparkles className="w-5 h-5 text-[#FF7435]" />
                   Brand DNA
                </CardTitle>
                <CardDescription className="font-medium text-[var(--steel)]">Describe your vision to generate a custom palette.</CardDescription>
              </CardHeader>

              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="field-label flex items-center gap-2">
                        <User className="w-3 h-3 text-[var(--steel)]" /> Full Name
                      </Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="input"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="field-label flex items-center gap-2">
                        <Mail className="w-3 h-3 text-[var(--steel)]" /> Business Email
                      </Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="input"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="field-label flex items-center gap-2">
                      <Building2 className="w-3 h-3 text-[var(--steel)]" /> Industry Vertical
                    </Label>
                    <Input
                      value={formData.industry}
                      onChange={(e) => handleInputChange("industry", e.target.value)}
                      className="input"
                      placeholder="e.g. Fintech, SaaS, Wellness"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="field-label flex items-center gap-2">
                      <Compass className="w-3 h-3 text-[var(--steel)]" /> Brand Mission & Vibe
                    </Label>
                    <Textarea
                      value={formData.brandDescription}
                      onChange={(e) => handleInputChange("brandDescription", e.target.value)}
                      className="input min-h-[120px] rounded-[2rem]"
                      placeholder="Identify your values, audience, and what makes you unique..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="field-label">Aesthetic Preference</Label>
                    <Select
                      value={formData.stylePreferences}
                      onValueChange={(value) => handleInputChange("stylePreferences", value)}
                      required
                    >
                      <SelectTrigger className="input h-14 rounded-full">
                        <SelectValue placeholder="Choose a style direction" />
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
                    className="btn-primary w-full h-14 text-sm font-black uppercase tracking-widest shadow-xl shadow-[#FF7435]/20"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Palette className="mr-2 h-5 w-5" />
                        Generate Strategic Palette
                      </>
                    )}
                  </Button>
                </form>

                {error && (
                  <Alert variant="destructive" className="mt-8 rounded-2xl border-2 animate-in shake-in">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription className="font-bold text-xs">{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="mt-8 bg-emerald-500/10 border-emerald-500/20 text-emerald-600 rounded-2xl border-2 animate-in slide-in-from-top-2">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="font-black uppercase text-[10px] tracking-widest">Synthesis Complete!</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-12 xl:col-span-7">
            {parsedColors.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 animate-in slide-in-from-right-8 duration-700">
                <Card className="card border-2 border-[var(--iron)] xl:sticky xl:top-[12rem]">
                  <CardHeader className="bg-[var(--night)] text-white p-8">
                    <CardTitle className="text-xl font-black font-poppins flex items-center justify-between">
                       <span>Brand Color Specification</span>
                       <Badge className="bg-white/10 text-white border-white/20 font-black px-2 py-0 text-[10px] uppercase tracking-tighter">Hex/v1</Badge>
                    </CardTitle>
                    <CardDescription className="text-white/60 font-medium">Strategically chosen for your industrial profile.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {parsedColors.map((color, index) => (
                        <div key={index} className="p-6 bg-[var(--mist)] border-2 border-[var(--iron)]/40 rounded-[2rem] group hover:border-[#FF7435]/30 transition-all">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-black font-poppins text-[var(--night)] truncate max-w-[120px]">{color.name}</h3>
                            <div
                              className="w-12 h-12 rounded-xl shadow-lg border border-black/5"
                              style={{ backgroundColor: color.hexCode }}
                            />
                          </div>

                          <div className="space-y-3">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase text-[var(--steel)] tracking-widest mb-1">Visual Role</span>
                              <span className="text-xs font-bold text-[var(--night)]">{color.role}</span>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-[var(--steel)] tracking-widest mb-1">Hex Code</span>
                                <span className="text-xs font-mono font-black text-[#FF7435]">{color.hexCode}</span>
                              </div>
                              <Button
                                onClick={() => copyToClipboard(color.hexCode)}
                                variant="ghost"
                                size="sm"
                                className="h-10 w-10 p-0 rounded-xl hover:bg-[#FF7435]/10"
                              >
                                {copiedHex === color.hexCode ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-[#FF7435]" />}
                              </Button>
                            </div>

                            <div className="pt-3 border-t border-[var(--iron)]/50">
                              <span className="text-[10px] font-black uppercase text-[var(--steel)] tracking-widest mb-1 block">Context</span>
                              <p className="text-[11px] font-medium text-[var(--steel)] leading-relaxed italic line-clamp-3">"{color.description}"</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : !isLoading && (
              <div className="h-full flex flex-col items-center justify-center p-12 bg-[var(--cloud)]/30 border-4 border-dashed border-[var(--iron)] rounded-[3rem] text-center opacity-60">
                 <div className="w-20 h-20 bg-[var(--iron)]/30 rounded-full flex items-center justify-center mb-6">
                    <Compass className="w-10 h-10 text-[var(--steel)]" />
                 </div>
                 <h3 className="text-lg font-black font-poppins text-[var(--night)]">Awaiting Input</h3>
                 <p className="text-sm font-medium text-[var(--steel)] max-w-xs mt-2">Fill in your brand details to generate a professional color specification.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
