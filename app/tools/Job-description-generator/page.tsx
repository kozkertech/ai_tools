"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Plus,
  Minus,
  Briefcase,
  MapPin,
  Building,
  Clock,
  DollarSign,
  User,
  FileText,
  CheckCircle,
  AlertCircle,
  Copy,
  Download,
  ChevronDown,
  Loader2,
  Trash2,
  Eye,
  FileDown,
  Sparkles,
  XCircle,
  Zap,
  Target,
  ChevronRight
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FormData {
  job_title: string
  department: string
  employment_type: string
  location: string
  salary_range: string
  experience_level: string
  job_summary: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
}

interface DynamicListProps {
  items: string[]
  onChange: (items: string[]) => void
  placeholder: string
  label: string
  icon: React.ReactNode
  note: string
}

function DynamicList({ items, onChange, placeholder, label, icon, note }: DynamicListProps) {
  const addItem = () => {
    onChange([...items, ""])
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, value: string) => {
    const newItems = [...items]
    newItems[index] = value
    onChange(newItems)
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--cloud)] border border-[var(--iron)] flex items-center justify-center text-[#FF7435]">
            {icon}
          </div>
          <div>
            <Label className="field-label !mb-0">{label}</Label>
            <p className="text-[10px] text-[var(--steel)] font-medium uppercase tracking-widest">{note}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex gap-3 items-start group">
            <div className="flex-1">
              <Textarea
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                placeholder={placeholder}
                className="input min-h-[80px] py-3 text-sm focus:border-[#FF7435]/50"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeItem(index)}
              className="mt-2 text-[var(--steel)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 h-9 w-9 p-0 rounded-xl"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addItem}
        className="btn-secondary w-full py-6 h-auto border-dashed border-2 bg-transparent hover:bg-[var(--cloud)]/50"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add {label.slice(0, -1)}
      </Button>
    </div>
  )
}

export default function JobDescriptionWriter() {
  const { toast } = useToast()
  const WEBHOOK_URL = "https://n8n.srv832341.hstgr.cloud/webhook-test/job-description"
  const [formData, setFormData] = useState<FormData>({
    job_title: "",
    department: "",
    employment_type: "",
    location: "",
    salary_range: "",
    experience_level: "",
    job_summary: "",
    responsibilities: [],
    requirements: [],
    benefits: [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [isResponseOpen, setIsResponseOpen] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)

  // Auto-save to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("job-description-draft")
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setFormData(parsed.formData || formData)
      } catch (e) {
        console.error("Failed to parse saved data")
      }
    }
  }, [])

  useEffect(() => {
    const dataToSave = { formData }
    localStorage.setItem("job-description-draft", JSON.stringify(dataToSave))
  }, [formData])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.job_title.trim()) newErrors.job_title = "Job title is required"
    if (!formData.department.trim()) newErrors.department = "Department is required"
    if (!formData.employment_type) newErrors.employment_type = "Employment type is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.experience_level) newErrors.experience_level = "Experience level is required"
    if (!formData.job_summary.trim()) newErrors.job_summary = "Job summary is required"
    if (formData.job_summary.length > 500) newErrors.job_summary = "Job summary must be 500 characters or less"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const generateSampleData = () => {
    setFormData({
      job_title: "Senior Software Engineer",
      department: "Engineering",
      employment_type: "Full-time",
      location: "San Francisco, CA",
      salary_range: "$120,000 - $160,000",
      experience_level: "Senior",
      job_summary:
        "We are seeking a talented Senior Software Engineer to join our growing engineering team. You will be responsible for designing, developing, and maintaining scalable web applications while mentoring junior developers.",
      responsibilities: [
        "Design and develop scalable web applications",
        "Collaborate with cross-functional teams",
        "Mentor junior developers",
        "Participate in code reviews",
      ],
      requirements: [
        "5+ years of software development experience",
        "Proficiency in React, Node.js, and TypeScript",
        "Experience with cloud platforms (AWS/GCP)",
        "Strong problem-solving skills",
      ],
      benefits: [
        "Competitive salary and equity",
        "Health, dental, and vision insurance",
        "Flexible work arrangements",
        "Professional development budget",
      ],
    })
    toast({
      title: "Sample data generated",
      description: "Form has been filled with sample job description data.",
    })
  }

  const clearForm = () => {
    if (confirm("Are you sure you want to clear all form data?")) {
      setFormData({
        job_title: "",
        department: "",
        employment_type: "",
        location: "",
        salary_range: "",
        experience_level: "",
        job_summary: "",
        responsibilities: [],
        requirements: [],
        benefits: [],
      })
      setResponse(null)
      setErrors({})
      localStorage.removeItem("job-description-draft")
      toast({
        title: "Form cleared",
        description: "All form data has been cleared.",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        job_title: formData.job_title,
        department: formData.department,
        employment_type: formData.employment_type,
        location: formData.location,
        salary_range: formData.salary_range || null,
        experience_level: formData.experience_level,
        job_summary: formData.job_summary,
        responsibilities:
          formData.responsibilities.filter((r) => r.trim()).length > 0
            ? formData.responsibilities.filter((r) => r.trim())
            : null,
        requirements:
          formData.requirements.filter((r) => r.trim()).length > 0
            ? formData.requirements.filter((r) => r.trim())
            : null,
        benefits:
          formData.benefits.filter((b) => b.trim()).length > 0 ? formData.benefits.filter((b) => b.trim()) : null,
      }

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const responseData = await response.text()
      let parsedResponse

      try {
        parsedResponse = JSON.parse(responseData)
      } catch {
        parsedResponse = { raw_response: responseData, status: response.status }
      }

      setResponse({
        status: response.status,
        data: parsedResponse,
        timestamp: new Date().toISOString(),
      })
      setIsResponseOpen(true)

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Job description generated successfully.",
        })
      } else {
        toast({
          title: "Submission Error",
          description: `Server responded with status ${response.status}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Submission error:", error)
      setResponse({
        status: "error",
        data: { error: error instanceof Error ? error.message : "Unknown error occurred" },
        timestamp: new Date().toISOString(),
      })
      setIsResponseOpen(true)
      toast({
        title: "Network Error",
        description: "Failed to submit job description. Please check your connection.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Job description copied to clipboard.",
    })
  }

  const downloadAsJson = () => {
    const dataStr = JSON.stringify(response, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `job-description-response-${Date.now()}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const downloadAsPdf = async () => {
    const htmlContent = getJobDescriptionText()
    const plainTextContent = getPlainTextContent()

    if (!htmlContent && !plainTextContent && !formData.job_title) {
      toast({
        title: "Error",
        description: "No job description content available for PDF generation.",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingPdf(true)

    try {
      const { jsPDF } = await import("jspdf")
      const doc = new jsPDF()
      doc.setFont("helvetica")
      let yPosition = 20
      doc.setFontSize(22)
      doc.setTextColor(26, 26, 26) 
      const title = formData.job_title || "Job Description"
      doc.text(title, 20, yPosition)
      yPosition += 10
      doc.setDrawColor(255, 116, 53)
      doc.setLineWidth(1)
      doc.line(20, yPosition, 190, yPosition)
      yPosition += 15

      if (formData.department || formData.employment_type || formData.location || formData.experience_level) {
        doc.setFillColor(250, 250, 248) 
        doc.rect(20, yPosition - 5, 170, 25, "F")
        doc.setFontSize(10)
        doc.setTextColor(115, 115, 115) 
        const details = []
        if (formData.department) details.push(`Dept: ${formData.department}`)
        if (formData.employment_type) details.push(`Type: ${formData.employment_type}`)
        if (formData.location) details.push(`Loc: ${formData.location}`)
        if (formData.experience_level) details.push(`Exp: ${formData.experience_level}`)
        const detailText = details.join(" | ")
        const detailLines = doc.splitTextToSize(detailText, 160)
        doc.text(detailLines, 25, yPosition + 7)
        yPosition += 30
      }

      if (formData.salary_range) {
        doc.setFontSize(14)
        doc.setTextColor(255, 116, 53)
        doc.text(`Salary Range: ${formData.salary_range}`, 20, yPosition)
        yPosition += 15
      }

      const addSection = (title: string, content: string, isHtml = false) => {
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 20
        }
        doc.setFontSize(16)
        doc.setTextColor(26, 26, 26)
        doc.text(title, 20, yPosition)
        yPosition += 10
        let processedContent = content
        if (isHtml) {
          processedContent = content
            .replace(/<[^>]*>/g, "")
            .replace(/&nbsp;/g, " ")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/\s+/g, " ")
            .trim()
        }
        const paragraphs = processedContent.split("\n\n").filter((p) => p.trim())
        doc.setFontSize(11)
        doc.setTextColor(64, 64, 64)
        paragraphs.forEach((paragraph) => {
          if (paragraph.trim()) {
            if (yPosition > 270) {
              doc.addPage()
              yPosition = 20
            }
            if (paragraph.includes("•") || paragraph.includes("-")) {
              const lines = paragraph.split("\n").filter((line) => line.trim())
              lines.forEach((line) => {
                if (yPosition > 270) {
                  doc.addPage()
                  yPosition = 20
                }
                const cleanLine = line.trim().replace(/^[•\-*]\s*/, "• ")
                const wrappedLines = doc.splitTextToSize(cleanLine, 165)
                doc.text(wrappedLines, 25, yPosition)
                yPosition += wrappedLines.length * 5 + 2
              })
            } else {
              const wrappedLines = doc.splitTextToSize(paragraph.trim(), 170)
              doc.text(wrappedLines, 20, yPosition)
              yPosition += wrappedLines.length * 5 + 5
            }
          }
        })
        yPosition += 5
      }

      if (plainTextContent && plainTextContent.trim()) {
        const sections = parseGeneratedContent(plainTextContent)
        if (sections.summary) addSection("Job Summary", sections.summary)
        if (sections.responsibilities) addSection("Key Responsibilities", sections.responsibilities)
        if (sections.requirements) addSection("Requirements & Qualifications", sections.requirements)
        if (sections.benefits) addSection("Benefits & Perks", sections.benefits)
        if (sections.additional) addSection("Additional Information", sections.additional)
      } else {
        if (formData.job_summary) addSection("Job Summary", formData.job_summary)
        if (formData.responsibilities.filter((r) => r.trim()).length > 0) {
          const text = formData.responsibilities.filter((r) => r.trim()).map((r) => `• ${r}`).join("\n")
          addSection("Key Responsibilities", text)
        }
        if (formData.requirements.filter((r) => r.trim()).length > 0) {
          const text = formData.requirements.filter((r) => r.trim()).map((r) => `• ${r}`).join("\n")
          addSection("Requirements & Qualifications", text)
        }
        if (formData.benefits.filter((b) => b.trim()).length > 0) {
          const text = formData.benefits.filter((b) => b.trim()).map((b) => `• ${b}`).join("\n")
          addSection("Benefits & Perks", text)
        }
      }

      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.text(`Generated by Kozker AI Tools | Page ${i} of ${pageCount}`, 20, 285)
      }

      const filename = `job-description-${formData.job_title?.replace(/[^a-z0-9]/gi, "-").toLowerCase() || "untitled"}.pdf`
      doc.save(filename)
      toast({ title: "PDF Generated", description: "Successfully saved job description." })
    } catch (error) {
      console.error("PDF generation error:", error)
      toast({ title: "PDF Error", description: "Falling back to text file download.", variant: "destructive" })
      const text = generateTextContent()
      const blob = new Blob([text], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "job-description.txt"
      link.click()
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  const parseGeneratedContent = (content: string) => {
    const sections = { summary: "", responsibilities: "", requirements: "", benefits: "", additional: "" }
    const lines = content.split("\n").map((line) => line.trim()).filter((line) => line)
    let currentSection = "additional"
    let currentContent: string[] = []
    lines.forEach((line) => {
      const lowerLine = line.toLowerCase()
      if (lowerLine.includes("job summary") || lowerLine.includes("overview") || lowerLine.includes("description")) {
        if (currentContent.length > 0) sections[currentSection as keyof typeof sections] = currentContent.join("\n")
        currentContent = []
        currentSection = "summary"
      } else if (lowerLine.includes("responsibilities") || lowerLine.includes("duties") || lowerLine.includes("role")) {
        if (currentContent.length > 0) sections[currentSection as keyof typeof sections] = currentContent.join("\n")
        currentContent = []
        currentSection = "responsibilities"
      } else if (lowerLine.includes("requirements") || lowerLine.includes("qualifications") || lowerLine.includes("skills")) {
        if (currentContent.length > 0) sections[currentSection as keyof typeof sections] = currentContent.join("\n")
        currentContent = []
        currentSection = "requirements"
      } else if (lowerLine.includes("benefits") || lowerLine.includes("perks") || lowerLine.includes("compensation")) {
        if (currentContent.length > 0) sections[currentSection as keyof typeof sections] = currentContent.join("\n")
        currentContent = []
        currentSection = "benefits"
      } else {
        currentContent.push(line)
      }
    })
    if (currentContent.length > 0) sections[currentSection as keyof typeof sections] = currentContent.join("\n")
    return sections
  }

  const generateTextContent = () => {
    const plainTextContent = getPlainTextContent()
    return `JOB DESCRIPTION: ${formData.job_title}\n${plainTextContent}`
  }

  const extractHtmlFromMarkdown = (text: string) => {
    const htmlMatch = text.match(/```html\s*([\s\S]*?)\s*```/)
    if (htmlMatch && htmlMatch[1]) return htmlMatch[1].trim()
    return text
  }

  const getJobDescriptionText = () => {
    if (response?.data && Array.isArray(response.data) && response.data[0]?.text) {
      return extractHtmlFromMarkdown(response.data[0].text)
    }
    else if (response?.data?.text) {
      return extractHtmlFromMarkdown(response.data.text)
    }
    return null
  }

  const getPlainTextContent = () => {
    const htmlContent = getJobDescriptionText()
    if (!htmlContent) return ""
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = htmlContent
    return tempDiv.textContent || tempDiv.innerText || ""
  }

  return (
    <div className="min-h-screen bg-[var(--mist)] text-[var(--night)] transition-colors duration-300 py-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-[#FF7435] to-[#E6681F] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#FF7435]/20 transform hover:rotate-6 transition-transform">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-poppins tracking-tight">
              Job Description <span className="text-[#FF7435]">Writer</span>
            </h1>
          </div>
          <p className="text-lg md:text-xl text-[var(--steel)] font-medium max-w-2xl mx-auto leading-relaxed">
            Create comprehensive, high-quality job descriptions with our intelligent AI-powered form builder.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Builder Column */}
          <div className="lg:col-span-12 xl:col-span-6 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="card p-8 md:p-10 space-y-10 border-2 border-[var(--iron)]/50 bg-white dark:bg-zinc-900/40">
              <div className="flex items-center justify-between border-b border-[var(--iron)] pb-6">
                <div className="flex items-center gap-3">
                  <Settings2 className="w-6 h-6 text-[#FF7435]" />
                  <h2 className="text-xl font-black font-poppins">Post Configuration</h2>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={generateSampleData} className="btn-secondary h-9 px-4 text-xs font-bold rounded-xl border-dashed border-2">
                    <Zap className="w-4 h-4 mr-2" /> Load Sample
                  </Button>
                  <Button variant="ghost" size="sm" onClick={clearForm} className="h-9 text-[var(--steel)] hover:text-red-500 font-bold px-4 rounded-xl">
                    <Trash2 className="w-4 h-4 mr-2" /> Reset
                  </Button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Basic Info */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-[10px] font-black text-[var(--steel)] uppercase tracking-widest bg-[var(--cloud)] w-fit px-3 py-1.5 rounded-lg border border-[var(--iron)]/50">
                    <Building className="w-3 h-3" />
                    Essential Metadata
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="job_title" className="field-label">Precise Job Title</Label>
                      <Input
                        id="job_title"
                        value={formData.job_title}
                        onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                        placeholder="e.g. Lead Technical Architect"
                        className="input"
                        required
                      />
                      {errors.job_title && <p className="text-[10px] font-bold text-red-500">{errors.job_title}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department" className="field-label">Department / Unit</Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        placeholder="e.g. Cloud Operations"
                        className="input"
                        required
                      />
                      {errors.department && <p className="text-[10px] font-bold text-red-500">{errors.department}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="field-label">Employment Type</Label>
                      <Select value={formData.employment_type} onValueChange={(v) => handleInputChange("employment_type", v)}>
                        <SelectTrigger className="input">
                          <SelectValue placeholder="Contract" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--cloud)] border-[var(--iron)] font-medium">
                          {["Full-time", "Part-time", "Contract", "Freelance", "Internship"].map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.employment_type && <p className="text-[10px] font-bold text-red-500">{errors.employment_type}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="field-label">Exp. Level</Label>
                      <Select value={formData.experience_level} onValueChange={(v) => handleInputChange("experience_level", v)}>
                        <SelectTrigger className="input">
                          <SelectValue placeholder="Senior" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--cloud)] border-[var(--iron)] font-medium">
                          {["Junior", "Mid-level", "Senior", "Lead", "Director", "Executive"].map(l => (
                            <SelectItem key={l} value={l}>{l}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.experience_level && <p className="text-[10px] font-bold text-red-500">{errors.experience_level}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location" className="field-label">Primary Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Remote / NYC"
                        className="input"
                        required
                      />
                      {errors.location && <p className="text-[10px] font-bold text-red-500">{errors.location}</p>}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="salary_range" className="field-label">Salary / Compensation <span className="text-[var(--steel)] font-normal italic">(Optional)</span></Label>
                    <div className="relative">
                       <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--steel)]" />
                       <Input
                         id="salary_range"
                         value={formData.salary_range}
                         onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                         placeholder="e.g. $140,000 - $180,000 + Equity"
                         className="input pl-11"
                       />
                    </div>
                  </div>
                </div>

                {/* Job Summary */}
                <div className="space-y-6 pt-6 border-t border-[var(--iron)]/50">
                  <div className="flex items-center gap-2 text-[10px] font-black text-[var(--steel)] uppercase tracking-widest bg-[var(--cloud)] w-fit px-3 py-1.5 rounded-lg border border-[var(--iron)]/50">
                    <FileText className="w-3 h-3" />
                    Strategic Overview
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="job_summary" className="field-label flex justify-between">
                      Position Summary
                      <span className={`text-[9px] font-black ${formData.job_summary.length > 500 ? 'text-red-500' : 'text-[var(--steel)]'}`}>
                         {formData.job_summary.length} / 500
                      </span>
                    </Label>
                    <Textarea
                      id="job_summary"
                      value={formData.job_summary}
                      onChange={(e) => handleInputChange("job_summary", e.target.value)}
                      placeholder="Briefly hook the candidate..."
                      className="input min-h-[160px] leading-relaxed"
                      required
                    />
                    {errors.job_summary && <p className="text-[10px] font-bold text-red-500">{errors.job_summary}</p>}
                  </div>
                </div>

                {/* Lists with Collapsible Advanced Sections */}
                <div className="space-y-10 pt-6 border-t border-[var(--iron)]/50">
                  <DynamicList
                    items={formData.responsibilities}
                    onChange={(v) => handleInputChange("responsibilities", v)}
                    label="Core Responsibilities"
                    placeholder="e.g. Architect end-to-end data pipelines..."
                    icon={<Target className="w-4 h-4" />}
                    note="List the top 3-6 daily outcomes"
                  />

                  <DynamicList
                    items={formData.requirements}
                    onChange={(v) => handleInputChange("requirements", v)}
                    label="Qualifications & Requirements"
                    placeholder="e.g. Expert-level knowledge of Terraform..."
                    icon={<CheckCircle className="w-4 h-4" />}
                    note="Specify technical and soft skills"
                  />

                  <DynamicList
                    items={formData.benefits}
                    onChange={(v) => handleInputChange("benefits", v)}
                    label="Perks & Benefits"
                    placeholder="e.g. Unlimited PTO, Fitness stipend..."
                    icon={<Zap className="w-4 h-4" />}
                    note="What makes this role attractive?"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-8 text-xl h-auto font-black shadow-2xl shadow-[#FF7435]/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      Weaving Description...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6 mr-3" />
                      Generate Professional JD
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Result / Preview Column */}
          <div className="lg:col-span-12 xl:col-span-6 space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
            {response && isResponseOpen ? (
              <div className="space-y-8">
                <div className="card p-0 overflow-hidden shadow-2xl border-2 border-[var(--iron)] bg-white dark:bg-zinc-900/60 sticky top-12">
                  <div className="bg-[var(--cloud)]/80 backdrop-blur-md border-b border-[var(--iron)] py-6 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-[var(--iron)] flex items-center justify-center text-[#FF7435]">
                         <Eye className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-black font-poppins">JD Live Preview</h3>
                    </div>
                    <div className="flex gap-2">
                       <Button onClick={() => copyToClipboard(getPlainTextContent())} className="btn-secondary h-10 px-6 font-bold text-xs" variant="outline">
                          <Copy className="w-4 h-4 mr-2" /> Copy
                       </Button>
                       <Button onClick={downloadAsPdf} disabled={isGeneratingPdf} className="btn-primary h-10 px-6 font-bold text-xs">
                          {isGeneratingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4 mr-2" />}
                          Export PDF
                       </Button>
                    </div>
                  </div>

                  <div className="p-10 md:p-14 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    {getJobDescriptionText() ? (
                      <div 
                        className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-headings:font-poppins prose-headings:tracking-tight prose-headings:text-[var(--night)] prose-p:text-[var(--steel)] prose-p:leading-relaxed prose-li:text-[var(--steel)] prose-strong:text-[#FF7435] prose-strong:font-black"
                        dangerouslySetInnerHTML={{ __html: getJobDescriptionText()! }} 
                      />
                    ) : (
                      <div className="text-center py-20">
                         <Loader2 className="w-10 h-10 text-[#FF7435] animate-spin mx-auto mb-4" />
                         <p className="text-[var(--steel)] font-medium">Parsing the AI generation results...</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Data Backup */}
                <Collapsible className="card p-0 border border-[var(--iron)]/50 overflow-hidden bg-[var(--mist)]/50">
                    <CollapsibleTrigger asChild>
                       <Button variant="ghost" className="w-full flex justify-between p-6 h-auto hover:bg-[var(--cloud)] transition-colors">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--steel)]">Raw Response Data</span>
                          <ChevronDown className="w-4 h-4 text-[var(--steel)]" />
                       </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-8 border-t border-[var(--iron)]/50 bg-[var(--iron)]/5">
                        <pre className="text-[11px] font-mono text-[var(--steel)] overflow-auto max-h-48 custom-scrollbar">
                            {JSON.stringify(response.data, null, 2)}
                        </pre>
                    </CollapsibleContent>
                </Collapsible>
              </div>
            ) : (
              <div className="card p-24 flex flex-col items-center justify-center text-center space-y-10 border-dashed border-2 border-[var(--iron)] grayscale opacity-50 relative min-h-[600px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--cloud)]/30 to-transparent"></div>
                <div className="relative z-10 space-y-8">
                  <div className="w-24 h-24 bg-[var(--cloud)] rounded-[2.5rem] flex items-center justify-center mx-auto border border-[var(--iron)] shadow-inner transform -rotate-6">
                    <FileText className="w-12 h-12 text-[var(--steel)]" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black font-poppins text-[var(--night)] tracking-tight uppercase">High-End Preview</h3>
                    <p className="text-[var(--steel)] max-w-sm mx-auto font-medium text-lg leading-relaxed">
                      Complete the job profile on the left to generate a professional candidate-facing description.
                    </p>
                  </div>
                </div>
                
                <div className="w-full max-w-md pt-12 space-y-8 relative z-10 opacity-30 select-none pointer-events-none">
                   <div className="h-10 bg-[var(--iron)] rounded-2xl w-3/4 mx-auto"></div>
                   <div className="flex gap-4 justify-center">
                      <div className="w-24 h-6 bg-[var(--iron)] rounded-lg"></div>
                      <div className="w-24 h-6 bg-[var(--iron)] rounded-lg"></div>
                      <div className="w-24 h-6 bg-[var(--iron)] rounded-lg"></div>
                   </div>
                   <div className="space-y-4 pt-10">
                      <div className="h-4 bg-[var(--iron)] rounded-full w-full"></div>
                      <div className="h-4 bg-[var(--iron)] rounded-full w-full"></div>
                      <div className="h-20 bg-[var(--iron)] rounded-2xl w-full border border-dashed border-[var(--steel)]"></div>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Dynamic Stats Footer */}
       <div className="mt-24 border-t border-[var(--iron)] bg-[var(--cloud)]/30 py-20">
          <div className="max-w-[1440px] mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
             <div className="space-y-3">
                <div className="text-[var(--night)] font-black text-3xl font-poppins tracking-tighter">10,000+</div>
                <div className="text-[9px] font-black text-[var(--steel)] uppercase tracking-[0.2em]">Words Processed</div>
             </div>
             <div className="space-y-3">
                <div className="text-[var(--night)] font-black text-3xl font-poppins tracking-tighter">AI-POWERED</div>
                <div className="text-[9px] font-black text-[var(--steel)] uppercase tracking-[0.2em]">Optimization Engine</div>
             </div>
             <div className="space-y-3">
                <div className="text-[var(--night)] font-black text-3xl font-poppins tracking-tighter">ATS-READY</div>
                <div className="text-[9px] font-black text-[var(--steel)] uppercase tracking-[0.2em]">Format Integrity</div>
             </div>
             <div className="space-y-3">
                <div className="text-[var(--night)] font-black text-3xl font-poppins tracking-tighter">100% SECURE</div>
                <div className="text-[9px] font-black text-[var(--steel)] uppercase tracking-[0.2em]">Confidential Builder</div>
             </div>
          </div>
       </div>
    </div>
  )
}
