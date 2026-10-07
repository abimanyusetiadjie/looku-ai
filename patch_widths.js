const fs = require('fs');
const path = require('path');

const pageFile = path.join(process.cwd(), 'src/app/studio/page.tsx');
let content = fs.readFileSync(pageFile, 'utf8');

// Adjust Visual Hierarchy Widths
// Currently: lg:col-span-5 for left, lg:col-span-7 for right
content = content.replace(/lg:col-span-5/g, 'lg:col-span-4');
content = content.replace(/lg:col-span-7/g, 'lg:col-span-8');

fs.writeFileSync(pageFile, content, 'utf8');
console.log("Width hierarchy updated: 4/8 instead of 5/7");
