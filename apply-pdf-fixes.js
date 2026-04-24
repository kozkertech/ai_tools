const fs = require('fs');

async function applyPdfFixes() {
  let content = fs.readFileSync('e:/Kozker_tools/kozker_tools_new/app/tools/invoice-template-builder/page.tsx', 'utf8');

  // Fix 1: Update generatePDF logic entirely
  const oldPdfRender = `    const generatePDF = async () => {
    const element = document.getElementById("invoice-preview")
    if (!element) return

    setIsGeneratingPDF(true)
    try {
      const canvas = await html2canvas(element, {
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

      pdf.save(\`Invoice-\${invoiceData.invoiceNumber}.pdf\`)
    } catch (error) {
      console.error("PDF generation failed:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }`;

  const newPdfRender = `    const generatePDF = async () => {
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
      pdf.save(\`Invoice-\${invoiceData.invoiceNumber}.pdf\`)
    } catch (error) {
      console.error("PDF generation failed:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }`;

  if(content.includes(oldPdfRender)){
      content = content.replace(oldPdfRender, newPdfRender);
  } else {
      console.error("Regex match for generatePDF failed!");
      return;
  }

  // Fix 2: Apply conditional class logic and clear up inline styles causing PDF clipping
  const oldPreviewContainerClass = `id="invoice-preview"
                  className="bg-white text-gray-900 p-12 rounded-lg shadow-2xl border border-gray-200 min-h-[1100px] flex flex-col invoice-pdf-page"`;

  const newPreviewContainerClass = `id="invoice-preview"
                  className={\`bg-white text-gray-900 p-12 rounded-lg shadow-2xl border border-gray-200 flex flex-col \${isGeneratingPDF ? 'invoice-pdf-compact' : ''}\`}`;
  
  content = content.replace(oldPreviewContainerClass, newPreviewContainerClass);


  // Fix 3: Global CSS update
  const oldGlobalCss = `.invoice-pdf-page {
          width: 794px;
          min-height: 1123px;
          background: #ffffff;
          padding: 48px;
          box-sizing: border-box;
          page-break-inside: avoid;
          break-inside: avoid;
        }`;

  const newGlobalCss = `#invoice-preview {
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
        }`;
  
  if(content.includes(oldGlobalCss)){
      content = content.replace(oldGlobalCss, newGlobalCss);
  } else {
     console.error("Regex match for Global CSS failed!");
     return;
  }

  // Final fix: The old CSS included #invoice-preview later in the file as a single rule:
  // #invoice-preview { background: #ffffff; color: #111827; overflow: visible; }
  // We should remove it so we don't have duplicates
  const fallbackCss = `#invoice-preview {
          background: #ffffff;
          color: #111827;
          overflow: visible;
        }`;
  
  if (content.includes(fallbackCss)) {
    content = content.replace(fallbackCss, "");
  }


  fs.writeFileSync('e:/Kozker_tools/kozker_tools_new/app/tools/invoice-template-builder/page.tsx', content);
  console.log('PDF scaling fixes applied!');
}
applyPdfFixes();
