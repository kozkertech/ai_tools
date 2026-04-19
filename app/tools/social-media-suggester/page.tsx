"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, XCircle, Hash, MessageSquare, Copy, RefreshCw, X, Plus } from "lucide-react"

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
  // We'll use a fairly flat state mapped closely to the sections
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
    variations: "3", // string for local select, cast to number on submit
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

  // Input Handlers
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }
  const handleContentReqChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContentReq({ ...contentReq, [e.target.name]: e.target.value })
  }

  // Competitor UI Logic
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

  // Boolean Toggles using Native Checkboxes styled cleanly
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
        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
      </div>
      <span className="text-sm font-medium text-gray-900 dark:text-gray-300">{label}</span>
    </label>
  )

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    // Manual Validation before send
    if (!user.name.trim() || !user.email.trim() || !user.username.trim() || !user.platform || !profile.targetAudience.trim() || !contentReq.contentType || !contentReq.postDetails.trim()) {
      setError("Please fill out all required fields (marked with *).")
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
      const res = await fetch("https://n8n.srv832341.hstgr.cloud/webhook-test/caption-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
         throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      // Fallback parser just in case the server still returns the old format loosely.
      if (data.success === false) {
          throw new Error(data.error || "The server returned a failure response.")
      }
      
      setResponse(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while generating your content. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Copy functionalities
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const copyAll = () => {
     if (!response?.data) return
     let fullText = ""
     if (response.data.captionVariations) {
         response.data.captionVariations.forEach((v, i) => {
             fullText += `--- ${v.title || `Option ${i+1}`} ---\n`
             if (v.hook) fullText += `${v.hook}\n\n`
             if (v.caption) fullText += `${v.caption}\n\n`
             if (v.cta) fullText += `${v.cta}\n\n`
         })
     }
     if (response.data.hashtags) {
         fullText += `--- Hashtags ---\n`
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
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-4 pb-20 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center py-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <MessageSquare className="h-10 w-10 text-orange-500" />
            <Hash className="h-10 w-10 text-orange-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-poppins">
            Caption <span className="text-orange-500">&</span> Hashtag Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Design highly engaging and optimized captions tailored directly to your brand profile and audience.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Main Form Left Column */}
          <div className="lg:col-span-7 space-y-6 animate-slide-up">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 1. User Information */}
              <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm">
                <CardHeader className="bg-gray-50 dark:bg-zinc-800/50 rounded-t-lg pb-4 border-b border-gray-100 dark:border-zinc-800">
                  <CardTitle className="text-xl">1. Profile Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" name="name" value={user.name} onChange={handleUserChange} required placeholder="Jane Doe" className="dark:bg-zinc-800" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" name="email" type="email" value={user.email} onChange={handleUserChange} required placeholder="jane@example.com" className="dark:bg-zinc-800" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username / Handle *</Label>
                    <Input id="username" name="username" value={user.username} onChange={handleUserChange} required placeholder="@janedoe" className="dark:bg-zinc-800" />
                  </div>
                  <div className="space-y-2">
                    <Label>Platform *</Label>
                    <Select value={user.platform} onValueChange={(v) => setUser({ ...user, platform: v })} required>
                      <SelectTrigger className="dark:bg-zinc-800"><SelectValue placeholder="Select Platform" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                        <SelectItem value="X / Twitter">X / Twitter</SelectItem>
                        <SelectItem value="YouTube">YouTube</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Profile Type</Label>
                    <Select value={user.profileType} onValueChange={(v) => setUser({ ...user, profileType: v })}>
                      <SelectTrigger className="dark:bg-zinc-800"><SelectValue placeholder="e.g. Creator, Startup..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Personal Brand">Personal Brand</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Creator">Creator</SelectItem>
                        <SelectItem value="Startup">Startup</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* 2. Context Section */}
              <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm">
                <CardHeader className="bg-gray-50 dark:bg-zinc-800/50 rounded-t-lg pb-4 border-b border-gray-100 dark:border-zinc-800">
                  <CardTitle className="text-xl">2. Audience & Context</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="niche">Niche / Industry</Label>
                    <Input id="niche" name="niche" value={profile.niche} onChange={handleProfileChange} placeholder="e.g. SaaS, Fitness" className="dark:bg-zinc-800" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Target Audience *</Label>
                    <Input id="targetAudience" name="targetAudience" value={profile.targetAudience} onChange={handleProfileChange} required placeholder="Who are you writing for?" className="dark:bg-zinc-800" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tonality">Tonality / Voice</Label>
                    <Input id="tonality" name="tonality" value={profile.tonality} onChange={handleProfileChange} placeholder="e.g. Professional, Bold" className="dark:bg-zinc-800" />
                  </div>
                  <div className="space-y-2">
                    <Label>Content Goal</Label>
                    <Select value={profile.goal} onValueChange={(v) => setProfile({ ...profile, goal: v })}>
                      <SelectTrigger className="dark:bg-zinc-800"><SelectValue placeholder="Select Goal" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engagement">Engagement</SelectItem>
                        <SelectItem value="Reach">Reach</SelectItem>
                        <SelectItem value="Lead Generation">Lead Generation</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Awareness">Awareness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                     <Label htmlFor="brandStyle">Brand Style</Label>
                     <Input id="brandStyle" name="brandStyle" value={profile.brandStyle} onChange={handleProfileChange} placeholder="e.g. Minimalist, Corporate, Energetic" className="dark:bg-zinc-800" />
                  </div>
                </CardContent>
              </Card>

              {/* 3. Competitors Section */}
              <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm">
                <CardHeader className="bg-gray-50 dark:bg-zinc-800/50 rounded-t-lg pb-4 border-b border-gray-100 dark:border-zinc-800">
                  <div className="flex justify-between items-center">
                      <CardTitle className="text-xl">3. Competitor Inspiration</CardTitle>
                      {competitors.length > 0 && (
                          <Button type="button" variant="ghost" size="sm" onClick={clearCompetitors} className="h-8 text-xs text-red-500 hover:text-red-600">
                              Clear All
                          </Button>
                      )}
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  <div className="flex flex-col gap-3">
                     <Label>Competitor Profiles (Optional)</Label>
                     <div className="flex gap-2">
                        <Input 
                            value={competitorInput}
                            onChange={(e) => setCompetitorInput(e.target.value)}
                            onKeyDown={addCompetitor}
                            placeholder="Type a handle and hit Enter or +"
                            className="dark:bg-zinc-800"
                        />
                        <Button type="button" variant="secondary" onClick={addBtnCompetitor} className="px-3">
                            <Plus className="h-5 w-5" />
                        </Button>
                     </div>
                     {competitors.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                           {competitors.map((comp) => (
                             <Badge key={comp} variant="secondary" className="px-3 py-1 text-sm bg-orange-100 text-orange-800 dark:bg-zinc-800 dark:text-gray-300 hover:bg-orange-200 cursor-pointer" onClick={() => removeCompetitor(comp)}>
                                {comp} <X className="ml-2 h-3 w-3 inline" />
                             </Badge>
                           ))}
                        </div>
                     )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-zinc-800 pt-5">
                      <div className="flex items-center space-x-2 h-10">
                        <ToggleOption 
                           label="Use Competitor Inspiration" 
                           checked={advOptions.useCompetitorInspiration}
                           onChange={(v) => setAdvOptions({...advOptions, useCompetitorInspiration: v})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className={!advOptions.useCompetitorInspiration ? "opacity-50" : ""}>Competitor Influence</Label>
                        <Select disabled={!advOptions.useCompetitorInspiration} value={advOptions.competitorInfluence} onValueChange={(v) => setAdvOptions({ ...advOptions, competitorInfluence: v })}>
                          <SelectTrigger className="dark:bg-zinc-800"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                  </div>
                </CardContent>
              </Card>

              {/* 4. Content Request */}
              <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm">
                <CardHeader className="bg-gray-50 dark:bg-zinc-800/50 rounded-t-lg pb-4 border-b border-gray-100 dark:border-zinc-800">
                  <CardTitle className="text-xl">4. Content Request</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Content Type *</Label>
                      <Select value={contentReq.contentType} onValueChange={(v) => setContentReq({ ...contentReq, contentType: v })} required>
                        <SelectTrigger className="dark:bg-zinc-800"><SelectValue placeholder="e.g. Post, Carousel" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Post">Post</SelectItem>
                          <SelectItem value="Carousel">Carousel</SelectItem>
                          <SelectItem value="Reel">Reel</SelectItem>
                          <SelectItem value="Thread">Thread</SelectItem>
                          <SelectItem value="Promotional Post">Promotional Post</SelectItem>
                          <SelectItem value="Thought Leadership">Thought Leadership</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="topic">Topic / Title</Label>
                      <Input id="topic" name="topic" value={contentReq.topic} onChange={handleContentReqChange} placeholder="e.g. Top 5 AI Marketing tools" className="dark:bg-zinc-800" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postDetails">Post Details / Key Message *</Label>
                    <Textarea
                      id="postDetails"
                      name="postDetails"
                      value={contentReq.postDetails}
                      onChange={handleContentReqChange}
                      required
                      rows={5}
                      className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 resize-y"
                      placeholder="What exactly do you want to convey in this post? Provide details, stats, or main arguments."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ctaPreference">CTA Preference</Label>
                      <Input id="ctaPreference" name="ctaPreference" value={contentReq.ctaPreference} onChange={handleContentReqChange} placeholder="e.g. Link in bio" className="dark:bg-zinc-800" />
                    </div>
                    <div className="space-y-2">
                      <Label>Hashtag Intensity</Label>
                      <Select value={contentReq.hashtagIntensity} onValueChange={(v) => setContentReq({ ...contentReq, hashtagIntensity: v })}>
                        <SelectTrigger className="dark:bg-zinc-800"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="Light">Light</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Heavy">Heavy</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Output Style</Label>
                      <Select value={contentReq.outputStyle} onValueChange={(v) => setContentReq({ ...contentReq, outputStyle: v })}>
                        <SelectTrigger className="dark:bg-zinc-800"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="Short">Short</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Long">Long</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 5. Advanced Controls */}
              <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4 text-gray-900 dark:text-white mt-2">Advanced Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                      <div className="space-y-2 pb-2 md:pb-0">
                         <Label>Number of Variations</Label>
                         <Select value={advOptions.variations} onValueChange={(v) => setAdvOptions({ ...advOptions, variations: v })}>
                            <SelectTrigger className="dark:bg-zinc-800"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="1">1 Option</SelectItem><SelectItem value="3">3 Options</SelectItem><SelectItem value="5">5 Options</SelectItem></SelectContent>
                         </Select>
                      </div>
                      
                      <div className="flex flex-col justify-center space-y-4 pt-1">
                         <ToggleOption label="Include Hooks" checked={advOptions.includeHooks} onChange={(v) => setAdvOptions({...advOptions, includeHooks: v})} />
                         <ToggleOption label="Generate CTA Suggestions" checked={advOptions.includeCTA} onChange={(v) => setAdvOptions({...advOptions, includeCTA: v})} />
                         <ToggleOption label="Categorize Hashtags" checked={advOptions.includeHashtagCategories} onChange={(v) => setAdvOptions({...advOptions, includeHashtagCategories: v})} />
                         <ToggleOption label="Platform Optimization" checked={advOptions.platformOptimization} onChange={(v) => setAdvOptions({...advOptions, platformOptimization: v})} />
                      </div>
                  </div>
                </CardContent>
              </Card>

              <div className="pt-4 sticky bottom-4 z-20">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-16 text-lg bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {isLoading ? (
                    <><Loader2 className="mr-3 h-6 w-6 animate-spin" /> Generating Content...</>
                  ) : (
                    "Generate Caption & Hashtags"
                  )}
                </Button>
              </div>

            </form>
          </div>

          {/* Results Right Column */}
          <div className="lg:col-span-5 h-full">
            <div className="sticky top-8 space-y-6">
              
              {error && (
                <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50 animate-fade-in shadow-sm">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <AlertDescription className="text-red-700 dark:text-red-300 font-medium ml-2 text-sm">{error}</AlertDescription>
                </Alert>
              )}

              {response?.data ? (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Master Actions */}
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-zinc-800">
                     <h2 className="text-2xl font-bold font-poppins">Results</h2>
                     <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={copyAll} className="h-8">
                           <Copy className="mr-2 h-3 w-3" /> Copy All
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleSubmit()} className="h-8">
                           <RefreshCw className="mr-2 h-3 w-3" /> Retry
                        </Button>
                     </div>
                  </div>

                  {/* Caption Variations List */}
                  <div className="space-y-4">
                     {response.data.captionVariations?.length ? (
                         response.data.captionVariations.map((v, idx) => (
                             <Card key={idx} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                                <div className="bg-orange-50 dark:bg-zinc-800/80 px-4 py-2 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center text-sm font-semibold">
                                   <span>{v.title || `Variation ${idx + 1}`}</span>
                                   <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Copy this option" onClick={() => copyToClipboard([v.hook, v.caption, v.cta].filter(Boolean).join("\n\n"))}>
                                       <Copy className="h-3 w-3" />
                                   </Button>
                                </div>
                                <CardContent className="p-4 space-y-3 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                                   {v.hook && <p className="font-semibold text-gray-900 dark:text-gray-100">{v.hook}</p>}
                                   {v.caption && <p>{v.caption}</p>}
                                   {v.cta && <p className="font-medium italic">{v.cta}</p>}
                                </CardContent>
                             </Card>
                         ))
                     ) : (
                         <div className="text-sm text-gray-500 italic">No captions generated.</div>
                     )}
                  </div>

                  {/* Hashtags Engine */}
                  {response.data.hashtags && (
                      <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm">
                        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                           <CardTitle className="text-lg">Generated Hashtags</CardTitle>
                           <Button variant="ghost" size="sm" onClick={copyAllHashtags} className="h-7 px-2 text-xs">
                               <Copy className="mr-1 h-3 w-3" /> Copy All
                           </Button>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            {['broad', 'niche', 'branded'].map((cat) => {
                                const list = (response.data?.hashtags as any)[cat]
                                if (!list || list.length === 0) return null
                                return (
                                    <div key={cat} className="space-y-1.5">
                                        <p className="text-xs font-semibold uppercase text-gray-500 tracking-wider dark:text-gray-400">{cat}</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {list.map((h: string, i: number) => (
                                                <span key={i} className="inline-flex items-center rounded-md bg-blue-50 dark:bg-zinc-800 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20">
                                                    {h.startsWith('#') ? h : `#${h}`}
                                                </span>
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
                /* Empty / Wait State */
                <Card className="bg-transparent border-dashed border-2 border-gray-300 dark:border-zinc-800 shadow-none h-[400px]">
                  <CardContent className="h-full flex flex-col items-center justify-center p-12 text-center">
                    <div className="flex justify-center mb-6">
                      <div className="bg-orange-50 dark:bg-zinc-800/50 p-6 rounded-full shadow-inner">
                         <MessageSquare className="h-10 w-10 text-orange-400/50" />
                      </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Ready for Generation</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-3 leading-relaxed max-w-xs">
                      Submit your complete content profile on the left and see professional captions crafted here perfectly structured for your brand.
                    </p>
                  </CardContent>
                </Card>
              )}
              
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
