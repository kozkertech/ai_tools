"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, XCircle, Hash, MessageSquare, Copy, RefreshCw, X, Plus, Sparkles, Target, Activity, Share2, Zap, ArrowRight, ShieldCheck, Globe, UserCheck, Mail, MousePointer2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Types
interface PayloadData {
  user: {
    name: string
    email: string
    username: string
    platform: string
    profileType: string
  }
  profileContext: {
    niche: string
    targetAudience: string
    brandStyle: string
    tonality: string
    goal: string
  }
  competitors: string[]
  contentRequest: {
    contentType: string
    topic: string
    postDetails: string
    ctaPreference: string
    hashtagIntensity: string
    outputStyle: string
  }
  advancedOptions: {
    variations: number
    includeHooks: boolean
    includeCTA: boolean
    includeHashtagCategories: boolean
    platformOptimization: boolean
    useCompetitorInspiration: boolean
    competitorInfluence: string
  }
}

interface WebhookResponse {
  success: boolean
  data?: {
    captionVariations?: Array<{
      title: string
      caption: string
      hook: string
      cta: string
    }>
    hashtags?: {
      broad?: string[]
      niche?: string[]
      branded?: string[]
    }
  }
  error?: string
}

export default function CaptionGenerator() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    username: "",
    platform: "",
    profileType: "",
  })

  const [profile, setProfile] = useState({
    niche: "",
    targetAudience: "",
    brandStyle: "",
    tonality: "",
    goal: "",
  })

  const [contentReq, setContentReq] = useState({
    contentType: "",
    topic: "",
    postDetails: "",
    ctaPreference: "",
    hashtagIntensity: "Medium",
    outputStyle: "Medium",
  })

  const [advOptions, setAdvOptions] = useState({
    variations: "3",
    includeHooks: true,
    includeCTA: true,
    includeHashtagCategories: true,
    platformOptimization: true,
    useCompetitorInspiration: true,
    competitorInfluence: "Medium",
  })

  const [competitors, setCompetitors] = useState<string[]>([])
  const [competitorInput, setCompetitorInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<WebhookResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }
  const handleContentReqChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContentReq({ ...contentReq, [e.target.name]: e.target.value })
  }

  const addCompetitor = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const val = competitorInput.trim()
      if (val && !competitors.includes(val)) {
        setCompetitors([...competitors, val])
        setCompetitorInput("")
      }
    }
  }
  const addBtnCompetitor = () => {
      const val = competitorInput.trim()
      if (val && !competitors.includes(val)) {
        setCompetitors([...competitors, val])
        setCompetitorInput("")
      }
  }

  const removeCompetitor = (handle: string) => {
    setCompetitors(competitors.filter((c) => c !== handle))
  }

  const clearCompetitors = () => setCompetitors([])

  const ToggleOption = ({ label, checked, onChange, disabled = false }: { label: string, checked: boolean, onChange: (v: boolean) => void, disabled?: boolean }) => (
    <label className={`flex items-center space-x-3 cursor-pointer ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="relative">
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={(e) => onChange(e.target.checked)} 
          disabled={disabled}
          className="sr-only peer" 
        />
        <div className="w-11 h-6 bg-[var(--iron)]/40 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#FF7435] rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7435]"></div>
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-[var(--night)]">{label}</span>
 label    </label>
  )

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (!user.name.trim() || !user.email.trim() || !user.username.trim() || !user.platform || !profile.targetAudience.trim() || !contentReq.contentType || !contentReq.postDetails.trim()) {
      setError("Logical parameters missing. Corporate and content terminal fields are mandatory.")
      return
    }

    setIsLoading(true)
    setError(null)
    setResponse(null)

    const payload: PayloadData = {
      user: {
        name: user.name.trim(),
        email: user.email.trim(),
        username: user.username.trim(),
        platform: user.platform,
        profileType: user.profileType,
      },
      profileContext: {
        niche: profile.niche.trim(),
        targetAudience: profile.targetAudience.trim(),
        brandStyle: profile.brandStyle.trim(),
        tonality: profile.tonality.trim(),
        goal: profile.goal,
      },
      competitors: competitors.filter(c => c.trim() !== ""),
      contentRequest: {
        contentType: contentReq.contentType,
        topic: contentReq.topic.trim(),
        postDetails: contentReq.postDetails.trim(),
        ctaPreference: contentReq.ctaPreference.trim(),
        hashtagIntensity: contentReq.hashtagIntensity,
        outputStyle: contentReq.outputStyle,
      },
      advancedOptions: {
        variations: parseInt(advOptions.variations, 10),
        includeHooks: advOptions.includeHooks,
        includeCTA: advOptions.includeCTA,
        includeHashtagCategories: advOptions.includeHashtagCategories,
        platformOptimization: advOptions.platformOptimization,
        useCompetitorInspiration: advOptions.useCompetitorInspiration,
        competitorInfluence: advOptions.competitorInfluence,
      }
    }

    try {
      const res = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/caption-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
         throw new Error(`Data node synchronization error: ${res.status}`)
      }

      const data = await res.json()
      if (data.success === false) {
          throw new Error(data.error || "The synthesis protocol encountered a logic breach.")
      }
      
      setResponse(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "A critical interruption occurred during linguistic synthesis.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const copyAll = () => {
     if (!response?.data) return
     let fullText = ""
     if (response.data.captionVariations) {
         response.data.captionVariations.forEach((v, i) => {
             fullText += `--- OPTION ${i+1}: ${v.title || "Untitled Vector"} ---\n`
             if (v.hook) fullText += `HOOK: ${v.hook}\n\n`
             if (v.caption) fullText += `CAPTION: ${v.caption}\n\n`
             if (v.cta) fullText += `CTA: ${v.cta}\n\n`
         })
     }
     if (response.data.hashtags) {
         fullText += `--- SEMANTIC TAGS ---\n`
         if (response.data.hashtags.broad?.length) fullText += `Broad: ${response.data.hashtags.broad.join(" ")}\n`
         if (response.data.hashtags.niche?.length) fullText += `Niche: ${response.data.hashtags.niche.join(" ")}\n`
         if (response.data.hashtags.branded?.length) fullText += `Branded: ${response.data.hashtags.branded.join(" ")}\n`
     }
     copyToClipboard(fullText)
  }
  
  const copyAllHashtags = () => {
    if (!response?.data?.hashtags) return
    const { broad = [], niche = [], branded = [] } = response.data.hashtags
    const allHash = [...broad, ...niche, ...branded].join(" ")
    copyToClipboard(allHash)
  }

  return (
    <div className="min-h-screen bg-[var(--mist)] text-[var(--night)] transition-colors duration-300 pb-32">
      {/* Premium Sticky Identity Header */}
      <div className="bg-[var(--cloud)]/60 backdrop-blur-2xl border-b border-[var(--iron)] pt-24 pb-8 fixed top-0 w-full z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#FF7435] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#FF7435]/30">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-3xl font-black font-poppins text-[var(--night)] tracking-tighter uppercase leading-none mb-1">
                   Social <span className="text-[#FF7435]">Nexus</span>
                </h1>
                <Badge className="bg-[var(--night)] text-white border-none font-black px-3 py-1 rounded-lg text-[9px] uppercase tracking-widest opacity-80">v5.3 Engagement Engine</Badge>
              </div>
            </div>
            <div className="flex items-center gap-6">
               <div className="text-right hidden sm:block">
                  <div className="text-[9px] font-black uppercase tracking-widest text-[var(--steel)]">Stream Status</div>
                  <div className="text-xs font-black text-[var(--night)] uppercase flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                     Broadcasting
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-[164px] max-w-7xl mx-auto px-6 lg:px-10 mt-16 lg:mt-24">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
          
          {/* Configuration Workspace */}
          <div className="xl:col-span-12 lg:col-span-7 space-y-10 animate-in fade-in slide-in-from-left-8 duration-700">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* Section 1: User & Context */}
                <div className="space-y-10">
                   <Card className="card p-10 border-2 border-[var(--iron)]/50 shadow-2xl shadow-black/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF7435]/5 rounded-bl-[4rem] pointer-events-none"></div>
                      <CardHeader className="px-0 pt-0 pb-8 border-b-2 border-dashed border-[var(--iron)]/40 mb-8">
                         <div className="flex items-center gap-3">
                            <UserCheck className="w-5 h-5 text-[#FF7435]" />
                            <CardTitle className="text-xl font-black font-poppins uppercase tracking-tighter">Profile Registry</CardTitle>
                         </div>
                      </CardHeader>
                      <CardContent className="px-0 pb-0 space-y-8">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">Identity Name *</Label>
                               <Input name="name" value={user.name} onChange={handleUserChange} required placeholder="Jane Doe" className="input h-12" />
                            </div>
                            <div className="space-y-2">
                               <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">Contact Terminal *</Label>
                               <Input name="email" type="email" value={user.email} onChange={handleUserChange} required placeholder="jane@example.com" className="input h-12" />
                            </div>
                            <div className="space-y-2">
                               <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">Target Handle *</Label>
                               <Input name="username" value={user.username} onChange={handleUserChange} required placeholder="@janedoe" className="input h-12" />
                            </div>
                            <div className="space-y-2">
                               <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">Signal Platform *</Label>
                               <Select value={user.platform} onValueChange={(v) => setUser({ ...user, platform: v })} required>
                                 <SelectTrigger className="input h-12"><SelectValue placeholder="Select Platform" /></SelectTrigger>
                                 <SelectContent>
                                   <SelectItem value="Instagram">Instagram</SelectItem>
                                   <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                   <SelectItem value="X / Twitter">X / Twitter</SelectItem>
                                   <SelectItem value="YouTube">YouTube</SelectItem>
                                 </SelectContent>
                               </Select>
                            </div>
                         </div>
                      </CardContent>
                   </Card>

                   <Card className="card p-10 border-2 border-[var(--iron)]/50 shadow-2xl shadow-black/5 bg-white">
                      <CardHeader className="px-0 pt-0 pb-8 border-b-2 border-dashed border-[var(--iron)]/40 mb-8">
                         <div className="flex items-center gap-3">
                            <Target className="w-5 h-5 text-blue-500" />
                            <CardTitle className="text-xl font-black font-poppins uppercase tracking-tighter">Strategic Context</CardTitle>
                         </div>
                      </CardHeader>
                      <CardContent className="px-0 pb-0 space-y-8">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">Niche Ecosystem</Label>
                               <Input name="niche" value={profile.niche} onChange={handleProfileChange} placeholder="e.g. SaaS, Fintech" className="input h-12" />
                            </div>
                            <div className="space-y-2">
                               <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">Target Population *</Label>
                               <Input name="targetAudience" value={profile.targetAudience} onChange={handleProfileChange} required placeholder="Target demographic" className="input h-12" />
                            </div>
                            <div className="space-y-2">
                               <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">Tonal Frequency</Label>
                               <Input name="tonality" value={profile.tonality} onChange={handleProfileChange} placeholder="e.g. Executive, Bold" className="input h-12" />
                            </div>
                            <div className="space-y-2">
                               <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">End Mission Goal</Label>
                               <Select value={profile.goal} onValueChange={(v) => setProfile({ ...profile, goal: v })}>
                                 <SelectTrigger className="input h-12"><SelectValue placeholder="Select Goal" /></SelectTrigger>
                                 <SelectContent>
                                   <SelectItem value="Engagement">Engagement</SelectItem>
                                   <SelectItem value="Reach">Reach</SelectItem>
                                   <SelectItem value="Lead Generation">Lead Generation</SelectItem>
                                   <SelectItem value="Sales">Sales</SelectItem>
                                   <SelectItem value="Awareness">Awareness</SelectItem>
                                 </SelectContent>
                               </Select>
                            </div>
                         </div>
                      </CardContent>
                   </Card>
                </div>

                {/* Section 2: Request & Controls */}
                <div className="space-y-10">
                   <Card className="card p-10 border-2 border-[var(--iron)]/50 shadow-2xl shadow-black/5 bg-white">
                      <CardHeader className="px-0 pt-0 pb-8 border-b-2 border-dashed border-[var(--iron)]/40 mb-8">
                         <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 text-yellow-500" />
                            <CardTitle className="text-xl font-black font-poppins uppercase tracking-tighter">Content Blueprint</CardTitle>
                         </div>
                      </CardHeader>
                      <CardContent className="px-0 pb-0 space-y-8">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">Transmission Type *</Label>
                               <Select value={contentReq.contentType} onValueChange={(v) => setContentReq({ ...contentReq, contentType: v })} required>
                                 <SelectTrigger className="input h-12"><SelectValue placeholder="e.g. Post, Reel" /></SelectTrigger>
                                 <SelectContent>
                                   <SelectItem value="Post">Standard Post</SelectItem>
                                   <SelectItem value="Carousel">Dynamic Carousel</SelectItem>
                                   <SelectItem value="Reel">Short-Form Reel</SelectItem>
                                   <SelectItem value="Thread">Sequential Thread</SelectItem>
                                   <SelectItem value="Thought Leadership">Expert Analysis</SelectItem>
                                 </SelectContent>
                               </Select>
                            </div>
                            <div className="space-y-2">
                               <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">Narrative Topic</Label>
                               <Input name="topic" value={contentReq.topic} onChange={handleContentReqChange} placeholder="e.g. Future of AI" className="input h-12" />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-70">Core Message Parameters *</Label>
                            <Textarea
                              name="postDetails"
                              value={contentReq.postDetails}
                              onChange={handleContentReqChange}
                              required
                              rows={5}
                              className="input pt-6 px-6 min-h-[140px] rounded-[2rem]"
                              placeholder="Define the primary logic and data points for the narrative..."
                            />
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                            <div className="flex flex-col gap-6">
                               <ToggleOption label="Extract Competitor Data" checked={advOptions.useCompetitorInspiration} onChange={(v) => setAdvOptions({...advOptions, useCompetitorInspiration: v})} />
                               <ToggleOption label="Synthesize Hooks" checked={advOptions.includeHooks} onChange={(v) => setAdvOptions({...advOptions, includeHooks: v})} />
                            </div>
                            <div className="flex flex-col gap-6">
                               <ToggleOption label="Generate CTA Vectors" checked={advOptions.includeCTA} onChange={(v) => setAdvOptions({...advOptions, includeCTA: v})} />
                               <ToggleOption label="Categorize Semantic Tags" checked={advOptions.includeHashtagCategories} onChange={(v) => setAdvOptions({...advOptions, includeHashtagCategories: v})} />
                            </div>
                         </div>
                      </CardContent>
                   </Card>
                   
                   <div className="pt-2">
                      <Button
                        onClick={() => handleSubmit()}
                        disabled={isLoading}
                        className="w-full h-20 text-xs font-black uppercase tracking-[0.4em] bg-[#FF7435] hover:opacity-90 text-white rounded-full shadow-2xl shadow-[#FF7435]/30 transform active:scale-[0.98] transition-all group"
                      >
                        {isLoading ? (
                          <><Loader2 className="mr-4 h-6 w-6 animate-spin" /> Calibrating Signal...</>
                        ) : (
                          <>Manifest Engagement Feed <ArrowRight className="w-6 h-6 ml-4 group-hover:translate-x-2 transition-transform" /></>
                        )}
                      </Button>
                   </div>
                </div>
             </div>
          </div>

          {/* Results Workspace */}
          <div className="xl:col-span-12 space-y-10">
             {error && (
                <Alert className="rounded-[2.5rem] border-2 border-red-200 bg-red-50 p-8 shadow-2xl shadow-red-500/5 animate-in shake-in">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                         <XCircle className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-red-900 leading-none mb-1">Signal Breach</p>
                         <AlertDescription className="text-xs font-bold text-red-700">{error}</AlertDescription>
                      </div>
                   </div>
                </Alert>
             )}

             {response?.data ? (
                <div className="space-y-12 animate-in fade-in duration-1000">
                   
                   <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                      <div className="flex items-center gap-6">
                         <Sparkles className="w-10 h-10 text-[#FF7435]" />
                         <div>
                            <h2 className="text-4xl font-black font-poppins uppercase tracking-tighter">Feed Manifestation</h2>
                            <p className="text-[10px] font-black text-[var(--steel)] uppercase tracking-[0.4em]">Multi-Vector Variation Output</p>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <Button onClick={copyAll} variant="outline" className="h-14 px-8 border-2 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#FF7435] hover:text-white hover:border-[#FF7435] transition-all group">
                            <Copy className="mr-3 h-4 w-4 group-hover:scale-110 transition-transform" /> Copy Protocol All
                         </Button>
                         <Button onClick={() => handleSubmit()} variant="outline" className="h-14 px-8 border-2 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[var(--night)] hover:text-white transition-all group">
                            <RefreshCw className="mr-3 h-4 w-4 group-hover:rotate-180 transition-transform duration-500" /> Re-Calibrate
                         </Button>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                      <AnimatePresence mode="popLayout">
                        {response.data.captionVariations?.map((v, idx) => (
                           <motion.div 
                             key={idx} 
                             initial={{ opacity: 0, y: 30 }} 
                             animate={{ opacity: 1, y: 0 }} 
                             transition={{ delay: idx * 0.1 }}
                             className="h-full"
                            >
                              <Card className="card p-0 h-full border-2 border-[var(--iron)] shadow-2xl shadow-black/5 overflow-hidden group hover:border-[#FF7435]/40 transition-all duration-500 bg-white">
                                 <div className="bg-[var(--night)] px-8 py-6 flex justify-between items-center relative overflow-hidden">
                                     {/* Background decor */}
                                     <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-[2rem]"></div>
                                     <div className="relative z-10">
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">Vector Option</p>
                                        <span className="text-white font-black font-poppins uppercase tracking-tight">{v.title || `0${idx + 1}`}</span>
                                     </div>
                                     <Button 
                                       variant="ghost" 
                                       className="h-12 w-12 p-0 rounded-xl bg-white/10 hover:bg-[#FF7435] text-white border-none relative z-10 transition-all" 
                                       title="Copy Vector" 
                                       onClick={() => copyToClipboard([v.hook, v.caption, v.cta].filter(Boolean).join("\n\n"))}
                                     >
                                         <Copy className="h-5 w-5" />
                                     </Button>
                                 </div>
                                 <CardContent className="p-10 space-y-8 bg-white h-full">
                                    {v.hook && (
                                       <div className="space-y-2">
                                          <p className="text-[10px] font-black uppercase tracking-widest text-[#FF7435]">Initial Hook</p>
                                          <p className="font-black text-lg text-[var(--night)] leading-tight tracking-tight italic">"{v.hook}"</p>
                                       </div>
                                    )}
                                    {v.caption && (
                                       <div className="space-y-4 pt-6 border-t border-[var(--iron)]/40">
                                          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--steel)]">Core Narrative</p>
                                          <p className="text-sm font-bold text-[var(--night)]/80 leading-relaxed whitespace-pre-wrap">{v.caption}</p>
                                       </div>
                                    )}
                                    {v.cta && (
                                       <div className="pt-6 border-t-2 border-dashed border-[var(--iron)]/40 flex items-center gap-4">
                                          <Zap className="w-5 h-5 text-yellow-500 shrink-0" />
                                          <p className="font-black text-[10px] uppercase tracking-[0.2em] text-emerald-600 italic">Action: {v.cta}</p>
                                       </div>
                                    )}
                                 </CardContent>
                              </Card>
                           </motion.div>
                        ))}
                      </AnimatePresence>
                   </div>

                   {/* Semantic Tag Engine */}
                   {response.data.hashtags && (
                       <Card className="card p-0 shadow-2xl shadow-black/5 border-2 border-[var(--iron)] overflow-hidden bg-white">
                         <CardHeader className="bg-[var(--night)] text-white p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6 border-none">
                            <div>
                               <CardTitle className="text-3xl font-black font-poppins uppercase tracking-tighter">Semantic Tag Cloud</CardTitle>
                               <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mt-2">Optimized Hashtag Ecosystem</p>
                            </div>
                            <Button onClick={copyAllHashtags} className="h-16 px-10 bg-[#FF7435] border-none rounded-full font-black uppercase text-xs tracking-widest hover:opacity-90 transition-all text-white shadow-xl shadow-[#FF7435]/20 group">
                                <Copy className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" /> Copy Tag Array
                            </Button>
                         </CardHeader>
                         <CardContent className="p-10 md:p-14 grid grid-cols-1 md:grid-cols-3 gap-12">
                             {['broad', 'niche', 'branded'].map((cat) => {
                                 const list = (response.data?.hashtags as any)[cat]
                                 if (!list || list.length === 0) return null
                                 return (
                                     <div key={cat} className="space-y-6">
                                         <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[var(--mist)] flex items-center justify-center font-black text-xs text-[var(--night)] border-2 border-[var(--iron)]">#</div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF7435]">{cat} Clusters</p>
                                         </div>
                                         <div className="flex flex-wrap gap-2">
                                             {list.map((h: string, i: number) => (
                                                 <Badge key={i} className="bg-[var(--mist)] hover:bg-white text-[var(--night)] border-2 border-[var(--iron)] px-4 py-2 font-black text-[10px] uppercase tracking-tight rounded-xl transition-all hover:border-[#FF7435] cursor-pointer">
                                                     {h.startsWith('#') ? h : `#${h}`}
                                                 </Badge>
                                             ))}
                                         </div>
                                     </div>
                                 )
                             })}
                         </CardContent>
                       </Card>
                   )}

                </div>
             ) : (
                /* Static State Display */
                <div className="card p-32 flex flex-col items-center justify-center text-center space-y-12 border-dashed border-4 border-[var(--iron)]/40 grayscale opacity-40 bg-[var(--mist)]/30 rounded-[3rem] h-full min-h-[600px]">
                   <div className="relative">
                      <div className="absolute inset-0 bg-[#FF7435]/10 rounded-[3rem] scale-125 blur-2xl"></div>
                      <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center mx-auto border-2 border-[var(--iron)] shadow-inner relative z-10">
                        <MessageSquare className="w-16 h-16 text-[var(--steel)]" />
                      </div>
                   </div>
                   <div className="space-y-4">
                     <h3 className="text-3xl font-black font-poppins text-[var(--night)] uppercase tracking-tighter">Awaiting Signal Synchronization</h3>
                     <p className="text-[var(--steel)] max-w-sm mx-auto font-bold italic leading-relaxed">
                        Parameterize your content mission and corporate identity to manifest a high-fidelity social sequence here.
                     </p>
                   </div>
                   
                   <div className="w-full max-w-md pt-12 space-y-8 relative z-10 opacity-30 select-none pointer-events-none">
                      <div className="h-6 bg-[var(--iron)] rounded-full w-2/3 mx-auto"></div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="h-24 bg-white rounded-3xl border-2 border-[var(--iron)]"></div>
                         <div className="h-24 bg-white rounded-3xl border-2 border-[var(--iron)]"></div>
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
