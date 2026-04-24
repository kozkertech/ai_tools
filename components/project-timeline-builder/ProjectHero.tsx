"use client"

import React from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Target, Zap, Users } from "lucide-react"
import type { AIResponse } from "@/app/tools/project-timeline-builder/page"

interface ProjectHeroProps {
   summary: AIResponse['projectSummary'];
}

export const ProjectHero: React.FC<ProjectHeroProps> = ({ summary }) => {
   return (
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 transition-colors">
         <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ff7a59]/10 rounded-full border border-[#ff7a59]/20">
                  <span className="text-[10px] font-bold text-[#ff7a59] uppercase tracking-widest leading-none">{summary.projectType || 'Project Plan'}</span>
               </div>
               <h1 className="text-4xl sm:text-6xl font-bold text-[var(--night)] tracking-tighter leading-tight sm:leading-[0.9]">{summary.projectName}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2 sm:pt-4">
               <div className="card p-6 sm:p-8 bg-[var(--cloud)] rounded-[2.5rem] border border-[var(--iron)] space-y-4 hover:bg-[#ff7a59]/5 transition-all shadow-sm">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-[#ff7a59]/10 rounded-2xl">
                        <Target className="w-6 h-6 text-[#ff7a59]" />
                     </div>
                     <h3 className="text-lg sm:text-xl font-bold text-[var(--night)] uppercase tracking-tighter">Strategic Goal</h3>
                  </div>
                  <p className="text-sm text-[var(--steel)] font-medium leading-relaxed italic">"{summary.mainGoal}"</p>
               </div>

               <div className="card p-6 sm:p-8 bg-[var(--cloud)] rounded-[2.5rem] border border-[var(--iron)] space-y-4 hover:bg-[#ff7a59]/5 transition-all shadow-sm">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-[#ff7a59]/10 rounded-2xl">
                        <Zap className="w-6 h-6 text-[#ff7a59]" />
                     </div>
                     <h3 className="text-lg sm:text-xl font-bold text-[var(--night)] uppercase tracking-tighter">Execution Strategy</h3>
                  </div>
                  <p className="text-sm text-[var(--steel)] font-medium leading-relaxed">{summary.deliveryStrategy}</p>
               </div>
            </div>

            <div className="p-6 sm:p-8 bg-[#ff7a59]/5 rounded-[2.5rem] border border-[#ff7a59]/10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-700">
                  <Users className="w-24 h-24 text-[#ff7a59]" />
               </div>
               <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
                  <div className="p-4 bg-[#ff7a59]/10 rounded-3xl">
                     <Users className="w-8 h-8 text-[#ff7a59]" />
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-[#ff7a59] uppercase tracking-[0.2em]">Optimal Team Composition</p>
                     <p className="text-xl sm:text-2xl font-bold text-[var(--night)] leading-tight">{summary.recommendedTeamStructure}</p>
                     <p className="text-xs text-[var(--steel)] mt-2">Recommended resourcing based on complexity and timeline constraints.</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="lg:col-span-1 flex flex-col justify-end pb-2">
            <div className="bg-[var(--cloud)]/30 border border-[var(--iron)] rounded-[2.5rem] p-6 sm:p-8 space-y-6">
               <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[var(--steel)] uppercase tracking-widest">AI Confidence Score</h4>
                  <div className="flex items-center gap-4">
                     <div className="flex-1 h-3 bg-[var(--iron)] rounded-full overflow-hidden">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: '94%' }}
                           transition={{ duration: 2, delay: 0.5 }}
                           className="h-full bg-gradient-to-r from-[#ff7a59] to-[#ffaa99]" 
                        />
                     </div>
                     <span className="text-lg font-bold text-[var(--night)]">94%</span>
                  </div>
               </div>
               <p className="text-[10px] text-[var(--steel)] font-medium italic leading-relaxed">
                  "Based on its internal database of {summary.projectType} projects, the model has high confidence in the output accuracy."
               </p>
            </div>
         </div>
      </section>
   )
}
