const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/components/OutfitCard.tsx');
let content = fs.readFileSync(file, 'utf8');

const regex = /<p className="font-serif italic text-sm sm:text-lg text-\[#181A18\]\/70 pt-0\.5 leading-snug">\s*&ldquo;\{outfit\.tagline\}&rdquo;\s*<\/p>/;

const collageHTML = `<p className="font-serif italic text-sm sm:text-lg text-[#181A18]/70 pt-0.5 leading-snug">
              &ldquo;{outfit.tagline}&rdquo;
            </p>

            {/* FULL LOOK PREVIEW (Hero Image Collage) */}
            <div className="w-full aspect-[4/5] sm:aspect-[16/9] mt-6 flex gap-1 overflow-hidden rounded-sm bg-sand-100 border border-sand-200">
              {items.slice(0, 2).map((item, idx) => {
                const fallbackImages = [
                  "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=800&q=80",
                  "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80"
                ];
                const itemImage = item.imageUrl || outfit.flatlayImages?.[idx] || fallbackImages[idx % fallbackImages.length];
                
                return (
                  <div key={idx} className="flex-1 relative group cursor-pointer overflow-hidden">
                    <img
                      src={itemImage}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/5" />
                  </div>
                );
              })}
            </div>`;

if (content.match(regex)) {
  content = content.replace(regex, collageHTML);
  console.log("Collage Injected!");
} else {
  console.log("Could not find tagline p tag.");
}

fs.writeFileSync(file, content, 'utf8');
