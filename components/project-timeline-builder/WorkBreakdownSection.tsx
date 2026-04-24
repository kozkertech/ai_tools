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
   <div className="mt-4 pl-4 border-l-2 border-[#ff7a59]/20 space-y-3">
      {subtasks.map((st, idx) => (
         <div key={idx} className="bg-[var(--mist)] p-3 rounded-xl border border-[var(--iron)] flex items-start gap-3 transition-colors">
            <div className="mt-0.5">
               <CheckCircle2 className="w-3.5 h-3.5 text-[var(--steel)]" />
            </div>
            <div className="space-y-1">
               <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs font-bold text-[var(--night)]">{st.name}</p>
                  <span className="text-[10px] text-[var(--steel)] bg-[var(--iron)] px-1.5 py-0.5 rounded transition-colors">{st.durationDays}d</span>
               </div>
               <p className="text-[10px] text-[var(--steel)] leading-relaxed">{st.description}</p>
               <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-[var(--steel)] uppercase tracking-tighter">Assigned:</span>
                  <span className="text-[10px] font-medium text-[var(--night)]">{st.owner}</span>
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
      <div className="card bg-[var(--cloud)] border border-[var(--iron)] rounded-2xl p-4 sm:p-5 space-y-4 hover:border-[#ff7a59]/30 transition-all group shadow-sm">
         <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="space-y-1 w-full">
               <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-[var(--night)] transition-colors">{task.name}</h4>
                  {task.critical && (
                     <Badge className="bg-red-500/10 text-red-500 text-[10px] font-bold border-none px-2 py-0">CRITICAL</Badge>
                  )}
                  <Badge 
                     className="text-[10px] font-bold border-none uppercase tracking-widest px-2 py-0" 
                     style={{ backgroundColor: `${priorityColors[task.priority]}15`, color: priorityColors[task.priority] }}
                  >
                     {task.priority}
                  </Badge>
               </div>
               <p className="text-xs text-[var(--steel)] leading-relaxed max-w-xl">{task.description}</p>
            </div>
            
            <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1 flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-[var(--iron)]">
               <span className="text-[10px] font-bold text-[var(--steel)] uppercase tracking-tighter sm:block hidden">Task Owner</span>
               <div className="flex items-center gap-2 bg-[var(--mist)] px-2 py-1 rounded-lg border border-[var(--iron)] transition-colors w-full sm:w-auto justify-center sm:justify-end">
                  <Users className="w-3 h-3 text-[var(--steel)]" />
                  <span className="text-xs font-bold text-[var(--night)]">{task.owner}</span>
               </div>
            </div>
         </div>

         <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--iron)]">
            <div className="flex gap-6">
               <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[var(--steel)]" />
                  <span className="text-[10px] font-bold text-[var(--steel)] tracking-tight">{task.durationDays} Days</span>
               </div>
               <div className="flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--steel)]" />
                  <span className="text-[10px] font-bold text-[var(--steel)] tracking-tight">{(task.dependencies?.length || 0)} deps</span>
               </div>
            </div>
            
            {hasSubtasks ? (
               <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[10px] font-bold text-[#ff7a59] uppercase tracking-widest flex items-center hover:text-[#ffaa99] transition-colors"
               >
                  {isExpanded ? 'Hide' : 'View'} {task.subtasks.length} Subtasks 
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5 ml-1" /> : <ChevronRight className="w-3.5 h-3.5 ml-1" />}
               </button>
            ) : (
               <span className="text-[10px] font-bold text-[var(--steel)] uppercase tracking-widest">No Subtasks</span>
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
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--night)] flex items-center gap-3 tracking-tighter">
               <ListTodo className="w-7 h-7 text-[#ff7a59]" />
               Work Breakdown
            </h2>
            <Badge className="badge-outline">
               {phases.length} Phases Total
            </Badge>
         </div>

         <div className="space-y-8 sm:space-y-12">
            {phases.map((phase, pIdx) => (
               <div key={pIdx} className="card bg-[var(--cloud)] border border-[var(--iron)] rounded-[2rem] sm:rounded-3xl overflow-hidden shadow-sm group/phase transition-all">
                  <div className="p-6 sm:p-8 bg-[var(--mist)] border-b border-[var(--iron)] flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 transition-colors">
                     <div className="space-y-2">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-[#ff7a59]/10 flex items-center justify-center text-[10px] font-bold text-[#ff7a59] border border-[#ff7a59]/20 shadow-inner">
                              {pIdx + 1}
                           </div>
                           <h3 className="text-xl sm:text-2xl font-bold text-[var(--night)]">{phase.name}</h3>
                        </div>
                        <p className="text-sm text-[var(--steel)] mt-1 max-w-2xl leading-relaxed font-medium">{phase.summary}</p>
                     </div>
                     
                     <div className="flex flex-col items-start xl:items-end gap-3 w-full xl:w-auto">
                        <div className="flex gap-3 w-full xl:w-auto">
                           <div className="flex-1 xl:flex-none bg-[var(--cloud)] px-4 py-2 rounded-xl border border-[var(--iron)] text-center xl:min-w-[90px] transition-colors shadow-sm">
                              <p className="text-[9px] font-bold text-[var(--steel)] uppercase tracking-tighter">Tasks</p>
                              <p className="text-base font-bold text-[var(--night)]">{phase.taskCount}</p>
                           </div>
                           <div className="flex-1 xl:flex-none bg-[var(--cloud)] px-4 py-2 rounded-xl border border-[var(--iron)] text-center xl:min-w-[90px] transition-colors shadow-sm">
                              <p className="text-[9px] font-bold text-[var(--steel)] uppercase tracking-tighter">Duration</p>
                              <p className="text-base font-bold text-[#ff7a59]">{phase.durationDays}d</p>
                           </div>
                        </div>
                        <p className="text-[10px] font-bold text-[var(--steel)] uppercase tracking-widest bg-[var(--iron)] px-2.5 py-1 rounded-md transition-colors w-full xl:w-auto text-center">
                           {phase.startDate} — {phase.endDate}
                        </p>
                     </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-6">
                     {phase.tasks?.map((task, tIdx) => (
                        <TaskCard key={tIdx} task={task} priorityColors={priorityColors} />
                     ))}
                     
                     {(!phase.tasks || phase.tasks.length === 0) && (
                        <div className="p-12 text-center space-y-3 bg-[var(--mist)] rounded-2xl border border-dashed border-[var(--iron)] transition-colors">
                           <Info className="w-8 h-8 text-[var(--steel)] mx-auto" />
                           <p className="text-sm text-[var(--steel)] font-medium tracking-tight">No tasks defined for this phase.</p>
                        </div>
                     )}
                  </div>
               </div>
            ))}
         </div>
      </div>
   )
}
