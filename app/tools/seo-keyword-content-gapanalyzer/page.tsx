"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  Search,
  Target,
  Globe,
  MapPin,
  Tag,
  BarChart3,
  Copy,
  Printer,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  CheckCircle,
  TrendingUp,
  LayoutTemplate,
  Users,
  Wrench,
  Download,
  DollarSign,
  ChevronRight,
  ExternalLink
} from "lucide-react"

// --- Types ---
interface Competitor {
  name: string;
  type: string; // Direct | Indirect | Marketplace
  serviceMatch: string; // High | Medium | Low
  reason: string;
  keywords: string[];
  url: string;
}

interface SeoFixRecommendation {
  issue: string;
  priority: string;
  action: string;
}

interface KeywordOpportunity {
  keyword: string;
  intent: string;
  difficulty: string;
  priority: string;
  tag: string;
}

interface ContentGap {
  gap: string;
  whyItMatters: string;
  recommendedAction: string;
  priority: string;
}

interface KeywordCluster {
  clusterName: string;
  keywords: string[];
  recommendedPage: string;
}

interface ContentRoadmapItem {
  type: string;
  title: string;
  keyword: string;
  priority: string;
}

interface ContentStrategy {
  localKeywordClusters: KeywordCluster[];
  contentRoadmap: ContentRoadmapItem[];
}

interface CompetitorLearning {
  insight: string;
  suggestion: string;
}

interface ActionPlanItem {
  day: string;
  action: string;
}

interface RevenueOpportunity {
  level: string;
  summary: string;
  reason: string;
}

interface ReportData {
  competitorDiscoveryStatus?: string;
  websiteSnapshot: {
    businessSummary: string;
    businessCategory: string;
    targetAudience: string;
    locationSignals: string[];
    seoReadinessScore: number;
    topIssues: string[];
  };
  competitors: Competitor[];
  seoFixRecommendations: SeoFixRecommendation[];
  keywordOpportunities: KeywordOpportunity[];
  contentGaps: ContentGap[];
  contentStrategy: ContentStrategy;
  competitorLearnings: CompetitorLearning[];
  sevenDayActionPlan: ActionPlanItem[];
  revenueOpportunity: RevenueOpportunity;
}

export default function KeywordContentGapReport() {
  const [formData, setFormData] = useState({
    websiteUrl: "",
    location: "India",
    industry: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reportData, setReportData] = useState<ReportData | null>(null)

  // Loading Steps State
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0)
  const loadingSteps = [
    "Analyzing website...",
    "Finding competitors...",
    "Calculating SEO score...",
    "Generating keywords...",
    "Identifying gaps...",
    "Building strategy..."
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setCurrentLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev))
      }, 1500)
    } else {
      setCurrentLoadingStep(0)
    }
    return () => clearInterval(interval)
  }, [loading, loadingSteps.length])

  const normalizeWebhookResponse = (response: any): ReportData => {
    const dataObj = Array.isArray(response) ? response[0] : response;

    if (dataObj.success === false) {
      throw new Error(dataObj.message || "Report generation failed. Please check the website URL and try again.")
    }

    const data = dataObj.data || {};
    const snapshot = data.websiteSnapshot || {};

    return {
      competitorDiscoveryStatus: data.competitorDiscoveryStatus || "complete",
      websiteSnapshot: {
        businessSummary: snapshot.businessSummary || "Not specified",
        businessCategory: snapshot.businessCategory || "Not specified",
        targetAudience: snapshot.targetAudience || "Not specified",
        locationSignals: Array.isArray(snapshot.locationSignals) ? snapshot.locationSignals : [],
        seoReadinessScore: typeof snapshot.seoReadinessScore === 'number' ? snapshot.seoReadinessScore : 0,
        topIssues: Array.isArray(snapshot.topIssues) ? snapshot.topIssues : [],
      },
      competitors: Array.isArray(data.competitors) ? data.competitors.map((c: any) => ({
        ...c,
        keywords: Array.isArray(c.keywords) ? c.keywords : []
      })) : [],
      seoFixRecommendations: Array.isArray(data.seoFixRecommendations) ? data.seoFixRecommendations : [],
      keywordOpportunities: Array.isArray(data.keywordOpportunities) ? data.keywordOpportunities : [],
      contentGaps: Array.isArray(data.contentGaps) ? data.contentGaps : [],
      contentStrategy: {
        localKeywordClusters: Array.isArray(data.contentStrategy?.localKeywordClusters) ? data.contentStrategy.localKeywordClusters.map((lc: any) => ({
          ...lc,
          keywords: Array.isArray(lc.keywords) ? lc.keywords : []
        })) : [],
        contentRoadmap: Array.isArray(data.contentStrategy?.contentRoadmap) ? data.contentStrategy.contentRoadmap : [],
      },
      competitorLearnings: Array.isArray(data.competitorLearnings) ? data.competitorLearnings : [],
      sevenDayActionPlan: Array.isArray(data.sevenDayActionPlan) ? data.sevenDayActionPlan : [],
      revenueOpportunity: {
        level: data.revenueOpportunity?.level || "Unknown",
        summary: data.revenueOpportunity?.summary || "No specific revenue summary provided.",
        reason: data.revenueOpportunity?.reason || "Based on initial signals.",
      }
    }
  }

  const generateReport = async (payload: any) => {
    const WEBHOOK_URL = "https://n8n.srv832341.hstgr.cloud/webhook/keyword-content-gap-report"

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error("Network error or invalid response from server.")
    }

    const json = await response.json()
    return normalizeWebhookResponse(json)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setReportData(null)

    const payload = {
      websiteUrl: formData.websiteUrl,
      location: formData.location.trim() || "India",
      industry: formData.industry.trim() || "",
      sourceTool: "keyword_content_gap_report",
      submittedAt: new Date().toISOString()
    }

    try {
      const result = await generateReport(payload)
      setReportData(result)
    } catch (err: any) {
      console.error("Webhook Error:", err)
      setError("Report generation failed. Please check the website URL and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleCopyKeywords = () => {
    if (!reportData) return;
    const kwText = reportData.keywordOpportunities.map(k => k.keyword).join('\n');
    navigator.clipboard.writeText(kwText).then(() => {
      alert("Keywords copied to clipboard!")
    }).catch(() => {
      alert("Failed to copy keywords.")
    });
  }

  const handleCopyReport = () => {
    if (!reportData) return;

    let text = `Keyword + Content Gap Report for ${formData.websiteUrl}\n\n`;
    text += `=== SEO Snapshot ===\n`;
    text += `Business Summary: ${reportData.websiteSnapshot.businessSummary}\n`;
    text += `Category: ${reportData.websiteSnapshot.businessCategory}\n`;
    text += `Target Audience: ${reportData.websiteSnapshot.targetAudience}\n`;
    text += `SEO Score: ${reportData.websiteSnapshot.seoReadinessScore}/100\n\n`;

    text += `=== Keyword Opportunities ===\n`;
    reportData.keywordOpportunities.forEach(k => {
      text += `- ${k.keyword} [Intent: ${k.intent}, Difficulty: ${k.difficulty}, Priority: ${k.priority}]\n`;
    })
    text += `\n`;

    text += `=== Content Gaps ===\n`;
    reportData.contentGaps.forEach(g => {
      text += `- ${g.gap} (Priority: ${g.priority})\n  Why: ${g.whyItMatters}\n  Action: ${g.recommendedAction}\n`;
    })
    text += `\n`;

    text += `=== 7-Day Action Plan ===\n`;
    reportData.sevenDayActionPlan.forEach(a => {
      text += `${a.day}: ${a.action}\n`;
    })

    navigator.clipboard.writeText(text).then(() => {
      alert("Report copied to clipboard!")
    }).catch(() => {
      alert("Failed to copy report.")
    });
  }

  const handlePrint = () => {
    window.print();
  }

  const resetForm = () => {
    setReportData(null)
    setFormData({ websiteUrl: "", location: "India", industry: "" })
    setError(null)
  }

  // --- Helpers ---
  const getScoreColor = (score: number) => {
    if (score <= 40) return "text-red-500 border-red-200 bg-red-50";
    if (score <= 70) return "text-yellow-600 border-yellow-200 bg-yellow-50";
    return "text-green-600 border-green-200 bg-green-50";
  }

  const getCompetitorTypeBadge = (type: string) => {
    const t = type.toLowerCase();
    if (t === 'direct') return "bg-red-100 text-red-700";
    if (t === 'indirect') return "bg-yellow-100 text-yellow-700";
    if (t === 'marketplace') return "bg-blue-100 text-blue-700";
    return "bg-slate-100 text-slate-700";
  }

  const getServiceMatchBadge = (match: string) => {
    const m = match.toLowerCase();
    if (m === 'high') return "bg-green-100 text-green-700";
    if (m === 'medium') return "bg-orange-100 text-orange-700";
    if (m === 'low') return "bg-slate-100 text-slate-700";
    return "bg-slate-100 text-slate-700";
  }

  return (
    <div className="min-h-screen bg-slate-50 section-bg print:bg-white pb-20">

      {/* Hero Section */}
      <div className="bg-white border-b print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-sm">
              <Search className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Keyword + Content Gap Report</h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-6">
            Find keyword opportunities, missing content, and simple SEO actions for your website.
          </p>
          <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            Minimal input. Practical output. Built for business websites.
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Input Card */}
        {!loading && !reportData && (
          <Card className="max-w-2xl mx-auto shadow-sm border-slate-200">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-red-800 font-medium text-sm">{error}</p>
                      {process.env.NODE_ENV === 'development' && (
                        <p className="text-red-500 text-xs mt-1">Dev note: Webhook likely returned 404/CORS. Make sure N8N is running.</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="websiteUrl" className="text-slate-800 font-semibold flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-500" />
                    Website URL <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="websiteUrl"
                    name="websiteUrl"
                    type="url"
                    value={formData.websiteUrl}
                    onChange={handleInputChange}
                    placeholder="https://yourwebsite.com"
                    required
                    className="h-12 border-slate-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-slate-800 font-semibold flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      Business Location
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="India, Kerala, UAE..."
                      className="h-12 border-slate-200 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-slate-800 font-semibold flex items-center gap-2">
                      <Tag className="w-4 h-4 text-slate-500" />
                      Industry / Topic
                    </Label>
                    <Input
                      id="industry"
                      name="industry"
                      type="text"
                      value={formData.industry}
                      onChange={handleInputChange}
                      placeholder="SaaS, healthcare, e-commerce..."
                      className="h-12 border-slate-200 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white h-14 text-lg rounded-xl shadow-sm transition-colors">
                  Generate Keyword + Content Gap Report
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Loading Section */}
        {loading && (
          <Card className="max-w-2xl mx-auto shadow-sm border-slate-200 text-center py-16">
            <CardContent>
              <div className="flex justify-center mb-6">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Analyzing your website</h3>

              <div className="space-y-4 max-w-sm mx-auto text-left">
                {loadingSteps.map((step, index) => {
                  const isActive = index === currentLoadingStep;
                  const isPast = index < currentLoadingStep;
                  return (
                    <div key={index} className={`flex items-center gap-3 transition-opacity duration-300 ${isPast || isActive ? 'opacity-100' : 'opacity-40'}`}>
                      {isPast ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : isActive ? (
                        <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-200" />
                      )}
                      <span className={`font-medium ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>{step}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Report Output Section */}
        {reportData && !loading && (
          <div className="space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-4">

            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 print:hidden">
              <Button onClick={resetForm} variant="outline" className="border-slate-300 text-slate-700">
                &larr; New Report
              </Button>
              <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap w-full sm:w-auto">
                <Button onClick={handleCopyReport} variant="outline" className="flex-1 sm:flex-none gap-2 border-slate-300 text-slate-700">
                  <Copy className="w-4 h-4" /> Copy Report
                </Button>
                <Button onClick={handlePrint} className="flex-1 sm:flex-none gap-2 bg-slate-900 hover:bg-slate-800 text-white">
                  <Download className="w-4 h-4" /> Download Full Report
                </Button>
              </div>
            </div>

            <div className="print:block mb-8 hidden">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Keyword + Content Gap Report</h1>
              <p className="text-slate-600">{formData.websiteUrl}</p>
            </div>

            {/* 1. Header Summary */}
            <Card className="shadow-sm border-slate-200 overflow-hidden break-inside-avoid">
              <div className="bg-slate-900 px-6 py-4 border-b border-slate-800">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-400" /> Header Summary
                </h2>
              </div>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">

                  <div className="p-6 md:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Business Summary</h3>
                      <p className="text-slate-900">{reportData.websiteSnapshot.businessSummary}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Category</h3>
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">{reportData.websiteSnapshot.businessCategory}</Badge>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Audience</h3>
                        <p className="text-sm text-slate-800">{reportData.websiteSnapshot.targetAudience}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Location</h3>
                        <div className="flex flex-wrap gap-1">
                          {reportData.websiteSnapshot.locationSignals.length > 0
                            ? reportData.websiteSnapshot.locationSignals.map((loc, i) => (
                              <Badge key={i} variant="outline" className="text-xs border-slate-200 text-slate-600">{loc}</Badge>
                            ))
                            : <span className="text-sm text-slate-500">Unspecified</span>}
                        </div>
                      </div>
                    </div>

                    {reportData.websiteSnapshot.topIssues.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Top Issues</h3>
                        <div className="flex flex-wrap gap-2">
                          {reportData.websiteSnapshot.topIssues.slice(0, 3).map((issue, i) => (
                            <Badge key={i} variant="destructive" className="bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 font-normal">
                              <AlertCircle className="w-3 h-3 mr-1" /> {issue}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col justify-center items-center text-center">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">SEO Score</h3>
                    <div className={`relative w-32 h-32 flex items-center justify-center rounded-full shadow-sm border-[6px] mb-4 ${getScoreColor(reportData.websiteSnapshot.seoReadinessScore)}`}>
                      <span className="text-5xl font-bold tracking-tighter">
                        {reportData.websiteSnapshot.seoReadinessScore}
                      </span>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* 2. Competitors Section */}
            <div className="space-y-4 break-inside-avoid">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-500" /> Top Competitors in Your Market
                </h3>
              </div>

              {reportData.competitorDiscoveryStatus === 'limited' && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2 text-yellow-800 text-sm">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  Limited competitor data. Showing best available insights.
                </div>
              )}

              {reportData.competitors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {reportData.competitors.map((comp, i) => (
                    <Card key={i} className="shadow-sm border-slate-200 flex flex-col h-full">
                      <CardContent className="p-5 flex-grow flex flex-col">
                        <h4 className="font-bold text-slate-900 mb-2 truncate" title={comp.name}>{comp.name}</h4>
                        <div className="flex gap-2 mb-3 flex-wrap">
                          <Badge variant="secondary" className={`${getCompetitorTypeBadge(comp.type)} border-0 text-xs`}>{comp.type}</Badge>
                          <Badge variant="secondary" className={`${getServiceMatchBadge(comp.serviceMatch)} border-0 text-xs`}>{comp.serviceMatch} Match</Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{comp.reason}</p>

                        <div className="mt-auto">
                          <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Key Targets</p>
                          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {(comp.keywords || []).map((kw, idx) => (
                              <span key={idx} className="whitespace-nowrap bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md">{kw}</span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100">
                          {comp.url && comp.url !== "Not verified" ? (
                            <a href={comp.url} target="_blank" rel="noopener noreferrer" className="w-full inline-flex justify-center items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                              Visit Website <ExternalLink className="w-4 h-4" />
                            </a>
                          ) : (
                            <Button disabled variant="outline" className="w-full text-slate-400 bg-slate-50 border-slate-200">
                              Not Verified
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">No competitor data identified.</p>
              )}
            </div>

            {/* 3. SEO Score + Fixes (Merged UX) */}
            <div className="space-y-4 break-inside-avoid">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Wrench className="w-5 h-5 text-orange-500" /> SEO Score & Fixes
              </h3>
              <Card className="shadow-sm border-slate-200">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    <div className="p-6 bg-slate-50">
                      <h4 className="font-semibold text-slate-900 mb-4">Detected Issues</h4>
                      <ul className="space-y-4">
                        {reportData.seoFixRecommendations.length > 0 ? reportData.seoFixRecommendations.map((fix, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                            <span className="text-sm text-slate-700">{fix.issue}</span>
                          </li>
                        )) : (
                          <p className="text-slate-500 text-sm">No major issues found.</p>
                        )}
                      </ul>
                    </div>
                    <div className="p-6 bg-white">
                      <h4 className="font-semibold text-slate-900 mb-4">Recommended Actions</h4>
                      <ul className="space-y-4">
                        {reportData.seoFixRecommendations.length > 0 ? reportData.seoFixRecommendations.map((fix, i) => (
                          <li key={i} className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <div>
                              <Badge className={fix.priority.toLowerCase() === 'high' ? 'bg-red-100 text-red-700 hover:bg-red-200 mb-1 border-0' : 'bg-slate-200 text-slate-700 mb-1 border-0'}>
                                {fix.priority} Priority
                              </Badge>
                              <p className="text-sm text-slate-900 font-medium">{fix.action}</p>
                            </div>
                          </li>
                        )) : (
                          <p className="text-slate-500 text-sm">Keep up the good work!</p>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 4. Keyword Opportunities */}
            <div className="space-y-4 break-inside-avoid">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-500" /> Keyword Opportunities
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">Based on competitor and local demand signals.</p>
                </div>
                <Button onClick={handleCopyKeywords} variant="outline" size="sm" className="gap-2 print:hidden">
                  <Copy className="w-4 h-4" /> Copy All Keywords
                </Button>
              </div>
              <Card className="shadow-sm border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                        <th className="p-4 font-semibold">Keyword</th>
                        <th className="p-4 font-semibold">Intent</th>
                        <th className="p-4 font-semibold">Difficulty</th>
                        <th className="p-4 font-semibold">Priority</th>
                        <th className="p-4 font-semibold">Tag</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {reportData.keywordOpportunities.length > 0 ? reportData.keywordOpportunities.map((kw, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors bg-white">
                          <td className="p-4 font-bold text-slate-900">{kw.keyword}</td>
                          <td className="p-4">
                            <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-normal">{kw.intent}</Badge>
                          </td>
                          <td className="p-4">
                            <span className={`text-xs font-medium px-2 py-1 rounded-md border ${kw.difficulty.toLowerCase() === 'high' ? 'border-red-200 text-red-700 bg-red-50' : kw.difficulty.toLowerCase() === 'medium' ? 'border-orange-200 text-orange-700 bg-orange-50' : 'border-green-200 text-green-700 bg-green-50'}`}>
                              {kw.difficulty}
                            </span>
                          </td>
                          <td className="p-4">
                            <Badge className={kw.priority.toLowerCase() === 'high' ? 'bg-orange-500 hover:bg-orange-600 font-normal' : 'bg-slate-500 font-normal'}>
                              {kw.priority}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{kw.tag}</span>
                          </td>
                        </tr>
                      )) : (
                        <tr className="bg-white">
                          <td colSpan={5} className="p-8 text-center text-slate-500">No keyword opportunities found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* 5. Content Gaps */}
            <div className="space-y-4 break-inside-avoid">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <LayoutTemplate className="w-5 h-5 text-orange-500" /> Content Gaps
                </h3>
                <p className="text-sm text-slate-500 mt-1">Identified vs competitor patterns.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportData.contentGaps.length > 0 ? reportData.contentGaps.map((gap, i) => (
                  <Card key={i} className="shadow-sm border-slate-200 bg-white">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <h4 className="font-bold text-slate-900 leading-tight">{gap.gap}</h4>
                        <Badge className={gap.priority.toLowerCase() === 'high' ? 'bg-red-100 text-red-700 hover:bg-red-200 border-0 shrink-0' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 shrink-0'}>
                          {gap.priority}
                        </Badge>
                      </div>
                      <div className="space-y-3 text-sm">
                        <p className="text-slate-600"><span className="font-semibold text-slate-800">Why it matters:</span> {gap.whyItMatters}</p>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2">
                          <p className="text-slate-700 font-medium flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            <span>{gap.recommendedAction}</span>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <p className="text-slate-500 text-sm">No content gaps identified.</p>
                )}
              </div>
            </div>

            {/* 6. Content Strategy */}
            <div className="space-y-6 break-inside-avoid">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <TrendingUp className="w-5 h-5 text-orange-500" /> Content Strategy
              </h3>

              {/* Local Keyword Clusters */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-slate-800">Local Keyword Clusters</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportData.contentStrategy.localKeywordClusters.length > 0 ? reportData.contentStrategy.localKeywordClusters.map((cluster, i) => (
                    <Card key={i} className="shadow-sm border-slate-200 bg-white">
                      <CardContent className="p-5">
                        <h5 className="font-bold text-slate-900 mb-3">{cluster.clusterName}</h5>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(cluster.keywords || []).map((kw, idx) => (
                            <span key={idx} className="bg-orange-50 text-orange-700 text-xs px-2 py-1 rounded-md border border-orange-100">{kw}</span>
                          ))}
                        </div>
                        <div className="bg-slate-50 p-2 rounded border border-slate-100 text-sm flex flex-col sm:flex-row sm:items-center gap-2">
                          <span className="font-semibold text-slate-600 shrink-0">Recommended Page:</span>
                          <span className="text-blue-600 truncate">{cluster.recommendedPage}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )) : (
                    <p className="text-slate-500 text-sm">No local clusters identified.</p>
                  )}
                </div>
              </div>

              {/* Content Roadmap */}
              <div className="space-y-4 mt-6">
                <h4 className="text-lg font-semibold text-slate-800">Content Roadmap</h4>
                <Card className="shadow-sm border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                          <th className="p-4 font-semibold">Type</th>
                          <th className="p-4 font-semibold w-1/3">Title</th>
                          <th className="p-4 font-semibold">Target Keyword</th>
                          <th className="p-4 font-semibold">Priority</th>
                          <th className="p-4 font-semibold text-right print:hidden">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {reportData.contentStrategy.contentRoadmap.length > 0 ? reportData.contentStrategy.contentRoadmap.map((item, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors bg-white">
                            <td className="p-4"><Badge variant="outline" className="text-slate-600 bg-white">{item.type}</Badge></td>
                            <td className="p-4 font-medium text-slate-900">{item.title}</td>
                            <td className="p-4 text-slate-600">{item.keyword}</td>
                            <td className="p-4">
                              <Badge className={item.priority.toLowerCase() === 'high' ? 'bg-orange-500' : 'bg-slate-500'}>
                                {item.priority}
                              </Badge>
                            </td>
                            <td className="p-4 text-right print:hidden">
                              <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-medium">
                                Use this topic <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            </td>
                          </tr>
                        )) : (
                          <tr className="bg-white">
                            <td colSpan={5} className="p-8 text-center text-slate-500">No roadmap items available.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 break-inside-avoid">

              {/* 7. Competitor Learnings */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-orange-500" /> Competitor Learnings
                </h3>
                <div className="space-y-3">
                  {reportData.competitorLearnings.length > 0 ? reportData.competitorLearnings.slice(0, 5).map((learning, i) => (
                    <Card key={i} className="shadow-sm border-slate-200 bg-white">
                      <CardContent className="p-4">
                        <p className="font-semibold text-slate-900 mb-1">{learning.insight}</p>
                        <p className="text-sm text-slate-600">{learning.suggestion}</p>
                      </CardContent>
                    </Card>
                  )) : (
                    <p className="text-slate-500 text-sm">No competitor learnings available.</p>
                  )}
                </div>
              </div>

              {/* 8. 7-Day Action Plan */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-500" /> 7-Day Action Plan
                </h3>
                <Card className="shadow-sm border-slate-200 bg-white h-full">
                  <CardContent className="p-6">
                    <div className="relative border-l-2 border-slate-200 ml-3 md:ml-4 space-y-6 py-2">
                      {reportData.sevenDayActionPlan.length > 0 ? reportData.sevenDayActionPlan.map((plan, i) => (
                        <div key={i} className="relative pl-6 md:pl-8 group">
                          <div className="absolute w-4 h-4 bg-white border-2 border-orange-400 rounded-full -left-[9px] top-1 group-hover:border-orange-500 group-hover:bg-orange-50 transition-colors"></div>
                          <div>
                            <span className="text-xs font-bold text-orange-500 uppercase tracking-wider block mb-1">{plan.day}</span>
                            <p className="text-slate-800 font-medium">{plan.action}</p>
                          </div>
                        </div>
                      )) : (
                        <p className="text-slate-500 text-sm pl-6">No action plan available.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>

            {/* 9. Revenue Opportunity (Bottom Highlight) */}
            <div className="mt-12 break-inside-avoid">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-white shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-10">
                  <DollarSign className="w-48 h-48" />
                </div>
                <div className="relative z-10 max-w-3xl">
                  <Badge className="bg-white text-orange-600 hover:bg-slate-50 mb-4 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    {reportData.revenueOpportunity.level} Revenue Opportunity
                  </Badge>
                  <h3 className="text-2xl font-bold mb-3 leading-tight">{reportData.revenueOpportunity.summary}</h3>
                  <p className="text-orange-50 font-medium opacity-90">{reportData.revenueOpportunity.reason}</p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
// For Warning badge in competitor section
function AlertTriangle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}
