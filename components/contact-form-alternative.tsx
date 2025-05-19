"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function ContactFormAlternative() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const router = useRouter()

  // Form fields
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [subject, setSubject] = useState("general")
  const [message, setMessage] = useState("")

  // Form validation
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    subject?: string
    message?: string
  }>({})

  const validateForm = () => {
    const newErrors: {
      name?: string
      email?: string
      subject?: string
      message?: string
    } = {}

    if (!name || name.length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!subject) {
      newErrors.subject = "Please select a subject"
    }

    if (!message || message.length < 10) {
      newErrors.message = "Message must be at least 10 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setFormState("submitting")

    try {
      // Simple mailto link as fallback
      const mailtoLink = `mailto:contact@kozker.com?subject=${encodeURIComponent(
        `[${subject}] Contact form submission`,
      )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\n\n${message}`)}`

      // Open mailto link in new tab
      window.open(mailtoLink, "_blank")

      // Simulate success
      setFormState("success")

      // Reset form
      setName("")
      setEmail("")
      setPhone("")
      setSubject("general")
      setMessage("")

      // Redirect to thank you page
      router.push("/thank-you")
    } catch (error) {
      console.error("Form submission error:", error)
      setFormState("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="dark:bg-gray-800 dark:border-gray-700 mt-1"
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="dark:bg-gray-800 dark:border-gray-700 mt-1"
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <Label htmlFor="phone">Phone (Optional)</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 1234567890"
            className="dark:bg-gray-800 dark:border-gray-700 mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="subject">Subject</Label>
        <select
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 mt-1"
        >
          <option value="web-design">Web Design</option>
          <option value="customer-support">Customer Support</option>
          <option value="whatsapp-automation">WhatsApp Automation</option>
          <option value="power-bi">Power BI Solutions</option>
          <option value="general">General Inquiry</option>
        </select>
        {errors.subject && <p className="text-sm text-red-500 mt-1">{errors.subject}</p>}
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help you?"
          className="min-h-32 resize-none dark:bg-gray-800 dark:border-gray-700 mt-1"
        />
        {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>

      {formState === "error" && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md text-center">
          There was an error submitting the form. Please try again.
        </div>
      )}
    </form>
  )
}
