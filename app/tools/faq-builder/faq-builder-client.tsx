"use client"

import * as React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Loader2, Copy, RefreshCw, Download, ChevronDown } from "lucide-react"
import ReactMarkdown from "react-markdown"

export default function FAQBuilderClient() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    faq_type: "",
    audience: "",
    custom_audience: "",
    tone: "",
    source_url: "",
    extra_notes: "",
    faq_count: 5,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [faqContent, setFaqContent] = useState<string>("")

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setLoading(true)
    setError(null)
    setFaqContent("")

    try {
      const response = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/faq-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to generate FAQs. Please try again.")
      }

      const data = await response.json()

      let newFaqContent = "";

      if (Array.isArray(data)) {
        newFaqContent = data?.[0]?.output || data?.[0]?.content || "";
      } else if (data && typeof data === "object") {
        newFaqContent = data.output || data.content || "";
      }

      if (!newFaqContent || typeof newFaqContent !== "string") {
        throw new Error("Invalid response format")
      }

      setFaqContent(newFaqContent)
    } catch (err: any) {
      setError(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  const handleCopyAll = () => {
    navigator.clipboard.writeText(faqContent)
  }

  const handleExport = (format: "md" | "txt" = "md") => {
    if (!faqContent) return;

    const mimeType = format === "md" ? "text/markdown;charset=utf-8" : "text/plain;charset=utf-8";
    const extension = format === "md" ? "md" : "txt";
    
    let filename = `faq-builder-export-${new Date().toISOString().split("T")[0]}.${extension}`;
    
    if (formData.title?.trim()) {
      const sanitized = formData.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
      if (sanitized) {
        filename = `${sanitized}-faq.${extension}`;
      }
    }

    const blob = new Blob([faqContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <Card>
        <CardHeader>
          <CardTitle>FAQ Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Title / Name</Label>
                <Input
                  id="title"
                  placeholder="Enter product, service, or event name"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  placeholder="Briefly describe what this is about"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  required
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>FAQ Type</Label>
                <Select value={formData.faq_type} onValueChange={(v) => handleInputChange("faq_type", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select FAQ Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Website FAQ">Website FAQ</SelectItem>
                    <SelectItem value="Product FAQ">Product FAQ</SelectItem>
                    <SelectItem value="Service FAQ">Service FAQ</SelectItem>
                    <SelectItem value="Event / Webinar FAQ">Event / Webinar FAQ</SelectItem>
                    <SelectItem value="Support FAQ">Support FAQ</SelectItem>
                    <SelectItem value="Pricing FAQ">Pricing FAQ</SelectItem>
                    <SelectItem value="Internal FAQ">Internal FAQ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={formData.tone} onValueChange={(v) => handleInputChange("tone", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Friendly">Friendly</SelectItem>
                    <SelectItem value="Simple">Simple</SelectItem>
                    <SelectItem value="Formal">Formal</SelectItem>
                    <SelectItem value="Sales-focused">Sales-focused</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 md:col-span-2">
                <div className="space-y-2">
                  <Label>Audience</Label>
                  <Select value={formData.audience} onValueChange={(v) => handleInputChange("audience", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General Customers">General Customers</SelectItem>
                      <SelectItem value="Prospects / Leads">Prospects / Leads</SelectItem>
                      <SelectItem value="Existing Clients">Existing Clients</SelectItem>
                      <SelectItem value="Employees">Employees</SelectItem>
                      <SelectItem value="Students / Attendees">Students / Attendees</SelectItem>
                      <SelectItem value="Business Owners">Business Owners</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.audience === "Custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="custom_audience">Custom Audience</Label>
                    <Input
                      id="custom_audience"
                      placeholder="Specify audience"
                      value={formData.custom_audience}
                      onChange={(e) => handleInputChange("custom_audience", e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            <Collapsible className="rounded-lg border bg-muted/50 p-4">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="flex w-full justify-between font-medium">
                  More Options
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="source_url">Website URL (Optional)</Label>
                  <Input
                    id="source_url"
                    placeholder="https://..."
                    value={formData.source_url}
                    onChange={(e) => handleInputChange("source_url", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="extra_notes">Extra Notes</Label>
                  <Textarea
                    id="extra_notes"
                    placeholder="Any specific points to cover?"
                    value={formData.extra_notes}
                    onChange={(e) => handleInputChange("extra_notes", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faq_count">Number of FAQs (3-15)</Label>
                  <Input
                    id="faq_count"
                    type="number"
                    min={3}
                    max={15}
                    value={formData.faq_count}
                    onChange={(e) => handleInputChange("faq_count", parseInt(e.target.value, 10) || 5)}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {error && <div className="text-sm font-medium text-destructive">{error}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating FAQs...
                </>
              ) : (
                "Generate FAQs"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {faqContent && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Generated FAQs</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleSubmit()} disabled={loading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyAll}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport("md")} disabled={!faqContent}>
                <Download className="mr-2 h-4 w-4" />
                Export MD
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport("txt")} disabled={!faqContent}>
                <Download className="mr-2 h-4 w-4" />
                Export TXT
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                <ReactMarkdown>{faqContent}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
