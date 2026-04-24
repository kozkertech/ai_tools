const fs = require('fs');
const content = fs.readFileSync('e:/Kozker_tools/kozker_tools_new/app/tools/invoice-template-builder/page.tsx', 'utf8');
const lines = content.split('\n');
for (let i = 202; i < 225; i++) {
    console.log(`${i+1}: ${JSON.stringify(lines[i])}`);
}
