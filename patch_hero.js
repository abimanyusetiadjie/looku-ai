const fs = require('fs');
const path = require('path');

const heroFile = path.join(process.cwd(), 'src/components/HeroSection.tsx');
let content = fs.readFileSync(heroFile, 'utf8');

// 1. Add Urgency / Social Proof Pill above the title
const oldSubtitle = `<span className="font-mono text-[10px] uppercase tracking-widest font-bold text-terracotta-500">
                AI Stylist & Personal Color
              </span>`;
const newSubtitle = `<div className="inline-flex items-center gap-2 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-charcoal-900">
                  Live: 33°C Jakarta • 1,240 Look Diracik Hari Ini
                </span>
              </div>`;
content = content.replace(oldSubtitle, newSubtitle);

// 2. Add subtle animation to "The Tropical Edit."
const oldTitle = `<h1 className="font-serif text-5xl md:text-7xl lg:text-[5rem] text-charcoal-900 leading-[1.1] tracking-tight">
                The Tropical <span className="italic">Edit.</span>
              </h1>`;
const newTitle = `<motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="font-serif text-5xl md:text-7xl lg:text-[5rem] text-charcoal-900 leading-[1.1] tracking-tight"
              >
                The Tropical <span className="italic text-terracotta-700">Edit.</span>
              </motion.h1>`;
content = content.replace(oldTitle, newTitle);

// 3. Make COLOR DIAGNOSTIC button more prominent
// Current buttons in Hero:
// Link to /studio (Mulai Racik Outfit) -> bg-charcoal-900 text-white
// button (Pelajari Cara Kerjanya) -> border border-sand-300
const oldButtons = `<div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/studio"
                className="w-full sm:w-auto py-3.5 px-8 rounded-none bg-charcoal-900 hover:bg-terracotta-600 text-white font-sans font-bold text-[11px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                <span>Mulai Racik Outfit</span>
              </Link>
              <button
                className="w-full sm:w-auto py-3.5 px-8 rounded-none bg-transparent border border-sand-300 hover:border-charcoal-900 text-charcoal-900 font-sans font-bold text-[11px] uppercase tracking-widest transition-colors"
              >
                Pelajari Cara Kerjanya
              </button>
            </div>`;
const newButtons = `<div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/studio"
                className="w-full sm:w-auto py-4 px-8 rounded-none bg-charcoal-900 hover:bg-charcoal-800 text-white font-sans font-bold text-[11px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                <span>Mulai Racik Outfit</span>
              </Link>
              <button
                onClick={onOpenQuiz}
                className="w-full sm:w-auto py-4 px-8 rounded-none bg-terracotta-500 hover:bg-terracotta-600 text-white font-sans font-bold text-[11px] uppercase tracking-widest transition-colors shadow-lg shadow-terracotta-500/20 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                <span>Color Diagnostic ✦</span>
              </button>
            </div>`;
content = content.replace(oldButtons, newButtons);

fs.writeFileSync(heroFile, content, 'utf8');
console.log("HeroSection patched with animation, social proof, and prominent CTA!");
