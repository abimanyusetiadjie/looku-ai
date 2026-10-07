const fs = require('fs');
const path = require('path');

const navbarFile = path.join(process.cwd(), 'src/components/Navbar.tsx');
let content = fs.readFileSync(navbarFile, 'utf8');

// Increase font size from text-[11px] or text-xs and add hover underline
// First, find the nav links container
content = content.replace(/gap-8 text-\[11px\]/g, "gap-10 text-[13px]");
content = content.replace(/gap-8 text-xs/g, "gap-10 text-[13px]");

// Update the actual Link classes for desktop
const oldLinkClass = 'className="hover:text-terracotta-600 transition-colors py-2"';
const newLinkClass = 'className="relative py-2 hover:text-terracotta-600 transition-colors after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-terracotta-600 hover:after:w-full after:transition-all after:duration-300"';

content = content.replace(/className="hover:text-terracotta-600 transition-colors py-2"/g, newLinkClass);

fs.writeFileSync(navbarFile, content, 'utf8');
console.log("Navbar patched with larger fonts and underline active states!");
