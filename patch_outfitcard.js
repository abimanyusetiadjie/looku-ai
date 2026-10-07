const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/components/OutfitCard.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\{isSaved \? "Tersimpan" : "Simpan"\}/g, '{isSaved ? "SAVED" : "SAVE TO WARDROBE"}');
content = content.replace(/Export Story/g, "EXPORT EDITORIAL");
content = content.replace(/WhatsApp/g, "SHARE");
content = content.replace(/Harmoni Hijab & Aksesoris/g, "Modest Architecture Note");
content = content.replace(/PILIHAN GAYA/g, "DIRECTIONAL CUES");

fs.writeFileSync(file, content, 'utf8');
console.log("OutfitCard text details refined!");
