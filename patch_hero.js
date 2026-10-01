const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/components/HeroSection.tsx');
let content = fs.readFileSync(file, 'utf8');

// The original HeroSection has `<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10">`
// We will replace everything from `<div className="max-w-7xl...` up to `</section>` with the 50/50 layout.

const heroSectionRegex = /<div className="max-w-7xl mx-auto[\s\S]*?<\/section>/;

const newHeroSection = `
        <div className="w-full flex min-h-[calc(100vh-80px)]">
          
          {/* Left: 50% Full Bleed Image */}
          <div className="w-1/2 relative min-h-[calc(100vh-80px)] bg-sand-100">
            <Image
              src={selectedScenario.lookId === "kuliah_hijab_panas_hemat" ? "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop" : "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&auto=format&fit=crop&q=80"}
              alt={selectedScenario.pillLabel}
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Right: 50% Content / Details */}
          <div className="w-1/2 flex items-center justify-center bg-[#FAF8F5]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-xl w-full px-12 py-16 flex flex-col items-start"
            >
              <h1 className="font-serif font-medium text-4xl xl:text-5xl text-[#181A18] leading-tight mb-3">
                {selectedScenario.title || "Casual Campus Chiffon"}
              </h1>
              
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[#181A18]/70 mb-8">
                {selectedScenario.badge}
              </p>

              {/* Minimalist Switcher */}
              <div className="w-full space-y-4 mb-8 border-t border-b border-[#E8DFD1] py-6">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#181A18] block mb-4">
                  Select Scenario
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {HERO_SCENARIOS.map((sc) => {
                    const isSelected = selectedScenario.id === sc.id;
                    return (
                      <button
                        key={sc.id}
                        onClick={() => setSelectedScenario(sc)}
                        className={\`text-left p-3 border transition-colors \${isSelected ? 'border-[#181A18] bg-[#181A18] text-white' : 'border-[#E8DFD1] hover:border-[#181A18] text-[#181A18]'}\`}
                      >
                        <div className="text-[10px] font-bold uppercase tracking-wider mb-1">{sc.pillLabel}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-4 mb-8">
                <Link
                  href={\`/studio?look=\${selectedScenario.lookId}\`}
                  className="px-8 py-3.5 border border-[#181A18] text-center font-sans text-xs font-bold uppercase tracking-widest text-[#181A18] hover:bg-[#181A18] hover:text-white transition-colors"
                >
                  Add to Wardrobe
                </Link>

                <button 
                  onClick={onOpenQuiz}
                  className="px-8 py-3.5 border border-[#E8DFD1] text-center font-sans text-xs font-bold uppercase tracking-widest text-[#181A18] hover:border-[#181A18] transition-colors"
                >
                  Personal Color
                </button>
              </div>

            </motion.div>
          </div>
        </div>
      </section>
`;

content = content.replace(heroSectionRegex, newHeroSection.trim());

fs.writeFileSync(file, content, 'utf8');
console.log("HeroSection patched successfully.");
