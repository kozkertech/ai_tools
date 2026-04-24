"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
   ArrowLeft,
   RefreshCcw,
   FileSpreadsheet,
   FileText,
   Sparkles
} from "lucide-react"
import type { AppMode } from "@/app/tools/project-timeline-builder/page"

interface DashboardToolbarProps {
   setMode: React.Dispatch<React.SetStateAction<AppMode>>;
   handleGenerate: () => void;
   handleExportCSV: () => void;
}

export const DashboardToolbar: React.FC<DashboardToolbarProps> = ({ setMode, handleGenerate, handleExportCSV }) => {
   return (
      <div className="sticky top-0 z-50 bg-[var(--mist)]/80 backdrop-blur-md border-b border-[var(--iron)] -mx-4 sm:-mx-8 px-4 sm:px-8 py-4 flex flex-wrap items-center justify-center sm:justify-between gap-4 shadow-xl transition-colors">
         <div className="flex items-center gap-4">
            <Button
               className="btn-outline px-4 transition-all"
               onClick={() => setMode('FORM')}
            >
               <ArrowLeft className="w-4 h-4 mr-2" />
               Edit Strategy
            </Button>
            <div className="flex items-center gap-2.5 px-4 py-1.5 bg-[#ff7a59]/10 rounded-full border border-[#ff7a59]/20 shadow-inner">
               <Sparkles className="w-3.5 h-3.5 text-[#ff7a59]" />
               <span className="text-[10px] font-black text-[#ff7a59] uppercase tracking-widest">AI Generated</span>
            </div>
         </div>

         <div className="flex items-center gap-3">
            <Button
               className="btn-outline px-4 transition-all"
               onClick={handleGenerate}
            >
               <RefreshCcw className="w-4 h-4 mr-2 text-[#ff7a59]" />
               Regenerate
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1 bg-[var(--iron)]" />
            <Button 
               className="btn-primary" 
               onClick={handleExportCSV}
            >
               <FileSpreadsheet className="w-4 h-4 mr-2" />
               Download
            </Button>
            <Button 
               disabled
               className="btn-outline hidden sm:flex select-none opacity-50 px-4"
            >
               <FileText className="w-4 h-4 mr-2" />
               PDF
            </Button>
         </div>
      </div>
   )
}
