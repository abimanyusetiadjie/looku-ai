const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'src/components/FloatingChatbot.tsx');
let content = fs.readFileSync(file, 'utf8');

const regex = /\{\/\* Mobile Pill FAB \(<640px\) \*\/\}[\s\S]*?<\/motion\.button>/;

const replacement = `{/* Mobile Pill FAB (<640px) */}
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                aria-label="Coba AI Stylist"
                className="sm:hidden h-[44px] px-4 rounded-full bg-[#181A18] text-white shadow-2xl border-2 border-white/20 flex items-center justify-center gap-2 relative shadow-glow"
              >
                <Sparkles className="w-4 h-4 text-terracotta-400" />
                <span className="font-sans font-bold text-[10px] tracking-widest uppercase">Coba AI Stylist</span>
              </motion.button>`;

content = content.replace(regex, replacement);
fs.writeFileSync(file, content, 'utf8');
