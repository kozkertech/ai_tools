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
    <div className={`p-6 rounded-2xl bg-zinc-900 border border-white/5 hover:border-primary/20 transition-all group ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  )
}
