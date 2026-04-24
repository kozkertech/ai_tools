"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Download } from "lucide-react"

interface FormattedOutputProps {
  title?: string
  content: string
  type?: "html" | "text" | "markdown"
  showCopyButton?: boolean
  showDownloadButton?: boolean
  className?: string
}

export function FormattedOutput({
  title = "Generated Content",
  content,
  type = "text",
  showCopyButton = true,
  showDownloadButton = false,
  className = "",
}: FormattedOutputProps) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content)
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const downloadContent = () => {
    const element = document.createElement("a")
    const file = new Blob([content], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${title.toLowerCase().replace(/\s+/g, "-")}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const renderContent = () => {
    switch (type) {
      case "html":
        return <div className="prose prose-sm max-w-none text-[var(--night)]" dangerouslySetInnerHTML={{ __html: content }} />
      case "markdown":
        return (
          <pre className="whitespace-pre-wrap text-sm font-mono bg-[var(--mist)] p-4 rounded-xl border border-[var(--iron)] overflow-auto text-[var(--night)]">{content}</pre>
        )
      default:
        return <div className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--night)]">{content}</div>
    }
  }

  return (
    <Card className={`card border-[var(--iron)] bg-[var(--cloud)] ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-[var(--iron)] bg-[var(--mist)] rounded-t-2xl">
        <CardTitle className="text-lg font-bold tracking-tight text-[var(--night)]">{title}</CardTitle>
        <div className="flex gap-2">
          {showCopyButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="btn btn-secondary border-[var(--iron)] text-[var(--night)] hover:bg-[var(--cloud)]"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          )}
          {showDownloadButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={downloadContent}
              className="btn btn-secondary border-[var(--iron)] text-[var(--night)] hover:bg-[var(--cloud)]"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="max-h-96 overflow-auto border border-[var(--iron)] rounded-xl p-4 bg-[var(--mist)]">{renderContent()}</div>
      </CardContent>
    </Card>
  )
}

export default FormattedOutput
