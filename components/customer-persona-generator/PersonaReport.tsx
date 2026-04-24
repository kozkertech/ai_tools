"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Copy, 
  Download, 
  FileText, 
  RefreshCw, 
  Edit, 
  Target, 
  Users, 
  Zap, 
  MessageSquare, 
  Compass, 
  CheckCircle2, 
  Lightbulb,
  ArrowRight
} from "lucide-react"
import { Webhook2Response, ICPFormData } from "./types"
import { PersonaInsightCard } from "./PersonaInsightCard"

interface PersonaReportProps {
  data: Webhook2Response['data']
  formData: ICPFormData
  onEdit: () => void
  onRegenerate: () => void
  onExportMarkdown: () => void
}

export function PersonaReport({ data, formData, onEdit, onRegenerate, onExportMarkdown }: PersonaReportProps) {
  const {
    personaSnapshot,
    whoThisCustomerIs,
    painPoints,
    goalsAndMotivations,
    buyingTriggers,
    objections,
    decisionFactors,
    messagingStrategy,
    channelStrategy,
    nextActions
  } = data

  const copyToClipboard = () => {
    const text = JSON.stringify(data, null, 2)
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  const handleDownloadPDF = () => {
    const originalTitle = document.title
    const filename = `icp-report-${personaSnapshot.personaName.toLowerCase().replace(/\s+/g, '-')}`
    document.title = filename
    window.print()
    document.title = originalTitle
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 md:px-8 space-y-12 animate-in fade-in duration-700 print-area">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-[var(--cloud)] border border-[var(--iron)] rounded-3xl p-8 md:p-10 shadow-sm print-section">
        <div className="space-y-4 text-center md:text-left">
          <Badge className="bg-[#ff7a59]/10 text-[#ff7a59] border-[#ff7a59]/20 hover:bg-[#ff7a59]/20 py-1 px-4 text-xs font-bold uppercase tracking-widest no-print">
            AI Strategy Report
          </Badge>
          <h1 className="text-4xl md:text-5xl font-semibold text-[var(--night)] tracking-tight">
            {personaSnapshot.personaName}
          </h1>
          <p className="text-lg text-[var(--steel)] max-w-2xl font-medium leading-relaxed">
            {personaSnapshot.summary}
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-[var(--steel)] font-medium">
            <span className="flex items-center gap-1.5"><Compass className="w-4 h-4 text-[#ff7a59]" /> {personaSnapshot.geography}</span>
            <span className="flex items-center gap-1.5"><Target className="w-4 h-4 text-[#ff7a59]" /> {personaSnapshot.industry}</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-[#ff7a59]" /> {personaSnapshot.companySize}</span>
          </div>
          {/* Metadata for print only */}
          <div className="hidden print:block text-[10px] text-[var(--steel)] mt-4">
            Generated on {new Date().toLocaleDateString()} • Source: {formData.businessOverview.businessName}
          </div>
        </div>
        
        <div className="flex flex-col gap-3 w-full md:w-auto no-print">
          <Button onClick={onRegenerate} variant="outline" className="btn-outline w-full md:w-auto h-11">
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate
          </Button>
          <div className="grid grid-cols-3 gap-3">
            <Button onClick={onEdit} variant="outline" title="Edit Inputs" className="btn-outline h-11">
              <Edit className="w-4 h-4" />
            </Button>
            <Button onClick={handleDownloadPDF} variant="outline" title="Download PDF" className="btn-outline h-11">
               <Download className="w-4 h-4 text-[#ff7a59]" />
            </Button>
            <Button onClick={onExportMarkdown} title="Export Markdown" className="btn-primary h-11 px-4">
              <FileText className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Persona Snapshot Card - Span 2 */}
        <div className="md:col-span-2 p-8 rounded-3xl bg-[var(--cloud)] border border-[#ff7a59]/20 relative overflow-hidden group print-section">
          <div className="absolute top-0 right-0 p-8 text-[#ff7a59]/10 transition-transform group-hover:scale-125 duration-700 no-print">
            <Users className="w-40 h-40" />
          </div>
          <div className="relative z-10 space-y-6">
            <h3 className="text-2xl font-bold text-[var(--night)] flex items-center gap-3">
              <Users className="text-[#ff7a59] w-6 h-6" /> Who This Customer Is
            </h3>
            <p className="text-[var(--steel)] text-lg leading-relaxed font-medium">
              {whoThisCustomerIs.overview}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 print:flex print:flex-row print:gap-12">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#ff7a59] uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Key Responsibilities
                </h4>
                <ul className="space-y-3">
                  {whoThisCustomerIs.responsibilities.map((item, i) => (
                    <li key={i} className="text-sm text-[var(--steel)] flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--iron)] mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#ff7a59] uppercase tracking-widest flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Core Mindset
                </h4>
                <ul className="space-y-3">
                  {whoThisCustomerIs.mindset.map((item, i) => (
                    <li key={i} className="text-sm text-[var(--steel)] flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--iron)] mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="print-section">
          <PersonaInsightCard title="Pain Points" icon={Zap} className="border-[#f59e0b]/20">
            {painPoints.map((point, i) => (
              <div key={i} className="p-3 rounded-xl bg-[var(--cloud)] text-sm text-[var(--night)] border border-[var(--iron)] print:bg-white print:border-[var(--iron)]">
                {point}
              </div>
            ))}
          </PersonaInsightCard>
        </div>

        <div className="print-section">
          <PersonaInsightCard title="Goals & Motivations" icon={Target} className="border-[#10b981]/20">
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#10b981]">Primary Goals</span>
                {goalsAndMotivations.goals.map((g, i) => (
                  <div key={i} className="text-sm text-[var(--night)] flex items-center gap-2">
                    <span className="w-1 h-1 bg-[#10b981] rounded-full" /> {g}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff7a59]">Hidden Motivations</span>
                {goalsAndMotivations.motivations.map((m, i) => (
                  <div key={i} className="text-sm font-medium text-[var(--steel)] italic border-l-2 border-[#ff7a59]/30 pl-3">
                    "{m}"
                  </div>
                ))}
              </div>
            </div>
          </PersonaInsightCard>
        </div>

        <div className="print-section">
          <PersonaInsightCard title="Buying Triggers" icon={RefreshCw} className="border-[#3b82f6]/20">
            {buyingTriggers.map((trigger, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-[var(--iron)] bg-[var(--cloud)] print:bg-white print:border-[var(--iron)]">
                <span className="text-[#ff7a59] font-bold text-xs pt-0.5">0{i+1}</span>
                <span className="text-sm text-[var(--night)]">{trigger}</span>
              </div>
            ))}
          </PersonaInsightCard>
        </div>

        <div className="print-section">
          <PersonaInsightCard title="Common Objections" icon={MessageSquare} className="border-[#ef4444]/20">
            {objections.map((obj, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-full border border-[#ef4444]/20 bg-[#ef4444]/5 text-xs text-[#ef4444] print:bg-white print:border-[var(--iron)]">
                <XCircle className="w-3 h-3" /> {obj}
              </div>
            ))}
          </PersonaInsightCard>
        </div>

        <div className="print-section">
          <PersonaInsightCard title="Decision Factors" icon={Compass} className="border-[#ff7a59]/20">
            {decisionFactors.map((factor, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-[var(--night)]">
                <CheckCircle2 className="w-4 h-4 text-[#ff7a59]" /> {factor}
              </div>
            ))}
          </PersonaInsightCard>
        </div>

        {/* Messaging Strategy - Large Card */}
        <div className="md:col-span-3 p-10 rounded-3xl bg-[var(--cloud)] border border-[var(--iron)] space-y-8 relative overflow-hidden print-section">
          <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none no-print">
             <MessageSquare className="w-40 h-40 text-[#ff7a59] blur-3xl opacity-50" />
          </div>
          
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 md:items-center relative z-10">
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-[var(--night)]">Messaging Strategy</h3>
              <p className="text-[var(--steel)] font-medium no-print">How to speak to this persona and win their trust.</p>
            </div>
            <Button onClick={copyToClipboard} variant="outline" className="btn-outline h-10 no-print">
              <Copy className="w-4 h-4 mr-2" /> Copy Strategy
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10 print:flex print:flex-col">
            <div className="space-y-6">
              <h4 className="text-xs font-bold text-[#ff7a59] uppercase tracking-widest">Recommended Value Props</h4>
              <div className="space-y-4">
                {messagingStrategy.valueProps.map((vp, i) => (
                  <div key={i} className="group p-5 rounded-2xl bg-[var(--mist)] border border-[var(--iron)] hover:border-[#ff7a59]/30 transition-all print:bg-white print:border-[var(--iron)]">
                    <p className="text-[var(--night)] font-bold mb-2 flex items-center justify-between">
                      Proposition {i+1} <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 no-print" />
                    </p>
                    <p className="text-sm text-[var(--steel)] leading-relaxed font-medium">{vp}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
               <h4 className="text-xs font-bold text-[#ff7a59] uppercase tracking-widest">Growth Hooks & Angles</h4>
               <div className="space-y-3">
                  {messagingStrategy.hooks.map((hook, i) => (
                    <div key={i} className="p-4 rounded-xl border border-[#ff7a59]/20 bg-[#ff7a59]/5 text-sm text-[var(--night)] font-medium italic print:bg-white print:border-[var(--iron)]">
                      "{hook}"
                    </div>
                  ))}
               </div>
               
               <div className="pt-6 space-y-4">
                  <h4 className="text-xs font-bold text-[var(--steel)] uppercase tracking-widest">Channel Mix</h4>
                  <div className="flex flex-wrap gap-2">
                    {channelStrategy.primaryChannels.map((c, i) => (
                      <Badge key={i} className="bg-[var(--cloud)] border-[var(--iron)] text-[var(--night)] px-4 py-1.5 rounded-full shadow-sm print:bg-white print:text-black print:border-[var(--iron)]">
                        {c}
                      </Badge>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Next Actions */}
        <div className="md:col-span-3 p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-[#ff7a59] to-orange-600 text-white shadow-2xl shadow-[#ff7a59]/20 relative overflow-hidden print-section">
           <div className="relative z-10">
             <div className="max-w-2xl">
               <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Ready to execute?</h2>
               <p className="text-lg text-white/90 font-medium mb-10 leading-relaxed no-print">
                 We've identified the core strategy. Now let AI help you build the assets needed to reach this ICP effectively.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 no-print">
                 {nextActions.map((action, i) => (
                   <button key={i} className="group flex items-center justify-between p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all text-left">
                     <span className="font-semibold text-sm md:text-base">{action}</span>
                     <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                   </button>
                 ))}
               </div>
               {/* Print alternative for next actions */}
               <div className="hidden print:block">
                  <ul className="space-y-4">
                    {nextActions.map((action, i) => (
                      <li key={i} className="text-lg font-bold border-l-4 border-white pl-4">{action}</li>
                    ))}
                  </ul>
               </div>
             </div>
           </div>
           {/* Decorative circles */}
           <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[80%] bg-white/10 blur-[100px] rounded-full no-print" />
           <div className="absolute bottom-[-20%] left-[10%] w-[30%] h-[60%] bg-black/10 blur-[80px] rounded-full no-print" />
        </div>
      </div>
    </div>
  )
}

function XCircle({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
  )
}
