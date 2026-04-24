"use client"

import { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Edit2, RotateCcw } from "lucide-react"

interface EditableSectionCardProps {
  title: string
  description: string
  number: string
  confidence?: number
  onReset?: () => void
  children: ReactNode
}

export function EditableSectionCard({ 
  title, 
  description, 
  number, 
  confidence, 
  onReset,
  children 
}: EditableSectionCardProps) {
  return (
    <Card className="card mb-6 overflow-hidden group border-[var(--iron)]">
      <CardHeader className="p-6 pb-4 md:p-8 md:pb-6 relative border-b border-[var(--iron)] bg-[var(--mist)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#ff7a59]/10 border border-[#ff7a59]/20 flex items-center justify-center shrink-0">
              <span className="text-[#ff7a59] font-bold">{number}</span>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <CardTitle className="text-xl font-semibold text-[var(--night)] tracking-tight">{title}</CardTitle>
                {confidence && (
                  <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${
                    confidence > 80 ? "text-[#10b981] border-[#10b981]/30 bg-[#10b981]/5" :
                    confidence > 50 ? "text-[#ff7a59] border-[#ff7a59]/30 bg-[#ff7a59]/5" :
                    "text-[#f59e0b] border-[#f59e0b]/30 bg-[#f59e0b]/5"
                  }`}>
                    AI Confidence: {confidence}%
                  </Badge>
                )}
              </div>
              <CardDescription className="text-[var(--steel)] text-sm max-w-xl">
                {description}
              </CardDescription>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            {onReset && (
              <button 
                onClick={onReset}
                className="p-2 rounded-lg bg-[var(--cloud)] hover:bg-[var(--mist)] text-[var(--steel)] hover:text-[#ff7a59] transition-all border border-[var(--iron)]"
                title="Reset Section"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <div className="p-2 rounded-lg bg-[#ff7a59]/10 text-[#ff7a59] border border-[#ff7a59]/20">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 md:p-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {children}
        </div>
      </CardContent>
    </Card>
  )
}
