"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"

// Types
export type AppMode = 'FORM' | 'LOADING' | 'DASHBOARD';
export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type Severity = 'high' | 'medium' | 'low';

export interface UserInfo {
   name: string;
   email: string;
}

export interface ProjectMetadata {
   name: string;
   type: string;
   description: string;
   startDate: string;
   endDate: string;
   teamSize: string;
   complexity: string;
   priority: string;
   deliverables: string;
   constraints: string;
   successCriteria: string;
}

export interface Subtask {
   name: string;
   description: string;
   owner: string;
   durationDays: number;
}

export interface Task {
   name: string;
   description: string;
   priority: Priority;
   critical: boolean;
   owner: string;
   startDate: string;
   endDate: string;
   durationDays: number;
   dependencies: string[];
   subtasks: Subtask[];
}

export interface Phase {
   name: string;
   summary: string;
   startDate: string;
   endDate: string;
   tasks: Task[];
}

export interface AIResponse {
   success: boolean;
   projectSummary: {
      projectName: string;
      projectType: string;
      estimatedDuration: string;
      recommendedTeamStructure: string;
      mainGoal: string;
      deliveryStrategy: string;
      totalPhases: number;
      totalTasks: number;
      totalSubtasks: number;
      totalMilestones: number;
      criticalTasksCount: number;
      highRiskCount: number;
   };
   goals: {
      primaryGoal: string;
      secondaryGoals: string[];
      successCriteria: string[];
   };
   okrs: {
      objective: string;
      keyResults: string[];
   }[];
   kpis: {
      name: string;
      target: string;
      frequency: string;
      status: string;
      notes: string;
   }[];
   phases: Phase[];
   timeline: {
      phase: string;
      start: string;
      end: string;
      tasks: string[];
   }[];
   milestones: {
      name: string;
      targetDate: string;
      relatedPhase: string;
      importance: string;
      successCondition: string;
   }[];
   dependencies: {
      fromTask: string;
      toTask: string;
      type: string;
      impact: string;
   }[];
   criticalPath: {
      name: string;
      phase: string;
      reason: string;
   }[];
   risks: {
      title: string;
      severity: Severity;
      impact: string;
      mitigation: string;
   }[];
   prioritySummary: {
      critical: number;
      high: number;
      medium: number;
      low: number;
   };
   chartData: {
      priorityDistribution: { name: string; value: number; color: string }[];
      tasksPerPhase: { name: string; tasks: number }[];
      timelineLoad: { name: string; load: number }[];
      riskBreakdown: { name: string; value: number }[];
   };
}

// Components
import { 
   InputSection, 
   LoadingView, 
   DashboardToolbar, 
   ProjectHero, 
   ProjectMetricsGrid, 
   VisualTimeline, 
   WorkBreakdownSection, 
   TaskPriorityBoard, 
   VisualInsights, 
   MilestonesSection, 
   DependenciesSection, 
   CriticalPathSection, 
   StrategySection, 
   RiskSection 
} from "@/components/project-timeline-builder"

// Hooks
import { useProjectPlanViewModel } from "@/hooks/useProjectPlanViewModel"

// --- Dashboard View Component ---

const DashboardView = ({
   response,
   setMode,
   handleGenerate,
   handleExportCSV
}: {
   response: AIResponse;
   setMode: React.Dispatch<React.SetStateAction<AppMode>>;
   handleGenerate: () => void;
   handleExportCSV: () => void;
}) => {
   const viewModel = useProjectPlanViewModel(response);

   if (!viewModel) return null;

   const {
      groupedTimelineRows,
      tasksByPriority,
      phasesWithMeta,
      chartColors,
      visibility
   } = viewModel;

   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         className="space-y-12 sm:space-y-16 pb-32"
      >
         <DashboardToolbar 
            setMode={setMode} 
            handleGenerate={handleGenerate} 
            handleExportCSV={handleExportCSV} 
         />

         <ProjectHero summary={response.projectSummary} />
         
         <ProjectMetricsGrid summary={response.projectSummary} />

         {/* Timeline: Always full width, horizontal overflow allowed internally */}
         <VisualTimeline 
            groupedRows={groupedTimelineRows} 
            chartColors={chartColors.priority} 
         />

         {/* Work Breakdown & Priority: Dynamic Layout */}
         <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className={visibility.showPriorityBoard ? "lg:col-span-8" : "lg:col-span-12"}>
               <WorkBreakdownSection 
                  phases={phasesWithMeta} 
                  priorityColors={chartColors.priority} 
               />
            </div>

            {visibility.showPriorityBoard && (
               <div className="lg:col-span-4 space-y-10 sticky top-24">
                  <TaskPriorityBoard 
                     tasksByPriority={tasksByPriority} 
                     priorityColors={chartColors.priority} 
                  />
                  {visibility.showCriticalPath && <CriticalPathSection path={response.criticalPath} />}
               </div>
            )}
         </section>

         {/* Fallback for Critical Path if Priority Board is hidden */}
         {!visibility.showPriorityBoard && visibility.showCriticalPath && (
            <CriticalPathSection path={response.criticalPath} />
         )}

         {visibility.showInsights && (
            <VisualInsights 
               chartData={response.chartData} 
               priorityColors={chartColors.priority} 
            />
         )}

         {visibility.showStrategy && (
            <StrategySection 
               okrs={response.okrs} 
               kpis={response.kpis} 
            />
         )}

         {visibility.showRisks && (
            <RiskSection 
               risks={response.risks} 
               severityColors={chartColors.risk} 
            />
         )}

         {(visibility.showMilestones || visibility.showDependencies) && (
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {visibility.showMilestones && <MilestonesSection milestones={response.milestones} />}
               {visibility.showDependencies && <DependenciesSection dependencies={response.dependencies} />}
            </section>
         )}
      </motion.div>
   );
};

// --- Main Layout Component ---

export default function AIProjectPlanner() {
   const [mode, setMode] = useState<AppMode>('FORM');
   const [loadingStage, setLoadingStage] = useState(0);
   const [error, setError] = useState<string | null>(null);
   const [response, setResponse] = useState<AIResponse | null>(null);

   // Form State
   const [user, setUser] = useState<UserInfo>({ name: "", email: "" });
   const [project, setProject] = useState<ProjectMetadata>({
      name: "",
      type: "",
      description: "",
      startDate: "",
      endDate: "",
      teamSize: "3-5",
      complexity: "Medium",
      priority: "Medium",
      deliverables: "",
      constraints: "",
      successCriteria: ""
   });

   // Loading Animation
   useEffect(() => {
      let timer: NodeJS.Timeout;
      if (mode === 'LOADING') {
         timer = setInterval(() => {
            setLoadingStage(prev => (prev < 5 ? prev + 1 : prev));
         }, 2500);
      } else {
         setLoadingStage(0);
      }
      return () => clearInterval(timer);
   }, [mode]);

   // Submission Handler
   const handleGenerate = async () => {
      const missing = [];
      if (!user.name) missing.push("Full Name");
      if (!user.email) missing.push("Email Address");
      if (!project.name) missing.push("Project Name");
      if (!project.type) missing.push("Project Type");
      if (!project.description) missing.push("Project Goal/Description");
      if (!project.startDate) missing.push("Start Date");
      if (!project.endDate) missing.push("End Date");

      if (missing.length > 0) {
         setError(`Missing required fields: ${missing.join(', ')}`);
         return;
      }

      setError(null);
      setMode('LOADING');

      try {
         const WEBHOOK_URL = "https://n8n.srv832341.hstgr.cloud/webhook/project-timeline-builder";
         const payload = { user, project };

         const fetchResponse = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
         });

         if (!fetchResponse.ok) throw new Error('Failed to connect to the planning engine.');

         const data: AIResponse = await fetchResponse.json();
         if (!data.success && !data.projectSummary) {
            throw new Error('The AI advisor returned an incomplete plan.');
         }

         setResponse(data);
         setMode('DASHBOARD');
      } catch (err) {
         setError("We couldn’t generate the project plan right now. Please try again.");
         setMode('FORM');
      }
   };

   const handleExportCSV = () => {
      if (!response) return;

      const s = response.projectSummary;
      let csvContent = "data:text/csv;charset=utf-8,";

      csvContent += "SECTION,FIELD,VALUE\n";
      csvContent += `SUMMARY,Project Name,${s.projectName || 'Unnamed Project'}\n`;
      csvContent += `SUMMARY,Project Type,${s.projectType || 'Standard'}\n`;
      csvContent += `SUMMARY,Estimated Duration,${s.estimatedDuration || 'TBD'}\n`;
      csvContent += `SUMMARY,Team Structure,${(s.recommendedTeamStructure || '').replace(/,/g, ';')}\n`;
      csvContent += `SUMMARY,Main Goal,${(s.mainGoal || '').replace(/,/g, ' ')}\n`;
      csvContent += `SUMMARY,Delivery Strategy,${(s.deliveryStrategy || '').replace(/,/g, ' ')}\n`;

      csvContent += "\nMETRICS,METRIC,COUNT\n";
      csvContent += `METRICS,Total Phases,${s.totalPhases}\n`;
      csvContent += `METRICS,Total Tasks,${s.totalTasks}\n`;
      csvContent += `METRICS,Total Subtasks,${s.totalSubtasks}\n`;
      csvContent += `METRICS,Total Milestones,${s.totalMilestones}\n`;
      csvContent += `METRICS,Critical Tasks,${s.criticalTasksCount}\n`;
      csvContent += `METRICS,High Risks,${s.highRiskCount}\n`;

      csvContent += "\nWORK BREAKDOWN,PHASE,TASK,OWNER,DURATION,PRIORITY,CRITICAL\n";
      (response.phases || []).forEach(phase => {
         (phase.tasks || []).forEach(task => {
            csvContent += `WBS,${phase.name},${task.name},${task.owner},${task.durationDays}d,${task.priority},${task.critical ? 'YES' : 'NO'}\n`;
         });
      });

      csvContent += "\nMILESTONES,NAME,TARGET DATE,PHASE,IMPORTANCE\n";
      (response.milestones || []).forEach(m => {
         csvContent += `MILESTONE,${m.name},${m.targetDate},${m.relatedPhase},${m.importance}\n`;
      });

      csvContent += "\nRISKS,TITLE,SEVERITY,IMPACT,MITIGATION\n";
      (response.risks || []).forEach(r => {
         csvContent += `RISK,${r.title},${r.severity},${(r.impact || '').replace(/,/g, ';')},${(r.mitigation || '').replace(/,/g, ';')}\n`;
      });

      csvContent += "\nSTRATEGY,TYPE,OBJECTIVE/KPI,TARGET/RESULT\n";
      (response.okrs || []).forEach(okr => {
         csvContent += `OKR,Objective,${okr.objective},${(okr.keyResults || []).join('; ')}\n`;
      });
      (response.kpis || []).forEach(kpi => {
         csvContent += `KPI,Metric,${kpi.name},${kpi.target}\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${(s.projectName || 'project_plan').replace(/\s+/g, '_')}_full_plan.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   };

   return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-orange-500/30 transition-colors duration-300">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
            {mode !== 'DASHBOARD' && (
               <header className="mb-8 sm:mb-12 text-center space-y-4">
                  <motion.div
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-full border border-orange-500/20 mb-2 sm:mb-4"
                  >
                     <Sparkles className="w-4 h-4 text-orange-500" />
                     <span className="text-[10px] sm:text-xs font-bold text-orange-500 uppercase tracking-widest">Next-Gen Planning Engine</span>
                  </motion.div>
                  <h1 className="text-4xl sm:text-6xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none">
                     Project Planner <span className="text-orange-500">AI</span>
                  </h1>
                  <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-medium px-4">
                     Describe your project in a few simple inputs. The AI will generate a full project plan with timeline, tasks, milestones, priorities, and visual insights.
                  </p>
               </header>
            )}

            <AnimatePresence mode="wait">
               {mode === 'FORM' && (
                  <InputSection
                     key="input"
                     user={user}
                     setUser={setUser}
                     project={project}
                     setProject={setProject}
                     handleGenerate={handleGenerate}
                     error={error}
                  />
               )}
               {mode === 'LOADING' && (
                  <LoadingView
                     key="loading"
                     loadingStage={loadingStage}
                  />
               )}
               {mode === 'DASHBOARD' && response && (
                  <DashboardView
                     key="dashboard"
                     response={response}
                     setMode={setMode}
                     handleGenerate={handleGenerate}
                     handleExportCSV={handleExportCSV}
                  />
               )}
            </AnimatePresence>
         </div>

         <footer className="py-12 border-t border-zinc-200 dark:border-zinc-900 mt-20 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-8 flex flex-col sm:flex-row items-center justify-between gap-8">
               <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Kozker AI Tools</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-600 text-balance">Built for high-velocity teams and agile managers.</p>
               </div>
               <div className="flex gap-8">
                  <a href="#" className="text-xs font-bold text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors uppercase tracking-widest">Privacy</a>
                  <a href="#" className="text-xs font-bold text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors uppercase tracking-widest">Terms</a>
                  <a href="#" className="text-xs font-bold text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors uppercase tracking-widest underline decoration-orange-500/50">Stitch API Support</a>
               </div>
            </div>
         </footer>
      </div>
   );
}
