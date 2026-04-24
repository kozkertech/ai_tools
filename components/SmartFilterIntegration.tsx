import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Sparkles,
  Search,
  Wand2,
  Target,
  Zap,
  TrendingUp,
  CheckCircle,
  ArrowDown,
  Brain,
  Rocket,
  BarChart3,
  X,
  XCircle,
  Loader2
} from 'lucide-react'

interface SmartFilterIntegrationProps {
  tools: any[]
  onFilterApply: (category: string, solution: string, searchTerm: string, specificToolIds?: string[]) => void
  currentCategory: string
  currentSolution: string
}

interface QuickStartOption {
  id: string
  title: string
  description: string
  icon: any
  category: string
  solution: string
  gradient: string
  count: number
}

// Webhook response interface - Updated to handle multiple response formats
interface WebhookResponse {
  success?: boolean
  matchedTools?: string[]
  confidence?: number
  reasoning?: string
  error?: string
  message?: string
  // Additional fields to handle different response formats
  data?: any
  results?: string[]
  tools?: string[]
  text?: string  // For responses with nested JSON in text field
}

export default function SmartFilterIntegration({ 
  tools, 
  onFilterApply, 
  currentCategory, 
  currentSolution 
}: SmartFilterIntegrationProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [appliedFilter, setAppliedFilter] = useState<{
    title: string
    category: string
    solution: string
    count: number
    isIntelligent: boolean
    confidence?: number
    reasoning?: string
  } | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<WebhookResponse | null>(null)

  // Quick start options with dynamic tool counts
  const quickStartOptions: QuickStartOption[] = [
    {
      id: 'new-business',
      title: 'Starting a New Business',
      description: 'Domain, branding, and planning essentials',
      icon: Rocket,
      category: 'Branding',
      solution: 'LaunchPad',
      gradient: 'from-blue-500 to-cyan-500',
      count: tools.filter(t => t.category === 'Branding' && t.solution === 'LaunchPad').length
    },
    {
      id: 'marketing-boost',
      title: 'Marketing & Growth',
      description: 'Social media, email, and content tools',
      icon: TrendingUp,
      category: 'Marketing',
      solution: 'GrowthSuite',
      gradient: 'from-purple-500 to-pink-500',
      count: tools.filter(t => t.category === 'Marketing' && t.solution === 'GrowthSuite').length
    },
    {
      id: 'content-creation',
      title: 'Content Creation',
      description: 'Blog posts, copy, and creative content',
      icon: Wand2,
      category: 'Content',
      solution: 'All',
      gradient: 'from-green-500 to-emerald-500',
      count: tools.filter(t => t.category === 'Content').length
    },
    {
      id: 'business-analytics',
      title: 'Analytics & Data',
      description: 'Business intelligence and reporting',
      icon: BarChart3,
      category: 'Analytics',
      solution: 'All',
      gradient: 'from-orange-500 to-red-500',
      count: tools.filter(t => t.category === 'Analytics').length
    }
  ]

  const handleQuickStart = (option: QuickStartOption) => {
    setError(null)
    setAppliedFilter({
      title: option.title,
      category: option.category,
      solution: option.solution,
      count: option.count,
      isIntelligent: false
    })
    
    // Regular category filtering for quick start
    onFilterApply(option.category, option.solution, option.title)
    showSuccessNotification()
  }

  // AI-powered search using webhook - Enhanced with better error handling
  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    setError(null)
    setResponse(null)
    setAppliedFilter(null)

    try {
      const payload = {
        userQuery: searchQuery,
        tools: tools.map(tool => ({
          id: tool.id,
          name: tool.name,
          description: tool.description,
          category: tool.category,
          solution: tool.solution,
          keywords: tool.keywords,
          useCases: tool.useCases
        })),
        timestamp: new Date().toISOString()
      }

      const webhookResponse = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/tool-matcher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!webhookResponse.ok) throw new Error(`HTTP error! status: ${webhookResponse.status}`)

      const responseText = await webhookResponse.text()
      let data: WebhookResponse | null = null
      let matchingToolIds: string[] = []

      try {
        const parsed = JSON.parse(responseText)
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].text) {
          const toolIds = JSON.parse(parsed[0].text)
          if (Array.isArray(toolIds)) {
            matchingToolIds = toolIds
            data = {
              success: true,
              matchedTools: toolIds,
              confidence: 0.9,
              reasoning: `AI found ${toolIds.length} tools matching your search criteria`
            }
          }
        } else {
          data = parsed
          matchingToolIds = data?.matchedTools || data?.results || data?.tools || []
        }
      } catch (error) {
        throw new Error('Invalid JSON response from webhook')
      }

      if (!data) throw new Error('Invalid response format from webhook')

      setResponse(data)

      if (matchingToolIds.length > 0) {
        const validToolIds = matchingToolIds.filter(id => tools.some(tool => tool.id === id))
        if (validToolIds.length === 0) throw new Error('No valid tool matches found')

        const matchedToolObjects = tools.filter(tool => validToolIds.includes(tool.id))
        const categories = matchedToolObjects.map(t => t.category)
        const solutions = matchedToolObjects.map(t => t.solution)
        const mostCommonCategory = getMostCommon(categories) || 'All'
        const mostCommonSolution = getMostCommon(solutions) || 'All'
        
        setAppliedFilter({
          title: searchQuery,
          category: mostCommonCategory,
          solution: mostCommonSolution,
          count: validToolIds.length,
          isIntelligent: true,
          confidence: data.confidence || 0.9,
          reasoning: data.reasoning || `AI found ${validToolIds.length} tools matching your search criteria`
        })
        
        onFilterApply(mostCommonCategory, mostCommonSolution, searchQuery, validToolIds)
        showSuccessNotification()
      } else {
        handleLocalFallbackSearch(searchQuery)
      }
      setSearchQuery('')
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while analyzing your search")
      handleLocalFallbackSearch(searchQuery)
    } finally {
      setIsSearching(false)
    }
  }

  const handleLocalFallbackSearch = (query: string) => {
    const queryLower = query.toLowerCase()
    const matchedTools = tools.filter(tool => 
      tool.name.toLowerCase().includes(queryLower) ||
      tool.description.toLowerCase().includes(queryLower) ||
      tool.keywords.some((keyword: string) => keyword.toLowerCase().includes(queryLower)) ||
      tool.useCases.some((useCase: string) => useCase.toLowerCase().includes(queryLower))
    )

    if (matchedTools.length > 0) {
      const categories = matchedTools.map(t => t.category)
      const solutions = matchedTools.map(t => t.solution)
      const mostCommonCategory = getMostCommon(categories) || 'All'
      const mostCommonSolution = getMostCommon(solutions) || 'All'

      setAppliedFilter({
        title: `${query} (local search)`,
        category: mostCommonCategory,
        solution: mostCommonSolution,
        count: matchedTools.length,
        isIntelligent: false
      })
      onFilterApply(mostCommonCategory, mostCommonSolution, query, matchedTools.map(t => t.id))
    } else {
      setAppliedFilter({
        title: `${query} (no matches)`,
        category: 'All',
        solution: 'All',
        count: tools.length,
        isIntelligent: false
      })
      onFilterApply('All', 'All', query)
    }
    showSuccessNotification()
  }

  const showSuccessNotification = () => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 4000)
    setTimeout(() => {
      const filterSection = document.getElementById('filter-section')
      if (filterSection) filterSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 1000)
  }

  const getMostCommon = (array: string[]): string | null => {
    if (array.length === 0) return null
    const counts = array.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return Object.entries(counts).reduce((a, b) => counts[a[0]] > counts[b[1]] ? a : b)[0] || null
  }

  const clearAppliedFilter = () => {
    setAppliedFilter(null)
    setSearchQuery('')
    setError(null)
    setResponse(null)
    onFilterApply('All', 'All', '', [])
  }

  const isFilterActive = appliedFilter && (currentCategory !== 'All' || currentSolution !== 'All')

  return (
    <div className="relative">
      <section className="py-20 px-4 bg-[var(--cloud)] border-b border-[var(--iron)] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#ff7a59]/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/4 h-64 bg-gradient-to-tr from-[#ff7a59]/5 to-transparent blur-3xl pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#ff7a59]/10 text-[#ff7a59] px-5 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest mb-6 border border-[#ff7a59]/20">
              <Brain className="w-4 h-4" />
              Intelligence Nexus
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 tracking-tight text-[var(--night)]">
              Find Your Perfect <span className="text-[#ff7a59]">Tools</span> Instantly
            </h2>
            <p className="text-lg md:text-xl text-[var(--steel)] max-w-2xl mx-auto leading-relaxed">
              Describe your specific business challenges. Our AI will analyze all tools to suggest the most effective executive protocol.
            </p>
          </div>

          <div className="space-y-8">
            {error && (
              <div className="max-w-2xl mx-auto">
                <Alert className="bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-800 animate-fade-in">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-700 dark:text-red-100">
                    {error}
                    <div className="mt-2 text-xs text-red-600">
                      Don't worry - we've fallen back to local search to help you find relevant tools.
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {isFilterActive && appliedFilter && (
              <div className="max-w-2xl mx-auto">
                <Card className="bg-[var(--mist)] border-[#ff7a59]/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-[var(--night)]">
                              {appliedFilter.isIntelligent ? 'AI-Powered' : 'Smart'} protocol applied
                            </p>
                            {appliedFilter.isIntelligent && (
                              <Badge className="bg-green-100 text-green-800 text-[10px] font-bold">
                                <Sparkles className="w-3 h-3 mr-1" />
                                AI MATCHED
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-[var(--steel)]">
                            {appliedFilter.isIntelligent 
                              ? `Analysis found ${appliedFilter.count} relevant tools for "${appliedFilter.title}"`
                              : `Showing ${appliedFilter.count} tools for your search`
                            }
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full hover:bg-[var(--iron)]" onClick={clearAppliedFilter}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] mb-12 text-center text-[var(--night)] opacity-60">SELECT DISCOVERY PROTOCOL</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickStartOptions.map((option) => {
                  const IconComponent = option.icon
                  const isActive = currentCategory === option.category && 
                    (option.solution === 'All' || currentSolution === option.solution) &&
                    (!appliedFilter?.isIntelligent)
                  
                  return (
                    <Card 
                      key={option.id}
                      className={`card group cursor-pointer transition-all duration-500 border-[var(--iron)] hover:-translate-y-2 relative overflow-hidden ${
                        isActive ? 'border-[#ff7a59] bg-[#ff7a59]/5' : 'bg-[var(--mist)]'
                      }`}
                      onClick={() => handleQuickStart(option)}
                    >
                      <CardContent className="p-8 text-center flex flex-col items-center">
                        <div className={`w-16 h-16 mb-8 rounded-2xl bg-[var(--cloud)] border border-[var(--iron)] flex items-center justify-center transition-all duration-500 shadow-sm group-hover:border-[#ff7a59]/30 group-hover:shadow-[#ff7a59]/10 group-hover:scale-110`}>
                          <IconComponent className={`w-8 h-8 transition-colors duration-500 ${isActive ? 'text-[#ff7a59]' : 'text-[var(--night)] group-hover:text-[#ff7a59]'}`} />
                        </div>
                        <h4 className={`font-semibold text-xl mb-4 tracking-tight transition-colors duration-300 ${isActive ? 'text-[#ff7a59]' : 'text-[var(--night)] group-hover:text-[#ff7a59]'}`}>
                          {option.title}
                        </h4>
                        <p className="text-sm text-[var(--steel)] mb-8 font-medium leading-relaxed">
                          {option.description}
                        </p>
                        <Badge 
                            variant="secondary"
                            className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all duration-500 ${
                                isActive 
                                ? "bg-[#ff7a59] text-white border-[#ff7a59]" 
                                : "bg-[var(--cloud)] text-[var(--steel)] border-[var(--iron)] group-hover:border-[#ff7a59]/50 group-hover:text-[#ff7a59]"
                            }`}
                        >
                          {option.count} TOOLS
                        </Badge>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            <div className="relative py-12">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[var(--iron)] border-dashed opacity-50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-[var(--cloud)] px-10 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--steel)]">
                  OR DEFINE CUSTOM MANIFEST
                </span>
              </div>
            </div>

            <div className="max-w-3xl mx-auto">
              <Card className="card p-2 bg-[var(--mist)] border-[var(--iron)] shadow-2xl">
                <CardContent className="p-0">
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 transform -translate-y-1/2 flex items-center gap-3 z-20">
                      <Search className={`w-6 h-6 transition-colors duration-300 ${isSearching ? 'text-[#ff7a59]' : 'text-[var(--steel)]'}`} />
                      {isSearching && (
                        <div className="flex space-x-1.5">
                          <div className="w-1.5 h-1.5 bg-[#ff7a59] rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-[#ff7a59] rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                          <div className="w-1.5 h-1.5 bg-[#ff7a59] rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                        </div>
                      )}
                    </div>
                    <Input
                      placeholder="Describe your business needs (e.g. 'help me launch a coffee shop')..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !isSearching && handleSearch()}
                      className="pl-20 pr-48 h-20 text-xl font-medium bg-transparent border-0 ring-0 focus-visible:ring-0 placeholder:text-[var(--steel)]/40 text-[var(--night)]"
                      disabled={isSearching}
                    />
                    <Button
                      onClick={handleSearch}
                      disabled={!searchQuery.trim() || isSearching}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-14 px-8 btn-primary rounded-xl text-lg font-bold"
                    >
                      {isSearching ? (
                        <>
                          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                          ANALYZING...
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          AI SEARCH
                        </div>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <div className="flex items-center justify-center gap-2 mt-8 text-[var(--steel)] opacity-70">
                <Brain className="w-4 h-4 text-[#ff7a59]" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Predictive tool mapping enabled</span>
              </div>
            </div>
          </div>

          {showSuccess && (
            <div className="flex justify-center mt-12 animate-bounce">
              <div className="flex items-center gap-2 text-[#ff7a59]">
                <ArrowDown className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Intelligence results generated below
                </span>
                <ArrowDown className="w-5 h-5" />
              </div>
            </div>
          )}
        </div>
      </section>

      {showSuccess && appliedFilter && (
        <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-right duration-500">
          <Card className="bg-[var(--cloud)] border-[#ff7a59]/30 shadow-2xl border-l-4 border-l-[#ff7a59]">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#ff7a59]/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#ff7a59]" />
              </div>
              <div>
                <p className="font-bold text-[var(--night)] tracking-tight">
                  {appliedFilter.isIntelligent ? 'AI ANALYSIS COMPLETE' : 'PROTOCOL ACTIVATED'}
                </p>
                <p className="text-sm text-[var(--steel)]">
                  {appliedFilter.count} tools matched your profile
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
