const fs = require('fs');
const path = require('path');

const pageFile = path.join(process.cwd(), 'src/app/page.tsx');
let content = fs.readFileSync(pageFile, 'utf8');

const oldSection = `{/* 4. Editorial Campaign Split */}
        <section className="py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative aspect-[4/5] bg-sand-100 overflow-hidden group cursor-pointer" onClick={() => setIsCatalogOpen(true)}>
                <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80" alt="Curated Materials" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-8 left-8 right-8">
                  <h3 className="font-serif text-3xl text-white mb-2">Curated Materials</h3>
                  <p className="font-sans text-xs uppercase tracking-widest text-white/90 font-bold mb-4">Discover Breathable Fabrics</p>
                  <div className="h-px w-12 bg-white group-hover:w-full transition-all duration-500" />
                </div>
              </div>
              <div className="relative aspect-[4/5] bg-sand-100 overflow-hidden group cursor-pointer" onClick={() => setIsQuizOpen(true)}>
                <img src="https://images.unsplash.com/photo-1550614000-4b95d8822dbe?w=800&q=80" alt="Color Intelligence" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-8 left-8 right-8">
                  <h3 className="font-serif text-3xl text-white mb-2">Color Intelligence</h3>
                  <p className="font-sans text-xs uppercase tracking-widest text-white/90 font-bold mb-4">Find Your Perfect Palette</p>
                  <div className="h-px w-12 bg-white group-hover:w-full transition-all duration-500" />
                </div>
              </div>
            </div>
          </div>
        </section>`;

const newSection = `{/* 4. Brand Philosophy (Replacing Massive Images) */}
        <section className="py-24 sm:py-32 bg-white border-y border-sand-300">
           <div className="max-w-4xl mx-auto px-8 text-center space-y-8">
              <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-terracotta-500 border border-terracotta-200 px-3 py-1 rounded-full">
                The Look.u Philosophy
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-900 leading-[1.4] tracking-tight">
                 "Pakaian terbaik bukan hanya yang terlihat indah, tapi yang mengerti <span className="italic text-terracotta-600">iklim tropis</span> dan memancarkan kilau <span className="italic text-terracotta-600">warna kulit alami</span> Anda."
              </h2>
              <div className="pt-10 flex flex-wrap justify-center gap-12 sm:gap-24 border-t border-sand-200 mt-8">
                 <div>
                    <div className="font-serif text-3xl text-charcoal-900">33°C</div>
                    <div className="font-sans text-[10px] uppercase tracking-widest font-bold text-sand-500 mt-2">Tropical Optimized</div>
                 </div>
                 <div>
                    <div className="font-serif text-3xl text-charcoal-900">100%</div>
                    <div className="font-sans text-[10px] uppercase tracking-widest font-bold text-sand-500 mt-2">Personalized</div>
                 </div>
                 <div>
                    <div className="font-serif text-3xl text-charcoal-900">AI</div>
                    <div className="font-sans text-[10px] uppercase tracking-widest font-bold text-sand-500 mt-2">Driven Precision</div>
                 </div>
              </div>
           </div>
        </section>`;

content = content.replace(oldSection, newSection);
fs.writeFileSync(pageFile, content, 'utf8');
console.log("Middle section replaced with Brand Philosophy!");
