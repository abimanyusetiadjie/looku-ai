const fs = require('fs');
const path = require('path');

const fileMobile = path.join(process.cwd(), 'src/components/LookUMobileView.tsx');
let contentM = fs.readFileSync(fileMobile, 'utf8');

// Replace the hero section inside Mobile View to exactly match Image 1
const heroSectionRegex = /<section aria-label="Gaya Pilihan Hari Ini" className="bg-white">[\s\S]*?<\/section>/;

const newHeroSection = `
          <section aria-label="Gaya Pilihan Hari Ini" className="bg-white w-full flex flex-col items-center">
            <div
              onClick={() => handleOpenOutfitDetails(heroOutfit)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="w-full relative cursor-pointer active:scale-[0.99] transition-all flex flex-col items-center"
            >
              {/* Image Container - Constrained Height for Mobile Responsiveness */}
              <div className="w-full h-[55vh] min-h-[400px] max-h-[500px] relative bg-sand-50">
                <Image
                  src={heroOutfit.gambar}
                  alt={heroOutfit.judul}
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="100vw"
                />
                
                {/* Floating Save Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleSaveOutfit(heroOutfit);
                  }}
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#181A18] shadow-sm border border-black/5"
                >
                  <Heart className={\`w-4 h-4 \${isSavedLocally ? "fill-[#181A18] text-[#181A18]" : "text-stone-700"}\`} />
                </button>
              </div>

              {/* Minimal Text Content */}
              <div className="w-full max-w-sm px-6 pt-8 pb-4 flex flex-col items-center text-center">
                <h1 className="font-serif font-medium text-[28px] text-[#181A18] leading-tight mb-2">
                  {heroOutfit.judul}
                </h1>
                
                <p className="font-sans text-[8px] font-semibold uppercase tracking-[0.15em] text-[#181A18]/60 mb-6 leading-relaxed max-w-[280px]">
                  {heroOutfit.subjudul} — {heroOutfit.tagline}
                </p>

                <div className="flex items-center gap-4 mb-6">
                  <span className="font-sans text-[9px] font-bold uppercase tracking-widest text-[#181A18]">
                    COLOR
                  </span>
                  <div className="flex gap-2.5">
                    {heroOutfit.paletWarna.slice(0, 3).map((warna, idx) => (
                      <span
                        key={idx}
                        className={\`w-4 h-4 rounded-full border border-black/20 \${idx === 0 ? 'ring-1 ring-offset-[2px] ring-charcoal-900' : ''}\`}
                        style={{ backgroundColor: warna.hex }}
                      />
                    ))}
                  </div>
                </div>

                <p className="font-sans text-[8px] uppercase tracking-widest text-[#181A18]/50 font-semibold mb-3">
                  {heroOutfit.suhu}
                </p>

                <div className="font-sans text-sm font-bold text-[#181A18] mb-6 tracking-widest">
                  {heroOutfit.rentangHarga}
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); handleLaunchStudio(heroOutfit); }} 
                  className="w-full max-w-[240px] py-3.5 rounded-full border border-[#181A18] text-center font-sans text-[10px] font-bold uppercase tracking-widest text-[#181A18] hover:bg-[#181A18] hover:text-white transition-colors mb-2"
                >
                  Add to Wardrobe
                </button>

                {/* Swipe Indicators */}
                <div className="flex items-center justify-center gap-1.5 mt-2 h-4">
                  {OUTFIT_HERO_LIST.map((_, idx) => (
                    <div
                      key={idx}
                      className={\`h-[3px] rounded-full transition-all \${
                        idx === currentHeroIndex ? "w-5 bg-[#181A18]" : "w-1.5 bg-black/10"
                      }\`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
`;

contentM = contentM.replace(heroSectionRegex, newHeroSection.trim());
fs.writeFileSync(fileMobile, contentM, 'utf8');
console.log("LookUMobileView responsive fix applied.");


// PATCH HERO SECTION (DESKTOP) to match Image 2 Exactly
const fileHero = path.join(process.cwd(), 'src/components/HeroSection.tsx');
let contentH = fs.readFileSync(fileHero, 'utf8');

const heroDesktopRegex = /<section aria-label="Gaya Pilihan Hari Ini" className="bg-white">[\s\S]*?<\/section>/;

const newHeroDesktop = `
      <section aria-label="Gaya Pilihan Hari Ini" className="bg-white w-full border-b border-[#F0EBE1]">
        <div className="w-full flex min-h-[calc(100vh-80px)]">
          
          {/* Left: 50% Full Bleed Image */}
          <div className="w-1/2 relative bg-[#EBE9E4]">
            <Image
              src={selectedScenario.lookId === "kuliah_hijab_panas_hemat" ? "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop" : selectedScenario.image || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&auto=format&fit=crop&q=80"}
              alt={selectedScenario.pillLabel}
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Right: 50% Content / Details (Exactly like Mockup) */}
          <div className="w-1/2 flex items-center justify-center bg-white relative">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-[480px] w-full px-8 py-16 flex flex-col items-start"
            >
              <h1 className="font-serif font-medium text-[42px] text-[#181A18] leading-[1.1] mb-4">
                {selectedScenario.title || "Casual Campus Chiffon"}
              </h1>
              
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#181A18]/70 mb-10">
                {selectedScenario.badge}
              </p>

              <div className="flex flex-col gap-3 mb-8">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#181A18]">
                  COLOR
                </span>
                <div className="flex gap-3">
                  <span className="w-5 h-5 rounded-full border border-black/20 ring-1 ring-offset-2 ring-[#181A18]" style={{ backgroundColor: '#F0E5D8' }} />
                  <span className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: '#D4C9B3' }} />
                  <span className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: '#181A18' }} />
                </div>
              </div>

              {/* Context Badge */}
              <div className="bg-[#F8F6F2] py-3 px-4 rounded-[4px] mb-8 w-fit border border-black/5">
                <p className="font-sans text-[9px] font-semibold text-[#181A18]/80 leading-relaxed max-w-[280px]">
                  JAKARTA 33°C — TROPIS SIANG HARI —<br/>Siap tampil stylish tanpa gerah
                </p>
              </div>

              <div className="font-sans text-lg font-bold text-[#181A18] mb-8">
                RP 895.000
              </div>

              <Link
                href={\`/studio?look=\${selectedScenario.lookId}\`}
                className="w-full max-w-[320px] py-4 rounded-full border border-[#181A18] text-center font-sans text-[11px] font-bold uppercase tracking-[0.15em] text-[#181A18] hover:bg-[#181A18] hover:text-white transition-colors mb-6"
              >
                ADD TO WARDROBE
              </Link>

              <div className="flex flex-col gap-4">
                <button onClick={onOpenQuiz} className="text-left font-sans text-[11px] font-medium text-[#181A18] underline underline-offset-4 hover:text-terracotta-500 transition-colors w-fit">
                  Size Guide & Personal Color
                </button>
                <p className="font-sans text-[9px] text-[#181A18]/50 mt-4">
                  Free shipping on orders over RP 500.000 • Easy 30-day returns
                </p>
              </div>

              {/* Minimal Scenario Nav Dots (Invisible logic but user can switch) */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                 {HERO_SCENARIOS.map((sc) => (
                    <button
                      key={sc.id}
                      onClick={() => setSelectedScenario(sc)}
                      className={\`w-1.5 h-1.5 rounded-full transition-all \${selectedScenario.id === sc.id ? 'bg-[#181A18] scale-150' : 'bg-black/15 hover:bg-black/30'}\`}
                      title={sc.pillLabel}
                    />
                 ))}
              </div>

            </motion.div>
          </div>
        </div>
      </section>
`;

contentH = contentH.replace(heroDesktopRegex, newHeroDesktop.trim());
fs.writeFileSync(fileHero, contentH, 'utf8');
console.log("HeroSection Desktop responsive fix applied.");
