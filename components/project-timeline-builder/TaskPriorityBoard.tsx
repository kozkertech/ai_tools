"use client"

import React from "react"
import { Flag, Users, Clock, Zap, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Task, Priority } from "@/app/tools/project-timeline-builder/page"
import { cn } from "@/lib/utils"

interface PriorityColumnProps {
   priority: Priority;
   tasks: Task[];
   color: string;
}

const PriorityColumn: React.FC<PriorityColumnProps> = ({ priority, tasks, color }) => {
   if (tasks.length === 0) return null;

   return (
      <div className="card p-6 sm:p-8 bg-[var(--cloud)] border border-[var(--iron)] rounded-[2.5rem] space-y-6 sm:space-y-8 flex flex-col h-fit transition-all hover:bg-[var(--mist)] hover:border-[#ff7a59]/30 shadow-sm group/col">
         <div className="flex items-center justify-between border-b border-[var(--iron)] pb-6">
            <div className="flex items-center gap-3">
               <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: color }} />
               <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]" style={{ color }}>{priority}</h4>
            </div>
            <div className="px-3 py-1 bg-[var(--mist)] rounded-full border border-[var(--iron)] transition-colors">
               <span className="text-[11px] font-bold text-[var(--steel)]">{tasks.length}</span>
            </div>
         </div>

         <div className="space-y-6">
            {tasks.map((task, i) => (
               <div key={i} className="group/item space-y-4 pb-6 border-b border-[var(--iron)] last:border-0 last:pb-0">
                  <div className="space-y-2">
                     <div className="flex items-start gap-2">
                        {task.critical && (
                           <div className="mt-1 flex-shrink-0">
                              <Zap className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
                           </div>
                        )}
                        <p className={cn(
                           "text-sm sm:text-base font-bold leading-tight transition-colors line-clamp-2",
                           task.critical ? "text-red-500 group-hover/item:text-[#ff7a59]" : "text-[var(--night)]"
                        )}>
                           {task.name}
                        </p>
                     </div>
                     <p className="text-[11px] text-[var(--steel)] leading-relaxed font-medium line-clamp-2 italic">
                        "{task.description}"
                     </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                     <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-[var(--mist)] rounded-lg border border-[var(--iron)] group-hover/item:border-[#ff7a59]/30 transition-colors">
                           <Users className="w-3 h-3 text-[var(--steel)]" />
                           <span className="text-[10px] font-bold text-[var(--night)]">{task.owner}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-[var(--mist)] rounded-lg border border-[var(--iron)] group-hover/item:border-[#ff7a59]/30 transition-colors">
                           <Clock className="w-3 h-3 text-[var(--steel)]" />
                           <span className="text-[10px] font-bold text-[var(--night)]">{task.durationDays}d</span>
                        </div>
                     </div>
                     <ChevronRight className="w-3.5 h-3.5 text-[var(--iron)] group-hover/item:text-[#ff7a59] transition-colors" />
                  </div>
               </div>
            ))}
         </div>
      </div>
   )
}

interface TaskPriorityBoardProps {
   tasksByPriority: Record<Priority, Task[]>;
   priorityColors: Record<Priority, string>;
}

export const TaskPriorityBoard: React.FC<TaskPriorityBoardProps> = ({ tasksByPriority, priorityColors }) => {
   const priorities: Priority[] = ['critical', 'high', 'medium', 'low'];

   return (
      <div className="space-y-6 sm:space-y-8 transition-colors">
         <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--night)] flex items-center gap-4 tracking-tighter">
               <Flag className="w-8 h-8 text-[#ff7a59]" />
               Task Priority
            </h2>
            <p className="text-sm text-[var(--steel)] font-medium max-w-2xl">
               Automated resource allocation based on delivery risk and critical path logic.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8">
            {priorities.map(p => (
               <PriorityColumn 
                  key={p} 
                  priority={p} 
                  tasks={tasksByPriority[p]} 
                  color={priorityColors[p]} 
               />
            ))}
         </div>
      </div>
   )
}
