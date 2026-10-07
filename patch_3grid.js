const fs = require('fs');
const path = require('path');

const pageFile = path.join(process.cwd(), 'src/app/page.tsx');
let content = fs.readFileSync(pageFile, 'utf8');

const oldPhilosophySection = `{/* 4. Brand Philosophy (Replacing Massive Images) */}
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

const newGridSection = `{/* 4. Editorial 3-Grid: Curated for Tropics */}
        <section className="py-24 sm:py-32 bg-white">
           <div className="max-w-[1200px] mx-auto px-8 text-center">
              <h2 className="font-serif text-4xl sm:text-5xl text-charcoal-900 tracking-tight">
                 CURATED FOR TROPICS
              </h2>
              <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold text-charcoal-900/60 mt-4">
                 THREE ESSENTIALS FOR JAKARTA 33°C
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
                 {/* Item 1 */}
                 <div className="flex flex-col items-center">
                    <div className="w-full aspect-[4/5] border border-charcoal-900/60 overflow-hidden bg-sand-100">
                       <img src="https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=800&q=80" alt="Linen Crinkle Silhouette" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
                    </div>
                    <span className="mt-6 font-sans text-[10px] sm:text-xs uppercase tracking-widest font-bold text-charcoal-900">LINEN CRINKLE</span>
                 </div>
                 {/* Item 2 */}
                 <div className="flex flex-col items-center">
                    <div className="w-full aspect-[4/5] border border-charcoal-900/60 overflow-hidden bg-sand-100">
                       <img src="https://images.unsplash.com/photo-1620799140408-35632e1ea25c?w=800&q=80" alt="Fabric Texture" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
                    </div>
                    <span className="mt-6 font-sans text-[10px] sm:text-xs uppercase tracking-widest font-bold text-charcoal-900">ADEM & MODEST</span>
                 </div>
                 {/* Item 3 */}
                 <div className="flex flex-col items-center">
                    <div className="w-full aspect-[4/5] border border-charcoal-900/60 overflow-hidden bg-sand-100">
                       <img src="https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=800&q=80" alt="Stylish Modest" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
                    </div>
                    <span className="mt-6 font-sans text-[10px] sm:text-xs uppercase tracking-widest font-bold text-charcoal-900">STYLISH TANPA GERAH</span>
                 </div>
              </div>
           </div>
        </section>`;

// Remove the Trending Looks (The Editorial) section since user didn't request it in their "Struktur Ideal Baru"
const trendingLooksRegex = /\{\/\* 5\. The Lookbook \(Trending Looks\) \*\/\}[\s\S]*?\{\/\* 6\. Features & FAQ \*\/\}/;

content = content.replace(oldPhilosophySection, newGridSection);
content = content.replace(trendingLooksRegex, '{/* 6. Features & FAQ */}');

fs.writeFileSync(pageFile, content, 'utf8');
console.log("3-Image Editorial Grid injected and The Editorial list removed to match user's ideal structure!");
