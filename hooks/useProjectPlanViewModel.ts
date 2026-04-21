"use client"

import { useMemo } from "react"
import type { AIResponse, Priority, Severity, Task, Phase } from "@/app/tools/project-timeline-builder/page"

export interface NormalizedPhase extends Phase {
   taskCount: number;
   subtaskCount: number;
   milestoneCount: number;
   dependencyCount: number;
   durationDays: number;
}

export interface GroupedTimelineRow {
   phaseId: string;
   phaseName: string;
   startDate: string;
   endDate: string;
   tasks: (Task & { timelineOffset?: number; timelineWidth?: number })[];
   milestones: (AIResponse['milestones'][0] & { timelineOffset?: number })[];
}

export interface UseProjectPlanViewModelReturn {
   groupedTimelineRows: GroupedTimelineRow[];
   tasksByPriority: Record<Priority, Task[]>;
   phasesWithMeta: NormalizedPhase[];
   chartColors: {
      priority: Record<Priority, string>;
      risk: Record<Severity, string>;
      milestone: string;
   };
   visibility: {
      showPriorityBoard: boolean;
      showMilestones: boolean;
      showDependencies: boolean;
      showCriticalPath: boolean;
      showRisks: boolean;
      showStrategy: boolean;
      showInsights: boolean;
   };
}

export const useProjectPlanViewModel = (response: AIResponse | null): UseProjectPlanViewModelReturn | null => {
   return useMemo(() => {
      if (!response) return null;

      // 1. Phases with Metadata
      const phasesWithMeta: NormalizedPhase[] = (response.phases || []).map(phase => {
         const taskCount = phase.tasks?.length || 0;
         const subtaskCount = phase.tasks?.reduce((acc, t) => acc + (t.subtasks?.length || 0), 0) || 0;
         const milestoneCount = response.milestones?.filter(m => m.relatedPhase === phase.name).length || 0;
         const dependencyCount = response.dependencies?.filter(d => 
            phase.tasks?.some(t => t.name === d.fromTask || t.name === d.toTask)
         ).length || 0;

         // Calculate duration in days if possible
         const start = new Date(phase.startDate);
         const end = new Date(phase.endDate);
         const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 0;

         return {
            ...phase,
            taskCount,
            subtaskCount,
            milestoneCount,
            dependencyCount,
            durationDays
         };
      });

      // 2. Aggregate Project Dates
      const allPhaseDates = phasesWithMeta.flatMap(p => [new Date(p.startDate), new Date(p.endDate)]);
      const projectStart = allPhaseDates.length > 0 ? new Date(Math.min(...allPhaseDates.map(d => d.getTime()))) : new Date();
      const projectEnd = allPhaseDates.length > 0 ? new Date(Math.max(...allPhaseDates.map(d => d.getTime()))) : new Date();
      const projectDurationMs = projectEnd.getTime() - projectStart.getTime();

      // Helper to calculate percentages
      const calculateTimelineMetrics = (itemStart: string, itemEnd: string) => {
         if (projectDurationMs <= 0) return { offset: 0, width: 0 };
         const start = new Date(itemStart);
         const end = new Date(itemEnd);
         const offset = ((start.getTime() - projectStart.getTime()) / projectDurationMs) * 100;
         const width = ((end.getTime() - start.getTime()) / projectDurationMs) * 100;
         return { 
            offset: Math.max(0, Math.min(100, offset)), 
            width: Math.max(2, Math.min(100, width)) // Min 2% visibility
         };
      };

      // 3. Grouped Timeline Rows
      const groupedTimelineRows: GroupedTimelineRow[] = phasesWithMeta.map(phase => {
         const tasks = (phase.tasks || []).map(t => {
            const { offset, width } = calculateTimelineMetrics(t.startDate, t.endDate);
            return { ...t, timelineOffset: offset, timelineWidth: width };
         });

         const milestones = (response.milestones || [])
            .filter(m => m.relatedPhase === phase.name)
            .map(m => {
               const { offset } = calculateTimelineMetrics(m.targetDate, m.targetDate);
               return { ...m, timelineOffset: offset };
            });

         return {
            phaseId: phase.name.toLowerCase().replace(/\s+/g, '-'),
            phaseName: phase.name,
            startDate: phase.startDate,
            endDate: phase.endDate,
            tasks,
            milestones
         };
      });

      // 3. Tasks by Priority
      const allTasks = (response.phases || []).flatMap(p => (p.tasks || []).map(t => ({
         ...t,
         priority: (t.priority?.toLowerCase() || 'medium') as Priority
      })));
      
      const tasksByPriority: Record<Priority, Task[]> = {
         critical: allTasks.filter(t => t.priority === 'critical'),
         high: allTasks.filter(t => t.priority === 'high'),
         medium: allTasks.filter(t => t.priority === 'medium'),
         low: allTasks.filter(t => t.priority === 'low'),
      };

      // 4. Semantic Colors
      const chartColors = {
         priority: {
            critical: "#ef4444",
            high: "#f97316",
            medium: "#3b82f6",
            low: "#71717a",
         },
         risk: {
            high: "#ef4444",
            medium: "#f97316",
            low: "#71717a",
         },
         milestone: "#10b981",
      };

      // 5. Visibility Logic
      const showPriorityBoard = (() => {
         const populatedGroups = Object.values(tasksByPriority).filter(tasks => tasks.length > 0);
         const totalTasks = Object.values(tasksByPriority).reduce((sum, tasks) => sum + tasks.length, 0);
         return populatedGroups.length >= 2 && totalTasks >= 3;
      })();

      const visibility = {
         showPriorityBoard,
         showMilestones: (response.milestones?.length || 0) > 0,
         showDependencies: (response.dependencies?.length || 0) > 0,
         showCriticalPath: (response.criticalPath?.length || 0) > 0,
         showRisks: (response.risks?.length || 0) > 0,
         showStrategy: (response.okrs?.length || 0) > 0 || (response.kpis?.length || 0) > 0,
         showInsights: (response.chartData?.priorityDistribution?.length || 0) > 0
      };

      return {
         groupedTimelineRows,
         tasksByPriority,
         phasesWithMeta,
         chartColors,
         visibility
      };
   }, [response]);
}
