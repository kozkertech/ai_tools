"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, ArrowLeft, ArrowRight, Loader2, CheckCircle, XCircle, Edit } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import jsPDF from "jspdf"
import "jspdf-autotable"
import html2canvas from "html2canvas"

interface LineItem {
  id: string
  item: string
  description: string
  quantity: number
  price: number
}

interface InvoiceData {
  // Company info
  companyName: string
  companyEmail: string
  companyPhone: string
  companyGSTIN: string
  companyWebsite: string
  companyLogo: string | null

  // Customer info
  customerName: string
  customerEmail: string
  customerPhone: string
  customerGSTIN: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  placeOfSupply: string

  // Items
  lineItems: LineItem[]
  notes: string
  taxRate: number
  currency: string

  // Bank Details
  bankName: string
  accountHolder: string
  accountNumber: string
  ifscCode: string
  branch: string
  upiQrCode: string | null

  // Summary
  totalAmountInWords: string
}

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
]







const numberToWords = (num: number): string => {
  const sng = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const dbl = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  
  const formatGroup = (n: number) => {
    let out = "";
    if (n >= 100) {
      out += sng[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      out += dbl[Math.floor(n / 10)] + (n % 10 !== 0 ? "-" + sng[n % 10] : "") + " ";
    } else if (n > 0) {
      out += sng[n] + " ";
    }
    return out;
  };

  if (num === 0) return "Zero";
  
  let whole = Math.floor(num);
  let str = "";
  
  if (whole >= 10000000) {
    str += formatGroup(Math.floor(whole / 10000000)) + "Crore ";
    whole %= 10000000;
  }
  if (whole >= 100000) {
    str += formatGroup(Math.floor(whole / 100000)) + "Lakh ";
    whole %= 100000;
  }
  if (whole >= 1000) {
    str += formatGroup(Math.floor(whole / 1000)) + "Thousand ";
    whole %= 1000;
  }
  str += formatGroup(whole);

  return str.trim();
};

export default function InvoiceGenerator() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [webhookResponse, setWebhookResponse] = useState<any>(null)
  const [isEditingTax, setIsEditingTax] = useState(false)
  const [showInvoicePreview, setShowInvoicePreview] = useState(false)

    const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyGSTIN: "",
    companyWebsite: "",
    companyLogo: null,
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerGSTIN: "",
    invoiceNumber: "", // Default to empty string for initial state, will be auto-generated on render if empty or on submit
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    placeOfSupply: "",
    lineItems: [{ id: "1", item: "", description: "", quantity: 1, price: 0 }],
    notes: "",
    taxRate: 18,
    currency: "INR",
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    ifscCode: "",
    branch: "",
    upiQrCode: null,
    totalAmountInWords: "",
  })

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const updateInvoiceData = (field: keyof InvoiceData, value: any) => {
    setInvoiceData((prev) => ({ ...prev, [field]: value }))
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      item: "",
      description: "",
      quantity: 1,
      price: 0,
    }
    setInvoiceData((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem],
    }))
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setInvoiceData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }

  const removeLineItem = (id: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((item) => item.id !== id),
    }))
  }

  const calculateSubtotal = () => {
    return invoiceData.lineItems.reduce((sum, item) => sum + item.quantity * item.price, 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * (invoiceData.taxRate / 100)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const getCurrentCurrency = () => {
    return currencies.find((c) => c.code === invoiceData.currency) || currencies[0]
  }

  const formatCurrency = (amount: number, currency = invoiceData.currency) => {
    const num = Number(amount || 0)

    if (currency === "INR") {
      return `₹${num.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`
    }

    return num.toLocaleString("en-US", {
      style: "currency",
      currency
    })
  }

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    } catch (e) {
      return dateStr;
    }
  }

  const generateDefaultInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `INV-${year}-${random}`;
  }

  const resetForm = () => {
    setInvoiceData({
      companyName: "",
      companyEmail: "",
      companyPhone: "",
      companyGSTIN: "",
      companyWebsite: "",
      companyLogo: null,
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerGSTIN: "",
      invoiceNumber: generateDefaultInvoiceNumber(),
      invoiceDate: formatDate(new Date()),
      dueDate: formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
      placeOfSupply: "",
      lineItems: [{ id: "1", item: "", description: "", quantity: 1, price: 0 }],
      notes: "",
      taxRate: 18,
      currency: "INR",
      bankName: "",
      accountHolder: "",
      accountNumber: "",
      ifscCode: "",
      branch: "",
      upiQrCode: null,
      totalAmountInWords: "",
    })
    setCurrentStep(1)
    setShowInvoicePreview(false)
    setSubmitStatus("idle")
  }

        const handleSubmit = async () => {
    // Validation
    if (!invoiceData.companyName || !invoiceData.companyEmail || !invoiceData.companyPhone) {
      alert("Please fill in your company name, email, and phone.")
      return
    }
    if (!invoiceData.customerName) {
      alert("Please fill in the customer name.")
      return
    }

    setIsLoading(true)
    setSubmitStatus("idle")

    try {
      // Auto-set dates and invoice number if empty
      const today = new Date()
      const thirtyDaysLater = new Date()
      thirtyDaysLater.setDate(today.getDate() + 30)

      const finalInvoiceDate = invoiceData.invoiceDate || formatDate(today)
      const finalDueDate = invoiceData.dueDate || formatDate(thirtyDaysLater)
      const finalInvNumber = invoiceData.invoiceNumber || generateDefaultInvoiceNumber();
      
      const totalAmount = calculateTotal();
      const words = numberToWords(totalAmount);

      // Update state for preview
      setInvoiceData(prev => ({
        ...prev,
        invoiceDate: finalInvoiceDate,
        dueDate: finalDueDate,
        invoiceNumber: finalInvNumber,
        totalAmountInWords: words
      }))

      // Prepare payload (minimal base64)
      const payload = {
        ...invoiceData,
        invoiceDate: finalInvoiceDate,
        dueDate: finalDueDate,
        invoiceNumber: finalInvNumber,
        totalAmountInWords: words,
        hasLogo: !!invoiceData.companyLogo,
        hasUpiQrCode: !!invoiceData.upiQrCode,
        companyLogo: invoiceData.companyLogo ? "EXISTS" : null,
        upiQrCode: invoiceData.upiQrCode ? "EXISTS" : null,
        subtotal: calculateSubtotal(),
        taxAmount: calculateTax(),
        total: totalAmount,
        currencySymbol: getCurrentCurrency().symbol,
      }

      const response = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const responseData = await response.json()
      setWebhookResponse(responseData)

      if (response.ok) {
        setSubmitStatus("success")
        setShowInvoicePreview(true)
        // Scroll to preview
        setTimeout(() => {
          const el = document.getElementById('invoice-preview-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100)
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Error submitting invoice:", error)
      setSubmitStatus("error")
      setWebhookResponse({ error: "Failed to submit invoice" })
    } finally {
      setIsLoading(false)
    }
  }

    const generatePDF = async () => {
    const element = document.getElementById("invoice-preview")
    if (!element) return

    setIsGeneratingPDF(true)
    
    // Wait for the DOM to apply the compact class
    await new Promise(resolve => setTimeout(resolve, 100))

    try {
      const fullHeight = element.scrollHeight
      const fullWidth = element.scrollWidth

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: fullWidth,
        height: fullHeight,
        windowWidth: fullWidth,
        windowHeight: fullHeight,
        scrollX: 0,
        scrollY: 0
      })

      const imgData = canvas.toDataURL("image/jpeg", 0.98)

      const pdf = new jsPDF("p", "mm", "a4")

      const pageWidth = 210
      const pageHeight = 297

      const margin = 0
      const usableWidth = pageWidth - margin * 2
      const usableHeight = pageHeight - margin * 2

      const imgWidth = usableWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let finalWidth = imgWidth
      let finalHeight = imgHeight

      if (finalHeight > usableHeight) {
        const scaleFactor = usableHeight / finalHeight
        finalHeight = usableHeight
        finalWidth = finalWidth * scaleFactor
      }

      const x = (pageWidth - finalWidth) / 2
      const y = (pageHeight - finalHeight) / 2

      pdf.addImage(imgData, "JPEG", x, y, finalWidth, finalHeight)
      pdf.save(`Invoice-${invoiceData.invoiceNumber}.pdf`)
    } catch (error) {
      console.error("PDF generation failed:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-zinc-900 dark:to-zinc-900 font-inter">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-zinc-900 dark:to-zinc-900 rounded-2xl p-8 mb-8 text-center border border-gray-200 dark:border-gray-800">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white font-poppins">
              Professional Invoice Generator
            </h1>
            <p className="text-gray-600 dark:text-gray-400">GST-Compliant & Professional Design</p>
          </motion.div>
        </div>

        <Card className="shadow-xl border-0 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800" id="invoice-preview-section">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center items-center gap-2 mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      step <= currentStep 
                        ? "bg-orange-500 text-white" 
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-8 h-0.5 mx-2 transition-colors ${
                        step < currentStep 
                          ? "bg-orange-500" 
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white font-poppins text-center">
              STEP {currentStep} OF 3
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
                        <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white font-poppins text-center">
                    Biller Information
                  </h2>

                  {/* Logo Upload Section */}
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/50 mb-8">
                    {invoiceData.companyLogo ? (
                      <div className="relative group">
                        <img src={invoiceData.companyLogo} alt="Company Logo" className="max-h-32 rounded-lg shadow-sm" />
                        <button 
                          onClick={() => updateInvoiceData('companyLogo', null)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Label htmlFor="logo-upload" className="cursor-pointer flex flex-col items-center gap-2">
                          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-full text-orange-500">
                             <Plus className="h-8 w-8" />
                          </div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Upload Company Logo</span>
                        </Label>
                        <Input 
                          id="logo-upload" 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                updateInvoiceData('companyLogo', reader.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Business Name *</Label>
                      <Input
                        id="companyName"
                        placeholder="e.g. Kozker Technologies"
                        value={invoiceData.companyName}
                        onChange={(e) => updateInvoiceData("companyName", e.target.value)}
                        className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyGSTIN">GSTIN (Optional)</Label>
                      <Input
                        id="companyGSTIN"
                        placeholder="e.g. 29AAAAA0000A1Z5"
                        value={invoiceData.companyGSTIN}
                        onChange={(e) => updateInvoiceData("companyGSTIN", e.target.value.toUpperCase())}
                        className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyEmail">Email Address *</Label>
                      <Input
                        id="companyEmail"
                        type="email"
                        placeholder="contact@business.com"
                        value={invoiceData.companyEmail}
                        onChange={(e) => updateInvoiceData("companyEmail", e.target.value)}
                        className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyPhone">Phone Number *</Label>
                      <Input
                        id="companyPhone"
                        placeholder="+91 9876543210"
                        value={invoiceData.companyPhone}
                        onChange={(e) => updateInvoiceData("companyPhone", e.target.value)}
                        className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyWebsite">Website (Optional)</Label>
                    <Input
                      id="companyWebsite"
                      placeholder="www.business.com"
                      value={invoiceData.companyWebsite}
                      onChange={(e) => updateInvoiceData("companyWebsite", e.target.value)}
                      className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
                    />
                  </div>

                  <div className="border-t border-gray-100 dark:border-zinc-800 pt-6 mt-6">
                    <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white font-poppins text-center">Bank & Payment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                       <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                          id="bankName"
                          placeholder="e.g. HDFC Bank"
                          value={invoiceData.bankName}
                          onChange={(e) => updateInvoiceData("bankName", e.target.value)}
                          className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountHolder">Account Holder Name</Label>
                        <Input
                          id="accountHolder"
                          placeholder="e.g. Kozker Technologies"
                          value={invoiceData.accountHolder}
                          onChange={(e) => updateInvoiceData("accountHolder", e.target.value)}
                          className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          placeholder="e.g. 50100000000000"
                          value={invoiceData.accountNumber}
                          onChange={(e) => updateInvoiceData("accountNumber", e.target.value)}
                          className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ifscCode">IFSC Code</Label>
                        <Input
                          id="ifscCode"
                          placeholder="e.g. HDFC0000001"
                          value={invoiceData.ifscCode}
                          onChange={(e) => updateInvoiceData("ifscCode", e.target.value.toUpperCase())}
                          className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 uppercase"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="branch">Branch</Label>
                        <Input
                          id="branch"
                          placeholder="e.g. Koramangala"
                          value={invoiceData.branch}
                          onChange={(e) => updateInvoiceData("branch", e.target.value)}
                          className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/50">
                    {invoiceData.upiQrCode ? (
                      <div className="relative group">
                        <img src={invoiceData.upiQrCode} alt="UPI QR Code" className="max-h-32 rounded-lg shadow-sm" />
                        <button 
                          onClick={() => updateInvoiceData('upiQrCode', null)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Label htmlFor="qr-upload" className="cursor-pointer flex flex-col items-center gap-2">
                          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-full text-orange-500">
                             <Plus className="h-8 w-8" />
                          </div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Upload Payment QR Code Optional</span>
                        </Label>
                        <Input 
                          id="qr-upload" 
                          type="file" 
                          accept=".png,.jpg,.jpeg,.svg" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                updateInvoiceData('upiQrCode', reader.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white font-poppins text-center">
                    Customer & Invoice Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Customer Name *</Label>
                      <Input
                        id="customerName"
                        placeholder="e.g. John Doe"
                        value={invoiceData.customerName}
                        onChange={(e) => updateInvoiceData("customerName", e.target.value)}
                        className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerGSTIN">Customer GSTIN (Optional)</Label>
                      <Input
                        id="customerGSTIN"
                        placeholder="e.g. 29BBBBB0000B1Z5"
                        value={invoiceData.customerGSTIN}
                        onChange={(e) => updateInvoiceData("customerGSTIN", e.target.value.toUpperCase())}
                        className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="customerEmail">Customer Email</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        placeholder="customer@email.com"
                        value={invoiceData.customerEmail}
                        onChange={(e) => updateInvoiceData("customerEmail", e.target.value)}
                        className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerPhone">Customer Phone</Label>
                      <Input
                        id="customerPhone"
                        placeholder="+91 9876543210"
                        value={invoiceData.customerPhone}
                        onChange={(e) => updateInvoiceData("customerPhone", e.target.value)}
                        className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-100 dark:border-zinc-800 pt-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="invoiceNumber">Invoice #</Label>
                        <Input
                          id="invoiceNumber"
                          placeholder="e.g. INV-001"
                          value={invoiceData.invoiceNumber}
                          onChange={(e) => updateInvoiceData("invoiceNumber", e.target.value)}
                          className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="placeOfSupply">Place of Supply</Label>
                        <Input
                          id="placeOfSupply"
                          placeholder="e.g. Karnataka"
                          value={invoiceData.placeOfSupply}
                          onChange={(e) => updateInvoiceData("placeOfSupply", e.target.value)}
                          className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                           <Label htmlFor="taxRate">Tax Rate (%)</Label>
                           {isEditingTax ? (
                              <button onClick={() => setIsEditingTax(false)} className="text-[10px] text-blue-500">Save</button>
                           ) : (
                              <button onClick={() => setIsEditingTax(true)} className="text-[10px] text-gray-400 font-medium flex items-center gap-1 cursor-pointer"><Edit className="h-2.5 w-2.5" /> Edit</button>
                           )}
                        </div>
                        <Input
                          id="taxRate"
                          type="number"
                          disabled={!isEditingTax}
                          value={invoiceData.taxRate}
                          onChange={(e) => updateInvoiceData("taxRate", Number(e.target.value))}
                          className={`bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 ${!isEditingTax ? 'opacity-50' : ''}`}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white font-poppins">
                      Enter the items you wish to bill
                    </h2>
                    <div className="space-y-2">
                      <Label htmlFor="currency" className="text-gray-900 dark:text-white">
                        Currency
                      </Label>
                      <Select
                        value={invoiceData.currency}
                        onValueChange={(value) => updateInvoiceData("currency", value)}
                      >
                        <SelectTrigger className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-orange-500 w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700">
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700">
                              {currency.symbol} {currency.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-2 font-medium text-sm text-gray-900 dark:text-white">
                      <div className="col-span-3">Item</div>
                      <div className="col-span-4">Description</div>
                      <div className="col-span-2">Quantity</div>
                      <div className="col-span-2">Price</div>
                      <div className="col-span-1">Amount</div>
                    </div>

                    {invoiceData.lineItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-12 gap-2 items-center"
                      >
                        <div className="col-span-3">
                          <Input
                            placeholder="Item"
                            value={item.item}
                            onChange={(e) => updateLineItem(item.id, "item", e.target.value)}
                            className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-orange-500"
                          />
                        </div>
                        <div className="col-span-4">
                          <Input
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                            className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-orange-500"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            placeholder="1"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                            className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-orange-500"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="text"
                            inputMode="decimal"
                            placeholder="0.00"
                            value={item.price}
                            onChange={(e) => {
                              const value = e.target.value
                              // Allow only numbers and decimal point
                              if (value === "" || /^\d*\.?\d*$/.test(value)) {
                                updateLineItem(item.id, "price", value === "" ? 0 : Number.parseFloat(value) || 0)
                              }
                            }}
                            className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-orange-500"
                            style={{
                              // Remove spinner arrows
                              MozAppearance: "textfield",
                              WebkitAppearance: "none",
                              appearance: "none",
                            }}
                          />
                        </div>
                        <div className="col-span-1 flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {formatCurrency(item.quantity * item.price)}
                          </span>
                          {invoiceData.lineItems.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLineItem(item.id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 h-auto ml-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}

                    <Button
                      variant="ghost"
                      onClick={addLineItem}
                      className="text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add a line item
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-gray-900 dark:text-white">
                        Notes / Memo
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Additional notes..."
                        value={invoiceData.notes}
                        onChange={(e) => updateInvoiceData("notes", e.target.value)}
                        className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-orange-500 min-h-[120px]"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 space-y-3 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>Subtotal</span>
                          <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <span>Tax ({invoiceData.taxRate}%)</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsEditingTax(!isEditingTax)}
                              className="p-1 h-auto text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="font-medium">{formatCurrency(calculateTax())}</span>
                        </div>
                        {isEditingTax && (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              step="0.1"
                              value={invoiceData.taxRate}
                              onChange={(e) => updateInvoiceData("taxRate", Number.parseFloat(e.target.value) || 0)}
                              className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-orange-500 w-20"
                            />
                            <span className="text-gray-600 dark:text-gray-400">%</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsEditingTax(false)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                          <div className="bg-orange-500 rounded-lg p-4 text-white">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-semibold">Total</span>
                              <span className="text-2xl font-bold">{formatCurrency(calculateTotal())}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < 3 ? (
                <Button
                  onClick={nextStep}
                  className="bg-orange-500 hover:bg-orange-600 dark:hover:bg-[#d45616] text-white font-semibold transition-opacity px-6 py-4 rounded-lg"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-orange-500 hover:bg-orange-600 dark:hover:bg-[#d45616] text-white font-semibold transition-opacity px-8 py-4 rounded-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Invoice"
                  )}
                </Button>
              )}
            </div>

            {submitStatus !== "idle" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                <Alert
                  className={`${
                    submitStatus === "success"
                      ? "bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-800 text-green-800 dark:text-green-100"
                      : "bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-800 text-red-800 dark:text-red-100"
                  }`}
                >
                  {submitStatus === "success" ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  <AlertDescription>
                    {submitStatus === "success"
                      ? "Invoice submitted successfully!"
                      : "Failed to submit invoice. Please try again."}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

                        {showInvoicePreview && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-4">
                                <div className="flex flex-wrap justify-between items-center bg-white dark:bg-zinc-800 p-4 rounded-lg border border-gray-200 dark:border-zinc-700 shadow-sm gap-4">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowInvoicePreview(false)}
                      variant="outline"
                      className="border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-semibold"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Invoice
                    </Button>
                    <Button
                      onClick={resetForm}
                      variant="ghost"
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      New Invoice
                    </Button>
                  </div>
                  <Button
                    onClick={generatePDF}
                    disabled={isGeneratingPDF}
                    className="bg-orange-500 hover:bg-orange-600 dark:hover:bg-[#d45616] text-white font-semibold transition-opacity px-5 py-3 rounded-lg"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating PDF...
                      </>
                    ) : (
                      "Download PDF"
                    )}
                  </Button>
                </div>

                                                <div 
                  id="invoice-preview"
                  className={`bg-white text-gray-900 p-12 rounded-lg shadow-2xl border border-gray-200 flex flex-col ${isGeneratingPDF ? 'invoice-pdf-compact' : ''}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      {invoiceData.companyLogo ? (
                        <img src={invoiceData.companyLogo} alt="Logo" className="max-h-20 max-w-[200px] object-contain mb-8" />
                      ) : (
                         <div className="text-2xl font-bold text-orange-600 mb-8">{invoiceData.companyName}</div>
                      )}
                      <div className="text-sm space-y-1">
                        <p className="font-black text-xl tracking-tight text-gray-800">{invoiceData.companyName}</p>
                        <p className="text-gray-500">{invoiceData.companyEmail} • {invoiceData.companyPhone}</p>
                        {invoiceData.companyGSTIN && <p className="text-gray-700 bg-gray-50 inline-block px-2 py-0.5 rounded border">GSTIN: <span className="font-bold uppercase tracking-wider">{invoiceData.companyGSTIN}</span></p>}
                        {invoiceData.companyWebsite && <p className="text-blue-600 text-xs mt-2 underline">{invoiceData.companyWebsite}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <h1 className="text-7xl font-black text-gray-100 mb-8 tracking-tighter leading-none">INVOICE</h1>
                      <div className="space-y-3 mt-4 text-sm">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase text-gray-400">Invoice Number</span>
                            <span className="font-black text-lg text-orange-600 tracking-wider">{invoiceData.invoiceNumber}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase text-gray-400">Date Issued</span>
                            <span className="font-bold whitespace-nowrap text-gray-700">{formatDisplayDate(invoiceData.invoiceDate)}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase text-gray-400">Payment Due</span>
                            <span className="font-bold whitespace-nowrap text-orange-600 font-bold">{formatDisplayDate(invoiceData.dueDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bill To / Details */}
                  <div className="grid grid-cols-2 gap-12 mb-12 py-10 border-y-2 border-gray-100">
                    <div>
                      <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] mb-4">Billing Recipient</h3>
                      <div className="space-y-1">
                        <p className="font-black text-2xl text-gray-900 tracking-tight">{invoiceData.customerName}</p>
                        {invoiceData.customerPhone && <p className="text-gray-500 font-medium">{invoiceData.customerPhone}</p>}
                        {invoiceData.customerEmail && <p className="text-gray-400">{invoiceData.customerEmail}</p>}
                        {invoiceData.customerGSTIN && <p className="text-gray-700 text-xs mt-2 font-semibold bg-gray-50 px-2 py-1 border rounded inline-block">GSTIN: <span className="uppercase tracking-wider">{invoiceData.customerGSTIN}</span></p>}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 flex flex-col justify-center">
                       <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Place of Supply</span>
                          <span className="text-sm font-black text-gray-700 uppercase tracking-tight">{invoiceData.placeOfSupply || 'N/A'}</span>
                       </div>
                       <div className="border-t-2 border-dashed border-gray-200 pt-4">
                          <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mb-1">Total Outstanding</p>
                          <p className="text-4xl font-black text-gray-900 tracking-tighter">{formatCurrency(calculateTotal())}</p>
                       </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="flex-grow mb-12">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-4 border-gray-900 text-gray-900">
                          <th className="py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] w-3/5">Description of Services</th>
                          <th className="py-6 text-center text-[10px] font-black uppercase tracking-[0.2em]">Qty</th>
                          <th className="py-6 text-right text-[10px] font-black uppercase tracking-[0.2em]">Rate</th>
                          <th className="py-6 text-right text-[10px] font-black uppercase tracking-[0.2em]">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {invoiceData.lineItems.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-8 pr-8">
                              <p className="font-black text-gray-900 text-lg tracking-tight">{item.item}</p>
                              <p className="text-xs text-gray-500 mt-2 font-medium leading-relaxed">{item.description}</p>
                            </td>
                            <td className="py-8 text-center font-black text-gray-600">{item.quantity}</td>
                            <td className="py-8 text-right font-bold text-gray-600">{formatCurrency(item.price)}</td>
                            <td className="py-8 text-right font-black text-gray-900 text-lg tracking-tight">{formatCurrency(item.quantity * item.price)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Bottom Footer Section */}
                  <div className="mt-auto border-t-4 border-gray-900 pt-10 pdf-section bottom-summary-section">
                      <div className="space-y-10 bank-details-section">
                        {/* Bank Details */}
                        {(invoiceData.bankName || invoiceData.accountNumber) && (
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em] flex items-center gap-2">Bank & Payment Details</h4>
                            <div className="grid grid-cols-1 gap-1 text-xs">
                               <p className="text-gray-400 font-black uppercase tracking-tighter">Bank Name: <span className="text-gray-900 font-black uppercase">{invoiceData.bankName}</span></p>
                               <p className="text-gray-400 font-black uppercase tracking-tighter">Account Holder: <span className="text-gray-900 font-black uppercase">{invoiceData.accountHolder}</span></p>
                               <p className="text-gray-400 font-black uppercase tracking-tighter">Account No: <span className="text-gray-900 font-black tracking-widest font-mono">{invoiceData.accountNumber}</span></p>
                               <p className="text-gray-400 font-black uppercase tracking-tighter">IFSC Code: <span className="text-gray-900 font-black uppercase tracking-widest font-mono">{invoiceData.ifscCode}</span></p>
                               <p className="text-gray-400 font-black uppercase tracking-tighter">Branch: <span className="text-gray-900 font-black uppercase">{invoiceData.branch}</span></p>
                            </div>
                          </div>
                        )}

                        {/* UPI QR */}
                        {invoiceData.upiQrCode && (
                          <div className="flex items-center gap-6">
                            <div className="p-3 border-2 border-gray-900 rounded-3xl bg-white shadow-xl">
                               <img src={invoiceData.upiQrCode} alt="UPI QR" className="w-24 h-24 object-contain" />
                               <p className="text-[8px] text-center mt-2 font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Scan to Pay Instantly</p>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Instant Settlement</p>
                               <p className="text-xs font-bold text-gray-800">Support all UPI Apps</p>
                            </div>
                          </div>
                        )}

                        {/* Amount in Words */}
                        <div className="pt-4 space-y-2">
                           <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Total amount (in words)</p>
                           <p className="text-lg font-black italic text-gray-900 leading-tight border-b-2 border-orange-100 pb-2">{invoiceData.currency === 'INR' ? 'INR ' : ''}{invoiceData.totalAmountInWords} {invoiceData.currency === 'INR' ? 'Rupees Only' : 'Only'}</p>
                        </div>
                        
                        {invoiceData.notes && (
                           <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Terms & Notes</h4>
                            <p className="text-xs text-gray-600 leading-relaxed font-medium">{invoiceData.notes}</p>
                           </div>
                        )}
                      </div>

                      <div className="flex flex-col justify-start totals-card">
                        <div className="space-y-4 bg-gray-50 p-8 rounded-[3rem] border border-gray-100">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400 font-black uppercase tracking-widest">Net Subtotal</span>
                            <span className="font-black text-gray-800 tracking-tight">{formatCurrency(calculateSubtotal())}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400 font-black uppercase tracking-widest">CGST ({(invoiceData.taxRate / 2).toFixed(1)}%)</span>
                            <span className="font-bold text-gray-600">{formatCurrency(calculateTax() / 2)}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400 font-black uppercase tracking-widest">SGST ({(invoiceData.taxRate / 2).toFixed(1)}%)</span>
                            <span className="font-bold text-gray-600">{formatCurrency(calculateTax() / 2)}</span>
                          </div>
                          <div className="flex justify-between items-center pt-6 mt-2 border-t-2 border-gray-200">
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Grand Total</span>
                            <div className="text-right">
                               <span className="text-3xl font-black text-orange-600 tracking-tighter">{formatCurrency(calculateTotal())}</span>
                               <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-1">Total Payable</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    <div className="mt-20 flex justify-between items-end">
                        <div className="space-y-1">
                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">This is a system generated document</p>
                            <p className="text-[8px] text-gray-300 font-bold uppercase tracking-tight">Generated via Kozker Invoice Studio</p>
                        </div>
                        <div className="h-1 w-24 bg-gray-900"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap');
        
        #invoice-preview {
          width: 794px;
          min-height: auto;
          max-height: none;
          background: #ffffff;
          color: #111827;
          overflow: visible;
          box-sizing: border-box;
        }

        .invoice-pdf-compact {
          width: 794px !important;
          padding: 36px 44px !important;
          transform: none !important;
        }

        .invoice-pdf-compact img[alt="Logo"] {
          max-height: 54px !important;
        }
        
        .invoice-pdf-compact .mb-12 {
          margin-bottom: 32px !important;
        }
        
        .invoice-pdf-compact .py-10 {
          padding-top: 24px !important;
          padding-bottom: 24px !important;
        }

        .invoice-pdf-compact .py-8 {
          padding-top: 12px !important;
          padding-bottom: 12px !important;
        }
        
        .invoice-pdf-compact img[alt="UPI QR Code"] {
          width: 90px !important;
          height: 90px !important;
        }

        .invoice-pdf-compact .mt-auto {
          gap: 20px !important;
          margin-top: 28px !important;
        }
        .pdf-section {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        .bottom-summary-section {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 32px;
          align-items: start;
          break-inside: avoid;
          page-break-inside: avoid;
        }
        
        /* Remove number input spinners */
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  )
}
