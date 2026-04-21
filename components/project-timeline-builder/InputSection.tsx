"use client"

import React from "react"
import { motion } from "framer-motion"
import { 
   LayoutDashboard, 
   Sparkles, 
   AlertTriangle,
   ListTodo,
   Target,
   GanttChart as TimelineIcon,
   Activity,
   Goal,
   Download,
   Users
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UserInfo, ProjectMetadata } from "@/app/tools/project-timeline-builder/page"

const PROJECT_TYPES = [
   "Website Project",
   "Mobile App",
   "Software Product",
   "AI Automation",
   "Data Analytics / BI",
   "Marketing Campaign",
   "Internal Operations",
   "Product Launch",
   "Custom",
];

interface InputSectionProps {
   user: UserInfo;
   setUser: React.Dispatch<React.SetStateAction<UserInfo>>;
   project: ProjectMetadata;
   setProject: React.Dispatch<React.SetStateAction<ProjectMetadata>>;
   handleGenerate: () => void;
   error: string | null;
}

export const InputSection = ({ user, setUser, project, setProject, handleGenerate, error }: InputSectionProps) => (
   <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20 transition-colors"
   >
      {/* Left Panel: Form */}
      <div className="lg:col-span-8 space-y-8">
         <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-2xl overflow-hidden rounded-[2rem] sm:rounded-[2.5rem]">
            <CardHeader className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 pb-6 px-6 sm:px-8">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                     <LayoutDashboard className="w-5 h-5 text-orange-600 dark:text-orange-500" />
                  </div>
                  <div>
                     <CardTitle className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase">Project Planner AI</CardTitle>
                     <CardDescription className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                        Provide a few basics. Our AI handles the full project architecture.
                     </CardDescription>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-6 sm:p-10 space-y-8">
               {/* Section 1: Basic Details */}
               <div className="space-y-6">
                  <div className="flex items-center gap-2 text-orange-600 dark:text-orange-500 font-black text-[10px] uppercase tracking-[0.2em]">
                     <div className="h-px bg-orange-500/10 flex-1" />
                     <span>Phase 1: Identification</span>
                     <div className="h-px bg-orange-500/10 flex-1" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label className="text-zinc-600 dark:text-zinc-300 font-bold text-xs uppercase tracking-widest">Full Name *</Label>
                        <Input
                           placeholder="e.g. Alex Rivera"
                           className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:border-orange-500/50 text-zinc-900 dark:text-white"
                           value={user.name}
                           onChange={e => setUser({ ...user, name: e.target.value })}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-zinc-600 dark:text-zinc-300 font-bold text-xs uppercase tracking-widest">Email Address *</Label>
                        <Input
                           type="email"
                           placeholder="alex@company.com"
                           className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:border-orange-500/50 text-zinc-900 dark:text-white"
                           value={user.email}
                           onChange={e => setUser({ ...user, email: e.target.value })}
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label className="text-zinc-600 dark:text-zinc-300 font-bold text-xs uppercase tracking-widest">Project Name *</Label>
                        <Input
                           placeholder="e.g. NextGen Web Platform"
                           className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:border-orange-500/50 text-orange-600 dark:text-orange-500 font-bold"
                           value={project.name}
                           onChange={e => setProject({ ...project, name: e.target.value })}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-zinc-600 dark:text-zinc-300 font-bold text-xs uppercase tracking-widest">Project Type *</Label>
                        <Select
                           value={project.type}
                           onValueChange={v => setProject({ ...project, type: v })}
                        >
                           <SelectTrigger className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
                              <SelectValue placeholder="Select type..." />
                           </SelectTrigger>
                           <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                              {PROJECT_TYPES.map(t => (
                                 <SelectItem key={t} value={t}>{t}</SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <Label className="text-zinc-600 dark:text-zinc-300 font-bold text-xs uppercase tracking-widest">Goal / Description *</Label>
                     <Textarea
                        placeholder="Describe what you want to build in a few sentences..."
                        className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:border-orange-500/50 min-h-[120px] resize-none text-zinc-900 dark:text-white"
                        value={project.description}
                        onChange={e => setProject({ ...project, description: e.target.value })}
                     />
                     <p className="text-[10px] text-zinc-400 dark:text-zinc-500 italic font-medium">Be as specific as possible about the desired outcome.</p>
                  </div>
               </div>

               {/* Section 2: Delivery Context */}
               <div className="space-y-6 pt-4">
                  <div className="flex items-center gap-2 text-orange-600 dark:text-orange-500 font-black text-[10px] uppercase tracking-[0.2em]">
                     <div className="h-px bg-orange-500/10 flex-1" />
                     <span>Phase 2: Project Constraints</span>
                     <div className="h-px bg-orange-500/10 flex-1" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label className="text-zinc-600 dark:text-zinc-300 font-bold text-xs uppercase tracking-widest">Desired Start Date *</Label>
                        <Input
                           type="date"
                           className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:border-orange-500/50 text-zinc-900 dark:text-white"
                           value={project.startDate}
                           onChange={e => setProject({ ...project, startDate: e.target.value })}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-zinc-600 dark:text-zinc-300 font-bold text-xs uppercase tracking-widest">Target Deadline *</Label>
                        <Input
                           type="date"
                           className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:border-orange-500/50 text-zinc-900 dark:text-white"
                           value={project.endDate}
                           onChange={e => setProject({ ...project, endDate: e.target.value })}
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="space-y-2">
                        <Label className="text-zinc-600 dark:text-zinc-300 font-bold text-xs uppercase tracking-widest">Team Size *</Label>
                        <Select value={project.teamSize} onValueChange={v => setProject({ ...project, teamSize: v })}>
                           <SelectTrigger className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                              <SelectItem value="1-2">Small (1-2)</SelectItem>
                              <SelectItem value="3-5">Medium (3-5)</SelectItem>
                              <SelectItem value="6-10">Large (6-10)</SelectItem>
                              <SelectItem value="10+">Enterprise (10+)</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>
                     <div className="space-y-2">
                        <Label className="text-zinc-600 dark:text-zinc-300 font-bold text-xs uppercase tracking-widest">Complexity *</Label>
                        <Select value={project.complexity} onValueChange={v => setProject({ ...project, complexity: v })}>
                           <SelectTrigger className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                              <SelectItem value="Simple">Simple</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Complex">Complex</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>
                     <div className="space-y-2">
                        <Label className="text-zinc-600 dark:text-zinc-300 font-bold text-xs uppercase tracking-widest">Priority *</Label>
                        <Select value={project.priority} onValueChange={v => setProject({ ...project, priority: v })}>
                           <SelectTrigger className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                              <SelectItem value="Low">Low</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Urgent">Urgent</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>
                  </div>
               </div>

               {/* Section 3: Optional Context */}
               <div className="space-y-6 pt-4">
                  <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em]">
                     <div className="h-px bg-zinc-100 dark:bg-zinc-800/50 flex-1" />
                     <span>Context (Optional)</span>
                     <div className="h-px bg-zinc-100 dark:bg-zinc-800/50 flex-1" />
                  </div>

                  <div className="space-y-2">
                     <Label className="text-zinc-400 dark:text-zinc-500 font-bold text-xs uppercase tracking-widest">Key Deliverables</Label>
                     <Input
                        placeholder="Feature A, Module B, API documentation..."
                        className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
                        value={project.deliverables}
                        onChange={e => setProject({ ...project, deliverables: e.target.value })}
                     />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label className="text-zinc-400 dark:text-zinc-500 font-bold text-xs uppercase tracking-widest">Technical Hints</Label>
                        <Textarea
                           placeholder="Technical limits, specific tools/stacks..."
                           className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 min-h-[80px] text-zinc-900 dark:text-white"
                           value={project.constraints}
                           onChange={e => setProject({ ...project, constraints: e.target.value })}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-zinc-400 dark:text-zinc-500 font-bold text-xs uppercase tracking-widest">Success Metrics</Label>
                        <Textarea
                           placeholder="How will we know the project is successful?"
                           className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 min-h-[80px] text-zinc-900 dark:text-white"
                           value={project.successCriteria}
                           onChange={e => setProject({ ...project, successCriteria: e.target.value })}
                        />
                     </div>
                  </div>
               </div>

               {error && (
                  <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-start gap-3">
                     <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" />
                     <p className="text-red-700 dark:text-red-500 text-sm font-bold">{error}</p>
                  </div>
               )}

               <div className="pt-6">
                  <Button
                     onClick={handleGenerate}
                     className="w-full bg-orange-600 hover:bg-orange-700 text-white py-8 rounded-[1.5rem] sm:rounded-3xl text-lg sm:text-xl font-black uppercase tracking-tighter shadow-xl shadow-orange-900/10 transition-all flex gap-3 group"
                  >
                     <Sparkles className="w-6 h-6 group-hover:scale-125 transition-transform" />
                     Assemble Project Plan
                  </Button>
                  <div className="flex flex-wrap justify-center mt-8 gap-4 sm:gap-6">
                     <button
                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs font-black uppercase tracking-widest transition-colors"
                        onClick={() => {
                           setUser({ name: "", email: "" });
                           setProject({
                              name: "", type: "", description: "", startDate: "", endDate: "",
                              teamSize: "3-5", complexity: "Medium", priority: "Medium",
                              deliverables: "", constraints: "", successCriteria: ""
                           });
                        }}
                     >
                        Clear Logic
                     </button>
                     <div className="hidden sm:block w-px h-4 bg-zinc-200 dark:bg-zinc-800" />
                     <button
                        className="text-orange-500/70 hover:text-orange-600 dark:hover:text-orange-400 text-xs font-black uppercase tracking-widest transition-colors"
                        onClick={() => {
                           setUser({ name: "Demo User", email: "demo@example.com" });
                           setProject({
                              name: "Nexus AI Market Intelligence",
                              type: "AI Automation",
                              description: "Build an automated intelligence platform that scrapes global e-commerce trends, analyzes them using LLMs, and generates weekly strategic reports for retail executives.",
                              startDate: "2024-05-10",
                              endDate: "2024-09-15",
                              teamSize: "3-5",
                              complexity: "Medium",
                              priority: "High",
                              deliverables: "Data Scraper, Analysis Engine, Executive Dashboard, Alert System",
                              constraints: "Must use Python for backend and Next.js for frontend. Scrapers must handle React-heavy sites.",
                              successCriteria: "Identify at least 5 major trending products before the competition each week."
                           });
                        }}
                     >
                        Load Pattern
                     </button>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>

      {/* Right Panel: Value Prop */}
      <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
         <Card className="bg-white/50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 border-dashed rounded-[2rem] sm:rounded-[2.5rem]">
            <CardContent className="p-8 space-y-8">
               <div className="space-y-2">
                  <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">AI Capabilities</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">Our machine learning models analyze project complexity and team constraints to generate a professional-grade WBS.</p>
               </div>

               <ul className="space-y-6">
                  {[
                     { icon: ListTodo, label: "Work Breakdown Structure", desc: "Detailed phases and granular tasks." },
                     { icon: Target, label: "Success Conditions", desc: "Measurable wins for every milestone." },
                     { icon: TimelineIcon, label: "Visual Delivery Roadmap", desc: "Rich Gantt visualization and forecasting." },
                     { icon: Activity, label: "Critical Path Logic", desc: "Automated identification of priority items." },
                     { icon: Goal, label: "Strategic Alignment", desc: "Mapping work to corporate goals." },
                     { icon: Users, label: "Resource Distribution", desc: "Optimized team allocation per phase." }
                  ].map((item, i) => (
                     <li key={i} className="flex gap-4 group/item">
                        <div className="p-2.5 bg-white dark:bg-zinc-800 rounded-xl h-fit border border-zinc-100 dark:border-zinc-700 shadow-sm transition-transform group-hover/item:scale-110">
                           <item.icon className="w-4 h-4 text-orange-600 dark:text-orange-500" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{item.label}</p>
                           <p className="text-xs text-zinc-500 dark:text-zinc-500 font-medium leading-relaxed">{item.desc}</p>
                        </div>
                     </li>
                  ))}
               </ul>

               <div className="p-6 bg-orange-500/5 rounded-2xl border border-orange-500/10 space-y-3">
                  <div className="flex items-center gap-2">
                     <Sparkles className="w-4 h-4 text-orange-600 dark:text-orange-500" />
                     <span className="text-[10px] font-black text-orange-600 dark:text-orange-500 uppercase tracking-widest">Intelligence Node</span>
                  </div>
                  <p className="text-xs text-orange-700/60 dark:text-orange-200/60 leading-relaxed italic font-medium">
                     "By analyzing historical delivery patterns of similar {project.type || "Software"} projects, the AI will provide highly realistic duration estimates."
                  </p>
               </div>
            </CardContent>
         </Card>
      </div>
   </motion.div>
);
