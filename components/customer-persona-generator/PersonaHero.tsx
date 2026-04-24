"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, Lightbulb, Sparkles, AlertCircle } from "lucide-react"

interface PersonaHeroProps {
  onAnalyze: (url: string, description: string) => void
  onManualMode: () => void
  isLoading: boolean
}

export function PersonaHero({ onAnalyze, onManualMode, isLoading }: PersonaHeroProps) {
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) {
      setError("Please enter a website URL")
      return
    }
    
    // Basic URL validation
    try {
      const urlToTest = url.startsWith('http') ? url : `https://${url}`;
      new URL(urlToTest);
      onAnalyze(urlToTest, description);
    } catch (e) {
      setError("Please enter a valid URL")
    }
  }

  return (
    <div className="relative py-12 md:py-20 overflow-hidden bg-[var(--cloud)]">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ff7a59]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#ff7a59]/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff7a59]/10 border border-[#ff7a59]/20 text-[#ff7a59] text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered ICP Discovery
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold text-[var(--night)] mb-6 tracking-tight">
            AI ICP Generator
          </h1>
          <p className="text-lg md:text-xl text-[var(--steel)] mb-8 max-w-2xl mx-auto">
            Analyze your business website and generate a smart, editable ideal customer profile in minutes.
          </p>
        </div>

        <Card className="card max-w-2xl mx-auto overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div className="field">
                <Label htmlFor="url" className="field-label">
                  WEBSITE URL <span className="text-[#ff7a59]">*</span>
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--steel)]">
                    <Globe className="w-5 h-5" />
                  </div>
                  <Input
                    id="url"
                    type="text"
                    placeholder="example.com"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value)
                      if (error) setError("")
                    }}
                    className={`input pl-10 h-12 w-full ${error ? 'border-red-400 focus:border-red-400' : ''}`}
                  />
                </div>
                {error && (
                  <p className="text-xs text-[#ef4444] font-bold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                  </p>
                )}
              </div>

              <div className="field">
                <Label htmlFor="description" className="field-label">
                  BUSINESS CONTEXT (OPTIONAL)
                </Label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-center pointer-events-none text-[var(--steel)]">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <textarea
                    id="description"
                    placeholder="Briefly describe what you do, who you serve, and your core offering..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="textarea w-full pl-10 pr-4 py-3 min-h-[100px]"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="btn-primary w-full h-12 text-lg"
                >
                  {isLoading ? "Analyzing Website..." : "Analyze Business"}
                </Button>
                
                <div className="flex flex-col items-center gap-4">
                  <p className="text-xs text-[var(--steel)]">
                    Takes around 10–20 seconds • AI extracts positioning & audience signals
                  </p>
                  
                  <button
                    type="button"
                    onClick={onManualMode}
                    className="text-sm text-[var(--steel)] hover:text-[#ff7a59] transition-colors underline underline-offset-4"
                  >
                    I don't have a website (Manual entry)
                  </button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
