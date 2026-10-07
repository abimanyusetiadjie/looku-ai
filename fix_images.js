const fs = require('fs');
const path = require('path');

const heroFile = path.join(process.cwd(), 'src/components/HeroSection.tsx');
let content = fs.readFileSync(heroFile, 'utf8');

// Fix Broken Image 1: Linen Camp Collar Shirt
content = content.replace(/1596755094514-f87e32f85e2c/g, "1552374196-1ab2a1c593e8");

// Fix Broken Image 2: Tunik Rayon Panjang
content = content.replace(/1509631179647-0c115738ee05/g, "1512436991641-6745cdb1723f");

fs.writeFileSync(heroFile, content, 'utf8');
console.log("Broken images fixed!");
