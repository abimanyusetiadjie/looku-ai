const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/app/lemari/page.tsx');
let content = fs.readFileSync(file, 'utf8');

const errorRegex = /\{filteredOutfits\.length === 0 \? \(\`n[\s\S]*?\) : \(/;

const newString = `{filteredOutfits.length === 0 ? (
          <div className="py-20 md:py-28 flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
            <div className="w-32 h-32 relative mb-4">
              <img src="https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&q=80" alt="Empty Wardrobe" className="w-full h-full object-cover rounded-full grayscale opacity-70 border-8 border-white shadow-xl" />
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-black/5">
                <Shirt className="w-5 h-5 text-[#181A18]" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="font-serif font-medium text-[28px] text-[#181A18] leading-tight">
                Lemari Kosong
              </h2>
              <p className="text-xs text-[#181A18]/60 leading-relaxed font-sans px-4">
                Setiap perjalanan gaya dimulai dengan mengetahui warna kulit aslimu. Isi lemarimu dengan pakaian yang membuatmu bersinar.
              </p>
            </div>
            <div className="pt-6 flex flex-col w-full px-6 gap-3">
              <Link
                href="/?quiz=true"
                className="w-full py-4 rounded-full border border-[#181A18] text-[#181A18] font-bold font-sans text-[10px] uppercase tracking-[0.15em] transition-colors hover:bg-[#181A18] hover:text-white"
              >
                Mulai Tes Warna & Tubuh
              </Link>
              <Link
                href="/lookbook"
                className="w-full py-4 text-[#181A18] font-semibold font-sans text-[10px] uppercase tracking-[0.15em] transition-colors hover:text-terracotta-500 underline underline-offset-4"
              >
                Jelajahi Koleksi Lookbook
              </Link>
            </div>
          </div>
        ) : (`;

content = content.replace(errorRegex, newString);

fs.writeFileSync(file, content, 'utf8');
console.log("lemari/page.tsx patched successfully.");
