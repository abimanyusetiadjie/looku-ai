const fs = require('fs');
const path = require('path');

const studioFile = path.join(process.cwd(), 'src/app/studio/page.tsx');
let content = fs.readFileSync(studioFile, 'utf8');

const regex = /\{\/\* Top Header Bar Minimalist Beige \*\/\}\s*<div className="w-full text-center pb-8 pt-4">.*?<\/div>\s*/s;

if (regex.test(content)) {
  content = content.replace(regex, '');
  fs.writeFileSync(studioFile, content, 'utf8');
  console.log("Successfully removed the redundant giant Look.u logo from the Studio content area.");
} else {
  console.log("Could not find the target block.");
}
