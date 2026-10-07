const fs = require('fs');
const path = require('path');

function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove the bad import at the end of the file
  content = content.replace(/import Navbar from "@\/components\/Navbar";\n/g, '');
  
  // Put it safely at the top after "use client";
  content = content.replace(/"use client";\n/, '"use client";\nimport Navbar from "@/components/Navbar";\n');

  fs.writeFileSync(filePath, content, 'utf8');
}

fixImports(path.join(process.cwd(), 'src/app/lookbook/page.tsx'));
fixImports(path.join(process.cwd(), 'src/app/lemari/page.tsx'));
fixImports(path.join(process.cwd(), 'src/app/studio/page.tsx'));

console.log("Fixed import syntax errors.");
