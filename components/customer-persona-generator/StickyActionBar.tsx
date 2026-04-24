"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, Wand2, Save } from "lucide-react"

interface StickyActionBarProps {
  onBack: () => void
  onGenerate: () => void
  isGenerating: boolean
  statusText?: string
}

export function StickyActionBar({ onBack, onGenerate, isGenerating, statusText }: StickyActionBarProps) {
  return (
    <div className="sticky bottom-6 z-40 mt-12 mb-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between gap-4 p-4 md:p-5 bg-[var(--cloud)] border border-[var(--iron)] rounded-2xl shadow-xl transition-all duration-300">
          <div className="hidden md:flex items-center gap-2 text-[var(--steel)]">
            <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-xs font-medium tracking-wide uppercase">
              {statusText || "Auto-saved locally"}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={onBack}
              disabled={isGenerating}
              className="btn-outline flex-1 md:flex-none h-11 px-6 rounded-xl"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={onGenerate}
              disabled={isGenerating}
              className="btn-primary flex-[2] md:flex-none h-11 px-8 rounded-xl"
            >
              {isGenerating ? (
                <>
                  <Wand2 className="w-4 h-4 mr-2 animate-pulse" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate ICP
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
