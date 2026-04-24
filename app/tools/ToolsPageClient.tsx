"use client"

import { useState, useEffect } from "react"
import SmartFilterIntegration from '@/components/SmartFilterIntegration'
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Globe,
  Type,
  LayoutTemplate,
  Share2,
  Rss,
  Mail,
  Bot,
  BarChart2,
  ClipboardList,
  Filter,
  FileSearch,
  Briefcase,
  ArrowRight,
  Sparkles,
  Users,
  Palette,
  Calculator,
  Receipt,
  UserPlus,
  MessageSquare,
  HelpCircle,
  Megaphone,
  Send,
  Clock,
  X,
  Rocket
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const tools = [
  {
    id: "domain-name-genie",
    name: "Domain Name Genie",
    description: "Find your perfect domain with AI-powered suggestions based on your business description.",
    icon: Globe,
    href: "/tools/domain-name-generator",
    status: "Available",
    category: "Branding",
    solution: "LaunchPad",
    features: ["AI-powered suggestions", "Real-time availability check", "Multiple TLD options"],
    keywords: ["domain", "website", "url", "web address", "online presence", "site", "domain name", "hosting"],
    useCases: ["starting website", "new business", "rebranding", "online launch", "web presence"],
    userPersonas: ["entrepreneur", "startup founder", "small business owner", "web developer"],
    businessStages: ["idea", "launch"],
    complexityLevel: "beginner",
    timeToValue: "immediate"
  },
  {
    id: "business-launchpad",
    name: "Business Launchpad",
    description: "A guided assistant to generate your business plan, name, tagline, and brand colors.",
    icon: Rocket,
    href: "/tools/business-launchpad",
    status: "Available",
    category: "Branding",
    solution: "LaunchPad",
    features: ["AI business plan", "Brand name ideas", "Tagline generation", "Color palettes"],
    keywords: ["business plan", "startup", "branding", "name generator", "colors", "launch"],
    useCases: ["starting business", "rebranding", "startup launch"],
    userPersonas: ["entrepreneur", "founder", "small business owner"],
    businessStages: ["idea", "launch"],
    complexityLevel: "beginner",
    timeToValue: "immediate"
  },
  {
    id: "hero-copy-generator",
    name: "Landing-Page Hero Copy Generator",
    description: "Generates headline, sub-headline, and CTA variations for conversion.",
    icon: LayoutTemplate,
    href: "/tools/landing-pageherocopygenerator",
    status: "Available",
    category: "Content",
    solution: "LaunchPad",
    features: ["Headlines", "Sub-headlines", "CTA variations"],
    keywords: ["landing page", "hero copy", "headlines", "conversion", "website copy", "CTA", "call to action"],
    useCases: ["website launch", "conversion optimization", "landing page creation", "marketing campaigns"],
    userPersonas: ["marketer", "web designer", "business owner", "copywriter"],
    businessStages: ["launch", "growth"],
    complexityLevel: "beginner",
    timeToValue: "immediate"
  },
  {
    id: "social-media-suggester",
    name: "Social-Media Caption & Hashtag Suggester",
    description: "Creates platform-tailored captions plus trending hashtags.",
    icon: Share2,
    href: "/tools/social-media-suggester",
    status: "Available",
    category: "Marketing",
    solution: "LaunchPad",
    features: ["Platform-specific captions", "Trending hashtags", "Engagement optimization"],
    keywords: ["social media", "captions", "hashtags", "posts", "content", "engagement", "facebook", "instagram", "twitter"],
    useCases: ["social media marketing", "content creation", "audience engagement", "brand awareness", "social posting"],
    userPersonas: ["content creator", "social media manager", "marketer", "small business owner"],
    businessStages: ["launch", "growth", "scale"],
    complexityLevel: "beginner",
    timeToValue: "immediate"
  },
  {
    id: "blog-outline-builder",
    name: "Blog-Post Topic & Outline Builder",
    description: "Spins up a SEO-optimized blog structure with headings and key points.",
    icon: Rss,
    href: "/tools/blog-generator",
    status: "Available",
    category: "Content",
    solution: "Intelligence",
    features: ["SEO optimization", "Content structure", "Topic research"],
    keywords: ["blog", "content", "SEO", "writing", "articles", "blog posts", "content marketing", "outline"],
    useCases: ["content marketing", "blog writing", "SEO content", "thought leadership", "website content"],
    userPersonas: ["content writer", "marketer", "blogger", "business owner"],
    businessStages: ["growth", "scale"],
    complexityLevel: "intermediate",
    timeToValue: "short"
  },
  {
    id: "email-subject-generator",
    name: "Email Subject-Line & Preview-Text Generator",
    description: "Produces subject lines and preheader options to maximize opens.",
    icon: Mail,
    href: "/tools/email-subject-line",
    status: "Available",
    category: "Marketing",
    solution: "Intelligence",
    features: ["Subject line optimization", "Preview text", "Open rate improvement"],
    keywords: ["email", "subject lines", "newsletter", "email marketing", "open rates", "email campaigns"],
    useCases: ["email campaigns", "newsletter marketing", "lead nurturing", "customer communication"],
    userPersonas: ["email marketer", "business owner", "marketing manager"],
    businessStages: ["growth", "scale"],
    complexityLevel: "beginner",
    timeToValue: "immediate"
  },
  {
    id: "powerbi-generator",
    name: "Power BI Measure & Viz Snippet Generator",
    description: "Outputs DAX measures and a JSON snippet for a chart from KPI description.",
    icon: BarChart2,
    href: "/tools/power-bi-measure",
    status: "Available",
    category: "Analytics",
    solution: "Intelligence",
    features: ["DAX measures", "Visualization snippets", "KPI tracking"],
    keywords: ["power bi", "analytics", "data visualization", "DAX", "business intelligence", "reporting", "KPI"],
    useCases: ["business reporting", "data analysis", "dashboard creation", "performance tracking"],
    userPersonas: ["data analyst", "business analyst", "manager", "executive"],
    businessStages: ["growth", "scale"],
    complexityLevel: "advanced",
    timeToValue: "medium"
  },
  {
    id: "meeting-extractor",
    name: "Meeting-Summary & Action-Item Extractor",
    description: "Get bullet-point summary + assigned tasks from transcript or notes.",
    icon: ClipboardList,
    href: "/tools/meeting-summary-extractor",
    status: "Available",
    category: "Productivity",
    solution: "GrowthSuite",
    features: ["Meeting summaries", "Action items", "Task assignment"],
    keywords: ["meetings", "productivity", "summaries", "action items", "notes", "tasks", "collaboration"],
    useCases: ["meeting management", "team collaboration", "project tracking", "task management"],
    userPersonas: ["manager", "team lead", "project manager", "executive"],
    businessStages: ["growth", "scale"],
    complexityLevel: "beginner",
    timeToValue: "immediate"
  },
  {
    id: "data-cleanse-helper",
    name: "Data-Cleanse & Schema-Map Helper",
    description: "Infers column types, flags anomalies, and proposes a star-schema from CSV.",
    icon: Filter,
    href: "/tools/data-cleanse",
    status: "Available",
    category: "Analytics",
    solution: "Intelligence",
    features: ["Data cleaning", "Schema mapping", "Anomaly detection"],
    keywords: ["data", "csv", "data cleaning", "analytics", "data processing", "schema", "database"],
    useCases: ["data preparation", "analytics setup", "data migration", "database design"],
    userPersonas: ["data analyst", "developer", "business analyst"],
    businessStages: ["growth", "scale"],
    complexityLevel: "advanced",
    timeToValue: "medium"
  },
  {
    id: "seo-analyzer",
    name: "SEO-Keyword & Content-Gap Analyzer",
    description: "Delivers untapped keyword ideas and content gaps versus competitors.",
    icon: FileSearch,
    href: "/tools/seo-keyword-content-gapanalyzer",
    status: "Available",
    category: "Marketing",
    solution: "GrowthSuite",
    features: ["Keyword research", "Content gaps", "Competitor analysis"],
    keywords: ["SEO", "keywords", "search engine", "google", "content gap", "competitor analysis", "ranking"],
    useCases: ["SEO optimization", "content strategy", "competitor research", "website ranking"],
    userPersonas: ["SEO specialist", "marketer", "content manager"],
    businessStages: ["growth", "scale"],
    complexityLevel: "intermediate",
    timeToValue: "medium"
  },
  {
    id: "proposal-generator",
    name: "Proposal-Draft Generator",
    description: "Get a formatted first-draft proposal from prospect details & service package.",
    icon: Briefcase,
    href: "/tools/proposal-draft-generator",
    status: "Available",
    category: "Business",
    solution: "GrowthSuite",
    features: ["Proposal drafts", "Service packages", "Client customization"],
    keywords: ["proposal", "client", "services", "business development", "sales", "contracts", "quotes"],
    useCases: ["client proposals", "service quotes", "project bids", "business development"],
    userPersonas: ["sales person", "business owner", "consultant", "agency owner"],
    businessStages: ["growth", "scale"],
    complexityLevel: "intermediate",
    timeToValue: "short"
  },
  {
    id: "follow-up-email-sequencer",
    name: "Follow-Up Email Sequencer",
    description: "Create automated email sequences to nurture leads and close deals effectively.",
    icon: Send,
    href: "/tools/follow-up-email-sequencer",
    status: "Available",
    category: "Marketing",
    solution: "GrowthSuite",
    features: ["Email sequences", "Lead nurturing", "Automated follow-ups"],
    keywords: ["email automation", "follow up", "lead nurturing", "email sequence", "sales funnel", "drip campaign"],
    useCases: ["lead nurturing", "sales automation", "customer onboarding", "email marketing"],
    userPersonas: ["sales person", "marketer", "business owner"],
    businessStages: ["growth", "scale"],
    complexityLevel: "intermediate",
    timeToValue: "medium"
  },
  {
    id: "job-description-generator",
    name: "Job Description Generator",
    description: "Generate comprehensive job descriptions with requirements and responsibilities.",
    icon: UserPlus,
    href: "/tools/job-description-generator",
    status: "Available",
    category: "Business",
    solution: "GrowthSuite",
    features: ["Role requirements", "Responsibility mapping", "Skills assessment"],
    keywords: ["hiring", "job description", "recruitment", "HR", "job posting", "talent acquisition"],
    useCases: ["hiring process", "team building", "recruitment", "job postings"],
    userPersonas: ["HR manager", "business owner", "team lead"],
    businessStages: ["growth", "scale"],
    complexityLevel: "beginner",
    timeToValue: "immediate"
  },
  {
    id: "customer-persona-generator",
    name: "Customer Persona & ICP Generator",
    description: "Create detailed customer personas and ideal customer profiles for targeted marketing.",
    icon: Users,
    href: "/tools/customer-persona-generator",
    status: "Available",
    category: "Marketing",
    solution: "GrowthSuite",
    features: ["Detailed personas", "ICP mapping", "Target audience insights"],
    keywords: ["customer persona", "target audience", "ICP", "ideal customer", "marketing strategy", "customer research"],
    useCases: ["marketing strategy", "product development", "sales targeting", "customer research"],
    userPersonas: ["marketer", "product manager", "business owner"],
    businessStages: ["launch", "growth"],
    complexityLevel: "intermediate",
    timeToValue: "short"
  },
  {
    id: "pricing-calculator",
    name: "Pricing Calculator",
    description: "Calculate optimal pricing strategies based on costs, market analysis, and profit margins.",
    icon: Calculator,
    href: "/tools/pricing-generator",
    status: "Available",
    category: "Business",
    solution: "LaunchPad",
    features: ["Cost analysis", "Profit margin optimization", "Competitive pricing"],
    keywords: ["pricing", "cost analysis", "profit margins", "pricing strategy", "business model", "revenue"],
    useCases: ["product pricing", "service pricing", "business planning", "profit optimization"],
    userPersonas: ["business owner", "product manager", "entrepreneur"],
    businessStages: ["launch", "growth"],
    complexityLevel: "intermediate",
    timeToValue: "short"
  },
  {
    id: "invoice-template-builder",
    name: "Invoice Template Builder",
    description: "Create professional invoice templates with custom branding and automated calculations.",
    icon: Receipt,
    href: "/tools/invoice-template-builder",
    status: "Available",
    category: "Business",
    solution: "GrowthSuite",
    features: ["Custom templates", "Automated calculations", "Brand integration"],
    keywords: ["invoice", "billing", "accounting", "templates", "business documents", "payment"],
    useCases: ["client billing", "business accounting", "invoice management", "payment processing"],
    userPersonas: ["business owner", "freelancer", "accountant"],
    businessStages: ["launch", "growth", "scale"],
    complexityLevel: "beginner",
    timeToValue: "immediate"
  },
  {
    id: "sales-script-generator",
    name: "Sales Script Generator",
    description: "Generate persuasive sales scripts for calls, emails, and presentations.",
    icon: MessageSquare,
    href: "/tools/sales-script-generator",
    status: "Available",
    category: "Marketing",
    solution: "GrowthSuite",
    features: ["Persuasive scripts", "Objection handling", "Closing techniques"],
    keywords: ["sales", "scripts", "cold calling", "sales pitch", "closing", "objection handling", "sales training"],
    useCases: ["sales calls", "sales training", "lead conversion", "sales presentations"],
    userPersonas: ["sales person", "business owner", "sales manager"],
    businessStages: ["growth", "scale"],
    complexityLevel: "intermediate",
    timeToValue: "immediate"
  },
  {
    id: "faq-builder",
    name: "FAQ Builder",
    description: "Build comprehensive FAQ sections to address common customer questions.",
    icon: HelpCircle,
    href: "/tools/faq-builder",
    status: "Available",
    category: "Content",
    solution: "LaunchPad",
    features: ["Question categorization", "Answer optimization", "Search functionality"],
    keywords: ["FAQ", "customer support", "help documentation", "questions", "support content", "customer service"],
    useCases: ["customer support", "website content", "product documentation", "user guidance"],
    userPersonas: ["customer support", "business owner", "product manager"],
    businessStages: ["launch", "growth"],
    complexityLevel: "beginner",
    timeToValue: "immediate"
  },
  {
    id: "press-release-template",
    name: "Press Release Template",
    description: "Create professional press releases for announcements and media outreach.",
    icon: Megaphone,
    href: "/tools/press-release-template",
    status: "Available",
    category: "Marketing",
    solution: "GrowthSuite",
    features: ["Media-ready format", "SEO optimization", "Distribution guidelines"],
    keywords: ["press release", "PR", "media", "announcements", "publicity", "news", "media outreach"],
    useCases: ["product launches", "company announcements", "media relations", "publicity"],
    userPersonas: ["PR manager", "marketer", "business owner"],
    businessStages: ["growth", "scale"],
    complexityLevel: "intermediate",
    timeToValue: "short"
  },
  {
    id: "project-timeline-builder",
    name: "Project Timeline Builder",
    description: "Build detailed project timelines with milestones, dependencies, and resource allocation.",
    icon: Clock,
    href: "/tools/project-timeline-builder",
    status: "Available",
    category: "Productivity",
    solution: "GrowthSuite",
    features: ["Milestone tracking", "Dependency mapping", "Resource planning"],
    keywords: ["project management", "timeline", "milestones", "project planning", "scheduling", "resource management"],
    useCases: ["project planning", "team coordination", "deadline management", "resource allocation"],
    userPersonas: ["project manager", "team lead", "business owner"],
    businessStages: ["growth", "scale"],
    complexityLevel: "intermediate",
    timeToValue: "medium"
  },
]

interface Tool {
  id: string
  name: string
  description: string
  icon: any
  href: string
  status: string
  category: string
  solution: string
  features: string[]
  keywords: string[]
  useCases: string[]
  userPersonas: string[]
  businessStages: string[]
  complexityLevel: 'beginner' | 'intermediate' | 'advanced'
  timeToValue: 'immediate' | 'short' | 'medium' | 'long'
}

const categories = ["All", "Branding", "Content", "Marketing", "Automation", "Analytics", "Productivity", "Business"]
const solutions = ["All", "GrowthSuite", "LaunchPad", "Intelligence"]

export default function ToolsPageClient() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeSolution, setActiveSolution] = useState("All")
  
  // Enhanced intelligent filter state management with debugging
  const [intelligentFilter, setIntelligentFilter] = useState<{
    active: boolean
    toolIds: string[]
    searchTerm: string
  }>({
    active: false,
    toolIds: [],
    searchTerm: ''
  })

  // Debug logging in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Filter state changed:', {
        activeCategory,
        activeSolution,
        intelligentFilter
      })
    }
  }, [activeCategory, activeSolution, intelligentFilter])

  // Enhanced filter logic with intelligent filtering and debugging
  const filteredTools = tools.filter((tool) => {
    // First, apply intelligent filtering if active
    if (intelligentFilter.active && intelligentFilter.toolIds.length > 0) {
      const isIncluded = intelligentFilter.toolIds.includes(tool.id)
      if (process.env.NODE_ENV === 'development') {
        if (isIncluded) {
          console.log(`✅ Tool ${tool.name} (${tool.id}) included by AI filter`)
        } else {
          console.log(`❌ Tool ${tool.name} (${tool.id}) excluded by AI filter`)
        }
      }
      return isIncluded
    }
    
    // Otherwise, apply regular category and solution filtering
    const categoryMatch = activeCategory === "All" || tool.category === activeCategory
    const solutionMatch = activeSolution === "All" || tool.solution === activeSolution
    const shouldInclude = categoryMatch && solutionMatch
    
    if (process.env.NODE_ENV === 'development' && (activeCategory !== "All" || activeSolution !== "All")) {
      console.log(`Tool ${tool.name}: category(${tool.category}${categoryMatch ? '✅' : '❌'}) solution(${tool.solution}${solutionMatch ? '✅' : '❌'}) -> ${shouldInclude ? 'INCLUDED' : 'EXCLUDED'}`)
    }
    
    return shouldInclude
  })

  // Debug the filtering results
  if (process.env.NODE_ENV === 'development') {
    console.log(`=== Filter Results ===`)
    console.log(`Total tools: ${tools.length}`)
    console.log(`Filtered tools: ${filteredTools.length}`)
    console.log(`Filter mode: ${intelligentFilter.active ? 'AI' : 'Manual'}`)
    if (intelligentFilter.active) {
      console.log(`AI tool IDs: [${intelligentFilter.toolIds.join(', ')}]`)
      console.log(`Matched tools: [${filteredTools.map(t => t.name).join(', ')}]`)
    } else {
      console.log(`Category filter: ${activeCategory}`)
      console.log(`Solution filter: ${activeSolution}`)
    }
    console.log(`=====================`)
  }

  // Enhanced smart filter handler with better debugging and state management
  const handleSmartFilter = (
    category: string, 
    solution: string, 
    searchTerm: string, 
    specificToolIds?: string[]
  ) => {
    console.log('Smart filter handler called:', {
      category,
      solution,
      searchTerm,
      specificToolIds: specificToolIds?.length || 0
    })

    // Apply category and solution filters
    setActiveCategory(category)
    setActiveSolution(solution)
    
    // Handle intelligent filtering
    if (specificToolIds && specificToolIds.length > 0) {
      console.log('Activating intelligent filter with tool IDs:', specificToolIds)
      
      // Validate tool IDs exist in our tools array
      const validToolIds = specificToolIds.filter(id => 
        tools.some(tool => tool.id === id)
      )
      
      console.log('Valid tool IDs after validation:', validToolIds)
      
      if (validToolIds.length > 0) {
        // Intelligent filtering - show only specific matched tools
        setIntelligentFilter({
          active: true,
          toolIds: validToolIds,
          searchTerm: searchTerm
        })
        
        console.log('Intelligent filter activated with', validToolIds.length, 'valid tools')
      } else {
        console.warn('No valid tool IDs found, falling back to regular filtering')
        // Fallback to regular filtering if no valid tool IDs
        setIntelligentFilter({
          active: false,
          toolIds: [],
          searchTerm: ''
        })
      }
    } else {
      console.log('No specific tool IDs provided, using regular filtering')
      // Regular filtering - clear intelligent filter
      setIntelligentFilter({
        active: false,
        toolIds: [],
        searchTerm: ''
      })
    }
    
    // Smooth scroll to the filter section
    setTimeout(() => {
      const filterSection = document.getElementById('filter-section')
      if (filterSection) {
        filterSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        })
      }
    }, 800)
  }

  // Clear all filters
  const clearAllFilters = () => {
    console.log('Clearing all filters')
    setActiveCategory("All")
    setActiveSolution("All")
    setIntelligentFilter({ active: false, toolIds: [], searchTerm: '' })
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full pt-32 pb-20 px-4 bg-[var(--cloud)] overflow-hidden relative">
        {/* Ambient Decor */}
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-[#ff7a59]/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-1/4 h-64 bg-gradient-to-tl from-[#ff7a59]/5 to-transparent blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#ff7a59]/10 text-[#ff7a59] px-5 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest mb-8 border border-[#ff7a59]/20 shadow-sm animate-in fade-in slide-in-from-bottom-4">
            <Sparkles className="w-4 h-4" />
            Strategic Asset Repository
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold mb-8 tracking-tight text-[var(--night)] leading-[1.1]">
            Executive AI <span className="text-[#ff7a59]">Toolkit</span>
          </h1>
          <p className="text-xl text-[var(--steel)] mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            A high-performance collection of generative AI solutions and automation protocols designed to optimize growth for founders and modern enterprises.
          </p>
        </div>
      </section>

      {/* Smart Filter Integration */}
      <SmartFilterIntegration 
        tools={tools} 
        onFilterApply={handleSmartFilter}
        currentCategory={activeCategory}
        currentSolution={activeSolution}
      />

      {/* Filter Section with Enhanced Intelligent Filter Indicator */} 
      <section id="filter-section" className="py-8 px-4 bg-[var(--cloud)] border-y border-[var(--iron)]">
         <div className="max-w-7xl mx-auto">
          
          {/* Enhanced Intelligent Filter Indicator */}
          {intelligentFilter.active && intelligentFilter.toolIds.length > 0 && (
            <div className="mb-6 p-4 border border-[#ff7a59]/30 bg-[#ff7a59]/5 rounded-[2rem]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#ff7a59] animate-pulse" />
                    <span className="font-bold text-[#ff7a59]">AI Intelligent Filter Active</span>
                  </div>
                  <Badge variant="secondary" className="bg-[var(--mist)] text-[var(--night)] border border-[var(--iron)] font-bold rounded-full">
                    {filteredTools.length} perfectly matched tools
                  </Badge>
                  {process.env.NODE_ENV === 'development' && (
                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest border-[var(--iron)] rounded-full text-[var(--steel)]">
                      Debug: {intelligentFilter.toolIds.join(', ')}
                    </Badge>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAllFilters}
                  className="hover:bg-[var(--mist)] text-[var(--night)] font-bold rounded-xl"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear AI Filter
                </Button>
              </div>
              <p className="text-sm text-[var(--steel)] mt-2 ml-7 font-medium">
                Showing tools specifically matched to: <span className="font-bold text-[var(--night)]">"{intelligentFilter.searchTerm}"</span>
              </p>
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-2 ml-7">
                  <details className="text-[10px] text-[var(--steel)] uppercase tracking-widest font-bold">
                    <summary className="cursor-pointer">Debug Info</summary>
                    <div className="mt-1 p-2 bg-[var(--mist)] border border-[var(--iron)] rounded-xl normal-case tracking-normal">
                      <p>Tool IDs: {intelligentFilter.toolIds.join(', ')}</p>
                      <p>Filtered Tools: {filteredTools.map(t => t.name).join(', ')}</p>
                    </div>
                  </details>
                </div>
              )}
            </div>
          )}

          {/* Filter section header with AI indicator */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-[var(--night)]">AI Tools by Category</h2> 
            <div className="flex items-center gap-2">
               <p className="text-[var(--steel)] font-medium">
                {filteredTools.length} tool{filteredTools.length !== 1 ? "s" : ""} available
              </p>
              {intelligentFilter.active && (
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest ml-2 border-[#ff7a59]/30 text-[#ff7a59] bg-[#ff7a59]/5 rounded-full">
                  <Sparkles className="w-3 h-3 mr-1 animate-pulse" />
                  AI Filtered
                </Badge>
              )}
            </div>
          </div>

          {/* Enhanced Filter Dropdowns with Clear Indicators */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
               <label htmlFor="category-filter" className="text-sm font-bold text-[var(--steel)] uppercase tracking-widest">Filter by Category:</label>
              <Select value={activeCategory} onValueChange={(value) => {
                console.log('Category changed to:', value)
                setActiveCategory(value)
                if (intelligentFilter.active) {
                  // Clear intelligent filter when manual category change occurs
                  setIntelligentFilter({ active: false, toolIds: [], searchTerm: '' })
                }
              }}> 
                  <SelectTrigger className={`w-[200px] h-12 rounded-xl bg-[var(--cloud)] border-[var(--iron)] text-[var(--night)] font-bold ${activeCategory !== 'All' ? 'border-[#ff7a59]/50 text-[#ff7a59] bg-[#ff7a59]/5' : ''}`}> 
                  <SelectValue placeholder="Select category" /> 
                </SelectTrigger>
                <SelectContent className="bg-[var(--cloud)] border-[var(--iron)] rounded-xl"> 
                  {categories.map((category) => ( 
                    <SelectItem key={category} value={category} className="cursor-pointer font-medium hover:bg-[var(--mist)] focus:bg-[var(--mist)] text-[var(--night)]">{category}</SelectItem> 
                  ))} 
                </SelectContent>
              </Select> 
            </div>
            <div className="flex items-center gap-4">
               <label htmlFor="solution-filter" className="text-sm font-bold text-[var(--steel)] uppercase tracking-widest">Filter by Solution:</label>
              <Select value={activeSolution} onValueChange={(value) => {
                console.log('Solution changed to:', value)
                setActiveSolution(value)
                if (intelligentFilter.active) {
                  // Clear intelligent filter when manual solution change occurs
                  setIntelligentFilter({ active: false, toolIds: [], searchTerm: '' })
                }
              }}> 
                  <SelectTrigger className={`w-[200px] h-12 rounded-xl bg-[var(--cloud)] border-[var(--iron)] text-[var(--night)] font-bold ${activeSolution !== 'All' ? 'border-[#ff7a59]/50 text-[#ff7a59] bg-[#ff7a59]/5' : ''}`}> 
                  <SelectValue placeholder="Select solution" /> 
                </SelectTrigger>
                <SelectContent className="bg-[var(--cloud)] border-[var(--iron)] rounded-xl"> 
                  {solutions.map((solution) => ( 
                    <SelectItem key={solution} value={solution} className="cursor-pointer font-medium hover:bg-[var(--mist)] focus:bg-[var(--mist)] text-[var(--night)]">{solution}</SelectItem> 
                  ))} 
                </SelectContent>
              </Select> 
            </div>
            
            {/* Clear Filters Button */}
            {(activeCategory !== 'All' || activeSolution !== 'All' || intelligentFilter.active) && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAllFilters}
                className="ml-auto h-12 rounded-xl bg-[var(--cloud)] border-[var(--iron)] text-[var(--night)] font-bold hover:bg-[var(--mist)] transition-colors"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All Filters
              </Button>
            )}
          </div> 
        </div> 
      </section>

      {/* Tools Grid with Enhanced Empty State */}
      <section id="tools-grid" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredTools.length === 0 ? (
            <div className="text-center py-20">
               <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-[var(--mist)] border border-[var(--iron)] rounded-full flex items-center justify-center">
                  <Filter className="w-12 h-12 text-[var(--steel)]" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[var(--night)]">No Tools Found</h3>
                <p className="text-[var(--steel)] font-medium mb-6">
                  {intelligentFilter.active 
                    ? `No tools match your AI search for "${intelligentFilter.searchTerm}". The AI couldn't find relevant tools with the current parameters.`
                    : "No tools match your current filter selection. Try adjusting your category or solution filters to see more results."
                  }
                </p>
                
                {/* Enhanced Debug Information */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mb-6 p-4 bg-[var(--mist)] border border-[var(--iron)] rounded-xl text-sm text-left">
                    <h4 className="font-bold mb-2 text-[var(--night)]">Debug Information:</h4>
                    <p className="text-[var(--steel)]"><strong className="text-[var(--night)]">Active Category:</strong> {activeCategory}</p>
                    <p className="text-[var(--steel)]"><strong className="text-[var(--night)]">Active Solution:</strong> {activeSolution}</p>
                    <p className="text-[var(--steel)]"><strong className="text-[var(--night)]">Intelligent Filter Active:</strong> {intelligentFilter.active ? 'Yes' : 'No'}</p>
                    {intelligentFilter.active && (
                      <>
                        <p className="text-[var(--steel)]"><strong className="text-[var(--night)]">AI Search Term:</strong> {intelligentFilter.searchTerm}</p>
                        <p className="text-[var(--steel)]"><strong className="text-[var(--night)]">AI Tool IDs:</strong> {intelligentFilter.toolIds.join(', ') || 'None'}</p>
                        <p className="text-[var(--steel)]"><strong className="text-[var(--night)]">Valid Tool Names:</strong> {tools.filter(t => intelligentFilter.toolIds.includes(t.id)).map(t => t.name).join(', ') || 'None found'}</p>
                      </>
                    )}
                    <p className="text-[var(--steel)]"><strong className="text-[var(--night)]">Total Tools Available:</strong> {tools.length}</p>
                    <p className="text-[var(--steel)]"><strong className="text-[var(--night)]">Filtered Tools Count:</strong> {filteredTools.length}</p>
                    
                    <div className="mt-2 p-2 bg-[#ff7a59]/10 border border-[#ff7a59]/20 rounded-lg">
                      <p className="font-bold text-[#ff7a59]">Current Filter Logic:</p>
                      {intelligentFilter.active ? (
                        <p className="text-xs text-[var(--night)] font-medium">
                          Using AI filter with {intelligentFilter.toolIds.length} specific tool IDs
                        </p>
                      ) : (
                        <p className="text-xs text-[var(--night)] font-medium">
                          Using category ({activeCategory}) and solution ({activeSolution}) filters
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    variant="outline" 
                     onClick={clearAllFilters}
                     className="bg-[var(--cloud)] border-[var(--iron)] text-[var(--night)] font-bold hover:bg-[var(--mist)] h-12 rounded-xl transition-colors"
                  >
                    Clear All Filters
                  </Button>
                  <Button 
                    variant="outline" 
                     onClick={() => setActiveCategory("All")}
                     className="bg-[var(--cloud)] border-[var(--iron)] text-[var(--night)] font-bold hover:bg-[var(--mist)] h-12 rounded-xl transition-colors"
                  >
                    Reset Category
                  </Button>
                  <Button 
                    variant="outline" 
                     onClick={() => setActiveSolution("All")}
                     className="bg-[var(--cloud)] border-[var(--iron)] text-[var(--night)] font-bold hover:bg-[var(--mist)] h-12 rounded-xl transition-colors"
                  >
                    Reset Solution
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Results Summary */}
              {(intelligentFilter.active || activeCategory !== 'All' || activeSolution !== 'All') && (
                <div className="mb-8 p-4 bg-[#ff7a59]/5 rounded-[2rem] border border-[#ff7a59]/20">
                  <div className="flex items-center gap-2">
                    {intelligentFilter.active ? (
                      <>
                        <Sparkles className="w-5 h-5 text-[#ff7a59]" />
                        <span className="font-bold text-[var(--night)]">
                          AI found {filteredTools.length} tools matching "{intelligentFilter.searchTerm}"
                        </span>
                      </>
                    ) : (
                      <>
                        <Filter className="w-5 h-5 text-[#ff7a59]" />
                        <span className="font-bold text-[var(--night)]">
                          Showing {filteredTools.length} tools filtered by {activeCategory !== 'All' && `Category: ${activeCategory}`}{activeCategory !== 'All' && activeSolution !== 'All' && ' + '}{activeSolution !== 'All' && `Solution: ${activeSolution}`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredTools.map((tool) => {
                  const IconComponent = tool.icon
                  const isAvailable = tool.status === "Available"
                  const isAIMatched = intelligentFilter.active && intelligentFilter.toolIds.includes(tool.id)

                  return (
                    <Card
                      key={tool.id}
                      className={`card bg-[var(--cloud)] border-[var(--iron)] overflow-hidden flex flex-col h-full transition-all duration-300 hover:border-[#ff7a59]/30 hover:shadow-lg rounded-[2rem] group ${
                        isAIMatched ? 'ring-2 ring-[#ff7a59]/50 shadow-[0_0_20px_rgba(255,122,89,0.1)]' : ''
                      }`}
                    >
                      <CardHeader className="p-6 sm:p-8 pb-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${isAIMatched ? 'bg-[#ff7a59]/10 border border-[#ff7a59]/20' : 'bg-[var(--mist)] border border-[var(--iron)]'}`}>
                              <IconComponent className={`w-6 h-6 ${isAIMatched ? 'text-[#ff7a59]' : 'text-[var(--night)] group-hover:text-[#ff7a59] transition-colors'}`} />
                            </div>
                            <div className="flex flex-wrap items-center gap-2 min-w-0 pt-1">
                              <Badge variant={isAvailable ? "default" : "secondary"} className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${isAvailable ? 'bg-[#10b981]/10 text-[#10b981] border-none' : 'bg-[var(--mist)] text-[var(--steel)] border-none'}`}>
                                {tool.status}
                              </Badge>
                              {isAIMatched && (
                                <Badge variant="secondary" className="bg-[#ff7a59]/10 text-[#ff7a59] border-none text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  Match
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border-[var(--iron)] text-[var(--steel)]">
                                {tool.category}
                              </Badge>
                              {tool.solution === "GrowthSuite" ? (
                                <Link
                                  href="/growthsuite"
                                  scroll={false}
                                  onClick={() => {
                                    setTimeout(() => {
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }, 100);
                                  }}
                                >
                                  <Badge 
                                    variant="outline" 
                                    className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border-[#3b82f6]/30 text-[#3b82f6] bg-[#3b82f6]/5 hover:bg-[#3b82f6]/10 transition-colors cursor-pointer"
                                  >
                                    {tool.solution}
                                  </Badge>
                                </Link>
                              ) : tool.solution === "LaunchPad" ? (
                                <Link
                                  href="/launchpad"
                                  scroll={false}
                                  onClick={() => {
                                    setTimeout(() => {
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }, 100);
                                  }}
                                >
                                  <Badge 
                                    variant="outline" 
                                    className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border-[#10b981]/30 text-[#10b981] bg-[#10b981]/5 hover:bg-[#10b981]/10 transition-colors cursor-pointer"
                                  >
                                    {tool.solution}
                                  </Badge>
                                </Link>
                              ) : tool.solution === "Intelligence" ? (
                                <Link
                                  href="/intelligence"
                                  scroll={false}
                                  onClick={() => {
                                    setTimeout(() => {
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }, 100);
                                  }}
                                >
                                  <Badge 
                                    variant="outline" 
                                    className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border-[#a855f7]/30 text-[#a855f7] bg-[#a855f7]/5 hover:bg-[#a855f7]/10 transition-colors cursor-pointer"
                                  >
                                    {tool.solution}
                                  </Badge>
                                </Link>
                              ) : (
                                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border-[var(--iron)] text-[var(--steel)]">
                                  {tool.solution}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <CardTitle className={`text-xl sm:text-2xl font-bold tracking-tight transition-colors line-clamp-2 ${isAIMatched ? 'text-[#ff7a59]' : 'text-[var(--night)] group-hover:text-[#ff7a59]'}`}>
                          {tool.name}
                        </CardTitle>
                        <CardDescription className="text-sm font-medium text-[var(--steel)] mt-2 line-clamp-3 leading-relaxed">
                          {tool.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 sm:p-8 pt-0 flex-grow flex flex-col">
                        <div className="space-y-4 flex-grow border-t border-[var(--iron)] pt-6 mt-2">
                          <div>
                            <h4 className="font-bold text-[10px] uppercase tracking-widest text-[var(--steel)] mb-3">Key Features:</h4>
                            <ul className="space-y-2">
                              {tool.features.map((feature, index) => (
                                <li key={index} className="text-sm text-[var(--night)] font-medium flex items-start gap-2.5">
                                  <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isAIMatched ? 'bg-[#ff7a59]' : 'bg-[#10b981]'}`}></div>
                                  <span className="leading-tight">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="mt-8 pt-4">
                          {isAvailable ? (
                            <Button asChild className={`w-full px-6 h-12 text-sm sm:text-base font-bold shadow-sm rounded-xl ${isAIMatched ? 'btn-primary' : 'bg-[var(--night)] text-[var(--cloud)] hover:bg-[#ff7a59] transition-colors'}`}>
                              <Link href={tool.href}>
                                Try Now
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                              </Link>
                            </Button>
                          ) : (
                            <Button disabled className="w-full h-12 rounded-xl bg-[var(--mist)] text-[var(--steel)] border border-[var(--iron)] font-bold cursor-not-allowed text-sm sm:text-base">
                              Coming Soon
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section py-20 bg-[var(--sand)] text-[var(--night)] border-t border-[var(--mist)] mt-12 rounded-[var(--radius-lg)] mb-12 max-w-[calc(100%-80px)] mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Business with Free AI Tools?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start with our AI-powered Domain Name Genie to discover the perfect domain for your business. Explore our complete directory of generative AI tools and find the best AI solutions for your enterprise needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-primary h-12 px-8 text-base font-bold rounded-xl shadow-sm">
              <Link href="/tools/domain-name-generator">Try Domain Name Genie</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 px-8 text-base font-bold rounded-xl bg-[var(--cloud)] border-[var(--iron)] text-[var(--night)] hover:bg-[var(--mist)] transition-colors"
            >
              <Link href="/contact">Request Custom Tool</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
