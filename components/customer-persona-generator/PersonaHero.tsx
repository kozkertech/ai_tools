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
    <div className="relative py-12 md:py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered ICP Discovery
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            AI ICP Generator
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Analyze your business website and generate a smart, editable ideal customer profile in minutes.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto border-white/5 bg-zinc-900/50 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="url" className="text-sm font-medium text-gray-300">
                  Website URL <span className="text-primary">*</span>
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
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
                    className={`pl-10 bg-zinc-800/50 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 focus:ring-primary/20 h-12 ${error ? 'border-red-500/50 focus:border-red-500/50' : ''}`}
                  />
                </div>
                {error && (
                  <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-300">
                  Business Context (Optional)
                </Label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-center pointer-events-none text-gray-500">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <textarea
                    id="description"
                    placeholder="Briefly describe what you do, who you serve, and your core offering..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-white/10 rounded-md text-white placeholder:text-gray-600 focus:border-primary/50 focus:ring-primary/20 outline-none transition-all min-h-[100px] text-sm"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary-dark text-white rounded-lg transition-all shadow-lg shadow-primary/20"
                >
                  {isLoading ? "Analyzing Website..." : "Analyze Business"}
                </Button>
                
                <div className="flex flex-col items-center gap-4">
                  <p className="text-xs text-gray-500">
                    Takes around 10–20 seconds • AI extracts positioning & audience signals
                  </p>
                  
                  <button
                    type="button"
                    onClick={onManualMode}
                    className="text-sm text-gray-400 hover:text-white transition-colors underline underline-offset-4"
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
