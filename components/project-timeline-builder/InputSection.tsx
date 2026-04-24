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
         <Card className="card overflow-hidden rounded-[2rem] sm:rounded-[2.5rem]">
            <CardHeader className="bg-[var(--mist)] border-b border-[var(--iron)] pb-6 px-6 sm:px-8">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#ff7a59]/10 rounded-lg">
                     <LayoutDashboard className="w-5 h-5 text-[#ff7a59]" />
                  </div>
                  <div>
                     <CardTitle className="text-xl sm:text-2xl font-bold text-[var(--night)] tracking-tighter uppercase">Project Planner AI</CardTitle>
                     <CardDescription className="text-[var(--steel)] mt-1 font-medium">
                        Provide a few basics. Our AI handles the full project architecture.
                     </CardDescription>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-6 sm:p-10 space-y-8">
               {/* Section 1: Basic Details */}
               <div className="space-y-6">
                  <div className="flex items-center gap-2 text-[#ff7a59] font-black text-[10px] uppercase tracking-[0.2em]">
                     <div className="h-px bg-[#ff7a59]/20 flex-1" />
                     <span>Phase 1: Identification</span>
                     <div className="h-px bg-[#ff7a59]/20 flex-1" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label className="text-[var(--steel)] font-bold text-xs uppercase tracking-widest">Full Name *</Label>
                        <Input
                           placeholder="e.g. Alex Rivera"
                           className="input"
                           value={user.name}
                           onChange={e => setUser({ ...user, name: e.target.value })}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[var(--steel)] font-bold text-xs uppercase tracking-widest">Email Address *</Label>
                        <Input
                           type="email"
                           placeholder="alex@company.com"
                           className="input"
                           value={user.email}
                           onChange={e => setUser({ ...user, email: e.target.value })}
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label className="text-[var(--steel)] font-bold text-xs uppercase tracking-widest">Project Name *</Label>
                        <Input
                           placeholder="e.g. NextGen Web Platform"
                           className="input font-bold"
                           value={project.name}
                           onChange={e => setProject({ ...project, name: e.target.value })}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[var(--steel)] font-bold text-xs uppercase tracking-widest">Project Type *</Label>
                        <Select
                           value={project.type}
                           onValueChange={v => setProject({ ...project, type: v })}
                        >
                           <SelectTrigger className="input">
                              <SelectValue placeholder="Select type..." />
                           </SelectTrigger>
                           <SelectContent className="bg-[var(--cloud)] border border-[var(--iron)] text-[var(--night)]">
                              {PROJECT_TYPES.map(t => (
                                 <SelectItem key={t} value={t}>{t}</SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <Label className="text-[var(--steel)] font-bold text-xs uppercase tracking-widest">Goal / Description *</Label>
                     <Textarea
                        placeholder="Describe what you want to build in a few sentences..."
                        className="input min-h-[120px] resize-none"
                        value={project.description}
                        onChange={e => setProject({ ...project, description: e.target.value })}
                     />
                     <p className="text-[10px] text-[var(--steel)] italic font-medium">Be as specific as possible about the desired outcome.</p>
                  </div>
               </div>

               {/* Section 2: Delivery Context */}
               <div className="space-y-6 pt-4">
                  <div className="flex items-center gap-2 text-[#ff7a59] font-black text-[10px] uppercase tracking-[0.2em]">
                     <div className="h-px bg-[#ff7a59]/20 flex-1" />
                     <span>Phase 2: Project Constraints</span>
                     <div className="h-px bg-[#ff7a59]/20 flex-1" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label className="text-[var(--steel)] font-bold text-xs uppercase tracking-widest">Desired Start Date *</Label>
                        <Input
                           type="date"
                           className="input"
                           value={project.startDate}
                           onChange={e => setProject({ ...project, startDate: e.target.value })}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[var(--steel)] font-bold text-xs uppercase tracking-widest">Target Deadline *</Label>
                        <Input
                           type="date"
                           className="input"
                           value={project.endDate}
                           onChange={e => setProject({ ...project, endDate: e.target.value })}
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="space-y-2">
                        <Label className="text-[var(--steel)] font-bold text-xs uppercase tracking-widest">Team Size *</Label>
                        <Select value={project.teamSize} onValueChange={v => setProject({ ...project, teamSize: v })}>
                           <SelectTrigger className="input">
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent className="bg-[var(--cloud)] border border-[var(--iron)] text-[var(--night)]">
                              <SelectItem value="1-2">Small (1-2)</SelectItem>
                              <SelectItem value="3-5">Medium (3-5)</SelectItem>
                              <SelectItem value="6-10">Large (6-10)</SelectItem>
                              <SelectItem value="10+">Enterprise (10+)</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[var(--steel)] font-bold text-xs uppercase tracking-widest">Complexity *</Label>
                        <Select value={project.complexity} onValueChange={v => setProject({ ...project, complexity: v })}>
                           <SelectTrigger className="input">
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent className="bg-[var(--cloud)] border border-[var(--iron)] text-[var(--night)]">
                              <SelectItem value="Simple">Simple</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Complex">Complex</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[var(--steel)] font-bold text-xs uppercase tracking-widest">Priority *</Label>
                        <Select value={project.priority} onValueChange={v => setProject({ ...project, priority: v })}>
                           <SelectTrigger className="input">
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent className="bg-[var(--cloud)] border border-[var(--iron)] text-[var(--night)]">
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
                  <div className="flex items-center gap-2 text-[var(--steel)] font-black text-[10px] uppercase tracking-[0.2em]">
                     <div className="h-px bg-[var(--iron)] flex-1" />
                     <span>Context (Optional)</span>
                     <div className="h-px bg-[var(--iron)] flex-1" />
                  </div>

                  <div className="space-y-2">
                     <Label className="text-[var(--steel)] font-bold text-xs uppercase tracking-widest">Key Deliverables</Label>
                     <Input
                        placeholder="Feature A, Module B, API documentation..."
                        className="input"
                        value={project.deliverables}
                        onChange={e => setProject({ ...project, deliverables: e.target.value })}
                     />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label className="text-[var(--steel)] font-bold text-xs uppercase tracking-widest">Technical Hints</Label>
                        <Textarea
                           placeholder="Technical limits, specific tools/stacks..."
                           className="input min-h-[80px]"
                           value={project.constraints}
                           onChange={e => setProject({ ...project, constraints: e.target.value })}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[var(--steel)] font-bold text-xs uppercase tracking-widest">Success Metrics</Label>
                        <Textarea
                           placeholder="How will we know the project is successful?"
                           className="input min-h-[80px]"
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
                     className="btn-primary w-full py-8 rounded-[1.5rem] sm:rounded-3xl text-lg sm:text-xl font-black uppercase tracking-tighter"
                  >
                     <Sparkles className="w-6 h-6 group-hover:scale-125 transition-transform" />
                     Assemble Project Plan
                  </Button>
                  <div className="flex flex-wrap justify-center mt-8 gap-4 sm:gap-6">
                     <button
                        className="text-[var(--steel)] hover:text-[#ff7a59] text-xs font-bold uppercase tracking-widest transition-colors"
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
                     <div className="hidden sm:block w-px h-4 bg-[var(--iron)]" />
                     <button
                        className="text-[#ff7a59]/70 hover:text-[#ff7a59] text-xs font-bold uppercase tracking-widest transition-colors"
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
         <Card className="bg-[var(--cloud)]/50 border-[var(--iron)] border-dashed rounded-[2rem] sm:rounded-[2.5rem]">
            <CardContent className="p-8 space-y-8">
               <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[var(--night)] uppercase tracking-tighter">AI Capabilities</h3>
                  <p className="text-sm text-[var(--steel)] font-medium leading-relaxed">Our machine learning models analyze project complexity and team constraints to generate a professional-grade WBS.</p>
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
                        <div className="p-2.5 bg-[var(--cloud)] rounded-xl h-fit border border-[var(--iron)] shadow-sm transition-transform group-hover/item:scale-110">
                           <item.icon className="w-4 h-4 text-[#ff7a59]" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-sm font-bold text-[var(--night)]">{item.label}</p>
                           <p className="text-xs text-[var(--steel)] font-medium leading-relaxed">{item.desc}</p>
                        </div>
                     </li>
                  ))}
               </ul>

               <div className="p-6 bg-[#ff7a59]/5 rounded-2xl border border-[#ff7a59]/10 space-y-3">
                  <div className="flex items-center gap-2">
                     <Sparkles className="w-4 h-4 text-[#ff7a59]" />
                     <span className="text-[10px] font-black text-[#ff7a59] uppercase tracking-widest">Intelligence Node</span>
                  </div>
                  <p className="text-xs text-[#ff7a59] opacity-80 leading-relaxed italic font-medium">
                     "By analyzing historical delivery patterns of similar {project.type || "Software"} projects, the AI will provide highly realistic duration estimates."
                  </p>
               </div>
            </CardContent>
         </Card>
      </div>
   </motion.div>
);
