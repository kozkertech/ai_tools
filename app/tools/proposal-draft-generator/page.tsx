"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ContentLoadingScreen } from "@/components/loading-screen"
import { 
  CheckCircle, AlertCircle, Loader2, FileText, Download, Copy, Image as ImageIcon, 
  Upload, Trash, Printer, FileDown, Brush, ChevronRight, ChevronLeft, LayoutTemplate, 
  Sparkles, Globe, ListChecks, RefreshCw
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"
import * as docx from "docx"
import { saveAs } from "file-saver"

const FIRST_PAGE_HEADER_HEIGHT = 260;
const PAGE_HEIGHT = 1123;
const PAGE_WIDTH = 794;
const PAGE_PADDING_TOP = 48;
const PAGE_PADDING_BOTTOM = 48;
const PAGE_FOOTER_HEIGHT = 36;
const SAFE_GAP = 24;

const FIRST_PAGE_USABLE_HEIGHT =
  PAGE_HEIGHT -
  PAGE_PADDING_TOP -
  PAGE_PADDING_BOTTOM -
  PAGE_FOOTER_HEIGHT -
  FIRST_PAGE_HEADER_HEIGHT -
  SAFE_GAP;

const NORMAL_PAGE_USABLE_HEIGHT =
  PAGE_HEIGHT -
  PAGE_PADDING_TOP -
  PAGE_PADDING_BOTTOM -
  PAGE_FOOTER_HEIGHT -
  SAFE_GAP;

const CONTENT_WIDTH = PAGE_WIDTH - 96; // 48px padding on each side

interface FormData {
  name: string
  companyName: string
  email: string
  cost: string
  website: string
  howSoon: string
  scope: string
  problem: string
  solution: string
  templateType: string
  designStyle: string
  logoBase64: string
  logoFileName: string
}

const TEMPLATES = [
  { value: "standard_business", label: "Standard Business", description: "General formal client proposal.", icon: FileText },
  { value: "website_proposal", label: "Website Proposal", description: "Website design and development proposal.", icon: Globe },
  { value: "ai_automation", label: "AI Automation", description: "Proposal for automation, workflows, chatbots, and AI agents.", icon: Sparkles },
  { value: "power_bi_dashboard", label: "Power BI / Dashboard", description: "Proposal for BI dashboards, analytics, and reporting.", icon: LayoutTemplate },
  { value: "one_page", label: "Short One-Page", description: "Compact proposal for fast client review.", icon: FileText },
  { value: "detailed_project", label: "Detailed Project", description: "Full proposal with scope, phases, deliverables, pricing, and terms.", icon: ListChecks },
]

const DESIGN_STYLES = [
  { value: "clean_professional", label: "Clean Professional", description: "White, minimal, corporate proposal layout." },
  { value: "modern_orange", label: "Modern Orange", description: "Orange-accented modern Kozker-style proposal." },
  { value: "premium_dark", label: "Premium Dark", description: "Dark header, premium business look." },
  { value: "minimal_bw", label: "Minimal Black & White", description: "Simple print-friendly layout." },
  { value: "startup_pitch", label: "Startup Pitch Style", description: "Bold, modern, high-impact presentation style." },
]

export default function ProposalGenerator() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    companyName: "",
    email: "",
    cost: "",
    website: "",
    howSoon: "",
    scope: "",
    problem: "",
    solution: "",
    templateType: "standard_business",
    designStyle: "clean_professional",
    logoBase64: "",
    logoFileName: "",
  })

  // UI State
  const [currentStep, setCurrentStep] = useState(1)
  const [activeTab, setActiveTab] = useState("preview")

  // Generation State
  const [isLoading, setIsLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  // Output State
  const [editableProposal, setEditableProposal] = useState("")
  const [paginatedPages, setPaginatedPages] = useState<any[][]>([])
  const [atomicBlocks, setAtomicBlocks] = useState<any[]>([])
  const [isPaginated, setIsPaginated] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isWordLoading, setIsWordLoading] = useState(false)

  // Mobile Scaling Variable
  useEffect(() => {
    const handleResize = () => {
      document.documentElement.style.setProperty('--vw', `${window.innerWidth / 10}px`)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const measurementRef = useRef<HTMLDivElement>(null)
  const pagesContainerRef = useRef<HTMLDivElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const normalizeWebsiteForDisplay = (url: string) => {
    if (!url) return ""
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`
    }
    return url
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Logo file is too large. Max size is 2MB.")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        logoBase64: reader.result as string,
        logoFileName: file.name
      }))
    }
    reader.readAsDataURL(file)
  }

  const removeLogo = () => {
    setFormData((prev) => ({
      ...prev,
      logoBase64: "",
      logoFileName: ""
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const validateForm = () => {
    const required = ["name", "companyName", "email", "cost", "website", "howSoon", "scope", "problem", "solution"]
    for (const field of required) {
      if (!formData[field as keyof FormData]) {
        return false
      }
    }
    return true
  }

  const nextStep = () => {
    if (currentStep === 1 && !validateForm()) {
      alert("Please fill in all required project details.")
      return
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const extractProposalContent = (response: any): string | null => {
    if (!response) return null
    if (typeof response === "string") return response

    if (Array.isArray(response) && response.length > 0) {
      const item = response[0]
      if (item.markdown) return item.markdown
      if (item.output) return item.output
      if (item.json?.output) return item.json.output
      if (item.json?.markdown) return item.json.markdown
    }

    if (response.markdown) return response.markdown
    if (response.proposal) return response.proposal
    if (response.content) return response.content
    if (response.output) return response.output
    if (response.text) return response.text

    if (response.data) {
      if (response.data.markdown) return response.data.markdown
      if (response.data.proposal) return response.data.proposal
    }

    for (const key in response) {
      if (typeof response[key] === "string" && response[key].length > 100) {
        return response[key]
      }
    }

    return null
  }

  const generateProposal = async () => {
    setIsLoading(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      const payload = {
        ...formData,
        inputMode: "guided_form",
        sourceTool: "proposal_generator",
        generatedAt: new Date().toISOString()
      }

      const response = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/fdf6b12c-513e-4fd8-a13c-b3049fc958f7", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const responseData = await response.json()

        if (responseData.success === false) {
          throw new Error(responseData.message || "Failed to generate proposal")
        }

        const content = extractProposalContent(responseData)

        if (content) {
          setEditableProposal(content)
          setIsPaginated(false) // Trigger pagination
          setSubmitStatus("success")
          setCurrentStep(3)
          setActiveTab("preview")
        } else {
          setSubmitStatus("error")
          setErrorMessage("Proposal was generated, but the response format could not be read. Please check the n8n response structure.")
        }
      } else {
        throw new Error(`Failed to submit proposal: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Could not generate the proposal. Please check the n8n workflow response and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editableProposal)
      alert("Proposal copied.")
    } catch (err) {
      alert("Failed to copy text.")
    }
  }

  const sanitizeFilename = (name: string) => {
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase()
  }

  const formatDate = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  const downloadMarkdown = () => {
    const header = `# Project Proposal\n\nPrepared For: ${formData.name}\nCompany: ${formData.companyName}\nEmail: ${formData.email}\nWebsite: ${formData.website}\nBudget: ${formData.cost}\nTimeline: ${formData.howSoon}\nTemplate: ${formData.templateType}\nStyle: ${formData.designStyle}\nGenerated At: ${new Date().toISOString()}\n\n---\n\n`
    const blob = new Blob([header + editableProposal], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `proposal-${sanitizeFilename(formData.companyName || "client")}-${formatDate()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadWord = async () => {
    setIsWordLoading(true)
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun, AlignmentType, BorderStyle } = docx
      
      const children: any[] = []

      // 1. Logo or Company Heading
      if (formData.logoBase64) {
        try {
          children.push(new Paragraph({
            children: [
              new ImageRun({
                data: formData.logoBase64,
                transformation: { width: 120, height: 40 },
              })
            ],
            spacing: { after: 400 }
          }))
        } catch (e) {
           children.push(new Paragraph({
            children: [new TextRun({ text: formData.companyName, bold: true, size: 32 })],
            spacing: { after: 400 }
          }))
        }
      } else {
        children.push(new Paragraph({
          children: [new TextRun({ text: formData.companyName, bold: true, size: 32 })],
          spacing: { after: 400 }
        }))
      }

      // 2. Document Title & Metadata
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "PROJECT PROPOSAL", bold: true, color: "111827" })],
        alignment: AlignmentType.RIGHT,
        spacing: { after: 600 }
      }))

      const metaLabel = (label: string, value: string) => {
        return new Paragraph({
          children: [
            new TextRun({ text: `${label}: `, bold: true, size: 20 }),
            new TextRun({ text: value, size: 20 })
          ],
          spacing: { after: 120 }
        })
      }

      children.push(metaLabel("Prepared For", formData.name))
      children.push(metaLabel("Company", formData.companyName))
      if (formData.email) children.push(metaLabel("Email", formData.email))
      if (formData.website) children.push(metaLabel("Website", formData.website))
      children.push(metaLabel("Investment", formData.cost))
      children.push(metaLabel("Timeline", formData.howSoon))
      children.push(metaLabel("Generated Date", formatDate()))

      children.push(new Paragraph({
        children: [new TextRun({ text: "" })],
        border: { bottom: { color: "E2E8F0", space: 1, style: BorderStyle.SINGLE, size: 6 } },
        spacing: { before: 400, after: 600 }
      }))

      // 3. Body Content (Basic Markdown Parsing)
      const lines = editableProposal.split("\n")
      lines.forEach(line => {
        const trimmed = line.trim()
        if (!trimmed) {
          children.push(new Paragraph({ spacing: { after: 200 } }))
          return
        }

        if (trimmed.startsWith("# ")) {
          children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: trimmed.replace("# ", "") })], spacing: { before: 400, after: 200 } }))
        } else if (trimmed.startsWith("## ")) {
          children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: trimmed.replace("## ", "") })], spacing: { before: 300, after: 150 } }))
        } else if (trimmed.startsWith("### ")) {
          children.push(new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: trimmed.replace("### ", "") })], spacing: { before: 200, after: 100 } }))
        } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          children.push(new Paragraph({ children: [new TextRun({ text: trimmed.replace(/^[-*]\s/, "") })], bullet: { level: 0 }, spacing: { after: 120 } }))
        } else if (/^\d+\.\s/.test(trimmed)) {
          children.push(new Paragraph({ children: [new TextRun({ text: trimmed.replace(/^\d+\.\s/, "") })], numbering: { reference: "default-numbering", level: 0 }, spacing: { after: 120 } }))
        } else {
          children.push(new Paragraph({ children: [new TextRun({ text: trimmed })], spacing: { after: 150 } }))
        }
      })

      const doc = new Document({
        numbering: {
          config: [
            {
              reference: "default-numbering",
              levels: [
                {
                  level: 0,
                  format: "decimal",
                  text: "%1.",
                  alignment: AlignmentType.START,
                  style: {
                    paragraph: {
                      indent: { left: 720, hanging: 360 },
                    },
                  },
                },
              ],
            },
          ],
        },
        sections: [{ properties: {}, children }]
      })

      const blob = await Packer.toBlob(doc)
      saveAs(blob, `proposal-${sanitizeFilename(formData.companyName || "client")}-${formatDate()}.docx`)
      alert("Word document created!")
    } catch (error) {
      console.error("Word export failed:", error)
      alert("Failed to create Word document.")
    } finally {
      setIsWordLoading(false)
    }
  }

  const downloadPDF = async () => {
    setActiveTab("preview")
    document.body.classList.add("pdf-exporting")
    
    // Give time for Tab change
    setTimeout(async () => {
      try {
        const pages = document.querySelectorAll(".proposal-page")
        if (pages.length === 0) {
          alert("No pages found to export.")
          document.body.classList.remove("pdf-exporting")
          return
        }

        const pdf = new jsPDF("p", "mm", "a4")
        
        for (let i = 0; i < pages.length; i++) {
          const page = pages[i] as HTMLElement
          const pageId = page.getAttribute('data-page')
          
          const canvas = await html2canvas(page, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
            width: PAGE_WIDTH,
            height: PAGE_HEIGHT,
            scrollX: 0,
            scrollY: 0,
            windowWidth: page.scrollWidth,
            windowHeight: page.scrollHeight,
            onclone: (clonedDoc) => {
              const clonedPage = clonedDoc.querySelector(`[data-page="${pageId}"]`) as HTMLElement;
              if (clonedPage) {
                clonedPage.style.overflow = "visible";
                const content = clonedPage.querySelector('.proposal-page-content') as HTMLElement;
                if (content) content.style.overflow = "visible";
              }
            }
          })

          const imgData = canvas.toDataURL("image/png")
          
          if (i > 0) {
            pdf.addPage()
          }
          
          pdf.addImage(imgData, "PNG", 0, 0, 210, 297)
        }
        
        pdf.save(`proposal-${sanitizeFilename(formData.companyName || "client")}-${formatDate()}.pdf`)
        
      } catch (error) {
        console.error("PDF generation failed:", error)
        alert("Failed to generate PDF.")
      } finally {
        document.body.classList.remove("pdf-exporting")
      }
    }, 300)
  }


  const printProposal = () => {
    setActiveTab("preview")
    setTimeout(() => {
      window.print()
    }, 100)
  }




  // --- Section Parser for Clean Layout ---

  // --- Pagination Logic ---

  useEffect(() => {
    if (currentStep === 3 && editableProposal && !isPaginated) {
      handlePagination()
    }
  }, [currentStep, editableProposal, formData.designStyle, isPaginated])

  const handlePagination = async () => {
    if (!measurementRef.current) return
    setIsCalculating(true)

    // 1. Pre-render measurement container logic
    // We need to split into "Atomic Blocks" that should stay together
    // RegEx to split by:
    // - Headings (# ## ###)
    // - Paragraphs (\n\n)
    // - Special Cards (the ## Client Context stuff)
    // - Blockquotes
    
    const rawBlocks = editableProposal.split(/\n\n+/).filter(Boolean);
    const blocksForState: any[] = [];
    let pendingHeading = "";
    rawBlocks.forEach((block) => {
      const isHeading = /^#{1,3}\s/.test(block.trim());
      if (isHeading) {
        if (pendingHeading) {
          blocksForState.push({ type: 'markdown', content: pendingHeading });
        }
        pendingHeading = block;
      } else {
        if (pendingHeading) {
          blocksForState.push({ type: 'markdown', content: pendingHeading + "\n\n" + block, isGrouped: true });
          pendingHeading = "";
        } else {
          blocksForState.push({ type: 'markdown', content: block });
        }
      }
    });
    if (pendingHeading) blocksForState.push({ type: 'markdown', content: pendingHeading });

    setAtomicBlocks(blocksForState);

    // Step 2: Measure blocks
    // We wait for the browser to render the measurementRef contents
    setTimeout(() => {
      const measureArea = measurementRef.current
      if (!measureArea) return

      const measureItems = measureArea.querySelectorAll('.measure-item');
      const calculatedPages: any[][] = [];
      let currentPage: any[] = [];
      let heightSum = 0;

      // Cover Page Header height estimate (or measurement)
      const coverEl = measureArea.querySelector('.measure-cover');
      const coverHeight = coverEl?.getBoundingClientRect().height || 420;
      heightSum = coverHeight;
      currentPage.push({ type: 'header' });

      measureItems.forEach((el, idx) => {
        const blockHeight = el.getBoundingClientRect().height;
        const blockData = blocksForState[idx];

        const currentUsableHeight = (calculatedPages.length === 0) ? FIRST_PAGE_USABLE_HEIGHT : NORMAL_PAGE_USABLE_HEIGHT;
        
        if (heightSum + blockHeight > currentUsableHeight && currentPage.length > 0) {
          calculatedPages.push(currentPage);
          currentPage = [blockData];
          heightSum = blockHeight; // Reset but handle next page space
        } else {
          currentPage.push(blockData);
          heightSum += blockHeight;
        }
      });

      if (currentPage.length > 0) {
        calculatedPages.push(currentPage);
      }

      setPaginatedPages(calculatedPages);
      setIsPaginated(true);
      setIsCalculating(false);
    }, 1000);
  }

  const parseSpecialProposalSections = (markdown: string) => {
    const sections = markdown.split(/(?=^##\s)/m);
  
    return sections.map((section, idx) => {
      const lines = section.trim().split('\n');
      const headerLine = lines[0] || '';
      
      const isSpecial = /^##\s.*(Client Context|Client Details|Key Deliverables|Estimated Timeline|Investment|Cost Breakdown|Project Details)/i.test(headerLine);
      
      if (isSpecial) {
        const tableStartIndex = lines.findIndex(l => l.trim().startsWith('|'));
        if (tableStartIndex !== -1) {
          let tableEndIndex = tableStartIndex;
          while (tableEndIndex < lines.length && lines[tableEndIndex].trim().startsWith('|')) {
            tableEndIndex++;
          }
          
          const tableLines = lines.slice(tableStartIndex, tableEndIndex);
          const textBefore = lines.slice(0, tableStartIndex).join('\n').trim();
          const textAfter = lines.slice(tableEndIndex).join('\n').trim();
          
          const headers = tableLines[0].split('|').map(s => s.trim()).filter(Boolean);
          const rows = tableLines.slice(2).map(rowLine => {
            return rowLine.split('|').map(s => s.trim()).filter(Boolean);
          });
  
          const headerStr = headers.join(' ').toLowerCase();
          const isTimeline = headerStr.includes('timeline') || headerStr.includes('duration') || headerStr.includes('week');
          const isCost = headerStr.includes('cost') || headerStr.includes('investment') || headerStr.includes('price') || headerLine.toLowerCase().includes('cost');
          const isDeliverables = headerStr.includes('deliverable') || headerStr.includes('phase') || headerLine.toLowerCase().includes('deliverables');

          return (
            <div key={idx} className="proposal-section">
              {textBefore && <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{textBefore}</ReactMarkdown>}
              
              <div className="my-6 grid gap-4 grid-cols-1 md:grid-cols-2">
                {rows.map((row, rIdx) => (
                  <div key={rIdx} className={`timeline-card rounded-xl border p-5 ${formData.designStyle === 'premium_dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    {row.map((col, cIdx) => (
                      <div key={cIdx} className="mb-2 last:mb-0">
                        <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-0.5">{headers[cIdx] || `Col ${cIdx+1}`}</p>
                        <p className={`font-semibold ${cIdx === 0 && (isDeliverables || isTimeline) ? 'text-lg text-orange-600 dark:text-orange-400' : ''}`}>
                          {col}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {textAfter && <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{textAfter}</ReactMarkdown>}
            </div>
          )
        }
      }
      
      return (
        <div key={idx} className="proposal-section">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{section}</ReactMarkdown>
        </div>
      );
    });
  };


  // --- Style Helpers for the Preview Area ---

  const getPreviewContainerClasses = () => {
    let base = "mx-auto transition-colors duration-300 relative box-border overflow-visible h-auto "

    switch (formData.designStyle) {
      case "clean_professional":
        return base + "text-slate-800 border-none"
      case "modern_orange":
        return base + "text-gray-900 border-t-8 !border-t-orange-500 !border-gray-200 border"
      case "premium_dark":
        return base + "!bg-slate-900 text-white border-none"
      case "minimal_bw":
        return base + "text-black border-2 border-black"
      case "startup_pitch":
        return base + "text-slate-900 border-none"
      default:
        return base + "text-slate-800 border-none"
    }
  }

  const getPreviewHeaderClasses = () => {
    switch (formData.designStyle) {
      case "clean_professional": return "border-b border-slate-200 pb-8 mb-8"
      case "modern_orange": return "border-b-2 border-orange-200 pb-8 mb-8"
      case "premium_dark": return "border-b border-slate-700 pb-8 mb-8"
      case "minimal_bw": return "border-b-2 border-black pb-8 mb-8"
      case "startup_pitch": return "bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-lg mb-8"
      default: return "border-b border-slate-200 pb-8 mb-8"
    }
  }

  const getHeadingStyle = (level: number) => {
    const isDark = formData.designStyle === 'premium_dark'

    if (level === 1) {
      let h1Style = "text-4xl font-bold font-poppins mb-6 "
      if (isDark) return h1Style + "text-white"
      if (formData.designStyle === 'modern_orange') return h1Style + "text-orange-600"
      if (formData.designStyle === 'startup_pitch') return h1Style + "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
      return h1Style + "text-slate-900"
    }
    if (level === 2) {
      let h2Style = "text-2xl font-bold font-poppins mt-10 mb-4 pb-2 page-break-after-avoid "
      if (isDark) return h2Style + "text-slate-100 border-b border-slate-700"
      if (formData.designStyle === 'modern_orange') return h2Style + "text-slate-900 border-b-2 border-orange-200 inline-block pr-6"
      if (formData.designStyle === 'minimal_bw') return h2Style + "text-black border-b border-black uppercase tracking-wider"
      return h2Style + "text-slate-800 border-b border-slate-200"
    }
    return `text-xl font-semibold font-poppins mt-8 mb-3 page-break-after-avoid ${isDark ? 'text-slate-200' : 'text-slate-800'}`
  }

  const getTextColor = () => formData.designStyle === 'premium_dark' ? 'text-slate-300' : 'text-slate-700'

  const markdownComponents = {
    h1: ({ children }: any) => <h1 className={getHeadingStyle(1)}>{children}</h1>,
    h2: ({ children }: any) => <h2 className={getHeadingStyle(2)}>{children}</h2>,
    h3: ({ children }: any) => <h3 className={getHeadingStyle(3)}>{children}</h3>,
    h4: ({ children }: any) => <h4 className="text-lg font-semibold font-poppins mt-6 mb-2 page-break-after-avoid">{children}</h4>,
    p: ({ children }: any) => <p className={`${getTextColor()} mb-5 leading-relaxed`}>{children}</p>,
    ul: ({ children }: any) => <ul className={`list-disc list-outside ml-5 mb-6 space-y-2 ${getTextColor()}`}>{children}</ul>,
    ol: ({ children }: any) => <ol className={`list-decimal list-outside ml-5 mb-6 space-y-2 ${getTextColor()}`}>{children}</ol>,
    li: ({ children }: any) => <li className="pl-1 orphans-windows-3">{children}</li>,
    strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-slate-300 pl-4 py-1 my-6 italic opacity-80 break-inside-avoid">
        {children}
      </blockquote>
    ),
    table: ({ children }: any) => (
      <div className="overflow-x-auto my-8 break-inside-avoid">
        <table className={`w-full text-left border-collapse ${formData.designStyle === 'premium_dark' ? 'border-slate-700' : 'border-slate-200'}`}>
          {children}
        </table>
      </div>
    ),
    th: ({ children }: any) => (
      <th className={`p-3 font-semibold text-sm uppercase tracking-wider border-b-2 ${formData.designStyle === 'premium_dark' ? 'border-slate-600 bg-slate-800' : 'border-slate-300 bg-slate-50'}`}>
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className={`p-3 text-sm border-b ${formData.designStyle === 'premium_dark' ? 'border-slate-700' : 'border-slate-200'}`}>
        {children}
      </td>
    ),
    hr: () => <hr className={`my-8 border-t ${formData.designStyle === 'premium_dark' ? 'border-slate-700' : 'border-slate-200'}`} />
  }

  if (isLoading) return <ContentLoadingScreen />

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* Dynamic CSS Injection */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          @page {
            size: A4;
            margin: 12mm;
          }

          body {
            background: white !important;
          }

          body * {
            visibility: hidden;
          }

          #proposal-print-area,
          #proposal-print-area * {
            visibility: visible;
          }

          #proposal-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            box-shadow: none !important;
            overflow: visible !important;
          }

          .no-print {
            display: none !important;
          }

          .proposal-section,
          .measure-item,
          .proposal-block,
          .proposal-card,
          .timeline-card,
          .deliverable-card,
          .cost-card {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .proposal-page {
            box-shadow: none !important;
            margin: 0 !important;
          }
        }
        
        .proposal-page {
          width: 794px;
          height: 1123px;
          padding: 48px;
          background: #ffffff;
          color: #111827;
          margin: 0 auto 32px;
          box-sizing: border-box;
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
          transform-origin: top center;
        }

        .proposal-header {
          min-height: 220px;
          height: auto;
          overflow: visible;
          padding-bottom: 32px;
          margin-bottom: 36px;
        }

        .proposal-header p,
        .proposal-header div,
        .proposal-header span {
          line-height: 1.45;
          overflow: visible;
        }

        .prepared-for-block,
        .project-details-block {
          overflow: visible;
          height: auto;
          min-height: 96px;
          line-height: 1.45;
        }

        .pdf-exporting .proposal-page,
        .pdf-exporting .proposal-page-content,
        .pdf-exporting .proposal-header,
        .pdf-exporting .prepared-for-block,
        .pdf-exporting .project-details-block {
          overflow: visible !important;
        }

        .proposal-page-content {
          flex: 1;
          overflow: visible;
          position: relative;
        }

        .proposal-page-footer {
          position: absolute;
          bottom: 36px;
          right: 48px;
          left: 48px;
          height: 36px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          font-size: 10px;
          opacity: 0.5;
          border-top: 1px solid rgba(0,0,0,0.05);
          pointer-events: none;
        }

        .orphans-windows-3 {
          orphans: 3;
          widows: 3;
        }

        .page-break-after-avoid {
          break-after: avoid;
          page-break-after: avoid;
        }
        
        /* Mobile Scaling */
        @media (max-width: 768px) {
          #proposal-preview-pages {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
          }
          .proposal-page {
            transform-origin: top center;
            transform: scale(calc(var(--vw, 100) / 79.4)); /* Dynamic scaling */
            margin-bottom: calc(-1123px + (1123px * (var(--vw, 100) / 79.4)) + 20px);
          }
        }
      `}} />

      {/* Progress Header - Hidden during print */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 no-print shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white hidden sm:block">Proposal Builder</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <div className={`flex flex-col items-center gap-1 ${currentStep >= 1 ? 'text-orange-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep >= 1 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>1</div>
              <span className="text-xs font-medium hidden sm:block">Details</span>
            </div>
            <div className={`h-px w-8 sm:w-16 ${currentStep >= 2 ? 'bg-orange-500' : 'bg-slate-200'}`} />
            <div className={`flex flex-col items-center gap-1 ${currentStep >= 2 ? 'text-orange-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep >= 2 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>2</div>
              <span className="text-xs font-medium hidden sm:block">Setup</span>
            </div>
            <div className={`h-px w-8 sm:w-16 ${currentStep >= 3 ? 'bg-orange-500' : 'bg-slate-200'}`} />
            <div className={`flex flex-col items-center gap-1 ${currentStep >= 3 ? 'text-orange-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep >= 3 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>3</div>
              <span className="text-xs font-medium hidden sm:block">Review</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 no-print">

        {/* Error Alert */}
        {submitStatus === "error" && (
          <Alert variant="destructive" className="mb-6 animate-in fade-in flex">
            <AlertCircle className="h-4 w-4" />
            <div>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </div>
          </Alert>
        )}

        {/* --- STEP 1 & 2: INPUT FLOW --- */}
        {currentStep < 3 && (
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg border-slate-200 dark:border-slate-800">

              <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 pb-6">
                <CardTitle className="text-2xl font-bold">
                  {currentStep === 1 ? "Project Details" : "Proposal Setup"}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1
                    ? "Enter the core information about the client and project."
                    : "Select the template, design style, and branding for the proposal."}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 sm:p-8">

                {/* STEP 1 FORM */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-in slide-in-from-left-4 fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Client Name *</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Acme Inc" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john@acme.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website *</Label>
                        <Input id="website" name="website" value={formData.website} onChange={handleInputChange} placeholder="acme.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cost">Budget / Cost *</Label>
                        <Input id="cost" name="cost" value={formData.cost} onChange={handleInputChange} placeholder="$5,000" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="howSoon">Timeline (How Soon) *</Label>
                        <Input id="howSoon" name="howSoon" value={formData.howSoon} onChange={handleInputChange} placeholder="4 weeks" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="scope">Scope *</Label>
                      <Textarea id="scope" name="scope" value={formData.scope} onChange={handleInputChange} rows={3} placeholder="What exactly needs to be built or delivered..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="problem">Problem *</Label>
                      <Textarea id="problem" name="problem" value={formData.problem} onChange={handleInputChange} rows={3} placeholder="What is the client's current pain point..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="solution">Proposed Solution *</Label>
                      <Textarea id="solution" name="solution" value={formData.solution} onChange={handleInputChange} rows={3} placeholder="How will we solve this for them..." />
                    </div>
                  </div>
                )}

                {/* STEP 2 FORM */}
                {currentStep === 2 && (
                  <div className="space-y-10 animate-in slide-in-from-right-4 fade-in">

                    {/* Template Selection */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2"><LayoutTemplate className="h-5 w-5 text-orange-500" /> Select Template</h3>
                        <p className="text-sm text-slate-500">The AI will structure the proposal based on this template type.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {TEMPLATES.map((tmpl) => {
                          const Icon = tmpl.icon
                          const isSelected = formData.templateType === tmpl.value
                          return (
                            <div
                              key={tmpl.value}
                              onClick={() => setFormData({ ...formData, templateType: tmpl.value })}
                              className={`cursor-pointer rounded-xl p-4 border-2 transition-all ${isSelected ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-500/10' : 'border-slate-200 dark:border-slate-800 hover:border-orange-300'}`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className={`p-2 rounded-lg ${isSelected ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                                  <Icon className="h-5 w-5" />
                                </div>
                                {isSelected && <CheckCircle className="h-5 w-5 text-orange-500" />}
                              </div>
                              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1">{tmpl.label}</h4>
                              <p className="text-xs text-slate-500 line-clamp-2">{tmpl.description}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Design Style Selection */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2"><Brush className="h-5 w-5 text-indigo-500" /> Design Style</h3>
                        <p className="text-sm text-slate-500">Choose the visual aesthetic for the PDF/Print export.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {DESIGN_STYLES.map((style) => {
                          const isSelected = formData.designStyle === style.value
                          return (
                            <div
                              key={style.value}
                              onClick={() => setFormData({ ...formData, designStyle: style.value })}
                              className={`cursor-pointer group flex items-start gap-4 p-4 rounded-xl border-2 transition-all ${isSelected ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10' : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300'}`}
                            >
                              <div className={`w-8 h-8 rounded shrink-0 shadow-sm ${style.value === 'clean_professional' ? 'bg-white border border-slate-200' :
                                style.value === 'modern_orange' ? 'bg-orange-500' :
                                  style.value === 'premium_dark' ? 'bg-slate-900' :
                                    style.value === 'minimal_bw' ? 'bg-white border-2 border-black tracking-[cross]' :
                                      'bg-gradient-to-br from-indigo-500 to-purple-500'
                                }`} />
                              <div>
                                <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{style.label}</h4>
                                <p className="text-xs text-slate-500 mt-0.5">{style.description}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Logo Upload */}
                    <div className="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-8">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2"><ImageIcon className="h-5 w-5 text-blue-500" /> Company Logo (Optional)</h3>
                        <p className="text-sm text-slate-500">Will be displayed on the top left of the proposal document.</p>
                      </div>

                      <div className="flex items-start gap-6">
                        {formData.logoBase64 ? (
                          <div className="relative group rounded-xl border border-slate-200 p-2 bg-white">
                            <img src={formData.logoBase64} alt="Logo" className="w-auto h-24 object-contain" />
                            <button
                              onClick={removeLogo}
                              className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full sm:w-64 h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors flex flex-col items-center justify-center cursor-pointer text-slate-500"
                          >
                            <Upload className="h-6 w-6 mb-2" />
                            <span className="text-sm font-medium">Click to upload logo</span>
                            <span className="text-xs mt-1 text-slate-400">Max 2MB. Image files only.</span>
                          </div>
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleLogoUpload}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    </div>

                  </div>
                )}
              </CardContent>

              <CardFooter className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 px-6 py-4 flex justify-between items-center rounded-b-xl">
                {currentStep === 1 ? (
                  <div /> /* Spacer */
                ) : (
                  <Button variant="outline" onClick={prevStep} className="gap-2">
                    <ChevronLeft className="h-4 w-4" /> Back
                  </Button>
                )}

                {currentStep === 1 ? (
                  <Button onClick={nextStep} className="bg-slate-900 hover:bg-slate-800 text-white gap-2 ml-auto">
                    Next Step <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={generateProposal} disabled={isLoading} className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
                    <Sparkles className="h-4 w-4" /> Generate Proposal
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        )}

        {/* --- STEP 3: REVIEW --- */}
        {currentStep === 3 && (
          <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in zoom-in-95 duration-500">

            {/* Left Panel: Small summary & actions */}
            <div className="w-full lg:w-1/4 space-y-6">

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={copyToClipboard} variant="outline" className="w-full justify-start gap-2">
                    <Copy className="h-4 w-4 text-slate-500" /> Copy Content
                  </Button>
                  <Button onClick={downloadMarkdown} variant="outline" className="w-full justify-start gap-2">
                    <FileDown className="h-4 w-4 text-emerald-500" /> Download Markdown
                  </Button>
                  <Button 
                    onClick={downloadWord} 
                    variant="outline" 
                    disabled={isWordLoading}
                    className="w-full justify-start gap-2"
                  >
                    {isWordLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <div className="bg-blue-100 p-1 rounded">
                        <FileDown className="h-3 w-3 text-blue-600" />
                      </div>
                    )}
                    {isWordLoading ? "Creating Word..." : "Download Word"}
                  </Button>
                  <Button onClick={downloadPDF} variant="outline" className="w-full justify-start gap-2">
                    <Download className="h-4 w-4 text-indigo-500" /> Download PDF
                  </Button>
                  <Button onClick={printProposal} variant="outline" className="w-full justify-start gap-2">
                    <Printer className="h-4 w-4 text-slate-500" /> Print Document
                  </Button>
                  <hr className="my-2 border-slate-100" />
                  <Button onClick={() => setCurrentStep(2)} variant="ghost" className="w-full justify-start gap-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                    <Brush className="h-4 w-4" /> Change Style
                  </Button>
                  <Button onClick={generateProposal} variant="ghost" className="w-full justify-start gap-2 text-slate-600">
                    <RefreshCw className="h-4 w-4" /> Regenerate
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Settings Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Client</span>
                    <span className="font-medium truncate max-w-[120px]" title={formData.companyName}>{formData.companyName}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Style</span>
                    <Badge variant="secondary" className="font-normal">{DESIGN_STYLES.find(s => s.value === formData.designStyle)?.label}</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Template</span>
                    <Badge variant="secondary" className="font-normal">{TEMPLATES.find(s => s.value === formData.templateType)?.label}</Badge>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Right Panel: Editor/Preview Tabs */}
            <div className="w-full lg:w-3/4 overflow-visible h-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="bg-slate-200/50 dark:bg-slate-800 rounded-lg p-1 mb-4 inline-flex">
                  <TabsList className="bg-transparent h-auto p-0 space-x-1">
                    <TabsTrigger value="edit" className="px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">
                      Edit Content
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">
                      Document Preview
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="edit" className="mt-0">
                  <Card className="border-slate-200 overflow-hidden shadow-md">
                    <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>Markdown Editor</span>
                      <span>{editableProposal.length} characters</span>
                    </div>
                    <Textarea
                      value={editableProposal}
                      onChange={(e) => setEditableProposal(e.target.value)}
                      className="min-h-[700px] border-0 focus-visible:ring-0 p-6 font-mono text-sm leading-relaxed resize-y bg-white text-slate-800"
                    />
                  </Card>
                </TabsContent>

                <TabsContent value="preview" className="mt-0 overflow-visible h-auto max-h-none">
                  {/* Outer wrapper to mimic a viewport/desk background */}
                  <div className="bg-slate-300/30 border border-slate-300 rounded-xl shadow-inner p-4 sm:p-12 overflow-visible min-h-screen">
                    
                    {/* Measurement Container (Hidden) */}
                    <div 
                      ref={measurementRef}
                      className="absolute opacity-0 pointer-events-none"
                      style={{ width: '794px', padding: '48px', boxSizing: 'border-box', top: '-9999px' }}
                    >
                      {/* Cover Header for Measurement */}
                      <div className="measure-cover">
                        <div className={getPreviewHeaderClasses()}>
                          <div className="flex justify-between items-start mb-12">
                            <div className="max-w-[200px]">
                              {formData.logoBase64 ? (
                                <img src={formData.logoBase64} alt="Company Logo" className="w-full h-auto max-h-[80px] object-contain object-left" />
                              ) : (
                                <h2 className="text-2xl font-bold font-poppins">{formData.companyName}</h2>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="uppercase tracking-widest text-xs font-bold font-poppins opacity-50 mb-1">Document</div>
                              <h2 className="text-2xl font-bold font-poppins">PROPOSAL</h2>
                              <p className={`text-sm mt-1 opacity-70`}>{formatDate()}</p>
                            </div>
                          </div>
  
                          <div className="grid grid-cols-2 gap-8 mb-4">
                            <div>
                              <p className="text-xs uppercase tracking-widest opacity-60 mb-2 font-bold font-poppins">Prepared For</p>
                              <p className="font-bold text-lg font-poppins">{formData.name}</p>
                              <p className="opacity-80 text-sm mt-1">{formData.companyName}</p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-widest opacity-60 mb-2 font-bold font-poppins">Project Details</p>
                              <div className="space-y-2">
                                <p className="flex justify-between text-sm"><span className="opacity-70">Investment:</span> <span className="font-bold">{formData.cost}</span></p>
                                <p className="flex justify-between text-sm"><span className="opacity-70">Timeline:</span> <span className="font-bold">{formData.howSoon}</span></p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content Blocks for Measurement */}
                      {atomicBlocks.map((block, bIdx) => (
                        <div key={bIdx} className="measure-item prose prose-slate max-w-none prose-p:leading-relaxed mb-0">
                          {parseSpecialProposalSections(block.content)}
                        </div>
                      ))}
                    </div>

                    {isCalculating && (
                      <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-500 bg-white/50 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm relative z-10 w-full mb-8">
                        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                        <p className="font-medium">Calculating A4 Pagination...</p>
                      </div>
                    )}

                    {/* Real A4 Pages Preview */}
                    <div id="proposal-preview-pages" ref={pagesContainerRef} className="overflow-visible">
                      {paginatedPages.map((pageBlocks, pIdx) => (
                        <div 
                          key={pIdx} 
                          data-page={`page-${pIdx + 1}`}
                          className={`proposal-page ${getPreviewContainerClasses()}`}
                        >
                          {/* Page content wrapper */}
                          <div className="proposal-page-content prose prose-slate max-w-none prose-p:leading-relaxed">
                            {pageBlocks.map((block, bIdx) => {
                              if (block.type === 'header') {
                                return (
                                  <div key="header" className={`proposal-header ${getPreviewHeaderClasses().replace('mb-8', '')}`}>
                                    <div className="flex justify-between items-start mb-10">
                                      <div className="max-w-[200px]">
                                        {formData.logoBase64 ? (
                                          <img src={formData.logoBase64} alt="Company Logo" className="w-full h-auto max-h-[80px] object-contain object-left" />
                                        ) : (
                                          <h2 className="text-2xl font-bold font-poppins">{formData.companyName}</h2>
                                        )}
                                      </div>
                                      <div className="text-right">
                                        <div className="uppercase tracking-widest text-xs font-bold font-poppins opacity-50 mb-1">Document</div>
                                        <h2 className="text-2xl font-bold font-poppins">PROPOSAL</h2>
                                        <p className={`text-sm mt-1 opacity-70`}>{formatDate()}</p>
                                      </div>
                                    </div>
            
                                    <div className="grid grid-cols-2 gap-8 mb-4">
                                      <div className="prepared-for-block">
                                        <p className="text-xs uppercase tracking-widest opacity-60 mb-2 font-bold font-poppins text-clip-none">Prepared For</p>
                                        <p className="font-bold text-lg font-poppins leading-tight">{formData.name}</p>
                                        <p className="opacity-80 text-sm mt-1">{formData.companyName}</p>
                                        {formData.email && <p className="opacity-80 text-sm mt-1 break-all">{formData.email}</p>}
                                        {formData.website && <p className="opacity-80 text-sm mt-1 break-all">{normalizeWebsiteForDisplay(formData.website)}</p>}
                                      </div>
                                      <div className="project-details-block">
                                        <p className="text-xs uppercase tracking-widest opacity-60 mb-2 font-bold font-poppins text-clip-none">Project Details</p>
                                        <div className="space-y-2">
                                          <p className="flex justify-between text-sm items-center"><span className="opacity-70">Investment:</span> <span className="font-bold">{formData.cost}</span></p>
                                          <p className="flex justify-between text-sm items-center"><span className="opacity-70">Timeline:</span> <span className="font-bold">{formData.howSoon}</span></p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              }
                              return (
                                <div key={bIdx} className="proposal-block no-print">
                                  {parseSpecialProposalSections(block.content)}
                                </div>
                              )
                            })}
                          </div>

                          {/* Footer with Page Numbers */}
                          <div className="proposal-page-footer">
                            <span>Page {pIdx + 1} of {paginatedPages.length}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
