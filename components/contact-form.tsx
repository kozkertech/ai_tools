"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  subject: z.string().min(1, {
    message: "Please select a subject.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
})

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [netlifySupportActive, setNetlifySupportActive] = useState(false)

  // Check if we're in a Netlify environment
  useEffect(() => {
    // This will help us determine if we're running on Netlify
    if (typeof window !== "undefined") {
      // Check for Netlify environment
      const isNetlify =
        window.location.hostname.includes("netlify.app") || document.querySelector('[data-netlify="true"]') !== null

      setNetlifySupportActive(isNetlify)
    }
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setFormState("submitting")

    try {
      if (netlifySupportActive) {
        // Let the native form submission handle it
        // The form will be processed by Netlify's form handling
        return true
      } else {
        // Fallback for non-Netlify environments
        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1500))
        console.log(values)
        setFormState("success")
        form.reset()
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setFormState("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Create a hidden form for Netlify to detect during build
  const NetlifyFormHiddenFields = () => (
    <>
      <input type="hidden" name="form-name" value="contact" />
      <div className="hidden">
        <label>
          Don't fill this out if you're human: <input name="bot-field" />
        </label>
      </div>
    </>
  )

  return (
    <>
      {/* Hidden form for Netlify form detection */}
      <div className="hidden" aria-hidden="true">
        <form name="contact" data-netlify="true" netlify-honeypot="bot-field">
          <input type="text" name="name" />
          <input type="email" name="email" />
          <input type="text" name="phone" />
          <input type="text" name="subject" />
          <textarea name="message"></textarea>
        </form>
      </div>

      <Form {...form}>
        <form
          name="contact"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          action="/thank-you"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <NetlifyFormHiddenFields />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} className="dark:bg-gray-800 dark:border-gray-700" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your.email@example.com"
                      {...field}
                      className="dark:bg-gray-800 dark:border-gray-700"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 1234567890" {...field} className="dark:bg-gray-800 dark:border-gray-700" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="dark:bg-gray-800">
                    <SelectItem value="web-design">Web Design</SelectItem>
                    <SelectItem value="customer-support">Customer Support</SelectItem>
                    <SelectItem value="whatsapp-automation">WhatsApp Automation</SelectItem>
                    <SelectItem value="power-bi">Power BI Solutions</SelectItem>
                    <SelectItem value="general">General Inquiry</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="How can we help you?"
                    className="min-h-32 resize-none dark:bg-gray-800 dark:border-gray-700"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
      </Form>
    </>
  )
}
