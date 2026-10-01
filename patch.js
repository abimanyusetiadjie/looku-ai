const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/components/LookUMobileView.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Replace the header (from `<header>` to `</header>`)
const headerRegex = /<header className="sticky top-0 z-30 w-full bg-\[#FAF8F5\]\/95[\s\S]*?<\/header>/;
const newHeader = `
        <header className="sticky top-0 z-30 w-full bg-white px-4 pt-[max(16px,env(safe-area-inset-top))] pb-4 transition-all flex items-center justify-between border-b border-[#F0EBE1]">
          <button className="p-2 -ml-2 text-charcoal-900" aria-label="Menu">
            <Menu className="w-5 h-5 stroke-[1.5]" />
          </button>
          
          <Link href="/" className="font-serif font-medium text-3xl tracking-[0.05em] text-[#181A18] flex items-baseline select-none">
            Look<span className="text-terracotta-500 font-bold">.</span>u
          </Link>
          
          <div className="flex items-center gap-4">
            <button className="text-charcoal-900" aria-label="Search">
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>
            <button onClick={onOpenSavedDrawer} className="text-charcoal-900" aria-label="Bag">
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        </header>
`;
content = content.replace(headerRegex, newHeader.trim());

// 2. Fix main tag padding to allow full bleed image
content = content.replace(/<main className="flex-1 w-full px-4 pt-4 space-y-6">/, '<main className="flex-1 w-full space-y-6">');

// 3. Replace the Hero Section card
// From `<section aria-label="Gaya Pilihan Hari Ini">` down to `</section>`
const heroSectionRegex = /<section aria-label="Gaya Pilihan Hari Ini">[\s\S]*?<\/section>/;

const newHeroSection = `
          <section aria-label="Gaya Pilihan Hari Ini" className="bg-white">
            <div
              onClick={() => handleOpenOutfitDetails(heroOutfit)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="w-full relative cursor-pointer active:scale-[0.99] transition-all"
            >
              <div className="w-full aspect-[4/5] relative bg-sand-100">
                <Image
                  src={heroOutfit.gambar}
                  alt={heroOutfit.judul}
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="100vw"
                />
                
                {/* Floating Save Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleSaveOutfit(heroOutfit);
                  }}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#181A18] shadow-sm"
                >
                  <Heart className={\`w-5 h-5 \${isSavedLocally ? "fill-terracotta-500 text-terracotta-500" : "text-stone-700"}\`} />
                </button>
              </div>

              <div className="w-full px-6 pt-10 pb-6 flex flex-col items-center text-center">
                <h1 className="font-serif font-medium text-3xl text-[#181A18] leading-tight mb-3">
                  {heroOutfit.judul}
                </h1>
                
                <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.2em] text-[#181A18]/70 mb-8">
                  {heroOutfit.subjudul} — {heroOutfit.tagline}
                </p>

                <div className="flex items-center gap-6 mb-8">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#181A18]">
                    Color
                  </span>
                  <div className="flex gap-4">
                    {heroOutfit.paletWarna.slice(0, 3).map((warna, idx) => (
                      <span
                        key={idx}
                        className={\`w-4 h-4 rounded-full border border-black/20 \${idx === 0 ? 'ring-1 ring-offset-2 ring-charcoal-900' : ''}\`}
                        style={{ backgroundColor: warna.hex }}
                      />
                    ))}
                  </div>
                </div>

                <p className="font-sans text-[9px] uppercase tracking-widest text-charcoal-900/60 font-semibold mb-6">
                  {heroOutfit.suhu}
                </p>

                <div className="font-sans text-sm font-bold text-[#181A18] mb-4 tracking-widest">
                  {heroOutfit.rentangHarga}
                </div>

                {/* Swipe Indicators */}
                <div className="flex items-center gap-1.5 mt-2">
                  {OUTFIT_HERO_LIST.map((_, idx) => (
                    <div
                      key={idx}
                      className={\`h-1 rounded-full transition-all \${
                        idx === currentHeroIndex ? "w-6 bg-[#181A18]" : "w-2 bg-sand-300"
                      }\`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
`;

content = content.replace(heroSectionRegex, newHeroSection.trim());

// 4. Update the trending feed container to have side padding again
content = content.replace(/<section aria-label="Tren & Gaya Terkurasi">/, '<section aria-label="Tren & Gaya Terkurasi" className="px-4">');
content = content.replace(/<section aria-label="Berdasarkan Warna Kulitmu">/, '<section aria-label="Berdasarkan Warna Kulitmu" className="px-4">');
content = content.replace(/<div className="pt-2 px-1 pb-4">/, '<div className="pt-2 pb-4">');

fs.writeFileSync(file, content, 'utf8');
console.log("LookUMobileView patched successfully.");
