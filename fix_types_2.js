const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/components/GeneratorForm.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/ageRange: "18-24"/g, `ageRange: "20s"`);

fs.writeFileSync(file, content, 'utf8');
console.log("Fixed GeneratorForm typings (20s)!");
