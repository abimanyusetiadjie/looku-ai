const fs = require('fs');
const path = require('path');

const pageFile = path.join(process.cwd(), 'src/app/page.tsx');
let content = fs.readFileSync(pageFile, 'utf8');

// Find the start of Quick Discovery Hub
const startIndex = content.indexOf('{/* 4. Quick Discovery Hub');
const endIndex = content.indexOf('{/* Modals Loaded On-Demand');

if (startIndex !== -1 && endIndex !== -1) {
  const newSections = `
        {/* 4. Editorial Campaign Split */}
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
        </section>

        {/* 5. The Lookbook (Trending Looks) */}
        <section className="py-24 bg-[#FAF8F5]">
          <div className="max-w-[1400px] mx-auto px-8">
            <div className="flex items-end justify-between mb-12 border-b border-sand-300 pb-6">
              <div>
                <h2 className="font-serif text-4xl text-charcoal-900 tracking-tight">The Editorial</h2>
                <p className="font-sans text-sm text-sand-500 mt-2 uppercase tracking-widest">Curated looks for the tropics</p>
              </div>
              <Link href="/lookbook" className="font-sans text-xs font-bold uppercase tracking-widest text-charcoal-900 hover:text-terracotta-600 transition-colors pb-1 border-b border-transparent hover:border-terracotta-600">
                View Collection
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {featuredTrendingLooks.slice(0, 4).map((look) => (
                <Link key={look.id} href={\`/studio?look=\${look.outfit.id}\`} className="group flex flex-col">
                  <div className="relative aspect-[3/4] overflow-hidden bg-sand-200 mb-4">
                    <img
                      src={look.image}
                      alt={look.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white text-[9px] font-sans font-bold uppercase tracking-widest text-charcoal-900">
                        {look.tag}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-charcoal-900 group-hover:text-terracotta-600 transition-colors">{look.title}</h3>
                    <p className="text-xs font-sans text-sand-500 mt-1 uppercase tracking-widest">{look.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Features & FAQ */}
        <div className="bg-white py-12">
          <FeaturesSection />
          <FAQSection />
        </div>

        {/* 7. Final Conversion Card */}
        <section className="py-32 bg-charcoal-900 text-white">
          <div className="max-w-3xl mx-auto px-8 text-center space-y-8">
            <h2 className="font-serif text-5xl md:text-6xl font-medium tracking-tight">
              Elevate Your Everyday.
            </h2>
            <p className="font-sans text-sm md:text-base text-white/70 max-w-xl mx-auto leading-relaxed font-light tracking-wide">
              Discover your personalized style matrix with our Context-Aware AI. Tailored for the tropical climate and your unique skin tone.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/studio"
                className="w-full sm:w-auto px-10 py-4 bg-white text-charcoal-900 font-sans text-xs font-bold uppercase tracking-widest hover:bg-sand-100 transition-colors"
              >
                Enter Studio
              </Link>
              <button
                onClick={() => setIsQuizOpen(true)}
                className="w-full sm:w-auto px-10 py-4 border border-white text-white font-sans text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-charcoal-900 transition-colors"
              >
                Color Diagnostic
              </button>
            </div>
          </div>
        </section>

        {/* 8. Footer */}
        <Footer />
      </div>

      {/* Modals Loaded On-Demand - Terhubung Bersama untuk Mobile & Desktop */}
`;
  
  content = content.slice(0, startIndex) + newSections + content.slice(endIndex);
  fs.writeFileSync(pageFile, content, 'utf8');
  console.log('page.tsx patched successfully');
} else {
  console.log('Markers not found');
}
