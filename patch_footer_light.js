const fs = require('fs');
const path = require('path');

const footerFile = path.join(process.cwd(), 'src/components/Footer.tsx');
let content = fs.readFileSync(footerFile, 'utf8');

// Change outer background
content = content.replace(/bg-charcoal-900 text-sand-50 py-14 border-t border-olive-800/g, "bg-white text-charcoal-900 py-14 border-t border-sand-300");

// Change logo color from white to charcoal-900
content = content.replace(/text-white flex items-baseline/g, "text-charcoal-900 flex items-baseline");

// Change border colors
content = content.replace(/border-white\/10/g, "border-sand-300");

// Change navigation link colors
content = content.replace(/text-sand-300/g, "text-sand-600");
content = content.replace(/hover:text-white/g, "hover:text-terracotta-600");

// Fix Newsletter Form colors
content = content.replace(/bg-white\/10 border border-white\/15 text-xs text-white placeholder-white\/40/g, "bg-sand-100 border border-sand-300 text-xs text-charcoal-900 placeholder-sand-400");

fs.writeFileSync(footerFile, content, 'utf8');
console.log('Footer patched to light mode!');
