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
            className="w-24 h-24 rounded-full border-4 border-orange-500/10 dark:border-orange-500/20 border-t-orange-500"
         />
         <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-orange-500 animate-pulse" />
         </div>
      </div>

      <div className="space-y-4">
         <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase">Assembling Plan</h2>
         <motion.p
            key={loadingStage}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-orange-600 dark:text-orange-500/80 font-bold text-sm tracking-wide"
         >
            {LOADING_STAGES[loadingStage]}
         </motion.p>
         <div className="flex gap-1.5 justify-center">
            {LOADING_STAGES.map((_, i) => (
               <div
                  key={i}
                  className={`h-1.5 w-8 rounded-full transition-all duration-500 ${i <= loadingStage ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]' : 'bg-zinc-200 dark:bg-zinc-800'}`}
               />
            ))}
         </div>
      </div>

      <p className="text-zinc-500 dark:text-zinc-600 text-xs sm:text-sm font-medium italic max-w-xs mx-auto">
         Our AI advisor is calculating the optimal workload distribution and critical path for your team...
      </p>
   </div>
);
