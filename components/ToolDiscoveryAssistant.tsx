import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
  X
} from 'lucide-react'
import ToolMatchingEngine from '@/lib/ToolMatchingEngine'

interface SmartFilterIntegrationProps {
  tools: any[]
  onFilterApply: (category: string, solution: string, searchTerm: string) => void
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
  color: string
  count: number
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
  } | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  // Quick start options with dynamic tool counts
  const quickStartOptions: QuickStartOption[] = [
    {
      id: 'new-business',
      title: 'Starting a New Business',
      description: 'Domain, branding, and planning essentials',
      icon: Rocket,
      category: 'Branding',
      solution: 'LaunchPad',
      color: '#ff7a59',
      count: tools.filter(t => t.category === 'Branding' && t.solution === 'LaunchPad').length
    },
    {
      id: 'marketing-boost',
      title: 'Marketing & Growth',
      description: 'Social media, email, and content tools',
      icon: TrendingUp,
      category: 'Marketing',
      solution: 'GrowthSuite',
      color: '#8b5cf6',
      count: tools.filter(t => t.category === 'Marketing' && t.solution === 'GrowthSuite').length
    },
    {
      id: 'content-creation',
      title: 'Content Creation',
      description: 'Blog posts, copy, and creative content',
      icon: Wand2,
      category: 'Content',
      solution: 'All',
      color: '#10b981',
      count: tools.filter(t => t.category === 'Content').length
    },
    {
      id: 'business-analytics',
      title: 'Analytics & Data',
      description: 'Business intelligence and reporting',
      icon: BarChart3,
      category: 'Analytics',
      solution: 'All',
      color: '#3b82f6',
      count: tools.filter(t => t.category === 'Analytics').length
    }
  ]

  const matchingEngine = new ToolMatchingEngine(tools)

  const handleQuickStart = (option: QuickStartOption) => {
    setAppliedFilter({
      title: option.title,
      category: option.category,
      solution: option.solution,
      count: option.count
    })
    
    onFilterApply(option.category, option.solution, option.title)
    showSuccessNotification()
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    
    setTimeout(() => {
      const results = matchingEngine.findBestMatches(searchQuery)
      
      if (results.primary.length > 0) {
        // Find the most common category and solution from results
        const categories = results.primary.map(r => r.tool.category)
        const solutions = results.primary.map(r => r.tool.solution)
        
        const mostCommonCategory = getMostCommon(categories) || 'All'
        const mostCommonSolution = getMostCommon(solutions) || 'All'
        
        // Count matching tools
        const matchingCount = tools.filter(tool => {
          const categoryMatch = mostCommonCategory === 'All' || tool.category === mostCommonCategory
          const solutionMatch = mostCommonSolution === 'All' || tool.solution === mostCommonSolution
          return categoryMatch && solutionMatch
        }).length

        setAppliedFilter({
          title: searchQuery,
          category: mostCommonCategory,
          solution: mostCommonSolution,
          count: matchingCount
        })
        
        onFilterApply(mostCommonCategory, mostCommonSolution, searchQuery)
      } else {
        // No specific matches, show all tools
        setAppliedFilter({
          title: `${searchQuery} (showing all tools)`,
          category: 'All',
          solution: 'All',
          count: tools.length
        })
        
        onFilterApply('All', 'All', searchQuery)
      }
      
      setIsSearching(false)
      showSuccessNotification()
    }, 1200)
  }

  const showSuccessNotification = () => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 4000)
    
    // Scroll to filter section after a short delay
    setTimeout(() => {
      const filterSection = document.getElementById('filter-section')
      if (filterSection) {
        filterSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 1000)
  }

  const getMostCommon = (array: string[]): string | null => {
    if (array.length === 0) return null
    const counts = array.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return Object.entries(counts).reduce((a, b) => 
      counts[a[0]] > counts[b[1]] ? a : b
    )[0] || null
  }

  const clearAppliedFilter = () => {
    setAppliedFilter(null)
    setSearchQuery('')
    onFilterApply('All', 'All', '')
  }

  // Check if current filters match applied filter
  const isFilterActive = appliedFilter && 
    (currentCategory !== 'All' || currentSolution !== 'All')

  return (
    <div className="relative">
      {/* Main Assistant Section */}
      <section className="py-24 px-4 bg-[var(--cloud)] border-b border-[var(--iron)]">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#ff7a59]/10 text-[#ff7a59] px-4 py-2 rounded-full border border-[#ff7a59]/20 text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-4 h-4" />
              Smart Tool Discovery
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--night)] tracking-tight">
              What are you building today?
            </h2>
            <p className="text-lg text-[var(--steel)] max-w-2xl mx-auto leading-relaxed">
              Describe your needs or select a quick-start pathway. We'll automatically build your personalized tool kit.
            </p>
          </div>

          <div className="space-y-12">
            {/* Applied Filter Indicator */}
            {isFilterActive && appliedFilter && (
              <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4">
                <Card className="bg-[#10b981]/5 border-[#10b981]/20 shadow-sm rounded-2xl overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#10b981]/10 rounded-full flex items-center justify-center border border-[#10b981]/20">
                          <CheckCircle className="w-5 h-5 text-[#10b981]" />
                        </div>
                        <div>
                          <p className="font-bold text-[var(--night)] leading-tight">
                            Smart filter applied for "{appliedFilter.title}"
                          </p>
                          <p className="text-xs text-[var(--steel)] font-medium mt-1">
                            Showing {appliedFilter.count} tools • {appliedFilter.category} → {appliedFilter.solution}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={clearAppliedFilter} className="hover:bg-[#10b981]/10 text-[#10b981]">
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Quick Start Cards */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickStartOptions.map((option) => {
                  const IconComponent = option.icon
                  const isActive = currentCategory === option.category && 
                    (option.solution === 'All' || currentSolution === option.solution)
                  
                  return (
                    <Card 
                      key={option.id}
                      className={`card border-[var(--iron)] bg-white group cursor-pointer hover:border-[#ff7a59]/40 hover:shadow-xl transition-all duration-500 overflow-hidden relative ${
                        isActive ? 'ring-2 ring-[#ff7a59] border-[#ff7a59]/40 shadow-lg' : ''
                      }`}
                      onClick={() => handleQuickStart(option)}
                    >
                      <CardContent className="p-8 text-center relative flex flex-col h-full">
                        <div 
                          className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm relative overflow-hidden"
                          style={{ backgroundColor: `${option.color}10`, border: `1px solid ${option.color}20` }}
                        >
                          <IconComponent className="w-8 h-8 relative z-10" style={{ color: option.color }} />
                        </div>
                        <h4 className="font-bold text-lg mb-3 text-[var(--night)] group-hover:text-[#ff7a59] transition-colors leading-tight">
                          {option.title}
                        </h4>
                        <p className="text-sm text-[var(--steel)] mb-6 flex-grow leading-relaxed">
                          {option.description}
                        </p>
                        <div className="flex items-center justify-center">
                          <Badge variant={isActive ? "default" : "outline"} className={`tag ${isActive ? "bg-[#ff7a59] text-white border-0" : "!bg-[var(--mist)] !text-[var(--steel)] !border-[var(--iron)]"}`}>
                            {option.count} tools
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[var(--iron)]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[var(--cloud)] px-8 text-[10px] font-bold text-[var(--steel)] uppercase tracking-[0.2em]">
                  Or describe your needs
                </span>
              </div>
            </div>

            {/* Smart Search */}
            <div className="max-w-3xl mx-auto">
              <Card className="card border-[var(--iron)] bg-white shadow-xl overflow-hidden p-2">
                <CardContent className="p-4">
                  <div className="relative flex items-center">
                    <div className="absolute left-4 z-10 flex items-center gap-3">
                      <Search className="w-5 h-5 text-[var(--steel)]" />
                      {isSearching && (
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-[#ff7a59] rounded-full animate-bounce" />
                          <div className="w-1 h-1 bg-[#ff7a59] rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                          <div className="w-1 h-1 bg-[#ff7a59] rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                        </div>
                      )}
                    </div>
                    <Input
                      placeholder="e.g. 'I need help with my email marketing and building a brand'"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-14 pr-32 h-16 text-base bg-transparent border-0 focus-visible:ring-0 text-[var(--night)] placeholder:text-[var(--iron)]"
                      disabled={isSearching}
                    />
                    <Button
                      onClick={handleSearch}
                      disabled={!searchQuery.trim() || isSearching}
                      className="absolute right-2 h-12 px-6 btn btn-primary"
                    >
                      {isSearching ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Analyzing...
                        </div>
                      ) : (
                        'Build Kit'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <div className="flex items-center justify-center gap-2 mt-6">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-[var(--iron)]" />
                    ))}
                </div>
                <p className="text-xs text-[var(--steel)] font-medium">
                  Join 2,000+ business owners using AI to scale
                </p>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          {showSuccess && (
            <div className="flex justify-center mt-12 animate-bounce">
              <div className="flex items-center gap-3 text-[#ff7a59]">
                <ArrowDown className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-widest">Results Loaded Below</span>
                <ArrowDown className="w-5 h-5" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Success Notification */}
      {showSuccess && appliedFilter && (
        <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right duration-500">
          <Card className="bg-white border-[#10b981]/30 shadow-2xl rounded-2xl overflow-hidden border-l-4 border-l-[#10b981]">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-[#10b981]/10 rounded-full flex items-center justify-center border border-[#10b981]/20">
                <CheckCircle className="w-6 h-6 text-[#10b981]" />
              </div>
              <div>
                <p className="font-bold text-[var(--night)] leading-tight">
                  Kozker AI Intelligence
                </p>
                <p className="text-xs text-[var(--steel)] font-medium mt-1">
                  Found {appliedFilter.count} tools matched to your profile
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
