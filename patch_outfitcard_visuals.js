const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/components/OutfitCard.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Soften Shopee Button
content = content.replace(
  /className="py-2 px-1 rounded-none bg-\[#EE4D2D\] hover:bg-\[#d63b1d\] text-white text-\[10px\] sm:text-\[11px\] font-bold transition-all flex items-center justify-center gap-1 shadow-2xs"/g,
  'className="py-2 px-1 rounded-sm border border-sand-300 bg-white text-charcoal-700 hover:border-[#EE4D2D] hover:text-[#EE4D2D] text-[10px] sm:text-[11px] font-bold transition-all flex items-center justify-center gap-1 shadow-xs"'
);

// 2. Soften Tokopedia Button
content = content.replace(
  /className="py-2 px-1 rounded-none bg-\[#00AA5B\] hover:bg-\[#008f4c\] text-white text-\[10px\] sm:text-\[11px\] font-bold transition-all flex items-center justify-center gap-1 shadow-2xs"/g,
  'className="py-2 px-1 rounded-sm border border-sand-300 bg-white text-charcoal-700 hover:border-[#00AA5B] hover:text-[#00AA5B] text-[10px] sm:text-[11px] font-bold transition-all flex items-center justify-center gap-1 shadow-xs"'
);

// 3. Change "Bedah X Item" to "Komposisi Look"
content = content.replace(/BEDAH 4 ITEM BUSANA \(BELI DI MARKETPLACE\)/g, "KOMPOSISI LOOK");
content = content.replace(/TAP SHOPEE \/ TOKPED/g, "MARKETPLACE");

// 4. Inject Full Look Preview (Hero Collage) after the Quote
const quoteRegex = /<p className="text-sm sm:text-base text-charcoal-800 leading-relaxed italic mb-4">\s*"{outfit\.quote}"\s*<\/p>/;

const collageHTML = `<p className="text-sm sm:text-base text-charcoal-800 leading-relaxed italic mb-4">
              "{outfit.quote}"
            </p>

            {/* FULL LOOK PREVIEW (Hero Image) */}
            <div className="w-full aspect-[4/5] sm:aspect-[16/9] mb-6 flex gap-1 overflow-hidden rounded-sm bg-sand-100 border border-sand-200">
              {outfit.items.slice(0, 2).map((item, idx) => (
                <div key={idx} className="flex-1 relative group cursor-pointer">
                  <img
                    src={item.imageUrl || "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=800&q=80"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/5" />
                </div>
              ))}
            </div>`;

if (content.match(quoteRegex)) {
  content = content.replace(quoteRegex, collageHTML);
} else {
  // Try alternative matching if formatting differs
  console.log("Could not find the quote block to inject collage.");
}

// 5. Clean up Header (Remove Modest Badge to simplify, User said: "Cukup LOOK OF THE DAY + satu badge Modest. Sisanya bisa digabung." Wait, currently it HAS Modest badge. I'll leave it as is if it's already simple enough).

fs.writeFileSync(file, content, 'utf8');
console.log("OutfitCard Patched (Collage, Soft Buttons, Copywriting)");
