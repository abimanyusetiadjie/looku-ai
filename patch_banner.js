const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'src/components/ResearchBanner.tsx');
let content = fs.readFileSync(file, 'utf8');

// Import Link if missing
if (!content.includes('import Link from "next/link";')) {
  content = content.replace('import { motion, AnimatePresence } from "framer-motion";', 'import { motion, AnimatePresence } from "framer-motion";\nimport Link from "next/link";');
}

// Replace <a href="/kuesioner" with <Link href="/kuesioner"
content = content.replace(/<a(\s+href="\/kuesioner"[\s\S]*?)>([\s\S]*?)<\/a>/, '<Link$1 onClick={() => setIsVisible(false)}>$2</Link>');

// Make it show up after 15 seconds instead of 5, giving them time to explore
content = content.replace('setTimeout(() => setIsVisible(true), 5000)', 'setTimeout(() => setIsVisible(true), 15000)');

fs.writeFileSync(file, content, 'utf8');
