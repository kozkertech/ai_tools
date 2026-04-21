"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
   ListTodo, 
   Calendar, 
   ArrowRight, 
   ChevronRight, 
   ChevronDown, 
   CheckCircle2, 
   Users,
   Info
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { NormalizedPhase } from "@/hooks/useProjectPlanViewModel"
import type { Task, Subtask } from "@/app/tools/project-timeline-builder/page"

interface SubtaskListProps {
   subtasks: Subtask[];
}

const SubtaskList: React.FC<SubtaskListProps> = ({ subtasks }) => (
   <div className="mt-4 pl-4 border-l-2 border-orange-500/20 space-y-3">
      {subtasks.map((st, idx) => (
         <div key={idx} className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800/50 flex items-start gap-3 transition-colors">
            <div className="mt-0.5">
               <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-700" />
            </div>
            <div className="space-y-1">
               <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{st.name}</p>
                  <span className="text-[10px] text-zinc-500 bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded transition-colors">{st.durationDays}d</span>
               </div>
               <p className="text-[10px] text-zinc-500 dark:text-zinc-500 leading-relaxed">{st.description}</p>
               <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-tighter">Assigned:</span>
                  <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">{st.owner}</span>
               </div>
            </div>
         </div>
      ))}
   </div>
)

interface TaskCardProps {
   task: Task;
   priorityColors: Record<string, string>;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, priorityColors }) => {
   const [isExpanded, setIsExpanded] = useState(false);
   const hasSubtasks = (task.subtasks?.length || 0) > 0;

   return (
      <div className="bg-white dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl p-4 sm:p-5 space-y-4 hover:border-orange-500/30 transition-all group shadow-sm">
         <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="space-y-1 w-full">
               <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{task.name}</h4>
                  {task.critical && (
                     <Badge className="bg-red-500/10 text-red-600 dark:text-red-500 text-[10px] font-black border-none px-2 py-0">CRITICAL</Badge>
                  )}
                  <Badge 
                     className="text-[10px] font-black border-none uppercase tracking-widest px-2 py-0" 
                     style={{ backgroundColor: `${priorityColors[task.priority]}15`, color: priorityColors[task.priority] }}
                  >
                     {task.priority}
                  </Badge>
               </div>
               <p className="text-xs text-zinc-600 dark:text-zinc-500 leading-relaxed max-w-xl">{task.description}</p>
            </div>
            
            <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1 flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-zinc-100 dark:border-zinc-900">
               <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-tighter sm:block hidden">Task Owner</span>
               <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/50 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 transition-colors w-full sm:w-auto justify-center sm:justify-end">
                  <Users className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{task.owner}</span>
               </div>
            </div>
         </div>

         <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
            <div className="flex gap-6">
               <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600" />
                  <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 tracking-tight">{task.durationDays} Days</span>
               </div>
               <div className="flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600" />
                  <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 tracking-tight">{(task.dependencies?.length || 0)} deps</span>
               </div>
            </div>
            
            {hasSubtasks ? (
               <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[10px] font-black text-orange-600 dark:text-orange-500 uppercase tracking-widest flex items-center hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
               >
                  {isExpanded ? 'Hide' : 'View'} {task.subtasks.length} Subtasks 
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5 ml-1" /> : <ChevronRight className="w-3.5 h-3.5 ml-1" />}
               </button>
            ) : (
               <span className="text-[10px] font-bold text-zinc-300 dark:text-zinc-800 uppercase tracking-widest">No Subtasks</span>
            )}
         </div>

         <AnimatePresence>
            {isExpanded && hasSubtasks && (
               <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
               >
                  <SubtaskList subtasks={task.subtasks} />
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   )
}

interface WorkBreakdownSectionProps {
   phases: NormalizedPhase[];
   priorityColors: Record<string, string>;
}

export const WorkBreakdownSection: React.FC<WorkBreakdownSectionProps> = ({ phases, priorityColors }) => {
   return (
      <div className="space-y-8">
         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-3 tracking-tighter">
               <ListTodo className="w-7 h-7 text-blue-600 dark:text-blue-500" />
               Work Breakdown
            </h2>
            <Badge variant="outline" className="border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-500 font-bold uppercase tracking-widest text-[10px] sm:bg-transparent bg-white dark:bg-black">
               {phases.length} Phases Total
            </Badge>
         </div>

         <div className="space-y-8 sm:space-y-12">
            {phases.map((phase, pIdx) => (
               <div key={pIdx} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] sm:rounded-3xl overflow-hidden shadow-sm dark:shadow-2xl group/phase transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
                  <div className="p-6 sm:p-8 bg-zinc-50/50 dark:bg-zinc-800/30 border-b border-zinc-100 dark:border-zinc-800 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 transition-colors">
                     <div className="space-y-2">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-[10px] font-black text-orange-500 border border-orange-500/20 shadow-inner">
                              {pIdx + 1}
                           </div>
                           <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">{phase.name}</h3>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl leading-relaxed font-medium">{phase.summary}</p>
                     </div>
                     
                     <div className="flex flex-col items-start xl:items-end gap-3 w-full xl:w-auto">
                        <div className="flex gap-3 w-full xl:w-auto">
                           <div className="flex-1 xl:flex-none bg-white dark:bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-100 dark:border-zinc-800 text-center xl:min-w-[90px] transition-colors shadow-sm dark:shadow-none">
                              <p className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-tighter">Tasks</p>
                              <p className="text-base font-bold text-zinc-900 dark:text-white">{phase.taskCount}</p>
                           </div>
                           <div className="flex-1 xl:flex-none bg-white dark:bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-100 dark:border-zinc-800 text-center xl:min-w-[90px] transition-colors shadow-sm dark:shadow-none">
                              <p className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-tighter">Duration</p>
                              <p className="text-base font-bold text-orange-600 dark:text-orange-500">{phase.durationDays}d</p>
                           </div>
                        </div>
                        <p className="text-[10px] font-black text-zinc-500 dark:text-zinc-500 uppercase tracking-widest bg-zinc-200/50 dark:bg-zinc-800/50 px-2.5 py-1 rounded-md transition-colors w-full xl:w-auto text-center">
                           {phase.startDate} — {phase.endDate}
                        </p>
                     </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-6 bg-gradient-to-b from-transparent to-zinc-50/30 dark:to-zinc-950/20">
                     {phase.tasks?.map((task, tIdx) => (
                        <TaskCard key={tIdx} task={task} priorityColors={priorityColors} />
                     ))}
                     
                     {(!phase.tasks || phase.tasks.length === 0) && (
                        <div className="p-12 text-center space-y-3 bg-zinc-50/50 dark:bg-zinc-950/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 transition-colors">
                           <Info className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto" />
                           <p className="text-sm text-zinc-500 font-medium tracking-tight">No tasks defined for this phase.</p>
                        </div>
                     )}
                  </div>
               </div>
            ))}
         </div>
      </div>
   )
}
