const fs = require('fs');

async function applyFixes() {
  let content = fs.readFileSync('e:/Kozker_tools/kozker_tools_new/app/tools/invoice-template-builder/page.tsx', 'utf8');

  // Fix 1: Bank Details in Step 1
  const step1EndString = `                  <div className="space-y-2">
                    <Label htmlFor="companyWebsite">Website (Optional)</Label>
                    <Input
                      id="companyWebsite"
                      placeholder="www.business.com"
                      value={invoiceData.companyWebsite}
                      onChange={(e) => updateInvoiceData("companyWebsite", e.target.value)}
                      className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
                    />
                  </div>`;
  
  const bankDetailsUI = `                  <div className="space-y-2">
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
                  </div>`;
  content = content.replace(step1EndString, bankDetailsUI);

  // Fix 3 & 4: PDF formatting and sections in preview
  // Replace the inner layout grid with the new bottom-summary-section classes
  const oldFooterString = `<div className="mt-auto border-t-4 border-gray-900 pt-10">
                    <div className="grid grid-cols-12 gap-12">
                      <div className="col-span-7 space-y-10">`;
  const newFooterString = `<div className="mt-auto border-t-4 border-gray-900 pt-10 pdf-section bottom-summary-section">
                      <div className="space-y-10 bank-details-section">`;
  content = content.replace(oldFooterString, newFooterString);

  content = content.replace(/<div className="col-span-5 flex flex-col justify-start">/, `<div className="flex flex-col justify-start totals-card">`);

  // Remove the extraneous `</div>` that was closing `grid grid-cols-12` since we replaced it 
  const innerFooterRegex = /<div className="mt-20 flex justify-between items-end">/;
  // Actually, wait, replacing grid-cols-12 with nothing means there's an extra div. 
  content = content.replace(/<\/div>\s*<div className="mt-20 flex justify-between items-end">/, `<div className="mt-20 flex justify-between items-end">`);
  
  // Add styling to #invoice-preview
  content = content.replace(/id="invoice-preview"\s*className="bg-white text-gray-900 p-12 rounded-lg shadow-2xl border border-gray-200 overflow-hidden min-h-\[1100px\] flex flex-col"/s, 
  `id="invoice-preview"
                  className="bg-white text-gray-900 p-12 rounded-lg shadow-2xl border border-gray-200 min-h-[1100px] flex flex-col invoice-pdf-page"`);

  // Add global CSS
  const oldCss = `/* Remove number input spinners */`;
  const newCss = `.invoice-pdf-page {
          width: 794px;
          min-height: 1123px;
          background: #ffffff;
          padding: 48px;
          box-sizing: border-box;
          page-break-inside: avoid;
          break-inside: avoid;
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
        #invoice-preview {
          background: #ffffff;
          color: #111827;
          overflow: visible;
        }
        /* Remove number input spinners */`;
  content = content.replace(oldCss, newCss);

  // Fix 5: Replace PDF logic with html2pdf
const oldPdfRender = `const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      
      const pageWidth = 210
      const pageHeight = 297

      const imgWidth = pageWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(\`Invoice-\${invoiceData.invoiceNumber}.pdf\`)`;

  const newPdfRender = `const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: 0,
        filename: \`Invoice-\${invoiceData.invoiceNumber}.pdf\`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff"
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait"
        },
        pagebreak: {
          mode: ["avoid-all", "css", "legacy"],
          avoid: [".pdf-section", ".bottom-summary-section", ".totals-card", ".bank-details-section"]
        }
      };

      await html2pdf().set(opt).from(element).save();`;

  content = content.replace(oldPdfRender, newPdfRender);

  fs.writeFileSync('e:/Kozker_tools/kozker_tools_new/app/tools/invoice-template-builder/page.tsx', content);
  console.log('Update Complete!');
}
applyFixes();
