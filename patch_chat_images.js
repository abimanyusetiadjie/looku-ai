const fs = require('fs');
const path = require('path');

const routeFile = path.join(process.cwd(), 'src/app/api/chat/route.ts');
let content = fs.readFileSync(routeFile, 'utf8');

// Replace the slip dress image in visualCard (both in Gemini success block and fallback block)
content = content.replace(/https:\/\/images\.unsplash\.com\/photo-1515886657613-9f3515b0c78f/g, "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c");

// Replace the old bottom image
content = content.replace(/https:\/\/images\.unsplash\.com\/photo-1509631179647-0177331693ae/g, "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1");

fs.writeFileSync(routeFile, content, 'utf8');
console.log("Chat API patched with modest visual card images!");
