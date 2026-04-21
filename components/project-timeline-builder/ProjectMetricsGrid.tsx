"use client"

import React from "react"
import { 
   Calendar, 
   Briefcase, 
   ListTodo, 
   Flag, 
   Zap, 
   ShieldAlert 
} from "lucide-react"
import type { AIResponse } from "@/app/tools/project-timeline-builder/page"

interface ProjectMetricsGridProps {
   summary: AIResponse['projectSummary'];
}

export const ProjectMetricsGrid: React.FC<ProjectMetricsGridProps> = ({ summary }) => {
   const metrics = [
      { label: "Duration", val: summary.estimatedDuration, icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10" },
      { label: "Total Phases", val: summary.totalPhases, icon: Briefcase, color: "text-purple-500", bg: "bg-purple-500/10" },
      { label: "Work Items", val: summary.totalTasks, icon: ListTodo, color: "text-emerald-500", bg: "bg-emerald-500/10" },
      { label: "Milestones", val: summary.totalMilestones, icon: Flag, color: "text-orange-500", bg: "bg-orange-500/10" },
      { label: "Critical Path", val: summary.criticalTasksCount, icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
      { label: "High Risks", val: summary.highRiskCount, icon: ShieldAlert, color: "text-red-500", bg: "bg-red-500/10" }
   ];

   return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 transition-colors">
         {metrics.map((item, i) => (
            <div 
               key={i} 
               className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-center space-y-3 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all group shadow-sm dark:shadow-none"
            >
               <div className={`p-3 ${item.bg} rounded-2xl group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
               </div>
               <div>
                  <p className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">{item.val}</p>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">{item.label}</p>
               </div>
            </div>
         ))}
      </div>
   )
}
