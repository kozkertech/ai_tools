"use client"

import { ReactNode } from "react"
import { LucideIcon } from "lucide-react"

interface PersonaInsightCardProps {
  title: string
  icon: LucideIcon
  children: ReactNode
  className?: string
}

export function PersonaInsightCard({ title, icon: Icon, children, className }: PersonaInsightCardProps) {
  return (
    <div className={`card p-6 rounded-2xl shadow-sm border border-[var(--iron)] bg-[var(--cloud)] hover:border-[#ff7a59]/30 transition-all group ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#ff7a59]/10 border border-[#ff7a59]/20 flex items-center justify-center text-[#ff7a59] group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-[var(--night)] tracking-tight">{title}</h3>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  )
}
