"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Rocket, Sparkles, Send, RefreshCcw, ArrowRight, CheckCircle, Brain, Palette, FileText, Target, CornerDownLeft, Copy, BadgeCheck, Download } from "lucide-react"

// Types
type Role = "assistant" | "user"
interface ChatMessage {
  id: string
  role: Role
  text: string | React.ReactNode
  isOptions?: boolean
}

interface WebhookPayload {
  businessIdea: string
  businessType: string
  hasBusinessName: boolean
  businessName?: string
  targetAudience: string
  brandTone: string
  preferredColors: string
  businessGoal: string
  sourceTool: string
  sessionId: string
}

const NEXT_STEPS = [
  {
    title: "Domain Name Genie",
    desc: "Check domain availability for your new business name.",
    href: "/tools/domain-name-generator",
    icon: Globe
  },
  {
    title: "Landing Page Generator",
    desc: "Generate your landing page copy based on your business idea.",
    href: "/tools/landing-pageherocopygenerator",
    icon: LayoutTemplate
  }
]

import { Globe, LayoutTemplate } from "lucide-react"

// Configuration
const WEBHOOK_URL = "https://n8n.srv832341.hstgr.cloud/webhook-test/business-launchpad-ai"

export default function BusinessLaunchpad() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<WebhookPayload>>({})
  const [inputValue, setInputValue] = useState("")
  
  // Custom conditional states
  const [showNameInput, setShowNameInput] = useState(false)
  const [tempCustomInput, setTempCustomInput] = useState("")

  const [isGenerating, setIsGenerating] = useState(false)
  const [resultData, setResultData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  
  const answersRef = useRef<Partial<WebhookPayload>>(answers)
  answersRef.current = answers
  
  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  // Scroll to latest message cleanly
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [messages, step, isGenerating, error])

  // Initialize
  useEffect(() => {
    if (messages.length === 0) {
      addAssistantMessage("Welcome to Business Launchpad! 🚀 To get started, what is your business idea or concept?")
    }
  }, [messages.length])

  const addAssistantMessage = (text: string | React.ReactNode, isOptions = false) => {
    setMessages(prev => [...prev, { id: Date.now().toString() + Math.random(), role: "assistant", text, isOptions }])
  }

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString() + Math.random(), role: "user", text }])
  }

  const handleNextStep = (answerText: string, dataKey: keyof WebhookPayload, dataValue: any) => {
    addUserMessage(answerText)
    setAnswers(prev => ({ ...prev, [dataKey]: dataValue }))
    setInputValue("")
    setTempCustomInput("")
    setShowNameInput(false)
    
    // Go to next question
    const nextStep = step + 1
    setStep(nextStep)
    
    setTimeout(() => {
      askQuestionForStep(nextStep, dataValue)
    }, 600)
  }

  const askQuestionForStep = (upcomingStep: number, previousAnswer?: any) => {
    switch (upcomingStep) {
      case 1:
        addAssistantMessage("Awesome! What type of business is this?", true)
        break
      case 2:
        addAssistantMessage("Do you already have a name for this business?", true)
        break
      case 3:
        addAssistantMessage("Who is your target audience or ideal customer?", true)
        break
      case 4:
        addAssistantMessage("What brand tone or style are you aiming for?", true)
        break
      case 5:
        addAssistantMessage("Any preferred color schemes? (Optional)", true)
        break
      case 6:
        addAssistantMessage("Finally, what is the main goal for this business right now?", true)
        break
      case 7:
        addAssistantMessage(
          <div className="flex flex-col gap-3">
            <p>Great! I have everything I need.</p>
            <Button onClick={generateOutput} className="w-fit bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-md transition-all hover:scale-105 active:scale-95">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Business Blueprint
            </Button>
          </div>
        )
        break
      default:
        break
    }
  }

  const handleTextSubmit = () => {
    if (!inputValue.trim()) return

    if (step === 0) {
      handleNextStep(inputValue, "businessIdea", inputValue)
    } else if (step === 3) {
      handleNextStep(inputValue, "targetAudience", inputValue)
    } else if (step === 5) {
      handleNextStep(inputValue, "preferredColors", inputValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleTextSubmit()
    }
  }

  const generateOutput = async () => {
    setIsGenerating(true)
    setError(null)
    
    const payload = {
      ...answersRef.current,
      businessGoal: answersRef.current.businessGoal,
      sourceTool: "business_launchpad",
      sessionId: "session_" + Date.now()
    }

    console.log("Outgoing Business Launchpad Payload:", payload);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      
      if (!response.ok) throw new Error("Webhook failed with status: " + response.status)
      
      const data = await response.json()
      
      const actualData = data.data || data
      if (!actualData || typeof actualData !== 'object') {
        throw new Error("Invalid response format received from server")
      }
      
      setResultData(actualData)
    } catch (err) {
      console.error("Webhook error:", err)
      setError("We couldn't generate your business launch plan right now. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const resetTool = () => {
    setStep(0)
    setAnswers({})
    setResultData(null)
    setMessages([])
    setTimeout(() => {
      addAssistantMessage("Let's start over! What is your business idea or concept?")
    }, 100)
  }

  const downloadBlueprint = () => {
    if (!resultData) return

    const sections: string[] = []
    sections.push(`# Business Blueprint: ${answers.businessName || 'Your Business Idea'}`)
    sections.push(`Generated on: ${new Date().toLocaleDateString()}\n`)

    // 1. Overview
    sections.push(`## Business Overview`)
    if (typeof resultData.businessOverview === 'string') {
      sections.push(resultData.businessOverview)
    } else if (resultData.businessOverview) {
      if (resultData.businessOverview.summary) sections.push(resultData.businessOverview.summary)
      if (resultData.businessOverview.conceptPositioning) sections.push(`**Concept:** ${resultData.businessOverview.conceptPositioning}`)
      if (resultData.businessOverview.businessDirection) sections.push(`**Direction:** ${resultData.businessOverview.businessDirection}`)
    }
    sections.push('')

    // 2. Names & Taglines
    const nameSuggestions = Array.isArray(resultData.businessNameSuggestions) ? resultData.businessNameSuggestions : (Array.isArray(resultData.nameSuggestions) ? resultData.nameSuggestions : [])
    const refinedNames = Array.isArray(resultData.refinedBrandNames) ? resultData.refinedBrandNames : (Array.isArray(resultData.refinedName) ? resultData.refinedName : [])
    const taglines = Array.isArray(resultData.taglineSuggestions) ? resultData.taglineSuggestions : (Array.isArray(resultData.taglines) ? resultData.taglines : [])

    if (nameSuggestions.length > 0) {
      sections.push(`## Name Suggestions`)
      nameSuggestions.forEach(n => sections.push(`- ${n}`))
      sections.push('')
    }

    if (refinedNames.length > 0) {
      sections.push(`## Refined Names`)
      refinedNames.forEach(n => sections.push(`- ${n}`))
      sections.push('')
    }

    if (taglines.length > 0) {
      sections.push(`## Taglines & Hooks`)
      taglines.forEach(t => sections.push(`- "${t}"`))
      sections.push('')
    }

    // 3. Brand Positioning
    if (resultData.brandPositioning) {
      sections.push(`## Brand identity & Positioning`)
      if (resultData.brandPositioning.tone) sections.push(`**Tone & Style:** ${resultData.brandPositioning.tone}`)
      if (resultData.brandPositioning.style) sections.push(`*${resultData.brandPositioning.style}*`)
      if (resultData.brandPositioning.valueProposition) sections.push(`\n**Value Proposition:**\n${resultData.brandPositioning.valueProposition}`)
      if (resultData.brandPositioning.idealCustomerSummary || resultData.brandPositioning.idealCustomer) {
        sections.push(`\n**Ideal Customer:**\n${resultData.brandPositioning.idealCustomerSummary || resultData.brandPositioning.idealCustomer}`)
      }
      if (Array.isArray(resultData.brandPositioning.messagingNotes) && resultData.brandPositioning.messagingNotes.length > 0) {
        sections.push(`\n**Messaging Strategy:**`)
        resultData.brandPositioning.messagingNotes.forEach((n: string) => sections.push(`- ${n}`))
      }
      sections.push('')
    }

    // 4. Color Palette
    const palette = Array.isArray(resultData.colorPalette?.palette) 
      ? resultData.colorPalette.palette 
      : (Array.isArray(resultData.colorPalette) ? resultData.colorPalette : [])
    
    if (palette.length > 0) {
      sections.push(`## Color Palette`)
      if (resultData.colorPalette?.reasoning) sections.push(`*${resultData.colorPalette.reasoning}*\n`)
      palette.forEach((c: any) => sections.push(`- ${c.role || c.name}: ${c.hex}`))
      sections.push('')
    }

    // 5. Business Plan
    if (resultData.businessPlan) {
      sections.push(`## Business Plan Summary`)
      if (typeof resultData.businessPlan === 'string') {
        sections.push(resultData.businessPlan)
      } else {
        Object.entries(resultData.businessPlan).forEach(([key, value]: [string, any]) => {
          const title = key.replace(/([A-Z])/g, ' $1').trim()
          sections.push(`### ${title.charAt(0).toUpperCase() + title.slice(1)}`)
          if (Array.isArray(value)) {
            value.forEach(v => sections.push(`- ${v}`))
          } else {
            sections.push(value)
          }
          sections.push('')
        })
      }
    }

    // 6. Roadmap
    if (Array.isArray(resultData.nextSteps) && resultData.nextSteps.length > 0) {
      sections.push(`## Strategic Roadmap`)
      resultData.nextSteps.forEach((s: any, i: number) => {
        sections.push(`### ${i + 1}. ${s.title}`)
        sections.push(s.description)
        sections.push('')
      })
    }

    const fullText = sections.join('\n')
    const blob = new Blob([fullText], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `business_blueprint_${(answers.businessName || 'idea').toLowerCase().replace(/\s+/g, '_')}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Render components for steps
  const renderOptions = () => {
    if (isGenerating || resultData || step >= 7) return null
    if (messages.length > 0 && messages[messages.length-1].role === 'user') return null // Wait for assistant

    const OptionChip = ({ label, onClick, className="" }: { label: string, onClick: () => void, className?: string }) => (
      <button 
        onClick={onClick}
        className={`px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/30 dark:hover:border-blue-800 transition-colors ${className}`}
      >
        {label}
      </button>
    )

    if (step === 1) {
      const types = ["Product", "Service", "Software", "E-commerce", "Local Business", "Personal Brand", "Agency", "Other"]
      return (
        <div className="flex flex-wrap gap-2 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {types.map(t => <OptionChip key={t} label={t} onClick={() => handleNextStep(t, "businessType", t)} />)}
        </div>
      )
    }

    if (step === 2) {
      if (showNameInput) {
        return (
          <div className="flex items-center gap-2 mt-4 animate-in fade-in zoom-in duration-300">
            <Input 
              autoFocus
              className="max-w-xs"
              placeholder="e.g. Acme Corp" 
              value={tempCustomInput}
              onChange={(e) => setTempCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && tempCustomInput.trim()) {
                  handleNextStep(`Yes, it's called "${tempCustomInput}"`, "businessName", tempCustomInput)
                  setAnswers(p => ({...p, hasBusinessName: true}))
                }
              }}
            />
            <Button 
              size="icon"
              disabled={!tempCustomInput.trim()}
              onClick={() => {
                handleNextStep(`Yes, it's called "${tempCustomInput}"`, "businessName", tempCustomInput)
                setAnswers(p => ({...p, hasBusinessName: true}))
              }}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        )
      }
      return (
        <div className="flex flex-wrap gap-2 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <OptionChip label="Yes, I have a name" onClick={() => setShowNameInput(true)} className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" />
          <OptionChip label="No, I need name ideas" onClick={() => {
            setAnswers(p => ({...p, hasBusinessName: false}))
            handleNextStep("No, I need name ideas", "hasBusinessName", false)
          }} />
        </div>
      )
    }

    if (step === 3) {
      const audiences = ["B2B (Other Businesses)", "B2C (Consumers)", "Gen Z", "Millennials", "Professionals", "Local Community"]
      return (
        <div className="flex flex-col gap-3 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Type your own or pick below..." 
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="max-w-xs"
            />
            <Button size="icon" disabled={!inputValue.trim()} onClick={handleTextSubmit}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {audiences.map(a => <OptionChip key={a} label={a} onClick={() => handleNextStep(a, "targetAudience", a)} />)}
          </div>
        </div>
      )
    }

    if (step === 4) {
      const tones = ["Professional", "Modern", "Premium", "Playful", "Minimal", "Bold", "Friendly", "Luxury", "Techy"]
      return (
        <div className="flex flex-wrap gap-2 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {tones.map(t => <OptionChip key={t} label={t} onClick={() => handleNextStep(t, "brandTone", t)} />)}
        </div>
      )
    }

    if (step === 5) {
      const colors = ["Blue (Trust)", "Red (Energy)", "Green (Growth)", "Black & White (Minimal)", "Purple (Luxury)"]
      return (
        <div className="flex flex-col gap-3 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Type preferred colors..." 
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="max-w-xs"
            />
            <Button size="icon" disabled={!inputValue.trim()} onClick={handleTextSubmit}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map(c => <OptionChip key={c} label={c} onClick={() => handleNextStep(c, "preferredColors", c)} />)}
            <OptionChip label="No preference" onClick={() => handleNextStep("No preference", "preferredColors", "None")} className="bg-gray-100 dark:bg-gray-800" />
          </div>
        </div>
      )
    }

    if (step === 6) {
      const goals = ["More Sales", "Brand Awareness", "Lead Generation", "Local Reach", "Online Growth", "Subscriptions", "Bookings"]
      return (
        <div className="flex flex-wrap gap-2 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {goals.map(g => <OptionChip key={g} label={g} onClick={() => handleNextStep(g, "businessGoal", g)} />)}
        </div>
      )
    }

    return null
  }

  // Result UI Component
  const ResultsView = () => {
    if (!resultData) return null

    // Defensive Data Extraction (handle both old and new backend schemas)
    const nameSuggestions = Array.isArray(resultData.businessNameSuggestions) ? resultData.businessNameSuggestions : (Array.isArray(resultData.nameSuggestions) ? resultData.nameSuggestions : [])
    const refinedNames = Array.isArray(resultData.refinedBrandNames) ? resultData.refinedBrandNames : (Array.isArray(resultData.refinedName) ? resultData.refinedName : [])
    const taglines = Array.isArray(resultData.taglineSuggestions) ? resultData.taglineSuggestions : (Array.isArray(resultData.taglines) ? resultData.taglines : [])
    
    // Color Palette Extraction
    const palette = Array.isArray(resultData.colorPalette?.palette) 
      ? resultData.colorPalette.palette 
      : (Array.isArray(resultData.colorPalette) ? resultData.colorPalette : [])

    return (
      <div className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold font-poppins flex items-center gap-3">
            <Rocket className="text-blue-500 w-8 h-8" />
            Your Launchpad Blueprint
          </h2>
          <div className="flex items-center gap-3">
             <Button variant="default" size="sm" onClick={downloadBlueprint} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              <Download className="w-4 h-4 mr-2" /> Download Blueprint
            </Button>
            <Button variant="outline" size="sm" onClick={resetTool}>
              <RefreshCcw className="w-4 h-4 mr-2" /> Start Over
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Overview */}
          {resultData.businessOverview && (
            <Card className="md:col-span-2 shadow-sm border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" /> Business Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {typeof resultData.businessOverview === 'string' ? (
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                    {resultData.businessOverview}
                  </p>
                ) : (
                  <>
                    {resultData.businessOverview.summary && (
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg font-medium">
                        {resultData.businessOverview.summary}
                      </p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {resultData.businessOverview.conceptPositioning && (
                        <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30">
                          <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Concept</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{resultData.businessOverview.conceptPositioning}</p>
                        </div>
                      )}
                      {resultData.businessOverview.businessDirection && (
                        <div className="p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Direction</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{resultData.businessOverview.businessDirection}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Business Name Suggestions */}
          {nameSuggestions.length > 0 && (
            <Card className="shadow-sm border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" /> Name Suggestions
                </CardTitle>
                <CardDescription>Based on your idea and tone</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {nameSuggestions.map((name: string, i: number) => (
                  <div key={i} className="px-4 py-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg font-semibold border border-purple-100 dark:border-purple-800 flex items-center justify-between gap-3 group w-full sm:w-auto">
                    <span>{name}</span>
                    <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity" onClick={() => navigator.clipboard.writeText(name)} />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Refined Name Suggestions */}
          {refinedNames.length > 0 && (
            <Card className="shadow-sm border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-purple-600" /> Refined Names
                </CardTitle>
                <CardDescription>Alternatives to your existing name</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {refinedNames.map((name: string, i: number) => (
                  <div key={i} className="px-4 py-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg font-semibold border border-purple-100 dark:border-purple-800 flex items-center justify-between gap-3 group w-full sm:w-auto">
                    <span>{name}</span>
                    <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity" onClick={() => navigator.clipboard.writeText(name)} />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Taglines */}
          <Card className="shadow-sm border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-500" /> Taglines & Hooks
              </CardTitle>
              <CardDescription>Short, punchy brand messaging</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {taglines.length > 0 ? taglines.map((tag: string, i: number) => (
                <div key={i} className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 rounded-md border border-orange-100 dark:border-orange-800/50 italic font-medium relative group pr-10">
                  "{tag}"
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => navigator.clipboard.writeText(tag)}>
                    <Copy className="w-4 h-4 text-orange-500" />
                  </button>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground italic">No taglines generated.</p>
              )}
            </CardContent>
          </Card>

          {/* Brand Positioning */}
          {resultData.brandPositioning && (
            <Card className="md:col-span-2 shadow-sm border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-red-500" /> Brand Identity & Positioning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resultData.brandPositioning.tone && (
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                      <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Tone & Style</h4>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{resultData.brandPositioning.tone}</p>
                      {resultData.brandPositioning.style && <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">{resultData.brandPositioning.style}</p>}
                    </div>
                  )}
                  {resultData.brandPositioning.valueProposition && (
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg lg:col-span-2">
                      <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Core Value Proposition</h4>
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-lg leading-relaxed">{resultData.brandPositioning.valueProposition}</p>
                    </div>
                  )}
                  {(resultData.brandPositioning.idealCustomerSummary || resultData.brandPositioning.idealCustomer) && (
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg lg:col-span-3">
                      <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Ideal Customer</h4>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{resultData.brandPositioning.idealCustomerSummary || resultData.brandPositioning.idealCustomer}</p>
                    </div>
                  )}
                  {Array.isArray(resultData.brandPositioning.messagingNotes) && resultData.brandPositioning.messagingNotes.length > 0 && (
                    <div className="bg-blue-50/30 dark:bg-blue-900/10 p-4 rounded-lg lg:col-span-3 border border-blue-50 dark:border-blue-900/30">
                      <h4 className="text-xs font-bold text-blue-500 dark:text-blue-400 mb-2 uppercase tracking-wider">Messaging Strategy</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {resultData.brandPositioning.messagingNotes.map((note: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Color Palette */}
          {palette.length > 0 && (
            <Card className="md:col-span-2 shadow-sm border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-pink-500" /> Suggested Color Palette
                  </CardTitle>
                  {resultData.colorPalette?.reasoning && (
                    <Badge variant="outline" className="text-[10px] uppercase tracking-tighter opacity-70">
                      Generated via brand tone
                    </Badge>
                  )}
                </div>
                {resultData.colorPalette?.reasoning && (
                  <CardDescription className="text-xs italic mt-1">{resultData.colorPalette.reasoning}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap md:flex-nowrap gap-4 h-full min-h-[120px]">
                  {palette.map((color: any, i: number) => (
                    <div key={i} className="flex-1 flex flex-col group min-w-[100px]">
                      <div 
                        className="h-24 w-full rounded-t-lg shadow-inner cursor-pointer relative"
                        style={{ backgroundColor: color.hex }}
                        onClick={() => navigator.clipboard.writeText(color.hex)}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity rounded-t-lg">
                          <Copy className="w-5 h-5 text-white drop-shadow-md" />
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-b-lg border border-t-0 border-gray-200 dark:border-gray-700">
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{color.role || color.name}</p>
                        <p className="font-mono text-sm dark:text-gray-200">{color.hex}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Business Plan Summary */}
          {resultData.businessPlan && (
            <Card className="md:col-span-2 shadow-sm border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-500" /> Business Plan Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray dark:prose-invert max-w-none text-sm bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-lg border border-gray-100 dark:border-zinc-700">
                  {typeof resultData.businessPlan === 'string' ? (
                     resultData.businessPlan.split('\n').map((line: string, i: number) => {
                      if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mt-4 mb-2">{line.replace('### ', '')}</h3>
                      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-5 mb-2">{line.replace('## ', '')}</h2>
                      if (line.trim() === '') return <br key={i} />
                      return <p key={i} className="mb-2">{line}</p>
                    })
                  ) : (
                    <div className="space-y-6">
                      {Object.entries(resultData.businessPlan).map(([key, value]: [string, any], i) => (
                        <div key={i}>
                          <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2 capitalize">
                            <CornerDownLeft className="w-3 h-3 opacity-50" /> {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h3>
                          {Array.isArray(value) ? (
                            <ul className="list-disc pl-5 space-y-1">
                              {value.map((item, idx) => <li key={idx} className="text-gray-700 dark:text-gray-300">{item}</li>)}
                            </ul>
                          ) : (
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{value}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Strategic Roadmap / Next Steps from Backend */}
          {Array.isArray(resultData.nextSteps) && resultData.nextSteps.length > 0 && (
            <Card className="md:col-span-2 shadow-sm border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900">
               <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-indigo-500" /> Strategic Roadmap
                </CardTitle>
                <CardDescription>Initial milestones to bring {answers.businessName || 'your business'} to life</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resultData.nextSteps.map((step: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-900/10 relative">
                      <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                        {i + 1}
                      </div>
                      <h4 className="font-bold text-indigo-900 dark:text-indigo-200 text-sm mb-1">{step.title}</h4>
                      <p className="text-xs text-indigo-700/70 dark:text-indigo-400/70 leading-relaxed">{step.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Next Steps CTA */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6 text-center">Continue Building Your Business</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {NEXT_STEPS.map((next, i) => (
              <Card key={i} className="border-2 border-transparent hover:border-blue-500 transition-colors shadow-md group">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                      <next.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    {next.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6 h-10">{next.desc}</p>
                  <Button asChild className="w-full bg-slate-900 hover:bg-black dark:bg-white dark:text-black dark:hover:bg-slate-200">
                    <Link href={next.href}>
                      Go to {next.title} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0b0c] text-slate-900 dark:text-white transition-colors duration-300 pb-20">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pt-20 pb-6 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-poppins flex items-center gap-2">
                <Rocket className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                Business Launchpad
              </h1>
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
                Your guided AI assistant to build your brand foundation in minutes.
              </p>
            </div>
            {step > 0 && !resultData && (
              <Badge variant="outline" className="hidden sm:inline-flex bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                Step {Math.min(step, 6)} of 6
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 mt-8">
        
        {/* Chat Area - Hide when results are shown */}
        {!resultData && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 md:p-8 min-h-[60vh] flex flex-col relative">
            
            <div className="flex-1 overflow-y-auto space-y-6 pb-20">
              {messages.map((msg, i) => {
                const isAssistant = msg.role === 'assistant'
                return (
                  <div key={msg.id} className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div className="flex gap-3 max-w-[85%] md:max-w-[75%]">
                      {isAssistant && (
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      <div className={`p-4 rounded-2xl ${
                        isAssistant 
                          ? 'bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-100 rounded-tl-sm' 
                          : 'bg-blue-600 text-white rounded-tr-sm shadow-md'
                      }`}>
                        {typeof msg.text === 'string' ? (
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        ) : (
                          msg.text
                        )}
                        
                        {/* Render options directly below the assistant bubble if it's the latest waiting step */}
                        {isAssistant && msg.isOptions && i === messages.length - 1 && renderOptions()}
                      </div>
                    </div>
                  </div>
                )
              })}
              
              {isGenerating && (
                <div className="flex justify-start animate-in fade-in">
                  <div className="flex gap-3 max-w-[85%]">
                     <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                        <Sparkles className="w-4 h-4 text-white animate-pulse" />
                      </div>
                      <div className="p-4 rounded-2xl bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-100 rounded-tl-sm flex items-center gap-3 border border-gray-100 dark:border-zinc-700/50">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-sm font-medium italic text-gray-500">Generating blueprints...</span>
                      </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-start animate-in fade-in">
                  <div className="flex gap-3 max-w-[85%]">
                     <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-tl-sm flex flex-col items-start gap-4 border border-red-100 dark:border-red-900/50">
                        <p className="text-sm font-medium">{error}</p>
                        <Button 
                          onClick={generateOutput} 
                          variant="outline" 
                          size="sm" 
                          className="w-fit text-red-600 border-red-200 hover:bg-red-100 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900/40"
                        >
                          <RefreshCcw className="w-3 h-3 mr-2" /> Try Again
                        </Button>
                      </div>
                  </div>
                </div>
              )}
              
              <div ref={endOfMessagesRef} />
            </div>

            {/* Fixed Input Area for text inputs - Only show if current step requires text exclusively */}
            {(step === 0 || step === 3 || step === 5) && !isGenerating && (
              <div className="absolute bottom-6 left-6 right-6 pt-4 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800">
                <div className="relative flex items-end gap-2">
                  <CornerDownLeft className="absolute left-3 bottom-3 w-5 h-5 text-gray-400" />
                  <Textarea
                    placeholder={step === 0 ? "e.g. A subscription service for organic dog food..." : "Type your answer..."}
                    className="min-h-[60px] max-h-[120px] pl-10 pt-3 pb-3 pr-14 resize-none bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 rounded-xl focus-visible:ring-blue-500"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                  <Button 
                    className="absolute right-2 bottom-2 rounded-lg bg-blue-600 hover:bg-blue-700 w-10 h-10 p-0"
                    onClick={handleTextSubmit}
                    disabled={!inputValue.trim()}
                  >
                    <Send className="w-4 h-4 text-white" />
                  </Button>
                </div>
                {step === 5 && (
                  <p className="text-xs text-center mt-2 text-gray-500 flex justify-center gap-4">
                    Or skip this step: <button onClick={() => handleNextStep("Skip, let AI suggest colors", "preferredColors", "None")} className="text-blue-500 hover:underline cursor-pointer">Skip</button>
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Output Area */}
        <ResultsView />

      </div>
    </div>
  )
}
