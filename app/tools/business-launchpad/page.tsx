"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Rocket, Sparkles, Send, RefreshCcw, ArrowRight, CheckCircle, Brain, Palette, FileText, Target, CornerDownLeft, Copy, BadgeCheck, Download, Globe, LayoutTemplate, ShieldCheck, Zap, Users, MessageSquare } from "lucide-react"

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
    title: "Domain Genie",
    desc: "Verify domain availability for your brand.",
    href: "/tools/domain-name-generator",
    icon: Globe
  },
  {
    title: "Vantage Copy",
    desc: "Generate high-converting landing page scripts.",
    href: "/tools/landing-pageherocopygenerator",
    icon: LayoutTemplate
  }
]

// Configuration
const WEBHOOK_URL = "https://n8n.srv832341.hstgr.cloud/webhook/business-launchpad-ai"

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
      addAssistantMessage("Welcome to Business Launchpad! 🚀 Ready to turn your vision into a brand? To get started, tell me: what is your business idea or concept?")
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
        addAssistantMessage("Brilliant! What type of business model are we building?", true)
        break
      case 2:
        addAssistantMessage("Do you already have a name pinned down, or should we brainstorm some options?", true)
        break
      case 3:
        addAssistantMessage("Who exactly are we serving? Describe your ideal customer or target audience.", true)
        break
      case 4:
        addAssistantMessage("Got it. Now, what brand personality or 'vibe' are you aiming for?", true)
        break
      case 5:
        addAssistantMessage("Visual identity matters! Any specific color palettes or aesthetic themes in mind? (Optional)", true)
        break
      case 6:
        addAssistantMessage("One last thing – what is the primary mission or 30-day goal for this project?", true)
        break
      case 7:
        addAssistantMessage(
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
               <ShieldCheck className="w-5 h-5 text-emerald-500" />
               <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Everything looks solid. Ready to launch?</p>
            </div>
            <Button onClick={generateOutput} className="btn-primary w-full py-6 text-lg h-auto font-black shadow-xl shadow-[#FF7435]/20 group">
              <Sparkles className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
              Generate Complete Blueprint
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
      setError("The blueprint engine encountered an error. Please try again.")
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
      addAssistantMessage("Let's hit the reset button! Briefly describe your business concept.")
    }, 100)
  }

  const downloadBlueprint = () => {
    if (!resultData) return

    const sections: string[] = []
    sections.push(`# Kozker AI Business Blueprint: ${answers.businessName || 'Your Concept'}`)
    sections.push(`Date: ${new Date().toLocaleDateString()}\n`)

    sections.push(`## 1. Executive Summary`)
    if (typeof resultData.businessOverview === 'string') {
      sections.push(resultData.businessOverview)
    } else if (resultData.businessOverview) {
      if (resultData.businessOverview.summary) sections.push(resultData.businessOverview.summary)
      if (resultData.businessOverview.conceptPositioning) sections.push(`\n**Positioning:** ${resultData.businessOverview.conceptPositioning}`)
    }
    sections.push('')

    const nameSuggestions = Array.isArray(resultData.businessNameSuggestions) ? resultData.businessNameSuggestions : (Array.isArray(resultData.nameSuggestions) ? resultData.nameSuggestions : [])
    if (nameSuggestions.length > 0) {
      sections.push(`## 2. Strategic Naming`)
      nameSuggestions.forEach(n => sections.push(`- ${n}`))
      sections.push('')
    }

    const taglines = Array.isArray(resultData.taglineSuggestions) ? resultData.taglineSuggestions : (Array.isArray(resultData.taglines) ? resultData.taglines : [])
    if (taglines.length > 0) {
      sections.push(`## 3. Brand Voice & Taglines`)
      taglines.forEach(t => sections.push(`- "${t}"`))
      sections.push('')
    }

    if (resultData.brandPositioning) {
      sections.push(`## 4. Brand Intelligence`)
      if (resultData.brandPositioning.tone) sections.push(`**Voice:** ${resultData.brandPositioning.tone}`)
      if (resultData.brandPositioning.valueProposition) sections.push(`\n**Value Prop:**\n${resultData.brandPositioning.valueProposition}`)
      sections.push('')
    }

    const fullText = sections.join('\n')
    const blob = new Blob([fullText], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `launchpad_blueprint_${Date.now()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const ResultsView = () => {
    if (!resultData) return null

    const nameSuggestions = Array.isArray(resultData.businessNameSuggestions) ? resultData.businessNameSuggestions : (Array.isArray(resultData.nameSuggestions) ? resultData.nameSuggestions : [])
    const taglines = Array.isArray(resultData.taglineSuggestions) ? resultData.taglineSuggestions : (Array.isArray(resultData.taglines) ? resultData.taglines : [])
    const palette = Array.isArray(resultData.colorPalette?.palette) ? resultData.colorPalette.palette : (Array.isArray(resultData.colorPalette) ? resultData.colorPalette : [])

    return (
      <div className="mt-12 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-[var(--iron)] pb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#FF7435] to-[#E6681F] rounded-2xl flex items-center justify-center shadow-xl shadow-[#FF7435]/20">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black font-poppins text-[var(--night)] uppercase tracking-tight">Your Launch Blueprint</h2>
              <p className="text-[var(--steel)] font-medium">Strategic foundation set for <span className="text-[#FF7435] font-black">{answers.businessName || 'your business'}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Button onClick={downloadBlueprint} className="btn-primary px-8 h-12 font-bold shadow-lg shadow-[#FF7435]/15">
              <Download className="w-4 h-4 mr-2" /> Download MD
            </Button>
            <Button variant="outline" onClick={resetTool} className="btn-secondary px-8 h-12 font-bold border-2">
              <RefreshCcw className="w-4 h-4 mr-2" /> New Setup
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Overview */}
          <div className="md:col-span-12">
            <Card className="card overflow-hidden group border-2 border-[var(--iron)]/50">
              <CardHeader className="bg-[var(--cloud)]/30 border-b border-[var(--iron)]/50">
                <CardTitle className="flex items-center gap-3 text-xl font-black font-poppins">
                  <FileText className="w-6 h-6 text-[#FF7435]" /> Core Concept & Positioning
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {typeof resultData.businessOverview === 'string' ? (
                  <p className="text-lg text-[var(--steel)] font-medium leading-relaxed italic">"{resultData.businessOverview}"</p>
                ) : (
                  <div className="space-y-6">
                    {resultData.businessOverview.summary && (
                      <p className="text-xl text-[var(--night)] font-black font-poppins leading-tight">{resultData.businessOverview.summary}</p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-[var(--mist)] border-2 border-[var(--iron)]/30 rounded-2xl">
                         <h4 className="text-[10px] font-black text-[#FF7435] uppercase tracking-widest mb-2">Market Positioning</h4>
                         <p className="text-sm font-medium text-[var(--steel)] leading-relaxed">{resultData.businessOverview.conceptPositioning || resultData.businessOverview.businessDirection}</p>
                      </div>
                      <div className="p-6 bg-emerald-500/5 border-2 border-emerald-500/10 rounded-2xl">
                         <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Competitive Edge</h4>
                         <p className="text-sm font-medium text-[var(--steel)] leading-relaxed">{resultData.businessOverview.businessDirection || "Optimized for modern market entry."}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Names and Tags */}
          <div className="md:col-span-6 space-y-8">
            <Card className="card border-2 border-[var(--iron)]/50">
               <CardHeader className="bg-[var(--cloud)]/30 border-b border-[var(--iron)]/50">
                <CardTitle className="flex items-center gap-3 text-lg font-black font-poppins">
                  <BadgeCheck className="w-5 h-5 text-purple-500" /> Strategic Naming
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-3">
                  {nameSuggestions.map((name: string, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-[var(--mist)] border border-[var(--iron)]/50 rounded-xl group hover:border-[#FF7435]/50 transition-colors">
                      <span className="font-black font-poppins text-[var(--night)]">{name}</span>
                      <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(name)} className="h-8 w-8 p-0 hover:bg-[#FF7435]/10 hover:text-[#FF7435] opacity-0 group-hover:opacity-100 transition-opacity">
                         <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card border-2 border-[var(--iron)]/50">
               <CardHeader className="bg-[var(--cloud)]/30 border-b border-[var(--iron)]/50">
                <CardTitle className="flex items-center gap-3 text-lg font-black font-poppins">
                  <MessageSquare className="w-5 h-5 text-orange-500" /> Messaging & Hooks
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                {taglines.map((tag: string, i: number) => (
                  <div key={i} className="p-5 bg-[var(--cloud)] border border-[var(--iron)]/50 rounded-xl italic font-medium text-[var(--steel)] text-sm leading-relaxed relative group">
                    "{tag}"
                    <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(tag)} className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Copy className="w-4 h-4 text-orange-500" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Identity & Palette */}
          <div className="md:col-span-6 space-y-8">
            <Card className="card border-2 border-[var(--iron)]/50">
               <CardHeader className="bg-[var(--cloud)]/30 border-b border-[var(--iron)]/50">
                <CardTitle className="flex items-center gap-3 text-lg font-black font-poppins">
                  <Palette className="w-5 h-5 text-pink-500" /> Color Strategy
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                 {resultData.colorPalette?.reasoning && (
                  <p className="text-xs text-[var(--steel)] font-medium mb-6 italic">{resultData.colorPalette.reasoning}</p>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {palette.map((color: any, i: number) => (
                    <div key={i} className="space-y-3 p-3 bg-[var(--mist)] border border-[var(--iron)]/50 rounded-2xl">
                      <div className="h-20 w-full rounded-xl border border-black/5 shadow-inner" style={{ backgroundColor: color.hex }}></div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--steel)]">{color.role || color.name}</p>
                        <p className="font-mono text-sm font-black text-[var(--night)]">{color.hex}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
             <Card className="card border-2 border-[var(--iron)]/50">
              <CardHeader className="bg-[var(--cloud)]/30 border-b border-[var(--iron)]/50">
                <CardTitle className="flex items-center gap-3 text-lg font-black font-poppins">
                  <Users className="w-5 h-5 text-blue-500" /> Audience Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="p-5 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                   <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">Ideal Demographics</h4>
                   <p className="text-sm font-bold text-[var(--night)] leading-relaxed italic">
                      {resultData.brandPositioning?.idealCustomerSummary || resultData.brandPositioning?.idealCustomer || answers.targetAudience}
                   </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Ecosystem Upsell */}
        <div className="pt-20 border-t-2 border-[var(--iron)]/50 text-center">
            <span className="text-[10px] font-black text-[#FF7435] uppercase tracking-[0.4em] mb-8 block">Execution Engine</span>
            <h3 className="text-4xl font-black font-poppins text-[var(--night)] mb-12">What's Next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
               {NEXT_STEPS.map((step, i) => (
                 <Card key={i} className="card p-0 overflow-hidden border-2 border-[var(--iron)] group hover:border-[#FF7435]/50 transition-all cursor-pointer">
                    <Link href={step.href} className="block p-10">
                       <div className="w-16 h-16 bg-[var(--cloud)] border border-[var(--iron)] rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 group-hover:-rotate-6 transition-transform shadow-sm">
                          <step.icon className="w-8 h-8 text-[#FF7435]" />
                       </div>
                       <h4 className="text-2xl font-black font-poppins text-[var(--night)] mb-3">{step.title}</h4>
                       <p className="text-[var(--steel)] font-medium mb-8 max-w-[240px] mx-auto text-sm leading-relaxed">{step.desc}</p>
                       <div className="flex items-center justify-center gap-2 text-[#FF7435] font-black text-xs uppercase tracking-widest">
                          Start Tool <ArrowRight className="w-4 h-4" />
                       </div>
                    </Link>
                 </Card>
               ))}
            </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--mist)] text-[var(--night)] transition-colors duration-300 pb-24">
      {/* Dynamic Progress Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[var(--cloud)]/80 backdrop-blur-xl border-b border-[var(--iron)] py-6 shadow-sm">
        <div className="container mx-auto max-w-5xl px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FF7435] rounded-xl text-white shadow-lg shadow-[#FF7435]/20">
                <Rocket className="w-6 h-6" />
              </div>
              <div className="hidden sm:block">
                 <h1 className="text-xl font-black font-poppins tracking-tight uppercase">Launchpad <span className="text-[10px] text-[var(--steel)] ml-2">AI ENGINE</span></h1>
              </div>
            </div>
            
            {!resultData && (
              <div className="flex flex-col items-end gap-1.5">
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-[var(--steel)] uppercase tracking-widest">Phase {step + 1}/7</span>
                    <div className="w-32 h-1.5 bg-[var(--iron)]/30 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-[#FF7435] transition-all duration-500"
                         style={{ width: `${((step + 1) / 7) * 100}%` }}
                       />
                    </div>
                 </div>
              </div>
            )}
            
            {resultData && (
               <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-black px-4 py-1.5 uppercase text-[10px] tracking-widest rounded-full">
                  Deployment Ready
               </Badge>
            )}
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-6 pt-36">
        {!resultData ? (
          <div className="space-y-12 pb-24 max-w-4xl mx-auto">
            {/* Chat Messages */}
            <div className="space-y-10">
              {messages.map((msg, i) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-6 duration-700`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`max-w-[85%] md:max-w-[75%] p-8 md:p-10 rounded-[2.5rem] shadow-xl ${
                    msg.role === 'user' 
                      ? 'bg-[var(--night)] text-white rounded-tr-none shadow-black/10' 
                      : 'bg-white dark:bg-zinc-900 border-2 border-[var(--iron)]/50 rounded-tl-none text-[var(--night)]'
                  }`}>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-6 text-[10px] font-black text-[#FF7435] uppercase tracking-widest">
                        <Sparkles className="w-4 h-4" /> Blueprint Engine
                      </div>
                    )}
                    <div className="text-lg md:text-xl font-black font-poppins leading-tight">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}

              {isGenerating && (
                <div className="flex items-center gap-4 animate-pulse px-6">
                   <div className="w-3 h-3 rounded-full bg-[#FF7435]"></div>
                   <div className="w-3 h-3 rounded-full bg-[#FF7435]/60"></div>
                   <div className="w-3 h-3 rounded-full bg-[#FF7435]/30"></div>
                   <span className="text-[10px] font-black text-[var(--steel)] uppercase tracking-[0.4em] ml-4">Crunching Market Data...</span>
                </div>
              )}

              {error && (
                 <div className="p-8 bg-red-50 dark:bg-red-950/20 border-2 border-red-500/20 rounded-[2rem] text-red-600 dark:text-red-400 flex items-center gap-5 animate-in shake-in">
                    <XCircle className="w-10 h-10 shrink-0" />
                    <div>
                       <h3 className="font-black font-poppins text-lg">System Conflict</h3>
                       <p className="text-sm font-medium opacity-80">{error}</p>
                    </div>
                 </div>
              )}
            </div>

            {/* Input / Control Area */}
            <div className="sticky bottom-12 pt-12 z-20">
              <div className="max-w-3xl mx-auto">
                {step === 0 || step === 3 || step === 5 ? (
                  <div className="relative group transition-all">
                    <Textarea 
                      autoFocus
                      placeholder="Type your answer here..."
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="input min-h-[120px] pr-20 pt-8 pl-8 text-lg font-black font-poppins rounded-[2.5rem] shadow-2xl shadow-black/5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-2 border-[var(--iron)]/50 focus:border-[#FF7435] transition-all"
                    />
                    <Button 
                      onClick={handleTextSubmit} 
                      disabled={!inputValue.trim() || isGenerating}
                      className="absolute bottom-6 right-6 w-14 h-14 rounded-2xl btn-primary shadow-xl shadow-[#FF7435]/20 group"
                    >
                      <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                    <div className="absolute top-8 right-8 text-[10px] font-black text-[var(--steel)] uppercase tracking-widest hidden sm:block">
                       Press Enter
                    </div>
                  </div>
                ) : null}
                
                <div className="flex flex-wrap justify-center gap-4">
                   {renderOptions()}
                </div>
              </div>
            </div>
            
            <div ref={endOfMessagesRef} className="h-20" />
          </div>
        ) : (
          <ResultsView />
        )}
      </div>
    </div>
  )

  function renderOptions() {
    if (isGenerating || resultData || step >= 7) return null
    if (messages.length > 0 && messages[messages.length-1].role === 'user') return null

    const OptionButton = ({ label, onClick, highlight=false }: { label: string, onClick: () => void, highlight?: boolean }) => (
      <button 
        onClick={onClick}
        className={`px-10 py-5 rounded-2xl border-2 font-black font-poppins uppercase tracking-widest text-xs transition-all hover:-translate-y-1 hover:shadow-xl active:scale-95 ${
          highlight 
            ? 'bg-[#FF7435] border-[#FF7435] text-white shadow-[#FF7435]/20' 
            : 'bg-[var(--cloud)] border-[var(--iron)]/50 text-[var(--night)] hover:border-[#FF7435]/50'
        }`}
      >
        {label}
      </button>
    )

    if (step === 1) {
      const types = ["Product", "Service", "Software", "E-commerce", "Local Biz", "Personal Brand", "Agency", "Other"]
      return (
        <div className="flex flex-wrap justify-center gap-4 mt-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
          {types.map(t => <OptionButton key={t} label={t} onClick={() => handleNextStep(t, "businessType", t)} />)}
        </div>
      )
    }

    if (step === 2) {
      if (showNameInput) {
        return (
          <div className="flex flex-col items-center gap-6 mt-8 animate-in zoom-in duration-500 w-full max-w-md">
            <div className="relative w-full">
               <Input 
                 autoFocus
                 className="input h-20 px-8 text-xl font-black font-poppins rounded-3xl"
                 placeholder="Enter full business name..." 
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
                onClick={() => {
                  handleNextStep(`Yes, it's called "${tempCustomInput}"`, "businessName", tempCustomInput)
                  setAnswers(p => ({...p, hasBusinessName: true}))
                }}
                disabled={!tempCustomInput.trim()}
                className="absolute right-4 top-1/2 -translate-y-1/2 btn-primary h-12 px-6 rounded-2xl"
               >
                 Go <ArrowRight className="w-4 h-4 ml-2" />
               </Button>
            </div>
             <button onClick={() => setShowNameInput(false)} className="text-[10px] font-black text-[var(--steel)] uppercase tracking-[0.3em] hover:text-[#FF7435] transition-colors">
                Back to choices
             </button>
          </div>
        )
      }
      return (
        <div className="flex flex-wrap justify-center gap-6 mt-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <OptionButton highlight label="I have a name" onClick={() => setShowNameInput(true)} />
          <OptionButton label="Need ideas" onClick={() => {
            setAnswers(p => ({...p, hasBusinessName: false}))
            handleNextStep("I need professional name ideas", "hasBusinessName", false)
          }} />
        </div>
      )
    }

    if (step === 3) {
      const audiences = ["B2B Tech", "B2C Consumers", "Gen Z Alpha", "Luxury Market", "Local Community"]
      return (
        <div className="flex flex-wrap justify-center gap-4 mt-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
          {audiences.map(a => <OptionButton key={a} label={a} onClick={() => handleNextStep(a, "targetAudience", a)} />)}
        </div>
      )
    }

    if (step === 4) {
      const tones = ["Professional", "Experimental", "Premium", "minimalist", "Bold", "Playful"]
      return (
        <div className="flex flex-wrap justify-center gap-4 mt-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
          {tones.map(t => <OptionButton key={t} label={t} onClick={() => handleNextStep(t, "brandTone", t)} />)}
        </div>
      )
    }

    if (step === 5) {
      const colors = ["Deep Blue", "Vibrant Orange", "Natural Green", "Monochrome", "Gradient Luxe"]
      return (
        <div className="flex flex-wrap justify-center gap-4 mt-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
          {colors.map(c => <OptionButton key={c} label={c} onClick={() => handleNextStep(c, "preferredColors", c)} />)}
          <OptionButton label="AI Choice" onClick={() => handleNextStep("Generate the best palette for my tone", "preferredColors", "None")} />
        </div>
      )
    }

    if (step === 6) {
      const goals = ["Brand Authority", "Conversion Optimization", "scaling Reach", "MVP Launch"]
      return (
        <div className="flex flex-wrap justify-center gap-4 mt-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
          {goals.map(g => <OptionButton key={g} label={g} onClick={() => handleNextStep(g, "businessGoal", g)} />)}
        </div>
      )
    }

    return null
  }
}
