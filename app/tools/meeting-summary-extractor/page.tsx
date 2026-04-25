"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Loader2, CheckCircle, XCircle, FileText, Mic, Square, Upload, Trash2, 
  Copy, Download, Play, Pause, User, Mail, Calendar, Trash, Check, AudioLines
} from "lucide-react"
import { ContentLoadingScreen } from "@/components/loading-screen"
import { jsPDF } from "jspdf"

interface MeetingData {
  name: string
  email: string
  meetingTitle: string
  transcript: string
}

interface WebhookResponse {
  success?: boolean
  data?: {
    transcript?: string
    summary?: string
    keyDiscussionPoints?: string[] | string
    decisionsMade?: string[] | string
    actionItems?: any[] | string
    risksOrBlockers?: string[] | string
    nextSteps?: string[] | string
    followUpEmail?: string
  }
  summary?: string
  actionItems?: any[] | string
  decisions?: string[] | string
  nextSteps?: string[] | string
  transcript?: string
  [key: string]: any
}

const parseMarkdown = (text: string): string => {
  if (!text) return ""
  return (
    text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>")
      .replace(/^- (.*$)/gim, "<li>$1</li>")
      .replace(/(<li>.*<\/li>)(\s*<br>\s*<li>.*<\/li>)*/g, (match) => {
        const items = match.replace(/<br>\s*/g, "").split("</li>").filter((item) => item.trim())
        return "<ul class='list-disc pl-5 my-2'>" + items.map((item) => item + "</li>").join("") + "</ul>"
      })
  )
}

export default function MeetingSummaryExtractor() {
  // Form State
  const [formData, setFormData] = useState<MeetingData>({ 
    name: "", 
    email: "", 
    meetingTitle: "", 
    transcript: "" 
  })
  const [inputType, setInputType] = useState<"text" | "audio_upload" | "audio_recording">("text")
  const [audioFile, setAudioFile] = useState<File | null>(null)
  
  // Recording State
  const [isRecording, setIsRecording] = useState(false)
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // UI State
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [result, setResult] = useState<WebhookResponse | null>(null)
  const [copied, setCopied] = useState(false)

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (audioURL) URL.revokeObjectURL(audioURL)
    }
  }, [audioURL])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0])
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        const url = URL.createObjectURL(blob)
        setRecordingBlob(blob)
        setAudioURL(url)
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingDuration(0)
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1)
      }, 1000)
    } catch (err) {
      console.error("Error accessing microphone:", err)
      setMessage({ type: "error", text: "Could not access microphone. Please check permissions." })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const clearRecording = () => {
    if (audioURL) URL.revokeObjectURL(audioURL)
    setRecordingBlob(null)
    setAudioURL(null)
    setRecordingDuration(0)
  }

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${min}:${sec.toString().padStart(2, '0')}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.email || !formData.meetingTitle) {
      setMessage({ type: "error", text: "Please fill in all required user details." })
      return
    }

    if (inputType === "text" && !formData.transcript) {
      setMessage({ type: "error", text: "Please paste a meeting transcript." })
      return
    }

    if (inputType === "audio_upload" && !audioFile) {
      setMessage({ type: "error", text: "Please upload an audio file." })
      return
    }

    if (inputType === "audio_recording" && !recordingBlob) {
      setMessage({ type: "error", text: "Please record audio before submitting." })
      return
    }

    setIsLoading(true)
    setMessage(null)
    setResult(null)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("meetingTitle", formData.meetingTitle)
      formDataToSend.append("inputType", inputType)
      formDataToSend.append("sourceTool", "meeting_summary_extractor")
      formDataToSend.append("submittedAt", new Date().toISOString())

      if (inputType === "text") {
        formDataToSend.append("transcript", formData.transcript)
      } else if (inputType === "audio_upload" && audioFile) {
        formDataToSend.append("audio", audioFile)
      } else if (inputType === "audio_recording" && recordingBlob) {
        formDataToSend.append("audio", recordingBlob, "meeting-recording.webm")
      }

      const response = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/meeting-summary-extractor", {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
        const responseData: WebhookResponse = await response.json()
        setResult(responseData)
        setMessage({ type: "success", text: "Meeting processed successfully!" })
      } else {
        const errorData = await response.text()
        throw new Error(errorData || "Failed to process meeting")
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `Error: ${error instanceof Error ? error.message : "Internal server error"}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (!result) return
    const data = result.data || result
    const textToCopy = [
      `Meeting Title: ${formData.meetingTitle}`,
      `Summary: ${data.summary || ""}`,
      data.keyDiscussionPoints ? `Key Discussion Points:\n${Array.isArray(data.keyDiscussionPoints) ? data.keyDiscussionPoints.join("\n") : data.keyDiscussionPoints}` : "",
      data.decisionsMade || data.decisions ? `Decisions Made:\n${Array.isArray(data.decisionsMade || data.decisions) ? (data.decisionsMade || data.decisions).join("\n") : (data.decisionsMade || data.decisions)}` : "",
      data.actionItems ? `Action Items:\n${Array.isArray(data.actionItems) ? data.actionItems.map((item: any) => typeof item === 'string' ? item : `${item.task || item.item} (${item.owner || 'Unassigned'})`).join("\n") : data.actionItems}` : "",
    ].filter(Boolean).join("\n\n")

    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadTXT = () => {
    if (!result) return
    const data = result.data || result
    let content = `MEETING SUMMARY: ${formData.meetingTitle}\n` + "=".repeat(40) + "\n\n"
    
    if (data.summary) content += `SUMMARY:\n${data.summary}\n\n`
    
    const discussion = data.keyDiscussionPoints
    if (discussion) {
      content += `KEY DISCUSSION POINTS:\n`
      content += Array.isArray(discussion) ? discussion.map(i => `- ${i}`).join("\n") : discussion
      content += "\n\n"
    }

    const decisions = data.decisionsMade || data.decisions
    if (decisions) {
      content += `DECISIONS MADE:\n`
      content += Array.isArray(decisions) ? decisions.map(i => `- ${i}`).join("\n") : decisions
      content += "\n\n"
    }

    const items = data.actionItems
    if (items) {
      content += `ACTION ITEMS:\n`
      content += Array.isArray(items) ? items.map((i: any) => typeof i === 'string' ? `- ${i}` : `- ${i.task || i.item} [Owner: ${i.owner || 'N/A'}]`).join("\n") : items
      content += "\n\n"
    }

    const element = document.createElement("a")
    const file = new Blob([content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${formData.meetingTitle.replace(/\s+/g, '-').toLowerCase()}-summary.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const downloadPDF = () => {
    if (!result) return
    const data = result.data || result
    const doc = new jsPDF()
    let yPos = 20
    const margin = 20
    const pageWidth = doc.internal.pageSize.getWidth()
    const contentWidth = pageWidth - (margin * 2)

    doc.setFontSize(22)
    doc.setTextColor(249, 115, 22) // Orange-500
    doc.text("Meeting Summary", margin, yPos)
    yPos += 15

    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text(formData.meetingTitle || "Untitled Meeting", margin, yPos)
    yPos += 10

    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Generated on ${new Date().toLocaleDateString()} for ${formData.name}`, margin, yPos)
    yPos += 15

    const addSection = (title: string, content: any) => {
      if (!content || (Array.isArray(content) && content.length === 0)) return
      
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }

      doc.setFontSize(14)
      doc.setTextColor(0, 0, 0)
      doc.text(title, margin, yPos)
      yPos += 7

      doc.setFontSize(11)
      doc.setTextColor(60, 60, 60)
      
      let text = ""
      if (Array.isArray(content)) {
        text = content.map(i => typeof i === 'string' ? `• ${i}` : `• ${i.task || i.item} (${i.owner || 'N/A'})`).join("\n")
      } else {
        text = content
      }

      const splitText = doc.splitTextToSize(text, contentWidth)
      doc.text(splitText, margin, yPos)
      yPos += (splitText.length * 6) + 10
    }

    addSection("Summary", data.summary)
    addSection("Key Discussion Points", data.keyDiscussionPoints)
    addSection("Decisions Made", data.decisionsMade || data.decisions)
    addSection("Action Items", data.actionItems)
    addSection("Risks / Blockers", data.risksOrBlockers)
    addSection("Next Steps", data.nextSteps || data.nextSteps)
    addSection("Follow-up Email", data.followUpEmail)

    doc.save(`${formData.meetingTitle.replace(/\s+/g, '-').toLowerCase()}-summary.pdf`)
  }

  const renderSection = (title: string, content: any) => {
    if (!content || (Array.isArray(content) && content.length === 0)) return null

    return (
      <div className="mb-6 animate-fade-in">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center border-b pb-2 dark:border-gray-700">
          <span className="w-1.5 h-6 bg-orange-500 rounded-full mr-2"></span>
          {title}
        </h3>
        {Array.isArray(content) ? (
          <ul className="space-y-2">
            {content.map((item, idx) => (
              <li key={idx} className="flex items-start text-gray-700 dark:text-gray-300">
                <div className="mt-1.5 mr-2 h-1.5 w-1.5 rounded-full bg-orange-400 flex-shrink-0"></div>
                {typeof item === 'string' ? (
                  <div dangerouslySetInnerHTML={{ __html: parseMarkdown(item) }} />
                ) : (
                  <div>
                    <span className="font-semibold">{item.task || item.item}</span>
                    {item.owner && <span className="text-xs ml-2 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">{item.owner}</span>}
                    {item.deadline && <span className="text-xs text-gray-400 ml-2 italic">Due: {item.deadline}</span>}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div 
            className="text-gray-700 dark:text-gray-300 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
          />
        )}
      </div>
    )
  }

  if (isLoading) return <ContentLoadingScreen />

  const finalResultData = result ? (result.data || result) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col items-center p-4 md:p-8 transition-colors">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 bg-orange-500 rounded-2xl shadow-xl shadow-orange-500/20 mb-6 group transition-transform hover:scale-110">
            <AudioLines className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
            Meeting <span className="text-orange-500">Summary</span> Extractor
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto font-medium">
            Transform meeting audio, recordings, or transcripts into powerful, actionable insights in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Side */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-0 shadow-2xl shadow-orange-500/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl overflow-hidden">
              <CardHeader className="border-b dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  Meeting Details
                </CardTitle>
                <CardDescription>Enter basic information to get started</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-gray-500">Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="pl-10 h-11 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-gray-500">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="pl-10 h-11 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meetingTitle" className="text-xs font-semibold uppercase tracking-wider text-gray-500">Meeting Title</Label>
                  <Input
                    id="meetingTitle"
                    name="meetingTitle"
                    value={formData.meetingTitle}
                    onChange={handleInputChange}
                    placeholder="e.g., Weekly Sync or Q2 Strategy"
                    className="h-11 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl shadow-orange-500/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl overflow-hidden">
              <CardHeader className="border-b dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                <CardTitle className="text-xl">Input Method</CardTitle>
                <CardDescription>Choose how you want to provide meeting content</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs value={inputType} onValueChange={(v) => setInputType(v as any)} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    <TabsTrigger value="text" className="rounded-lg py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Text
                    </TabsTrigger>
                    <TabsTrigger value="audio_upload" className="rounded-lg py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </TabsTrigger>
                    <TabsTrigger value="audio_recording" className="rounded-lg py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
                      <Mic className="h-4 w-4 mr-2" />
                      Record
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="mt-0">
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Paste Transcript</Label>
                      <Textarea
                        name="transcript"
                        value={formData.transcript}
                        onChange={handleInputChange}
                        placeholder="Paste your meeting transcript here..."
                        className="min-h-[250px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-orange-500 transition-all resize-none"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="audio_upload" className="mt-0">
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div 
                        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
                          audioFile 
                            ? "border-orange-500 bg-orange-50/30 dark:bg-orange-500/5 text-orange-600" 
                            : "border-gray-200 dark:border-gray-800 hover:border-orange-400 hover:bg-orange-50/10"
                        }`}
                      >
                        <input
                          type="file"
                          id="audio-upload"
                          className="hidden"
                          accept="audio/*,.mp3,.wav,.m4a,.webm,.ogg"
                          onChange={handleFileChange}
                        />
                        <label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center">
                          {audioFile ? (
                            <>
                              <div className="p-3 bg-orange-500 rounded-full text-white mb-4">
                                <FileText className="h-6 w-6" />
                              </div>
                              <p className="font-bold text-lg mb-1 truncate max-w-xs">{audioFile.name}</p>
                              <p className="text-sm opacity-70">{(audioFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to process</p>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={(e) => { e.preventDefault(); setAudioFile(null); }}
                                className="mt-4 text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Remove File
                              </Button>
                            </>
                          ) : (
                            <>
                              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-400 mb-4 group-hover:bg-orange-100 dark:group-hover:bg-orange-950 transition-colors">
                                <Upload className="h-8 w-8" />
                              </div>
                              <p className="font-bold text-gray-700 dark:text-gray-200 mb-2">Click to upload or drag & drop</p>
                              <p className="text-sm text-gray-400">MP3, WAV, M4A, WEBM, OGG (MAX 100MB)</p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="audio_recording" className="mt-0">
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6 text-center py-6">
                      {!audioURL ? (
                        <div className="space-y-6">
                          <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center transition-all ${isRecording ? "bg-red-500 animate-pulse scale-110 shadow-lg shadow-red-500/20" : "bg-orange-500 shadow-lg shadow-orange-500/20"}`}>
                            {isRecording ? <Square className="h-8 w-8 text-white fill-white" /> : <Mic className="h-10 w-10 text-white" />}
                          </div>
                          <div className="space-y-4">
                            <h3 className="text-2xl font-bold">{isRecording ? "Recording..." : "Ready to record"}</h3>
                            {isRecording ? (
                               <div className="text-4xl font-mono text-red-500 font-bold tracking-widest">{formatDuration(recordingDuration)}</div>
                            ) : (
                               <p className="text-gray-400 max-w-xs mx-auto">Capture your meeting audio directly in the browser for instant summary.</p>
                            )}
                            <div className="flex justify-center gap-4 pt-4">
                              {!isRecording ? (
                                <Button onClick={startRecording} size="lg" className="h-14 px-8 rounded-full bg-orange-500 hover:bg-orange-600 text-lg shadow-lg">
                                  <Mic className="h-5 w-5 mr-3" /> Start Recording
                                </Button>
                              ) : (
                                <Button onClick={stopRecording} size="lg" variant="destructive" className="h-14 px-8 rounded-full text-lg shadow-lg">
                                  <Square className="h-5 w-5 mr-3" /> Stop Recording
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-6">
                           <div className="flex items-center justify-center mb-2">
                             <div className="bg-green-500 text-white p-2 rounded-full mr-3 animate-in zoom-in">
                               <Check className="h-5 w-5" />
                             </div>
                             <h4 className="font-bold text-lg text-green-600 dark:text-green-400">Recording Captured</h4>
                           </div>
                           <audio src={audioURL} controls className="w-full h-12" />
                           <div className="flex items-center justify-between pt-4">
                             <span className="text-sm font-medium text-gray-500">Format: WebM</span>
                             <Button onClick={clearRecording} variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                               <Trash2 className="h-4 w-4 mr-2" /> Re-record
                             </Button>
                           </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="p-6 bg-gray-50 dark:bg-gray-800/80 border-t dark:border-gray-800">
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading} 
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-xl shadow-xl shadow-orange-500/20 transition-all active:scale-95"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing meeting...
                    </>
                  ) : (
                    "Extract Summary"
                  )}
                </Button>
              </CardFooter>
            </Card>

            {message && !result && (
              <Alert className={`border-0 shadow-lg ${message.type === "success" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}>
                {message.type === "success" ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                <AlertDescription className="ml-2 font-medium">{message.text}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Result Side */}
          <div className="lg:col-span-7 h-full">
            <Card className="h-full border-0 shadow-2xl shadow-orange-500/5 bg-white dark:bg-gray-900 flex flex-col overflow-hidden min-h-[600px]">
              <CardHeader className="border-b dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <FileText className="h-6 w-6 text-orange-500" />
                    Extraction Results
                  </CardTitle>
                  <CardDescription>Your intelligent meeting insights</CardDescription>
                </div>
                {result && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard} className="hidden sm:flex">
                      {copied ? <Check className="h-4 w-4 text-green-500 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadTXT} className="hidden sm:flex">
                      <Download className="h-4 w-4 mr-2" /> TXT
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadPDF} className="bg-orange-500 hover:bg-orange-600 text-white border-0">
                      <Download className="h-4 w-4 mr-2" /> PDF
                    </Button>
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-0 flex-1 overflow-y-auto">
                {result ? (
                  <div className="p-8 space-y-2 animate-in fade-in duration-700">
                    {renderSection("Meeting Summary", finalResultData?.summary)}
                    {renderSection("Key Discussion Points", finalResultData?.keyDiscussionPoints)}
                    {renderSection("Decisions Made", finalResultData?.decisionsMade || finalResultData?.decisions)}
                    {renderSection("Action Items", finalResultData?.actionItems)}
                    {renderSection("Risks or Blockers", finalResultData?.risksOrBlockers)}
                    {renderSection("Next Steps", finalResultData?.nextSteps)}
                    {renderSection("Follow-up Email", finalResultData?.followUpEmail)}
                    {renderSection("Transcript", finalResultData?.transcript)}
                    
                    {/* Mobile Only Buttons */}
                    <div className="flex flex-col gap-3 pt-6 sm:hidden">
                       <Button variant="outline" className="w-full" onClick={copyToClipboard}>
                         <Copy className="h-4 w-4 mr-2" /> Copy to Clipboard
                       </Button>
                       <Button variant="outline" className="w-full" onClick={downloadTXT}>
                         <Download className="h-4 w-4 mr-2" /> Download TXT
                       </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[500px] text-center p-10 opacity-40">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-8 mb-6">
                      <AudioLines className="h-20 w-20 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-500 dark:text-gray-400 mb-2">No summary yet</h3>
                    <p className="max-w-xs text-gray-400">Complete the form and click "Extract Summary" to see your meeting magic here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 mb-8 opacity-50 text-sm">
          <p className="flex items-center justify-center gap-2">
            Securely processed by <span className="font-bold text-orange-500">Kozker AI</span> • Enterprise Grade Transcription
          </p>
        </div>
      </div>
    </div>
  )
}
