"use client"

import React from "react"
import { motion } from "framer-motion"
import { Zap, ArrowRight } from "lucide-react"
import type { AIResponse } from "@/app/tools/project-timeline-builder/page"

interface CriticalPathSectionProps {
   path: AIResponse['criticalPath'];
}

export const CriticalPathSection: React.FC<CriticalPathSectionProps> = ({ path }) => {
   if (!path || path.length === 0) return null;

   return (
      <div className="space-y-6 transition-colors">
         <h2 className="text-2xl sm:text-3xl font-bold text-[var(--night)] flex items-center gap-3 tracking-tighter">
            <Zap className="w-7 h-7 text-[#f59e0b]" />
            Critical Path
         </h2>
         <div className="p-6 sm:p-10 bg-[#f59e0b]/5 border border-[#f59e0b]/20 rounded-[2rem] sm:rounded-[2.5rem] space-y-6 relative overflow-hidden transition-all">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Zap className="w-32 h-32 text-[#f59e0b]" />
            </div>

            <div className="space-y-2 relative z-10">
               <h3 className="text-lg font-bold text-[#f59e0b] uppercase tracking-tighter">Chain of Criticality</h3>
               <p className="text-xs text-[#f59e0b]/60 leading-relaxed max-w-xl font-medium">
                  The following tasks represent the minimum time required to complete the project. Any delay in these items will directly impact the final delivery date.
               </p>
            </div>

            <div className="space-y-4 relative z-10 pt-4">
               {path.map((item, i) => (
                  <div key={i} className="flex gap-4 sm:gap-6 items-start relative group">
                     {i < (path?.length || 0) - 1 && (
                        <div className="absolute left-[15px] top-8 bottom-[-16px] w-0.5 bg-[#f59e0b]/20 transition-colors" />
                     )}
                     <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-xl bg-[#f59e0b] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 shadow-md border-2 border-white group-hover:scale-110 transition-transform">
                           {i + 1}
                        </div>
                     </div>
                     <div className="space-y-1.5 pb-6">
                        <div className="flex flex-wrap items-center gap-3">
                           <p className="text-base font-bold text-[var(--night)] group-hover:text-[#f59e0b] transition-colors">{item.name}</p>
                           <span className="text-[10px] font-bold text-[#f59e0b] uppercase tracking-[0.2em] bg-[#f59e0b]/10 px-2 py-0.5 rounded border border-[#f59e0b]/20">
                              {item.phase}
                           </span>
                        </div>
                        <div className="p-3 bg-[var(--cloud)] rounded-xl border border-[var(--iron)] flex items-start gap-3 transition-colors shadow-sm">
                           <ArrowRight className="w-3.5 h-3.5 text-[#f59e0b]/50 mt-0.5 flex-shrink-0" />
                           <p className="text-xs text-[var(--steel)] italic leading-relaxed">
                              <span className="text-[9px] font-bold text-[#f59e0b]/50 uppercase block mb-1">Reason for importance</span>
                              "{item.reason}"
                           </p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}
