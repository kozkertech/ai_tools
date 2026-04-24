const fs = require('fs');
let content = fs.readFileSync('e:/Kozker_tools/kozker_tools_new/app/tools/invoice-template-builder/page.tsx', 'utf8');

// 1. Update formatCurrency
content = content.replace(/const formatCurrency = \(amount: number\) => \{\s*const curr = getCurrentCurrency\(\)\s*return `\$\{curr\.symbol\}\$\{amount\.toLocaleString\('en-IN', \{ minimumFractionDigits: 2, maximumFractionDigits: 2 \}\)\}`\s*\}/m, 
`const formatCurrency = (amount: number, currency = invoiceData.currency) => {
    const num = Number(amount || 0)

    if (currency === "INR") {
      return \`₹\${num.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}\`
    }

    return num.toLocaleString("en-US", {
      style: "currency",
      currency
    })
  }`);

// 2. Remove any remaining random $ in the file, specifically in preview area
// Line 975: <span className="font-black text-lg text-orange-600 tracking-wider">#{invoiceData.invoiceNumber}</span>
content = content.replace(/<span className="font-black text-lg text-orange-600 tracking-wider">#\{invoiceData\.invoiceNumber\}<\/span>/, 
`<span className="font-black text-lg text-orange-600 tracking-wider">{invoiceData.invoiceNumber}</span>`);

// Amount in words: Line 1074: <p className="text-lg font-black italic text-gray-900 leading-tight border-b-2 border-orange-100 pb-2">{invoiceData.currency} {invoiceData.totalAmountInWords}</p>
// It needs to be: INR Thirty-Five Thousand... Rupees Only
// In handleSubmit, I set totalAmountInWords: words (where words is just the number to words plus " Rupees Only"). 
// Wait, the user said: "number-to-words function must return ONLY words ... Add 'Only' only once during display."
// Let's fix handleSubmit:
content = content.replace(/const words = numberToWords\(totalAmount\) \+ " Rupees Only";/, `const words = numberToWords(totalAmount);`);

content = content.replace(/<p className="text-lg font-black italic text-gray-900 leading-tight border-b-2 border-orange-100 pb-2">\{invoiceData\.currency\} \{invoiceData\.totalAmountInWords\}<\/p>/, 
`<p className="text-lg font-black italic text-gray-900 leading-tight border-b-2 border-orange-100 pb-2">{invoiceData.currency === 'INR' ? 'INR ' : ''}{invoiceData.totalAmountInWords} {invoiceData.currency === 'INR' ? 'Rupees Only' : 'Only'}</p>`);

// Fix PDF Generation
content = content.replace(/while \(heightLeft >= 0\) \{/, `while (heightLeft > 0) {`);
// Update PDF Generation to match user's multi-page exactly
content = content.replace(/const pdf = new jsPDF\("p", "mm", "a4"\)\s*const pdfWidth = pdf\.internal\.pageSize\.getWidth\(\)\s*const pdfHeight = pdf\.internal\.pageSize\.getHeight\(\)\s*const imgWidth = pdfWidth\s*const imgHeight = \(canvas\.height \* imgWidth\) \/ canvas\.width/, 
`const pdf = new jsPDF("p", "mm", "a4")

      const pageWidth = 210
      const pageHeight = 297

      const imgWidth = pageWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width`);

content = content.replace(/heightLeft -= pdfHeight/g, `heightLeft -= pageHeight`);


fs.writeFileSync('e:/Kozker_tools/kozker_tools_new/app/tools/invoice-template-builder/page.tsx', content);
console.log('Update successful');
