"use client"

import { Check } from "lucide-react"

interface StepProgressProps {
  steps: string[]
  currentStep: number
}

export function StepProgress({ steps, currentStep }: StepProgressProps) {
  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between relative px-2">
        {/* Background Line */}
        <div className="absolute top-5 left-10 right-10 h-[2px] bg-zinc-800 -z-10" />
        
        {/* Progress Line */}
        <div 
          className="absolute top-5 left-10 h-[2px] bg-primary transition-all duration-700 -z-10" 
          style={{ width: `${(Math.max(0, currentStep) / (steps.length - 1)) * (100 - (20/steps.length * 100))}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          
          return (
            <div key={index} className="flex flex-col items-center gap-3">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCurrent ? "bg-primary border-primary text-white shadow-lg shadow-primary/30 scale-110" :
                  isCompleted ? "bg-primary/20 border-primary text-primary" :
                  "bg-zinc-900 border-zinc-800 text-gray-600"
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : <span className="text-sm font-bold">{index + 1}</span>}
              </div>
              <span className={`text-[10px] md:text-xs font-semibold uppercase tracking-wider transition-colors ${
                isCurrent ? "text-primary" : "text-gray-500"
              }`}>
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
