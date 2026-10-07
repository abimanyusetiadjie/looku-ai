const fs = require('fs');
const path = require('path');

const pageFile = path.join(process.cwd(), 'src/app/page.tsx');
let content = fs.readFileSync(pageFile, 'utf8');

// Replace the dark banner with a light, elegant banner to fix the clash with the footer
const oldBanner = `<section className="py-32 bg-charcoal-900 text-white">
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
        </section>`;

const newBanner = `<section className="py-32 bg-sand-200 text-charcoal-900 border-t border-sand-300">
          <div className="max-w-3xl mx-auto px-8 text-center space-y-8">
            <h2 className="font-serif text-5xl md:text-6xl font-medium tracking-tight">
              Elevate Your Everyday.
            </h2>
            <p className="font-sans text-sm md:text-base text-charcoal-900/70 max-w-xl mx-auto leading-relaxed font-light tracking-wide">
              Discover your personalized style matrix with our Context-Aware AI. Tailored for the tropical climate and your unique skin tone.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/studio"
                className="w-full sm:w-auto px-10 py-4 bg-charcoal-900 text-white font-sans text-xs font-bold uppercase tracking-widest hover:bg-terracotta-700 transition-colors"
              >
                Enter Studio
              </Link>
              <button
                onClick={() => setIsQuizOpen(true)}
                className="w-full sm:w-auto px-10 py-4 border border-charcoal-900 text-charcoal-900 font-sans text-xs font-bold uppercase tracking-widest hover:bg-charcoal-900 hover:text-white transition-colors"
              >
                Color Diagnostic
              </button>
            </div>
          </div>
        </section>`;

content = content.replace(oldBanner, newBanner);
fs.writeFileSync(pageFile, content, 'utf8');
console.log('Fixed Footer clash with Banner!');
