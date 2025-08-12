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

  // Enhanced webhook response parser for multiple response formats
  const parseWebhookResponse = (responseText: string): WebhookResponse | null => {
    try {
      // First, try to parse as direct JSON
      const parsed = JSON.parse(responseText)
      console.log('Parsed webhook response structure:', parsed)
      
      // Handle the specific format: [{ "text": "[\"tool1\", \"tool2\"]" }]
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].text) {
        console.log('Detected array format with text property')
        try {
          // Parse the nested JSON string in the text field
          const toolIds = JSON.parse(parsed[0].text)
          console.log('Extracted tool IDs from text field:', toolIds)
          
          if (Array.isArray(toolIds)) {
            return {
              success: true,
              matchedTools: toolIds,
              confidence: 0.9,
              reasoning: `Found ${toolIds.length} tools matching your search criteria`
            }
          }
        } catch (textParseError) {
          console.error('Error parsing text field:', textParseError)
        }
      }
      
      // Handle direct response format
      return parsed
    } catch (error) {
      console.error('JSON parse error:', error)
      
      // Try to extract JSON from malformed response
      try {
        // Look for array pattern like ["tool1", "tool2"] anywhere in the response
        const arrayMatch = responseText.match(/\["[^"]+"\s*(?:,\s*"[^"]+"\s*)*\]/)
        if (arrayMatch) {
          console.log('Found array pattern in response:', arrayMatch[0])
          const toolIds = JSON.parse(arrayMatch[0])
          return {
            success: true,
            matchedTools: toolIds,
            confidence: 0.8,
            reasoning: `Extracted ${toolIds.length} tools from response`
          }
        }
        
        // Look for JSON-like structure in the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const cleanedJson = jsonMatch[0].replace(/\}.*$/, '}') // Remove trailing content
          return JSON.parse(cleanedJson)
        }
        
      } catch (secondError) {
        console.error('Secondary parse error:', secondError)
      }
      
      return null
    }
  }

  // Extract tool IDs from various response formats
  const extractToolIds = (data: WebhookResponse): string[] => {
    console.log('Extracting tool IDs from data:', data)
    
    // Try different possible field names for matched tools
    if (data.matchedTools && Array.isArray(data.matchedTools)) {
      console.log('Found matchedTools array:', data.matchedTools)
      return data.matchedTools
    }
    if (data.results && Array.isArray(data.results)) {
      console.log('Found results array:', data.results)
      return data.results
    }
    if (data.tools && Array.isArray(data.tools)) {
      console.log('Found tools array:', data.tools)
      return data.tools
    }
    if (data.data && Array.isArray(data.data)) {
      console.log('Found data array:', data.data)
      return data.data
    }
    
    // Handle nested data structures
    if (data.data && data.data.matchedTools && Array.isArray(data.data.matchedTools)) {
      console.log('Found nested matchedTools array:', data.data.matchedTools)
      return data.data.matchedTools
    }
    
    // Handle text field with JSON string (for the specific webhook format)
    if (data.text && typeof data.text === 'string') {
      try {
        console.log('Found text field, attempting to parse:', data.text)
        const parsed = JSON.parse(data.text)
        if (Array.isArray(parsed)) {
          console.log('Successfully parsed tool IDs from text field:', parsed)
          return parsed
        }
      } catch (error) {
        console.error('Error parsing text field:', error)
      }
    }
    
    // Handle case where the entire response is an array of tool IDs
    if (Array.isArray(data)) {
      console.log('Data is an array, checking if it contains tool IDs:', data)
      // Check if all items in the array are strings (likely tool IDs)
      if (data.every(item => typeof item === 'string')) {
        console.log('Array contains tool IDs:', data)
        return data
      }
    }
    
    console.log('No tool IDs found in response data')
    return []
  }

  // AI-powered search using webhook - Enhanced with better error handling
  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    setError(null)
    setResponse(null)
    setAppliedFilter(null)

    try {
      // Prepare payload for AI analysis
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

      console.log('Sending payload:', payload)

      const webhookResponse = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/tool-matcher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!webhookResponse.ok) {
        throw new Error(`HTTP error! status: ${webhookResponse.status}`)
      }

      // Get response as text first for better debugging
      const responseText = await webhookResponse.text()
      console.log('Raw webhook response:', responseText)

      // Parse the response - handle the specific format [{"text": "[\"tool1\", \"tool2\"]"}]
      let data: WebhookResponse | null = null
      let matchingToolIds: string[] = []

      try {
        const parsed = JSON.parse(responseText)
        console.log('Parsed webhook response structure:', parsed)
        
        // Handle the specific format: [{ "text": "[\"tool1\", \"tool2\"]" }]
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].text) {
          console.log('Detected array format with text property')
          try {
            // Parse the nested JSON string in the text field
            const toolIds = JSON.parse(parsed[0].text)
            console.log('Extracted tool IDs from text field:', toolIds)
            
            if (Array.isArray(toolIds)) {
              matchingToolIds = toolIds
              data = {
                success: true,
                matchedTools: toolIds,
                confidence: 0.9,
                reasoning: `AI found ${toolIds.length} tools matching your search criteria`
              }
            }
          } catch (textParseError) {
            console.error('Error parsing text field:', textParseError)
            throw new Error('Invalid tool IDs format in webhook response')
          }
        }
        // Handle other response formats
        else {
          data = parsed
          matchingToolIds = extractToolIds(data)
        }
      } catch (error) {
        console.error('Failed to parse webhook response:', error)
        throw new Error('Invalid JSON response from webhook')
      }

      if (!data) {
        throw new Error('Invalid response format from webhook')
      }

      setResponse(data)
      console.log('Final extracted tool IDs:', matchingToolIds)

      if (matchingToolIds.length > 0) {
        console.log('Processing', matchingToolIds.length, 'tool IDs from webhook')
        
        // Validate tool IDs exist in our tools array
        const validToolIds = matchingToolIds.filter(id => {
          const toolExists = tools.some(tool => tool.id === id)
          console.log(`Tool ID "${id}": ${toolExists ? 'EXISTS' : 'NOT FOUND'}`)
          return toolExists
        })
        
        console.log('Valid tool IDs after validation:', validToolIds)
        
        if (validToolIds.length === 0) {
          console.error('No valid tool matches found')
          throw new Error('No valid tool matches found in your tools database')
        }

        // Find the matched tool objects for category/solution determination
        const matchedToolObjects = tools.filter(tool => validToolIds.includes(tool.id))
        console.log('Matched tool objects:', matchedToolObjects.map(t => t.name))
        
        const categories = matchedToolObjects.map(t => t.category)
        const solutions = matchedToolObjects.map(t => t.solution)
        
        const mostCommonCategory = getMostCommon(categories) || 'All'
        const mostCommonSolution = getMostCommon(solutions) || 'All'
        
        console.log('Determined category:', mostCommonCategory, 'solution:', mostCommonSolution)
        
        setAppliedFilter({
          title: searchQuery,
          category: mostCommonCategory,
          solution: mostCommonSolution,
          count: validToolIds.length,
          isIntelligent: true,
          confidence: data.confidence || 0.9,
          reasoning: data.reasoning || `AI found ${validToolIds.length} tools matching your search criteria`
        })
        
        console.log('Applying intelligent filter with tool IDs:', validToolIds)
        
        // IMPORTANT: Pass specific tool IDs for intelligent filtering
        onFilterApply(mostCommonCategory, mostCommonSolution, searchQuery, validToolIds)
        
        showSuccessNotification()
      } else {
        console.log('No specific tool IDs found, falling back to local search')
        // No specific matches but response was successful
        handleLocalFallbackSearch(searchQuery)
      }

      // Clear search query after successful search
      setSearchQuery('')

    } catch (err) {
      console.error('Webhook error:', err)
      setError(err instanceof Error ? err.message : "An error occurred while analyzing your search")
      
      // Fallback to local search if webhook fails
      console.log('Falling back to local search')
      handleLocalFallbackSearch(searchQuery)
    } finally {
      setIsSearching(false)
    }
  }

  // Fallback search function if webhook fails
  const handleLocalFallbackSearch = (query: string) => {
    console.log('Performing local search for:', query)
    const queryLower = query.toLowerCase()
    const matchedTools = tools.filter(tool => 
      tool.name.toLowerCase().includes(queryLower) ||
      tool.description.toLowerCase().includes(queryLower) ||
      tool.keywords.some((keyword: string) => keyword.toLowerCase().includes(queryLower)) ||
      tool.useCases.some((useCase: string) => useCase.toLowerCase().includes(queryLower))
    )

    console.log('Local search results:', matchedTools.length, 'tools found')

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
    setError(null)
    setResponse(null)
    onFilterApply('All', 'All', '', []) // Clear intelligent filter
  }

  // Check if current filters match applied filter
  const isFilterActive = appliedFilter && 
    (currentCategory !== 'All' || currentSolution !== 'All')

  return (
    <div className="relative">
      {/* Main Assistant Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-900 dark:to-blue-950/50">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Brain className="w-4 h-4" />
              AI-Powered Tool Discovery
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Find Your Perfect Tools Instantly
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Click a category below or describe your specific needs. Our AI will analyze all 22 tools to find the most relevant matches.
            </p>
          </div>

          <div className="space-y-8">
            {/* Error Display */}
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

            {/* Test Response Format - Development Only */}
            {process.env.NODE_ENV === 'development' && (
              <div className="max-w-2xl mx-auto">
                <Alert className="bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-800">
                  <AlertDescription className="text-yellow-700 dark:text-yellow-100">
                    <details>
                      <summary className="cursor-pointer font-medium hidden">🧪 Dev Tools: Test Response Parsing</summary>
                      <div className="mt-2 text-xs space-y-2">
                        <div>
                          <label className="block font-medium mb-1 hidden">Test Response Format:</label>
                          <div className="space-y-2">
                            <button 
                              onClick={() => {
                                const testResponse = `[{"text": "[\\"customer-persona-generator\\", \\"faq-builder\\", \\"logo-color-picker\\"]"}]`
                                console.log('🧪 Testing your webhook response format:', testResponse)
                                
                                // Simulate the webhook call
                                setSearchQuery('test search')
                                setIsSearching(true)
                                
                                setTimeout(() => {
                                  try {
                                    const parsed = JSON.parse(testResponse)
                                    const toolIds = JSON.parse(parsed[0].text)
                                    
                                    console.log('🧪 Parsed tool IDs:', toolIds)
                                    
                                    // Find matching tools
                                    const matchedTools = tools.filter(t => toolIds.includes(t.id))
                                    console.log('🧪 Matched tools:', matchedTools.map(t => t.name))
                                    
                                    // Apply the filter
                                    onFilterApply('All', 'All', 'test search', toolIds)
                                    
                                    setAppliedFilter({
                                      title: 'test search',
                                      category: 'All',
                                      solution: 'All',
                                      count: toolIds.length,
                                      isIntelligent: true,
                                      confidence: 0.9,
                                      reasoning: `Test: Found ${toolIds.length} tools`
                                    })
                                    
                                    showSuccessNotification()
                                    
                                  } catch (error) {
                                    console.error('🧪 Test failed:', error)
                                    setError('Test parsing failed: ' + error.message)
                                  }
                                  setIsSearching(false)
                                  setSearchQuery('')
                                }, 1000)
                              }}
                              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                            >
                              🧪 Test Your Webhook Format (3 tools)
                            </button>
                            
                            <button 
                              onClick={() => {
                                // Test with different tool IDs
                                const testResponse = `[{"text": "[\\"domain-name-genie\\", \\"tagline-creator\\"]"}]`
                                console.log('🧪 Testing branding tools format:', testResponse)
                                
                                setSearchQuery('branding test')
                                setIsSearching(true)
                                
                                setTimeout(() => {
                                  try {
                                    const parsed = JSON.parse(testResponse)
                                    const toolIds = JSON.parse(parsed[0].text)
                                    
                                    onFilterApply('All', 'All', 'branding test', toolIds)
                                    
                                    setAppliedFilter({
                                      title: 'branding test',
                                      category: 'All',
                                      solution: 'All',
                                      count: toolIds.length,
                                      isIntelligent: true,
                                      confidence: 0.9,
                                      reasoning: `Test: Found ${toolIds.length} branding tools`
                                    })
                                    
                                    showSuccessNotification()
                                    
                                  } catch (error) {
                                    console.error('🧪 Branding test failed:', error)
                                    setError('Branding test failed: ' + error.message)
                                  }
                                  setIsSearching(false)
                                  setSearchQuery('')
                                }, 1000)
                              }}
                              className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                            >
                              🧪 Test Branding Tools (2 tools)
                            </button>
                            
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                              <strong>Webhook Format:</strong>
                              <pre className="text-xs overflow-x-auto">{`[{"text": "[\\"tool-id-1\\", \\"tool-id-2\\"]"}]`}</pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    </details>
                  </AlertDescription>
                </Alert>
              </div>
            )}
            {response && process.env.NODE_ENV === 'development' && (
              <div className="max-w-2xl mx-auto">
                <Alert className="bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-800">
                  <AlertDescription className="text-blue-700 dark:text-blue-100">
                    <details>
                      <summary className="cursor-pointer font-medium">Debug: Webhook Response</summary>
                      <div className="mt-2 text-xs space-y-2">
                        <div>
                          <strong>Raw Response Type:</strong> {Array.isArray(response) ? 'Array' : typeof response}
                        </div>
                        <div>
                          <strong>Response Structure:</strong>
                          <pre className="mt-1 overflow-auto bg-white dark:bg-gray-800 p-2 rounded">
                            {JSON.stringify(response, null, 2)}
                          </pre>
                        </div>
                        {Array.isArray(response) && response.length > 0 && response[0].text && (
                          <div>
                            <strong>Parsed Tool IDs from text field:</strong>
                            <pre className="mt-1 overflow-auto bg-white dark:bg-gray-800 p-2 rounded">
                              {response[0].text}
                            </pre>
                          </div>
                        )}
                      </div>
                    </details>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Applied Filter Indicator */}
            {isFilterActive && appliedFilter && (
              <div className="max-w-2xl mx-auto">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-primary">
                              {appliedFilter.isIntelligent ? 'AI-Powered' : 'Smart'} filter applied
                            </p>
                            {appliedFilter.isIntelligent && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                <Sparkles className="w-3 h-3 mr-1" />
                                AI Matched
                              </Badge>
                            )}
                            {appliedFilter.confidence && (
                              <Badge variant="outline" className="text-xs">
                                {Math.round(appliedFilter.confidence * 100)}% match
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {appliedFilter.isIntelligent 
                              ? `AI found ${appliedFilter.count} relevant tools for "${appliedFilter.title}"`
                              : `Showing ${appliedFilter.count} tools • ${appliedFilter.category} → ${appliedFilter.solution}`
                            }
                          </p>
                          {appliedFilter.reasoning && (
                            <p className="text-xs text-muted-foreground mt-1 italic">
                              {appliedFilter.reasoning}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={clearAppliedFilter}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Quick Start Cards */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-center">What best describes your current needs?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickStartOptions.map((option) => {
                  const IconComponent = option.icon
                  const isActive = currentCategory === option.category && 
                    (option.solution === 'All' || currentSolution === option.solution) &&
                    (!appliedFilter?.isIntelligent)
                  
                  return (
                    <Card 
                      key={option.id}
                      className={`group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:scale-105 overflow-hidden relative ${
                        isActive ? 'ring-2 ring-primary shadow-lg' : ''
                      }`}
                      onClick={() => handleQuickStart(option)}
                    >
                      {isActive && (
                        <div className="absolute top-3 right-3 z-10">
                          <CheckCircle className="w-5 h-5 text-primary bg-white rounded-full" />
                        </div>
                      )}
                      <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
                        isActive ? 'opacity-5' : ''
                      }`} />
                      <CardContent className="p-6 text-center relative">
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${option.gradient} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                          {option.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {option.description}
                        </p>
                        <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-primary" : "bg-primary/10 text-primary"}>
                          {option.count} tools
                        </Badge>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-dashed" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-900 dark:to-blue-950/50 px-6 text-muted-foreground font-medium">
                  OR DESCRIBE YOUR SPECIFIC NEEDS
                </span>
              </div>
            </div>

            {/* AI-Powered Smart Search */}
            <div className="max-w-2xl mx-auto">
              <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <CardContent className="p-6">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      <Search className="w-5 h-5 text-muted-foreground" />
                      {isSearching && (
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                          <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                          <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                        </div>
                      )}
                    </div>
                    <Input
                      placeholder="Try: 'email marketing automation', 'create professional logo', 'SEO content planning'..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !isSearching && handleSearch()}
                      className="pl-12 pr-32 h-14 text-base bg-transparent border-2 border-gray-100 dark:border-gray-700 focus:border-primary"
                      disabled={isSearching}
                    />
                    <Button
                      onClick={handleSearch}
                      disabled={!searchQuery.trim() || isSearching}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 px-4"
                    >
                      {isSearching ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          AI Analyzing...
                        </>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Sparkles className="w-4 h-4" />
                          AI Search
                        </div>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground text-center mt-3">
                    <Brain className="w-4 h-4 inline mr-1" />
                    AI analyzes all 22 tools to find your perfect matches with confidence scores
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Scroll Indicator */}
          {showSuccess && (
            <div className="flex justify-center mt-8 animate-bounce">
              <div className="flex items-center gap-2 text-primary">
                <ArrowDown className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {appliedFilter?.isIntelligent ? 'AI-matched results below' : 'Filtered results below'}
                </span>
                <ArrowDown className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Success Notification */}
      {showSuccess && appliedFilter && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <Card className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800 shadow-lg">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">
                  {appliedFilter.isIntelligent ? 'AI Analysis Complete!' : 'Filter Applied!'}
                </p>
                <p className="text-sm text-green-600 dark:text-green-300">
                  {appliedFilter.isIntelligent 
                    ? `Found ${appliedFilter.count} perfectly matched tools`
                    : `Found ${appliedFilter.count} tools for "${appliedFilter.title}"`
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
