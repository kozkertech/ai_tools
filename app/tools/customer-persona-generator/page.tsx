"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  ICPFormData, 
  ToolState, 
  Webhook1Response, 
  Webhook2Response 
} from "./types"
import { PersonaHero } from "@/components/customer-persona-generator/PersonaHero"
import { AnalysisLoadingPanel } from "@/components/customer-persona-generator/AnalysisLoadingPanel"
import { StepProgress } from "@/components/customer-persona-generator/StepProgress"
import { EditableSectionCard } from "@/components/customer-persona-generator/EditableSectionCard"
import { TagInputField } from "@/components/customer-persona-generator/TagInputField"
import { StickyActionBar } from "@/components/customer-persona-generator/StickyActionBar"
import { PersonaReport } from "@/components/customer-persona-generator/PersonaReport"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, Building2, Target, Users, Zap, Signal } from "lucide-react"
import { Button } from "@/components/ui/button"

const ANALYZE_BUSINESS_WEBHOOK = "https://n8n.srv832341.hstgr.cloud/webhook/analyze-business"
const GENERATE_ICP_WEBHOOK = "https://n8n.srv832341.hstgr.cloud/webhook/generate-icp"

const defaultFormData: ICPFormData = {
  businessOverview: {
    businessName: "",
    businessType: "",
    industry: "",
    businessDescription: "",
    coreOffering: "",
    positioning: "",
    marketCategory: "",
    brandTone: ""
  },
  targetMarket: {
    audienceType: "",
    targetSegment: "",
    companySize: "",
    geography: "",
    buyerType: "",
    customerMaturityLevel: ""
  },
  personaBase: {
    personaName: "",
    jobRole: "",
    seniority: "",
    ageRange: "",
    gender: "",
    location: "",
    incomeLevel: ""
  },
  painPointsAndGoals: {
    keyPainPoints: [],
    goals: [],
    motivations: [],
    desiredOutcomes: [],
    dailyChallenges: []
  },
  buyingSignals: {
    buyingTriggers: [],
    objections: [],
    decisionFactors: [],
    preferredChannels: [],
    contentPreferences: []
  }
}

export default function ICPGeneratorPage() {
  const [state, setState] = useState<ToolState>("INITIAL")
  const [formData, setFormData] = useState<ICPFormData>(defaultFormData)
  const [results, setResults] = useState<Webhook2Response['data'] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [businessContext, setBusinessContext] = useState("")
  const [confidence, setConfidence] = useState<Record<string, number>>({})

  const steps = ["Analyze", "Review", "Generate", "Report"]
  const currentStepIndex = state === "INITIAL" ? 0 : state === "ANALYZING" ? 0 : state === "REVIEW" ? 1 : state === "GENERATING" ? 2 : 3

  const handleAnalyze = async (url: string, description: string) => {
    setWebsiteUrl(url)
    setBusinessContext(description)
    setState("ANALYZING")
    setError(null)

    try {
      const response = await fetch(ANALYZE_BUSINESS_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteUrl: url, businessContext: description })
      })

      if (!response.ok) throw new Error("Analysis failed")
      
      const resData: Webhook1Response = await response.json()

      if (resData.success) {
        setFormData(resData.data)
        setConfidence(resData.data.meta?.confidence || {})
        setState("REVIEW")
      } else {
        throw new Error("Analysis unsuccessful")
      }
    } catch (err) {
      console.error("Analysis Error:", err)
      setError("Failed to analyze website. Please try again or use manual mode.")
      setState("INITIAL")
    }
  }

  const handleManualMode = () => {
    setFormData(defaultFormData)
    setState("REVIEW")
  }

  const handleGenerate = async () => {
    setState("GENERATING")
    setError(null)

    try {
      const response = await fetch(GENERATE_ICP_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          websiteUrl, 
          businessContext, 
          editedFormData: formData 
        })
      })

      if (!response.ok) throw new Error("Generation failed")

      const resData: Webhook2Response = await response.json()

      if (resData.success) {
        setResults(resData.data)
        setState("RESULTS")
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
         throw new Error("Generation unsuccessful")
      }
    } catch (err) {
      console.error("Generation Error:", err)
      setError("Failed to generate ICP report. Please try again.")
      setState("REVIEW")
    }
  }

  const updateField = (section: keyof ICPFormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  return (
    <main className="w-full pb-12">
      {/* Navigation / Header */}
      <nav className="border-b border-[var(--iron)] bg-[var(--cloud)]/80 backdrop-blur-md sticky top-0 z-40 no-print">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => state === "INITIAL" ? window.history.back() : setState("INITIAL")}
            className="text-[var(--steel)] hover:text-[var(--night)]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {state === "INITIAL" ? "Back to Tools" : "Start Over"}
          </Button>
          <div className="hidden md:block">
            <StepProgress steps={steps} currentStep={currentStepIndex} />
          </div>
          <div className="w-24" /> {/* Spacer */}
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-8 max-w-5xl">
        {state === "INITIAL" && (
          <PersonaHero 
            onAnalyze={handleAnalyze} 
            onManualMode={handleManualMode}
            isLoading={false}
          />
        )}

        {state === "ANALYZING" && (
          <AnalysisLoadingPanel />
        )}

        {state === "REVIEW" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
            <div className="max-w-2xl px-2">
              <h1 className="text-3xl md:text-4xl font-semibold mb-3 tracking-tight text-[var(--night)]">Review Business Profile</h1>
              <p className="text-[var(--steel)] leading-relaxed">
                {websiteUrl 
                  ? `We analyzed ${websiteUrl} and extracted the following details. Fine-tune them below to improve the ICP quality.`
                  : "Enter your business details below to generate a focused Ideal Customer Profile."}
              </p>
            </div>

            <EditableSectionCard 
              number="01" 
              title="Business Overview" 
              description="Basic identity and market positioning of your business."
              confidence={confidence.businessType}
            >
              <div className="space-y-2">
                <Label>Business Name</Label>
                <Input 
                  value={formData.businessOverview.businessName} 
                  onChange={(e) => updateField('businessOverview', 'businessName', e.target.value)}
                  className="input"
                />
              </div>
              <div className="space-y-2">
                <Label>Business Type</Label>
                <Input 
                  value={formData.businessOverview.businessType} 
                  onChange={(e) => updateField('businessOverview', 'businessType', e.target.value)}
                  className="input"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Core Offering</Label>
                <Input 
                  value={formData.businessOverview.coreOffering} 
                  onChange={(e) => updateField('businessOverview', 'coreOffering', e.target.value)}
                  className="input"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Business Description</Label>
                <Textarea 
                  value={formData.businessOverview.businessDescription} 
                  onChange={(e) => updateField('businessOverview', 'businessDescription', e.target.value)}
                  className="textarea min-h-[100px]"
                />
              </div>
            </EditableSectionCard>

            <EditableSectionCard 
              number="02" 
              title="Target Market" 
              description="The broader landscape where your company operates."
              confidence={confidence.targetSegment}
            >
               <div className="space-y-2">
                <Label>Audience Type</Label>
                <Input 
                  value={formData.targetMarket.audienceType} 
                  onChange={(e) => updateField('targetMarket', 'audienceType', e.target.value)}
                  className="input"
                />
              </div>
              <div className="space-y-2">
                <Label>Target Segment</Label>
                <Input 
                  value={formData.targetMarket.targetSegment} 
                  onChange={(e) => updateField('targetMarket', 'targetSegment', e.target.value)}
                  className="input"
                />
              </div>
              <div className="space-y-2">
                <Label>Company Size</Label>
                <Input 
                  value={formData.targetMarket.companySize} 
                  onChange={(e) => updateField('targetMarket', 'companySize', e.target.value)}
                  className="input"
                />
              </div>
              <div className="space-y-2">
                <Label>Geography</Label>
                <Input 
                  value={formData.targetMarket.geography} 
                  onChange={(e) => updateField('targetMarket', 'geography', e.target.value)}
                  className="input"
                />
              </div>
            </EditableSectionCard>

            <EditableSectionCard 
              number="03" 
              title="Persona Base" 
              description="Individual demographic and professional details."
            >
               <div className="space-y-2">
                <Label>Persona Label/Name</Label>
                <Input 
                  value={formData.personaBase.personaName} 
                  onChange={(e) => updateField('personaBase', 'personaName', e.target.value)}
                  className="input"
                />
              </div>
              <div className="space-y-2">
                <Label>Job Role/Title</Label>
                <Input 
                  value={formData.personaBase.jobRole} 
                  onChange={(e) => updateField('personaBase', 'jobRole', e.target.value)}
                  className="input"
                />
              </div>
              <div className="space-y-2">
                <Label>Seniority</Label>
                <Input 
                  value={formData.personaBase.seniority} 
                  onChange={(e) => updateField('personaBase', 'seniority', e.target.value)}
                  className="input"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input 
                  value={formData.personaBase.location} 
                  onChange={(e) => updateField('personaBase', 'location', e.target.value)}
                  className="input"
                />
              </div>
            </EditableSectionCard>

            <EditableSectionCard 
              number="04" 
              title="Pain Points & Goals" 
              description="The problems you solve and results you deliver."
            >
              <div className="md:col-span-2 space-y-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" /> Key Pain Points</Label>
                  <TagInputField 
                    label="Pain Points" 
                    tags={formData.painPointsAndGoals.keyPainPoints} 
                    onTagsChange={(tags) => updateField('painPointsAndGoals', 'keyPainPoints', tags)}
                    placeholder="Press enter to add pain point..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Target className="w-4 h-4 text-green-500" /> Primary Goals</Label>
                  <TagInputField 
                    label="Goals" 
                    tags={formData.painPointsAndGoals.goals} 
                    onTagsChange={(tags) => updateField('painPointsAndGoals', 'goals', tags)}
                    placeholder="Press enter to add goal..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Signal className="w-4 h-4 text-primary" /> Motivations</Label>
                  <TagInputField 
                    label="Motivations" 
                    tags={formData.painPointsAndGoals.motivations} 
                    onTagsChange={(tags) => updateField('painPointsAndGoals', 'motivations', tags)}
                    placeholder="Press enter to add motivation..."
                  />
                </div>
              </div>
            </EditableSectionCard>

            <EditableSectionCard 
              number="05" 
              title="Buying Signals" 
              description="Behavioral indicators of a ready-to-buy customer."
            >
               <div className="md:col-span-2 space-y-6">
                <div className="space-y-2">
                  <Label>Buying Triggers</Label>
                  <TagInputField 
                    label="Triggers" 
                    tags={formData.buyingSignals.buyingTriggers} 
                    onTagsChange={(tags) => updateField('buyingSignals', 'buyingTriggers', tags)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Common Objections</Label>
                  <TagInputField 
                    label="Objections" 
                    tags={formData.buyingSignals.objections} 
                    onTagsChange={(tags) => updateField('buyingSignals', 'objections', tags)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preferred Channels</Label>
                  <TagInputField 
                    label="Channels" 
                    tags={formData.buyingSignals.preferredChannels} 
                    onTagsChange={(tags) => updateField('buyingSignals', 'preferredChannels', tags)}
                  />
                </div>
              </div>
            </EditableSectionCard>

            {error && (
              <Alert variant="destructive" className="bg-[#ef4444]/10 border-[#ef4444]/30 text-[#ef4444] rounded-[1rem]">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-bold">{error}</AlertDescription>
              </Alert>
            )}

            <StickyActionBar 
              onBack={() => setState("INITIAL")} 
              onGenerate={handleGenerate}
              isGenerating={state === "GENERATING"}
            />
          </div>
        )}

        {state === "GENERATING" && (
          <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-[#ff7a59]/20 blur-[100px] rounded-full animate-pulse" />
              <div className="relative w-24 h-24 bg-[var(--cloud)] border border-[var(--iron)] rounded-3xl flex items-center justify-center">
                <Zap className="w-12 h-12 text-[#ff7a59] animate-bounce" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight text-[var(--night)]">Synthesizing Strategy</h2>
              <p className="text-[var(--steel)] max-w-sm mx-auto">Building a consulting-grade ICP based on your business profile and audience signals.</p>
            </div>
            <div className="w-64 h-1.5 bg-[var(--iron)] rounded-full overflow-hidden">
              <div className="h-full bg-[#ff7a59] animate-[loading_2s_ease-in-out_infinite]" />
            </div>
          </div>
        )}

        {state === "RESULTS" && results && (
          <PersonaReport 
            data={results} 
            formData={formData} 
            onEdit={() => setState("REVIEW")}
            onRegenerate={handleGenerate}
            onExportMarkdown={() => alert("Markdown export initiated...")}
          />
        )}
      </div>

      <style jsx global>{`
        @keyframes loading {
          0% { width: 0%; }
          50% { width: 100%; }
          100% { width: 0%; }
        }
      `}</style>
    </main>
  )
}
