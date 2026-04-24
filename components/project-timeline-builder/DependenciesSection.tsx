"use client"

import React from "react"
import { ArrowRight, Info } from "lucide-react"
import type { AIResponse } from "@/app/tools/project-timeline-builder/page"

interface DependenciesSectionProps {
   dependencies: AIResponse['dependencies'];
}

export const DependenciesSection: React.FC<DependenciesSectionProps> = ({ dependencies }) => {
   if (!dependencies || dependencies.length === 0) return null;

   return (
      <div className="space-y-6 transition-colors">
         <h2 className="text-2xl sm:text-3xl font-bold text-[var(--night)] flex items-center gap-3 tracking-tighter">
            <ArrowRight className="w-7 h-7 text-[#3b82f6]" />
            Critical Dependencies
         </h2>
         <div className="space-y-4">
            {dependencies.map((d, i) => (
               <div key={i} className="card p-6 bg-[var(--cloud)] border border-[var(--iron)] rounded-[2rem] sm:rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-l-4 border-l-[#3b82f6] hover:border-[#ff7a59]/30 transition-all shadow-sm">
                  <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
                     <div className="flex flex-col items-center flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-[var(--steel)] uppercase tracking-widest mb-2 px-2">Blocked By</span>
                        <div className="text-xs sm:text-sm font-bold text-[var(--night)] bg-[var(--mist)] px-4 py-2 rounded-xl border border-[var(--iron)] w-full text-center truncate">
                           {d.fromTask}
                        </div>
                     </div>
                     <div className="flex flex-col items-center justify-center pt-4">
                        <ArrowRight className="w-5 h-5 text-[#3b82f6]/50 animate-pulse" />
                     </div>
                     <div className="flex flex-col items-center flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-[#3b82f6] uppercase tracking-widest mb-2 px-2">Unlocks</span>
                        <div className="text-xs sm:text-sm font-bold text-[var(--night)] bg-[#3b82f6]/10 px-4 py-2 rounded-xl border border-[#3b82f6]/20 w-full text-center truncate">
                           {d.toTask}
                        </div>
                     </div>
                  </div>
                  <div className="sm:text-right sm:pl-8 sm:border-l border-[var(--iron)] h-auto sm:h-14 flex flex-col justify-center gap-1">
                     <span className="text-[10px] font-bold text-[#3b82f6] uppercase tracking-widest block">{d.impact} Impact</span>
                     <span className="text-[10px] text-[var(--steel)] font-bold uppercase tracking-widest px-2 py-0.5 bg-[var(--iron)] rounded self-start sm:self-end whitespace-nowrap">{d.type}</span>
                  </div>
               </div>
            ))}
            <div className="p-4 bg-[var(--mist)] border border-[var(--iron)] rounded-2xl flex items-center gap-3">
               <Info className="w-4 h-4 text-[var(--steel)]" />
               <p className="text-[10px] text-[var(--steel)] font-medium italic">
                  Dependency analysis ensures a stable critical path. Task starts are predicted based on parent completion.
               </p>
            </div>
         </div>
      </div>
   )
}
