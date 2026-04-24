"use client"

import React from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

const LOADING_STAGES = [
   "Analyzing project context...",
   "Structuring delivery phases...",
   "Breaking down work items...",
   "Identifying critical path tasks...",
   "Mapping dependencies and risks...",
   "Finalizing your project dashboard..."
];

export const LoadingView = ({ loadingStage }: { loadingStage: number }) => (
   <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 max-w-md mx-auto text-center transition-colors">
      <div className="relative">
         <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 rounded-full border-4 border-[#ff7a59]/10 border-t-[#ff7a59]"
         />
         <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-[#ff7a59] animate-pulse" />
         </div>
      </div>

      <div className="space-y-4">
         <h2 className="text-2xl sm:text-3xl font-bold text-[var(--night)] tracking-tighter uppercase">Assembling Plan</h2>
         <motion.p
            key={loadingStage}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#ff7a59] font-bold text-sm tracking-wide"
         >
            {LOADING_STAGES[loadingStage]}
         </motion.p>
         <div className="flex gap-1.5 justify-center">
            {LOADING_STAGES.map((_, i) => (
               <div
                  key={i}
                  className={`h-1.5 w-8 rounded-full transition-all duration-500 ${i <= loadingStage ? 'bg-[#ff7a59]' : 'bg-[var(--iron)]'}`}
               />
            ))}
         </div>
      </div>

      <p className="text-[var(--steel)] text-xs sm:text-sm font-medium italic max-w-xs mx-auto">
         Our AI advisor is calculating the optimal workload distribution and critical path for your team...
      </p>
   </div>
);
