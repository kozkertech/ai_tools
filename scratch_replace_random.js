const fs = require('fs');
let content = fs.readFileSync('e:/Kozker_tools/kozker_tools_new/app/tools/invoice-template-builder/page.tsx', 'utf8');

content = content.replace(/const generateDefaultInvoiceNumber = \(\) => \{\s*const year = new Date\(\)\.getFullYear\(\);\s*return `INV-\$\{year\}-0001`;\s*\}/m, 
`const generateDefaultInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return \`INV-\${year}-\${random}\`;
  }`);

content = content.replace(/const finalInvNumber = invoiceData\.invoiceNumber \|\| `INV-\$\{today\.getFullYear\(\)\}-0001`;/, 
`const finalInvNumber = invoiceData.invoiceNumber || generateDefaultInvoiceNumber();`);

content = content.replace(/invoiceNumber: "INV-" \+ new Date\(\)\.getFullYear\(\) \+ "-0001",/m, `invoiceNumber: "", // Default to empty string for initial state, will be auto-generated on render if empty or on submit`);

fs.writeFileSync('e:/Kozker_tools/kozker_tools_new/app/tools/invoice-template-builder/page.tsx', content);
console.log('Update successful');
