"use client"

import React from "react"
import { Flag, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { AIResponse } from "@/app/tools/project-timeline-builder/page"

interface MilestonesSectionProps {
   milestones: AIResponse['milestones'];
}

export const MilestonesSection: React.FC<MilestonesSectionProps> = ({ milestones }) => {
   if (!milestones || milestones.length === 0) return null;

   return (
      <div className="space-y-6 transition-colors">
         <h2 className="text-2xl sm:text-3xl font-bold text-[var(--night)] flex items-center gap-3 tracking-tighter">
            <Flag className="w-7 h-7 text-[#10b981]" />
            Project Milestones
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {milestones.map((m, i) => (
               <div key={i} className="card p-6 bg-[var(--cloud)] border border-[var(--iron)] rounded-[2rem] sm:rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-6 group hover:border-[#ff7a59]/30 transition-all shadow-sm">
                  <div className="flex flex-col items-center gap-1">
                     <div className="w-14 h-14 bg-[#10b981]/10 rounded-2xl flex items-center justify-center text-[#10b981] group-hover:scale-110 transition-transform border border-[#10b981]/20">
                        <Flag className="w-7 h-7" />
                     </div>
                  </div>
                  <div className="flex-1 w-full space-y-3">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h4 className="font-bold text-[var(--night)] text-lg">{m.name}</h4>
                        <Badge className="text-[10px] font-bold bg-[#10b981]/10 text-[#10b981] border-none px-2 py-0.5 uppercase tracking-tighter w-fit">
                           {m.targetDate}
                        </Badge>
                     </div>
                     <div className="flex items-start gap-2 bg-[var(--mist)] p-3 rounded-xl border border-[var(--iron)]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-[var(--steel)] italic leading-relaxed">
                           <span className="text-[var(--steel)] uppercase font-bold text-[9px] block mb-1">Success Condition</span>
                           "{m.successCondition}"
                        </p>
                     </div>
                     <div className="flex flex-wrap gap-2 mt-1">
                        <Badge variant="outline" className="badge-outline text-[9px] text-[var(--steel)] border-[var(--iron)] font-bold uppercase tracking-widest">{m.relatedPhase}</Badge>
                        <Badge variant="outline" className="badge-outline text-[9px] text-[var(--steel)] border-[var(--iron)] font-bold uppercase tracking-widest">{m.importance} Priority</Badge>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   )
}
