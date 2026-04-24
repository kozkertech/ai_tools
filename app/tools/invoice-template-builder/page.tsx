"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Trash2, ArrowLeft, ArrowRight, Loader2, CheckCircle, XCircle, Edit, Receipt, Download, FileText, Landmark, Users, CreditCard, Sparkles, Building2, ShieldCheck, Zap, MousePointer2, Target, Activity } from "lucide-react"
import jsPDF from "jspdf"
import "jspdf-autotable"

interface LineItem {
  id: string
  item: string
  description: string
  quantity: number
  price: number
}

interface InvoiceData {
  companyName: string
  companyEmail: string
  companyAddress: string
  companyCity: string
  companyZip: string
  companyCountry: string
  companyState: string
  customerName: string
  customerEmail: string
  customerAddress: string
  customerCity: string
  customerZip: string
  customerCountry: string
  customerState: string
  invoiceNumber: string
  invoiceDate: string
  lineItems: LineItem[]
  notes: string
  taxRate: number
  currency: string
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

const countries = [
  "United States", "India", "Canada", "United Kingdom", "Australia", 
  "Germany", "France", "Japan", "China", "Brazil", 
  "Mexico", "Italy", "Spain", "Netherlands", "Sweden",
]

const usStates = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]

const indianStates = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"]

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
    companyAddress: "",
    companyCity: "",
    companyZip: "",
    companyCountry: "United States",
    companyState: "",
    customerName: "",
    customerEmail: "",
    customerAddress: "",
    customerCity: "",
    customerZip: "",
    customerCountry: "United States",
    customerState: "",
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    invoiceDate: new Date().toISOString().split("T")[0],
    lineItems: [{ id: "1", item: "", description: "", quantity: 1, price: 0 }],
    notes: "",
    taxRate: 10,
    currency: "USD",
  })

  const updateInvoiceData = (field: keyof InvoiceData, value: any) => {
    setInvoiceData((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === "companyCountry") updated.companyState = ""
      if (field === "customerCountry") updated.customerState = ""
      return updated
    })
  }

  const addLineItem = () => {
    setInvoiceData((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, { id: Date.now().toString(), item: "", description: "", quantity: 1, price: 0 }],
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

  const subtotal = invoiceData.lineItems.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const taxAmount = subtotal * (invoiceData.taxRate / 100)
  const total = subtotal + taxAmount

  const currentCurrency = currencies.find((c) => c.code === invoiceData.currency) || currencies[0]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currentCurrency.code,
    }).format(amount)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setSubmitStatus("idle")

    try {
      const payload = {
        ...invoiceData,
        subtotal,
        taxAmount,
        total,
        currencySymbol: currentCurrency.symbol,
      }

      const response = await fetch("https://n8n.srv832341.hstgr.cloud/webhook/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const responseData = await response.json()
      setWebhookResponse(responseData)

      if (response.ok) {
        setSubmitStatus("success")
        setShowInvoicePreview(true)
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Transmission error:", error)
      setSubmitStatus("error")
    } finally {
      setIsLoading(false)
    }
  }

  const generatePDF = () => {
    const doc = new jsPDF()
    
    doc.setFontSize(22)
    doc.setTextColor(33, 33, 33)
    doc.text("INVOICE", 105, 20, { align: "center" })

    doc.setFontSize(10)
    doc.text(`No: ${invoiceData.invoiceNumber}`, 190, 20, { align: "right" })
    doc.text(`Date: ${invoiceData.invoiceDate}`, 190, 26, { align: "right" })

    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("FROM", 20, 50)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.text(invoiceData.companyName || "N/A", 20, 56)
    doc.text(invoiceData.companyEmail || "N/A", 20, 61)
    doc.text(`${invoiceData.companyAddress || "N/A"}`, 20, 66)
    doc.text(`${invoiceData.companyCity}${invoiceData.companyState ? `, ${invoiceData.companyState}` : ""} ${invoiceData.companyZip}`, 20, 71)

    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("BILL TO", 120, 50)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.text(invoiceData.customerName || "N/A", 120, 56)
    doc.text(invoiceData.customerEmail || "N/A", 120, 61)
    doc.text(`${invoiceData.customerAddress || "N/A"}`, 120, 66)
    doc.text(`${invoiceData.customerCity}${invoiceData.customerState ? `, ${invoiceData.customerState}` : ""} ${invoiceData.customerZip}`, 120, 71)

    const tableData = invoiceData.lineItems.map((item) => [
      item.item,
      item.description,
      item.quantity.toString(),
      formatCurrency(item.price),
      formatCurrency(item.quantity * item.price),
    ])

    doc.autoTable({
      startY: 90,
      head: [["Item", "Description", "Qty", "Price", "Total"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [255, 116, 53] },
    })

    const finalY = (doc as any).lastAutoTable.finalY + 10
    doc.text(`Subtotal: ${formatCurrency(subtotal)}`, 190, finalY, { align: "right" })
    doc.text(`Tax (${invoiceData.taxRate}%): ${formatCurrency(taxAmount)}`, 190, finalY + 6, { align: "right" })
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text(`Grand Total: ${formatCurrency(total)}`, 190, finalY + 15, { align: "right" })

    if (invoiceData.notes) {
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text("Notes:", 20, finalY + 30)
      doc.text(invoiceData.notes, 20, finalY + 35, { maxWidth: 170 })
    }

    doc.save(`Invoice-${invoiceData.invoiceNumber}.pdf`)
  }

  return (
    <div className="min-h-screen bg-[var(--mist)] text-[var(--night)] transition-colors duration-300 pb-32">
      {/* Premium Sticky Header with Stepper */}
      <div className="bg-[var(--cloud)]/60 backdrop-blur-2xl border-b border-[var(--iron)] pt-24 pb-8 fixed top-0 w-full z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#FF7435] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#FF7435]/30">
                <Receipt className="w-8 h-8 text-white" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-3xl font-black font-poppins text-[var(--night)] tracking-tighter uppercase leading-none mb-1">
                   Invoice <span className="text-[#FF7435]">Studio</span>
                </h1>
                <Badge className="bg-[var(--night)] text-white border-none font-black px-3 py-1 rounded-lg text-[9px] uppercase tracking-widest opacity-80">v6.1 Financial Suite</Badge>
              </div>
            </div>

            {/* Premium Multi-Stage Stepper */}
            <div className="flex items-center gap-4 bg-[var(--mist)]/50 p-2 rounded-full border-2 border-[var(--iron)]/40">
               {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                     <button 
                       onClick={() => step < currentStep && setCurrentStep(step)}
                       className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-black transition-all border-4 ${
                       step === currentStep 
                         ? "bg-[#FF7435] text-white border-orange-200 shadow-xl shadow-[#FF7435]/30 scale-110" 
                         : step < currentStep 
                           ? "bg-emerald-500 text-white border-emerald-200" 
                           : "bg-white text-[var(--steel)] border-[var(--iron)]/40 hover:border-[#FF7435]/20"
                     }`}>
                       {step < currentStep ? <CheckCircle className="w-6 h-6" /> : step}
                     </button>
                     {step < 3 && <div className={`w-12 h-1.5 mx-1 rounded-full ${step < currentStep ? 'bg-emerald-500' : 'bg-[var(--iron)]/40 opacity-30'}`} />}
                  </div>
               ))}
            </div>

            <div className="hidden xl:flex items-center gap-4">
               <div className="text-right">
                  <div className="text-[9px] font-black uppercase tracking-widest text-[var(--steel)]">Engine Mode</div>
                  <div className="text-xs font-black text-[var(--night)] uppercase flex items-center justify-end gap-2 text-emerald-500">
                     <Activity className="w-3.5 h-3.5 animate-pulse" />
                     Live
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-[180px] max-w-7xl mx-auto px-6 lg:px-10 mt-16 lg:mt-24">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
           
           {/* Primary Configuration Workspace */}
           <div className="xl:col-span-8 space-y-10">
              <Card className="card p-12 shadow-2xl shadow-black/5 border-2 border-[var(--iron)]/50 relative overflow-hidden transition-all duration-700">
                 {/* Workspace Background Decor */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF7435]/5 rounded-bl-[12rem] pointer-events-none -z-10 animate-in fade-in duration-1000"></div>

                 <CardHeader className="px-0 pt-0 pb-12 border-b-2 border-[var(--iron)]/40 mb-12">
                    <div className="flex items-center gap-4">
                       {currentStep === 1 && <div className="w-10 h-10 bg-[#FF7435]/10 rounded-xl flex items-center justify-center border-2 border-[#FF7435]/20"><Landmark className="w-5 h-5 text-[#FF7435]" /></div>}
                       {currentStep === 2 && <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border-2 border-blue-500/20"><Users className="w-5 h-5 text-blue-500" /></div>}
                       {currentStep === 3 && <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center border-2 border-purple-500/20"><CreditCard className="w-5 h-5 text-purple-500" /></div>}
                       <div>
                          <CardTitle className="text-2xl font-black font-poppins uppercase tracking-tighter">
                             {currentStep === 1 ? "Organization Registry" : currentStep === 2 ? "Recipient Network" : "Linguistic Ledger"}
                          </CardTitle>
                          <CardDescription className="font-bold text-[var(--steel)] italic uppercase tracking-[0.2em] text-[10px] mt-1">
                             {currentStep === 1 ? "Initialize corporate identity protocols." : currentStep === 2 ? "Define the counterparty parameters." : "Categorize trade units and value vectors."}
                          </CardDescription>
                       </div>
                    </div>
                 </CardHeader>
                 
                 <CardContent className="px-0 pb-0">
                    <AnimatePresence mode="wait">
                       {currentStep === 1 && (
                          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                   <Label className="field-label font-black text-xs uppercase tracking-widest">Corporate Entity Name</Label>
                                   <Input 
                                     placeholder="e.g. Acme Synetics" 
                                     className="input h-14" 
                                     value={invoiceData.companyName}
                                     onChange={e => updateInvoiceData("companyName", e.target.value)}
                                   />
                                </div>
                                <div className="space-y-3">
                                   <Label className="field-label font-black text-xs uppercase tracking-widest">Contact Terminal (Email)</Label>
                                   <Input 
                                     type="email" 
                                     placeholder="ops@acme.io" 
                                     className="input h-14" 
                                     value={invoiceData.companyEmail}
                                     onChange={e => updateInvoiceData("companyEmail", e.target.value)}
                                   />
                                </div>
                             </div>
                             
                             <div className="space-y-3">
                                <Label className="field-label font-black text-xs uppercase tracking-widest">Registered HQ Address</Label>
                                <Input 
                                  placeholder="Primary base of operations..." 
                                  className="input h-14" 
                                  value={invoiceData.companyAddress}
                                  onChange={e => updateInvoiceData("companyAddress", e.target.value)}
                                />
                             </div>
                             
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                                <div className="space-y-3">
                                   <Label className="field-label font-black text-xs">City Cluster</Label>
                                   <Input className="input h-14" value={invoiceData.companyCity} onChange={e => updateInvoiceData("companyCity", e.target.value)} />
                                </div>
                                <div className="space-y-3">
                                   <Label className="field-label font-black text-xs">Sector Zip</Label>
                                   <Input className="input h-14" value={invoiceData.companyZip} onChange={e => updateInvoiceData("companyZip", e.target.value)} />
                                </div>
                                <div className="space-y-3 col-span-2">
                                   <Label className="field-label font-black text-xs">Territory Cluster</Label>
                                   <Select value={invoiceData.companyCountry} onValueChange={v => updateInvoiceData("companyCountry", v)}>
                                      <SelectTrigger className="input h-14 rounded-2xl">
                                         <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                         {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                      </SelectContent>
                                   </Select>
                                </div>
                             </div>
                          </motion.div>
                       )}

                       {currentStep === 2 && (
                          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                   <Label className="field-label font-black text-xs uppercase tracking-widest">Counterparty Name</Label>
                                   <Input 
                                     className="input h-14" 
                                     placeholder="Target Organization or Lead"
                                     value={invoiceData.customerName}
                                     onChange={e => updateInvoiceData("customerName", e.target.value)}
                                   />
                                </div>
                                <div className="space-y-3">
                                   <Label className="field-label font-black text-xs uppercase tracking-widest">Spectral ID (Inv #)</Label>
                                   <Input 
                                     className="input h-14 font-mono font-black" 
                                     value={invoiceData.invoiceNumber}
                                     onChange={e => updateInvoiceData("invoiceNumber", e.target.value)}
                                   />
                                </div>
                             </div>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                   <Label className="field-label font-black text-xs uppercase tracking-widest">Recipient Terminal</Label>
                                   <Input 
                                     type="email" 
                                     className="input h-14" 
                                     placeholder="lead@target.com"
                                     value={invoiceData.customerEmail}
                                     onChange={e => updateInvoiceData("customerEmail", e.target.value)}
                                   />
                                </div>
                                <div className="space-y-3">
                                   <Label className="field-label font-black text-xs uppercase tracking-widest">Deployment Date</Label>
                                   <Input 
                                     type="date" 
                                     className="input h-14" 
                                     value={invoiceData.invoiceDate}
                                     onChange={e => updateInvoiceData("invoiceDate", e.target.value)}
                                   />
                                </div>
                             </div>

                             <div className="space-y-3">
                                <Label className="field-label font-black text-xs uppercase tracking-widest">Dissemination Address</Label>
                                <Input 
                                  className="input h-14" 
                                  placeholder="Recipient base for physical artifacts..."
                                  value={invoiceData.customerAddress}
                                  onChange={e => updateInvoiceData("customerAddress", e.target.value)}
                                />
                             </div>
                          </motion.div>
                       )}

                       {currentStep === 3 && (
                          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                             <div className="flex items-center justify-between gap-6 p-8 bg-[var(--mist)] rounded-[2.5rem] border-2 border-[#FF7435]/20">
                                <div className="flex items-center gap-4">
                                   <Zap className="w-8 h-8 text-[#FF7435]" />
                                   <div>
                                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--steel)]">Financial Protocol</span>
                                      <h3 className="text-xl font-black font-poppins uppercase">Monetary Cluster</h3>
                                   </div>
                                </div>
                                <Select value={invoiceData.currency} onValueChange={v => updateInvoiceData("currency", v)}>
                                   <SelectTrigger className="w-56 h-14 bg-white border-2 border-[var(--iron)] rounded-2xl font-black">
                                      <SelectValue />
                                   </SelectTrigger>
                                   <SelectContent>
                                      {currencies.map(curr => (
                                         <SelectItem key={curr.code} value={curr.code}>
                                            {curr.code} ({curr.symbol})
                                         </SelectItem>
                                      ))}
                                   </SelectContent>
                                </Select>
                             </div>

                             <div className="space-y-8">
                                <div className="flex items-center gap-3 text-[10px] font-black text-[#FF7435] uppercase tracking-[0.4em]">
                                   <Activity className="w-4 h-4" /> Units of Exchange
                                </div>
                                <div className="space-y-6">
                                   {invoiceData.lineItems.map((item, idx) => (
                                      <div key={item.id} className="p-10 bg-white border-2 border-[var(--iron)]/60 rounded-[3rem] relative group transition-all duration-500 hover:border-[#FF7435]/40 hover:shadow-2xl hover:shadow-black/5">
                                         {invoiceData.lineItems.length > 1 && (
                                            <button 
                                              onClick={() => removeLineItem(item.id)}
                                              className="absolute top-8 right-8 text-[var(--steel)] hover:text-red-500 transition-all hover:rotate-90"
                                            >
                                               <Trash2 className="w-6 h-6" />
                                            </button>
                                         )}
                                         <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                                            <div className="md:col-span-12 lg:col-span-6 space-y-3">
                                               <Label className="text-[9px] uppercase font-black tracking-[0.3em] text-[var(--steel)]">Trade Unit / Mission Identifier</Label>
                                               <Input 
                                                 className="input h-14 text-sm font-black" 
                                                 placeholder="e.g. Linguistic Nexus Optimization"
                                                 value={item.item}
                                                 onChange={e => updateLineItem(item.id, "item", e.target.value)}
                                               />
                                            </div>
                                            <div className="md:col-span-6 lg:col-span-3 space-y-3">
                                               <Label className="text-[9px] uppercase font-black tracking-[0.3em] text-[var(--steel)]">Vector Qty</Label>
                                               <Input 
                                                 type="number"
                                                 className="input h-14 text-sm font-black" 
                                                 value={item.quantity}
                                                 onChange={e => updateLineItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                                               />
                                            </div>
                                            <div className="md:col-span-6 lg:col-span-3 space-y-3">
                                               <Label className="text-[9px] uppercase font-black tracking-[0.3em] text-[var(--steel)]">Unit Value ({currentCurrency.symbol})</Label>
                                               <Input 
                                                 type="number"
                                                 className="input h-14 text-sm font-mono font-black border-[#FF7435]/10" 
                                                 value={item.price}
                                                 onChange={e => updateLineItem(item.id, "price", parseFloat(e.target.value) || 0)}
                                               />
                                            </div>
                                            <div className="md:col-span-12 space-y-3 pt-4">
                                               <Label className="text-[9px] uppercase font-black tracking-[0.3em] text-[var(--steel)]">Structural Context (Optional)</Label>
                                               <Input 
                                                 className="input h-12 text-[10px] rounded-full italic opacity-60" 
                                                 placeholder="Elaborate on the exchange parameters..."
                                                 value={item.description}
                                                 onChange={e => updateLineItem(item.id, "description", e.target.value)}
                                               />
                                            </div>
                                         </div>
                                      </div>
                                   ))}
                                </div>
                             </div>

                             <Button onClick={addLineItem} variant="outline" className="w-full border-dashed border-2 py-10 rounded-[2.5rem] bg-[var(--mist)]/20 hover:bg-white hover:border-[#FF7435] transition-all group border-[var(--iron)]">
                                <Plus className="w-8 h-8 mr-4 text-[#FF7435] group-hover:rotate-90 transition-transform" />
                                <span className="font-black uppercase tracking-[0.3em] text-xs">Initialize Additional Unit</span>
                             </Button>

                             <div className="space-y-3">
                                <Label className="field-label font-black text-xs uppercase tracking-widest">Trade Notes / Settlement Terms</Label>
                                <Textarea 
                                  className="input min-h-[160px] rounded-[3rem] pt-10 px-10" 
                                  placeholder="Indicate settlement deadlines and preferred terminal protocols..."
                                  value={invoiceData.notes}
                                  onChange={e => updateInvoiceData("notes", e.target.value)}
                                />
                             </div>
                          </motion.div>
                       )}
                    </AnimatePresence>

                    {/* Navigation Cluster */}
                    <div className="mt-16 flex items-center justify-between gap-6 pt-12 border-t-2 border-[var(--iron)]/40">
                       <Button 
                         variant="ghost" 
                         className="px-10 h-14 font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl"
                         onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                         disabled={currentStep === 1}
                       >
                          <ArrowLeft className="w-5 h-5 mr-3" /> Retreat
                       </Button>

                       {currentStep < 3 ? (
                          <Button 
                            className="btn-primary px-14 h-16 rounded-full font-black uppercase text-[10px] tracking-[0.4em] shadow-2xl shadow-[#FF7435]/30 group"
                            onClick={() => setCurrentStep(currentStep + 1)}
                          >
                             Advance Objective <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-1" />
                          </Button>
                       ) : (
                          <Button 
                            className="btn-primary px-14 h-16 rounded-full font-black uppercase text-[10px] tracking-[0.4em] shadow-2xl shadow-emerald-500/20 bg-emerald-500 hover:bg-emerald-600 border-none group"
                            onClick={handleSubmit}
                            disabled={isLoading}
                          >
                             {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Finalize Artifact <Sparkles className="w-5 h-5 ml-4 group-hover:scale-125 transition-transform" /></>}
                          </Button>
                       )}
                    </div>
                 </CardContent>
              </Card>
           </div>

           {/* Live Ledger Summary Workspace */}
           <div className="xl:col-span-4">
              <div className="sticky top-[11rem] space-y-10 animate-in fade-in slide-in-from-right-12 duration-1000">
                 <Card className="card p-0 shadow-2xl shadow-black/5 rounded-[3rem] overflow-hidden border-2 border-[var(--iron)]">
                    <CardHeader className="bg-[var(--night)] text-white p-12 relative overflow-hidden">
                       {/* Background abstract shape */}
                       <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[4rem]"></div>
                       
                       <CardTitle className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-4">Total Liquidation</CardTitle>
                       <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-black font-poppins tracking-tighter">{formatCurrency(total)}</span>
                          <Badge className="bg-[#FF7435] text-white border-none font-black text-[9px] uppercase tracking-widest px-2 mb-2">Net</Badge>
                       </div>
                    </CardHeader>
                    
                    <CardContent className="p-12 space-y-8">
                        <div className="space-y-6">
                           <div className="flex justify-between items-center text-xs">
                              <span className="font-black uppercase tracking-widest text-[var(--steel)]">Base Subtotal</span>
                              <span className="font-mono font-black text-lg">{formatCurrency(subtotal)}</span>
                           </div>
                           <div className="flex justify-between items-center text-xs">
                              <div className="flex items-center gap-3">
                                 <span className="font-black uppercase tracking-widest text-[var(--steel)]">Surcharge %</span>
                                 <button onClick={() => setIsEditingTax(!isEditingTax)} className="text-[#FF7435] hover:scale-125 transition-all p-1.5 bg-orange-50 rounded-lg border border-orange-100">
                                    <Edit className="w-3.5 h-3.5" />
                                 </button>
                              </div>
                              <span className="font-mono font-black text-lg text-emerald-600">+{formatCurrency(taxAmount)}</span>
                           </div>
                           
                           <AnimatePresence>
                              {isEditingTax && (
                                 <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pt-2 overflow-hidden">
                                    <div className="relative">
                                       <Input 
                                         type="number" 
                                         className="input h-14 pr-12 text-sm font-black rounded-2xl bg-[var(--mist)] border-2 border-[#FF7435]/20" 
                                         value={invoiceData.taxRate}
                                         onChange={e => updateInvoiceData("taxRate", parseFloat(e.target.value) || 0)}
                                       />
                                       <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-black text-[#FF7435]">%</span>
                                    </div>
                                 </motion.div>
                              )}
                           </AnimatePresence>
                        </div>

                        <div className="h-0.5 bg-[var(--iron)]/40 w-full rounded-full" />

                        <div className="space-y-6">
                           <div className="flex items-center gap-4 group">
                              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${invoiceData.companyName ? 'bg-emerald-500 scale-110 shadow-lg shadow-emerald-500/20' : 'bg-[var(--iron)] opacity-30 shadow-inner'}`}>
                                 <ShieldCheck className={`w-6 h-6 text-white ${invoiceData.companyName ? 'animate-in zoom-in' : ''}`} />
                              </div>
                              <div className="flex flex-col">
                                 <span className={`text-[10px] font-black uppercase tracking-widest ${invoiceData.companyName ? 'text-[var(--night)]' : 'text-[var(--steel)]'}`}>Corporate Verified</span>
                                 {invoiceData.companyName && <span className="text-[9px] font-bold text-emerald-500">Identity Synchronized</span>}
                              </div>
                           </div>
                           <div className="flex items-center gap-4 group">
                              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${invoiceData.customerName ? 'bg-emerald-500 scale-110 shadow-lg shadow-emerald-500/20' : 'bg-[var(--iron)] opacity-30 shadow-inner'}`}>
                                 <ShieldCheck className={`w-6 h-6 text-white ${invoiceData.customerName ? 'animate-in zoom-in' : ''}`} />
                              </div>
                              <div className="flex flex-col">
                                 <span className={`text-[10px] font-black uppercase tracking-widest ${invoiceData.customerName ? 'text-[var(--night)]' : 'text-[var(--steel)]'}`}>Counterparty Lock</span>
                                 {invoiceData.customerName && <span className="text-[9px] font-bold text-emerald-500">Ready for Deployment</span>}
                              </div>
                           </div>
                        </div>

                        {submitStatus === "success" && (
                           <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="pt-10">
                              <Button onClick={generatePDF} className="w-full h-20 btn-primary rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] shadow-2xl shadow-[#FF7435]/30 group bg-[#FF7435] border-none hover:bg-[#FF7435] hover:opacity-90">
                                 <Download className="w-6 h-6 mr-4 group-hover:translate-y-1 transition-transform" /> 
                                 Export PDF Artifact
                              </Button>
                           </motion.div>
                        )}
                    </CardContent>
                 </Card>

                 {submitStatus === "error" && (
                    <Alert variant="destructive" className="rounded-3xl border-2 shadow-2xl shadow-red-500/10 animate-in shake-in">
                       <XCircle className="h-5 w-5" />
                       <AlertDescription className="font-black text-[10px] uppercase tracking-widest">
                          Transmission Protocol Failure. Re-sync terminal and retry.
                       </AlertDescription>
                    </Alert>
                 )}
                 
                 {/* Decorative System Status */}
                 <div className="px-10 py-6 bg-[var(--cloud)]/40 rounded-full border-2 border-[var(--iron)]/40 flex items-center justify-center gap-6 grayscale opacity-40">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                       <span className="text-[10px] font-black uppercase tracking-widest">System Ready</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-[var(--iron)]"></div>
                    <div className="flex items-center gap-2">
                       <Zap className="w-3 h-3" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Encrypted Artifact</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
