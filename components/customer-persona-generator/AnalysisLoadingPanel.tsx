"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Loader2, Search, Database, Fingerprint, PieChart, CheckCircle2 } from "lucide-react"

const statusMessages = [
  { text: "Scanning website structure...", icon: Search },
  { text: "Extracting business positioning...", icon: Sparkles },
  { text: "Identifying target audience signals...", icon: Fingerprint },
  { text: "Mapping business category...", icon: Database },
  { text: "Preparing editable ICP draft...", icon: PieChart }
]

export function AnalysisLoadingPanel() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < statusMessages.length - 1) {
          setCompletedSteps((completed) => [...completed, prev])
          return prev + 1
        }
        return prev
      })
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-12 px-4">
      <Card className="card w-full max-w-lg shadow-xl border-[var(--iron)] bg-[var(--cloud)]/90 backdrop-blur-xl">
        <CardContent className="p-8 md:p-10">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-[#ff7a59]/20 blur-[30px] rounded-full animate-pulse" />
              <div className="relative w-20 h-20 bg-[var(--cloud)] rounded-2xl flex items-center justify-center border border-[var(--iron)]">
                <Loader2 className="w-10 h-10 text-[#ff7a59] animate-spin" />
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-[var(--night)] mb-2">Analyzing Business</h2>
            <p className="text-[var(--steel)]">Our AI is extracting context and building your draft persona.</p>
          </div>

          <div className="space-y-4">
            {statusMessages.map((status, index) => {
              const Icon = status.icon
              const isCurrent = index === currentStep
              const isCompleted = completedSteps.includes(index)
              
              return (
                <div 
                  key={index} 
                  className={`flex items-center gap-4 transition-all duration-500 ${
                    isCurrent ? "opacity-100 scale-105" : isCompleted ? "opacity-60" : "opacity-30"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                    isCurrent ? "bg-[#ff7a59]/20 border-[#ff7a59]/50 text-[#ff7a59]" : 
                    isCompleted ? "bg-[var(--mist)] border-[var(--iron)] text-[#10b981]" : "bg-[var(--cloud)] border-[var(--iron)] text-[var(--steel)] opacity-50"
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className={`w-5 h-5 ${isCurrent ? "animate-pulse" : ""}`} />}
                  </div>
                  
                  <div className="flex-1">
                    <p className={`text-sm font-medium transition-colors ${
                      isCurrent ? "text-[var(--night)] font-bold" : "text-[var(--steel)]"
                    }`}>
                      {status.text}
                    </p>
                    {isCurrent && (
                      <div className="w-full h-1 bg-[var(--iron)] rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full bg-[#ff7a59] animate-[loading_3s_ease-in-out_infinite]" />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
      
      <p className="mt-8 text-sm text-[var(--steel)] italic">
        "Good strategies take seconds, bad ones take months."
      </p>
    </div>
  )
}
