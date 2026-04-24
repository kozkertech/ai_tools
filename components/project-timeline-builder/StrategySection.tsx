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
         <h2 className="text-2xl sm:text-3xl font-bold text-[var(--night)] flex items-center gap-3 tracking-tighter">
            <Goal className="w-7 h-7 text-[#10b981]" />
            Strategy
         </h2>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <Card className="card bg-[var(--cloud)] border-[var(--iron)] p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm space-y-6 transition-colors">
               <div className="flex items-center gap-3 text-[#10b981] border-b border-[var(--iron)] pb-6">
                  <div className="p-2 bg-[#10b981]/10 rounded-lg">
                     <Target className="w-5 h-5" />
                  </div>
                  <div>
                     <span className="text-[10px] font-bold uppercase tracking-[0.2em] block text-[var(--steel)]">Methodology</span>
                     <h3 className="text-lg sm:text-xl font-bold text-[var(--night)] uppercase tracking-tighter">OKRs</h3>
                  </div>
               </div>
               
               <div className="space-y-8">
                  {okrs.map((okr, i) => (
                     <div key={i} className="space-y-4">
                        <div className="p-4 bg-[var(--mist)] rounded-2xl border border-[var(--iron)]">
                           <p className="text-[10px] font-bold text-[var(--steel)] uppercase tracking-widest mb-1">Objective</p>
                           <p className="text-sm sm:text-base font-bold text-[var(--night)]">{okr.objective}</p>
                        </div>
                        <ul className="grid grid-cols-1 gap-3 pl-2">
                           {okr.keyResults?.map((kr, kj) => (
                              <li key={kj} className="text-xs text-[var(--steel)] flex gap-3 items-start group">
                                 <div className="mt-1 bg-[var(--mist)] p-1 rounded border border-[var(--iron)] group-hover:bg-[#10b981]/20 group-hover:border-[#10b981]/20 group-hover:text-[#10b981] transition-colors">
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

            <Card className="card bg-[var(--cloud)] border-[var(--iron)] p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm space-y-6 transition-colors">
               <div className="flex items-center gap-3 text-[#3b82f6] border-b border-[var(--iron)] pb-6">
                  <div className="p-2 bg-[#3b82f6]/10 rounded-lg">
                     <Activity className="w-5 h-5" />
                  </div>
                  <div>
                     <span className="text-[10px] font-bold uppercase tracking-[0.2em] block text-[var(--steel)]">Tracking</span>
                     <h3 className="text-lg sm:text-xl font-bold text-[var(--night)] uppercase tracking-tighter">KPIs</h3>
                  </div>
               </div>
               
               <div className="space-y-4">
                  {kpis.map((kpi, i) => (
                     <div key={i} className="group p-5 bg-[var(--mist)] rounded-2xl border border-[var(--iron)] hover:border-[#3b82f6]/30 transition-all flex justify-between items-center shadow-sm">
                        <div className="space-y-1">
                           <p className="text-sm font-bold text-[var(--night)] group-hover:text-[#3b82f6] transition-colors">{kpi.name}</p>
                           <p className="text-[10px] text-[var(--steel)] uppercase font-bold tracking-widest">{kpi.frequency} ASSESSMENT</p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                           <p className="text-lg font-bold text-[var(--night)] leading-none mb-1">{kpi.target}</p>
                           <Badge className="bg-[#3b82f6]/10 text-[#3b82f6] text-[10px] font-bold border-none uppercase tracking-tighter">
                              {kpi.status}
                           </Badge>
                        </div>
                     </div>
                  ))}
               </div>
               
               <div className="p-4 bg-[var(--mist)] rounded-2xl border border-[var(--iron)]">
                  <p className="text-[10px] text-[var(--steel)] font-medium italic">
                     KPIs are calculated based on benchmarked performance for {kpis.length > 0 ? kpis[0].frequency : 'standard'} cycles.
                  </p>
               </div>
            </Card>
         </div>
      </div>
   )
}
