const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/components/GeneratorForm.tsx');
let content = fs.readFileSync(file, 'utf8');

const regex = /\{\/\* EXPRESS GENERATOR \(1-TAP MODE KILAT\) \*\/\}(.|\n)*?\{\/\* Main Interactive Custom Form \(Step 1-3\) \*\/\}/g;

const newHTML = `{/* EXPRESS GENERATOR (1-TAP MODE KILAT) */}
      <div className="p-6 bg-white border border-sand-300 space-y-4 mb-6">
        <div className="flex flex-col">
          <h2 className="font-serif text-xl font-bold text-charcoal-900 leading-tight">
            Mode Kilat
          </h2>
          <p className="text-[11px] text-sand-500 font-medium">
            Pilih acara, AI langsung generate.
          </p>
        </div>

        {/* 6 Clean Express Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {expressCards.map((card, idx) => (
            <motion.button
              key={idx}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={card.action}
              title={card.subtitle}
              className="px-2 py-3 sm:px-3 sm:py-4 rounded-sm border border-sand-300 bg-sand-50/50 hover:bg-white hover:border-charcoal-900 text-center transition-all group flex flex-col items-center justify-center gap-1.5"
            >
              <div className="font-bold text-[10px] sm:text-xs text-charcoal-900 group-hover:text-charcoal-900 uppercase tracking-widest leading-tight">
                {card.title.split(" & ")[0]}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Toggle Accordion untuk Form Kustomisasi Lengkap */}
        <div className="pt-4 border-t border-sand-200 mt-2">
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className="w-full text-left text-[11px] font-bold uppercase tracking-widest text-charcoal-900 hover:text-terracotta-600 transition-colors flex items-center gap-2"
          >
            <span>+ Atur detail (kulit, hijab, budget)</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Custom Form (Step 1-3) */}`;

content = content.replace(regex, newHTML);

fs.writeFileSync(file, content, 'utf8');
console.log("Mode Kilat UI overhauled!");
