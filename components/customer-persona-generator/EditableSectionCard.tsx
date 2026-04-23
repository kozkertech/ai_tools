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
    <Card className="border-white/5 bg-zinc-900/50 backdrop-blur-xl mb-6 overflow-hidden group">
      <CardHeader className="p-6 pb-4 md:p-8 md:pb-6 relative border-b border-white/5 bg-gradient-to-r from-zinc-800/30 to-transparent">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <span className="text-primary font-bold">{number}</span>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <CardTitle className="text-xl font-bold text-white tracking-tight">{title}</CardTitle>
                {confidence && (
                  <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${
                    confidence > 80 ? "text-green-400 border-green-400/30 bg-green-400/5" :
                    confidence > 50 ? "text-primary border-primary/30 bg-primary/5" :
                    "text-amber-400 border-amber-400/30 bg-amber-400/5"
                  }`}>
                    AI Confidence: {confidence}%
                  </Badge>
                )}
              </div>
              <CardDescription className="text-gray-400 text-sm max-w-xl">
                {description}
              </CardDescription>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            {onReset && (
              <button 
                onClick={onReset}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-white transition-all border border-white/5"
                title="Reset Section"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
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
