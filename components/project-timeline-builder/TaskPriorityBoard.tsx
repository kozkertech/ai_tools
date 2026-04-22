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
      <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-[2.5rem] space-y-6 sm:space-y-8 flex flex-col h-fit transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700/50 shadow-sm dark:shadow-xl group/col">
         <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-6">
            <div className="flex items-center gap-3">
               <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: color }} />
               <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]" style={{ color }}>{priority}</h4>
            </div>
            <div className="px-3 py-1 bg-zinc-50 dark:bg-zinc-950 rounded-full border border-zinc-200 dark:border-zinc-800 transition-colors">
               <span className="text-[11px] font-black text-zinc-500 dark:text-zinc-400">{tasks.length}</span>
            </div>
         </div>

         <div className="space-y-6">
            {tasks.map((task, i) => (
               <div key={i} className="group/item space-y-4 pb-6 border-b border-zinc-100 dark:border-zinc-800/40 last:border-0 last:pb-0">
                  <div className="space-y-2">
                     <div className="flex items-start gap-2">
                        {task.critical && (
                           <div className="mt-1 flex-shrink-0">
                              <Zap className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
                           </div>
                        )}
                        <p className={cn(
                           "text-sm sm:text-base font-bold leading-tight transition-colors line-clamp-2",
                           task.critical ? "text-red-600 dark:text-red-100 group-hover/item:text-red-500 dark:group-hover/item:text-white" : "text-zinc-800 dark:text-zinc-200 group-hover/item:text-zinc-900 dark:group-hover/item:text-white"
                        )}>
                           {task.name}
                        </p>
                     </div>
                     <p className="text-[11px] text-zinc-500 dark:text-zinc-500 leading-relaxed font-medium line-clamp-2 italic">
                        "{task.description}"
                     </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                     <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-900 group-hover/item:border-zinc-300 dark:group-hover/item:border-zinc-800 transition-colors">
                           <Users className="w-3 h-3 text-zinc-400 dark:text-zinc-600" />
                           <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 group-hover/item:text-zinc-800 dark:group-hover/item:text-zinc-300">{task.owner}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-900 group-hover/item:border-zinc-300 dark:group-hover/item:border-zinc-800 transition-colors">
                           <Clock className="w-3 h-3 text-zinc-400 dark:text-zinc-600" />
                           <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 group-hover/item:text-zinc-800 dark:group-hover/item:text-zinc-300">{task.durationDays}d</span>
                        </div>
                     </div>
                     <ChevronRight className="w-3.5 h-3.5 text-zinc-200 dark:text-zinc-800 group-hover/item:text-zinc-400 dark:group-hover/item:text-zinc-600 transition-colors" />
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
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-4 tracking-tighter">
               <Flag className="w-8 h-8 text-orange-500" />
               Task Priority
            </h2>
            <p className="text-sm text-zinc-500 font-medium max-w-2xl">
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
