"use client"

import React from "react"
import { ShieldAlert } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { AIResponse, Severity } from "@/app/tools/project-timeline-builder/page"

interface RiskSectionProps {
   risks: AIResponse['risks'];
   severityColors: Record<Severity, string>;
}

export const RiskSection: React.FC<RiskSectionProps> = ({ risks, severityColors }) => {
   if (!risks || risks.length === 0) return null;

   return (
      <Card className="card bg-[var(--cloud)] border-[var(--iron)] p-6 sm:p-10 space-y-8 rounded-[2rem] sm:rounded-[3rem] shadow-sm relative overflow-hidden group/card transition-colors">
         <div className="absolute top-[-20px] right-[-20px] opacity-5 rotate-12 group-hover/card:scale-110 transition-transform duration-1000">
            <ShieldAlert className="w-48 h-48 text-red-500" />
         </div>
         
         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="space-y-1">
               <h3 className="text-2xl sm:text-3xl font-bold text-[var(--night)] tracking-tighter">Project Risks & Mitigation</h3>
               <p className="text-sm text-[var(--steel)] font-medium max-w-lg">AI-predicted bottlenecks based on global industry benchmarks and historical failure modes.</p>
            </div>
            <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20 shadow-inner">
               <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>
         </div>

         <div className="space-y-6 relative z-10">
            {risks.map((risk, i) => (
               <div key={i} className="p-6 bg-[var(--mist)] border border-[var(--iron)] grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 rounded-[2rem] sm:rounded-3xl hover:border-[#ff7a59]/30 transition-all group">
                  <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-[var(--iron)] pb-4 md:pb-0 md:pr-6">
                     <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: severityColors[risk.severity] }} />
                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: severityColors[risk.severity] }}>
                           {risk.severity} Severity
                        </span>
                     </div>
                     <h4 className="text-lg font-bold text-[var(--night)] leading-tight group-hover:text-[#ff7a59] transition-colors">{risk.title}</h4>
                  </div>
                  <div className="md:col-span-1 flex flex-col justify-center">
                     <p className="text-[10px] font-bold text-[var(--steel)] uppercase tracking-widest mb-3">Project Impact</p>
                     <p className="text-xs text-[var(--steel)] italic leading-relaxed">"{risk.impact}"</p>
                  </div>
                  <div className="md:col-span-2">
                     <p className="text-[10px] font-bold text-[var(--steel)] uppercase tracking-widest mb-3">AI Mitigation Blueprint</p>
                     <div className="bg-[var(--cloud)] p-4 rounded-xl sm:rounded-2xl border border-dashed border-[var(--iron)] group-hover:border-[#ff7a59]/50 transition-colors">
                        <p className="text-xs text-[#10b981] font-bold leading-relaxed">{risk.mitigation}</p>
                     </div>
                  </div>
               </div>
            ))}
         </div>
         
         <div className="p-4 sm:p-6 bg-red-500/5 rounded-2xl border border-red-500/10 relative z-10">
            <p className="text-[10px] text-red-500/60 text-center font-medium italic">
               Note: Risk assessments are probabilistic simulations and should be reviewed by a human project lead.
            </p>
         </div>
      </Card>
   )
}
