"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Flag, GanttChart as TimelineIcon, ChevronRight, User, Calendar, Clock } from "lucide-react"
import type { GroupedTimelineRow } from "@/hooks/useProjectPlanViewModel"
import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface VisualTimelineProps {
   groupedRows: GroupedTimelineRow[];
   chartColors: Record<string, string>;
}

// --- Sub-components ---

const TimelineHeader = () => (
   <div className="grid grid-cols-12 gap-4 mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4 sticky top-0 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-20 transition-colors">
      <div className="col-span-3 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] px-4">
         Structure / Activity
      </div>
      <div className="col-span-9 flex justify-between px-4 relative">
         {["Month 1", "Month 2", "Month 3", "Month 4"].map((m, i) => (
            <div key={m} className="flex-1 text-center relative">
               <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">{m}</span>
               {i > 0 && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-4 bg-zinc-200 dark:bg-zinc-800" />}
            </div>
         ))}
      </div>
   </div>
)

const TimelineBar = ({ task, color }: { task: any, color: string }) => {
   const hasLabel = (task.timelineWidth || 0) > 20;

   return (
      <TooltipProvider delayDuration={100}>
         <Tooltip>
            <TooltipTrigger asChild>
               <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ 
                     width: `${task.timelineWidth}%`, 
                     left: `${task.timelineOffset}%`,
                     opacity: 1
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={cn(
                     "absolute h-9 flex items-center px-3 rounded-xl shadow-md dark:shadow-lg cursor-help transition-all group/bar",
                     "border border-white/20 dark:border-white/10 hover:border-white/30 dark:hover:border-white/20 hover:scale-[1.02] hover:z-30 hover:brightness-110",
                     !hasLabel && "justify-center"
                  )}
                  style={{ 
                     backgroundColor: `${color}ef`,
                     backgroundImage: `linear-gradient(135deg, ${color}22 0%, transparent 100%)`,
                     boxShadow: `0 4px 20px -5px ${color}33`
                  }}
               >
                  {hasLabel ? (
                     <span className="text-[10px] font-bold text-white truncate whitespace-nowrap drop-shadow-md flex items-center gap-2">
                        {task.critical && <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(248,113,113,0.8)]" />}
                        {task.name}
                     </span>
                  ) : (
                     <div className="flex gap-0.5">
                        <div className="w-1 h-1 bg-white/40 rounded-full" />
                        <div className="w-1 h-1 bg-white/40 rounded-full" />
                     </div>
                  )}
               </motion.div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 p-0 overflow-hidden w-72 shadow-2xl z-[100]">
               <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start gap-4">
                     <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <p className="font-black text-zinc-900 dark:text-white text-sm tracking-tight">{task.name}</p>
                           {task.critical && <span className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">Critical</span>}
                        </div>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{task.priority} Priority</p>
                     </div>
                     <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-zinc-100 dark:border-white/10" style={{ backgroundColor: `${color}22`, color }}>
                        <TimelineIcon className="w-4 h-4" />
                     </div>
                  </div>
                  
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed italic border-l-2 border-zinc-200 dark:border-zinc-800 pl-3">"{task.description}"</p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-900">
                     <div className="space-y-1">
                        <p className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-tighter flex items-center gap-1.5">
                           <User className="w-3 h-3" /> Owner
                        </p>
                        <p className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">{task.owner}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-tighter flex items-center gap-1.5">
                           <Clock className="w-3 h-3" /> Duration
                        </p>
                        <p className="text-[11px] font-bold text-orange-500">{task.durationDays} Days</p>
                     </div>
                  </div>
                  <div className="pt-1.5">
                     <p className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-tighter mb-1.5 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" /> Timeline
                     </p>
                     <div className="flex items-center justify-between gap-2 px-2 py-1 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800">
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{task.startDate}</span>
                        <ChevronRight className="w-3 h-3 text-zinc-300 dark:text-zinc-700" />
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{task.endDate}</span>
                     </div>
                  </div>
               </div>
            </TooltipContent>
         </Tooltip>
      </TooltipProvider>
   )
}

const TimelineTaskRow = ({ task, chartColors }: { task: any, chartColors: Record<string, string> }) => (
   <div className="grid grid-cols-12 items-center gap-4 py-3 group relative hover:bg-zinc-50 sm:hover:bg-zinc-900/10 transition-colors">
      <div className="col-span-3">
         <div className="flex flex-col px-4 border-l-2 border-transparent group-hover:border-zinc-300 sm:group-hover:border-zinc-800 transition-all">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors truncate">
               {task.name}
            </span>
            <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">{task.owner}</span>
         </div>
      </div>
      <div className="col-span-9 h-12 relative flex items-center">
         {/* Row Grid Background */}
         <div className="absolute inset-x-0 h-full bg-zinc-100/50 dark:bg-zinc-900/10 rounded-xl border border-zinc-200/50 dark:border-zinc-800/10 group-hover:border-zinc-300 dark:group-hover:border-zinc-800/30 transition-all" />
         
         {/* Vertical Guide Lines */}
         <div className="absolute inset-0 flex justify-between pointer-events-none px-4">
            {[1, 2, 3, 4, 5, 6, 7].map(j => (
               <div key={j} className="h-full w-px bg-zinc-200 dark:bg-zinc-800/20" />
            ))}
         </div>

         <TimelineBar task={task} color={chartColors[task.priority]} />
      </div>
   </div>
)

const TimelinePhaseGroup = ({ group, gIdx, chartColors }: { group: GroupedTimelineRow, gIdx: number, chartColors: Record<string, string> }) => (
   <div className="space-y-4">
      {/* Phase Header Row */}
      <div className="grid grid-cols-12 items-center gap-4 py-2 border-b border-zinc-100 dark:border-zinc-900/50">
         <div className="col-span-3">
            <div className="flex items-center gap-3 px-4">
               <div className="w-6 h-6 rounded-lg bg-orange-500/10 flex items-center justify-center text-[10px] font-black text-orange-500 border border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]">
                  {gIdx + 1}
               </div>
               <span className="text-[11px] font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-widest">{group.phaseName}</span>
            </div>
         </div>
         <div className="col-span-9 h-px bg-zinc-100 dark:bg-zinc-900 relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-4 px-4 bg-white dark:bg-zinc-950 py-0.5">
               <span className="text-[9px] font-black text-zinc-500 dark:text-zinc-700 uppercase tracking-tighter whitespace-nowrap">
                  {group.startDate} — {group.endDate}
               </span>
            </div>
         </div>
      </div>

      <div className="space-y-1 pt-2">
         {group.tasks.map((task, tIdx) => (
            <TimelineTaskRow key={tIdx} task={task} chartColors={chartColors} />
         ))}

         {/* Render Milestones on an invisible lane cross-cutting the phase */}
         <div className="relative h-4 mt-2">
            {group.milestones.map((m, mIdx) => (
               <TooltipProvider key={mIdx}>
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <motion.div
                           initial={{ scale: 0 }}
                           animate={{ left: `${m.timelineOffset}%`, scale: 1 }}
                           className="absolute -translate-x-1/2 cursor-help z-40 hover:scale-125 transition-transform"
                        >
                           <div className="w-3 h-3 rotate-45 bg-emerald-500 rounded-sm border-2 border-white dark:border-zinc-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        </motion.div>
                     </TooltipTrigger>
                     <TooltipContent className="bg-emerald-900 dark:bg-emerald-950 border-emerald-800 dark:border-emerald-900 text-emerald-50 shadow-2xl">
                        <div className="space-y-1 text-center p-1">
                           <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Milestone</p>
                           <p className="text-xs font-bold">{m.name}</p>
                           <p className="text-[9px] font-medium opacity-70">{m.targetDate}</p>
                        </div>
                     </TooltipContent>
                  </Tooltip>
               </TooltipProvider>
            ))}
         </div>
      </div>
   </div>
)

// --- Main Component ---

export const VisualTimeline: React.FC<VisualTimelineProps> = ({ groupedRows, chartColors }) => {
   return (
      <section className="space-y-8">
         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
               <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-3 tracking-tighter">
                  <TimelineIcon className="w-8 h-8 text-orange-500" />
                  Visual Project Timeline
               </h2>
               <p className="text-sm text-zinc-500 font-medium">Precision schedule visualization with critical path identification.</p>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
               <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
               <span className="text-[10px] font-black text-red-600 dark:text-red-100 uppercase tracking-widest">Critical Path Active</span>
            </div>
         </div>

         <Card className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800/80 overflow-hidden shadow-xl dark:shadow-2xl rounded-[2rem] sm:rounded-[3rem] transition-colors">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
               <div className="min-w-[800px] sm:min-w-[1000px] p-6 sm:p-10 pb-4">
                  <TimelineHeader />
                  <div className="space-y-12 sm:space-y-16 pb-12">
                     {groupedRows.map((group, gIdx) => (
                        <TimelinePhaseGroup 
                           key={group.phaseId} 
                           group={group} 
                           gIdx={gIdx} 
                           chartColors={chartColors} 
                        />
                     ))}
                  </div>
               </div>
            </div>
            
            <div className="px-6 sm:px-10 py-6 bg-zinc-50 dark:bg-zinc-900/30 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-6">
               <div className="flex flex-wrap gap-6 sm:gap-8">
                  {Object.entries(chartColors).map(([priority, color]) => (
                     <div key={priority} className="flex items-center gap-2.5">
                        <div className="w-3 h-3 rounded-full border border-white/20 dark:border-white/10 shadow-sm" style={{ backgroundColor: color }} />
                        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{priority}</span>
                     </div>
                  ))}
                  <div className="flex items-center gap-2.5">
                     <div className="w-3 h-3 rotate-45 bg-emerald-500 rounded-sm border border-white/20 dark:border-white/10" />
                     <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Milestones</span>
                  </div>
               </div>
               
               <p className="text-[10px] text-zinc-400 font-bold italic hidden lg:block">
                  * Timeline scale is normalized to project duration for optimal visualization.
               </p>
            </div>
         </Card>
      </section>
   )
}
