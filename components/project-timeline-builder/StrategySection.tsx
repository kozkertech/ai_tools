"use client"

import React from "react"
import { Goal, Target, Activity, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AIResponse } from "@/app/tools/project-timeline-builder/page"

interface StrategySectionProps {
   okrs: AIResponse['okrs'];
   kpis: AIResponse['kpis'];
}

export const StrategySection: React.FC<StrategySectionProps> = ({ okrs, kpis }) => {
   return (
      <div className="space-y-6 sm:space-y-8 transition-colors">
         <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-3 tracking-tighter">
            <Goal className="w-7 h-7 text-emerald-600 dark:text-emerald-500" />
            Strategy
         </h2>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm dark:shadow-xl space-y-6 transition-colors">
               <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-500 border-b border-zinc-100 dark:border-zinc-800 pb-6">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                     <Target className="w-5 h-5" />
                  </div>
                  <div>
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] block text-zinc-400 dark:text-zinc-600">Methodology</span>
                     <h3 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">OKRs</h3>
                  </div>
               </div>
               
               <div className="space-y-8">
                  {okrs.map((okr, i) => (
                     <div key={i} className="space-y-4">
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
                           <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-1">Objective</p>
                           <p className="text-sm sm:text-base font-bold text-zinc-800 dark:text-zinc-100">{okr.objective}</p>
                        </div>
                        <ul className="grid grid-cols-1 gap-3 pl-2">
                           {okr.keyResults?.map((kr, kj) => (
                              <li key={kj} className="text-xs text-zinc-600 dark:text-zinc-500 flex gap-3 items-start group">
                                 <div className="mt-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded group-hover:bg-emerald-500/20 dark:group-hover:bg-emerald-500/20 group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors">
                                    <CheckCircle2 className="w-3 h-3" />
                                 </div>
                                 <span className="leading-relaxed font-medium">{kr}</span>
                              </li>
                           ))}
                        </ul>
                     </div>
                  ))}
               </div>
            </Card>

            <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm dark:shadow-xl space-y-6 transition-colors">
               <div className="flex items-center gap-3 text-blue-600 dark:text-blue-500 border-b border-zinc-100 dark:border-zinc-800 pb-6">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                     <Activity className="w-5 h-5" />
                  </div>
                  <div>
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] block text-zinc-400 dark:text-zinc-600">Tracking</span>
                     <h3 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">KPIs</h3>
                  </div>
               </div>
               
               <div className="space-y-4">
                  {kpis.map((kpi, i) => (
                     <div key={i} className="group p-5 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 hover:border-blue-500/30 transition-all flex justify-between items-center shadow-inner">
                        <div className="space-y-1">
                           <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{kpi.name}</p>
                           <p className="text-[10px] text-zinc-400 dark:text-zinc-600 uppercase font-black tracking-widest">{kpi.frequency} ASSESSMENT</p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                           <p className="text-lg font-black text-zinc-900 dark:text-white leading-none mb-1">{kpi.target}</p>
                           <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-500 text-[10px] font-black border-none uppercase tracking-tighter">
                              {kpi.status}
                           </Badge>
                        </div>
                     </div>
                  ))}
               </div>
               
               <div className="p-4 bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl border border-zinc-100 dark:border-zinc-900">
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-600 font-medium italic">
                     KPIs are calculated based on benchmarked performance for {kpis.length > 0 ? kpis[0].frequency : 'standard'} cycles.
                  </p>
               </div>
            </Card>
         </div>
      </div>
   )
}
