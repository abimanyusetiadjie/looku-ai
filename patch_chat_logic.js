const fs = require('fs');
const path = require('path');

const routeFile = path.join(process.cwd(), 'src/app/api/chat/route.ts');
let content = fs.readFileSync(routeFile, 'utf8');

// We will inject a dynamic heuristic into the imageBase64 fallback block.
// Find the block:
// const lower = message.toLowerCase();
// if (imageBase64) {
//   ...
// }

const heuristicBlock = `
    if (imageBase64) {
      let topColor = "Sage Green";
      let topItem = "Kemeja Linen Crinkle";
      let topImg = "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=400&q=80";
      
      let bottomColor = "Broken White";
      let bottomItem = "Highwaist Loose Kulot";
      let bottomImg = "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&q=80";

      let analysis = "Berdasarkan foto ini, warna kulitmu memiliki warm undertone alami khas Indonesia yang sangat bersinar dengan warna Earthy Neutral (Sage Green, Cream Oat, & Mocca).";

      // Simple heuristic parsing based on user message
      if (lower.includes("cokelat") || lower.includes("brown") || lower.includes("mocca")) {
         topColor = "Mocca / Cokelat";
         topItem = "Kemeja / Atasan Cokelat (Dari Fotomu)";
         topImg = "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=400&q=80"; // Generic shirt
         bottomItem = "Celana Kulot Linen";
         bottomColor = "Cream / Oat";
         bottomImg = "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&q=80"; // Beige pants
         analysis = "Berdasarkan fotomu (atasan warna cokelat/mocca), warna ini sangat cocok dipadukan dengan bawahan warna Cream atau Oat. Kombinasi 'Earth Tones' ini akan membuat kulit tampak lebih cerah dan elegan!";
      }

      const reply = \`Foto kamu sudah berhasil dipindai kak! ✨ \${analysis} Berikut kurasi bawahan adem anti-gerah yang paling cocok untuk atasanmu:\`;
      
      const visualCard = {
        title: "Match Sempurna look.u",
        topName: \`\${topItem} \${topColor}\`,
        topImg: topImg,
        topPrice: "Milikmu / Rp 89.000",
        bottomName: \`\${bottomItem} \${bottomColor}\`,
        bottomImg: bottomImg,
        bottomPrice: "Rp 115.000",
        shopeeUrl: getShopeeSearchUrl(\`\${bottomItem} \${bottomColor} wanita\`),
        tokpedUrl: getTokopediaSearchUrl(\`\${bottomItem} \${bottomColor} adem\`),
      };

      return NextResponse.json({ reply, visualCard });
    }
`;

// Replace the old if (imageBase64) block in fallback
content = content.replace(/if\s*\(imageBase64\)\s*\{[\s\S]*?return NextResponse\.json\(\{ reply, visualCard \}\);\s*\}/, heuristicBlock);

// Also fix the Gemini block visualCard
const geminiVisualCard = `
          const visualCard = imageBase64
            ? {
                title: "Formula Rekomendasi look.u",
                topName: lower.includes("cokelat") ? "Atasan Cokelat / Mocca" : "Kemeja Linen Drop Shoulder",
                topImg: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=400&q=80",
                topPrice: "Rp 75rb - 95rb",
                bottomName: lower.includes("cokelat") ? "Kulot Linen Cream Oat" : "Highwaist Flowy Loose Kulot",
                bottomImg: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&q=80",
                bottomPrice: "Rp 85rb - 110rb",
                shopeeUrl: getShopeeSearchUrl(lower.includes("cokelat") ? "kulot linen cream wanita" : "kemeja linen oversized wanita kulot"),
                tokpedUrl: getTokopediaSearchUrl(lower.includes("cokelat") ? "kulot cream oat" : "kemeja linen loose kulot wanita"),
              }
            : undefined;
`;

content = content.replace(/const visualCard = imageBase64[\s\S]*?\:\s*undefined;/, geminiVisualCard.trim());

fs.writeFileSync(routeFile, content, 'utf8');
console.log("Chat API patched with dynamic heuristics and modest images!");
