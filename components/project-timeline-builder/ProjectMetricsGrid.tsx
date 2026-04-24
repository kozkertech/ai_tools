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
      { label: "Duration", val: summary.estimatedDuration, icon: Calendar, color: "text-[#3b82f6]", bg: "bg-[#3b82f6]/10" },
      { label: "Total Phases", val: summary.totalPhases, icon: Briefcase, color: "text-[#8b5cf6]", bg: "bg-[#8b5cf6]/10" },
      { label: "Work Items", val: summary.totalTasks, icon: ListTodo, color: "text-[#10b981]", bg: "bg-[#10b981]/10" },
      { label: "Milestones", val: summary.totalMilestones, icon: Flag, color: "text-[#ff7a59]", bg: "bg-[#ff7a59]/10" },
      { label: "Critical Path", val: summary.criticalTasksCount, icon: Zap, color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/10" },
      { label: "High Risks", val: summary.highRiskCount, icon: ShieldAlert, color: "text-[#ef4444]", bg: "bg-[#ef4444]/10" }
   ];

   return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 transition-colors">
         {metrics.map((item, i) => (
            <div 
               key={i} 
               className="card p-6 bg-[var(--cloud)] border border-[var(--iron)] rounded-3xl flex flex-col items-center justify-center text-center space-y-3 hover:border-[var(--iron)] hover:bg-[#ff7a59]/5 transition-all group shadow-sm"
            >
               <div className={`p-3 ${item.bg} rounded-2xl group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
               </div>
               <div>
                  <p className="text-2xl sm:text-3xl font-bold text-[var(--night)] tracking-tighter">{item.val}</p>
                  <p className="text-[10px] font-bold text-[var(--steel)] uppercase tracking-widest mt-1">{item.label}</p>
               </div>
            </div>
         ))}
      </div>
   )
}
