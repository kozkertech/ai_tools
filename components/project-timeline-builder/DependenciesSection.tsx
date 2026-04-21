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
         <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-3 tracking-tighter">
            <ArrowRight className="w-7 h-7 text-blue-600 dark:text-blue-500" />
            Critical Dependencies
         </h2>
         <div className="space-y-4">
            {dependencies.map((d, i) => (
               <div key={i} className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] sm:rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-l-4 border-l-blue-600 dark:border-l-blue-500 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm dark:shadow-lg">
                  <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
                     <div className="flex flex-col items-center flex-1 min-w-0">
                        <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-2 px-2">Blocked By</span>
                        <div className="text-xs sm:text-sm font-bold text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-100 dark:border-zinc-800 w-full text-center truncate">
                           {d.fromTask}
                        </div>
                     </div>
                     <div className="flex flex-col items-center justify-center pt-4">
                        <ArrowRight className="w-5 h-5 text-blue-500/50 animate-pulse" />
                     </div>
                     <div className="flex flex-col items-center flex-1 min-w-0">
                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest mb-2 px-2">Unlocks</span>
                        <div className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20 w-full text-center truncate">
                           {d.toTask}
                        </div>
                     </div>
                  </div>
                  <div className="sm:text-right sm:pl-8 sm:border-l border-zinc-100 dark:border-zinc-800 h-auto sm:h-14 flex flex-col justify-center gap-1">
                     <span className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest block">{d.impact} Impact</span>
                     <span className="text-[10px] text-zinc-500 dark:text-zinc-500 font-bold uppercase tracking-widest px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded self-start sm:self-end whitespace-nowrap">{d.type}</span>
                  </div>
               </div>
            ))}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-900 rounded-2xl flex items-center gap-3">
               <Info className="w-4 h-4 text-zinc-400 dark:text-zinc-700" />
               <p className="text-[10px] text-zinc-500 dark:text-zinc-600 font-medium italic">
                  Dependency analysis ensures a stable critical path. Task starts are predicted based on parent completion.
               </p>
            </div>
         </div>
      </div>
   )
}
