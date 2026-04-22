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
         <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-3 tracking-tighter">
            <Flag className="w-7 h-7 text-emerald-600 dark:text-emerald-500" />
            Project Milestones
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {milestones.map((m, i) => (
               <div key={i} className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] sm:rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-6 group hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all shadow-sm dark:shadow-lg">
                  <div className="flex flex-col items-center gap-1">
                     <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-500 group-hover:scale-110 transition-transform border border-emerald-500/20">
                        <Flag className="w-7 h-7" />
                     </div>
                  </div>
                  <div className="flex-1 w-full space-y-3">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h4 className="font-bold text-zinc-900 dark:text-white text-lg">{m.name}</h4>
                        <Badge className="text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-none px-2 py-0.5 uppercase tracking-tighter w-fit">
                           {m.targetDate}
                        </Badge>
                     </div>
                     <div className="flex items-start gap-2 bg-zinc-50 dark:bg-zinc-950/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 italic leading-relaxed">
                           <span className="text-zinc-400 dark:text-zinc-500 uppercase font-black text-[9px] block mb-1">Success Condition</span>
                           "{m.successCondition}"
                        </p>
                     </div>
                     <div className="flex flex-wrap gap-2 mt-1">
                        <Badge variant="outline" className="text-[9px] border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest">{m.relatedPhase}</Badge>
                        <Badge variant="outline" className="text-[9px] border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest">{m.importance} Priority</Badge>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   )
}
