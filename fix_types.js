const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/components/GeneratorForm.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/budget: "menengah",\n      vibe: "earthy_minimalist"/g, `budget: "menengah",\n      vibe: "earthy_minimalist",\n      skinTone: "medium",\n      ageRange: "18-24"`);

fs.writeFileSync(file, content, 'utf8');
console.log("Fixed GeneratorForm typings!");
