"use client"

import type React from "react"
import { useState, useEffect, type FormEvent } from "react"
import {
  Search,
  Globe,
  Mail,
  User,
  Loader2,
  Copy,
  Heart,
  History,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Grid,
  List,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface FormDataState {
  name: string
  email: string
  keywords: string
}

interface DomainAPIResult {
  Domain: string
  Availability: "Available" | "Unavailable"
  registrarUrl?: string
}

type ViewMode = "grid" | "list"
type FilterMode = "all" | "available" | "unavailable"

// Theme-aware color system
const getThemeColors = (isDark: boolean) => ({
  background: isDark ? '#0F172A' : '#F9FAFB',
  cardBackground: isDark ? '#1E293B' : '#FFFFFF',
  headerBackground: isDark ? 'linear-gradient(90deg, #1E293B 0%, #334155 100%)' : 'linear-gradient(90deg, #FFF7ED 0%, #FFF9F6 100%)',
  textPrimary: isDark ? '#F1F5F9' : '#111827',
  textSecondary: isDark ? '#94A3B8' : '#6B7280',
  textTertiary: isDark ? '#64748B' : '#9CA3AF',
  border: isDark ? '#334155' : '#E5E7EB',
  inputBackground: isDark ? '#334155' : '#FFFFFF',
  hoverBackground: isDark ? '#334155' : '#F9FAFB',
  accent: '#FF7435', // Keep brand color consistent
  accentHover: '#E6651E',
  success: isDark ? '#059669' : '#10B981',
  successBackground: isDark ? '#064E3B' : '#D1FAE5',
  successBorder: isDark ? '#047857' : '#A7F3D0',
  error: isDark ? '#DC2626' : '#EF4444',
  errorBackground: isDark ? '#7F1D1D' : '#FEE2E2',
  errorBorder: isDark ? '#B91C1C' : '#FECACA',
})

export default function DomainCheckerPage() {
  const [isDark, setIsDark] = useState(false)
  
  // Detect theme changes from external navbar toggle
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    
    checkTheme() // Initial check
    
    // Watch for theme changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [])
  
  const colors = getThemeColors(isDark)
  
  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    email: "",
    keywords: "",
  })
  const [errors, setErrors] = useState<Partial<FormDataState>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [domainResults, setDomainResults] = useState<DomainAPIResult[]>([])
  const [rawApiResponse, setRawApiResponse] = useState<string>("")
  const [apiError, setApiError] = useState<string>("")

  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [filterMode, setFilterMode] = useState<FilterMode>("all")
  const [searchFilter, setSearchFilter] = useState<string>("")

  const [favorites, setFavorites] = useState<string[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const { toast } = useToast()

  const validateForm = (): boolean => {
    const newErrors: Partial<FormDataState> = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.keywords.trim()) {
      newErrors.keywords = "Keywords/description is required"
    } else if (formData.keywords.trim().length < 10) {
      newErrors.keywords = "Keywords must be at least 10 characters long"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormDataState]) {
      setErrors((prev) => ({ ...prev, [name as keyof FormDataState]: undefined }))
    }
  }

  const filteredDomains = domainResults.filter((domain) => {
    const matchesFilter =
      filterMode === "all" ||
      (filterMode === "available" && domain.Availability === "Available") ||
      (filterMode === "unavailable" && domain.Availability === "Unavailable")
    const matchesSearch = searchFilter === "" || domain.Domain.toLowerCase().includes(searchFilter.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setDomainResults([])
    setRawApiResponse("")
    setApiError("")
    setSearchFilter("")

    try {
      const webhookUrl = "https://n8n.srv832341.hstgr.cloud/webhook/6f7b288e-1efe-4504-a6fd-660931327269"
      const params = new URLSearchParams({
        name: formData.name,
        email: formData.email,
        business: formData.keywords,
      })
      const fullUrl = `${webhookUrl}?${params.toString()}`
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)

      try {
        const res = await fetch(fullUrl, {
          method: "GET",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        })
        clearTimeout(timeoutId)
        const responseText = await res.text()
        setRawApiResponse(responseText)

        if (!res.ok) throw new Error(`API request failed with status ${res.status}: ${responseText.substring(0, 200)}`)
        if (!responseText || responseText.trim() === "") {
          setApiError("The API returned an empty response.")
          toast({ title: "Empty Response", description: "The API returned an empty response.", variant: "warning" })
          return
        }

        const sanitizedResponse = responseText.trim()
        try {
          const parsedJson = JSON.parse(sanitizedResponse)
          let sourceDomainsArray: any[] = []

          if (Array.isArray(parsedJson)) {
            sourceDomainsArray = parsedJson
          } else if (typeof parsedJson === "object" && parsedJson !== null) {
            const keys = Object.keys(parsedJson)
            if (keys.length === 1 && Array.isArray(parsedJson[keys[0]])) {
              sourceDomainsArray = parsedJson[keys[0]]
            } else if ("Domain" in parsedJson && "Availability" in parsedJson) {
              sourceDomainsArray = [parsedJson]
            } else {
              throw new Error("Parsed JSON is an object but not a single domain or a wrapper for a domain array.")
            }
          } else {
            throw new Error("Parsed JSON is not an array or a recognizable object structure.")
          }

          if (sourceDomainsArray.length === 0 && responseText.trim() !== "[]" && responseText.trim() !== "{}") {
            setApiError("API returned data, but no domain entries could be extracted.")
            toast({
              title: "Data Extraction Issue",
              description: "Could not extract domain entries from the response.",
              variant: "warning",
            })
            return
          }

          const validatedAndMappedResults: DomainAPIResult[] = sourceDomainsArray
            .map((item: any) => {
              const domainName = item?.Domain ?? item?.domain ?? item?.name
              const availabilityStatus = item?.Availability ?? item?.availability ?? item?.status
              if (item && typeof item === "object" && domainName && availabilityStatus) {
                return {
                  Domain: String(domainName),
                  Availability: String(availabilityStatus).toLowerCase() === "available" ? "Available" : "Unavailable",
                  registrarUrl:
                    String(availabilityStatus).toLowerCase() === "available"
                      ? `https://www.namecheap.com/domains/registration/results/?domain=${domainName}`
                      : undefined,
                }
              }
              console.warn("Invalid item structure:", item)
              return null
            })
            .filter((item): item is DomainAPIResult => item !== null)

          if (validatedAndMappedResults.length === 0 && sourceDomainsArray.length > 0) {
            setApiError("API returned domain entries, but none matched the required structure (Domain, Availability).")
            toast({
              title: "Structure Mismatch",
              description: "Domain entries from API did not have the expected structure.",
              variant: "warning",
            })
          } else if (validatedAndMappedResults.length === 0) {
            setApiError("No valid domain suggestions found in the API response.")
            toast({ title: "No Suggestions", description: "No valid domain suggestions were found.", variant: "info" })
          } else {
            const limitedResults = validatedAndMappedResults.slice(0, 50)
            setDomainResults(limitedResults)
            toast({
              title: "Search Complete",
              description: `Displaying ${limitedResults.length} of ${validatedAndMappedResults.length} found domain suggestions.`,
              variant: "success",
            })
          }
        } catch (parseError: any) {
          console.error("Primary JSON.parse failed:", parseError, "Raw response was:", responseText.substring(0, 500))
          try {
            const objectRegex = /\{\s*"Domain"\s*:\s*"[^"]+"\s*,\s*"Availability"\s*:\s*"[^"]+"\s*\}/g
            let potentialJsonString = responseText
            const arrayStartIndex = responseText.indexOf("[")
            const arrayEndIndex = responseText.lastIndexOf("]")
            if (arrayStartIndex !== -1 && arrayEndIndex !== -1 && arrayEndIndex > arrayStartIndex) {
              potentialJsonString = responseText.substring(arrayStartIndex, arrayEndIndex + 1)
            }
            const individualObjectMatches = potentialJsonString.match(objectRegex)

            if (individualObjectMatches && individualObjectMatches.length > 0) {
              const extractedDomains = individualObjectMatches.map((objStr) => JSON.parse(objStr))
              const limitedDomains = extractedDomains.slice(0, 50)
              const mappedResults = limitedDomains.map((item: any) => ({
                Domain: String(item.Domain),
                Availability: String(item.Availability).toLowerCase() === "available" ? "Available" : "Unavailable",
                registrarUrl:
                  String(item.Availability).toLowerCase() === "available"
                    ? `https://www.namecheap.com/domains/registration/results/?domain=${item.Domain}`
                    : undefined,
              }))
              setDomainResults(mappedResults)
              toast({
                title: "Search Complete (Fallback)",
                description: `Found ${mappedResults.length} domain suggestions using fallback parsing.`,
                variant: "success",
              })
              return
            } else {
              throw new Error("Regex fallback did not find parsable domain objects.")
            }
          } catch (regexFallbackError: any) {
            console.error("Regex fallback also failed:", regexFallbackError)
            setApiError(
              `Failed to parse API response. Primary error: ${parseError.message}. Fallback error: ${regexFallbackError.message}. Check raw response.`,
            )
            toast({
              title: "Parsing Error",
              description: "Could not parse the API response, even with fallback methods.",
              variant: "destructive",
            })
          }
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId)
        if (fetchError.name === "AbortError") {
          setApiError("The request to the API timed out. Please try again.")
          toast({ title: "Request Timeout", description: "The request to the API timed out.", variant: "destructive" })
        } else {
          throw fetchError
        }
      }
    } catch (err: any) {
      setApiError(err.message || "Failed to submit form. Please try again.")
      toast({
        title: "API Error",
        description: err.message || "Failed to connect to the domain service.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }

    if (!searchHistory.includes(formData.keywords)) {
      setSearchHistory((prevHistory) => [formData.keywords, ...prevHistory].slice(0, 5))
    }
  }

  const handleDomainCardClick = (domain: DomainAPIResult) => {
    if (domain.Availability === "Available" && domain.registrarUrl) {
      window.open(domain.registrarUrl, "_blank")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast({ title: "Copied to Clipboard", description: `${text} copied!` }))
      .catch(() => toast({ title: "Copy Failed", description: "Could not copy text.", variant: "destructive" }))
  }

  const toggleFavorite = (domainName: string) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(domainName)) {
        toast({ description: `${domainName} removed from favorites.` })
        return prevFavorites.filter((fav) => fav !== domainName)
      }
      toast({ description: `${domainName} added to favorites.` })
      return [...prevFavorites, domainName]
    })
  }

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <Card key={i} className="animate-pulse shadow-sm rounded-xl overflow-hidden" style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}>
          <CardContent className="p-5 h-40 flex flex-col justify-between">
            <div>
              <div className="w-1/3 h-5 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
              <div className="w-3/4 h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            </div>
            <div className="flex justify-end gap-2 mt-auto">
                <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="w-24 h-8 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderEmptyState = () => (
    <div className="text-center py-20 px-4 w-full animate-in fade-in duration-700">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 mx-auto shadow-sm" style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.border}` }}>
        <Globe className="w-8 h-8 opacity-40 text-gray-400" />
      </div>
      <h3 className="text-2xl md:text-3xl font-bold mb-3 font-['Poppins'] tracking-tight" style={{ color: colors.textPrimary }}>Start your search</h3>
      <p className="text-lg max-w-lg mx-auto leading-relaxed" style={{ color: colors.textSecondary }}>
        Enter a keyword, business name, or idea in the search box above to instantly generate matching domain suggestions.
      </p>
    </div>
  )

  const renderDomainCard = (result: DomainAPIResult, index: number) => (
    <Card
      key={index}
      className="transition-all duration-300 ease-out transform hover:-translate-y-1 hover:shadow-xl rounded-xl overflow-hidden border cursor-pointer"
      style={{ 
        backgroundColor: colors.cardBackground,
        borderColor: colors.border
      }}
      onClick={() => handleDomainCardClick(result)}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Badge
            variant={result.Availability === "Available" ? "default" : "secondary"}
            className={`${
              result.Availability === "Available"
                ? "bg-green-100/90 text-green-700 border-green-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800"
                : "bg-red-100/90 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800"
            } flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full`}
          >
            {result.Availability === "Available" ? <CheckCircle size={14} className="opacity-80" /> : <XCircle size={14} className="opacity-80" />}
            {result.Availability}
          </Badge>
          <Button
             variant="ghost"
             size="icon"
             className={`w-8 h-8 rounded-full transition-colors ${favorites.includes(result.Domain) ? 'bg-orange-50 dark:bg-orange-900/20' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
             style={{ color: favorites.includes(result.Domain) ? colors.accent : colors.textTertiary }}
             onClick={(e) => {
               e.stopPropagation()
               toggleFavorite(result.Domain)
             }}
          >
            <Heart size={16} className={`transition-all ${favorites.includes(result.Domain) ? "fill-current" : ""}`} />
          </Button>
        </div>
        
        <h3 className="font-bold text-xl mb-6 break-all leading-tight font-['Poppins'] tracking-tight" style={{ color: colors.textPrimary }}>
          {result.Domain}
        </h3>
        
        <div className="flex gap-2 mt-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            className="text-xs px-4 rounded-full font-medium transition-all shadow-sm"
            style={{ 
              borderColor: colors.border,
              color: colors.textSecondary,
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.hoverBackground }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
            onClick={(e) => {
              e.stopPropagation()
              copyToClipboard(result.Domain)
            }}
          >
            <Copy size={13} className="mr-2" /> Copy
          </Button>
          {result.Availability === "Available" && (
            <Button
              size="sm"
              className="text-white text-xs px-5 rounded-full font-bold transition-all shadow-md hover:shadow-lg"
              style={{ backgroundColor: colors.accent }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.accentHover }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.accent }}
              onClick={(e) => {
                e.stopPropagation()
                handleDomainCardClick(result)
              }}
            >
              <ExternalLink size={13} className="mr-2" /> Buy
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const renderDomainRow = (result: DomainAPIResult, index: number) => (
    <div
      key={index}
      className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md"
      style={{ 
        backgroundColor: colors.cardBackground,
        borderColor: colors.border
      }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.hoverBackground }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.cardBackground }}
      onClick={() => handleDomainCardClick(result)}
    >
      <div className="flex items-center gap-5 flex-1 min-w-0 mb-4 sm:mb-0">
        <Badge
          variant={result.Availability === "Available" ? "default" : "secondary"}
          className={`${
            result.Availability === "Available"
              ? "bg-green-100/90 text-green-700 border-green-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800"
              : "bg-red-100/90 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800"
          } flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0`}
        >
          {result.Availability === "Available" ? <CheckCircle size={14} /> : <XCircle size={14} />}
          {result.Availability}
        </Badge>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg xl:text-xl break-all font-['Poppins'] tracking-tight" style={{ color: colors.textPrimary }}>{result.Domain}</h3>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="w-9 h-9 rounded-full transition-colors"
          style={{ color: favorites.includes(result.Domain) ? colors.accent : colors.textTertiary }}
          onClick={(e) => {
            e.stopPropagation()
            toggleFavorite(result.Domain)
          }}
        >
          <Heart size={18} className={`transition-all ${favorites.includes(result.Domain) ? "fill-current" : ""}`} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="font-medium rounded-full px-4 transition-colors shadow-sm"
          style={{ borderColor: colors.border, color: colors.textSecondary, backgroundColor: 'transparent' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.hoverBackground }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          onClick={(e) => {
            e.stopPropagation()
            copyToClipboard(result.Domain)
          }}
        >
          <Copy size={14} className="mr-2" /> Copy
        </Button>
        {result.Availability === "Available" && (
          <Button
            size="sm"
            className="text-white font-bold rounded-full px-6 transition-all shadow-md hover:shadow-lg"
            style={{ backgroundColor: colors.accent }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.accentHover }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.accent }}
            onClick={(e) => {
              e.stopPropagation()
              handleDomainCardClick(result)
            }}
          >
            <ExternalLink size={14} className="mr-2" /> Buy
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen w-full font-sans transition-colors duration-200" style={{ backgroundColor: colors.background }}>
      {/* Hero Section */}
      <div 
        className="w-full pt-16 pb-12 px-4 md:px-8 border-b"
        style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}
      >
        <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center p-3.5 rounded-2xl mb-2 shadow-sm" style={{ backgroundColor: `${colors.accent}15`, color: colors.accent }}>
              <Globe className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-['Poppins']" style={{ color: colors.textPrimary }}>
              Domain Name <span style={{ color: colors.accent }}>Genie</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium" style={{ color: colors.textSecondary }}>
              Generate premium, brandable domain names powered by AI instantly. 
            </p>

            <Card className="mt-8 md:mt-12 w-full shadow-xl rounded-2xl overflow-hidden border" style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}>
                <CardContent className="p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6 text-left">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-xs font-bold tracking-wider uppercase" style={{ color: colors.textSecondary }}>NAME</Label>
                                <Input
                                    id="name" name="name" type="text"
                                    placeholder="Enter your name"
                                    value={formData.name} onChange={handleInputChange}
                                    className={`rounded-xl h-12 transition-all shadow-sm ${errors.name ? "border-red-400 ring-2 ring-red-100" : ""}`}
                                    style={{ 
                                        backgroundColor: colors.inputBackground,
                                        borderColor: errors.name ? '#F87171' : colors.border,
                                        color: colors.textPrimary
                                    }}
                                />
                                {errors.name && <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1"><AlertTriangle size={12} />{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-bold tracking-wider uppercase" style={{ color: colors.textSecondary }}>EMAIL</Label>
                                <Input
                                    id="email" name="email" type="email"
                                    placeholder="your@email.com"
                                    value={formData.email} onChange={handleInputChange}
                                    className={`rounded-xl h-12 transition-all shadow-sm ${errors.email ? "border-red-400 ring-2 ring-red-100" : ""}`}
                                    style={{ 
                                        backgroundColor: colors.inputBackground,
                                        borderColor: errors.email ? '#F87171' : colors.border,
                                        color: colors.textPrimary
                                    }}
                                />
                                {errors.email && <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1"><AlertTriangle size={12} />{errors.email}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="keywords" className="text-xs font-bold tracking-wider uppercase" style={{ color: colors.textSecondary }}>KEYWORDS OR DESCRIPTION</Label>
                            <Textarea
                                id="keywords" name="keywords"
                                placeholder="Enter keywords (e.g. tech, food, AI...) or describe your business"
                                value={formData.keywords} onChange={handleInputChange}
                                className={`min-h-[120px] rounded-xl p-4 transition-all text-base leading-relaxed shadow-inner ${errors.keywords ? "border-red-400 ring-2 ring-red-100" : ""}`}
                                style={{ 
                                    backgroundColor: colors.inputBackground,
                                    borderColor: errors.keywords ? '#F87171' : colors.border,
                                    color: colors.textPrimary
                                }}
                            />
                            {errors.keywords && <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1"><AlertTriangle size={12} />{errors.keywords}</p>}
                        </div>

                        <Button
                            type="submit" disabled={isLoading}
                            className={`w-full h-14 text-lg text-white font-bold rounded-xl transition-all duration-300 ${isLoading ? 'opacity-80 cursor-not-allowed' : 'shadow-lg hover:-translate-y-0.5'}`}
                            style={{ backgroundColor: colors.accent, ...(!isLoading ? { boxShadow: `0 8px 24px -4px ${colors.accent}` } : {}) }}
                            onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = colors.accentHover }}
                            onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = colors.accent }}
                        >
                            {isLoading ? (
                                <><Loader2 className="w-6 h-6 mr-3 animate-spin" /> Generating Domains...</>
                            ) : (
                                <><Search className="w-6 h-6 mr-3" /> Generate Domains</>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-6xl mx-auto px-4 py-12 md:py-16">
        
        {/* Errors & Raw Responses */}
        {apiError && (
          <div className="mb-10 p-6 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800/30">
            <h3 className="text-lg font-bold text-red-600 flex items-center gap-2 mb-2"><AlertTriangle size={18} /> API Error</h3>
            <p className="text-red-700 dark:text-red-400 font-medium">{apiError}</p>
          </div>
        )}

        {rawApiResponse && domainResults.length === 0 && !isLoading && !apiError && (
            <Card className="mb-10 rounded-xl shadow-sm border overflow-hidden" style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}>
                <CardHeader className="border-b" style={{ borderColor: `${colors.border}40` }}>
                    <CardTitle className="text-lg font-bold" style={{ color: colors.textPrimary }}>Raw Output Diagnostics</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <pre className="text-sm p-6 overflow-x-auto" style={{ color: colors.textSecondary, backgroundColor: colors.hoverBackground }}>
                        {rawApiResponse}
                    </pre>
                </CardContent>
            </Card>
        )}

        {/* Loading State inline */}
        {isLoading && (
            <div className="w-full pt-4">
                <div className="flex gap-4 mb-8 max-w-lg">
                   <div className="w-24 h-10 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse transition-colors" style={{ backgroundColor: colors.border }}></div>
                   <div className="w-24 h-10 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse transition-colors" style={{ backgroundColor: colors.border }}></div>
                   <div className="w-24 h-10 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse transition-colors" style={{ backgroundColor: colors.border }}></div>
                </div>
                {renderSkeleton()}
            </div>
        )}

        {/* Results Area */}
        {!isLoading && domainResults.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold mb-1 font-['Poppins'] tracking-tight" style={{ color: colors.textPrimary }}>
                    Generated Domains
                </h2>
                <p className="font-medium" style={{ color: colors.textSecondary }}>
                  Showing {filteredDomains.length} outstanding choices
                </p>
              </div>

              {/* Filters & Toggles */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                
                {/* Visual Mock Ext Chips */}
                <div className="hidden md:flex gap-1.5 mr-2">
                    {['.com', '.ai', '.io'].map(ext => (
                        <div key={ext} className="px-3.5 py-1.5 text-xs font-bold rounded-full border opacity-50 cursor-not-allowed select-none transition-opacity" 
                             style={{ color: colors.textSecondary, backgroundColor: colors.background, borderColor: colors.border }}>
                            {ext}
                        </div>
                    ))}
                </div>

                <div className="flex gap-1.5 items-center p-1.5 rounded-full shadow-inner w-full sm:w-auto" style={{ backgroundColor: colors.hoverBackground }}>
                    {["all", "available", "unavailable"].map((mode) => (
                        <Button
                            key={mode}
                            variant="ghost"
                            size="sm"
                            onClick={() => setFilterMode(mode as FilterMode)}
                            className={`rounded-full px-5 font-bold transition-all duration-300 capitalize text-xs md:text-sm h-8 ${
                                filterMode === mode ? "shadow-sm bg-white text-gray-900 dark:bg-gray-700 dark:text-white" : ""
                            }`}
                            style={filterMode !== mode ? { color: colors.textSecondary } : {}}
                        >
                            {mode}
                        </Button>
                    ))}
                </div>
                
                <div className="flex gap-1 rounded-full p-1 border shadow-sm w-full sm:w-auto justify-center" style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}>
                  <Button
                    variant="ghost" size="icon" onClick={() => setViewMode("grid")}
                    className={`rounded-full w-8 h-8 transition-colors`}
                    style={{ 
                        color: viewMode === "grid" ? colors.accent : colors.textTertiary,
                        backgroundColor: viewMode === "grid" ? colors.hoverBackground : 'transparent'
                    }}
                  >
                    <Grid size={15} />
                  </Button>
                  <Button
                    variant="ghost" size="icon" onClick={() => setViewMode("list")}
                    className={`rounded-full w-8 h-8 transition-colors`}
                    style={{ 
                        color: viewMode === "list" ? colors.accent : colors.textTertiary,
                        backgroundColor: viewMode === "list" ? colors.hoverBackground : 'transparent'
                    }}
                  >
                    <List size={15} />
                  </Button>
                </div>
              </div>
            </div>

            <div className="w-full">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredDomains.map((result, index) => renderDomainCard(result, index))}
                </div>
              ) : (
                <div className="space-y-4 max-w-4xl mx-auto">
                  {filteredDomains.map((result, index) => renderDomainRow(result, index))}
                </div>
              )}
            </div>

            {filteredDomains.length === 0 && (
              <div className="text-center py-16 px-4 border rounded-2xl border-dashed mt-8" style={{ borderColor: colors.border }}>
                <p className="text-lg font-medium mb-5" style={{ color: colors.textSecondary }}>No domains match your current filters.</p>
                <Button
                  variant="outline" onClick={() => { setFilterMode("all"); setSearchFilter(""); }}
                  className="font-bold px-6 rounded-full transition-colors shadow-sm"
                  style={{ borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.cardBackground }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </section>
        )}

        {/* Empty State */}
        {!isLoading && domainResults.length === 0 && !apiError && !rawApiResponse && (
            renderEmptyState()
        )}

        {/* History Area */}
        {searchHistory.length > 0 && !isLoading && (
            <div className="mt-20 pt-10 border-t flex flex-col items-center animate-in fade-in" style={{ borderColor: colors.border }}>
                <div className="flex flex-col items-center w-full max-w-3xl">
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2" style={{ color: colors.textSecondary }}>
                        <History size={16} /> Recent Searches
                    </h4>
                    <div className="flex flex-wrap justify-center gap-3">
                        {searchHistory.map((searchTerm, index) => (
                        <div
                            key={index}
                            className="cursor-pointer px-4 py-2 rounded-full text-sm font-semibold transition-all border shadow-sm hover:-translate-y-0.5"
                            style={{ 
                                backgroundColor: colors.cardBackground,
                                color: colors.textPrimary,
                                borderColor: colors.border
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.hoverBackground; e.currentTarget.style.borderColor = colors.accent }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.cardBackground; e.currentTarget.style.borderColor = colors.border }}
                            onClick={() => {
                                setFormData((prev) => ({ ...prev, keywords: searchTerm }))
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                                toast({ description: `Loaded search: "${searchTerm}"` })
                            }}
                        >
                            {searchTerm}
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        <footer className="text-center mt-24 pt-8 border-t text-sm font-medium opacity-70" style={{ color: colors.textSecondary, borderColor: colors.border }}>
          <p>&copy; {new Date().getFullYear()} Domain Name Genie. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
