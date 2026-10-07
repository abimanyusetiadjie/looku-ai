const fs = require('fs');
const path = require('path');

function injectNavbar(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('import Navbar')) {
    // Add import statement after the last import
    content = content.replace(/(import .*;\n)(?!import)/s, '$1import Navbar from "@/components/Navbar";\n');
  }

  // Find the return statement and inject <Navbar /> inside the main wrapper
  // For Lookbook:
  if (filePath.includes('lookbook')) {
    content = content.replace(/<div className="min-h-screen flex flex-col bg-\[#FAF8F5\] pb-20 md:pb-0">/, 
      '<div className="min-h-screen flex flex-col bg-[#FAF8F5] pb-20 md:pb-0">\n      <Navbar />');
  }
  
  // For Lemari:
  if (filePath.includes('lemari')) {
    content = content.replace(/<div className="min-h-screen flex flex-col bg-white text-black pb-20">/, 
      '<div className="min-h-screen flex flex-col bg-white text-black pb-20">\n      <Navbar />');
  }

  // For Studio:
  if (filePath.includes('studio')) {
    content = content.replace(/<div className="min-h-screen flex flex-col bg-\[#F4EFE6\] pb-32 lg:pb-0">/, 
      '<div className="min-h-screen flex flex-col bg-[#F4EFE6] pb-32 lg:pb-0">\n        <Navbar />');
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

injectNavbar(path.join(process.cwd(), 'src/app/lookbook/page.tsx'));
injectNavbar(path.join(process.cwd(), 'src/app/lemari/page.tsx'));
injectNavbar(path.join(process.cwd(), 'src/app/studio/page.tsx'));

console.log("Global Navbar injected into Lookbook, Lemari, and Studio.");
